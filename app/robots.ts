import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/templates",
          "/templates/*",
          "/cards",
          "/invitations/*",
          "/auth/login",
          "/auth/signup",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/checkout/",
          "/templates/customize/",
          "/invitations/edit/",
        ],
      },
      {
        // Explicit permissions for AI Chat Crawlers & LLM Agents (GEO / AIO)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "Bytespider",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/templates",
          "/templates/*",
          "/cards",
          "/invitations/*",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/checkout/",
          "/templates/customize/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
