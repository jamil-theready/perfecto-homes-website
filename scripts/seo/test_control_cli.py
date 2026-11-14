import json
from unittest.mock import patch
import unittest
from control import change, ControlError


class ControlCliTests(unittest.TestCase):
    def policy(self): return {'client':'peru','repository':'agency/peru','enabled':True}

    def service(self,active=True,brake=True,fail_cancel=False,fail_variable=False,pending_cancel=False):
        current={'state':'active' if active else 'disabled_manually','brake':brake,'calls':[],'cancelled':[]}
        def gh(args,body=None):
            method=args[args.index('--method')+1] if '--method' in args else 'GET'
            path=next(value for value in args if value.startswith('repos/'))
            current['calls'].append((method,path,body))
            if path.endswith('/disable'):
                current['state']='disabled_manually';return None
            if path.endswith('/enable'):
                current['state']='active';return None
            if path.endswith('/cancel'):
                if fail_cancel: raise ControlError('cancel denied')
                current['cancelled'].append(path.split('/')[-2]);return None
            if path.endswith('/actions/variables/TRC_SEO_ACTIVE'):
                if method=='PATCH':
                    if fail_variable: raise ControlError('legacy brake update failed')
                    current['brake']=body['value']=='true';return None
                return {'name':'TRC_SEO_ACTIVE','value':str(current['brake'])}
            if '/runs?' in path:
                return [{'workflow_runs':[{'id':11,'status':'queued'},{'id':12,'status':'in_progress'},{'id':13,'status':'completed'}]}]
            if '/actions/runs/' in path:
                return {'status':'completed' if path.split('/')[-1] in current['cancelled'] and not pending_cancel else 'queued'}
            if path.endswith('/actions/workflows/seo-autopilot.yml'):
                return {'path':'.github/workflows/seo-autopilot.yml','state':current['state']}
            raise AssertionError(path)
        return current,gh

    def test_off_disables_before_legacy_update_and_cancels_queued_and_running(self):
        state,gh=self.service()
        with patch('control.gh',side_effect=gh): result=change(self.policy(),'peru','agency/peru','off')
        mutations=[row for row in state['calls'] if row[0]!='GET']
        self.assertTrue(mutations[0][1].endswith('/disable'))
        self.assertEqual(mutations[1][2]['value'],'false')
        self.assertEqual(state['cancelled'],['11','12'])
        self.assertEqual(result['mode'],'off')
        self.assertEqual(result['cancellation_requests'],2)

    def test_on_cancels_old_work_then_sets_initial_brake_before_enable(self):
        state,gh=self.service(active=False,brake=False)
        with patch('control.gh',side_effect=gh): result=change(self.policy(),'peru','agency/peru','on')
        mutations=[row for row in state['calls'] if row[0]!='GET']
        true_at=next(i for i,row in enumerate(mutations) if row[2] and row[2].get('value')=='true')
        enable_at=next(i for i,row in enumerate(mutations) if row[1].endswith('/enable'))
        self.assertLess(true_at,enable_at)
        self.assertTrue(all(i<enable_at for i,row in enumerate(mutations) if row[1].endswith('/cancel')))
        self.assertEqual(result['mode'],'on')
        self.assertEqual(state['cancelled'],['11','12'])

    def test_already_on_is_idempotent_and_never_cancels_valid_running_work(self):
        state,gh=self.service()
        with patch('control.gh',side_effect=gh): result=change(self.policy(),'peru','agency/peru','on')
        self.assertEqual(result['mode'],'on')
        self.assertFalse(any(row[0]!='GET' for row in state['calls']))

    def test_failed_cancel_prevents_enable_and_leaves_primary_control_off(self):
        state,gh=self.service(active=False,brake=False,fail_cancel=True)
        with patch('control.gh',side_effect=gh):
            with self.assertRaises(ControlError): change(self.policy(),'peru','agency/peru','on')
        self.assertEqual(state['state'],'disabled_manually')
        self.assertFalse(state['brake'])
        self.assertFalse(any(row[1].endswith('/enable') for row in state['calls']))

    def test_legacy_update_failure_still_cancels_runs_after_primary_disable(self):
        state,gh=self.service(fail_variable=True)
        with patch('control.gh',side_effect=gh):
            with self.assertRaises(ControlError): change(self.policy(),'peru','agency/peru','off')
        self.assertEqual(state['state'],'disabled_manually')
        self.assertEqual(state['cancelled'],['11','12'])

    def test_exact_client_repo_binding_and_disabled_policy_prevent_mutations(self):
        with patch('control.gh') as gh:
            for client,repo,policy in [('other','agency/peru',self.policy()),('peru','agency/other',self.policy()),
                                       ('peru','agency/peru',{**self.policy(),'enabled':False})]:
                with self.assertRaises(ControlError): change(policy,client,repo,'on')
            gh.assert_not_called()

    def test_accepted_but_still_running_cancel_cannot_race_with_enabling(self):
        state,gh=self.service(active=False,brake=False,pending_cancel=True)
        with patch('control.gh',side_effect=gh):
            with self.assertRaisesRegex(ControlError,'cancellation is pending'):
                change(self.policy(),'peru','agency/peru','on')
        self.assertEqual(state['state'],'disabled_manually')
        self.assertFalse(state['brake'])
        self.assertFalse(any(row[1].endswith('/enable') for row in state['calls']))
