import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "content");

// Using Record<string, any> to allow flexible frontmatter access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentItem = Record<string, any>;

/**
 * Get all items from a content collection (e.g. "peru", "blog", "team")
 */
export function getCollection(collection: string): ContentItem[] {
  const dir = path.join(contentDir, collection);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const items: ContentItem[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return { slug, content, ...data } as ContentItem;
  });

  return items.sort((a, b) => {
    const dateA = a.date ? new Date(String(a.date)).getTime() : 0;
    const dateB = b.date ? new Date(String(b.date)).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Get a single item by slug
 */
export function getItemBySlug(
  collection: string,
  slug: string
): ContentItem | null {
  const filePath = path.join(contentDir, collection, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { slug, content, ...data } as ContentItem;
}

/**
 * Convert markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

/**
 * Get all slugs for a collection (used for generateStaticParams)
 */
export function getCollectionSlugs(collection: string): string[] {
  const dir = path.join(contentDir, collection);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
