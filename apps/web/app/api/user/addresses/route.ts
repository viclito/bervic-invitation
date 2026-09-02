import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view saved addresses." },
        { status: 401 }
      );
    }

    let addresses: unknown[] = [];
    try {
      const dynamicDb = prisma as unknown as { userAddress?: { findMany: (args: unknown) => Promise<unknown[]> } };
      if (dynamicDb.userAddress && typeof dynamicDb.userAddress.findMany === "function") {
        addresses = await dynamicDb.userAddress.findMany({
          where: { userId: user.id },
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        });
      } else {
        throw new Error("Model not ready on client");
      }
    } catch {
      const rows = await prisma.$queryRawUnsafe<unknown[]>(
        `SELECT * FROM "UserAddress" WHERE "userId" = $1 ORDER BY "isDefault" DESC, "createdAt" DESC`,
        user.id
      );
      addresses = rows || [];
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (err: unknown) {
    console.error("Fetch Addresses Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to load addresses." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to add a delivery address." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, address, city, state, pincode, isDefault } = body;

    const trimmedName = String(name || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: "Please enter a valid recipient name (minimum 2 characters)." }, { status: 400 });
    }

    const rawPhone = String(phone || "").trim();
    const phoneDigits = rawPhone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit WhatsApp or contact phone number." }, { status: 400 });
    }

    const trimmedAddress = String(address || "").trim();
    if (!trimmedAddress || trimmedAddress.length < 5) {
      return NextResponse.json({ error: "Please enter a complete street address with house / flat number." }, { status: 400 });
    }

    const trimmedCity = String(city || "").trim();
    if (!trimmedCity || trimmedCity.length < 2) {
      return NextResponse.json({ error: "Please enter your city / town / district." }, { status: 400 });
    }

    const trimmedPincode = String(pincode || "").replace(/\D/g, "").trim();
    if (!trimmedPincode || trimmedPincode.length !== 6) {
      return NextResponse.json({ error: "Please enter a valid 6-digit postal PIN code." }, { status: 400 });
    }

    let existingCount = 0;
    try {
      const dynamicDb = prisma as unknown as { userAddress?: { count: (args: unknown) => Promise<number> } };
      if (dynamicDb.userAddress && typeof dynamicDb.userAddress.count === "function") {
        existingCount = await dynamicDb.userAddress.count({
          where: { userId: user.id },
        });
      } else {
        throw new Error("Model not ready on client");
      }
    } catch {
      const countRows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::bigint as count FROM "UserAddress" WHERE "userId" = $1`,
        user.id
      );
      existingCount = Number(countRows[0]?.count) || 0;
    }

    const makeDefault = Boolean(isDefault) || existingCount === 0;

    if (makeDefault) {
      try {
        const dynamicDb = prisma as unknown as { userAddress?: { updateMany: (args: unknown) => Promise<unknown> } };
        if (dynamicDb.userAddress && typeof dynamicDb.userAddress.updateMany === "function") {
          await dynamicDb.userAddress.updateMany({
            where: { userId: user.id },
            data: { isDefault: false },
          });
        } else {
          throw new Error("Model not ready on client");
        }
      } catch {
        await prisma.$executeRawUnsafe(
          `UPDATE "UserAddress" SET "isDefault" = false WHERE "userId" = $1`,
          user.id
        );
      }
    }

    const addressId = `addr_${randomUUID().replace(/-/g, "")}`;
    let createdAddress: unknown = null;

    try {
      const dynamicDb = prisma as unknown as { userAddress?: { create: (args: unknown) => Promise<unknown> } };
      if (dynamicDb.userAddress && typeof dynamicDb.userAddress.create === "function") {
        createdAddress = await dynamicDb.userAddress.create({
          data: {
            id: addressId,
            userId: user.id,
            name: trimmedName,
            phone: rawPhone,
            address: trimmedAddress,
            city: trimmedCity,
            state: state ? String(state).trim() : null,
            pincode: trimmedPincode,
            isDefault: makeDefault,
            updatedAt: new Date(),
          },
        });
      } else {
        throw new Error("Model not ready on client");
      }
    } catch {
      const rows = await prisma.$queryRawUnsafe<unknown[]>(
        `INSERT INTO "UserAddress" ("id", "userId", "name", "phone", "address", "city", "state", "pincode", "isDefault", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        addressId,
        user.id,
        trimmedName,
        rawPhone,
        trimmedAddress,
        trimmedCity,
        state ? String(state).trim() : null,
        trimmedPincode,
        makeDefault
      );
      createdAddress = rows[0];
    }

    return NextResponse.json({
      success: true,
      address: createdAddress,
      message: "Delivery address saved to your account!",
    });
  } catch (err: unknown) {
    console.error("Create Address Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to save address." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Address ID is required" }, { status: 400 });

    try {
      const dynamicDb = prisma as unknown as { userAddress?: { deleteMany: (args: unknown) => Promise<unknown> } };
      if (dynamicDb.userAddress && typeof dynamicDb.userAddress.deleteMany === "function") {
        await dynamicDb.userAddress.deleteMany({
          where: { id, userId: user.id },
        });
      } else {
        throw new Error("Model not ready on client");
      }
    } catch {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "UserAddress" WHERE "id" = $1 AND "userId" = $2`,
        id,
        user.id
      );
    }

    return NextResponse.json({ success: true, message: "Address deleted." });
  } catch (err: unknown) {
    console.error("Delete Address Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to delete address." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureDbSchema();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, isDefault } = body;
    if (!id) return NextResponse.json({ error: "Address ID is required" }, { status: 400 });

    if (isDefault) {
      try {
        const dynamicDb = prisma as unknown as { userAddress?: { updateMany: (args: unknown) => Promise<unknown> } };
        if (dynamicDb.userAddress && typeof dynamicDb.userAddress.updateMany === "function") {
          await dynamicDb.userAddress.updateMany({
            where: { userId: user.id },
            data: { isDefault: false },
          });
        } else {
          throw new Error("Model not ready on client");
        }
      } catch {
        await prisma.$executeRawUnsafe(
          `UPDATE "UserAddress" SET "isDefault" = false WHERE "userId" = $1`,
          user.id
        );
      }
    }

    try {
      const dynamicDb = prisma as unknown as { userAddress?: { updateMany: (args: unknown) => Promise<unknown> } };
      if (dynamicDb.userAddress && typeof dynamicDb.userAddress.updateMany === "function") {
        await dynamicDb.userAddress.updateMany({
          where: { id, userId: user.id },
          data: { isDefault: Boolean(isDefault) },
        });
      } else {
        throw new Error("Model not ready on client");
      }
    } catch {
      await prisma.$executeRawUnsafe(
        `UPDATE "UserAddress" SET "isDefault" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $2 AND "userId" = $3`,
        Boolean(isDefault),
        id,
        user.id
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Update Address Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to update address." },
      { status: 500 }
    );
  }
}
