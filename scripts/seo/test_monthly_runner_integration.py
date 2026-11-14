"""Exercise branch decisions with recorded fixtures, without Google/model/public writes."""
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from datetime import datetime, timezone
from cloud_writer import prepare, read_json, verify_html, reporting_receipt
from runner_control import claim, checkpoint, restore_checkpoint, PublicationBlocked, cycle_id


class MonthlyRunnerIntegrationTests(unittest.TestCase):
    def policy(self):
        return {'client':'peru','enabled':True,'repository':'agency/peru','site':'https://peru.example',
                'gsc':'sc-domain:peru.example','blog_dir':'content/blog','market_terms':['cusco','peru'],
                'blocked_terms':['sacramento','hatuchay'],'release_interval_days':7,'page_cooldown_days':56,
                'scope':'Peru only; no offers or unsupported facts.','voice':'Clear and factual.',
                'research_query':'Cusco community planning','coverage':[],
                'support_paths':['/communities/peru'],'conversion_path':'/contact',
                'adapters':{'metadata_pages':[],'internal_links':[{'anchor':'Sacred Valley','target':'/communities/peru'}]}}

    def fixture(self, root, policy):
        (root/'content/blog').mkdir(parents=True)
        (root/'seo').mkdir()
        (root/'seo/research.json').write_text(json.dumps({'month':datetime.now(timezone.utc).strftime('%Y-%m'),
                   'state':'Verified current sources','packet':{'query':policy['research_query']}}))
        claim(root,policy,'100')

    def stack(self, policy, evidence):
        audit={'coverage':{'service_metadata':'reviewed','internal_links':'reviewed','technical_audit':'reviewed'},'issues':[]}
        return [patch.dict(os.environ,{'GITHUB_RUN_ID':'100','GITHUB_REPOSITORY':policy['repository'],'SEO_RUN_MODE':'new'}),
                patch('cloud_writer.publication_permission',return_value=True),
                patch('cloud_writer.collect',return_value=evidence),
                patch('cloud_writer.monthly_audit',return_value=audit),
                patch('authority_watch.discover',return_value={'state':'Verified'}),
                patch('monthly_reporting.collect_monthly_reporting',return_value={'coverage':{'google_analytics':'Complete','lead_ledger':'Complete'}})]

    def run_fixture(self, root, policy, evidence, gemini=None):
        from contextlib import ExitStack
        with ExitStack() as stack:
            for context in self.stack(policy,evidence): stack.enter_context(context)
            model=stack.enter_context(patch('cloud_writer.gemini',side_effect=gemini or AssertionError('No model call expected')))
            prepare(root,policy)
            return read_json(root/'seo-evidence/result.json'),model

    def test_no_change_still_reviews_all_domains_and_saves_resumable_receipt(self):
        policy=self.policy()
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);self.fixture(root,policy)
            result,model=self.run_fixture(root,policy,{'start':'2026-10-15','end':'2026-11-11','rows':[],'pages':[]})
            self.assertIsNone(result['candidate'])
            self.assertEqual(result['coverage_state'],'complete')
            self.assertEqual(len(result['coverage']),8)
            model.assert_not_called()
            saved=read_json(root/'seo-evidence/checked-release.json')
            with tempfile.TemporaryDirectory() as restored:
                pending=restore_checkpoint(Path(restored),policy,saved,cycle_id(policy))
                self.assertIsNone(pending['candidate'])
                self.assertEqual(pending['coverage_state'],'complete')

    def test_demand_supported_metadata_changes_no_page_body(self):
        policy=self.policy()
        policy['adapters']['metadata_pages']=[{'enabled':True,'adapter':'next-static-metadata','path':'src/page.tsx','url':'https://peru.example/communities/peru'}]
        evidence={'start':'2026-10-15','end':'2026-11-11','rows':[{'keys':['https://peru.example/communities/peru','cusco places'],'impressions':50,'clicks':0,'position':10}],
                  'pages':[{'keys':['https://peru.example/communities/peru'],'impressions':50,'clicks':0,'position':10}]}
        change={'title':'Explore Communities Around Cusco in Peru','description':'Explore communities around Cusco in Peru and prepare questions about each place before discussing your plans with the local team.'}
        replies=iter([change,{'passed':True,'reason':'Supported existing metadata'}])
        def model(*args,**kwargs):
            return {'candidates':[{'content':{'parts':[{'text':json.dumps(next(replies))}]}}]}
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);self.fixture(root,policy)
            (root/'src').mkdir()
            body='export default function Page() { return <Form destination="KEEP"/>; }\n'
            (root/'src/page.tsx').write_text('export const metadata: Metadata = {\n title: "Cusco Places in Peru",\n description: "Explore communities around Cusco in Peru and plan your questions about local places before speaking with the team.",\n alternates: {canonical:"/communities/peru"},\n};\n'+body)
            result,called=self.run_fixture(root,policy,evidence,model)
            self.assertEqual(result['candidate']['kind'],'service-metadata')
            self.assertEqual(called.call_count,2)
            self.assertTrue((root/'src/page.tsx').read_text().endswith(body))
            self.assertTrue(verify_html('<title>'+change['title']+'</title><meta name="description" content="'+change['description']+'">',change))

    def test_link_only_change_reuses_existing_words_with_no_model_call(self):
        policy=self.policy()
        url=policy['site']+'/blog/cusco-guide'
        evidence={'start':'2026-10-15','end':'2026-11-11','rows':[{'keys':[url,'cusco guide'],'impressions':50,'clicks':5,'position':10}],
                  'pages':[{'keys':[url],'impressions':50,'clicks':5,'position':10}]}
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);self.fixture(root,policy)
            source='---\ntitle: "Cusco guide"\nmetaDescription: "Peru places"\n---\n\nExplore the Sacred Valley before your visit.\n'
            (root/'content/blog/cusco-guide.md').write_text(source)
            result,model=self.run_fixture(root,policy,evidence)
            self.assertEqual(result['candidate']['kind'],'internal-links')
            model.assert_not_called()
            updated=(root/'content/blog/cusco-guide.md').read_text()
            self.assertEqual(updated.replace('[Sacred Valley](/communities/peru)','Sacred Valley'),source)
            self.assertTrue(verify_html('<p>Explore the <a href="/communities/peru">Sacred Valley</a> before your visit.</p>',result['change']))
            self.assertFalse(verify_html('<a href="/communities/other">Sacred Valley</a>',result['change']))

    def test_live_off_before_prepare_prevents_all_collectors_and_models(self):
        with tempfile.TemporaryDirectory() as folder:
            with patch('cloud_writer.publication_permission',side_effect=PublicationBlocked('SEO publishing paused')), \
                 patch('cloud_writer.collect') as collect,patch('cloud_writer.gemini') as model:
                with self.assertRaises(PublicationBlocked): prepare(Path(folder),self.policy())
                collect.assert_not_called();model.assert_not_called()

    def test_health_reporting_projection_is_small_aggregate_only_and_preserves_unknown(self):
        data={'google_analytics':{'sessions':7,'generate_lead_raw_events':2,'generate_lead_events_excluding_tests':None,
                                'private_email':'do-not-project@example.com','reason_codes':['TEST_EXCLUSION_NOT_VERIFIED_FOR_FULL_WINDOW']},
              'lead_ledger':{'inquiry_count':None,'observed_non_test_count':4,'reason_codes':['LEDGER_HISTORY_NOT_ATTESTED']},
              'search_console':{'clicks':3,'impressions':90},'coverage':{'lead_ledger':'Incomplete'}}
        result=reporting_receipt(data)
        self.assertEqual(result['current']['raw_lead_events'],2)
        self.assertIsNone(result['current']['customer_lead_events'])
        self.assertIsNone(result['current']['inquiries'])
        self.assertNotIn('do-not-project',str(result))
        self.assertNotIn('observed_non_test_count',str(result))
        self.assertLess(len(json.dumps(result)),1500)

    def test_committed_pending_resume_downloads_and_preserves_original_sibling_evidence(self):
        import hashlib
        import shutil
        from runner_control import policy_digest
        policy=self.policy()
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);self.fixture(root,policy)
            source=b'---\ntitle: Cusco\n---\nExplore the [Sacred Valley](/communities/peru).\n'
            (root/'content/blog/cusco.md').write_bytes(source)
            pending={'client':'peru','cycle_id':cycle_id(policy),'policy_sha256':policy_digest(policy),
                     'run_id':'100','state':'Draft checked','cycle_state':'running',
                     'candidate':{'path':'content/blog/cusco.md','slug':'cusco','kind':'internal-links'},
                     'checked_sha256':hashlib.sha256(source).hexdigest(),
                     'change':{'links':[{'anchor':'Sacred Valley','target':'/communities/peru'}]}}
            (root/'seo/pending.json').write_text(json.dumps(pending))
            checkpoint(root,policy,pending)
            saved=(root/'seo-evidence/checked-release.json').read_bytes()
            shutil.rmtree(root/'seo-evidence')
            # Source and pending already exist on main; prior evidence exists only
            # in the original attempt artifact and would be destroyed by overwrite.
            original={name:json.dumps({'original':name}).encode() for name in
                      ['search.json','audit.json','research.json','packet.json','review.json']}
            downloads=[]
            def commands(args,**kwargs):
                if args[0]=='gh':
                    downloads.append(args)
                    dest=Path(args[args.index('--dir')+1])
                    (dest/'checked-release.json').write_bytes(saved)
                    for name,value in original.items(): (dest/name).write_bytes(value)
                    return type('Response',(),{'returncode':0})()
                return type('Response',(),{'returncode':128 if args[1]=='show' else 0,'stdout':b''})()
            with patch.dict(os.environ,{'GITHUB_RUN_ID':'100','GITHUB_REPOSITORY':policy['repository'],'SEO_RUN_MODE':'resume'}), \
                 patch('cloud_writer.publication_permission',return_value=True), \
                 patch('runner_control.subprocess.run',side_effect=commands), \
                 patch('cloud_writer.collect') as collect,patch('cloud_writer.gemini') as model:
                prepare(root,policy)
            self.assertEqual(len(downloads),1)
            collect.assert_not_called();model.assert_not_called()
            for name,value in original.items():
                self.assertEqual((root/'seo-evidence'/name).read_bytes(),value)
            self.assertEqual((root/'content/blog/cusco.md').read_bytes(),source)

    def test_duplicate_report_does_not_overwrite_or_refresh_original_receipt(self):
        from cloud_writer import main
        with patch('sys.argv',['cloud_writer.py','report']), \
             patch('cloud_writer.read_json',side_effect=[self.policy(),{'cycle_state':'duplicate','source':'Previous completed monthly cycle'}]), \
             patch('cloud_writer.json_request') as request:
            main()
        request.assert_not_called()
