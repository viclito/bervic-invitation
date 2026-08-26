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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},18359,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),T=e.i(59756),s=e.i(61916),n=e.i(74677),i=e.i(69741),E=e.i(16795),o=e.i(87718),l=e.i(95169),d=e.i(47587),N=e.i(66012),u=e.i(70101),L=e.i(26937),c=e.i(10372),p=e.i(93695);e.i(52474);var A=e.i(220),U=e.i(89171),O=e.i(7064),R=e.i(62802);async function I(e){try{await (0,R.ensureDbSchema)();let{searchParams:t}=new URL(e.url),r=t.get("slug")||"",a=t.get("invitationId")||"";if(!r||""===r.trim())return U.NextResponse.json({available:!1,error:"Empty slug"},{status:400});let T=r.toLowerCase().trim().replace(/[^a-z0-9-]+/g,"-").replace(/(^-|-$)+/g,"");if(!T)return U.NextResponse.json({available:!1,error:"Invalid slug format"},{status:400});let s=await O.prisma.userInvitation.findFirst({where:{slug:T,...a?{NOT:{id:a}}:{}},select:{id:!0}});return U.NextResponse.json({slug:T,available:!s,message:s?"Route is already taken":"Route is available"})}catch(e){return console.error("Error checking slug availability:",e),U.NextResponse.json({available:!0,message:"Route check bypassed"},{status:200})}}e.s(["GET",0,I],11630);var C=e.i(11630);let D=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/invitations/check-slug/route",pathname:"/api/invitations/check-slug",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/invitations/check-slug/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:m,workUnitAsyncStorage:S,serverHooks:g}=D;async function F(e,t,a){a.requestMeta&&(0,T.setRequestMeta)(e,a.requestMeta),D.isDev&&(0,T.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let U="/api/invitations/check-slug/route";U=U.replace(/\/index$/,"")||"/";let O=await D.prepare(e,t,{srcPage:U,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:C,nextConfig:m,parsedUrl:S,isDraftMode:g,prerenderManifest:F,routerServerContext:X,isOnDemandRevalidate:v,revalidateOnlyGenerated:h,resolvedPathname:x,clientReferenceManifest:M,serverActionsManifest:w}=O,f=(0,i.normalizeAppPath)(U),P=!!(F.dynamicRoutes[f]||F.routes[x]),y=async()=>((null==X?void 0:X.render404)?await X.render404(e,t,S,!1):t.end("This page could not be found"),null);if(P&&!g){let e=!!F.routes[x],t=F.dynamicRoutes[f];if(t&&!1===t.fallback&&!e){if(m.adapterPath)return await y();throw new p.NoFallbackError}}let b=null;!P||D.isDev||g||(b="/index"===(b=x)?"/":b);let _=!0===D.isDev||!P,k=P&&!_;w&&M&&(0,n.setManifestsSingleton)({page:U,clientReferenceManifest:M,serverActionsManifest:w});let B=e.method||"GET",G=(0,s.getTracer)(),q=G.getActiveScopeSpan(),j=!!(null==X?void 0:X.isWrappedByNextServer),$=!!(0,T.getRequestMeta)(e,"minimalMode"),K=(0,T.getRequestMeta)(e,"incrementalCache")||await D.getIncrementalCache(e,m,F,$);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let H={params:C,previewProps:F.preview,renderOpts:{experimental:{authInterrupts:!!m.experimental.authInterrupts},cacheComponents:!!m.cacheComponents,supportsDynamicResponse:_,incrementalCache:K,cacheLifeProfiles:m.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,T)=>D.onRequestError(e,t,a,T,X)},sharedContext:{buildId:R,deploymentId:I}},Y=new E.NodeNextRequest(e),J=new E.NodeNextResponse(t),V=o.NextRequestAdapter.fromNodeNextRequest(Y,(0,o.signalFromNodeResponse)(t));try{let T,n=async e=>D.handle(V,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=G.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${B} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),T&&T!==e&&(T.setAttribute("http.route",a),T.updateName(t))}else e.updateName(`${B} ${U}`)}),i=async T=>{var s,i;let E=async({previousCacheEntry:r})=>{try{if(!$&&v&&h&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await n(T);e.fetchMetrics=H.renderOpts.fetchMetrics;let i=H.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let E=H.renderOpts.collectedTags;if(!P)return await (0,N.sendResponse)(Y,J,s,H.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(s.headers);E&&(t[c.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=c.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=c.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await D.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,X),t}},o=await D.handleResponse({req:e,nextConfig:m,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:F,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:h,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:$});if(!P)return null;if((null==o||null==(s=o.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==o||null==(i=o.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});$||t.setHeader("x-nextjs-cache",v?"REVALIDATED":o.isMiss?"MISS":o.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,u.fromNodeOutgoingHttpHeaders)(o.value.headers);return $&&P||l.delete(c.NEXT_CACHE_TAGS_HEADER),!o.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,L.getCacheControlHeader)(o.cacheControl)),await (0,N.sendResponse)(Y,J,new Response(o.value.body,{headers:l,status:o.value.status||200})),null};j&&q?await i(q):(T=G.getActiveScopeSpan(),await G.withPropagatedContext(e.headers,()=>G.trace(l.BaseServerSpan.handleRequest,{spanName:`${B} ${U}`,kind:s.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},i),void 0,!j))}catch(t){if(t instanceof p.NoFallbackError||await D.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,X),P)throw t;return await (0,N.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,F,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:S})},"routeModule",0,D,"serverHooks",0,g,"workAsyncStorage",0,m,"workUnitAsyncStorage",0,S],18359)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__00an9ji._.js.map