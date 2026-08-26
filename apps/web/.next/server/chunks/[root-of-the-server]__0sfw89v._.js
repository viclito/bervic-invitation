module.exports=[54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i.default}});var s=e.r(16020);Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})});var i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var i=a?Object.getOwnPropertyDescriptor(e,s):null;i&&(i.get||i.set)?Object.defineProperty(r,s,i):r[s]=e[s]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(n=function(e){return e?r:t})(e)}Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},77894,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064),s=e.i(62802);let i=["berglin1998@gmail.com"],n=[{key:"ORDERS_MANAGE",label:"Orders & Print Fulfillment",description:"Manage physical card orders, print status, shipping, customer chat, and work order PDFs."},{key:"USERS_MANAGE",label:"Users & Quota Allocation",description:"View registered users, grant template & card credits, and manage user subscriptions."},{key:"INVITATIONS_MANAGE",label:"Invitations & Lock Security",description:"Inspect customer digital invitations, view RSVP guests, and lock/unlock public links."},{key:"CANVA_TEMPLATES_MANAGE",label:"Canva Template Studio",description:"Create, edit, and publish dynamic Canva card templates and decorative motif assets."},{key:"SHOP_PRODUCTS_MANAGE",label:"Print Shop Catalog",description:"Manage physical print products, paper stocks, wax seals, and pricing tiers."},{key:"ADMINS_MANAGE",label:"Staff & Permissions (Super Admin)",description:"Create new sub-admins, promote existing users to admin, and manage staff permissions."}];async function o(e){await (0,s.ensureDbSchema)();let o=await (0,t.getServerSession)(r.authOptions);if(!o||!o.user||!o.user.email)return{error:"Unauthorized. Please sign in.",status:401};let T=o.user.email.toLowerCase().trim(),d=i.includes(T),u=null;try{u=await a.prisma.user.findUnique({where:{email:T},select:{id:!0,name:!0,email:!0,role:!0,adminPermissions:!0}})}catch(e){console.warn("Error finding admin user via prisma, attempting fallback:",e?.message);try{let e=await a.prisma.$queryRawUnsafe('SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1',T);e&&e.length>0&&(u=e[0])}catch(e){console.error("SQL query error in getAdminAuth:",e?.message)}}if(!u)return{error:"User account not found.",status:404};let E=d?"SUPER_ADMIN":(u.role||"USER").toUpperCase(),l=d||"SUPER_ADMIN"===E;if(!l&&"ADMIN"!==E&&"SUB_ADMIN"!==E)return{error:"Forbidden. Admin privileges required.",status:403};let p=[];if(Array.isArray(u.adminPermissions))p=u.adminPermissions;else if("string"==typeof u.adminPermissions)try{p=JSON.parse(u.adminPermissions)}catch{p=[]}if(l||"ADMIN"!==E||0!==p.length||(p=["ORDERS_MANAGE","USERS_MANAGE","INVITATIONS_MANAGE","CANVA_TEMPLATES_MANAGE","SHOP_PRODUCTS_MANAGE"]),l&&(p=n.map(e=>e.key)),e&&!l){if("ADMINS_MANAGE"===e)return{error:"Forbidden. Only Super Admin can manage administrative staff.",status:403};if(!p.includes(e))return{error:`Forbidden. You lack the required '${e}' administrative permission.`,status:403}}return{admin:{id:u.id,name:u.name,email:u.email,role:E,adminPermissions:p,isSuperAdmin:l}}}e.s(["ALL_ADMIN_PERMISSIONS",0,n,"SUPER_ADMIN_EMAILS",0,i,"getAdminAuth",0,o])},52933,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),i=e.i(61916),n=e.i(74677),o=e.i(69741),T=e.i(16795),d=e.i(87718),u=e.i(95169),E=e.i(47587),l=e.i(66012),p=e.i(70101),c=e.i(26937),N=e.i(10372),A=e.i(93695);e.i(52474);var m=e.i(220),L=e.i(89171),O=e.i(7064),U=e.i(62802),R=e.i(77894),S=e.i(54799);async function I(){try{await (0,U.ensureDbSchema)();let e=await (0,R.getAdminAuth)("SHOP_PRODUCTS_MANAGE");if(e.error||!e.admin)return L.NextResponse.json({error:e.error||"Unauthorized"},{status:e.status||401});let t=[];try{t=await O.prisma.$queryRawUnsafe(`
        SELECT * FROM "ShopProduct" ORDER BY "sortOrder" ASC, "createdAt" DESC
      `)}catch{O.prisma.shopProduct&&(t=await O.prisma.shopProduct.findMany({orderBy:[{sortOrder:"asc"},{createdAt:"desc"}]}))}return L.NextResponse.json({products:t})}catch(e){return console.error("Admin Shop Products GET Error:",e),L.NextResponse.json({error:e?.message||"Failed to fetch shop products"},{status:500})}}async function C(e){try{await (0,U.ensureDbSchema)();let t=await (0,R.getAdminAuth)("SHOP_PRODUCTS_MANAGE");if(t.error||!t.admin)return L.NextResponse.json({error:t.error||"Unauthorized"},{status:t.status||401});let{name:r,category:a="royal",pricePerCard:s=65,minCopies:i=50,previewImage:n,galleryImages:o="[]",badge:T="",paperType:d="350 GSM Textured Board",dimensions:u="5.5 x 8.5 inches",description:E="",features:l=[],canvaTemplateId:p=null,rating:c=5,reviewsCount:N=50,isActive:A=!0,sortOrder:m=0}=await e.json();if(!r||!n)return L.NextResponse.json({error:"Product name and image URL are required."},{status:400});let I=Array.isArray(l)?JSON.stringify(l):"string"==typeof l?l:"[]",C=`prod_${S.default.randomBytes(12).toString("hex")}`,g=String(r).trim(),D=String(a).toLowerCase(),h=Number(s)||65,f=Number(i)||50,y=String(n).trim(),P="string"==typeof o?o:JSON.stringify(o||[]),M=T?String(T).trim():null,w=String(d).trim()||"350 GSM Textured Board",x=String(u).trim()||"5.5 x 8.5 inches",v=String(E).trim(),F=p?String(p).trim():null,_=Number(c)||5,b=Number(N)||50,X=!!A,k=Number(m)||0,j=null,$=!1;if(O.prisma.shopProduct)try{j=await O.prisma.shopProduct.create({data:{id:C,name:g,category:D,pricePerCard:h,minCopies:f,previewImage:y,galleryImages:P,badge:M,paperType:w,dimensions:x,description:v,featuresJson:I,canvaTemplateId:F,rating:_,reviewsCount:b,isActive:X,sortOrder:k}})}catch(e){console.warn("Prisma create failed, falling back to raw SQL:",e),$=!0}return(!j||$)&&(await O.prisma.$executeRawUnsafe(`INSERT INTO "ShopProduct" ("id", "name", "category", "pricePerCard", "minCopies", "previewImage", "galleryImages", "badge", "paperType", "dimensions", "description", "featuresJson", "canvaTemplateId", "rating", "reviewsCount", "isActive", "sortOrder", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())`,C,g,D,h,f,y,P,M,w,x,v,I,F,_,b,X,k),j=(await O.prisma.$queryRawUnsafe('SELECT * FROM "ShopProduct" WHERE "id" = $1 LIMIT 1',C))[0]||{id:C,name:g,category:D,pricePerCard:h,minCopies:f,previewImage:y,galleryImages:P,badge:M,paperType:w,dimensions:x,description:v,featuresJson:I,rating:_,reviewsCount:b,isActive:X,sortOrder:k,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),L.NextResponse.json({success:!0,product:j})}catch(e){return console.error("Admin Shop Product Create Error:",e),L.NextResponse.json({error:e?.message||"Failed to create shop product"},{status:500})}}async function g(e){try{await (0,U.ensureDbSchema)();let t=await (0,R.getAdminAuth)("SHOP_PRODUCTS_MANAGE");if(t.error||!t.admin)return L.NextResponse.json({error:t.error||"Unauthorized"},{status:t.status||401});let{productIds:r,isActive:a}=await e.json();if(!Array.isArray(r)||0===r.length)return L.NextResponse.json({error:"productIds array is required."},{status:400});return O.prisma.shopProduct?await O.prisma.shopProduct.updateMany({where:{id:{in:r}},data:{isActive:!!a}}):await O.prisma.$executeRawUnsafe('UPDATE "ShopProduct" SET "isActive" = $1, "updatedAt" = NOW() WHERE "id" = ANY($2::text[])',!!a,r),L.NextResponse.json({success:!0,updatedCount:r.length})}catch(e){return console.error("Admin Shop Products Bulk PATCH Error:",e),L.NextResponse.json({error:e?.message||"Failed to bulk update products"},{status:500})}}async function D(e){try{await (0,U.ensureDbSchema)();let t=await (0,R.getAdminAuth)("SHOP_PRODUCTS_MANAGE");if(t.error||!t.admin)return L.NextResponse.json({error:t.error||"Unauthorized"},{status:t.status||401});let{productIds:r}=await e.json();if(!Array.isArray(r)||0===r.length)return L.NextResponse.json({error:"productIds array is required."},{status:400});return O.prisma.shopProduct?await O.prisma.shopProduct.deleteMany({where:{id:{in:r}}}):await O.prisma.$executeRawUnsafe('DELETE FROM "ShopProduct" WHERE "id" = ANY($1::text[])',r),L.NextResponse.json({success:!0,deletedCount:r.length})}catch(e){return console.error("Admin Shop Products Bulk DELETE Error:",e),L.NextResponse.json({error:e?.message||"Failed to bulk delete products"},{status:500})}}e.s(["DELETE",0,D,"GET",0,I,"PATCH",0,g,"POST",0,C],56812);var h=e.i(56812);let f=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/shop/products/route",pathname:"/api/admin/shop/products",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/admin/shop/products/route.ts",nextConfigOutput:"",userland:h,...{}}),{workAsyncStorage:y,workUnitAsyncStorage:P,serverHooks:M}=f;async function w(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),f.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/admin/shop/products/route";L=L.replace(/\/index$/,"")||"/";let O=await f.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,deploymentId:R,params:S,nextConfig:I,parsedUrl:C,isDraftMode:g,prerenderManifest:D,routerServerContext:h,isOnDemandRevalidate:y,revalidateOnlyGenerated:P,resolvedPathname:M,clientReferenceManifest:w,serverActionsManifest:x}=O,v=(0,o.normalizeAppPath)(L),F=!!(D.dynamicRoutes[v]||D.routes[M]),_=async()=>((null==h?void 0:h.render404)?await h.render404(e,t,C,!1):t.end("This page could not be found"),null);if(F&&!g){let e=!!D.routes[M],t=D.dynamicRoutes[v];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await _();throw new A.NoFallbackError}}let b=null;!F||f.isDev||g||(b="/index"===(b=M)?"/":b);let X=!0===f.isDev||!F,k=F&&!X;x&&w&&(0,n.setManifestsSingleton)({page:L,clientReferenceManifest:w,serverActionsManifest:x});let j=e.method||"GET",$=(0,i.getTracer)(),G=$.getActiveScopeSpan(),q=!!(null==h?void 0:h.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),H=(0,s.getRequestMeta)(e,"incrementalCache")||await f.getIncrementalCache(e,I,D,B);null==H||H.resetRequestCache(),globalThis.__incrementalCache=H;let Y={params:S,previewProps:D.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:X,incrementalCache:H,cacheLifeProfiles:I.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>f.onRequestError(e,t,a,s,h)},sharedContext:{buildId:U,deploymentId:R}},K=new T.NodeNextRequest(e),V=new T.NodeNextResponse(t),W=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let s,n=async e=>f.handle(W,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${j} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${j} ${L}`)}),o=async s=>{var i,o;let T=async({previousCacheEntry:r})=>{try{if(!B&&y&&P&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(s);e.fetchMetrics=Y.renderOpts.fetchMetrics;let o=Y.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let T=Y.renderOpts.collectedTags;if(!F)return await (0,l.sendResponse)(K,V,i,Y.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,a=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:y})},!1,h),t}},d=await f.handleResponse({req:e,nextConfig:I,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:P,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:B});if(!F)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",y?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&F||u.delete(N.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,c.getCacheControlHeader)(d.cacheControl)),await (0,l.sendResponse)(K,V,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};q&&G?await o(G):(s=$.getActiveScopeSpan(),await $.withPropagatedContext(e.headers,()=>$.trace(u.BaseServerSpan.handleRequest,{spanName:`${j} ${L}`,kind:i.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},o),void 0,!q))}catch(t){if(t instanceof A.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:y})},!1,h),F)throw t;return await (0,l.sendResponse)(K,V,new Response(null,{status:500})),null}}e.s(["handler",0,w,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:P})},"routeModule",0,f,"serverHooks",0,M,"workAsyncStorage",0,y,"workUnitAsyncStorage",0,P],52933)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0sfw89v._.js.map