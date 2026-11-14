"""Read-only monthly Google/lead evidence. Contact rows never leave this module.

Uses the existing GCP_SA_KEY_JSON secret and the writer's installed google-auth
and requests. No notification, writer, credential creation or mutating API call.
"""
import json
import os
import re
from datetime import date, datetime, timedelta, timezone
from urllib.parse import quote
from zoneinfo import ZoneInfo


def _date(value):
    return value if isinstance(value, date) else date.fromisoformat(value)


def _timestamp(value):
    if not isinstance(value, str) or not re.fullmatch(
            r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})', value):
        return None
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        return None


def _notes_identity(notes, source):
    """The native writer has no Event ID column: it records labelled Notes.

    Duplicate labels are ambiguous because the free text Message could contain
    a delimiter. Never guess an identity from a name/contact or a partial label.
    """
    fields = {}
    for part in str(notes).split(' | '):
        label, sep, value = part.partition(': ')
        if sep:
            fields.setdefault(label.strip().lower(), []).append(value.strip())
    event, idem = fields.get('event id', []), fields.get('idempotency key', [])
    if len(event) != 1 or len(idem) != 1 or not re.fullmatch(r'[A-Za-z0-9_-]{1,160}', event[0]):
        return None
    if idem[0].lower() != (source + ':' + event[0]).lower():
        return None
    return event[0].lower()


def inspect_lead_ledger(headers, rows, grid, config, start, end,
                        timezone_name='America/Los_Angeles', row_limit=10001, column_limit=52):
    start, end = _date(start), _date(end)
    zone = ZoneInfo(timezone_name)
    out = {'source_state':'Live', 'coverage_state':'Incomplete', 'inquiry_count':None,
           'observed_non_test_count':None, 'excluded_test_spam_records':0,
           'duplicate_records':0, 'returned_records':len(rows), 'reason_codes':[],
           'window_start':str(start), 'window_end':str(end), 'timezone':timezone_name}
    reasons = set()
    if not (isinstance(grid.get('rowCount'), int) and grid['rowCount'] <= row_limit
            and isinstance(grid.get('columnCount'), int) and grid['columnCount'] <= column_limit):
        reasons.add('BOUNDED_LEDGER_READ_INCOMPLETE')
    names = [str(h).strip().lower() for h in headers]
    required = ['date','buyer name','phone','email','source','status','notes']
    if any(names.count(h) != 1 for h in required):
        out['reason_codes'] = ['UNRECOGNIZED_OR_AMBIGUOUS_MASTER_SCHEMA']
        return out
    ix = {h:names.index(h) for h in required}
    source = str(config.get('source','')).lower().strip()
    if not source:
        reasons.add('AUTHORITATIVE_SOURCE_NOT_CONFIGURED')
    since = _timestamp(config.get('coverage_since'))
    if not since or not config.get('coverage_evidence'):
        reasons.add('LEDGER_HISTORY_NOT_ATTESTED')
    elif datetime.combine(start, datetime.min.time(), zone) < since:
        reasons.add('PERIOD_BEFORE_VERIFIED_LEDGER_COVERAGE')
    domains = set(str(d).lower() for d in config.get('exclude_email_domains',[]))
    records = []
    for values in rows:
        if not isinstance(values,list):
            reasons.add('INVALID_LEDGER_ROW'); continue
        if not any(str(v).strip() for v in values): continue
        get = lambda h: str(values[ix[h]] if ix[h] < len(values) else '').strip()
        text = ' '.join(get(h) for h in ['buyer name','status','source'])
        phone = re.sub(r'\D','',get('phone'))
        excluded = (bool(re.search(r'\b(test|testing|verification|sandbox|spam|junk)\b',text,re.I))
                    or bool(re.search(r'\bTRC (?:PERFECTO (?:(?:LIVE|AUTO|MEASUREMENT|GA4) )?)?TEST\b|\bTEST ONLY\b|\btest submission\b|\bregression test\b|\bnot a real (?:inquiry|enquiry)\b',get('notes'),re.I))
                    or get('email').lower().rpartition('@')[2] in domains
                    or (len(phone) >= 10 and phone[-7:-4] == '555' and phone[-4:-2] == '01'))
        stamp = _timestamp(get('date'))
        identity = _notes_identity(get('notes'), get('source').lower())
        records.append({'stamp':stamp, 'id':identity, 'excluded':excluded,
                        'source_ok':get('source').lower() == source})
    # A marked test/spam duplicate cannot return through an unmarked copy.
    excluded_ids = {r['id'] for r in records if r['excluded'] and r['id']}
    groups = {}
    for r in records:
        if r['excluded'] or (r['id'] and r['id'] in excluded_ids):
            if r['stamp'] and start <= r['stamp'].astimezone(zone).date() <= end:
                out['excluded_test_spam_records'] += 1
            continue
        if not r['stamp']:
            reasons.add('UNDATED_OR_AMBIGUOUS_REAL_RECORD'); continue
        in_window = start <= r['stamp'].astimezone(zone).date() <= end
        if not r['id']:
            if in_window: reasons.add('MISSING_OR_AMBIGUOUS_STABLE_EVENT_ID')
            continue
        groups.setdefault(r['id'],[]).append({**r,'in_window':in_window})
    count = 0
    for group in groups.values():
        selected = [r for r in group if r['in_window']]
        if not selected: continue
        if any(not r['source_ok'] for r in group): reasons.add('UNRECOGNIZED_LEDGER_WRITER')
        if len({r['stamp'] for r in group}) != 1: reasons.add('CONFLICTING_EVENT_TIMESTAMPS')
        count += 1; out['duplicate_records'] += len(selected)-1
    out['observed_non_test_count'] = count
    out['reason_codes'] = sorted(reasons)
    if not reasons:
        out.update(coverage_state='Complete',inquiry_count=count)
    return out


def _session():
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession
    info = json.loads(os.environ['GCP_SA_KEY_JSON'])
    credentials = service_account.Credentials.from_service_account_info(info, scopes=[
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/webmasters.readonly'])
    return AuthorizedSession(credentials)


def _request(session, method, url, body=None):
    response = (session.get(url,timeout=60) if method=='GET'
                else session.post(url,json=body,timeout=60))
    if response.status_code != 200:
        # Do not propagate provider bodies: they can echo private cells or tokens.
        raise ValueError('HTTP_'+str(response.status_code))
    return response.json()


def _failure(code, count_field):
    return {'coverage_state':'Unavailable', count_field:None, 'reason_codes':[code]}


def _ga4(session, prop, start, end, cfg):
    out = {'coverage_state':'Unavailable','sessions':None,'users':None,'pageviews':None,
           'generate_lead_raw_events':None,'generate_lead_events_excluding_tests':None,
           'excluded_test_events':None,'reason_codes':[]}
    base = 'https://analyticsdata.googleapis.com/v1beta/properties/'+str(prop)
    rng = [{'startDate':str(start),'endDate':str(end)}]
    totals = _request(session,'POST',base+':runReport',{'dateRanges':rng,'metrics':[
        {'name':'sessions'},{'name':'totalUsers'},{'name':'screenPageViews'}]})
    values = (totals.get('rows') or [{}])[0].get('metricValues',[])
    if values and len(values) != 3: raise ValueError('INVALID_GA4_TOTALS')
    for i,key in enumerate(['sessions','users','pageviews']): out[key] = int(values[i]['value']) if values else 0
    out['timezone'] = totals.get('metadata',{}).get('timeZone','America/Los_Angeles')
    metadata = _request(session,'GET',base+'/metadata')
    registered = any(d.get('apiName')=='customEvent:test_submission' for d in metadata.get('dimensions',[]))
    payload = {'dateRanges':rng,'metrics':[{'name':'eventCount'}], 'limit':1000,
               'dimensionFilter':{'filter':{'fieldName':'eventName','stringFilter':{'matchType':'EXACT','value':'generate_lead'}}}}
    if registered: payload['dimensions'] = [{'name':'customEvent:test_submission'}]
    events = _request(session,'POST',base+':runReport',payload)
    rows = events.get('rows',[])
    out['generate_lead_raw_events'] = sum(int(r['metricValues'][0]['value']) for r in rows)
    incomplete = (events.get('rowCount',len(rows)) > len(rows)
                  or totals.get('metadata',{}).get('subjectToThresholding') is True
                  or events.get('metadata',{}).get('subjectToThresholding') is True
                  or bool(totals.get('metadata',{}).get('samplingMetadatas'))
                  or bool(events.get('metadata',{}).get('samplingMetadatas')))
    if incomplete: out['reason_codes'].append('GA4_THRESHOLD_SAMPLING_OR_ROW_COVERAGE')
    flag_since = cfg.get('test_flag_verified_since')
    classified = registered and flag_since and start >= _date(flag_since)
    unknown = sum(int(r['metricValues'][0]['value']) for r in rows
                  if not r.get('dimensionValues') or r['dimensionValues'][0]['value'] not in ['0','1'])
    if classified and not incomplete and not unknown:
        out['excluded_test_events'] = sum(int(r['metricValues'][0]['value']) for r in rows if r['dimensionValues'][0]['value']=='1')
        out['generate_lead_events_excluding_tests'] = sum(int(r['metricValues'][0]['value']) for r in rows if r['dimensionValues'][0]['value']=='0')
    else:
        out['reason_codes'].append('TEST_EXCLUSION_NOT_VERIFIED_FOR_FULL_WINDOW')
    out['coverage_state'] = 'Partial' if incomplete else 'Complete'
    out['lead_event_count_is_inquiry_count'] = False
    return out


def _gsc(session, site, start, end):
    body = _request(session,'POST','https://www.googleapis.com/webmasters/v3/sites/'+quote(site,safe='')+'/searchAnalytics/query',
                    {'startDate':str(start),'endDate':str(end),'dataState':'final'})
    row = (body.get('rows') or [{}])[0]
    return {'coverage_state':'Complete','clicks':int(row.get('clicks',0)),
            'impressions':int(row.get('impressions',0)), 'ctr':row.get('ctr',0),
            'average_position':row.get('position'), 'reason_codes':[],
            'basis':'Property totals; hidden query rows are not summed'}


def _ledger(session, cfg, start, end, zone):
    if not cfg.get('sheet_id') or not cfg.get('sheet_tab'):
        return _failure('AUTHORITATIVE_LEDGER_NOT_CONFIGURED','inquiry_count')
    base = 'https://sheets.googleapis.com/v4/spreadsheets/'+quote(cfg['sheet_id'],safe='')
    metadata = _request(session,'GET',base+'?fields='+quote('sheets.properties(title,gridProperties(rowCount,columnCount))',safe=''))
    tab = cfg['sheet_tab'];quoted = "'"+tab.replace("'","''")+"'!A1:AZ10001"
    body = _request(session,'GET',base+'/values/'+quote(quoted,safe='')+'?valueRenderOption=FORMATTED_VALUE')
    values = body.get('values',[])
    props = next((s['properties'] for s in metadata.get('sheets',[]) if s.get('properties',{}).get('title')==tab),{})
    return inspect_lead_ledger(values[0] if values else [],values[1:],props.get('gridProperties',{}),cfg,start,end,zone)


def collect_monthly_reporting(policy, start, end, session=None):
    """Return only aggregates/coverage; never use analytics events as real leads.

    Call with the exact completed search window from collect(). The previous
    period has the same number of inclusive dates. Coverage evidence in policy
    is a verified intake boundary, never inferred from the oldest Sheet row.
    """
    start,end = _date(start),_date(end)
    if end < start: raise ValueError('Invalid reporting window')
    previous_end = start-timedelta(days=1); previous_start = previous_end-(end-start)
    cfg = policy.get('reporting',{})
    out = {'version':1,'observed_at':datetime.now(timezone.utc).isoformat(),
           'window':{'start':str(start),'end':str(end),'previous_start':str(previous_start),'previous_end':str(previous_end)},
           'sales_count':None,'sales_state':'Unknown; no closed-sale source verified'}
    try: session = session if session is not None else _session()
    except Exception:
        out.update(google_analytics=_failure('GOOGLE_CONNECTION_UNAVAILABLE','sessions'),
                   search_console=_failure('GOOGLE_CONNECTION_UNAVAILABLE','clicks'),
                   lead_ledger=_failure('GOOGLE_CONNECTION_UNAVAILABLE','inquiry_count'))
        out['coverage']={key:'Unavailable' for key in ['google_analytics','search_console','lead_ledger']}
        return out
    prop = cfg.get('ga4_property')
    zone = cfg.get('timezone','America/Los_Angeles')
    for label,lo,hi in [('current',start,end),('previous',previous_start,previous_end)]:
        period = {}
        for key,fn,missing in [
            ('google_analytics',lambda:_ga4(session,prop,lo,hi,cfg) if prop else _failure('GA4_PROPERTY_NOT_CONFIGURED','sessions'),'sessions'),
            ('search_console',lambda:_gsc(session,policy['gsc'],lo,hi),'clicks'),
            ('lead_ledger',lambda:_ledger(session,cfg.get('lead_ledger',{}),lo,hi,zone),'inquiry_count')]:
            try: period[key] = fn()
            except Exception: period[key] = _failure('SOURCE_READ_OR_SCHEMA_UNAVAILABLE',missing)
        if label=='current': out.update(period)
        else: out['previous'] = period
    out['coverage'] = {key:out[key]['coverage_state'] for key in ['google_analytics','search_console','lead_ledger']}
    return out
