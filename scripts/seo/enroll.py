"""Create one launch handoff from the existing CLIENT.md registration.

The script uses existing account connections only. It never changes CLIENT.md,
lifecycle/scopes, credentials, forms or other clients. --apply is explicit.
"""
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
import os
from pathlib import Path
import re
from urllib.parse import urlparse
from cloud_writer import json_request
from control import status, gh


def source_registration(text, now):
    statuses=re.findall(r'<!-- TRC-STATUS\b[^>]*-->(.*?)<!-- /TRC-STATUS -->',text,re.S)
    blocks=re.findall(r'<!-- TRC-SYSTEMS v1 -->(.*?)<!-- /TRC-SYSTEMS -->',text,re.S)
    if len(statuses)!=1 or len(blocks)!=1:
        raise ValueError('One current TRC-STATUS and one TRC-SYSTEMS registration are required')
    verified=re.search(r'\*\*Verified:\*\*\s*(\d{4}-\d{2}-\d{2})',statuses[0])
    if not verified:
        raise ValueError('Current client verification date missing')
    day=datetime.fromisoformat(verified.group(1)).date()
    if not timedelta(0)<=(now.date()-day)<timedelta(days=15):
        raise ValueError('Client registration is stale or future-dated; reverify its source first')
    body=blocks[0].strip()
    match=re.fullmatch(r'```json\s*\n(.*?)\n```',body,re.S)
    config=json.loads(match.group(1) if match else body)
    if not isinstance(config,dict) or config.get('version')!=1:
        raise ValueError('Unsupported client registration')
    return config


def site_host(value):
    url=urlparse(value)
    if url.scheme!='https' or not url.hostname or url.username or url.password or url.query or url.fragment or url.port or url.path not in ['','/']:
        raise ValueError('Enrollment requires an exact HTTPS website origin')
    return url.hostname


def gsc_host(value):
    if value.startswith('sc-domain:'):
        domain=value[len('sc-domain:'):]
        if not re.fullmatch(r'[a-z0-9.-]+',domain): raise ValueError('Invalid domain property')
        return domain,True
    return site_host(value),False


def launch_plan(text,policy,now=None):
    now=now or datetime.now(timezone.utc)
    config=source_registration(text,now)
    expected=policy.get('registration_slug',policy['client'])
    if config.get('slug')!=expected:
        raise ValueError('Registered client does not match this repository policy')
    required={'website','seo','dashboard','leads','monitoring','reporting'}
    if not required.issubset(set(config.get('modules',[]))):
        raise ValueError('Complete launch scope is not registered in CLIENT.md')
    website,analytics,leads=(config.get(name,{}) for name in ['website','analytics','leads'])
    if website.get('repo')!=policy.get('repository') or site_host(website.get('url',''))!=site_host(policy.get('site','')):
        raise ValueError('Registered website/repository identity mismatch')
    if not website.get('live_verified'):
        raise ValueError('Website launch is not verified in the source registration')
    if website.get('deploy')!=policy.get('deploy_method'):
        raise ValueError('Deployment adapter does not match registration')
    reporting=policy.get('reporting',{})
    if str(analytics.get('ga4',''))!=str(reporting.get('ga4_property','')) or not str(analytics.get('ga4','')).isdigit():
        raise ValueError('Registered GA4 property does not match the existing connection')
    host=site_host(website['url'])
    for property_id in [analytics.get('gsc',''),policy.get('gsc','')]:
        domain,includes_subdomains=gsc_host(property_id)
        if host!=domain and not (includes_subdomains and host.endswith('.'+domain)):
            raise ValueError('Search Console registration does not belong to this site')
    ledger=reporting.get('lead_ledger',{})
    if not leads.get('sheet_id') or any(leads.get(key)!=ledger.get(key) for key in ['sheet_id','sheet_tab']):
        raise ValueError('Registered authoritative ledger does not match existing reporting connection')
    automation=config.get('automation',{})
    if automation.get('lifecycle') not in ['onboarding','active']:
        raise ValueError('Client lifecycle does not permit a new launch handoff')
    if any(automation.get('scopes',{}).get(scope) is not True for scope in ['monitoring','metrics_collection']):
        raise ValueError('Read-only followup scopes are not registered')
    if policy.get('enabled') is not True or not policy.get('market_terms') or not policy.get('scope'):
        raise ValueError('Existing bounded writer policy must be enrolled and authorized first')
    # Stable across status verification dates and log additions. This is a
    # machine handoff identity, not another client business-state record.
    identity={'slug':config['slug'],'repo':website['repo'],'site':website['url'].rstrip('/'),
              'ga4':str(analytics['ga4']),'gsc':analytics['gsc'],
              'sheet_id':leads['sheet_id'],'sheet_tab':leads['sheet_tab']}
    launch_id=policy['client']+':'+hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()[:16]
    return {'version':1,'client':policy['client'],'registered_slug':config['slug'],'launch_id':launch_id,
            'repo':policy['repository'],'site':policy['site'],'launched_at':now.isoformat()}


def apply_launch(plan,policy,post=json_request,github=gh,read_status=status):
    current=read_status(policy,plan['client'],plan['repo'])
    if current.get('mode')!='on':
        raise ValueError('Publishing control is Off; enrollment does not enable or bypass it')
    key=os.environ.get('SEO_STATUS_KEY')
    if not key:
        raise ValueError('Existing client status connection unavailable; no launch handoff created')
    response=post(policy['health_url'].rstrip('/')+'/launch/'+plan['client'],plan,{'Authorization':'Bearer '+key})
    if not isinstance(response,dict) or not isinstance(response.get('created'),bool):
        raise ValueError('Launch handoff response unavailable; inspect it before any dispatch')
    if not response['created']:
        return {'created':False,'launch_id':plan['launch_id'],'initial_dispatch':'Not repeated; existing launch handoff retained'}
    # The server's durable create-once marker is persisted before dispatch. An
    # ambiguous network result must not make a second model run on CLI retry.
    github(['api','--method','POST','repos/'+plan['repo']+'/actions/workflows/seo-autopilot.yml/dispatches','--input','-'],
           {'ref':'main','inputs':{'mode':'monthly','launch_id':plan['launch_id']}})
    return {'created':True,'launch_id':plan['launch_id'],'initial_dispatch':'Requested once; hosted execution still requires verification'}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--client-file',type=Path,required=True)
    parser.add_argument('--policy',type=Path,default=Path('seo/policy.json'))
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args()
    # One source read. Account connections and business truth are not reconstructed
    # from Notion, old logs or a parallel registration file.
    text=args.client_file.read_text()
    policy=json.loads(args.policy.read_text())
    plan=launch_plan(text,policy)
    print(json.dumps(apply_launch(plan,policy) if args.apply else plan,indent=2))


if __name__=='__main__': main()
