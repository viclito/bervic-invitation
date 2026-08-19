import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email.toLowerCase().trim();
    const isAdmin = currentUserEmail === "berglin1998@gmail.com";

    if (!isAdmin) {
      const dbUser = await prisma.user.findUnique({
        where: { email: currentUserEmail },
        select: { role: true },
      });
      if (!dbUser || dbUser.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden. Admin authority required." }, { status: 403 });
      }
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
