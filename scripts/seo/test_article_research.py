import importlib.util
from pathlib import Path
import tempfile
import unittest
from datetime import date

spec=importlib.util.spec_from_file_location('article_research',Path(__file__).with_name('article_research.py'))
research=importlib.util.module_from_spec(spec)
if Path(spec.origin).exists():
    spec.loader.exec_module(research)

class ResearchTests(unittest.TestCase):
    def test_search_output_with_preface_or_citations_preserves_json(self):
        self.assertEqual(research.parse_model_json('Research follows:\n```json\n{"comparison":[],"original_value":"x"}\n```\nSources [one]'),{'comparison':[],'original_value':'x'})

    def policy(self):
        return {'market_terms':['sacramento'],'blocked_terms':['peru'],'site':'https://example.com','blog_dir':'content/blog','article_author':'Test Business','article_category':'Planning','article_media':{'path':'/images/stock/wall.webp','source_url':'https://www.pexels.com/photo/wall-123/','photographer':'Test photographer','alt':'Illustrative stone texture with carefully fitted joints','status':'stock'}}

    def test_new_article_needs_uncovered_informational_demand(self):
        rows=[{'keys':['https://example.com/','how to plan a sacramento garden wall'],'impressions':35,'position':15,'clicks':0}]
        gap=research.choose_gap(rows,[],[],self.policy(),{},date(2026,10,21))
        self.assertEqual(gap['query'],'how to plan a sacramento garden wall')
        self.assertIsNone(research.choose_gap(rows,['Sacramento garden wall planning guide'],[],self.policy(),{},date(2026,10,21)))

    def test_wrong_market_regulated_and_low_demand_queries_do_not_publish(self):
        for query,impressions in [('how to plan peru garden walls',100),('sacramento retaining wall permit requirements',100),('how to plan sacramento garden walls',2)]:
            rows=[{'keys':['https://example.com/',query],'impressions':impressions,'position':20,'clicks':0}]
            self.assertIsNone(research.choose_gap(rows,[],[],self.policy(),{},date(2026,10,21)))

    def test_dead_library_and_monthly_cap_block_new_posts(self):
        rows=[{'keys':['https://example.com/','how to plan a sacramento garden wall'],'impressions':35,'position':15,'clicks':0}]
        totals=[{'keys':['https://example.com/blog/post'+str(i)],'clicks':0} for i in range(5)]
        self.assertIsNone(research.choose_gap(rows,[],totals,self.policy(),{},date(2026,10,21)))
        state={'pages':{'a':{'kind':'article','released':'2026-10-02'},'b':{'kind':'article','released':'2026-10-10'}}}
        self.assertIsNone(research.choose_gap(rows,[],[],self.policy(),state,date(2026,10,21)))

    def test_research_requires_independent_current_sources_and_comparison(self):
        packet={'query':'garden walls','sources':[{'url':'https://one.gov/a','accessed':'2026-10-21'},{'url':'https://two.org/b','accessed':'2026-10-21'}],'comparison':[{'url':'https://a.example','angle':'a','weakness':'x'},{'url':'https://b.example','angle':'b','weakness':'y'},{'url':'https://c.example','angle':'c','weakness':'z'}],'original_value':'A practical planning checklist for this buyer question','conversion':'/contact','image':self.policy()['article_media']}
        for source in packet['sources']:source['accessed']=str(date.today())
        research.validate_packet(packet)
        with self.assertRaises(ValueError):
            research.validate_packet({**packet,'sources':packet['sources'][:1]})

    def test_public_fetch_refuses_local_and_credential_urls(self):
        for url in ['http://example.com','https://127.0.0.1/x','https://169.254.169.254/x','https://user:secret@example.com','file:///etc/passwd']:
            with self.assertRaises(ValueError):
                research.validate_public_url(url)

    def test_article_render_uses_fixed_identity_media_and_supported_links(self):
        packet={'sources':[{'url':'https://one.gov/a'},{'url':'https://two.org/b'}],'image':self.policy()['article_media'],'conversion':'/contact'}
        body='## Understand the space\n\n'+('Discuss the garden and the way the space will be used. '*35)+'\n\n## Compare your options\n\nRead [official guidance](https://one.gov/a) and [material guidance](https://two.org/b).\n\n## Plan the conversation\n\n[Request a consultation](/contact).'
        article={'title':'Planning a Sacramento Garden Wall','description':'Plan a Sacramento garden wall with a practical checklist for your space, materials and the questions to discuss before work begins.','opening':'Start by thinking about how the garden will be used and what the wall needs to do.','body':body,'quickAnswer':'Begin with a clear picture of the space and the questions you want to discuss.','keyTakeaways':['Discuss the space before choosing materials.'],'faq':[]}
        result=research.render_article(article,'sacramento-garden-wall',self.policy(),packet,date(2026,10,21))
        self.assertIn('author: "Test Business"',result)
        self.assertIn('Stock illustration',result)
        self.assertIn('image: "/images/stock/wall.webp"',result)
        with self.assertRaises(ValueError):
            research.render_article({**article,'body':body+'<script>bad()</script>'},'safe',self.policy(),packet,date(2026,10,21))

if __name__=='__main__':unittest.main()
