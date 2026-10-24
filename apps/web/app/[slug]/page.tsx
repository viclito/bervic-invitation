import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { templatesRegistry } from "@/data/templatesRegistry";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShortSlugRedirectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = (await searchParams) || {};

  const cleanRaw = String(slug || "").trim();

  // Preserve all query params (e.g. ?code=... or ?payment=success)
  const queryStr = new URLSearchParams(
    Object.entries(sParams).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((item) => [k, item]) : v !== undefined ? [[k, v]] : []
    )
  ).toString();

  // 1. If slug matches a template registry slug, redirect to template preview route
  const matchedTemplate = templatesRegistry.find(
    (t) => t.slug.toLowerCase() === cleanRaw.toLowerCase()
  );

  if (matchedTemplate) {
    redirect(`/templates/${matchedTemplate.slug}${queryStr ? `?${queryStr}` : ""}`);
  }

  // 2. Check if an invitation with this slug exists (direct or case-insensitive match)
  let invitation = await prisma.userInvitation.findUnique({
    where: { slug: cleanRaw },
    select: { slug: true },
  });

  if (!invitation) {
    invitation = await prisma.userInvitation.findFirst({
      where: {
        OR: [
          { slug: { equals: cleanRaw, mode: "insensitive" } },
          { slug: { equals: cleanRaw.toLowerCase(), mode: "insensitive" } },
        ],
      },
      select: { slug: true },
    });
  }

  if (!invitation) {
    notFound();
  }

  const destination = `/invitations/${invitation.slug}${queryStr ? `?${queryStr}` : ""}`;
  redirect(destination);
}
