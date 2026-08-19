import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

interface DynamicPrismaModel {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function GET() {
  try {
    await ensureDbSchema();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    // Query orders matching user ID or email for absolute multi-tenant safety
    const orders = await db.cardOrder.findMany({
      where: {
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    console.error("User Orders GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
