module.exports=[54799,(e,r,t)=>{r.exports=e.x("crypto",()=>require("crypto"))},92509,(e,r,t)=>{r.exports=e.x("url",()=>require("url"))},21517,(e,r,t)=>{r.exports=e.x("http",()=>require("http"))},24836,(e,r,t)=>{r.exports=e.x("https",()=>require("https"))},45706,(e,r,t)=>{r.exports=e.x("querystring",()=>require("querystring"))},18622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,r,t)=>{r.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,r,t)=>{r.exports=e.x("util",()=>require("util"))},93695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,r,t)=>{r.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let r;var t=e.i(63021);let T=globalThis.prisma??new t.PrismaClient({datasourceUrl:((r=process.env.DATABASE_URL||"")&&!r.includes("pool_timeout")&&(r+=(r.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),r),log:["error"]});e.s(["prisma",0,T])},6461,(e,r,t)=>{r.exports=e.x("zlib",()=>require("zlib"))},27699,(e,r,t)=>{r.exports=e.x("events",()=>require("events"))},16020,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0})},57660,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var T={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i.default}});var a=e.r(16020);Object.keys(a).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(T,e)||e in t&&t[e]===a[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}})});var i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=s(void 0);if(r&&r.has(e))return r.get(e);var t={__proto__:null},T=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&({}).hasOwnProperty.call(e,a)){var i=T?Object.getOwnPropertyDescriptor(e,a):null;i&&(i.get||i.set)?Object.defineProperty(t,a,i):t[a]=e[a]}return t.default=e,r&&r.set(e,t),t}(e.r(23667));function s(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(s=function(e){return e?t:r})(e)}Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(T,e)||e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})})},62802,e=>{"use strict";var r=e.i(7064);let t=null;async function T(){return t||(t=(async()=>{try{await r.prisma.$executeRawUnsafe(`
          ALTER TABLE "UserInvitation"
            ADD COLUMN IF NOT EXISTS "partnerTwoImage" TEXT,
            ADD COLUMN IF NOT EXISTS "isUnlockedByAdmin" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "isLockedByAdmin" BOOLEAN DEFAULT false;
        `),await r.prisma.$executeRawUnsafe(`
          ALTER TABLE "User"
            ADD COLUMN IF NOT EXISTS "phone" TEXT,
            ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'NONE',
            ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER',
            ADD COLUMN IF NOT EXISTS "adminPermissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
            ADD COLUMN IF NOT EXISTS "allowedTemplatesCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "allowedCinematicCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "allowedCardsCount" INTEGER DEFAULT 0;
        `),await r.prisma.$executeRawUnsafe(`
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
        `),await r.prisma.$executeRawUnsafe(`
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
            "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
            "notes" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CardOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `),await r.prisma.$executeRawUnsafe(`
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
            "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "CardOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CardOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `),await r.prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "OrderMessage" (
            "id" TEXT PRIMARY KEY,
            "orderId" TEXT NOT NULL,
            "sender" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "OrderMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CardOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `),await r.prisma.$executeRawUnsafe(`
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
            "canvaTemplateId" TEXT,
            "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
            "reviewsCount" INTEGER NOT NULL DEFAULT 50,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "sortOrder" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `),await r.prisma.$executeRawUnsafe(`
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
        `),await r.prisma.$executeRawUnsafe(`
          ALTER TABLE "CanvaTemplate"
            ADD COLUMN IF NOT EXISTS "pricePerCard" DOUBLE PRECISION DEFAULT 30,
            ADD COLUMN IF NOT EXISTS "minCopies" INTEGER DEFAULT 50,
            ADD COLUMN IF NOT EXISTS "paperType" TEXT DEFAULT '350 GSM Textured Metallic Gold Cardstock',
            ADD COLUMN IF NOT EXISTS "badge" TEXT;
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),t}e.s(["ensureDbSchema",0,T])},77894,e=>{"use strict";var r=e.i(57660),t=e.i(2918),T=e.i(7064),a=e.i(62802);let i=["berglin1998@gmail.com"],s=[{key:"ORDERS_MANAGE",label:"Orders & Print Fulfillment",description:"Manage physical card orders, print status, shipping, customer chat, and work order PDFs."},{key:"USERS_MANAGE",label:"Users & Quota Allocation",description:"View registered users, grant template & card credits, and manage user subscriptions."},{key:"INVITATIONS_MANAGE",label:"Invitations & Lock Security",description:"Inspect customer digital invitations, view RSVP guests, and lock/unlock public links."},{key:"CANVA_TEMPLATES_MANAGE",label:"Canva Template Studio",description:"Create, edit, and publish dynamic Canva card templates and decorative motif assets."},{key:"SHOP_PRODUCTS_MANAGE",label:"Print Shop Catalog",description:"Manage physical print products, paper stocks, wax seals, and pricing tiers."},{key:"ADMINS_MANAGE",label:"Staff & Permissions (Super Admin)",description:"Create new sub-admins, promote existing users to admin, and manage staff permissions."}];async function E(e){await (0,a.ensureDbSchema)();let E=await (0,r.getServerSession)(t.authOptions);if(!E||!E.user||!E.user.email)return{error:"Unauthorized. Please sign in.",status:401};let n=E.user.email.toLowerCase().trim(),N=i.includes(n),o=null;try{o=await T.prisma.user.findUnique({where:{email:n},select:{id:!0,name:!0,email:!0,role:!0,adminPermissions:!0}})}catch(e){console.warn("Error finding admin user via prisma, attempting fallback:",e?.message);try{let e=await T.prisma.$queryRawUnsafe('SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1',n);e&&e.length>0&&(o=e[0])}catch(e){console.error("SQL query error in getAdminAuth:",e?.message)}}if(!o)return{error:"User account not found.",status:404};let L=N?"SUPER_ADMIN":(o.role||"USER").toUpperCase(),A=N||"SUPER_ADMIN"===L;if(!A&&"ADMIN"!==L&&"SUB_ADMIN"!==L)return{error:"Forbidden. Admin privileges required.",status:403};let d=[];if(Array.isArray(o.adminPermissions))d=o.adminPermissions;else if("string"==typeof o.adminPermissions)try{d=JSON.parse(o.adminPermissions)}catch{d=[]}if(A||"ADMIN"!==L||0!==d.length||(d=["ORDERS_MANAGE","USERS_MANAGE","INVITATIONS_MANAGE","CANVA_TEMPLATES_MANAGE","SHOP_PRODUCTS_MANAGE"]),A&&(d=s.map(e=>e.key)),e&&!A){if("ADMINS_MANAGE"===e)return{error:"Forbidden. Only Super Admin can manage administrative staff.",status:403};if(!d.includes(e))return{error:`Forbidden. You lack the required '${e}' administrative permission.`,status:403}}return{admin:{id:o.id,name:o.name,email:o.email,role:L,adminPermissions:d,isSuperAdmin:A}}}e.s(["ALL_ADMIN_PERMISSIONS",0,s,"SUPER_ADMIN_EMAILS",0,i,"getAdminAuth",0,E])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1_5mxw-._.js.map