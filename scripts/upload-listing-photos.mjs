#!/usr/bin/env node
/**
 * Upload listing photos to Cloudinary.
 *
 * Usage:
 *   node scripts/upload-listing-photos.mjs <slug> <photo-folder>
 *
 * Example:
 *   node scripts/upload-listing-photos.mjs 6236-riverbelle-ct \
 *     "/Users/admin/Desktop/Perfecto Homes/Gina /Gina Listings/6236 Riverbelle Ct"
 *
 * Behavior:
 *   - Reads all .jpg/.jpeg/.png/.webp files from the folder
 *   - Sorts alphabetically (rename files like 01-front.jpg to control order)
 *   - Uploads to Cloudinary at listings/perfecto-homes/<slug>/1, /2, /3...
 *   - Overwrites existing public_ids if reuploading
 */

import { v2 as cloudinary } from "cloudinary";
import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { readFileSync } from "node:fs";

const config = JSON.parse(
  readFileSync("/Users/admin/Desktop/Perfecto Homes/cloudinary.json", "utf8")
);

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
  secure: true,
});

const [, , slug, folder] = process.argv;

if (!slug || !folder) {
  console.error("Usage: node scripts/upload-listing-photos.mjs <slug> <photo-folder>");
  process.exit(1);
}

const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const files = (await readdir(folder))
  .filter((f) => exts.has(extname(f).toLowerCase()))
  .sort();

if (files.length === 0) {
  console.error(`No images found in ${folder}`);
  process.exit(1);
}

console.log(`Uploading ${files.length} photo(s) to listings/perfecto-homes/${slug}/`);

for (let i = 0; i < files.length; i++) {
  const num = i + 1;
  const file = files[i];
  const localPath = join(folder, file);
  process.stdout.write(`  [${num}/${files.length}] ${file} ... `);
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: String(num),
      folder: `listings/perfecto-homes/${slug}`,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`✓ ${result.secure_url.split("/").slice(-2).join("/")}`);
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\nDone. Photos live at:`);
console.log(`  https://res.cloudinary.com/${config.cloud_name}/image/upload/listings/perfecto-homes/${slug}/1`);
console.log(`  ... through /${files.length}`);
