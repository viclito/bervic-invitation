import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import { templatesRegistry } from "@/data/templatesRegistry";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sParams = (await searchParams) || {};
  const guestCode = (sParams.code || sParams.c || sParams.g) as string | undefined;
  let guestName = (sParams.to || sParams.guest) as string | undefined;

  const invitation = await prisma.userInvitation.findUnique({
    where: { slug },
  });

  if (!invitation) {
    return {
      title: "Invitation Not Found | Bervic",
      robots: { index: false, follow: false },
    };
  }

  // If uniqueCode is present, securely resolve guest name
  if (guestCode) {
    const matchedGuest = await prisma.guest.findFirst({
      where: {
        invitationId: invitation.id,
        uniqueCode: guestCode,
      },
      select: { name: true },
    });
    if (matchedGuest?.name) {
      guestName = matchedGuest.name;
    }
  }

  const isBirthday =
    templatesRegistry.find((t) => t.slug === invitation.templateSlug)?.category === "birthday";

  const hasValidPartnerTwo =
    !isBirthday &&
    invitation.partnerTwo &&
    invitation.partnerTwo.trim() !== "" &&
    invitation.partnerTwo !== "Partner Name" &&
    invitation.partnerTwo !== "Partner's Name";

  const nameHeader = hasValidPartnerTwo
    ? `${invitation.partnerOne} & ${invitation.partnerTwo}`
    : `${invitation.partnerOne}`;

  const title = guestName
    ? isBirthday
      ? `${guestName}, you're invited to ${nameHeader}'s Birthday Celebration!`
      : `${guestName}, ${nameHeader} cordially invite you to their Wedding!`
    : isBirthday
    ? `${nameHeader}'s Birthday Celebration | Bervic`
    : `${nameHeader}'s Celebration Invitation | Bervic`;

  const description =
    invitation.inviteLine ||
    `Together with their families, ${nameHeader} invite you to celebrate on ${invitation.weddingTime} at ${invitation.venuePlace}.`;

  let cardImageUrlFromDb = "";
  let cardThemeFromDb = "peach";
  try {
    const social = JSON.parse(invitation.socialLinksJson || "{}");
    if (social.cardImageUrl) cardImageUrlFromDb = social.cardImageUrl;
    if (social.cardTheme) cardThemeFromDb = social.cardTheme;
  } catch {}

  const themeFallbackMap: Record<string, string> = {
    ceremony: "/templates/ceremony-wedding-bg.png",
    haldi: "/templates/haldi-wedding-bg.png",
    hindu: "/templates/hindu-wedding-bg.png",
    islamic: "/templates/islamic-wedding-bg.png",
    church: "/templates/church-wedding-bg.png",
    peach: "/templates/peach-mandap-bg.png",
  };

  const fallbackPath = themeFallbackMap[cardThemeFromDb] || themeFallbackMap[invitation.templateSlug] || "/templates/peach-mandap-bg.png";
  const rawImagePath = cardImageUrlFromDb || fallbackPath;

  const shareImage = rawImagePath.startsWith("http://") || rawImagePath.startsWith("https://")
    ? rawImagePath
    : `${baseUrl}${rawImagePath.startsWith("/") ? "" : "/"}${rawImagePath}`;

  const canonicalUrl = `${baseUrl}/invitations/${slug}${guestCode ? `?code=${encodeURIComponent(guestCode)}` : guestName ? `?to=${encodeURIComponent(guestName)}` : ""}`;

  return {
    title,
    description,
    keywords: [
      `${nameHeader} invitation`,
      "wedding invitation link",
      "digital event invitation",
      "Bervic invitation",
      invitation.venuePlace || "wedding venue",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Bervic Invitations",
      images: [
        {
          url: shareImage,
          secureUrl: shareImage,
          width: 1200,
          height: 630,
          type: shareImage.endsWith(".png") ? "image/png" : "image/jpeg",
          alt: `${nameHeader} Invitation`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = (await searchParams) || {};
  const guestCode = (sParams.code || sParams.c || sParams.g) as string | undefined;
  let guestName = (sParams.to || sParams.guest) as string | undefined;

  // Run automatic cleanup for expired invitations
  await cleanupExpiredInvitations();

  const invitation = await prisma.userInvitation.findUnique({
    where: { slug },
  });

  if (!invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA] text-[#221C17] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-[#D9A441]" />
        </div>
        <h1 className="text-3xl font-bold text-[#221C17]">Invitation Not Found or Expired</h1>
        <p className="text-sm text-[#221C17]/70 mt-2 max-w-md">
          This invitation has expired (after 3 days of the event) or does not exist.
        </p>
        <Link href="/" className="btn-maroon mt-6 px-6 py-3 text-xs font-bold shadow-md">
          Back to Bervic Home
        </Link>
      </div>
    );
  }

  // Securely resolve guest details by 10-character uniqueCode
  let guestData: any = null;
  if (guestCode) {
    const matchedGuest = await prisma.guest.findFirst({
      where: {
        invitationId: invitation.id,
        uniqueCode: guestCode,
      },
    });
    if (matchedGuest) {
      guestName = matchedGuest.name;
      guestData = {
        id: matchedGuest.id,
        name: matchedGuest.name,
        phone: matchedGuest.phone,
        status: matchedGuest.status,
        plusOnes: matchedGuest.plusOnes,
        uniqueCode: matchedGuest.uniqueCode,
      };
    }
  }

  // Fallback to active UserDraftDetails if any images are not yet copied to this invitation instance
  let userDraftFallback: any = null;
  if (!invitation.coupleImage || !(invitation as any).partnerTwoImage || !invitation.heroImage) {
    try {
      userDraftFallback = await prisma.userDraftDetails.findFirst({
        where: { userId: invitation.userId, isActive: true },
      });
    } catch {}
  }

  let socialLinksObj: Record<string, any> = {};
  try {
    socialLinksObj = JSON.parse(invitation.socialLinksJson || "{}");
  } catch {}

  const showVideoSection =
    socialLinksObj.showVideo !== undefined
      ? Boolean(socialLinksObj.showVideo)
      : Boolean(invitation.loveStoryVideoUrl && invitation.loveStoryVideoUrl.trim() !== "");

  const props = {
    templateSlug: invitation.templateSlug,
    coupleInitials: invitation.coupleInitials,
    partnerOne: invitation.partnerOne,
    partnerTwo: invitation.partnerTwo,
    tagline: invitation.tagline,
    inviteLine: invitation.inviteLine,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    heroImage: invitation.heroImage || userDraftFallback?.coverImage || "/templates/ceremony-wedding-bg.png",
    coupleImage: invitation.coupleImage || userDraftFallback?.coupleImage || "/images/templates/couple-photo.jpg",
    partnerTwoImage: (invitation as any).partnerTwoImage || userDraftFallback?.partnerTwoImage || "/images/templates/groom-bride-2.jpg",
    venuePlace: invitation.venuePlace,
    events: invitation.eventsJson ? JSON.parse(invitation.eventsJson) : [],
    timelineDay: invitation.timelineDayJson ? JSON.parse(invitation.timelineDayJson) : [],
    loveStoryText: invitation.loveStoryText,
    loveStoryVideoUrl: invitation.loveStoryVideoUrl,
    showVideoSection,
    locations: invitation.locationsJson ? JSON.parse(invitation.locationsJson) : [],
    galleryImages: invitation.galleryImagesJson ? JSON.parse(invitation.galleryImagesJson) : (userDraftFallback?.galleryImagesJson ? JSON.parse(userDraftFallback.galleryImagesJson) : []),
    contactPhone: invitation.contactPhone,
    contactAddress: invitation.contactAddress,
    socialLinks: socialLinksObj,
    guestName,
    guestData,
  };

  const nameHeader = invitation.partnerTwo
    ? `${invitation.partnerOne} & ${invitation.partnerTwo}`
    : `${invitation.partnerOne}`;

  // Structured Data for Google Event Search & AI Chat Summarizer
  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${nameHeader}'s Celebration`,
    description: invitation.inviteLine,
    startDate: invitation.weddingDate || new Date().toISOString(),
    location: {
      "@type": "Place",
      name: invitation.venuePlace || "Event Venue",
      address: invitation.contactAddress || invitation.venuePlace || "India",
    },
    image: [invitation.coupleImage || invitation.heroImage],
    organizer: {
      "@type": "Person",
      name: nameHeader,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <DynamicTemplateCard {...props} />
    </>
  );
}
