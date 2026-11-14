from datetime import datetime,timedelta,timezone
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock,patch
from enroll import launch_plan,apply_launch
from launch_followup import eligible_launch,run_followup


NOW=datetime(2026,11,14,12,tzinfo=timezone.utc)


class LaunchHandoffTests(unittest.TestCase):
    def policy(self):
        return {'enabled':True,'client':'peru','registration_slug':'peru-homes','repository':'agency/peru',
                'site':'https://www.peru.example','gsc':'sc-domain:peru.example','deploy_method':'git',
                'market_terms':['cusco'],'scope':'Approved Peru only, no listing/routing edits.',
                'health_url':'https://health.example','reporting':{'ga4_property':'123',
                    'lead_ledger':{'sheet_id':'master-id','sheet_tab':'Property Leads'}}}

    def config(self):
        return {'version':1,'slug':'peru-homes','modules':['website','seo','dashboard','leads','monitoring','reporting'],
                'website':{'url':'https://www.peru.example','repo':'agency/peru','deploy':'git','live_verified':True},
                'analytics':{'ga4':'123','gsc':'https://www.peru.example/'},
                'leads':{'sheet_id':'master-id','sheet_tab':'Property Leads'},
                'automation':{'lifecycle':'onboarding','scopes':{'monitoring':True,'metrics_collection':True}}}

    def text(self,config=None,verified='2026-11-14'):
        return '<!-- TRC-STATUS v1 | current -->\n> **Verified:** '+verified+'\n<!-- /TRC-STATUS -->\n<!-- TRC-SYSTEMS v1 -->\n```json\n'+json.dumps(config or self.config())+'\n```\n<!-- /TRC-SYSTEMS -->\nHistorical log: wrong repo, old domain, old account.'

    def launch(self):
        plan=launch_plan(self.text(),self.policy(),NOW)
        return {**plan,'followup_due_at':(NOW+timedelta(days=7)).isoformat(),
                'followup_deadline':(NOW+timedelta(days=14)).isoformat()}

    def test_single_registered_source_binds_real_identities_without_activating_lifecycle(self):
        plan=launch_plan(self.text(),self.policy(),NOW)
        self.assertEqual(set(plan),{'version','client','registered_slug','launch_id','repo','site','launched_at'})
        self.assertEqual(plan['repo'],'agency/peru')
        self.assertNotIn('master-id',json.dumps(plan))
        self.assertNotIn('client_file',plan)
        self.assertEqual(plan['launch_id'],launch_plan(self.text()+'\nMore history',self.policy(),NOW+timedelta(days=1))['launch_id'])

    def test_stale_ambiguous_missing_or_other_account_registration_fails_closed(self):
        for text in [self.text(verified='2026-10-01'),self.text()+self.text(),self.text().replace('TRC-SYSTEMS v1','UNKNOWN')]:
            with self.assertRaises(ValueError): launch_plan(text,self.policy(),NOW)
        for group,key,value in [('website','repo','agency/other'),('analytics','ga4','999'),('analytics','gsc','sc-domain:other.example'),
                                 ('leads','sheet_id','other-master'),('automation','lifecycle','paused_billing')]:
            cfg=self.config();cfg[group][key]=value
            with self.assertRaises(ValueError): launch_plan(self.text(cfg),self.policy(),NOW)

    def test_launch_create_once_dispatches_only_first_handoff_with_structured_inputs(self):
        plan=launch_plan(self.text(),self.policy(),NOW)
        post=Mock(side_effect=[{'created':True},{'created':False}]);dispatch=Mock();state=Mock(return_value={'mode':'on'})
        with patch.dict(os.environ,{'SEO_STATUS_KEY':'placeholder'}):
            first=apply_launch(plan,self.policy(),post,dispatch,state)
            second=apply_launch(plan,self.policy(),post,dispatch,state)
        self.assertTrue(first['created']);self.assertFalse(second['created'])
        self.assertEqual(dispatch.call_count,1)
        args,body=dispatch.call_args.args
        self.assertIn('/actions/workflows/seo-autopilot.yml/dispatches',args[3])
        self.assertEqual(body,{'ref':'main','inputs':{'mode':'monthly','launch_id':plan['launch_id']}})
        self.assertEqual(post.call_args.args[0],'https://health.example/launch/peru')

    def test_off_or_missing_connection_never_creates_or_dispatches_handoff(self):
        plan=launch_plan(self.text(),self.policy(),NOW)
        post,dispatch=Mock(),Mock()
        with self.assertRaises(ValueError): apply_launch(plan,self.policy(),post,dispatch,lambda *a:{'mode':'off'})
        with patch.dict(os.environ,{},clear=True):
            with self.assertRaises(ValueError): apply_launch(plan,self.policy(),post,dispatch,lambda *a:{'mode':'on'})
        post.assert_not_called();dispatch.assert_not_called()

    def test_followup_due_is_exact_seven_to_fourteen_days_after_new_handoff(self):
        launch=self.launch();data={'launches':[launch]}
        eligible_launch(self.policy(),launch['launch_id'],data,NOW+timedelta(days=7))
        for at in [NOW+timedelta(days=6),NOW+timedelta(days=15)]:
            with self.assertRaises(ValueError): eligible_launch(self.policy(),launch['launch_id'],data,at)
        with self.assertRaises(ValueError): eligible_launch(self.policy(),launch['launch_id'],{'launches':[launch,launch]},NOW+timedelta(days=7))
        with self.assertRaises(ValueError): eligible_launch(self.policy(),'other:'+launch['launch_id'].split(':')[1],data,NOW+timedelta(days=7))

    def test_readonly_followup_collects_completed_days_and_never_touches_monthly_claim_or_model(self):
        launch=self.launch();collect=Mock(return_value={'coverage':{name:'Complete' for name in ['google_analytics','search_console','lead_ledger']}})
        audit=Mock(return_value={'coverage':{'technical_audit':'reviewed'},'issues':[]});post=Mock()
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'seo').mkdir();(root/'seo/runner.json').write_text('monthly claim stays exact')
            with patch.dict(os.environ,{'GITHUB_REPOSITORY':'agency/peru','GITHUB_RUN_ID':'100','SEO_STATUS_KEY':'placeholder'}),patch('cloud_writer.gemini') as model:
                receipt=run_followup(root,self.policy(),launch['launch_id'],NOW+timedelta(days=7),lambda p:{'launches':[launch]},collect,audit,post)
            self.assertEqual(receipt['state'],'complete')
            self.assertEqual((root/'seo/runner.json').read_text(),'monthly claim stays exact')
            self.assertFalse((root/'seo-evidence').exists())
            self.assertEqual(collect.call_args.args[1:],('2026-11-14','2026-11-18'))
            self.assertEqual(post.call_args.args[0],'https://health.example/followup/peru')
            self.assertTrue((root/'seo-followup-evidence/summary.md').exists())
            model.assert_not_called()

    def test_unavailable_history_or_site_issue_stays_partial_not_false_zero(self):
        launch=self.launch();post=Mock()
        reporting={'coverage':{'google_analytics':'Complete','search_console':'Complete','lead_ledger':'Incomplete'},'lead_ledger':{'inquiry_count':None}}
        with tempfile.TemporaryDirectory() as folder,patch.dict(os.environ,{'GITHUB_REPOSITORY':'agency/peru','GITHUB_RUN_ID':'100','SEO_STATUS_KEY':'placeholder'}):
            receipt=run_followup(Path(folder),self.policy(),launch['launch_id'],NOW+timedelta(days=7),lambda p:{'launches':[launch]},lambda *a:reporting,
                                  lambda *a:{'coverage':{'technical_audit':'reviewed'},'issues':[{'kind':'sitemap'}]},post)
        self.assertEqual(receipt['state'],'partial')
        self.assertIsNone(receipt['reporting']['current']['inquiries'])
        self.assertEqual(receipt['issue_count'],1)
