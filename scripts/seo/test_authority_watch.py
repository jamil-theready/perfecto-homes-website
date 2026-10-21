import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('authority_watch',Path(__file__).with_name('authority_watch.py'))
watch=importlib.util.module_from_spec(spec)
if Path(spec.origin).exists():spec.loader.exec_module(watch)
class AuthorityWatchTests(unittest.TestCase):
    def test_missing_link_is_not_called_lost_without_a_previous_verified_link(self):
        self.assertEqual(watch.link_state([],[]),'No verified placement')
        self.assertEqual(watch.link_state(['https://site.example/contact'],[]),'Potential lost link')
        self.assertEqual(watch.link_state([],['https://site.example/contact']),'Verified link')
    def test_keyword_map_preserves_actual_targets_and_anonymization_warning(self):
        rows=[{'keys':['https://site.example/services/walls','sacramento walls'],'impressions':70,'clicks':2,'position':8}]
        result=watch.keyword_map(rows)
        self.assertEqual(result['queries'][0]['current_pages'],['https://site.example/services/walls'])
        self.assertEqual(result['queries'][0]['impressions'],70)
        self.assertIn('partial',result['coverage'].lower())
if __name__=='__main__':unittest.main()
