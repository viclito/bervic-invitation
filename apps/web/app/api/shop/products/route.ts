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
    const occasion = searchParams.get("occasion");
    const priceRange = searchParams.get("priceRange");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const mainTab = searchParams.get("mainTab"); // "invitations" | "return_gifts"
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const sortBy = searchParams.get("sortBy") || "default"; // "default", "price_low", "price_high", "rating", "newest"
    const limitParam = searchParams.get("limit");
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.min(Math.max(parseInt(limitParam || "24", 10) || 24, 1), 100);
    const skip = (page - 1) * limit;

    let returnGiftCategories = ["return_gifts", "brass", "hampers", "silver", "bags", "candles"];
    try {
      const giftCats: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id" FROM "ShopCategory" WHERE "type" = 'return_gifts'`
      );
      if (giftCats && giftCats.length > 0) {
        returnGiftCategories = Array.from(new Set([...giftCats.map((g) => g.id), "return_gifts"]));
      }
    } catch {
      // Use fallback
    }

    // Construct Prisma where query conditions
    const where: any = {
      isActive: true,
    };

    if (mainTab === "invitations") {
      where.category = {
        notIn: returnGiftCategories,
      };
      if (category && category !== "all") {
        where.category = category;
      }
    } else if (mainTab === "return_gifts") {
      if (category && category !== "all") {
        where.category = category;
      } else {
        where.category = {
          in: returnGiftCategories,
        };
      }
    } else if (category && category !== "all") {
      where.category = category;
    }

    if (occasion && occasion !== "all") {
      if (occasion === "common") {
        where.occasion = "common";
      } else {
        where.occasion = {
          in: [occasion, "common"],
        };
      }
    }

    let minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    let maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    if (priceRange) {
      if (priceRange === "under_10") {
        minPrice = 0;
        maxPrice = 10;
      } else if (priceRange === "10_25") {
        minPrice = 10;
        maxPrice = 25;
      } else if (priceRange === "25_50") {
        minPrice = 25;
        maxPrice = 50;
      } else if (priceRange === "50_plus") {
        minPrice = 50;
        maxPrice = undefined;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerCard = {};
      if (minPrice !== undefined) where.pricePerCard.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerCard.lte = maxPrice;
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
    } else if (sortBy === "rating") {
      orderBy = [{ rating: "desc" }, { reviewsCount: "desc" }];
    } else if (sortBy === "newest") {
      orderBy = [{ createdAt: "desc" }];
    }

    let products: any[] = [];
    let total = 0;

    try {
      const sqlConditions: string[] = ['"isActive" = true'];
      const sqlParams: any[] = [];

      // Category filter
      if (mainTab === "invitations") {
        if (category && category !== "all") {
          sqlParams.push(category);
          sqlConditions.push(`"category" = $${sqlParams.length}`);
        } else if (returnGiftCategories.length > 0) {
          const catList = returnGiftCategories.map((c) => `'${c.replace(/'/g, "''")}'`).join(", ");
          sqlConditions.push(`"category" NOT IN (${catList})`);
        }
      } else if (mainTab === "return_gifts") {
        if (category && category !== "all") {
          sqlParams.push(category);
          sqlConditions.push(`"category" = $${sqlParams.length}`);
        } else if (returnGiftCategories.length > 0) {
          const catList = returnGiftCategories.map((c) => `'${c.replace(/'/g, "''")}'`).join(", ");
          sqlConditions.push(`"category" IN (${catList})`);
        }
      } else if (category && category !== "all") {
        sqlParams.push(category);
        sqlConditions.push(`"category" = $${sqlParams.length}`);
      }

      // Occasion filter: target occasion OR common
      if (occasion && occasion !== "all") {
        if (occasion === "common") {
          sqlConditions.push(`"occasion" = 'common'`);
        } else {
          sqlParams.push(occasion);
          sqlConditions.push(`("occasion" = $${sqlParams.length} OR "occasion" = 'common')`);
        }
      }

      // Price filter
      if (minPrice !== undefined) {
        sqlParams.push(minPrice);
        sqlConditions.push(`"pricePerCard" >= $${sqlParams.length}`);
      }
      if (maxPrice !== undefined) {
        sqlParams.push(maxPrice);
        sqlConditions.push(`"pricePerCard" <= $${sqlParams.length}`);
      }

      // Search query
      if (search) {
        sqlParams.push(`%${search}%`);
        const sIdx = sqlParams.length;
        sqlConditions.push(`("name" ILIKE $${sIdx} OR "description" ILIKE $${sIdx} OR "paperType" ILIKE $${sIdx} OR "dimensions" ILIKE $${sIdx})`);
      }

      const whereSql = sqlConditions.join(" AND ");

      // Determine sort SQL: By default, Common occasion has HIGHER priority and displays first!
      let sortSql = `(CASE WHEN "occasion" = 'common' THEN 0 ELSE 1 END) ASC, "sortOrder" ASC, "createdAt" DESC`;
      if (sortBy === "price_low") {
        sortSql = `"pricePerCard" ASC, "createdAt" DESC`;
      } else if (sortBy === "price_high") {
        sortSql = `"pricePerCard" DESC, "createdAt" DESC`;
      } else if (sortBy === "rating") {
        sortSql = `"rating" DESC, "reviewsCount" DESC`;
      } else if (sortBy === "newest") {
        sortSql = `"createdAt" DESC`;
      }

      const countRows: any[] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "ShopProduct" WHERE ${whereSql}`,
        ...sqlParams
      );
      total = Number(countRows[0]?.count) || 0;

      if (isAll) {
        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopProduct" WHERE ${whereSql} ORDER BY ${sortSql}`,
          ...sqlParams
        );
        products = rows || [];
      } else {
        sqlParams.push(limit);
        const limitParamIdx = sqlParams.length;
        sqlParams.push(skip);
        const skipParamIdx = sqlParams.length;

        const rows: any[] = await prisma.$queryRawUnsafe(
          `SELECT * FROM "ShopProduct" WHERE ${whereSql} ORDER BY ${sortSql} LIMIT $${limitParamIdx} OFFSET $${skipParamIdx}`,
          ...sqlParams
        );
        products = rows || [];
      }
    } catch (sqlErr: any) {
      console.warn("Direct SQL query error, falling back to Prisma:", sqlErr?.message);
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
      } catch (prismaErr: any) {
        console.error("Prisma fallback error:", prismaErr?.message);
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
          "Cache-Control": "no-cache, must-revalidate",
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


