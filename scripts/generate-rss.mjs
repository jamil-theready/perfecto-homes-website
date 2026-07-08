// Generates out/rss.xml from content/blog/*.md — runs in postbuild after next build.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://www.perfectohomesrealestate.com";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
// Written to public/ (committed, ships with any build) and out/ (current build output).
const TARGETS = [
  path.join(process.cwd(), "public", "rss.xml"),
  path.join(process.cwd(), "out", "rss.xml"),
];

const escapeXml = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const posts = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
    return data;
  })
  .filter((d) => d.slug && d.title && d.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const items = posts
  .map((p) => {
    const url = `${SITE_URL}/blog/${p.slug}/`;
    const img = p.image ? `${SITE_URL}${p.image}` : null;
    return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.metaDescription || "")}</description>${
        img ? `\n      <enclosure url="${escapeXml(img)}" type="image/jpeg" length="0"/>` : ""
      }${p.category ? `\n      <category>${escapeXml(p.category)}</category>` : ""}
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Perfecto Homes Real Estate Blog</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Sacramento real estate insights, neighborhood guides, and Peru investment properties from the Perfecto Homes team.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

for (const target of TARGETS) {
  if (fs.existsSync(path.dirname(target))) fs.writeFileSync(target, rss);
}
console.log(`rss.xml written with ${posts.length} posts`);
