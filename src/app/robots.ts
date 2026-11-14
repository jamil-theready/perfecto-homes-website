import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Cloudflare runs next build directly. Native metadata routes are exported even
// when the npm postbuild lifecycle is not invoked.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/thank-you", "/admin/", "/webinar"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: "https://www.perfectohomesrealestate.com/sitemap.xml",
  };
}
