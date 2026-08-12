import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

const THEME_CARD_MAP: Record<string, string> = {
  ceremony: "/templates/ceremony-wedding-bg.png",
  "ceremony-wedding": "/templates/ceremony-wedding-bg.png",
  "ceremony-overlay": "/templates/ceremony-wedding-bg.png",
  haldi: "/templates/haldi-wedding-bg.png",
  "haldi-wedding": "/templates/haldi-wedding-bg.png",
  "haldi-ceremony": "/templates/haldi-wedding-bg.png",
  hindu: "/templates/hindu-wedding-bg.png",
  "hindu-wedding": "/templates/hindu-wedding-bg.png",
  "hindu-mandap": "/templates/hindu-wedding-bg.png",
  islamic: "/templates/islamic-wedding-bg.png",
  "islamic-wedding": "/templates/islamic-wedding-bg.png",
  "islamic-nikah": "/templates/islamic-wedding-bg.png",
  church: "/templates/church-wedding-bg.png",
  "church-wedding": "/templates/church-wedding-bg.png",
  peach: "/templates/peach-mandap-bg.png",
  "peach-mandap": "/templates/peach-mandap-bg.png",
};

const isGenericStockPhoto = (url: string | null | undefined): boolean => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("couple-photo.jpg") ||
    lower.includes("floral-hero.jpg") ||
    lower.includes("unsplash.com")
  );
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sParams = (await searchParams) || {};
  const guestName = (sParams.to || sParams.guest) as string | undefined;

  const invitation = await prisma.userInvitation.findUnique({
    where: { slug },
  });

  if (!invitation) {
    return {
      title: "Invitation Not Found | Bervic",
      robots: { index: false, follow: false },
    };
  }

  const nameHeader = invitation.partnerTwo
    ? `${invitation.partnerOne} & ${invitation.partnerTwo}`
    : `${invitation.partnerOne}`;

  const title = guestName
    ? `${guestName}, ${nameHeader} cordially invite you to their Wedding!`
    : `${nameHeader}'s Celebration Invitation | Bervic`;

  const description =
    invitation.inviteLine ||
    `Together with their families, ${nameHeader} invite you to celebrate on ${invitation.weddingTime} at ${invitation.venuePlace}.`;

  // Resolve template preview / card theme graphic image
  let shareImage = THEME_CARD_MAP[invitation.templateSlug] || "/templates/ceremony-wedding-bg.png";

  // Override with custom user photo ONLY if user uploaded a custom image (not stock placeholder)
  if (invitation.coupleImage && !isGenericStockPhoto(invitation.coupleImage)) {
    shareImage = invitation.coupleImage;
  } else if (invitation.heroImage && !isGenericStockPhoto(invitation.heroImage)) {
    shareImage = invitation.heroImage;
  }

  // Absolute URL formatting for WhatsApp / OpenGraph metadata
  if (!shareImage.startsWith("http://") && !shareImage.startsWith("https://")) {
    shareImage = `${baseUrl}${shareImage.startsWith("/") ? "" : "/"}${shareImage}`;
  }

  const canonicalUrl = `${baseUrl}/invitations/${slug}${guestName ? `?to=${encodeURIComponent(guestName)}` : ""}`;

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
          width: 1200,
          height: 630,
          alt: `${nameHeader} Invitation`,
        },
      ],
      locale: "en_IN",
      type: "article",
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
  const guestName = (sParams.to || sParams.guest) as string | undefined;

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

  const props = {
    templateSlug: invitation.templateSlug,
    coupleInitials: invitation.coupleInitials,
    partnerOne: invitation.partnerOne,
    partnerTwo: invitation.partnerTwo,
    tagline: invitation.tagline,
    inviteLine: invitation.inviteLine,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    heroImage: invitation.heroImage,
    coupleImage: invitation.coupleImage,
    venuePlace: invitation.venuePlace,
    events: invitation.eventsJson ? JSON.parse(invitation.eventsJson) : [],
    timelineDay: invitation.timelineDayJson ? JSON.parse(invitation.timelineDayJson) : [],
    loveStoryText: invitation.loveStoryText,
    loveStoryVideoUrl: invitation.loveStoryVideoUrl,
    locations: invitation.locationsJson ? JSON.parse(invitation.locationsJson) : [],
    galleryImages: invitation.galleryImagesJson ? JSON.parse(invitation.galleryImagesJson) : [],
    contactPhone: invitation.contactPhone,
    contactAddress: invitation.contactAddress,
    socialLinks: invitation.socialLinksJson ? JSON.parse(invitation.socialLinksJson) : {},
    guestName,
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
