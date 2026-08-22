import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth } from "@/lib/adminAuth";

interface DynamicPrismaModel {
  findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("ORDERS_MANAGE");

    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { id } = await context.params;

    const order = await db.cardOrder.findUnique({
      where: { id },
      include: {
        items: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    console.error("Admin Order Detail GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
