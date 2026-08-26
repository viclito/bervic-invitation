module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n.default}});var s=e.r(16020);Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})});var n=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=i(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var n=a?Object.getOwnPropertyDescriptor(e,s):null;n&&(n.get||n.set)?Object.defineProperty(r,s,n):r[s]=e[s]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function i(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(i=function(e){return e?r:t})(e)}Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},77894,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064),s=e.i(62802);let n=["berglin1998@gmail.com"],i=[{key:"ORDERS_MANAGE",label:"Orders & Print Fulfillment",description:"Manage physical card orders, print status, shipping, customer chat, and work order PDFs."},{key:"USERS_MANAGE",label:"Users & Quota Allocation",description:"View registered users, grant template & card credits, and manage user subscriptions."},{key:"INVITATIONS_MANAGE",label:"Invitations & Lock Security",description:"Inspect customer digital invitations, view RSVP guests, and lock/unlock public links."},{key:"CANVA_TEMPLATES_MANAGE",label:"Canva Template Studio",description:"Create, edit, and publish dynamic Canva card templates and decorative motif assets."},{key:"SHOP_PRODUCTS_MANAGE",label:"Print Shop Catalog",description:"Manage physical print products, paper stocks, wax seals, and pricing tiers."},{key:"ADMINS_MANAGE",label:"Staff & Permissions (Super Admin)",description:"Create new sub-admins, promote existing users to admin, and manage staff permissions."}];async function o(e){await (0,s.ensureDbSchema)();let o=await (0,t.getServerSession)(r.authOptions);if(!o||!o.user||!o.user.email)return{error:"Unauthorized. Please sign in.",status:401};let T=o.user.email.toLowerCase().trim(),l=n.includes(T),d=null;try{d=await a.prisma.user.findUnique({where:{email:T},select:{id:!0,name:!0,email:!0,role:!0,adminPermissions:!0}})}catch(e){console.warn("Error finding admin user via prisma, attempting fallback:",e?.message);try{let e=await a.prisma.$queryRawUnsafe('SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1',T);e&&e.length>0&&(d=e[0])}catch(e){console.error("SQL query error in getAdminAuth:",e?.message)}}if(!d)return{error:"User account not found.",status:404};let E=l?"SUPER_ADMIN":(d.role||"USER").toUpperCase(),u=l||"SUPER_ADMIN"===E;if(!u&&"ADMIN"!==E&&"SUB_ADMIN"!==E)return{error:"Forbidden. Admin privileges required.",status:403};let c=[];if(Array.isArray(d.adminPermissions))c=d.adminPermissions;else if("string"==typeof d.adminPermissions)try{c=JSON.parse(d.adminPermissions)}catch{c=[]}if(u||"ADMIN"!==E||0!==c.length||(c=["ORDERS_MANAGE","USERS_MANAGE","INVITATIONS_MANAGE","CANVA_TEMPLATES_MANAGE","SHOP_PRODUCTS_MANAGE"]),u&&(c=i.map(e=>e.key)),e&&!u){if("ADMINS_MANAGE"===e)return{error:"Forbidden. Only Super Admin can manage administrative staff.",status:403};if(!c.includes(e))return{error:`Forbidden. You lack the required '${e}' administrative permission.`,status:403}}return{admin:{id:d.id,name:d.name,email:d.email,role:E,adminPermissions:c,isSuperAdmin:u}}}e.s(["ALL_ADMIN_PERMISSIONS",0,i,"SUPER_ADMIN_EMAILS",0,n,"getAdminAuth",0,o])},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},85690,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),n=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),E=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),N=e.i(10372),A=e.i(93695);e.i(52474);var L=e.i(220),m=e.i(89171),O=e.i(7064),U=e.i(62802),R=e.i(77894),I=e.i(42848);function S(e){if(!e||"string"!=typeof e)return!1;let t=e.toLowerCase().trim();return!(t.endsWith(".jpg")||t.endsWith(".jpeg")||t.includes("preview")||t.includes("cover")||t.includes("bg_")||t.includes("background")||t.includes("card_")||t.includes("top-floral-arch.webp")||t.includes("shop_")||t.includes("products/"))&&!!(t.includes("bervic-canva/overlays")||t.includes("/overlays/")||t.endsWith(".png")||t.endsWith(".webp"))}async function f(){try{await (0,U.ensureDbSchema)();let e=await (0,R.getAdminAuth)("CANVA_TEMPLATES_MANAGE");if(e.error||!e.admin)return m.NextResponse.json({error:e.error||"Unauthorized"},{status:e.status||401});let t=new Set;try{(await (0,I.listCloudinaryPNGOverlays)(100)).forEach(e=>{S(e)&&t.add(e)})}catch(e){console.warn("Failed to fetch Cloudinary PNG overlays:",e)}try{for(let e of(O.prisma.canvaTemplate?await O.prisma.canvaTemplate.findMany({select:{elementsJson:!0}}):await O.prisma.$queryRawUnsafe(`
          SELECT "elementsJson" FROM "CanvaTemplate"
        `))||[]){let r=[];try{r="string"==typeof e.elementsJson?JSON.parse(e.elementsJson||"[]"):e.elementsJson||[]}catch{r=[]}let a=e=>{if(e&&"image"===e.type&&e.src&&"string"==typeof e.src){let r=e.src.trim();S(r)&&t.add(r)}};Array.isArray(r)?r.forEach(a):r&&Array.isArray(r.layers)&&r.layers.forEach(e=>{Array.isArray(e.elements)&&e.elements.forEach(a)})}}catch(e){console.warn("Failed to extract overlays from templates:",e)}["/images/canva/leaf-divider.webp","/images/canva/floral-footer.webp","/images/canva/vintage-swirl-header.webp","/images/canva/vintage-wave-divider.webp","/images/canva/vintage-swirl-footer.webp"].forEach(e=>{S(e)&&t.add(e)});let r=Array.from(t).filter(Boolean);return m.NextResponse.json({success:!0,count:r.length,assets:r})}catch(e){return console.error("Admin Canva Assets GET Error:",e),m.NextResponse.json({error:e?.message||"Failed to fetch Canva assets"},{status:500})}}e.s(["GET",0,f,"dynamic",0,"force-dynamic"],73672);var C=e.i(73672);let D=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/canva-assets/route",pathname:"/api/admin/canva-assets",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/admin/canva-assets/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:h,serverHooks:v}=D;async function y(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),D.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let m="/api/admin/canva-assets/route";m=m.replace(/\/index$/,"")||"/";let O=await D.prepare(e,t,{srcPage:m,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,deploymentId:R,params:I,nextConfig:S,parsedUrl:f,isDraftMode:C,prerenderManifest:g,routerServerContext:h,isOnDemandRevalidate:v,revalidateOnlyGenerated:y,resolvedPathname:M,clientReferenceManifest:w,serverActionsManifest:x}=O,P=(0,o.normalizeAppPath)(m),F=!!(g.dynamicRoutes[P]||g.routes[M]),X=async()=>((null==h?void 0:h.render404)?await h.render404(e,t,f,!1):t.end("This page could not be found"),null);if(F&&!C){let e=!!g.routes[M],t=g.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await X();throw new A.NoFallbackError}}let _=null;!F||D.isDev||C||(_="/index"===(_=M)?"/":_);let b=!0===D.isDev||!F,k=F&&!b;x&&w&&(0,i.setManifestsSingleton)({page:m,clientReferenceManifest:w,serverActionsManifest:x});let q=e.method||"GET",G=(0,n.getTracer)(),j=G.getActiveScopeSpan(),B=!!(null==h?void 0:h.isWrappedByNextServer),$=!!(0,s.getRequestMeta)(e,"minimalMode"),H=(0,s.getRequestMeta)(e,"incrementalCache")||await D.getIncrementalCache(e,S,g,$);null==H||H.resetRequestCache(),globalThis.__incrementalCache=H;let K={params:I,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:b,incrementalCache:H,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>D.onRequestError(e,t,a,s,h)},sharedContext:{buildId:U,deploymentId:R}},Y=new T.NodeNextRequest(e),J=new T.NodeNextResponse(t),V=l.NextRequestAdapter.fromNodeNextRequest(Y,(0,l.signalFromNodeResponse)(t));try{let s,i=async e=>D.handle(V,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=G.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${q} ${m}`)}),o=async s=>{var n,o;let T=async({previousCacheEntry:r})=>{try{if(!$&&v&&y&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(s);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let T=K.renderOpts.collectedTags;if(!F)return await (0,u.sendResponse)(Y,J,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:L.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await D.onRequestError(e,t,{routerKind:"App Router",routePath:m,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,h),t}},l=await D.handleResponse({req:e,nextConfig:S,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:y,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:$});if(!F)return null;if((null==l||null==(n=l.value)?void 0:n.kind)!==L.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});$||t.setHeader("x-nextjs-cache",v?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,c.fromNodeOutgoingHttpHeaders)(l.value.headers);return $&&F||d.delete(N.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,p.getCacheControlHeader)(l.cacheControl)),await (0,u.sendResponse)(Y,J,new Response(l.value.body,{headers:d,status:l.value.status||200})),null};B&&j?await o(j):(s=G.getActiveScopeSpan(),await G.withPropagatedContext(e.headers,()=>G.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${m}`,kind:n.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof A.NoFallbackError||await D.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,h),F)throw t;return await (0,u.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:h})},"routeModule",0,D,"serverHooks",0,v,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,h],85690)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__03fbp_2._.js.map