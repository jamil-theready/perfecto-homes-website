import importlib.util
import pathlib
import tempfile
import unittest
from datetime import date

SPEC = importlib.util.spec_from_file_location('cloud_writer', pathlib.Path(__file__).with_name('cloud_writer.py'))
writer = importlib.util.module_from_spec(SPEC)
if SPEC.loader and SPEC.origin and pathlib.Path(SPEC.origin).exists():
    SPEC.loader.exec_module(writer)


class CloudWriterTests(unittest.TestCase):
    def policy(self):
        return {'client': 'rsg', 'site': 'https://rsg.example', 'blog_dir': 'content/blog',
                'market_terms': ['sacramento'], 'blocked_terms': ['perfecto', 'guaranteed'],
                'release_interval_days': 7, 'page_cooldown_days': 56}

    def test_missing_feature_fails_closed(self):
        self.assertTrue(callable(getattr(writer, 'choose_opportunity', None)))

    def test_candidate_needs_real_demand_and_current_market(self):
        rows = [{'keys': ['https://rsg.example/blog/wall', 'sacramento wall'], 'impressions': 100, 'clicks': 0, 'position': 9},
                {'keys': ['https://rsg.example/blog/other', 'peru house'], 'impressions': 1000, 'clicks': 0, 'position': 9}]
        item = writer.choose_opportunity(rows, {'wall': 'content/blog/wall.md'}, self.policy(), {}, date(2026,10,21))
        self.assertEqual(item['slug'], 'wall')

    def test_recent_release_and_page_experiment_prevent_duplicate_work(self):
        row = {'keys': ['https://rsg.example/blog/wall', 'sacramento wall'], 'impressions': 100, 'clicks': 0, 'position': 9}
        for state in [{'last_release':'2026-10-20'}, {'pages': {'wall': {'released':'2026-10-01'}}}]:
            self.assertIsNone(writer.choose_opportunity([row], {'wall':'content/blog/wall.md'}, self.policy(), state, date(2026,10,21)))

    def test_patch_preserves_everything_except_snippet_and_opening(self):
        source = '---\ntitle: "Old"\nmetaDescription: "Old desc"\ndate: "2026-01-01"\nimage: /wall.webp\n---\n\nOld opening.\n\n## Details\n\nKeep this exact body.\n'
        change = {'title':'Sacramento Wall Planning', 'description':'Plan a Sacramento wall project with clear questions about the space, materials and drainage before discussing the work with a local mason.', 'opening':'Planning a wall in Sacramento starts with the space around it. Bring photographs and your questions about materials and drainage to the conversation.'}
        patched = writer.apply_patch(source, change, self.policy())
        self.assertIn('date: "2026-01-01"\nimage: /wall.webp', patched)
        self.assertTrue(patched.endswith('## Details\n\nKeep this exact body.\n'))
        self.assertNotIn('Old opening.', patched)

    def test_unsafe_model_output_is_rejected(self):
        safe={'title':'Sacramento Wall Planning','description':'Plan a Sacramento wall project with clear questions about the space, materials and drainage before discussing the work with a local mason.','opening':'Planning a wall in Sacramento starts with a conversation about the garden and the space around it.'}
        for bad in ['Guaranteed approval in 4 days.', '<script>alert(1)</script>', 'Perfecto is our sister company.', 'We have 25 years of experience.', 'A wall over four feet generally requires a building permit in Sacramento. Confirm local rules before starting.']:
            with self.assertRaises(ValueError):
                writer.validate_change({**safe,'opening':bad}, self.policy())

    def test_abbreviations_do_not_reject_unrelated_words(self):
        policy=self.policy()
        policy['blocked_terms']=['DRE']
        change={'title':'Sacramento Wall Planning','description':'Plan a Sacramento wall project with clear questions about the space, materials and drainage before discussing the work with a local mason.','opening':'Bring the property address and photographs when discussing your Sacramento garden wall with a mason.'}
        writer.validate_change(change,policy)
        with self.assertRaises(ValueError):
            writer.validate_change({**change,'opening':'Our DRE details confirm this property is ready for immediate purchase in Sacramento.'},policy)

    def test_live_proof_requires_all_three_served_fields(self):
        change={'title':'Wall planning','description':'Planning details','opening':'A useful opening.'}
        good='<title>Wall planning | Brand</title><meta content="Planning details" name="description"><p>A useful opening.</p>'
        self.assertTrue(writer.verify_html(good, change))
        self.assertFalse(writer.verify_html(good.replace('A useful opening.','Old copy.'), change))

    def test_due_measurement_uses_live_page_data_and_never_treats_missing_rows_as_zero(self):
        state={'pages':{'wall':{'released':'2026-09-20','url':'https://rsg.example/blog/wall','baseline':{'clicks':0,'impressions':100}}}}
        pages=[{'keys':['https://rsg.example/blog/wall'],'clicks':3,'impressions':110,'position':8,'ctr':3/110}]
        self.assertTrue(writer.measure_due(state,pages,date(2026,10,21)))
        self.assertEqual(state['pages']['wall']['reviews']['28']['decision'],'keep')
        missing={'pages':{'wall':{'released':'2026-09-20','url':'https://rsg.example/blog/wall','baseline':{'clicks':2}}}}
        self.assertFalse(writer.measure_due(missing,[],date(2026,10,21)))
        self.assertNotIn('reviews',missing['pages']['wall'])


if __name__ == '__main__':
    unittest.main()
