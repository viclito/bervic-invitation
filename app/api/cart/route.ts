import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

interface DynamicPrismaModel {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteMany: (args: Record<string, unknown>) => Promise<{ count: number }>;
}

type ExtendedPrismaClient = typeof prisma & {
  cartItem: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function GET() {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const items = await db.cartItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err: unknown) {
    console.error("Cart GET Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to fetch cart items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to add to cart." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      itemType = "CANVA_CARD",
      templateId,
      templateName,
      previewImage,
      copies = 1,
      cardDetails,
      elements,
      customNotes = "",
      price = 0,
    } = body;

    if (!templateId || !templateName) {
      return NextResponse.json({ error: "Template information is required" }, { status: 400 });
    }

    const cartItem = await db.cartItem.create({
      data: {
        userId: user.id,
        itemType,
        templateId: String(templateId),
        templateName: String(templateName),
        previewImage: previewImage || null,
        copies: Math.max(1, Number(copies) || 1),
        cardDetailsJson: typeof cardDetails === "string" ? cardDetails : JSON.stringify(cardDetails || {}),
        elementsJson: typeof elements === "string" ? elements : JSON.stringify(elements || []),
        customNotes: String(customNotes || ""),
        price: Number(price) || 0,
      },
    });

    return NextResponse.json({ success: true, item: cartItem });
  } catch (err: unknown) {
    console.error("Cart POST Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to add item to cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (itemId) {
      // Delete single item with multi-tenant ownership check
      await db.cartItem.deleteMany({
        where: {
          id: itemId,
          userId: user.id,
        },
      });
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    } else {
      // Clear entire cart for user
      await db.cartItem.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ success: true, message: "Cart cleared" });
    }
  } catch (err: unknown) {
    console.error("Cart DELETE Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to delete cart item" }, { status: 500 });
  }
}
