module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},93367,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),T=e.i(59756),n=e.i(61916),s=e.i(74677),i=e.i(69741),o=e.i(16795),E=e.i(87718),l=e.i(95169),d=e.i(47587),N=e.i(66012),p=e.i(70101),u=e.i(26937),c=e.i(10372),L=e.i(93695);e.i(52474);var A=e.i(220),U=e.i(89171),O=e.i(7064),R=e.i(62802),I=e.i(54799);async function C(e){try{await (0,R.ensureDbSchema)(),new URL(e.url).searchParams.get("token");let t=await e.formData(),r=t.get("razorpay_order_id")?.toString()||"",a=t.get("razorpay_payment_id")?.toString()||"",T=t.get("razorpay_signature")?.toString()||"";if(!r||!a)return U.NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Missing+payment+details",e.url));let n=await O.prisma.payment.findUnique({where:{razorpayOrderId:r},include:{user:!0}});if(!n||!n.user)return U.NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Order+not+found",e.url));let s=process.env.RAZORPAY_KEY_SECRET||"";T&&I.default.createHmac("sha256",s).update(`${r}|${a}`).digest("hex");let i=n.plan||"PRO_1799",o="BASIC_599"===i||"CARDS_99"===i?6:12,E="BASIC_599"===i?1:4*("PRO_1799"===i),l="CARDS_99"===i?5:"BASIC_599"===i?2:"PRO_1799"===i?6:10,d=new Date,N=new Date(d);N.setMonth(N.getMonth()+o);let p=N;if(n.user.planExpiresAt){let e=new Date(n.user.planExpiresAt);e>d&&e>N&&(p=e)}let u=(n.user.allowedTemplatesCount||0)+E,c=(n.user.allowedCinematicCount||0)+ +("CINEMATIC_2000"===i),L=(n.user.allowedCardsCount||0)+l;await O.prisma.payment.update({where:{id:n.id},data:{razorpayPaymentId:a,razorpaySignature:T,status:"SUCCESS"}}),await O.prisma.user.update({where:{id:n.userId},data:{plan:"CINEMATIC_2000"===i||"CARDS_99"===i?n.user.plan:i,planExpiresAt:p,allowedTemplatesCount:u,allowedCinematicCount:c,allowedCardsCount:L}});let A=new URL(`/checkout/mobile-pay?status=success&plan=${i}&orderId=${r}`,e.url);return U.NextResponse.redirect(A,{status:303})}catch(t){return console.error("Razorpay callback processing error:",t),U.NextResponse.redirect(new URL("/checkout/mobile-pay?status=error&msg=Verification+failed",e.url))}}async function m(e){return C(e)}e.s(["GET",0,m,"POST",0,C],16603);var D=e.i(16603);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/payment/razorpay-callback/route",pathname:"/api/payment/razorpay-callback",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/payment/razorpay-callback/route.ts",nextConfigOutput:"",userland:D,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:g,serverHooks:h}=S;async function x(e,t,a){a.requestMeta&&(0,T.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,T.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let U="/api/payment/razorpay-callback/route";U=U.replace(/\/index$/,"")||"/";let O=await S.prepare(e,t,{srcPage:U,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:C,nextConfig:m,parsedUrl:D,isDraftMode:w,prerenderManifest:g,routerServerContext:h,isOnDemandRevalidate:x,revalidateOnlyGenerated:M,resolvedPathname:X,clientReferenceManifest:F,serverActionsManifest:y}=O,P=(0,i.normalizeAppPath)(U),f=!!(g.dynamicRoutes[P]||g.routes[X]),v=async()=>((null==h?void 0:h.render404)?await h.render404(e,t,D,!1):t.end("This page could not be found"),null);if(f&&!w){let e=!!g.routes[X],t=g.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(m.adapterPath)return await v();throw new L.NoFallbackError}}let _=null;!f||S.isDev||w||(_="/index"===(_=X)?"/":_);let b=!0===S.isDev||!f,k=f&&!b;y&&F&&(0,s.setManifestsSingleton)({page:U,clientReferenceManifest:F,serverActionsManifest:y});let B=e.method||"GET",G=(0,n.getTracer)(),q=G.getActiveScopeSpan(),$=!!(null==h?void 0:h.isWrappedByNextServer),K=!!(0,T.getRequestMeta)(e,"minimalMode"),Y=(0,T.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,m,g,K);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let H={params:C,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!m.experimental.authInterrupts},cacheComponents:!!m.cacheComponents,supportsDynamicResponse:b,incrementalCache:Y,cacheLifeProfiles:m.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,T)=>S.onRequestError(e,t,a,T,h)},sharedContext:{buildId:R,deploymentId:I}},j=new o.NodeNextRequest(e),z=new o.NodeNextResponse(t),V=E.NextRequestAdapter.fromNodeNextRequest(j,(0,E.signalFromNodeResponse)(t));try{let T,s=async e=>S.handle(V,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=G.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${B} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),T&&T!==e&&(T.setAttribute("http.route",a),T.updateName(t))}else e.updateName(`${B} ${U}`)}),i=async T=>{var n,i;let o=async({previousCacheEntry:r})=>{try{if(!K&&x&&M&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(T);e.fetchMetrics=H.renderOpts.fetchMetrics;let i=H.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let o=H.renderOpts.collectedTags;if(!f)return await (0,N.sendResponse)(j,z,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(n.headers);o&&(t[c.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=c.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=c.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,h),t}},E=await S.handleResponse({req:e,nextConfig:m,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:M,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:K});if(!f)return null;if((null==E||null==(n=E.value)?void 0:n.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(i=E.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",x?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,p.fromNodeOutgoingHttpHeaders)(E.value.headers);return K&&f||l.delete(c.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,u.getCacheControlHeader)(E.cacheControl)),await (0,N.sendResponse)(j,z,new Response(E.value.body,{headers:l,status:E.value.status||200})),null};$&&q?await i(q):(T=G.getActiveScopeSpan(),await G.withPropagatedContext(e.headers,()=>G.trace(l.BaseServerSpan.handleRequest,{spanName:`${B} ${U}`,kind:n.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},i),void 0,!$))}catch(t){if(t instanceof L.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,h),f)throw t;return await (0,N.sendResponse)(j,z,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:g})},"routeModule",0,S,"serverHooks",0,h,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,g],93367)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0a1od_e._.js.map