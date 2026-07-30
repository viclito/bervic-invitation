import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to save invitations." },
        { status: 401 }
      );
    }

    // Ensure database user exists
    let dbUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: { invitations: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: session.user.name || "User",
          email: session.user.email.toLowerCase(),
          image: session.user.image,
          emailVerified: new Date(),
        },
        include: { invitations: true },
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

    // 1. Subscription Active Check
    const now = new Date();
    const isSubscribed = !!(dbUser.planExpiresAt && new Date(dbUser.planExpiresAt) > now);

    if (!isSubscribed) {
      return NextResponse.json(
        {
          error: "PAYMENT_REQUIRED",
          message: "Active plan required to save & publish invitations. Please choose a plan (₹299 for 6 months or ₹999 for 1 year).",
        },
        { status: 402 }
      );
    }

    // 2. Template Lock & Slot Quota Checks
    if (invitationId) {
      // Editing existing invitation
      const existingInv = await prisma.userInvitation.findFirst({
        where: { id: invitationId, userId },
      });

      if (existingInv && existingInv.templateSlug !== templateSlug) {
        return NextResponse.json(
          {
            error: "TEMPLATE_LOCKED",
            message: `Template locked! This slot is locked to template "${existingInv.templateSlug}" and cannot be changed to another template. You can edit all details (names, dates, photos, venue) of your chosen template as many times as you like!`,
          },
          { status: 400 }
        );
      }
    } else {
      // Creating new invitation slot
      if (dbUser.invitations.length >= dbUser.allowedTemplatesCount) {
        return NextResponse.json(
          {
            error: "QUOTA_EXCEEDED",
            message: `You have used all ${dbUser.allowedTemplatesCount} template slot(s) in your current plan (${dbUser.plan === 'BASIC_299' ? '₹299 Basic' : '₹999 Pro'}). Upgrade to unlock additional template slots!`,
          },
          { status: 402 }
        );
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
          heroImage,
          coupleImage,
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
          heroImage,
          coupleImage,
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
