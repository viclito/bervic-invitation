import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { profileId, templateSlug } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (profileId) {
      // Set active profile in UserDraftDetails
      await prisma.userDraftDetails.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      });

      const activeProfile = await prisma.userDraftDetails.update({
        where: { id: profileId },
        data: { isActive: true },
      });

      return NextResponse.json({
        success: true,
        message: `Profile "${activeProfile.profileName || "Event"}" set as active main profile!`,
        activeProfileId: activeProfile.id,
        activeProfile,
      });
    }

    if (templateSlug) {
      // Claim/Activate Template for user: create independent UserInvitation
      let activeDraft = await prisma.userDraftDetails.findFirst({
        where: { userId: user.id, isActive: true },
      });
      if (!activeDraft) {
        activeDraft = await prisma.userDraftDetails.findFirst({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        });
      }

      // Check if user already has an invitation for this template
      const existing = await prisma.userInvitation.findFirst({
        where: { userId: user.id, templateSlug },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          invitation: existing,
          slug: existing.slug,
        });
      }

      // First time creation: copy details from common profile (UserDraftDetails) to UserInvitation
      const p1 = activeDraft?.hostNameOne || "Your Name";
      const p2 = activeDraft?.hostNameTwo || "Partner Name";
      const baseSlug = `${p1}-${p2}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const generatedSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

      const newInvitation = await prisma.userInvitation.create({
        data: {
          userId: user.id,
          templateSlug,
          slug: generatedSlug,
          partnerOne: p1,
          partnerTwo: p2,
          coupleInitials: activeDraft?.coupleInitials || "Y & P",
          tagline: activeDraft?.tagline || "TOGETHER WITH THEIR FAMILIES",
          inviteLine: activeDraft?.inviteLine || "invite you to celebrate their wedding",
          weddingDate: activeDraft?.eventDate || "2026-11-28",
          weddingTime: activeDraft?.eventTime || "10:30 AM",
          venuePlace: `${activeDraft?.venueName || ""}${activeDraft?.venueAddress ? `, ${activeDraft.venueAddress}` : ""}`.trim() || "Your Venue Address",
          heroImage: activeDraft?.coverImage || "/images/templates/floral-hero.jpg",
          coupleImage: activeDraft?.coupleImage || "/images/templates/couple-photo.jpg",
          partnerTwoImage: activeDraft?.partnerTwoImage || null,
          loveStoryText: activeDraft?.loveStoryText || "",
          loveStoryVideoUrl: activeDraft?.loveStoryVideoUrl || "",
          contactPhone: activeDraft?.rsvpContact || "",
          contactAddress: activeDraft?.venueAddress || "",
          locationsJson: activeDraft?.locationsJson || "[]",
          eventsJson: activeDraft?.functionsJson || "[]",
          timelineDayJson: activeDraft?.dayTimelineJson || "[]",
          galleryImagesJson: activeDraft?.galleryImagesJson || "[]",
          socialLinksJson: "{}",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Template "${templateSlug}" claimed successfully!`,
        invitation: newInvitation,
        slug: newInvitation.slug,
      });
    }

    return NextResponse.json(
      { success: false, message: "Missing profileId or templateSlug" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("POST /api/user/event-draft/activate error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate template" },
      { status: 500 }
    );
  }
}
