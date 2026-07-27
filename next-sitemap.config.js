/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.perfectohomesrealestate.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  // /About-Us/* and /Contact-Us are orphaned legacy duplicates of /about/* and
  // /contact. They carry canonicals to the real pages; keep them out of the sitemap
  // so Google is not also being told to index them.
  exclude: ["/thank-you", "/admin/*", "/About-Us/*", "/Contact-Us"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/admin/"],
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
