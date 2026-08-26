import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const dynamic = "force-dynamic";

const RETURN_GIFT_CATEGORIES = ["return_gifts", "brass", "hampers", "silver", "bags", "candles"];

export async function GET(req: Request) {
  try {
    await ensureDbSchema();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const mainTab = searchParams.get("mainTab"); // "invitations" | "return_gifts"
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const sortBy = searchParams.get("sortBy") || "default"; // "default", "price_low", "price_high", "newest"
    const limitParam = searchParams.get("limit");
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.min(Math.max(parseInt(limitParam || "24", 10) || 24, 1), 100);
    const skip = (page - 1) * limit;

    // Construct Prisma where query conditions
    const where: any = {
      isActive: true,
    };

    if (mainTab === "invitations") {
      where.category = {
        notIn: RETURN_GIFT_CATEGORIES,
      };
      if (category && category !== "all") {
        where.category = category;
      }
    } else if (mainTab === "return_gifts") {
      if (category && category !== "all") {
        where.category = category;
      } else {
        where.category = {
          in: RETURN_GIFT_CATEGORIES,
        };
      }
    } else if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { paperType: { contains: search, mode: "insensitive" } },
        { dimensions: { contains: search, mode: "insensitive" } },
      ];
    }

    // Determine sorting
    let orderBy: any = [{ sortOrder: "asc" }, { createdAt: "desc" }];
    if (sortBy === "price_low") {
      orderBy = [{ pricePerCard: "asc" }, { createdAt: "desc" }];
    } else if (sortBy === "price_high") {
      orderBy = [{ pricePerCard: "desc" }, { createdAt: "desc" }];
    } else if (sortBy === "newest") {
      orderBy = [{ createdAt: "desc" }];
    }

    let products: any[] = [];
    let total = 0;

    try {
      if ((prisma as any).shopProduct) {
        const [items, count] = await Promise.all([
          (prisma as any).shopProduct.findMany({
            where,
            orderBy,
            skip: isAll ? undefined : skip,
            take: isAll ? undefined : limit,
          }),
          (prisma as any).shopProduct.count({ where }),
        ]);
        products = items;
        total = count;
      }
    } catch (err1: any) {
      console.warn("Prisma findMany/count failed, attempting SQL fallback:", err1?.message);
      try {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopProduct" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" DESC LIMIT $1 OFFSET $2`,
          limit,
          skip
        );
        products = rows || [];
        total = products.length;
      } catch (err2: any) {
        console.error("SQL query error:", err2?.message);
      }
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasMore = page < totalPages;

    return NextResponse.json(
      {
        products: products || [],
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Shop Products GET Error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Failed to fetch shop products", products: [], total: 0, page: 1, totalPages: 1, hasMore: false },
      { status: 500 }
    );
  }
}


