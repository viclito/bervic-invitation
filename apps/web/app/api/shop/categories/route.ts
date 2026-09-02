import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureDbSchema();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "invitations" | "return_gifts"

    const where: any = {
      isActive: true,
    };
    if (type) {
      where.type = type;
    }

    let rawCategories: any[] = [];
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(
        type
          ? `SELECT * FROM "ShopCategory" WHERE "isActive" = true AND "type" = $1 ORDER BY "sortOrder" ASC, "createdAt" ASC`
          : `SELECT * FROM "ShopCategory" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" ASC`,
        ...(type ? [type] : [])
      );
      rawCategories = rows || [];
    } catch {
      if ((prisma as any).shopCategory && typeof (prisma as any).shopCategory.findMany === "function") {
        rawCategories = await (prisma as any).shopCategory.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });
      }
    }

    const categories = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "",
      type: c.type || "invitations",
      sortOrder: c.sortOrder ?? 0,
      label: c.icon ? `${c.icon} ${c.name}` : c.name,
    }));

    return NextResponse.json({ categories });
  } catch (err: unknown) {
    console.error("Shop Categories GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch shop categories" },
      { status: 500 }
    );
  }
}
