import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const output = path.resolve(process.argv[2] || "out");
const site = "https://www.perfectohomesrealestate.com";
const excluded = new Set([
  "/thank-you", "/admin", "/webinar", "/Contact-Us",
  "/peru/hatuchay-valle-restaurant-urubamba",
]);

const robotsPath = path.join(output, "robots.txt");
const sitemapPath = path.join(output, "sitemap.xml");
assert.ok(fs.existsSync(robotsPath), "Static export is missing robots.txt");
assert.ok(fs.existsSync(sitemapPath), "Static export is missing sitemap.xml");

const robots = fs.readFileSync(robotsPath, "utf8");
for (const directive of [
  "User-Agent: *", "Allow: /", "Disallow: /thank-you",
  "Disallow: /admin/", "Disallow: /webinar", `Sitemap: ${site}/sitemap.xml`,
]) assert.ok(robots.includes(directive), `robots.txt is missing ${directive}`);

const sitemap = fs.readFileSync(sitemapPath, "utf8");
assert.match(sitemap, /<urlset\b/, "Expected a complete sitemap URL set");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length > 0, "Sitemap has no URLs");
assert.equal(new Set(urls).size, urls.length, "Sitemap contains duplicate URLs");

for (const url of urls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, site, `Sitemap contains a foreign origin: ${url}`);
  assert.ok(!excluded.has(parsed.pathname), `Excluded route is in sitemap: ${url}`);
  assert.ok(!parsed.pathname.startsWith("/About-Us/"), `Legacy route is in sitemap: ${url}`);
  const file = path.join(output, parsed.pathname === "/" ? "index.html" : `${parsed.pathname}.html`);
  assert.ok(fs.existsSync(file), `Sitemap URL has no exported HTML: ${url}`);
  const html = fs.readFileSync(file, "utf8");
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Sitemap URL lacks its own canonical: ${url}`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), `Sitemap includes a noindex page: ${url}`);
}

// Derive expected routes from real exported HTML. This automatically covers newly
// published Markdown while ignoring canonical duplicates and excluded pages.
function* htmlFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "_next") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name.endsWith(".html")) yield file;
  }
}

for (const file of htmlFiles(output)) {
  const html = fs.readFileSync(file, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical || /<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const relative = path.relative(output, file).replaceAll(path.sep, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/\.html$/, "")}`;
  if (excluded.has(route) || route.startsWith("/About-Us/")) continue;
  const expected = new URL(route, site).href.replace(/\/$/, "");
  if (canonical.replace(/\/$/, "") !== expected) continue;
  assert.ok(urls.includes(canonical), `Indexable exported page is missing from sitemap: ${canonical}`);
}

console.log(`Indexing output passed: robots.txt and ${urls.length} canonical sitemap URLs.`);
