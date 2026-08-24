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

    const { id: orderId } = await context.params;
    const body = await req.json();

    const {
      action,
      itemId,
      copies,
      cardDetails,
      cardDetailsJson,
      elements,
      elementsJson,
      customNotes,
      previewImage,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      pincode,
    } = body;

    if ((action === "update_item" || action === "set_price") && itemId) {
      const updateData: Record<string, unknown> = {};

      if (copies !== undefined && typeof copies === "number") {
        updateData.copies = copies;
      }

      if (body.price !== undefined) {
        updateData.price = Math.round(Number(body.price) || 0);
      }

      if (cardDetails !== undefined) {
        updateData.cardDetailsJson = typeof cardDetails === "string" ? cardDetails : JSON.stringify(cardDetails);
      } else if (cardDetailsJson !== undefined) {
        updateData.cardDetailsJson = cardDetailsJson;
      }

      if (elements !== undefined) {
        updateData.elementsJson = typeof elements === "string" ? elements : JSON.stringify(elements);
      } else if (elementsJson !== undefined) {
        updateData.elementsJson = elementsJson;
      }

      if (customNotes !== undefined) {
        updateData.customNotes = customNotes;
      }

      if (previewImage !== undefined) {
        updateData.previewImage = previewImage;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).cardOrderItem.update({
        where: { id: itemId },
        data: updateData,
      });

      // Recalculate total copies & total amount
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allItems = await (prisma as any).cardOrderItem.findMany({
        where: { orderId },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalCopies = allItems.reduce((acc: number, it: any) => acc + (it.copies || 1), 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calculatedTotalAmount = allItems.reduce((acc: number, it: any) => acc + ((it.price || 0) * (it.copies || 1)), 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).cardOrder.update({
        where: { id: orderId },
        data: {
          totalCopies,
          totalAmount: body.totalAmount !== undefined ? Math.round(Number(body.totalAmount) || 0) : calculatedTotalAmount,
        },
      });

      // Also update delivery fields if provided
      const deliveryUpdate: Record<string, unknown> = {};
      if (customerName || body.deliveryName) deliveryUpdate.customerName = customerName || body.deliveryName;
      if (customerPhone || body.deliveryPhone) deliveryUpdate.customerPhone = customerPhone || body.deliveryPhone;
      if (customerEmail || body.deliveryEmail) deliveryUpdate.customerEmail = customerEmail || body.deliveryEmail;
      if (deliveryAddress) deliveryUpdate.deliveryAddress = deliveryAddress;
      if (city || body.deliveryCity) deliveryUpdate.city = city || body.deliveryCity;
      if (pincode || body.deliveryPincode) deliveryUpdate.pincode = pincode || body.deliveryPincode;

      if (Object.keys(deliveryUpdate).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).cardOrder.update({
          where: { id: orderId },
          data: deliveryUpdate,
        });
      }
    } else if (action === "update_order") {
      const orderUpdate: Record<string, unknown> = {};
      if (customerName || body.deliveryName) orderUpdate.customerName = customerName || body.deliveryName;
      if (customerPhone || body.deliveryPhone) orderUpdate.customerPhone = customerPhone || body.deliveryPhone;
      if (customerEmail || body.deliveryEmail) orderUpdate.customerEmail = customerEmail || body.deliveryEmail;
      if (deliveryAddress) orderUpdate.deliveryAddress = deliveryAddress;
      if (city || body.deliveryCity) orderUpdate.city = city || body.deliveryCity;
      if (pincode || body.deliveryPincode) orderUpdate.pincode = pincode || body.deliveryPincode;

      if (Object.keys(orderUpdate).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).cardOrder.update({
          where: { id: orderId },
          data: orderUpdate,
        });
      }
    }

    const updatedOrder = await db.cardOrder.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    console.error("Admin Order Detail PATCH Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
