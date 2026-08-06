import { prisma } from "@/lib/prisma";

let schemaEnsured = false;

export async function ensureDbSchema() {
  if (schemaEnsured) return;

  try {
    // Safely add any new columns to PostgreSQL if missing in production DB
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "UserInvitation" ADD COLUMN IF NOT EXISTS "partnerTwoImage" TEXT;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'NONE';`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "allowedTemplatesCount" INTEGER DEFAULT 0;`
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "allowedCardsCount" INTEGER DEFAULT 0;`
    );
    schemaEnsured = true;
  } catch (err: any) {
    console.warn("Db Schema Auto-Migration warning:", err?.message);
  }
}
