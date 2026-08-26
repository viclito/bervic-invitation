import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

interface DynamicPrismaModel {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userEmail = user.email.toLowerCase().trim();

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
