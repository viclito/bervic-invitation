import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShortSlugRedirectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = (await searchParams) || {};

  // Check if an invitation with this slug exists
  const invitation = await prisma.userInvitation.findUnique({
    where: { slug },
    select: { slug: true },
  });

  if (!invitation) {
    notFound();
  }

  // Preserve all query params (e.g. ?code=... or ?to=...)
  const queryStr = new URLSearchParams(
    Object.entries(sParams).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((item) => [k, item]) : v !== undefined ? [[k, v]] : []
    )
  ).toString();

  const destination = `/invitations/${invitation.slug}${queryStr ? `?${queryStr}` : ""}`;
  redirect(destination);
}
