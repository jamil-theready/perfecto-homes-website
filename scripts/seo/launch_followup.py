"""One read-only post-handoff diagnostic, separate from monthly writing/dedup."""
import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
from urllib.request import Request, urlopen
from cloud_writer import json_request, reporting_receipt, save_json
from monthly_reporting import collect_monthly_reporting
from seo_adapters import monthly_audit


def stamp(value):
    if not isinstance(value,str): raise ValueError('Launch timestamp missing')
    parsed=datetime.fromisoformat(value.replace('Z','+00:00'))
    if parsed.tzinfo is None: raise ValueError('Launch timestamp must include its timezone')
    return parsed.astimezone(timezone.utc)


def fetch_launches(policy):
    request=Request(policy['health_url'],headers={'Cache-Control':'no-cache','User-Agent':'TRC-Launch-Followup/1.0'})
    with urlopen(request,timeout=30) as response:
        value=response.read(1_000_001)
        if len(value)>1_000_000: raise ValueError('Launch registry response exceeds limit')
        return json.loads(value)


def eligible_launch(policy,launch_id,data,now):
    if not re.fullmatch(re.escape(policy['client'])+r':[a-f0-9]{16}',launch_id):
        raise ValueError('Launch identity does not belong to this client')
    launches=data.get('launches',[]) if isinstance(data,dict) else []
    rows=[row for row in launches if isinstance(row,dict) and row.get('client')==policy['client'] and row.get('launch_id')==launch_id]
    if len(rows)!=1: raise ValueError('Exact launch handoff unavailable or ambiguous')
    launch=rows[0]
    launched,due,deadline=(stamp(launch.get(name)) for name in ['launched_at','followup_due_at','followup_deadline'])
    if due!=launched+timedelta(days=7) or deadline!=launched+timedelta(days=14):
        raise ValueError('Launch followup schedule does not match the verified handoff')
    if not due<=now<=deadline:
        raise ValueError('Read-only followup is outside its seven-to-fourteen-day window')
    return launch


def run_followup(root,policy,launch_id,now=None,read_registry=fetch_launches,
                 collect=collect_monthly_reporting,audit=monthly_audit,post=json_request):
    now=now or datetime.now(timezone.utc)
    if policy.get('enabled') is not True or os.environ.get('GITHUB_REPOSITORY')!=policy.get('repository'):
        raise ValueError('Followup repository/client policy mismatch')
    launch=eligible_launch(policy,launch_id,read_registry(policy),now)
    run_id=os.environ.get('GITHUB_RUN_ID','')
    if not re.fullmatch(r'\d+',run_id): raise ValueError('Hosted followup run identity required')
    key=os.environ.get('SEO_STATUS_KEY')
    if not key: raise ValueError('Existing followup status connection unavailable')
    # GSC is delayed: this is an early diagnostic of the available completed
    # dates after handoff, not a fabricated full-seven-day attribution result.
    start=stamp(launch['launched_at']).date()
    end=(now-timedelta(days=3)).date()
    if end<start: raise ValueError('No completed post-handoff source window yet')
    failures=0
    try:
        reporting=collect(policy,str(start),str(end))
    except Exception:
        reporting={'coverage':{area:'Unavailable' for area in ['search_console','google_analytics','lead_ledger']}}
        failures+=1
    try:
        checked=audit(root,policy,{})
    except Exception:
        checked={'coverage':{'technical_audit':'unavailable'},'issues':[]}
        failures+=1
    coverage={area:'reviewed' if reporting.get('coverage',{}).get(area)=='Complete' else 'unavailable'
              for area in ['search_console','google_analytics','lead_ledger']}
    coverage['technical_audit']=checked.get('coverage',{}).get('technical_audit','unsupported')
    issues=len(checked.get('issues',[]))
    state='failed' if failures==2 else 'complete' if issues==0 and all(value=='reviewed' for value in coverage.values()) else 'partial'
    receipt={'version':1,'client':policy['client'],'launch_id':launch_id,'at':now.isoformat(),
             'run_id':run_id,'state':state,'coverage':coverage,'issue_count':issues,
             'window_start':str(start),'window_end':str(end),'reporting':reporting_receipt(reporting)}
    target=root/'seo-followup-evidence'
    save_json(target/'audit.json',checked)
    save_json(target/'reporting.json',reporting)
    save_json(target/'result.json',receipt)
    (target/'summary.md').write_text('\n\n'.join([
        '# Read-only launch followup','Handoff: '+launch_id,'Observed: '+now.isoformat(),
        'Completed source dates after handoff: '+str(start)+' to '+str(end),
        'Result: '+state,'Observed site issues: '+str(issues),
        'This early diagnostic cannot establish a causal SEO effect. Missing history remains unknown.',
        'No model generation, content edit, publication, form submission or monthly claim was performed.',
        json.dumps(receipt,indent=2)])+'\n')
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as handle: handle.write((target/'summary.md').read_text())
    post(policy['health_url'].rstrip('/')+'/followup/'+policy['client'],receipt,{'Authorization':'Bearer '+key})
    return receipt


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--launch-id',required=True)
    args=parser.parse_args()
    root=Path.cwd();policy=json.loads((root/'seo/policy.json').read_text())
    result=run_followup(root,policy,args.launch_id)
    print(json.dumps({'client':result['client'],'state':result['state'],'issue_count':result['issue_count']}))


if __name__=='__main__': main()
