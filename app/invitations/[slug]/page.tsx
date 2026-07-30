import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredInvitations } from "@/lib/cleanupExpiredInvitations";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await prisma.userInvitation.findUnique({
    where: { slug },
  });

  if (!invitation) {
    return {
      title: "Invitation Not Found | Bervic",
    };
  }

  return {
    title: `${invitation.partnerOne} & ${invitation.partnerTwo}'s Wedding Invitation | Bervic`,
    description: `Together with their families, ${invitation.partnerOne} & ${invitation.partnerTwo} invite you to celebrate their wedding on ${invitation.weddingTime}.`,
    openGraph: {
      title: `${invitation.partnerOne} & ${invitation.partnerTwo}'s Wedding Invitation`,
      description: `Celebrate with ${invitation.partnerOne} & ${invitation.partnerTwo} on their special day.`,
      images: [{ url: invitation.coupleImage || "/images/templates/couple-photo.jpg" }],
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

  return <DynamicTemplateCard {...props} />;
}


