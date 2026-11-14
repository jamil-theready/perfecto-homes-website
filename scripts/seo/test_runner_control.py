import base64
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timezone
from unittest.mock import patch
from runner_control import (PublicationBlocked, claim, cycle_id, publication_permission,
                            policy_digest, digest, restore_checkpoint, complete_cycle)


class RunnerControlTests(unittest.TestCase):
    def setUp(self):
        self.policy = {'client':'peru', 'enabled':True, 'repository':'agency/peru',
                       'blog_dir':'content/blog', 'adapters':{'metadata_pages':[]}}
        self.env = {'GITHUB_REPOSITORY':'agency/peru', 'GH_TOKEN':'secret-placeholder'}

    def response(self, value):
        return lambda *args, **kwargs: io.StringIO(json.dumps(value))

    def test_permission_is_fresh_exact_and_client_bound(self):
        for value in ['false', '', 'enabled', True, None]:
            with self.assertRaises(PublicationBlocked):
                publication_permission(self.policy, self.env, self.response({'name':'TRC_SEO_ACTIVE','value':value}))
        for value in ['true','True','TRUE']:
            self.assertTrue(publication_permission(self.policy, self.env, self.response({'name':'TRC_SEO_ACTIVE','value':value})))
        with self.assertRaises(PublicationBlocked):
            publication_permission(self.policy, {**self.env,'GITHUB_REPOSITORY':'agency/other'}, self.response({}))
        with self.assertRaises(PublicationBlocked):
            publication_permission(self.policy, {}, self.response({}))

    def test_network_or_missing_variable_fails_closed_without_secrets(self):
        def fail(*args, **kwargs):
            raise RuntimeError('secret-placeholder')
        with self.assertRaises(PublicationBlocked) as error:
            publication_permission(self.policy, self.env, fail)
        self.assertNotIn('secret-placeholder', str(error.exception))
        with self.assertRaises(PublicationBlocked):
            publication_permission(self.policy, self.env, self.response({'value':'true'}))

    def test_off_after_prepare_blocks_a_queued_publication(self):
        values = iter(['true', 'false'])
        def changing(*args, **kwargs):
            return io.StringIO(json.dumps({'name':'TRC_SEO_ACTIVE','value':next(values)}))
        self.assertTrue(publication_permission(self.policy, self.env, changing))
        with self.assertRaises(PublicationBlocked):
            publication_permission(self.policy, self.env, changing)

    def test_monthly_claim_deduplicates_manual_retry_and_keeps_off_resume_owner(self):
        when = datetime(2026,11,14,tzinfo=timezone.utc)
        with tempfile.TemporaryDirectory() as target:
            root = Path(target)
            first = claim(root, self.policy, '100', when)
            self.assertEqual(first['mode'], 'new')
            for run in ['100','101','102']:
                resumed = claim(root, self.policy, run, when)
                self.assertEqual(resumed['mode'], 'resume')
                self.assertEqual(resumed['owner_run_id'], '100')
            complete_cycle(root, self.policy, {'cycle_id':'peru:2026-11','state':'No change needed'})
            self.assertEqual(claim(root,self.policy,'103',when)['mode'],'duplicate')
            self.assertEqual(claim(root,self.policy,'104',datetime(2026,12,1,tzinfo=timezone.utc))['mode'],'new')

    def draft(self):
        candidate={'path':'content/blog/cusco.md','slug':'cusco'}
        pending=json.dumps({'cycle_id':'peru:2026-11','candidate':candidate}).encode()
        return {'client':'peru','repository':'agency/peru','cycle_id':'peru:2026-11',
                'policy_sha256':policy_digest(self.policy),'candidate':candidate,
                'files':[{'path':name,'before_sha256':None,'sha256':digest(data),
                          'data':base64.b64encode(data).decode()} for name,data in
                         [('content/blog/cusco.md',b'Checked Peru draft'),('seo/pending.json',pending)]]}

    def test_checked_artifact_restores_without_generation_and_is_idempotent(self):
        with tempfile.TemporaryDirectory() as target:
            root=Path(target)
            result=restore_checkpoint(root,self.policy,self.draft(),'peru:2026-11')
            self.assertEqual(result['candidate']['slug'],'cusco')
            restore_checkpoint(root,self.policy,self.draft(),'peru:2026-11')
            self.assertEqual((root/'content/blog/cusco.md').read_text(),'Checked Peru draft')

    def test_restore_refuses_stale_policy_other_client_or_changed_source(self):
        for key,value in [('client','other'),('cycle_id','peru:2026-10'),('policy_sha256','old')]:
            with tempfile.TemporaryDirectory() as target:
                with self.assertRaises(ValueError):
                    restore_checkpoint(Path(target),self.policy,{**self.draft(),key:value},'peru:2026-11')
        with tempfile.TemporaryDirectory() as target:
            root=Path(target)
            (root/'content/blog').mkdir(parents=True)
            (root/'content/blog/cusco.md').write_text('Newer content')
            with self.assertRaises(ValueError):
                restore_checkpoint(root,self.policy,self.draft(),'peru:2026-11')
            self.assertFalse((root/'seo/pending.json').exists())

    def test_restore_refuses_extra_path_and_hash_tampering_before_any_write(self):
        for mutate in [lambda d:d['files'].append({'path':'.env'}),
                       lambda d:d['files'][0].update(sha256='wrong'),
                       lambda d:d['candidate'].update(path='../other.md')]:
            draft=self.draft()
            mutate(draft)
            with tempfile.TemporaryDirectory() as target:
                with self.assertRaises((ValueError,KeyError)):
                    restore_checkpoint(Path(target),self.policy,draft,'peru:2026-11')
                self.assertFalse((Path(target)/'content/blog/cusco.md').exists())
