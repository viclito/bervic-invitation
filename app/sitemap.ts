import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { templatesRegistry } from "@/data/templatesRegistry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Template static detail pages from registry (All categories: Wedding, Birthday, Religious, Anniversary)
  const templateRoutes: MetadataRoute.Sitemap = templatesRegistry.map((tpl) => ({
    url: `${baseUrl}/templates/${tpl.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Public user invitations from database
  let invitationRoutes: MetadataRoute.Sitemap = [];
  try {
    const invitations = await prisma.userInvitation.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    invitationRoutes = invitations.map((inv) => ({
      url: `${baseUrl}/invitations/${inv.slug}`,
      lastModified: inv.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic invitations for sitemap:", error);
  }

  return [...staticRoutes, ...templateRoutes, ...invitationRoutes];
}
