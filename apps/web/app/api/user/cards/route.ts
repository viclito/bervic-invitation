import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const authUser = await getAuthUser(req);

    if (!authUser) {
      return NextResponse.json({ success: true, cards: [], count: 0, isGuest: true });
    }

    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("id");

    if (cardId) {
      const card = await prisma.userCard.findFirst({
        where: { id: cardId, userId: authUser.id },
      });

      if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, card, isGuest: false });
    }

    const cards = await prisma.userCard.findMany({
      where: { userId: authUser.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      cards,
      count: cards.length,
      isGuest: false,
    });
  } catch (error: any) {
    console.error("GET /api/user/cards error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load saved cards", cards: [] },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const authUser = await getAuthUser(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let cardId = searchParams.get("id");

    if (!cardId) {
      try {
        const body = await req.json();
        cardId = body.id || body.cardId;
      } catch {}
    }

    if (!cardId) {
      return NextResponse.json({ error: "Missing card ID" }, { status: 400 });
    }

    const existing = await prisma.userCard.findFirst({
      where: { id: cardId, userId: authUser.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Card not found or unauthorized to delete" },
        { status: 404 }
      );
    }

    await prisma.userCard.delete({
      where: { id: cardId },
    });

    return NextResponse.json({
      success: true,
      message: "Card deleted from your gallery",
    });
  } catch (error: any) {
    console.error("DELETE /api/user/cards error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete card" },
      { status: 500 }
    );
  }
}
