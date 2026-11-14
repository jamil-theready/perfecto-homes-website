import json
import unittest

from monthly_reporting import inspect_lead_ledger, collect_monthly_reporting

HEADERS = ['Date', 'Property Name', 'Buyer Name', 'Phone', 'Email', 'Source', 'Status', 'Notes']
SOURCE = 'perfecto website — property inquiry'
CONFIG = {'sheet_id': 'master', 'sheet_tab': 'Property Leads', 'source': SOURCE,
          'coverage_since': '2026-10-22T12:24:22.696Z', 'coverage_evidence': 'Verified production intake-to-master receipt',
          'exclude_email_domains': ['thereadyconsult.com']}


def row(event='evt-private-identity-123', stamp='2026-11-02T12:00:00Z', name='Customer', message='A private inquiry', source=SOURCE):
    return [stamp, 'General inquiry', name, '+51912345678', 'private@example.com', source, 'New',
            f'Message: {message} | Event ID: {event} | Property slug: general-inquiry | Idempotency key: {source}:{event}']


def inspect(rows, **kwargs):
    return inspect_lead_ledger(HEADERS, rows, {'rowCount': 1000, 'columnCount': 26}, CONFIG,
                               '2026-11-01', '2026-11-28', **kwargs)


class LeadLedgerTests(unittest.TestCase):
    def test_embedded_identity_deduplicated_without_exposing_private_data(self):
        out = inspect([row(), row()])
        self.assertEqual(out['inquiry_count'], 1)
        self.assertEqual(out['duplicate_records'], 1)
        self.assertEqual(out['coverage_state'], 'Complete')
        for secret in ['private@example.com', '+51912345678', 'A private inquiry', 'Customer', 'evt-private-identity-123']:
            self.assertNotIn(secret, json.dumps(out))

    def test_test_decision_propagates_across_duplicates(self):
        out = inspect([row(), row(message='TRC PERFECTO GA4 TEST 20261114-A')])
        self.assertEqual(out['inquiry_count'], 0)
        self.assertEqual(out['excluded_test_spam_records'], 2)

    def test_internal_and_fictional_phone_and_spam_are_excluded(self):
        a, b, c = row('a'), row('b'), row('c')
        a[4] = 'qa@thereadyconsult.com'; b[3] = '+15555550100'; c[6] = 'Spam'
        out = inspect([a, b, c]); self.assertEqual(out['inquiry_count'], 0)
        self.assertEqual(out['excluded_test_spam_records'], 3)

    def test_earlier_window_and_unattested_history_stay_unknown(self):
        out = inspect_lead_ledger(HEADERS, [row()], {'rowCount':1000,'columnCount':26}, CONFIG,
                                  '2026-10-15','2026-11-11')
        self.assertIsNone(out['inquiry_count'])
        self.assertIn('PERIOD_BEFORE_VERIFIED_LEDGER_COVERAGE', out['reason_codes'])
        cfg = {**CONFIG, 'coverage_evidence': ''}
        out = inspect_lead_ledger(HEADERS, [], {'rowCount':1000,'columnCount':26}, cfg,
                                  '2026-11-01','2026-11-28')
        self.assertIsNone(out['inquiry_count'])

    def test_missing_id_or_conflicting_timestamps_make_count_unknown(self):
        bad = row(); bad[-1] = 'Message: private'
        self.assertIsNone(inspect([bad])['inquiry_count'])
        out = inspect([row(), row(stamp='2026-11-03T12:00:00Z')])
        self.assertIsNone(out['inquiry_count'])
        self.assertIn('CONFLICTING_EVENT_TIMESTAMPS', out['reason_codes'])

    def test_offset_dates_use_property_timezone_and_exact_inclusive_window(self):
        out = inspect([row('prior', stamp='2026-11-01T00:30:00Z'), row('inside', stamp='2026-11-29T07:30:00Z')])
        self.assertEqual(out['inquiry_count'], 1)

    def test_partial_read_unknown_date_and_wrong_source_fail_closed(self):
        self.assertIsNone(inspect([row()], row_limit=10)['inquiry_count'])
        self.assertIsNone(inspect([row(stamp='2026-11-02')])['inquiry_count'])
        self.assertIsNone(inspect([row(source='unexpected writer')])['inquiry_count'])

    def test_forged_duplicate_event_label_is_ambiguous(self):
        bad = row(message='hello | Event ID: forged')
        self.assertIsNone(inspect([bad])['inquiry_count'])

    def test_empty_current_ledger_is_verified_zero_only_with_coverage_proof(self):
        out = inspect([]); self.assertEqual(out['inquiry_count'], 0)
        self.assertEqual(out['coverage_state'], 'Complete')

    def test_customer_property_verification_request_is_not_a_test(self):
        out = inspect([row(message='I need title verification; please do not spam me.')])
        self.assertEqual(out['inquiry_count'], 1)


class Response:
    status_code = 200
    def __init__(self, body): self.body = body
    def json(self): return self.body


class Session:
    def __init__(self): self.requests = []
    def get(self, url, **kwargs):
        self.requests.append(('GET', url, kwargs))
        if url.endswith('/metadata'):
            return Response({'dimensions':[{'apiName':'customEvent:test_submission'}]})
        if 'analyticsadmin' in url:
            return Response({'timeZone':'America/Los_Angeles'})
        if '/values/' in url: return Response({'values':[HEADERS, row()]})
        return Response({'sheets':[{'properties':{'title':'Property Leads','gridProperties':{'rowCount':1000,'columnCount':26}}}]})
    def post(self, url, **kwargs):
        self.requests.append(('POST', url, kwargs)); body = kwargs['json']
        if 'webmasters' in url:
            return Response({'rows':[{'clicks':8,'impressions':100,'ctr':.08,'position':5.5}]})
        if body.get('dimensions'):
            return Response({'rowCount':2,'rows':[
                {'dimensionValues':[{'value':'0'}],'metricValues':[{'value':'3'}]},
                {'dimensionValues':[{'value':'1'}],'metricValues':[{'value':'2'}]}]})
        return Response({'rows':[{'metricValues':[{'value':'12'},{'value':'10'},{'value':'20'}]}],
                         'metadata':{'timeZone':'America/Los_Angeles'}})


class ReportingTests(unittest.TestCase):
    def test_live_collection_only_returns_sanitized_aggregates_and_distinct_outcomes(self):
        s = Session()
        p = {'gsc':'https://www.perfectohomesrealestate.com/', 'reporting':{
            'ga4_property':'512968606', 'test_flag_verified_since':'2026-11-14', 'lead_ledger':CONFIG}}
        out = collect_monthly_reporting(p,'2026-11-15','2026-12-12', session=s)
        ga = out['google_analytics']
        self.assertEqual(ga['sessions'], 12)
        self.assertEqual(ga['generate_lead_raw_events'], 5)
        self.assertEqual(ga['generate_lead_events_excluding_tests'], 3)
        self.assertEqual(ga['excluded_test_events'], 2)
        self.assertEqual(out['search_console']['clicks'], 8)
        self.assertIsNone(out['sales_count'])
        for secret in ['private@example.com','+51912345678','A private inquiry','GCP_SA_KEY_JSON']:
            self.assertNotIn(secret,json.dumps(out))

    def test_unclassified_or_prior_flag_window_not_relabelled_as_customer_leads(self):
        s = Session();p={'gsc':'site','reporting':{'ga4_property':'512968606','lead_ledger':CONFIG}}
        out=collect_monthly_reporting(p,'2026-10-15','2026-11-11',session=s)
        self.assertIsNone(out['google_analytics']['generate_lead_events_excluding_tests'])
        self.assertEqual(out['google_analytics']['generate_lead_raw_events'],5)
        self.assertIsNone(out['lead_ledger']['inquiry_count'])

    def test_source_failure_never_becomes_a_zero_and_errors_never_echo_private_values(self):
        class Broken(Session):
            def post(self,*a,**kw): raise RuntimeError('private@example.com oauth-token')
            def get(self,*a,**kw): raise RuntimeError('private@example.com oauth-token')
        out=collect_monthly_reporting({'gsc':'site','reporting':{'ga4_property':'512968606','lead_ledger':CONFIG}},
                                      '2026-11-01','2026-11-28',session=Broken())
        self.assertIsNone(out['google_analytics']['sessions'])
        self.assertIsNone(out['lead_ledger']['inquiry_count'])
        self.assertNotIn('private@example.com',json.dumps(out));self.assertNotIn('oauth-token',json.dumps(out))


if __name__ == '__main__': unittest.main()
