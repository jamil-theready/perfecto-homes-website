import type { MetadataRoute } from "next";
import { TEAM } from "@/lib/constants";
import { getCollection } from "@/lib/content";

const SITE = "https://www.perfectohomesrealestate.com";
const HELD_PERU_SLUGS = new Set(["hatuchay-valle-restaurant-urubamba"]);

export const dynamic = "force-static";

function observedDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

// One content-derived generator for both direct next build and npm run build.
// Held listings, canonical duplicates and non-HTML metadata are not advertised.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE}/peru`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE}/communities`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE}/communities/peru`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE}/contact`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE}/events`, priority: 0.4, changeFrequency: "monthly" },
    { url: `${SITE}/privacy-policy`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${SITE}/terms`, priority: 0.2, changeFrequency: "yearly" },
  ];

  for (const collection of ["peru", "communities", "blog"]) {
    for (const item of getCollection(collection)) {
      if (collection === "peru" && HELD_PERU_SLUGS.has(item.slug)) continue;
      pages.push({
        url: `${SITE}/${collection}/${item.slug}`,
        lastModified: observedDate(item.updatedAt) ?? observedDate(item.date),
        changeFrequency: collection === "peru" ? "weekly" : "monthly",
        priority: collection === "peru" ? 0.8 : 0.6,
      });
    }
  }

  return [...pages, ...TEAM.map((member) => ({
    url: `${SITE}/about/${member.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }))];
}
