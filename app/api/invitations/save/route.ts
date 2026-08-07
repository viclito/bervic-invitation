import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { checkInvitationLockStatus } from "@/lib/lockCheck";

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to save invitations." },
        { status: 401 }
      );
    }

    // Ensure database user exists
    let dbUser: any = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        planExpiresAt: true,
        allowedTemplatesCount: true,
        allowedCinematicCount: true,
        allowedCardsCount: true,
        invitations: {
          select: {
            id: true,
            templateSlug: true,
            slug: true,
          },
        },
        payments: {
          where: { status: "SUCCESS" },
        },
        subscriptions: {
          where: { status: "ACTIVE" },
        },
      },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: session.user.name || "User",
          email: session.user.email.toLowerCase(),
          image: session.user.image,
          emailVerified: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          planExpiresAt: true,
          allowedTemplatesCount: true,
          allowedCinematicCount: true,
          allowedCardsCount: true,
          invitations: {
            select: {
              id: true,
              templateSlug: true,
              slug: true,
            },
          },
          payments: {
            where: { status: "SUCCESS" },
          },
          subscriptions: {
            where: { status: "ACTIVE" },
          },
        },
      });
    }

    const userId = dbUser.id;
    const body = await req.json();

    const {
      templateSlug = "classic-floral",
      coupleInitials = "Y | P",
      partnerOne = "Your Name",
      partnerTwo = "Partner's Name",
      tagline = "TOGETHER WITH THEIR FAMILIES",
      inviteLine = "invite you to celebrate their wedding",
      weddingDate = "2026-11-28T10:30:00.000Z",
      weddingTime = "Saturday, 28th November 2026 at 10:30 AM IST",
      heroImage = "/images/templates/floral-hero.jpg",
      coupleImage = "/images/templates/couple-photo.jpg",
      partnerTwoImage,
      venuePlace = "Your Venue Name, Your City, State",
      events = [],
      timelineDay = [],
      loveStoryText = "",
      loveStoryVideoUrl = "",
      locations = [],
      galleryImages = [],
      contactPhone = "",
      contactAddress = "",
      socialLinks = {},
      invitationId,
      customSlug,
    } = body;

    // Auto-calculate cinematic pass count from actual paid payments or subscriptions if DB column was missed
    const paidCinematicPayments = (dbUser.payments || []).filter(
      (p: any) => p.plan === "CINEMATIC_2000" || p.amount >= 2000
    ).length;
    const paidCinematicSubs = (dbUser.subscriptions || []).filter(
      (s: any) => s.plan === "CINEMATIC_2000" || s.amount >= 2000
    ).length;
    const countFromHistory = Math.max(paidCinematicPayments, paidCinematicSubs);

    let rawDbCinematicCount = (dbUser as any).allowedCinematicCount || 0;
    if (rawDbCinematicCount === 0 && countFromHistory > 0) {
      rawDbCinematicCount = countFromHistory;
      try {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { allowedCinematicCount: countFromHistory },
        });
      } catch {
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "allowedCinematicCount" = $1 WHERE "id" = $2;`,
          countFromHistory,
          dbUser.id
        );
      }
    }
    const dbCinematicCount = rawDbCinematicCount;

    // 1. Subscription Active Check
    const now = new Date();
    const isSubscribed =
      !!(dbUser.planExpiresAt && new Date(dbUser.planExpiresAt) > now) ||
      dbCinematicCount > 0 ||
      (dbUser.payments || []).length > 0 ||
      (dbUser.subscriptions || []).length > 0;

    if (!isSubscribed) {
      return NextResponse.json(
        {
          error: "PAYMENT_REQUIRED",
          message: "Active plan required to save & publish invitations. Please choose a plan (₹599 for Basic, ₹1799 for Pro, or ₹2000 for Cinematic).",
        },
        { status: 402 }
      );
    }

    // 2. Cinematic Template Exclusive Tier Check
    const isCinematicTemplate = templateSlug === "scroll-scrubber";
    const hasCinematicPass = dbUser.plan === "CINEMATIC_2000" || dbCinematicCount > 0;

    if (isCinematicTemplate && dbUser.role !== "ADMIN" && !hasCinematicPass) {
      return NextResponse.json(
        {
          error: "CINEMATIC_PLAN_REQUIRED",
          message: "The 480-Frame Cinematic Scroll Sequence template requires the ₹2000 Cinematic Masterpiece Pass. Please upgrade your plan to unlock this exclusive template!",
        },
        { status: 402 }
      );
    }

    // 3. Template Lock & Slot Quota Checks
    if (invitationId) {
      // Editing existing invitation
      const existingInv: any = await prisma.userInvitation.findFirst({
        where: { id: invitationId, userId },
      });

      if (existingInv) {
        if (existingInv.templateSlug !== templateSlug) {
          return NextResponse.json(
            {
              error: "TEMPLATE_LOCKED",
              message: `Template locked! This slot is locked to template "${existingInv.templateSlug}" and cannot be changed to another template. You can edit all details (names, dates, photos, venue) of your chosen template as many times as you like!`,
            },
            { status: 400 }
          );
        }

        // Anti-Reuse Lock Check: 2 hours prior to wedding event date
        if (dbUser.role !== "ADMIN") {
          const lockStatus = checkInvitationLockStatus({
            createdAt: existingInv.createdAt,
            weddingDate: existingInv.weddingDate,
            isUnlockedByAdmin: (existingInv as any).isUnlockedByAdmin,
          });

          if (lockStatus.isLocked) {
            return NextResponse.json(
              {
                error: "INVITATION_LOCKED_EVENT_EXPIRED",
                message: lockStatus.lockReason || "Editing for this invitation is locked 2 hours prior to your wedding event date to protect invitation data. Please contact Admin if you require an edit unlock.",
              },
              { status: 403 }
            );
          }
        }
      }
    } else {
      // Creating new invitation slot
      const allInvs = dbUser.invitations || [];

      if (isCinematicTemplate) {
        const usedCinematic = allInvs.filter((i: any) => i.templateSlug === "scroll-scrubber").length;
        const allowedCinematic =
          dbUser.role !== "ADMIN"
            ? dbCinematicCount > 0
              ? dbCinematicCount
              : dbUser.plan === "CINEMATIC_2000"
              ? 1
              : 0
            : 99;

        if (usedCinematic >= allowedCinematic) {
          return NextResponse.json(
            {
              error: "QUOTA_EXCEEDED",
              message: `You have used all ${allowedCinematic} Cinematic template slot(s). Purchase an additional ₹2000 Cinematic Pass to create another Cinematic invitation!`,
            },
            { status: 402 }
          );
        }
      } else {
        const usedStandard = allInvs.filter((i: any) => i.templateSlug !== "scroll-scrubber").length;
        const allowedStandard =
          dbUser.role === "ADMIN"
            ? 99
            : dbUser.allowedTemplatesCount > 0
            ? dbUser.allowedTemplatesCount
            : dbUser.plan === "PRO_1799"
            ? 4
            : dbUser.plan === "BASIC_599"
            ? 1
            : 0;

        if (usedStandard >= allowedStandard) {
          return NextResponse.json(
            {
              error: "QUOTA_EXCEEDED",
              message: `You have used all ${allowedStandard} standard template slot(s). Upgrade to unlock additional template slots!`,
            },
            { status: 402 }
          );
        }
      }
    }

    // Handle Custom Slug Route
    let slugToSave = "";

    if (customSlug && customSlug.trim() !== "") {
      const formattedSlug = customSlug
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Check uniqueness if changed
      const existing = await prisma.userInvitation.findFirst({
        where: {
          slug: formattedSlug,
          ...(invitationId ? { NOT: { id: invitationId } } : {}),
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            error: `The link name "${formattedSlug}" is already taken by another invitation. Please try a different URL name!`,
          },
          { status: 400 }
        );
      }

      slugToSave = formattedSlug;
    } else {
      // Default slug generation if empty
      const baseSlug = `${partnerOne}-${partnerTwo}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      slugToSave = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    let invitation;

    if (invitationId) {
      invitation = await prisma.userInvitation.update({
        where: { id: invitationId },
        data: {
          coupleInitials,
          partnerOne,
          partnerTwo,
          tagline,
          inviteLine,
          weddingDate,
          weddingTime,
          heroImage: heroImage || null,
          coupleImage: coupleImage || null,
          partnerTwoImage: partnerTwoImage || null,
          venuePlace,
          eventsJson: JSON.stringify(events),
          timelineDayJson: JSON.stringify(timelineDay),
          loveStoryText,
          loveStoryVideoUrl,
          locationsJson: JSON.stringify(locations),
          galleryImagesJson: JSON.stringify(galleryImages),
          contactPhone,
          contactAddress,
          socialLinksJson: JSON.stringify(socialLinks),
          ...(customSlug ? { slug: slugToSave } : {}),
        },
      });
    } else {
      invitation = await prisma.userInvitation.create({
        data: {
          userId,
          templateSlug,
          coupleInitials,
          partnerOne,
          partnerTwo,
          tagline,
          inviteLine,
          weddingDate,
          weddingTime,
          heroImage: heroImage || null,
          coupleImage: coupleImage || null,
          partnerTwoImage: partnerTwoImage || null,
          venuePlace,
          eventsJson: JSON.stringify(events),
          timelineDayJson: JSON.stringify(timelineDay),
          loveStoryText,
          loveStoryVideoUrl,
          locationsJson: JSON.stringify(locations),
          galleryImagesJson: JSON.stringify(galleryImages),
          contactPhone,
          contactAddress,
          socialLinksJson: JSON.stringify(socialLinks),
          slug: slugToSave,
        },
      });
    }

    return NextResponse.json({
      message: "Invitation saved successfully!",
      invitation,
    });
  } catch (error: any) {
    console.error("Save Invitation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save invitation to database" },
      { status: 500 }
    );
  }
}
