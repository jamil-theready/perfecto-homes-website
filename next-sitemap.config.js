/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.perfectohomesrealestate.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/thank-you", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/admin/"],
      },
    ],
  },
};
