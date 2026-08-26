import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { sendAdminNewOrderNotification, sendUserOrderConfirmation, OrderEmailPayload, OrderItemEmailPayload } from "@/lib/mail";

interface DynamicPrismaModel {
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteMany: (args: Record<string, unknown>) => Promise<{ count: number }>;
}

type ExtendedPrismaClient = typeof prisma & {
  cardOrder: DynamicPrismaModel;
  cartItem: DynamicPrismaModel;
};

const db = prisma as unknown as ExtendedPrismaClient;

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `BV-${dateStr}-${randomSuffix}`;
}

interface IncomingOrderItem {
  itemType?: string;
  templateId?: string;
  templateName?: string;
  previewImage?: string | null;
  copies?: number;
  cardDetails?: Record<string, unknown> | string;
  elements?: unknown[] | string;
  customNotes?: string | null;
  price?: number;
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const authUser = await getAuthUser(req);

    if (!authUser || !authUser.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to place an order." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, name: true, email: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      city,
      pincode,
      notes = "",
      items = [],
      isCartCheckout = false,
    } = body;

    // 1. Validate Customer Name
    const trimmedName = String(customerName || user.name || "Valued Customer").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: "Please enter a valid customer name (minimum 2 characters)." }, { status: 400 });
    }

    // 2. Validate Customer Phone
    const rawPhone = String(customerPhone || user.phone || "").trim();
    const phoneDigits = rawPhone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit WhatsApp or contact phone number." }, { status: 400 });
    }
    const sanitizedPhone = phoneDigits.length > 15 ? phoneDigits.slice(-10) : rawPhone;

    // 3. Validate Customer Email (if provided)
    const trimmedEmail = String(customerEmail || user.email || "").trim().toLowerCase();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // 4. Validate Delivery Address
    const trimmedAddress = String(deliveryAddress || "").trim();
    if (!trimmedAddress || trimmedAddress.length < 3) {
      return NextResponse.json({ error: "Please enter your delivery / shipping address." }, { status: 400 });
    }

    const trimmedCity = String(city || "").trim();
    if (!trimmedCity) {
      return NextResponse.json({ error: "Please enter your City / District / State." }, { status: 400 });
    }

    const trimmedPincode = String(pincode || "").trim();
    const pincodeDigits = trimmedPincode.replace(/\D/g, "");
    if (!trimmedPincode || pincodeDigits.length !== 6) {
      return NextResponse.json({ error: "Please enter a valid 6-digit postal pincode." }, { status: 400 });
    }

    // 5. Validate Items Array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided for ordering." }, { status: 400 });
    }

    const typedItems: IncomingOrderItem[] = items;
    for (const it of typedItems) {
      const copiesNum = Number(it.copies);
      if (isNaN(copiesNum) || copiesNum < 1) {
        return NextResponse.json({ error: `Invalid quantity for item "${it.templateName || "Custom Card"}". Minimum is 1 copy.` }, { status: 400 });
      }
    }

    const totalCopies = typedItems.reduce((acc, it) => acc + (Math.max(1, Number(it.copies) || 1)), 0);
    const totalAmount = typedItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.copies) || 1), 0);
    const orderNumber = generateOrderNumber();

    // Create the Order
    const orderRecord = await db.cardOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: trimmedName,
        customerEmail: trimmedEmail,
        customerPhone: sanitizedPhone,
        deliveryAddress: trimmedAddress,
        city: city ? String(city).trim() : null,
        pincode: pincode ? String(pincode).trim() : null,
        status: "PENDING",
        totalCopies,
        totalAmount,
        paymentStatus: "PENDING",
        notes: notes ? String(notes).trim() : null,
        items: {
          create: typedItems.map((it) => ({
            itemType: it.itemType || "CANVA_CARD",
            templateId: String(it.templateId || "custom"),
            templateName: String(it.templateName || "Custom Card"),
            previewImage: it.previewImage || null,
            copies: Math.max(1, Number(it.copies) || 1),
            cardDetailsJson: typeof it.cardDetails === "string" ? it.cardDetails : JSON.stringify(it.cardDetails || {}),
            elementsJson: typeof it.elements === "string" ? it.elements : JSON.stringify(it.elements || []),
            customNotes: it.customNotes ? String(it.customNotes).trim() : null,
            price: Number(it.price) || 0,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const orderPayload = orderRecord as unknown as OrderEmailPayload & { id: string; items?: OrderItemEmailPayload[] };

    // If checked out from cart, delete user's cart items
    if (isCartCheckout) {
      await db.cartItem.deleteMany({
        where: { userId: user.id },
      });
    }

    // Trigger dual email notifications (Admin & User) asynchronously
    try {
      await Promise.allSettled([
        sendAdminNewOrderNotification(orderPayload, orderPayload.items || []),
        sendUserOrderConfirmation(orderPayload, orderPayload.items || []),
      ]);
    } catch (mailErr) {
      console.error("Order notification email error (non-fatal):", mailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderPayload.orderNumber,
      orderId: orderPayload.id,
      message: "Order placed successfully!",
    });
  } catch (err: unknown) {
    console.error("Order Creation Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to place order" }, { status: 500 });
  }
}
