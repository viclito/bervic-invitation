import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

interface DynamicPrismaModel {
  findFirst: (args?: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id } = await props.params;
    if (!id) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const userEmail = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const order = await db.cardOrder.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          { customerEmail: userEmail },
        ],
      },
      include: {
        items: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or access denied." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error("User Order Detail GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch order details." },
      { status: 500 }
    );
  }
}
