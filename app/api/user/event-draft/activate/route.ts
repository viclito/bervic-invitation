import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { templatesRegistry } from "@/data/templatesRegistry";

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
      const regTemplate = templatesRegistry.find((t) => t.slug === templateSlug);
      const isBirthdayTemplate = regTemplate?.category === "birthday";

      // Claim/Activate Template for user: create independent UserInvitation
      let activeDraft = null;
      if (isBirthdayTemplate) {
        activeDraft = await prisma.userDraftDetails.findFirst({
          where: { userId: user.id, eventType: "BIRTHDAY" },
          orderBy: { updatedAt: "desc" },
        });
      }

      if (!activeDraft) {
        activeDraft = await prisma.userDraftDetails.findFirst({
          where: { userId: user.id, isActive: true },
        });
      }
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
        // If it was previously saved with "Partner Name" on a birthday template, clean it up
        if (isBirthdayTemplate && (existing.partnerTwo === "Partner Name" || existing.partnerTwo === "Partner's Name")) {
          const updated = await prisma.userInvitation.update({
            where: { id: existing.id },
            data: { partnerTwo: "" },
          });
          return NextResponse.json({
            success: true,
            invitation: updated,
            slug: updated.slug,
          });
        }

        return NextResponse.json({
          success: true,
          invitation: existing,
          slug: existing.slug,
        });
      }

      // First time creation: copy details from common profile (UserDraftDetails) to UserInvitation
      let p1 = activeDraft?.hostNameOne || user.name || "Your Name";
      let p2 = activeDraft?.hostNameTwo || "";
      let generatedSlug = "";
      let tagline = "TOGETHER WITH THEIR FAMILIES";
      let inviteLine = "invite you to celebrate their wedding";
      let initials = activeDraft?.coupleInitials || "Y & P";

      if (isBirthdayTemplate) {
        p1 = activeDraft?.hostNameOne || user.name || "Celebrant";
        p2 = ""; // No partner name for birthday
        const cleanName = p1.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "celebrant";
        generatedSlug = `${cleanName}-birthday-${Math.random().toString(36).substring(2, 7)}`;
        tagline = activeDraft?.tagline || "JOIN US IN CELEBRATING";
        inviteLine = activeDraft?.inviteLine || "invite you to celebrate this special birthday";
        initials = cleanName.charAt(0).toUpperCase();
      } else {
        if (!p2 || p2.trim() === "") p2 = "Partner Name";
        const baseSlug = `${p1}-${p2}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        generatedSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
        tagline = activeDraft?.tagline || "TOGETHER WITH THEIR FAMILIES";
        inviteLine = activeDraft?.inviteLine || "invite you to celebrate their wedding";
      }

      const newInvitation = await prisma.userInvitation.create({
        data: {
          userId: user.id,
          templateSlug,
          slug: generatedSlug,
          partnerOne: p1,
          partnerTwo: p2,
          coupleInitials: initials,
          tagline,
          inviteLine,
          weddingDate: activeDraft?.eventDate || "2026-11-28",
          weddingTime: activeDraft?.eventTime || "10:30 AM",
          venuePlace: `${activeDraft?.venueName || ""}${activeDraft?.venueAddress ? `, ${activeDraft.venueAddress}` : ""}`.trim() || "Your Venue Address",
          heroImage: activeDraft?.coverImage || (isBirthdayTemplate ? "/templates/birthday/newspaper-hero.jpg" : "/templates/ceremony-wedding-bg.png"),
          coupleImage: activeDraft?.coupleImage || activeDraft?.coverImage || (isBirthdayTemplate ? "/templates/birthday/newspaper-hero.jpg" : "/templates/ceremony-wedding-bg.png"),
          partnerTwoImage: isBirthdayTemplate ? null : activeDraft?.partnerTwoImage || null,
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
