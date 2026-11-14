from datetime import date
from pathlib import Path
import tempfile
import unittest
from urllib.error import HTTPError
from seo_adapters import (apply_metadata, static_metadata, UnsupportedAdapter,
                          apply_internal_link, monthly_audit, choose_metadata)


class AdapterTests(unittest.TestCase):
    def metadata(self):
        return '''import X from "form";
export const metadata: Metadata = {
  title: "Cusco Communities and Places",
  description:
    "Explore communities in Cusco and Peru. Compare the local places before discussing your questions with the team.",
  alternates: { canonical: "/communities/peru" },
};
export default function Page() { return <Form destination="keep"/>; }
'''

    def test_static_metadata_changes_only_two_string_values(self):
        source=self.metadata()
        change={'title':'Explore Communities Around Cusco','description':'Explore the communities around Cusco in Peru and prepare your questions about each place before speaking with the team.'}
        updated=apply_metadata(source,change)
        self.assertEqual(static_metadata(updated),change)
        self.assertEqual(updated[updated.index('  alternates:'):],source[source.index('  alternates:'):])
        self.assertTrue(updated.startswith('import X from "form";'))

    def test_metadata_rejects_dynamic_and_extra_fields(self):
        for source in [self.metadata().replace('"Cusco Communities and Places"','getTitle()'),self.metadata().replace('export const metadata','const metadata')]:
            with self.assertRaises(UnsupportedAdapter):
                static_metadata(source)
        with self.assertRaises(ValueError):
            apply_metadata(self.metadata(),{'title':'Cusco','description':'Peru','canonical':'/wrong'})

    def test_link_preserves_words_and_avoids_existing_links_code_headings_and_frontmatter(self):
        rules=[{'anchor':'Sacred Valley','target':'/communities/peru'}]
        source='---\ntitle: Sacred Valley\n---\n# Sacred Valley\n\n[Already Sacred Valley](/other)\n\n```\nSacred Valley\n```\n\nExplore the Sacred Valley with your questions.\n'
        updated,links=apply_internal_link(source,rules)
        self.assertEqual(updated.replace('[Sacred Valley](/communities/peru)','Sacred Valley'),source)
        self.assertEqual(len(links),1)
        self.assertEqual(apply_internal_link(updated,rules),(updated,[]))
        html_source='---\ntitle: Cusco\n---\n<p>Explore the Sacred Valley before a visit.</p>\n'
        result,_=apply_internal_link(html_source,rules)
        self.assertIn('<a href="/communities/peru">Sacred Valley</a>',result)

    def test_unsafe_or_external_link_rules_fail_closed(self):
        for target in ['https://other.com','//other.com','//other','/contact?recipient=x','/../secret']:
            with self.assertRaises(ValueError):
                apply_internal_link('---\ntitle: Peru\n---\nSacred Valley is a place.',[{'anchor':'Sacred Valley','target':target}])

    def policy(self):
        return {'site':'https://peru.example','market_terms':['cusco'],'blog_dir':'content/blog','release_interval_days':7,'page_cooldown_days':56,
                'adapters':{'metadata_pages':[{'url':'https://peru.example/communities/peru','path':'page.tsx','adapter':'next-static-metadata','enabled':True}],
                            'internal_links':[{'anchor':'Sacred Valley','target':'/communities/peru'}],
                            'technical_checks':[{'kind':'robots','path':'/robots.txt'},{'kind':'sitemap','path':'/sitemap.xml'},{'kind':'canonical','path':'/communities/peru'}]}}

    def test_metadata_demand_gate_requires_page_totals_market_query_and_cooldown(self):
        evidence={'rows':[{'keys':['https://peru.example/communities/peru','cusco communities']}],
                  'pages':[{'keys':['https://peru.example/communities/peru'],'impressions':50,'clicks':0,'position':9}]}
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            (root/'page.tsx').write_text(self.metadata())
            self.assertEqual(choose_metadata(root,evidence,self.policy(),{},date(2026,11,14))['kind'],'service-metadata')
            for state in [{'last_release':'2026-11-13'},{'pages':{'metadata:/communities/peru':{'released':'2026-11-01'}}}]:
                self.assertIsNone(choose_metadata(root,evidence,self.policy(),state,date(2026,11,14)))
            self.assertIsNone(choose_metadata(root,{**evidence,'rows':[]},self.policy(),{},date(2026,11,14)))

    def test_monthly_audit_distinguishes_observed_issue_from_unavailable(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            (root/'page.tsx').write_text(self.metadata())
            (root/'content/blog').mkdir(parents=True)
            (root/'content/blog/cusco.md').write_text('---\ntitle: Cusco\n---\nExplore the Sacred Valley.')
            def fetch(url):
                if url.endswith('robots.txt'):
                    return 'User-agent: *\nAllow: /\nSitemap: https://peru.example/sitemap.xml'
                if url.endswith('sitemap.xml'):
                    raise HTTPError(url,404,'missing',{},None)
                return '<link rel="canonical" href="https://peru.example/communities/peru"/>'
            audit=monthly_audit(root,self.policy(),{},fetch)
            self.assertEqual(audit['coverage'],{'service_metadata':'reviewed','internal_links':'reviewed','technical_audit':'reviewed'})
            self.assertEqual(len(audit['issues']),1)
            self.assertEqual(audit['issues'][0]['reason'],'http_404')
            def unavailable(url):
                raise TimeoutError()
            audit=monthly_audit(root,self.policy(),{},unavailable)
            self.assertEqual(audit['coverage']['technical_audit'],'unavailable')

    def test_unenrolled_client_has_explicit_unsupported_coverage(self):
        with tempfile.TemporaryDirectory() as folder:
            result=monthly_audit(Path(folder),{'site':'https://other.example','blog_dir':'content/blog'},{})
        self.assertTrue(all(value=='unsupported' for value in result['coverage'].values()))
