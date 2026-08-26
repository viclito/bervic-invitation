module.exports=[54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i.default}});var n=e.r(16020);Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})});var i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=s(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var n in e)if("default"!==n&&({}).hasOwnProperty.call(e,n)){var i=a?Object.getOwnPropertyDescriptor(e,n):null;i&&(i.get||i.set)?Object.defineProperty(r,n,i):r[n]=e[n]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
          ALTER TABLE "UserInvitation"
            ADD COLUMN IF NOT EXISTS "partnerTwoImage" TEXT,
            ADD COLUMN IF NOT EXISTS "isUnlockedByAdmin" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "isLockedByAdmin" BOOLEAN DEFAULT false;
        `),await t.prisma.$executeRawUnsafe(`
          ALTER TABLE "User"
            ADD COLUMN IF NOT EXISTS "phone" TEXT,
            ADD COLUMN IF NOT EXISTS "plan" TEXT DEFAULT 'NONE',
            ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER',
            ADD COLUMN IF NOT EXISTS "adminPermissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
            ADD COLUMN IF NOT EXISTS "allowedTemplatesCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "allowedCinematicCount" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "allowedCardsCount" INTEGER DEFAULT 0;
        `),await t.prisma.$executeRawUnsafe(`
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
        `),await t.prisma.$executeRawUnsafe(`
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
        `),await t.prisma.$executeRawUnsafe(`
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
        `),await t.prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "OrderMessage" (
            "id" TEXT PRIMARY KEY,
            "orderId" TEXT NOT NULL,
            "sender" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "OrderMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CardOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `),await t.prisma.$executeRawUnsafe(`
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
        `),await t.prisma.$executeRawUnsafe(`
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
        `),await t.prisma.$executeRawUnsafe(`
          ALTER TABLE "CanvaTemplate"
            ADD COLUMN IF NOT EXISTS "pricePerCard" DOUBLE PRECISION DEFAULT 30,
            ADD COLUMN IF NOT EXISTS "minCopies" INTEGER DEFAULT 50,
            ADD COLUMN IF NOT EXISTS "paperType" TEXT DEFAULT '350 GSM Textured Metallic Gold Cardstock',
            ADD COLUMN IF NOT EXISTS "badge" TEXT;
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},77894,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064),n=e.i(62802);let i=["berglin1998@gmail.com"],s=[{key:"ORDERS_MANAGE",label:"Orders & Print Fulfillment",description:"Manage physical card orders, print status, shipping, customer chat, and work order PDFs."},{key:"USERS_MANAGE",label:"Users & Quota Allocation",description:"View registered users, grant template & card credits, and manage user subscriptions."},{key:"INVITATIONS_MANAGE",label:"Invitations & Lock Security",description:"Inspect customer digital invitations, view RSVP guests, and lock/unlock public links."},{key:"CANVA_TEMPLATES_MANAGE",label:"Canva Template Studio",description:"Create, edit, and publish dynamic Canva card templates and decorative motif assets."},{key:"SHOP_PRODUCTS_MANAGE",label:"Print Shop Catalog",description:"Manage physical print products, paper stocks, wax seals, and pricing tiers."},{key:"ADMINS_MANAGE",label:"Staff & Permissions (Super Admin)",description:"Create new sub-admins, promote existing users to admin, and manage staff permissions."}];async function o(e){await (0,n.ensureDbSchema)();let o=await (0,t.getServerSession)(r.authOptions);if(!o||!o.user||!o.user.email)return{error:"Unauthorized. Please sign in.",status:401};let l=o.user.email.toLowerCase().trim(),T=i.includes(l),d=null;try{d=await a.prisma.user.findUnique({where:{email:l},select:{id:!0,name:!0,email:!0,role:!0,adminPermissions:!0}})}catch(e){console.warn("Error finding admin user via prisma, attempting fallback:",e?.message);try{let e=await a.prisma.$queryRawUnsafe('SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1',l);e&&e.length>0&&(d=e[0])}catch(e){console.error("SQL query error in getAdminAuth:",e?.message)}}if(!d)return{error:"User account not found.",status:404};let u=T?"SUPER_ADMIN":(d.role||"USER").toUpperCase(),E=T||"SUPER_ADMIN"===u;if(!E&&"ADMIN"!==u&&"SUB_ADMIN"!==u)return{error:"Forbidden. Admin privileges required.",status:403};let p=[];if(Array.isArray(d.adminPermissions))p=d.adminPermissions;else if("string"==typeof d.adminPermissions)try{p=JSON.parse(d.adminPermissions)}catch{p=[]}if(E||"ADMIN"!==u||0!==p.length||(p=["ORDERS_MANAGE","USERS_MANAGE","INVITATIONS_MANAGE","CANVA_TEMPLATES_MANAGE","SHOP_PRODUCTS_MANAGE"]),E&&(p=s.map(e=>e.key)),e&&!E){if("ADMINS_MANAGE"===e)return{error:"Forbidden. Only Super Admin can manage administrative staff.",status:403};if(!p.includes(e))return{error:`Forbidden. You lack the required '${e}' administrative permission.`,status:403}}return{admin:{id:d.id,name:d.name,email:d.email,role:u,adminPermissions:p,isSuperAdmin:E}}}e.s(["ALL_ADMIN_PERMISSIONS",0,s,"SUPER_ADMIN_EMAILS",0,i,"getAdminAuth",0,o])},19644,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),i=e.i(61916),s=e.i(74677),o=e.i(69741),l=e.i(16795),T=e.i(87718),d=e.i(95169),u=e.i(47587),E=e.i(66012),p=e.i(70101),c=e.i(26937),N=e.i(10372),m=e.i(93695);e.i(52474);var A=e.i(220),L=e.i(89171),O=e.i(7064),U=e.i(62802),R=e.i(77894),S=e.i(54799);function C(e){return e.toString().toLowerCase().trim().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")}async function g(){try{await (0,U.ensureDbSchema)();let e=await (0,R.getAdminAuth)("CANVA_TEMPLATES_MANAGE");if(e.error||!e.admin)return L.NextResponse.json({error:e.error||"Unauthorized"},{status:e.status||401});let t=(await O.prisma.$queryRawUnsafe(`
      SELECT * FROM "CanvaTemplate" ORDER BY "sortOrder" ASC, "createdAt" DESC
    `)||[]).map(e=>{let t=[];try{t="string"==typeof e.elementsJson?JSON.parse(e.elementsJson):e.elementsJson||[]}catch{t=[]}let r=null;try{e.colorVariantsJson&&(r="string"==typeof e.colorVariantsJson?JSON.parse(e.colorVariantsJson):e.colorVariantsJson)}catch{r=null}return{id:e.id,slug:e.slug,name:e.name,topic:e.topic,category:e.category,pricePerCard:void 0!==e.pricePerCard&&null!==e.pricePerCard?Number(e.pricePerCard):30,minCopies:void 0!==e.minCopies&&null!==e.minCopies?Number(e.minCopies):50,paperType:e.paperType||"350 GSM Textured Metallic Gold Cardstock",badge:e.badge||null,aspectRatio:e.aspectRatio,backgroundColor:e.backgroundColor,backgroundImage:e.backgroundImage,previewImage:e.previewImage,elements:t,colorVariants:r,isActive:e.isActive,sortOrder:e.sortOrder,createdAt:e.createdAt,updatedAt:e.updatedAt}});return L.NextResponse.json({templates:t})}catch(e){return console.error("Admin Canva Templates GET Error:",e),L.NextResponse.json({error:e?.message||"Failed to fetch Canva templates"},{status:500})}}async function I(e){try{await (0,U.ensureDbSchema)();let t=await (0,R.getAdminAuth)("CANVA_TEMPLATES_MANAGE");if(t.error||!t.admin)return L.NextResponse.json({error:t.error||"Unauthorized"},{status:t.status||401});let{name:r,slug:a,topic:n="vintage",category:i="Vintage Floral",pricePerCard:s=30,minCopies:o=50,paperType:l="350 GSM Textured Metallic Gold Cardstock",badge:T=null,aspectRatio:d="classic",backgroundColor:u="#F3EAD8",backgroundImage:E=null,previewImage:p=null,elements:c=[],colorVariants:N=null,isActive:m=!0,sortOrder:A=0}=await e.json();if(!r||!r.trim())return L.NextResponse.json({error:"Template name is required."},{status:400});let g=String(r).trim(),I=a&&a.trim()?C(a):C(g),D=`${I}-${S.default.randomBytes(3).toString("hex")}`,f=`tmpl_${S.default.randomBytes(12).toString("hex")}`,M="string"==typeof c?c:JSON.stringify(c||[]),v=N?"string"==typeof N?N:JSON.stringify(N):null,y=Number(s)>0?Number(s):30,h=Number(o)>0?Number(o):50,w=null,P=!1;if(O.prisma.canvaTemplate)try{w=await O.prisma.canvaTemplate.create({data:{id:f,slug:D,name:g,topic:"modern"===String(n).toLowerCase()?"modern":"vintage",category:String(i).trim(),pricePerCard:y,minCopies:h,paperType:l?String(l).trim():"350 GSM Textured Metallic Gold Cardstock",badge:T?String(T).trim():null,aspectRatio:String(d).trim(),backgroundColor:String(u).trim(),backgroundImage:E?String(E).trim():null,previewImage:p?String(p).trim():null,elementsJson:M,colorVariantsJson:v,isActive:!!m,sortOrder:Number(A)||0}})}catch(e){console.warn("Prisma CanvaTemplate create failed, using raw SQL:",e),P=!0}(!w||P)&&(await O.prisma.$executeRawUnsafe(`INSERT INTO "CanvaTemplate" ("id", "slug", "name", "topic", "category", "pricePerCard", "minCopies", "paperType", "badge", "aspectRatio", "backgroundColor", "backgroundImage", "previewImage", "elementsJson", "colorVariantsJson", "isActive", "sortOrder", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())`,f,D,g,"modern"===String(n).toLowerCase()?"modern":"vintage",String(i).trim(),y,h,l?String(l).trim():"350 GSM Textured Metallic Gold Cardstock",T?String(T).trim():null,String(d).trim(),String(u).trim(),E?String(E).trim():null,p?String(p).trim():null,M,v,!!m,Number(A)||0),w=(await O.prisma.$queryRawUnsafe('SELECT * FROM "CanvaTemplate" WHERE "id" = $1 LIMIT 1',f))[0]);try{O.prisma.shopProduct&&await O.prisma.shopProduct.updateMany({where:{OR:[{canvaTemplateId:f},{canvaTemplateId:D},{name:g}]},data:{pricePerCard:y,paperType:l?String(l).trim():void 0,badge:T?String(T).trim():void 0}})}catch{}return L.NextResponse.json({success:!0,template:w})}catch(e){return console.error("Admin Canva Template Create Error:",e),L.NextResponse.json({error:e?.message||"Failed to create Canva template"},{status:500})}}async function D(e){try{await (0,U.ensureDbSchema)();let t=await (0,R.getAdminAuth)("CANVA_TEMPLATES_MANAGE");if(t.error||!t.admin)return L.NextResponse.json({error:t.error||"Unauthorized"},{status:t.status||401});let{templateIds:r}=await e.json();if(!Array.isArray(r)||0===r.length)return L.NextResponse.json({error:"templateIds array is required."},{status:400});return O.prisma.canvaTemplate?await O.prisma.canvaTemplate.deleteMany({where:{id:{in:r}}}):await O.prisma.$executeRawUnsafe('DELETE FROM "CanvaTemplate" WHERE "id" = ANY($1::text[])',r),L.NextResponse.json({success:!0,deletedCount:r.length})}catch(e){return console.error("Admin Canva Templates Bulk DELETE Error:",e),L.NextResponse.json({error:e?.message||"Failed to bulk delete Canva templates"},{status:500})}}e.s(["DELETE",0,D,"GET",0,g,"POST",0,I,"dynamic",0,"force-dynamic"],33974);var f=e.i(33974);let M=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/canva-templates/route",pathname:"/api/admin/canva-templates",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/admin/canva-templates/route.ts",nextConfigOutput:"",userland:f,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:y,serverHooks:h}=M;async function w(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),M.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/admin/canva-templates/route";L=L.replace(/\/index$/,"")||"/";let O=await M.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,deploymentId:R,params:S,nextConfig:C,parsedUrl:g,isDraftMode:I,prerenderManifest:D,routerServerContext:f,isOnDemandRevalidate:v,revalidateOnlyGenerated:y,resolvedPathname:h,clientReferenceManifest:w,serverActionsManifest:P}=O,x=(0,o.normalizeAppPath)(L),F=!!(D.dynamicRoutes[x]||D.routes[h]),b=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,g,!1):t.end("This page could not be found"),null);if(F&&!I){let e=!!D.routes[h],t=D.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await b();throw new m.NoFallbackError}}let _=null;!F||M.isDev||I||(_="/index"===(_=h)?"/":_);let X=!0===M.isDev||!F,k=F&&!X;P&&w&&(0,s.setManifestsSingleton)({page:L,clientReferenceManifest:w,serverActionsManifest:P});let G=e.method||"GET",$=(0,i.getTracer)(),q=$.getActiveScopeSpan(),j=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),V=(0,n.getRequestMeta)(e,"incrementalCache")||await M.getIncrementalCache(e,C,D,B);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let H={params:S,previewProps:D.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:X,incrementalCache:V,cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>M.onRequestError(e,t,a,n,f)},sharedContext:{buildId:U,deploymentId:R}},J=new l.NodeNextRequest(e),Y=new l.NodeNextResponse(t),K=T.NextRequestAdapter.fromNodeNextRequest(J,(0,T.signalFromNodeResponse)(t));try{let n,s=async e=>M.handle(K,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${G} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",a),n.updateName(t))}else e.updateName(`${G} ${L}`)}),o=async n=>{var i,o;let l=async({previousCacheEntry:r})=>{try{if(!B&&v&&y&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=H.renderOpts.collectedTags;if(!F)return await (0,E.sendResponse)(J,Y,i,H.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[N.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await M.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,f),t}},T=await M.handleResponse({req:e,nextConfig:C,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:y,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!F)return null;if((null==T||null==(i=T.value)?void 0:i.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==T||null==(o=T.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",v?"REVALIDATED":T.isMiss?"MISS":T.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,p.fromNodeOutgoingHttpHeaders)(T.value.headers);return B&&F||d.delete(N.NEXT_CACHE_TAGS_HEADER),!T.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,c.getCacheControlHeader)(T.cacheControl)),await (0,E.sendResponse)(J,Y,new Response(T.value.body,{headers:d,status:T.value.status||200})),null};j&&q?await o(q):(n=$.getActiveScopeSpan(),await $.withPropagatedContext(e.headers,()=>$.trace(d.BaseServerSpan.handleRequest,{spanName:`${G} ${L}`,kind:i.SpanKind.SERVER,attributes:{"http.method":G,"http.target":e.url}},o),void 0,!j))}catch(t){if(t instanceof m.NoFallbackError||await M.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,f),F)throw t;return await (0,E.sendResponse)(J,Y,new Response(null,{status:500})),null}}e.s(["handler",0,w,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:y})},"routeModule",0,M,"serverHooks",0,h,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,y],19644)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d86x4t._.js.map