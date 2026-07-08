#!/usr/bin/env node

/**
 * Validates all listing image URLs before deploy.
 * - Flags any non-Cloudinary URLs (MLS, external hosts expire)
 * - Checks that every image URL returns HTTP 200
 * - Flags listings missing images entirely
 *
 * Usage: node scripts/validate-images.mjs [--check-urls]
 *   --check-urls  Actually ping each URL (slower, use before deploy)
 *   Without flag, only checks for non-Cloudinary URLs and missing images
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve("content");
const HEADERS_FILE = path.resolve("public/_headers");
const CLOUDINARY_HOST = "res.cloudinary.com";
const LISTING_DIRS = ["listings/sacramento", "peru"];

const checkUrls = process.argv.includes("--check-urls");

let totalImages = 0;
let warnings = 0;
let errors = 0;

/** Parse img-src domains from _headers CSP */
function getAllowedImageDomains() {
  if (!fs.existsSync(HEADERS_FILE)) return null;
  const raw = fs.readFileSync(HEADERS_FILE, "utf-8");
  const match = raw.match(/img-src\s+([^;]+)/);
  if (!match) return null;
  const tokens = match[1].trim().split(/\s+/);
  const domains = [];
  for (const t of tokens) {
    try {
      domains.push(new URL(t).hostname);
    } catch {
      // skip 'self', data:, etc.
    }
  }
  return domains;
}

function getImageUrls(data) {
  const urls = [];
  if (data.featuredImage) urls.push({ field: "featuredImage", url: data.featuredImage });
  for (let i = 1; i <= 30; i++) {
    const key = `image${i}`;
    if (data[key]) urls.push({ field: key, url: data[key] });
  }
  if (Array.isArray(data.images)) {
    data.images.forEach((url, i) => urls.push({ field: `images[${i}]`, url }));
  }
  return urls;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
    return res.status;
  } catch {
    return 0;
  }
}

async function main() {
  console.log("Listing Image Validator");
  console.log("=".repeat(50));

  const allowedDomains = getAllowedImageDomains();
  const allImageDomains = new Set();
  const allTitles = new Map(); // title -> [file paths] for duplicate detection

  for (const dir of LISTING_DIRS) {
    const fullDir = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".md"));
    console.log(`\n${dir}/ (${files.length} listings)`);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
      const { data } = matter(raw);
      const images = getImageUrls(data);
      const slug = data.slug || file.replace(".md", "");

      // Track titles for duplicate detection
      const title = data.title || slug;
      const filePath = `${dir}/${file}`;
      if (!allTitles.has(title)) allTitles.set(title, []);
      allTitles.get(title).push(filePath);

      if (images.length === 0) {
        console.log(`  ✗  ${slug}: NO IMAGES — listing will show placeholder`);
        errors++;
        continue;
      }

      // Check for non-Cloudinary URLs (local /public paths are allowed — they ship with the build)
      const external = images.filter((img) => {
        if (typeof img.url === "string" && img.url.startsWith("/")) return false;
        try {
          return new URL(img.url).hostname !== CLOUDINARY_HOST;
        } catch {
          return true;
        }
      });

      if (external.length > 0) {
        for (const img of external) {
          console.log(`  ✗  ${slug} → ${img.field}: NON-CLOUDINARY URL (will expire)`);
          console.log(`     ${img.url}`);
          errors++;
        }
      }

      totalImages += images.length;

      // Collect all external domains for CSP check
      for (const img of images) {
        try {
          allImageDomains.add(new URL(img.url).hostname);
        } catch {}
      }

      // Optional: ping every URL
      if (checkUrls) {
        for (const img of images) {
          const status = await checkUrl(img.url);
          if (status !== 200) {
            console.log(`  ✗  ${slug} → ${img.field}: HTTP ${status || "TIMEOUT"}`);
            console.log(`     ${img.url}`);
            errors++;
          }
        }
      }

      if (external.length === 0) {
        console.log(`  ✓  ${slug}: ${images.length} images OK (Cloudinary or local)`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Total images: ${totalImages}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Errors: ${errors}`);

  // Duplicate listing check
  const dupes = [...allTitles.entries()].filter(([, files]) => files.length > 1);
  if (dupes.length > 0) {
    console.log("\nDUPLICATE LISTINGS:");
    for (const [title, files] of dupes) {
      console.log(`  ✗  "${title}" appears in ${files.length} files:`);
      files.forEach((f) => console.log(`     ${f}`));
    }
    errors += dupes.length;
  }

  // CSP allowlist check
  if (allowedDomains) {
    const blocked = [...allImageDomains].filter((d) => !allowedDomains.includes(d));
    if (blocked.length > 0) {
      console.log("\nCSP BLOCKED DOMAINS:");
      for (const d of blocked) {
        console.log(`  ✗  ${d} is used in listings but NOT in _headers img-src`);
      }
      console.log("  → Add these to the img-src directive in public/_headers");
      errors += blocked.length;
    } else {
      console.log("\nCSP check: All image domains are in _headers img-src ✓");
    }
  }

  if (errors > 0) {
    console.log("\nFAILED — Fix the errors above before deploying.");
    process.exit(1);
  } else {
    console.log("\nPASSED — All listing images look good.");
  }
}

main();
