import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cortexprism.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all legitimate crawlers (Googlebot, Bingbot, etc.)
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/login/",
          "/register/",
          "/profile/",
        ],
      },
      {
        // Allow Anthropic's crawler — helps CortexPrism appear in Claude AI answers
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/login/",
          "/register/",
          "/profile/",
        ],
      },
      {
        // Block OpenAI's training crawler (GPTBot scrapes for training data, not citations)
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // Block Common Crawl (used for mass training datasets)
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        // Block Amazon's Alexa crawler
        userAgent: "ia_archiver",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
