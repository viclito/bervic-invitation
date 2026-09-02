import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { calculateShippingByPincode } from "@/lib/shipping/distance";
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
  draftFileUrl?: string | null;
  draftFileName?: string | null;
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
    const cardsSubtotal = typedItems.reduce((acc, it) => {
      let printingFee = 0;
      if (typeof it.cardDetails === "string") {
        try {
          const parsed = JSON.parse(it.cardDetails);
          printingFee = Number(parsed.totalPrintingChangeFee) || 0;
        } catch {}
      } else if (it.cardDetails && typeof it.cardDetails === "object") {
        printingFee = Number((it.cardDetails as any).totalPrintingChangeFee) || 0;
      }
      return acc + (Number(it.price) || 0) * (Number(it.copies) || 1) + printingFee;
    }, 0);

    // Calculate distance-based shipping fee from Kanyakumari
    const shippingCalc = calculateShippingByPincode(trimmedPincode);
    const shippingFee = shippingCalc.shippingFee;
    const totalAmount = cardsSubtotal + shippingFee;
    const orderNumber = generateOrderNumber();

    // Create the Order with Dual-Tier Resilient Engine
    let orderRecord: any = null;

    try {
      orderRecord = await db.cardOrder.create({
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
          shippingFee,
          paymentStatus: "PENDING",
          notes: notes ? String(notes).trim() : null,
          items: {
            create: typedItems.map((it) => {
              let parsedDetails: Record<string, unknown> = {};
              if (typeof it.cardDetails === "string") {
                try {
                  parsedDetails = JSON.parse(it.cardDetails);
                } catch {}
              } else if (it.cardDetails && typeof it.cardDetails === "object") {
                parsedDetails = it.cardDetails as Record<string, unknown>;
              }

              const draftFileUrl =
                it.draftFileUrl || (parsedDetails.uploadedFileUrl as string) || null;
              const draftFileName =
                it.draftFileName || (parsedDetails.uploadedFileName as string) || null;

              return {
                itemType: it.itemType || "CANVA_CARD",
                templateId: String(it.templateId || "custom"),
                templateName: String(it.templateName || "Custom Card"),
                previewImage: it.previewImage || null,
                copies: Math.max(1, Number(it.copies) || 1),
                cardDetailsJson:
                  typeof it.cardDetails === "string"
                    ? it.cardDetails
                    : JSON.stringify(it.cardDetails || {}),
                elementsJson:
                  typeof it.elements === "string"
                    ? it.elements
                    : JSON.stringify(it.elements || []),
                customNotes: it.customNotes ? String(it.customNotes).trim() : null,
                draftFileUrl,
                draftFileName,
                price: Number(it.price) || 0,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });
    } catch (primaryErr: any) {
      console.warn("Primary Prisma cardOrder.create error, engaging resilient direct SQL fallback:", primaryErr?.message);

      const generatedId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "CardOrder" (
          "id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone",
          "deliveryAddress", "city", "pincode", "status", "totalCopies", "totalAmount",
          "shippingFee", "paymentStatus", "notes", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', $10, $11, $12, 'PENDING', $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
      `,
        generatedId,
        orderNumber,
        user.id,
        trimmedName,
        trimmedEmail,
        sanitizedPhone,
        trimmedAddress,
        city ? String(city).trim() : null,
        pincode ? String(pincode).trim() : null,
        totalCopies,
        totalAmount,
        shippingFee,
        notes ? String(notes).trim() : null
      );

      const itemsCreated: any[] = [];
      for (const it of typedItems) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        let parsedDetails: Record<string, unknown> = {};
        if (typeof it.cardDetails === "string") {
          try {
            parsedDetails = JSON.parse(it.cardDetails);
          } catch {}
        } else if (it.cardDetails && typeof it.cardDetails === "object") {
          parsedDetails = it.cardDetails as Record<string, unknown>;
        }

        const draftFileUrl = it.draftFileUrl || (parsedDetails.uploadedFileUrl as string) || null;
        const draftFileName = it.draftFileName || (parsedDetails.uploadedFileName as string) || null;
        const cardDetailsJson = typeof it.cardDetails === "string" ? it.cardDetails : JSON.stringify(it.cardDetails || {});
        const elementsJson = typeof it.elements === "string" ? it.elements : JSON.stringify(it.elements || []);
        const itemCopies = Math.max(1, Number(it.copies) || 1);
        const itemPrice = Number(it.price) || 0;

        await prisma.$executeRawUnsafe(`
          INSERT INTO "CardOrderItem" (
            "id", "orderId", "itemType", "templateId", "templateName", "previewImage",
            "copies", "cardDetailsJson", "elementsJson", "customNotes", "draftFileUrl",
            "draftFileName", "price", "createdAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP
          );
        `,
          itemId,
          generatedId,
          it.itemType || "CANVA_CARD",
          String(it.templateId || "custom"),
          String(it.templateName || "Custom Card"),
          it.previewImage || null,
          itemCopies,
          cardDetailsJson,
          elementsJson,
          it.customNotes ? String(it.customNotes).trim() : null,
          draftFileUrl,
          draftFileName,
          itemPrice
        );

        itemsCreated.push({
          id: itemId,
          orderId: generatedId,
          itemType: it.itemType || "CANVA_CARD",
          templateName: it.templateName || "Custom Card",
          previewImage: it.previewImage || null,
          copies: itemCopies,
          customNotes: it.customNotes || null,
          draftFileUrl,
          draftFileName,
          price: itemPrice,
        });
      }

      orderRecord = {
        id: generatedId,
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
        shippingFee,
        paymentStatus: "PENDING",
        notes: notes ? String(notes).trim() : null,
        items: itemsCreated,
      };
    }

    const orderPayload = orderRecord as unknown as OrderEmailPayload & { id: string; items?: OrderItemEmailPayload[] };

    // If checked out from cart, delete user's cart items
    if (isCartCheckout) {
      try {
        await db.cartItem.deleteMany({
          where: { userId: user.id },
        });
      } catch (cartDelErr) {
        console.warn("Cart items cleanup warning (non-fatal):", cartDelErr);
      }
    }

    // Create initial welcome message from Admin/Design Team
    try {
      const welcomeMessageText = `Hello ${trimmedName}! 👋\n\nThank you for choosing Bervic Invitations! We have successfully received your order #${orderPayload.orderNumber}.\n\nOur design specialists are currently preparing your digital invitation proof. Our team will contact you shortly via WhatsApp (${sanitizedPhone}) and Email to share the design draft for your review and approval before printing begins.\n\nIf you have any specific wording requests or questions, please feel free to message us right here!`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "OrderMessage" ("id", "orderId", "sender", "message", "createdAt")
        VALUES ($1, $2, 'ADMIN', $3, CURRENT_TIMESTAMP)
        ON CONFLICT ("id") DO NOTHING;
      `,
        `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderPayload.id,
        welcomeMessageText
      );
    } catch (msgErr) {
      console.warn("Initial order message creation warning (non-fatal):", msgErr);
    }

    // Trigger dual email notifications (Admin & User) asynchronously without blocking response
    try {
      Promise.allSettled([
        sendAdminNewOrderNotification(orderPayload, orderPayload.items || []),
        sendUserOrderConfirmation(orderPayload, orderPayload.items || []),
      ]).catch((mailErr) => console.warn("Background order email warning:", mailErr));
    } catch (mailErr) {
      console.warn("Order notification email error (non-fatal):", mailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderPayload.orderNumber,
      orderId: orderPayload.id,
      message: "Order placed successfully! Our design team will contact you shortly with the preview for your approval.",
    });
  } catch (err: unknown) {
    console.error("Order Creation Fatal Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to place order" }, { status: 500 });
  }
}
