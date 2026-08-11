import { prisma } from "@/lib/prisma";

let schemaPromise: Promise<void> | null = null;

export async function ensureDbSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      try {
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
      } catch (err: any) {
        console.warn("Db Schema Auto-Migration warning:", err?.message);
      }
    })();
  }
  return schemaPromise;
}
