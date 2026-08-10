import { prisma } from "@/lib/prisma";

let schemaEnsured = false;

export async function ensureDbSchema() {
  if (schemaEnsured) return;

  try {
    // Safely add any new columns to PostgreSQL if missing in production DB (batched DDL)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "UserInvitation"
        ADD COLUMN IF NOT EXISTS "partnerTwoImage" TEXT,
        ADD COLUMN IF NOT EXISTS "isUnlockedByAdmin" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "isLockedByAdmin" BOOLEAN DEFAULT false;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User"
        ADD COLUMN IF NOT EXISTS "phone" TEXT,
        ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'NONE',
        ADD COLUMN IF NOT EXISTS "allowedTemplatesCount" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "allowedCinematicCount" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "allowedCardsCount" INTEGER DEFAULT 0;
    `);
    schemaEnsured = true;
  } catch (err: any) {
    console.warn("Db Schema Auto-Migration warning:", err?.message);
  }
}
