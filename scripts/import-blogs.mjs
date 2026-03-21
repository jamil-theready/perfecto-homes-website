#!/usr/bin/env node

/**
 * Blog CSV Importer for Perfecto Homes
 *
 * Usage:
 *   node scripts/import-blogs.mjs path/to/blogs.csv
 *
 * CSV Fields (required):
 *   title        - Blog post title
 *   slug         - URL slug (e.g. "my-blog-post")
 *   author       - Author first name: elisban, gina, alfredo, jamil
 *   category     - Category: Sacramento, Peru, News
 *
 * CSV Fields (optional):
 *   metaDescription - SEO meta description (max 160 chars recommended)
 *   image           - Image URL for the post hero/card
 *   tags            - Comma-separated tags (e.g. "SACRAMENTO,HOME BUYING")
 *   content         - HTML body content
 *
 * Example CSV:
 *   title,slug,author,category,metaDescription,image,tags,content
 *   "My Post","my-post","elisban","Sacramento","Description here","https://...","SACRAMENTO,BUYING","<p>Content here</p>"
 *
 * Output:
 *   Creates markdown files in content/blog/ with YAML frontmatter
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const CONTENT_DIR = resolve(process.cwd(), "content/blog");

function parseCSV(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      lines.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current.trim() || lines.length > 0) {
        lines.push(current.trim());
        current = "";
      }
      if (lines.length > 0) {
        yield lines.splice(0);
      }
      if (char === "\r" && text[i + 1] === "\n") i++;
    } else {
      current += char;
    }
  }
  if (current.trim() || lines.length > 0) {
    lines.push(current.trim());
    yield lines.splice(0);
  }
}

function run() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.log("Blog CSV Importer for Perfecto Homes\n");
    console.log("Usage: node scripts/import-blogs.mjs <path-to-csv>\n");
    console.log("Required CSV columns: title, slug, author, category");
    console.log("Optional CSV columns: metaDescription, image, tags, content\n");
    console.log("Valid authors: elisban, gina, alfredo, jamil");
    console.log("Valid categories: Sacramento, Peru, News\n");
    console.log("Example row:");
    console.log('  "My Post","my-post","elisban","Sacramento","SEO desc","https://img.url","TAG1,TAG2","<p>Body</p>"');
    process.exit(0);
  }

  if (!existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  const raw = readFileSync(csvPath, "utf-8");
  const rows = [...parseCSV(raw)];

  if (rows.length < 2) {
    console.error("CSV must have a header row and at least one data row.");
    process.exit(1);
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const requiredFields = ["title", "slug", "author", "category"];
  for (const field of requiredFields) {
    if (!headers.includes(field)) {
      console.error(`Missing required column: ${field}`);
      process.exit(1);
    }
  }

  let created = 0;
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const data = {};
    headers.forEach((h, idx) => {
      data[h] = row[idx] || "";
    });

    const slug = data.slug;
    if (!slug) {
      console.warn(`Row ${i + 1}: Missing slug, skipping.`);
      skipped++;
      continue;
    }

    const filePath = join(CONTENT_DIR, `${slug}.md`);
    if (existsSync(filePath)) {
      console.warn(`Row ${i + 1}: ${slug}.md already exists, skipping.`);
      skipped++;
      continue;
    }

    // Build YAML frontmatter
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((t) => `  - "${t.trim()}"`)
          .join("\n")
      : "";

    let frontmatter = `---\n`;
    frontmatter += `title: "${data.title.replace(/"/g, '\\"')}"\n`;
    frontmatter += `slug: "${slug}"\n`;
    if (data.metadescription) frontmatter += `metaDescription: "${data.metadescription.replace(/"/g, '\\"')}"\n`;
    frontmatter += `category: "${data.category}"\n`;
    frontmatter += `author: "${data.author}"\n`;
    if (data.image) frontmatter += `image: "${data.image}"\n`;
    if (tags) frontmatter += `tags:\n${tags}\n`;
    frontmatter += `---\n\n`;

    const content = data.content || `<p>Content coming soon.</p>`;
    writeFileSync(filePath, frontmatter + content, "utf-8");
    console.log(`Created: ${slug}.md`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

run();
