/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.perfectohomesrealestate.com",
  generateRobotsTxt: true,
  // Static export: postbuild runs AFTER out/ is generated, so writing to the
  // default public/ left out/sitemap.xml and out/robots.txt one build stale.
  // Write straight into the deployed directory instead.
  outDir: "out",
  changefreq: "weekly",
  priority: 0.7,
  // /About-Us/* and /Contact-Us are orphaned legacy duplicates of /about/* and
  // /contact. They carry canonicals to the real pages; keep them out of the sitemap
  // so Google is not also being told to index them.
  // /webinar is retired from the site: unlinked from nav, noindexed, kept live
  // only so existing WebinarJam and ad links do not 404.
  exclude: ["/thank-you", "/admin/*", "/About-Us/*", "/Contact-Us", "/webinar"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/admin/", "/webinar"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    additionalSitemaps: [],
  },
};
