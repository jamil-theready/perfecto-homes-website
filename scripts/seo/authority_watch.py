"""Public mention/link research, not a comprehensive paid backlink index or outreach."""
from datetime import date
import json
import re
from urllib.parse import urlparse
from article_research import fetch_source

def link_state(previous,current):
    return 'Verified link' if current else 'Potential lost link' if previous else 'No verified placement'

def keyword_map(rows):
    queries={}
    for row in rows:
        page,query=row['keys'][:2]
        item=queries.setdefault(query,{'query':query,'current_pages':[],'impressions':0,'clicks':0})
        if page not in item['current_pages']:item['current_pages'].append(page)
        item['impressions']+=row.get('impressions',0)
        item['clicks']+=row.get('clicks',0)
    return {'coverage':'Partial: Google withholds low-volume queries. Current page ownership, not external search-volume estimates.','queries':sorted(queries.values(),key=lambda x:-x['impressions'])[:100]}

def discover(policy,api,previous):
    month=str(date.today())[:7]
    week=list(date.today().isocalendar()[:2])
    if previous.get('month')==month and previous.get('state')=='Public research completed':
        if previous.get('checked_week')==week:return previous
        for row in previous.get('opportunities',[]):
            try:
                source=fetch_source(row['source_url'],target_site=policy['site'])
                current=source.get('target_links',[])
                row['state']=link_state(row.get('verified_targets',[]),current)
                row['verified_targets']=current
                row['accessed']=source['accessed']
            except Exception:row['state']='Source unavailable; not classified as a lost link'
        return {**previous,'checked_week':week,'checked':str(date.today())}
    prompt='Use Google Search now to find public third-party mentions of the exact business '+policy['article_author']+' at '+policy['site']+' in its actual market '+', '.join(policy['market_terms'])+'. Look only for relevant mentions, real local associations or supplier resources. No paid links, swaps, bulk directories or outreach. Give source citations. Do not confuse another business or geographic market with this one. This is public opportunity research, not a comprehensive backlink index.'
    response=api({'contents':[{'parts':[{'text':prompt}]}],'tools':[{'google_search':{}}],'generationConfig':{'maxOutputTokens':1500,'temperature':0,'thinkingConfig':{'thinkingBudget':0}}})
    chunks=response.get('candidates',[{}])[0].get('groundingMetadata',{}).get('groundingChunks',[])
    urls=[row['web']['uri'] for row in chunks if row.get('web',{}).get('uri')]
    if not urls and not response.get('candidates',[{}])[0].get('groundingMetadata',{}).get('webSearchQueries'):
        raise ValueError('Public authority search did not provide an executed-search receipt')
    opportunities=[]
    old={row['source_url']:row for row in previous.get('opportunities',[])}
    for url in urls[:6]:
        try:
            source=fetch_source(url,target_site=policy['site'],business_name=policy['article_author'])
            if urlparse(source['url']).hostname.removeprefix('www.')==urlparse(policy['site']).hostname.removeprefix('www.'):continue
            if not source.get('business_mentioned'):continue
            if not any(term.lower() in source['excerpt'].lower() for term in policy['market_terms']):continue
            if any(re.search(r'\b'+re.escape(term)+r'\b',source['excerpt'],re.I) for term in policy['blocked_terms']):continue
            current=source.get('target_links',[])
            earlier=old.get(source['url'],{}).get('verified_targets',[])
            opportunities.append({'source_url':source['url'],'accessed':source['accessed'],'state':link_state(earlier,current),'verified_targets':current,'target':policy['site'],'rationale':'Exact business mention verified on the fetched public source','risk':'Research only; verify audience and editorial suitability before any relationship or request','outreach':'Not sent'})
        except Exception:continue
    return {'month':month,'state':'Public research completed','coverage':'Public search only. A full backlink index and historical referring-domain totals are unavailable; no link count or earned placement is inferred.','opportunities':opportunities,'searched_sources':len(urls),'checked':str(date.today()),'checked_week':week,'outreach':'Disabled; no automatic messages or submissions'}
