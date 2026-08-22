import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { sendUserOrderMessageNotification, OrderEmailPayload } from "@/lib/mail";
import { getAdminAuth } from "@/lib/adminAuth";

interface DynamicPrismaModel {
  findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
  orderMessage: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

export async function POST(
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
    const { message } = body;

    if (!message || !String(message).trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const order = await db.cardOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newMessage = await db.orderMessage.create({
      data: {
        orderId: (order as unknown as { id: string }).id,
        sender: "ADMIN",
        message: String(message).trim(),
      },
    });

    // Send email notification to user asynchronously
    try {
      await sendUserOrderMessageNotification(order as unknown as OrderEmailPayload, message);
    } catch (mailErr) {
      console.error("Message email dispatch error (non-fatal):", mailErr);
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: unknown) {
    console.error("Admin Order Message Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to post message" }, { status: 500 });
  }
}
