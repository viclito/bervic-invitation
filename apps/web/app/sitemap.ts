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
      priority: 1.0,
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

  // Helper to run promises with a fast timeout during static build
  const withTimeout = <T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  };

  // Public user invitations from database
  let invitationRoutes: MetadataRoute.Sitemap = [];
  try {
    const invitations = await withTimeout(
      prisma.userInvitation.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
      })
    );

    invitationRoutes = invitations.map((inv) => ({
      url: `${baseUrl}/invitations/${inv.slug}`,
      lastModified: inv.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic invitations for sitemap:", error);
  }

  // Shop Products (Physical Invitation Cards & Return Gifts)
  let shopProductRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await withTimeout(
      prisma.shopProduct.findMany({
        where: { isActive: true },
        select: {
          id: true,
          updatedAt: true,
        },
      })
    );

    shopProductRoutes = products.map((prod) => ({
      url: `${baseUrl}/shop/${prod.id}`,
      lastModified: prod.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Failed to fetch shop products for sitemap:", error);
  }

  return [...staticRoutes, ...templateRoutes, ...invitationRoutes, ...shopProductRoutes];
}
