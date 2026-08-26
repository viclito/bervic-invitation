module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},21624,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),T=e.i(59756),s=e.i(61916),n=e.i(74677),i=e.i(69741),o=e.i(16795),E=e.i(87718),d=e.i(95169),l=e.i(47587),N=e.i(66012),p=e.i(70101),c=e.i(26937),u=e.i(10372),L=e.i(93695);e.i(52474);var A=e.i(220),U=e.i(89171),O=e.i(7064),R=e.i(62802);async function I(){try{await (0,R.ensureDbSchema)();let e=(await O.prisma.$queryRawUnsafe(`
      SELECT * FROM "CanvaTemplate" WHERE "isActive" = true ORDER BY "sortOrder" ASC, "createdAt" DESC
    `)||[]).map(e=>{let t=[];try{t="string"==typeof e.elementsJson?JSON.parse(e.elementsJson):e.elementsJson||[]}catch{t=[]}let r=null;try{e.colorVariantsJson&&(r="string"==typeof e.colorVariantsJson?JSON.parse(e.colorVariantsJson):e.colorVariantsJson)}catch{r=null}return{id:e.slug||e.id,dbId:e.id,name:e.name,topic:e.topic||"vintage",category:e.category||"Custom Admin Template",pricePerCard:void 0!==e.pricePerCard&&null!==e.pricePerCard?Number(e.pricePerCard):30,minCopies:void 0!==e.minCopies&&null!==e.minCopies?Number(e.minCopies):50,paperType:e.paperType||"350 GSM Textured Metallic Gold Cardstock",badge:e.badge||null,previewImage:e.previewImage||"/images/canva/template1-thumb.webp",aspectRatio:e.aspectRatio||"classic",backgroundColor:e.backgroundColor||"#F3EAD8",backgroundImage:e.backgroundImage||void 0,elements:t,colorVariants:r,isCustom:!0,sortOrder:e.sortOrder??0,createdAt:e.createdAt}});return U.NextResponse.json({templates:e})}catch(e){return console.error("Canva Templates Public GET Error:",e),U.NextResponse.json({error:e?.message||"Failed to fetch Canva templates"},{status:500})}}e.s(["GET",0,I,"dynamic",0,"force-dynamic"],43612);var C=e.i(43612);let m=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/canva/templates/route",pathname:"/api/canva/templates",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/canva/templates/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:D,workUnitAsyncStorage:S,serverHooks:g}=m;async function F(e,t,a){a.requestMeta&&(0,T.setRequestMeta)(e,a.requestMeta),m.isDev&&(0,T.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let U="/api/canva/templates/route";U=U.replace(/\/index$/,"")||"/";let O=await m.prepare(e,t,{srcPage:U,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:C,nextConfig:D,parsedUrl:S,isDraftMode:g,prerenderManifest:F,routerServerContext:v,isOnDemandRevalidate:X,revalidateOnlyGenerated:M,resolvedPathname:h,clientReferenceManifest:x,serverActionsManifest:w}=O,P=(0,i.normalizeAppPath)(U),f=!!(F.dynamicRoutes[P]||F.routes[h]),y=async()=>((null==v?void 0:v.render404)?await v.render404(e,t,S,!1):t.end("This page could not be found"),null);if(f&&!g){let e=!!F.routes[h],t=F.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(D.adapterPath)return await y();throw new L.NoFallbackError}}let b=null;!f||m.isDev||g||(b="/index"===(b=h)?"/":b);let _=!0===m.isDev||!f,k=f&&!_;w&&x&&(0,n.setManifestsSingleton)({page:U,clientReferenceManifest:x,serverActionsManifest:w});let G=e.method||"GET",B=(0,s.getTracer)(),q=B.getActiveScopeSpan(),j=!!(null==v?void 0:v.isWrappedByNextServer),$=!!(0,T.getRequestMeta)(e,"minimalMode"),H=(0,T.getRequestMeta)(e,"incrementalCache")||await m.getIncrementalCache(e,D,F,$);null==H||H.resetRequestCache(),globalThis.__incrementalCache=H;let K={params:C,previewProps:F.preview,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:_,incrementalCache:H,cacheLifeProfiles:D.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,T)=>m.onRequestError(e,t,a,T,v)},sharedContext:{buildId:R,deploymentId:I}},Y=new o.NodeNextRequest(e),J=new o.NodeNextResponse(t),V=E.NextRequestAdapter.fromNodeNextRequest(Y,(0,E.signalFromNodeResponse)(t));try{let T,n=async e=>m.handle(V,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=B.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${G} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),T&&T!==e&&(T.setAttribute("http.route",a),T.updateName(t))}else e.updateName(`${G} ${U}`)}),i=async T=>{var s,i;let o=async({previousCacheEntry:r})=>{try{if(!$&&X&&M&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await n(T);e.fetchMetrics=K.renderOpts.fetchMetrics;let i=K.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let o=K.renderOpts.collectedTags;if(!f)return await (0,N.sendResponse)(Y,J,s,K.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(s.headers);o&&(t[u.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=u.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=u.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await m.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:X})},!1,v),t}},E=await m.handleResponse({req:e,nextConfig:D,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:F,isRoutePPREnabled:!1,isOnDemandRevalidate:X,revalidateOnlyGenerated:M,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:$});if(!f)return null;if((null==E||null==(s=E.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(i=E.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});$||t.setHeader("x-nextjs-cache",X?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,p.fromNodeOutgoingHttpHeaders)(E.value.headers);return $&&f||d.delete(u.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,c.getCacheControlHeader)(E.cacheControl)),await (0,N.sendResponse)(Y,J,new Response(E.value.body,{headers:d,status:E.value.status||200})),null};j&&q?await i(q):(T=B.getActiveScopeSpan(),await B.withPropagatedContext(e.headers,()=>B.trace(d.BaseServerSpan.handleRequest,{spanName:`${G} ${U}`,kind:s.SpanKind.SERVER,attributes:{"http.method":G,"http.target":e.url}},i),void 0,!j))}catch(t){if(t instanceof L.NoFallbackError||await m.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:X})},!1,v),f)throw t;return await (0,N.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,F,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:S})},"routeModule",0,m,"serverHooks",0,g,"workAsyncStorage",0,D,"workUnitAsyncStorage",0,S],21624)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1x6dh81._.js.map