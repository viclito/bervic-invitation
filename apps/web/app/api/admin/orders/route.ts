import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

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
    const auth = await getAdminAuth("ORDERS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const orders = await db.cardOrder.findMany({
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
    console.error("Admin Orders GET Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to fetch orders" }, { status: 500 });
  }
}
