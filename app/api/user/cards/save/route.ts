import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cards: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const now = new Date();
    const isSubscribed = !!(user.planExpiresAt && new Date(user.planExpiresAt) > now);

    if (!isSubscribed) {
      return NextResponse.json(
        { error: "An active subscription plan is required to download Instagram Announcement Cards." },
        { status: 403 }
      );
    }

    const usedCardsCount = user.cards.length;
    if (usedCardsCount >= user.allowedCardsCount) {
      return NextResponse.json(
        {
          error: `Card download quota reached (${usedCardsCount} of ${user.allowedCardsCount} cards used). Please upgrade your subscription to download additional cards.`,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      templateId,
      templateName,
      partnerOne,
      partnerTwo,
      weddingDate,
      weddingTime,
      venue,
      city,
      tagline,
      couplePhoto,
      hashtag,
    } = body;

    // Check if user already saved this exact card previously
    const existingCard = await prisma.userCard.findFirst({
      where: {
        userId: user.id,
        templateId: Number(templateId),
        partnerOne: partnerOne || "Sophia",
        partnerTwo: partnerTwo || "Alexander",
      },
    });

    if (existingCard) {
      return NextResponse.json({
        success: true,
        message: "Card already recorded in your subscription.",
        card: existingCard,
        remainingCardSlots: Math.max(0, user.allowedCardsCount - usedCardsCount),
      });
    }

    // Save new card to database (deducts 1 credit count)
    const newCard = await prisma.userCard.create({
      data: {
        userId: user.id,
        templateId: Number(templateId) || 1,
        templateName: templateName || `Template #${templateId}`,
        partnerOne: partnerOne || "Sophia",
        partnerTwo: partnerTwo || "Alexander",
        weddingDate: weddingDate || "August 14, 2025",
        weddingTime: weddingTime || "4:00 PM",
        venue: venue || "The Grand Chapel",
        city: city || "Bangalore, India",
        tagline: tagline || "Together Forever",
        couplePhoto: couplePhoto || "/images/templates/couple-photo.jpg",
        hashtag: hashtag || "#ForeverTogether",
        cardDataJson: JSON.stringify(body),
      },
    });

    const updatedUsedCount = usedCardsCount + 1;
    const remainingCardSlots = Math.max(0, user.allowedCardsCount - updatedUsedCount);

    return NextResponse.json({
      success: true,
      message: "Card recorded successfully!",
      card: newCard,
      usedCardsCount: updatedUsedCount,
      remainingCardSlots,
    });
  } catch (error: any) {
    console.error("Error saving downloaded card:", error);
    return NextResponse.json({ error: "Failed to record downloaded card." }, { status: 500 });
  }
}
