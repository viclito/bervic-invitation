import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

import { checkInvitationLockStatus } from "@/lib/lockCheck";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get("all") === "true";
    const profileId = searchParams.get("id");
    const invitationId = searchParams.get("invitationId");

    // 1. Fetch specific owned invitation instance
    if (invitationId) {
      const inv = await prisma.userInvitation.findFirst({
        where: { id: invitationId, userId: user.id },
      });

      if (inv) {
        let locations = [];
        try {
          locations = JSON.parse(inv.locationsJson || "[]");
        } catch {}

        let functions = [];
        try {
          functions = JSON.parse(inv.eventsJson || "[]");
        } catch {}

        let timelineItems = [];
        try {
          timelineItems = JSON.parse(inv.timelineDayJson || "[]");
        } catch {}

        let galleryImages = [];
        try {
          galleryImages = JSON.parse(inv.galleryImagesJson || "[]");
        } catch {}

        let socialLinksObj: Record<string, unknown> = {};
        try {
          socialLinksObj = JSON.parse(inv.socialLinksJson || "{}");
        } catch {}

        const showVideo =
          socialLinksObj.showVideo !== undefined
            ? Boolean(socialLinksObj.showVideo)
            : Boolean(inv.loveStoryVideoUrl && inv.loveStoryVideoUrl.trim() !== "");

        const lockRes = checkInvitationLockStatus({
          createdAt: inv.createdAt,
          weddingDate: inv.weddingDate || inv.weddingTime,
          isUnlockedByAdmin: inv.isUnlockedByAdmin,
          isLockedByAdmin: inv.isLockedByAdmin,
        });

        const draft = {
          id: inv.id,
          invitationId: inv.id,
          isInvitationInstance: true,
          eventType: "WEDDING",
          hostNameOne: inv.partnerOne || "",
          hostNameTwo: inv.partnerTwo || "",
          coupleInitials: inv.coupleInitials || "",
          tagline: inv.tagline || "",
          inviteLine: inv.inviteLine || "",
          eventDate: inv.weddingDate || "",
          eventTime: inv.weddingTime || "",
          venueName: inv.venuePlace || "",
          venueAddress: "",
          locations,
          functions,
          timelineItems,
          galleryImages,
          loveStoryText: inv.loveStoryText || "",
          loveStoryVideoUrl: inv.loveStoryVideoUrl || "",
          showVideo,
          completedFields: showVideo ? ["showVideo:true"] : ["showVideo:false"],
          coverImage: inv.heroImage || "",
          coupleImage: inv.coupleImage || "",
          partnerTwoImage: inv.partnerTwoImage || "",
          rsvpContact: inv.contactPhone || "",
          isLocked: lockRes.isLocked,
          lockReason: lockRes.lockReason,
          timeUntilLockText: lockRes.timeUntilLockText,
        };

        return NextResponse.json({
          success: true,
          draft,
        });
      }
    }

    const eventTypeParam = searchParams.get("eventType");

    // 2. Fetch all profiles or specific profile (UserDraftDetails is for template previews — NEVER locked)
    if (fetchAll) {
      const rawProfiles = await prisma.userDraftDetails.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });

      const profiles = rawProfiles.map((p) => {
        return {
          ...p,
          isLocked: false,
          lockReason: "",
          timeUntilLockText: "",
        };
      });

      const activeProfile = profiles.find((p) => p.isActive) || profiles[0] || null;

      return NextResponse.json({
        success: true,
        profiles,
        activeProfileId: activeProfile?.id || null,
        draft: activeProfile,
      });
    }

    if (profileId) {
      const rawDraft = await prisma.userDraftDetails.findFirst({
        where: { id: profileId, userId: user.id },
      });

      if (!rawDraft) {
        return NextResponse.json({ success: true, draft: null });
      }

      return NextResponse.json({
        success: true,
        draft: {
          ...rawDraft,
          isLocked: false,
          lockReason: "",
          timeUntilLockText: "",
        },
      });
    }

    // 3. If eventType is specified (e.g. WEDDING or BIRTHDAY), find matching profile
    let draft = null;
    if (eventTypeParam) {
      draft = await prisma.userDraftDetails.findFirst({
        where: {
          userId: user.id,
          eventType: { equals: eventTypeParam, mode: "insensitive" },
          isActive: true,
        },
      });

      if (!draft) {
        draft = await prisma.userDraftDetails.findFirst({
          where: {
            userId: user.id,
            eventType: { equals: eventTypeParam, mode: "insensitive" },
          },
          orderBy: { updatedAt: "desc" },
        });
      }
    } else {
      // Default: Return the active profile (or latest updated profile)
      draft = await prisma.userDraftDetails.findFirst({
        where: { userId: user.id, isActive: true },
      });

      if (!draft) {
        draft = await prisma.userDraftDetails.findFirst({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        });
      }
    }

    if (draft) {
      let locations = [];
      try {
        locations = JSON.parse(draft.locationsJson || "[]");
      } catch {}

      let functions = [];
      try {
        functions = JSON.parse(draft.functionsJson || "[]");
      } catch {}

      let timelineItems = [];
      try {
        timelineItems = JSON.parse(draft.dayTimelineJson || "[]");
      } catch {}

      let galleryImages = [];
      try {
        galleryImages = JSON.parse(draft.galleryImagesJson || "[]");
      } catch {}

      let completedFields = [];
      try {
        completedFields = JSON.parse(draft.completedFields || "[]");
      } catch {}

      const formattedDraft = {
        ...draft,
        locations,
        functions,
        timelineItems,
        galleryImages,
        completedFields,
        isLocked: false,
        lockReason: "",
        timeUntilLockText: "",
      };

      return NextResponse.json({
        success: true,
        draft: formattedDraft,
      });
    }

    return NextResponse.json({
      success: true,
      draft: null,
    });
  } catch (error: unknown) {
    console.error("GET /api/user/event-draft error:", error);
    return NextResponse.json(
      { success: false, draft: null, error: (error as Error)?.message || "Failed to fetch event draft" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      id,
      invitationId,
      isInvitationInstance,
      profileName,
      isActive = true,
      eventType = "WEDDING",
      hostNameOne,
      hostNameTwo,
      coupleInitials,
      eventTitle,
      inviteLine,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      venueMapUrl,
      venueTwoName,
      venueTwoAddress,
      venueTwoMapUrl,
      tagline,
      turningAge,
      dressCode,
      rsvpContact,
      loveStoryText,
      loveStoryVideoUrl,
      coverImage,
      coupleImage,
      partnerTwoImage,
      venueImage,
      additionalNotes,
      extractedFromDoc = false,
      completedFields = [],
      currentStep = 1,
      isComplete = false,
    } = body;

    const hasLocations = body.locations !== undefined || body.locationsJson !== undefined;
    const locationsJson = Array.isArray(body.locations)
      ? JSON.stringify(body.locations)
      : typeof body.locations === "string"
      ? body.locations
      : typeof body.locationsJson === "string"
      ? body.locationsJson
      : "[]";

    const hasGallery = body.galleryImages !== undefined || body.galleryImagesJson !== undefined;
    const galleryImagesJson = Array.isArray(body.galleryImages)
      ? JSON.stringify(body.galleryImages)
      : typeof body.galleryImages === "string"
      ? body.galleryImages
      : typeof body.galleryImagesJson === "string"
      ? body.galleryImagesJson
      : "[]";

    const hasFunctions = body.functions !== undefined || body.functionsJson !== undefined;
    const functionsJson = Array.isArray(body.functions)
      ? JSON.stringify(body.functions)
      : typeof body.functions === "string"
      ? body.functions
      : typeof body.functionsJson === "string"
      ? body.functionsJson
      : "[]";

    const hasTimeline = body.timelineItems !== undefined || body.dayTimelineJson !== undefined;
    const dayTimelineJson = Array.isArray(body.timelineItems)
      ? JSON.stringify(body.timelineItems)
      : typeof body.timelineItems === "string"
      ? body.timelineItems
      : typeof body.dayTimelineJson === "string"
      ? body.dayTimelineJson
      : "[]";

    const completedFieldsJson = Array.isArray(completedFields)
      ? JSON.stringify(completedFields)
      : typeof completedFields === "string"
      ? completedFields
      : "[]";

    if (!session?.user?.email) {
      return NextResponse.json({
        success: true,
        message: "Draft saved locally (unauthenticated)",
        draft: body,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ── CASE A: Update Dedicated Owned Invitation Instance ──
    const targetInvId = invitationId || (isInvitationInstance ? id : null);
    if (targetInvId) {
      const existingInv = await prisma.userInvitation.findFirst({
        where: { id: targetInvId, userId: user.id },
      });

      if (existingInv) {
        let existingSocialLinks: Record<string, unknown> = {};
        try {
          existingSocialLinks = JSON.parse(existingInv.socialLinksJson || "{}");
        } catch {}

        if (body.showVideo !== undefined) {
          existingSocialLinks.showVideo = Boolean(body.showVideo);
        }

        let targetSlug = undefined;
        if (body.customSlug && body.customSlug.trim() !== "") {
          const formattedSlug = body.customSlug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)+/g, "");
          const existingSlug = await prisma.userInvitation.findFirst({
            where: { slug: formattedSlug, NOT: { id: targetInvId } },
          });
          if (!existingSlug) {
            targetSlug = formattedSlug;
          }
        }

        const updatedInv = await prisma.userInvitation.update({
          where: { id: targetInvId },
          data: {
            ...(targetSlug && { slug: targetSlug }),
            ...(hostNameOne !== undefined && { partnerOne: hostNameOne }),
            ...(hostNameTwo !== undefined && { partnerTwo: hostNameTwo }),
            ...(coupleInitials !== undefined && { coupleInitials }),
            ...(tagline !== undefined && { tagline }),
            ...(inviteLine !== undefined && { inviteLine }),
            ...(eventDate !== undefined && { weddingDate: eventDate }),
            ...(eventTime !== undefined && { weddingTime: eventTime }),
            ...(venueName !== undefined && { venuePlace: `${venueName || ""}${venueAddress ? `, ${venueAddress}` : ""}`.trim() }),
            ...(coverImage !== undefined && { heroImage: coverImage }),
            ...(coupleImage !== undefined && { coupleImage }),
            ...(partnerTwoImage !== undefined && { partnerTwoImage }),
            ...(loveStoryText !== undefined && { loveStoryText }),
            ...(loveStoryVideoUrl !== undefined && { loveStoryVideoUrl: body.showVideo === false ? "" : loveStoryVideoUrl }),
            ...(rsvpContact !== undefined && { contactPhone: rsvpContact }),
            socialLinksJson: JSON.stringify(existingSocialLinks),
            ...(hasLocations && { locationsJson }),
            ...(hasFunctions && { eventsJson: functionsJson }),
            ...(hasGallery && { galleryImagesJson }),
            ...(hasTimeline && { timelineDayJson: dayTimelineJson }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "Owned invitation details updated successfully",
          draft: {
            ...body,
            id: updatedInv.id,
            invitationId: updatedInv.id,
          },
        });
      }
    }

    // ── CASE B: Update Common Event Profile (UserDraftDetails) ──
    const draftData = {
      ...(profileName !== undefined && { profileName }),
      isActive,
      eventType,
      ...(hostNameOne !== undefined && { hostNameOne }),
      ...(hostNameTwo !== undefined && { hostNameTwo }),
      ...(coupleInitials !== undefined && { coupleInitials }),
      ...(eventTitle !== undefined && { eventTitle }),
      ...(inviteLine !== undefined && { inviteLine }),
      ...(eventDate !== undefined && { eventDate }),
      ...(eventTime !== undefined && { eventTime }),
      ...(venueName !== undefined && { venueName }),
      ...(venueAddress !== undefined && { venueAddress }),
      ...(venueMapUrl !== undefined && { venueMapUrl }),
      ...(venueTwoName !== undefined && { venueTwoName }),
      ...(venueTwoAddress !== undefined && { venueTwoAddress }),
      ...(venueTwoMapUrl !== undefined && { venueTwoMapUrl }),
      ...(hasLocations && { locationsJson }),
      ...(tagline !== undefined && { tagline }),
      ...(turningAge !== undefined && { turningAge }),
      ...(dressCode !== undefined && { dressCode }),
      ...(rsvpContact !== undefined && { rsvpContact }),
      ...(loveStoryText !== undefined && { loveStoryText }),
      ...(loveStoryVideoUrl !== undefined && { loveStoryVideoUrl }),
      ...(coverImage !== undefined && { coverImage }),
      ...(coupleImage !== undefined && { coupleImage }),
      ...(partnerTwoImage !== undefined && { partnerTwoImage }),
      ...(venueImage !== undefined && { venueImage }),
      ...(hasGallery && { galleryImagesJson }),
      ...(hasFunctions && { functionsJson }),
      ...(hasTimeline && { dayTimelineJson }),
      ...(additionalNotes !== undefined && { additionalNotes }),
      ...(extractedFromDoc !== undefined && { extractedFromDoc }),
      ...(completedFields !== undefined && { completedFields: completedFieldsJson }),
      currentStep,
      isComplete,
    };

    if (isActive) {
      await prisma.userDraftDetails.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      });
    }

    let draft;

    if (id) {
      draft = await prisma.userDraftDetails.update({
        where: { id },
        data: draftData,
      });
    } else {
      const existingProfilesCount = await prisma.userDraftDetails.count({
        where: { userId: user.id },
      });

      const totalAllowedTemplates = Math.max(0, (user.allowedTemplatesCount || 0) + ((user as unknown as { allowedCinematicCount?: number }).allowedCinematicCount || 0));
      const isAdmin = user.email === "berglin1998@gmail.com" || user.role === "ADMIN";
      const hasActivePlan = (user.plan && user.plan !== "NONE") || totalAllowedTemplates > 0;
      const maxAllowedProfiles = isAdmin ? 99 : (hasActivePlan ? Math.max(2, totalAllowedTemplates) : 1);

      if (existingProfilesCount >= maxAllowedProfiles) {
        return NextResponse.json(
          {
            success: false,
            error: "SUBSCRIPTION_REQUIRED",
            message: `An active subscription or template slot is required to create multiple event profiles (e.g. Wedding + Birthday). Upgrade now to add more celebration profiles!`,
            maxAllowedProfiles,
            totalAllowedTemplates,
            existingProfilesCount,
          },
          { status: 403 }
        );
      }

      // Check if user already has an active profile of the same eventType
      const normalizedType = (eventType || "WEDDING").toUpperCase();
      const existingSameType = await prisma.userDraftDetails.findFirst({
        where: {
          userId: user.id,
          eventType: { equals: normalizedType, mode: "insensitive" },
        },
      });

      if (existingSameType) {
        return NextResponse.json(
          {
            success: false,
            error: "DUPLICATE_EVENT_TYPE",
            message: `You already have a ${normalizedType === "WEDDING" ? "Wedding" : "Birthday"} celebration profile. Please edit your existing profile instead of creating a duplicate!`,
          },
          { status: 400 }
        );
      }

      draft = await prisma.userDraftDetails.create({
        data: {
          userId: user.id,
          ...draftData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Event profile saved successfully",
      draft,
    });
  } catch (error: unknown) {
    console.error("POST /api/user/event-draft error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save event draft" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("id");

    if (!profileId) {
      return NextResponse.json(
        { success: false, message: "Profile ID required" },
        { status: 400 }
      );
    }

    await prisma.userDraftDetails.delete({
      where: { id: profileId, userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/user/event-draft error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
