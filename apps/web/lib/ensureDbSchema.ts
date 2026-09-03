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
            ADD COLUMN IF NOT EXISTS "planExpiresAt" TIMESTAMP(3),
            ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER',
            ADD COLUMN IF NOT EXISTS "adminPermissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
            ADD COLUMN IF NOT EXISTS "allowedTemplatesCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "allowedCinematicCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "hasCinematicPass" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "allowedCardsCount" INTEGER DEFAULT 0;
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "UserDraftDetails" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "profileName" TEXT,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "eventType" TEXT NOT NULL DEFAULT 'WEDDING',
            "hostNameOne" TEXT,
            "hostNameTwo" TEXT,
            "coupleInitials" TEXT,
            "eventTitle" TEXT,
            "inviteLine" TEXT,
            "eventDate" TEXT,
            "eventTime" TEXT,
            "venueName" TEXT,
            "venueAddress" TEXT,
            "venueMapUrl" TEXT,
            "venueTwoName" TEXT,
            "venueTwoAddress" TEXT,
            "venueTwoMapUrl" TEXT,
            "locationsJson" TEXT,
            "tagline" TEXT,
            "turningAge" TEXT,
            "dressCode" TEXT,
            "rsvpContact" TEXT,
            "loveStoryText" TEXT,
            "loveStoryVideoUrl" TEXT,
            "coverImage" TEXT,
            "coupleImage" TEXT,
            "partnerTwoImage" TEXT,
            "venueImage" TEXT,
            "galleryImagesJson" TEXT,
            "functionsJson" TEXT,
            "dayTimelineJson" TEXT,
            "additionalNotes" TEXT,
            "extractedFromDoc" BOOLEAN NOT NULL DEFAULT false,
            "completedFields" TEXT,
            "currentStep" INTEGER NOT NULL DEFAULT 0,
            "isComplete" BOOLEAN NOT NULL DEFAULT false,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "UserDraftDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "UserDraftDetails_userId_idx" ON "UserDraftDetails"("userId");
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "CartItem" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "itemType" TEXT NOT NULL DEFAULT 'CANVA_CARD',
            "templateId" TEXT NOT NULL,
            "templateName" TEXT NOT NULL,
            "previewImage" TEXT,
            "copies" INTEGER NOT NULL DEFAULT 1,
            "cardDetailsJson" TEXT NOT NULL,
            "elementsJson" TEXT,
            "customNotes" TEXT,
            "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "CardOrder" (
            "id" TEXT PRIMARY KEY,
            "orderNumber" TEXT UNIQUE NOT NULL,
            "userId" TEXT NOT NULL,
            "customerName" TEXT NOT NULL,
            "customerEmail" TEXT NOT NULL,
            "customerPhone" TEXT NOT NULL,
            "deliveryAddress" TEXT,
            "city" TEXT,
            "pincode" TEXT,
            "status" TEXT NOT NULL DEFAULT 'PENDING',
            "totalCopies" INTEGER NOT NULL DEFAULT 1,
            "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
            "notes" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CardOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "CardOrder"
            ADD COLUMN IF NOT EXISTS "shippingFee" DOUBLE PRECISION DEFAULT 0;
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "CardOrderItem" (
            "id" TEXT PRIMARY KEY,
            "orderId" TEXT NOT NULL,
            "itemType" TEXT NOT NULL DEFAULT 'CANVA_CARD',
            "templateId" TEXT NOT NULL,
            "templateName" TEXT NOT NULL,
            "previewImage" TEXT,
            "copies" INTEGER NOT NULL DEFAULT 1,
            "cardDetailsJson" TEXT NOT NULL,
            "elementsJson" TEXT,
            "customNotes" TEXT,
            "draftFileUrl" TEXT,
            "draftFileName" TEXT,
            "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CardOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CardOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "CardOrderItem"
            ADD COLUMN IF NOT EXISTS "draftFileUrl" TEXT,
            ADD COLUMN IF NOT EXISTS "draftFileName" TEXT;
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "OrderMessage" (
            "id" TEXT PRIMARY KEY,
            "orderId" TEXT NOT NULL,
            "sender" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "OrderMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CardOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "ShopProduct" (
            "id" TEXT PRIMARY KEY,
            "name" TEXT NOT NULL,
            "category" TEXT NOT NULL DEFAULT 'royal',
            "pricePerCard" DOUBLE PRECISION NOT NULL DEFAULT 65,
            "minCopies" INTEGER NOT NULL DEFAULT 50,
            "previewImage" TEXT NOT NULL,
            "galleryImages" TEXT,
            "badge" TEXT,
            "paperType" TEXT NOT NULL DEFAULT '350 GSM Textured Metallic Gold Cardstock',
            "dimensions" TEXT NOT NULL DEFAULT '5.5 x 8.5 inches',
            "description" TEXT NOT NULL,
            "featuresJson" TEXT NOT NULL DEFAULT '[]',
            "pricingTiersJson" TEXT,
            "canvaTemplateId" TEXT,
            "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
            "reviewsCount" INTEGER NOT NULL DEFAULT 50,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "ShopCategory" (
            "id" TEXT PRIMARY KEY,
            "name" TEXT NOT NULL,
            "icon" TEXT,
            "type" TEXT NOT NULL DEFAULT 'invitations',
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "ShopCategory_type_isActive_sortOrder_idx" ON "ShopCategory"("type", "isActive", "sortOrder");
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "CanvaTemplate" (
            "id" TEXT PRIMARY KEY,
            "slug" TEXT UNIQUE NOT NULL,
            "name" TEXT NOT NULL,
            "topic" TEXT NOT NULL DEFAULT 'vintage',
            "category" TEXT NOT NULL DEFAULT 'Vintage Floral',
            "pricePerCard" DOUBLE PRECISION NOT NULL DEFAULT 30,
            "minCopies" INTEGER NOT NULL DEFAULT 50,
            "paperType" TEXT DEFAULT '350 GSM Textured Metallic Gold Cardstock',
            "badge" TEXT,
            "aspectRatio" TEXT NOT NULL DEFAULT 'classic',
            "backgroundColor" TEXT NOT NULL DEFAULT '#F3EAD8',
            "backgroundImage" TEXT,
            "previewImage" TEXT,
            "elementsJson" TEXT NOT NULL,
            "colorVariantsJson" TEXT,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "CanvaTemplate"
            ADD COLUMN IF NOT EXISTS "pricePerCard" DOUBLE PRECISION DEFAULT 30,
            ADD COLUMN IF NOT EXISTS "minCopies" INTEGER DEFAULT 50,
            ADD COLUMN IF NOT EXISTS "paperType" TEXT DEFAULT '350 GSM Textured Metallic Gold Cardstock',
            ADD COLUMN IF NOT EXISTS "badge" TEXT;
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "UserAddress" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "phone" TEXT NOT NULL,
            "address" TEXT NOT NULL,
            "city" TEXT NOT NULL,
            "state" TEXT,
            "pincode" TEXT NOT NULL,
            "isDefault" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "UserAddress" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "UserAddress" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "CardOrder"
            ADD COLUMN IF NOT EXISTS "shippingFee" DOUBLE PRECISION DEFAULT 0;
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "CardOrderItem"
            ADD COLUMN IF NOT EXISTS "draftFileUrl" TEXT,
            ADD COLUMN IF NOT EXISTS "draftFileName" TEXT;
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "ShopProduct"
            ADD COLUMN IF NOT EXISTS "pricingTiersJson" TEXT;
        `);
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "ShopDimension" (
            "id" TEXT PRIMARY KEY,
            "label" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'invitations',
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "ShopDimension_type_sortOrder_idx" ON "ShopDimension"("type", "sortOrder");
        `);
      } catch (err: unknown) {
        console.warn("Db Schema Auto-Migration warning:", (err as Error)?.message);
      }
    })();
  }
  return schemaPromise;
}

