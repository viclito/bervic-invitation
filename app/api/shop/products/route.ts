import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let products: any[] = [];

    try {
      if (category && category !== "all") {
        products = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopProduct" WHERE "isActive" = true AND LOWER("category") = $1 ORDER BY "sortOrder" ASC, "createdAt" DESC`,
          category.toLowerCase()
        );
      } else {
        products = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopProduct" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" DESC`
        );
      }
    } catch {
      if ((prisma as any).shopProduct) {
        products = await (prisma as any).shopProduct.findMany({
          where: {
            isActive: true,
            ...(category && category !== "all" ? { category } : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
      }
    }

    return NextResponse.json({ products: products || [] });
  } catch (err: unknown) {
    console.error("Shop Products GET Error:", err);
    return NextResponse.json({ error: (err as Error)?.message || "Failed to fetch shop products" }, { status: 500 });
  }
}

