import unittest
from datetime import date
from cloud_writer import research_due, execution_summary


class MonthlySummaryTests(unittest.TestCase):
    def test_research_refreshes_monthly_and_for_a_changed_question_or_failed_packet(self):
        old = {'month':'2026-11','state':'Verified current sources','packet':{'query':'cusco question'}}
        self.assertFalse(research_due(old,date(2026,11,20),'cusco question'))
        self.assertTrue(research_due(old,date(2026,12,1),'cusco question'))
        self.assertTrue(research_due(old,date(2026,11,20),'another question'))
        self.assertTrue(research_due({**old,'state':'Research needs repair'},date(2026,11,20),'cusco question'))

    def test_summary_distinguishes_no_change_and_published_fields_without_private_queries(self):
        search = {'start':'2026-10-15','end':'2026-11-11','rows':[{'keys':['/blog/example','private query']}],'pages':[{}]}
        summary=execution_summary({'state':'No change needed','new_article_decision':'No uncovered qualifying demand'}, search)
        self.assertEqual(summary['change_kind'],'none')
        self.assertEqual(summary['query_count'],1)
        self.assertNotIn('private query',str(summary))
        summary=execution_summary({'state':'Shipped and verified','candidate':{'kind':'article','url':'https://example.com/blog/a'},'change':{'title':'a','description':'b','opening':'c'}},search)
        self.assertEqual(summary['change_kind'],'new article')
        self.assertEqual(summary['candidate_url'],'https://example.com/blog/a')
        self.assertEqual(summary['edited_fields'],['title','description','opening','body'])


if __name__=='__main__':
    unittest.main()
