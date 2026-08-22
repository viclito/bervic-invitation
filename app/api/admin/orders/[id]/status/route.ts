import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { sendUserOrderStatusUpdate, OrderEmailPayload } from "@/lib/mail";
import { getAdminAuth } from "@/lib/adminAuth";

interface DynamicPrismaModel {
  update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function PATCH(
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
    const body = await req.json();
    const { status, note } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const updatedOrder = await db.cardOrder.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    // Send status update email to user asynchronously
    try {
      await sendUserOrderStatusUpdate(updatedOrder as unknown as OrderEmailPayload, status, note);
    } catch (mailErr) {
      console.error("Status email dispatch error (non-fatal):", mailErr);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    console.error("Admin Order Status Update Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to update order status" }, { status: 500 });
  }
}
