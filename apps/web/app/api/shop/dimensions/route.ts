import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbSchema();

    let dimensions: any[] = [];
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT * FROM "ShopDimension" ORDER BY "type" ASC, "sortOrder" ASC, "createdAt" ASC
      `);
      dimensions = rows || [];
    } catch {
      if ((prisma as any).shopDimension && typeof (prisma as any).shopDimension.findMany === "function") {
        dimensions = await (prisma as any).shopDimension.findMany({
          orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    }

    return NextResponse.json({ dimensions });
  } catch (err: unknown) {
    console.error("Public Shop Dimensions GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch dimensions" },
      { status: 500 }
    );
  }
}
