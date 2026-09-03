import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbSchema();

    let occasions: any[] = [];
    try {
      if ((prisma as any).shopOccasion) {
        occasions = await (prisma as any).shopOccasion.findMany({
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    } catch {
      // Fallback query
    }

    if (!occasions || occasions.length === 0) {
      try {
        occasions = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopOccasion" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" ASC`
        );
      } catch {
        occasions = [];
      }
    }

    return NextResponse.json({ occasions: occasions || [] });
  } catch (error: any) {
    console.error("GET /api/shop/occasions error:", error);
    return NextResponse.json({ occasions: [] });
  }
}
