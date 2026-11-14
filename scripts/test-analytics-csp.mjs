import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const headers = fs.readFileSync(process.env.CSP_HEADERS_PATH || "public/_headers", "utf8");
const policy = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
assert.ok(policy, "The deployed headers must define a Content-Security-Policy");
const sources = policy.split(";").map(value => value.trim().split(/\s+/))
  .find(([directive]) => directive === "connect-src")?.slice(1) || [];

test("the observed GA4 page-view collection destination is allowed", () => {
  const collection = new URL("https://analytics.google.com/g/collect");
  assert.ok(sources.includes(collection.origin), "GA4 collection is blocked by connect-src");
  for (const origin of ["https://www.google-analytics.com", "https://region1.google-analytics.com"]) {
    assert.ok(sources.includes(origin), `Existing GA4 destination was removed: ${origin}`);
  }
});

test("allowing analytics collection does not grant broad Google or advertising access", () => {
  assert.ok(!sources.some(source => ["*", "https:", "https://*.google.com"].includes(source)
    || source.includes("doubleclick.net") || source.includes("googlesyndication.com")));
});
