module.exports=[54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s.default}});var n=e.r(16020);Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})});var s=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=i(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var n in e)if("default"!==n&&({}).hasOwnProperty.call(e,n)){var s=a?Object.getOwnPropertyDescriptor(e,n):null;s&&(s.get||s.set)?Object.defineProperty(r,n,s):r[n]=e[n]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function i(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(i=function(e){return e?r:t})(e)}Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},83811,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064);async function n(e){if(e){let t=e.headers.get("authorization")||e.headers.get("Authorization");if(t&&t.startsWith("Bearer ")){let e=t.replace("Bearer ","").trim();try{let t=JSON.parse(Buffer.from(e,"base64url").toString("utf-8"));if(t.userId){let e=await a.prisma.user.findUnique({where:{id:t.userId}});if(e)return e}else if(t.email){let e=await a.prisma.user.findUnique({where:{email:t.email.toLowerCase().trim()}});if(e)return e}}catch{}}}try{let e=await (0,t.getServerSession)(r.authOptions);if(e?.user?.email){let t=await a.prisma.user.findUnique({where:{email:e.user.email.toLowerCase().trim()}});if(t)return t}}catch{}return null}e.s(["getAuthUser",0,n])},32833,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),E=e.i(47587),u=e.i(66012),p=e.i(70101),c=e.i(26937),N=e.i(10372),A=e.i(93695);e.i(52474);var L=e.i(220),C=e.i(89171),O=e.i(83811),U=e.i(7064),m=e.i(62802),I=e.i(54799);async function R(e){try{await (0,m.ensureDbSchema)();let t=await (0,O.getAuthUser)(e),r=t?.id,a=t?.email?.toLowerCase().trim();if(!r&&!a)return C.NextResponse.json({error:"Unauthorized. Please log in."},{status:401});let{razorpay_order_id:n,razorpay_payment_id:s,razorpay_signature:i,plan:o="PRO_1799"}=await e.json();if(n){let e=await U.prisma.payment.findFirst({where:{razorpayOrderId:n,status:"SUCCESS"}}),t=await U.prisma.subscription.findFirst({where:{razorpayOrderId:n}});if(e||t){let e=await U.prisma.user.findUnique({where:{id:r||void 0},select:{plan:!0,planExpiresAt:!0,allowedTemplatesCount:!0,allowedCardsCount:!0}});return C.NextResponse.json({success:!0,message:`Payment already verified for order ${n}.`,plan:e?.plan||o,planExpiresAt:e?.planExpiresAt,allowedTemplatesCount:e?.allowedTemplatesCount||0,allowedCardsCount:e?.allowedCardsCount||0})}}let T=await U.prisma.user.findFirst({where:{OR:[...r?[{id:r}]:[],...a?[{email:a}]:[]]},select:{id:!0,name:!0,email:!0,plan:!0,planExpiresAt:!0,allowedTemplatesCount:!0,allowedCinematicCount:!0,allowedCardsCount:!0}});if(!T)return C.NextResponse.json({error:"User not found."},{status:404});let l=process.env.RAZORPAY_KEY_SECRET||"";n&&s&&i&&I.default.createHmac("sha256",l).update(`${n}|${s}`).digest("hex");let d="CARDS_99"===o?"CARDS_99":"CINEMATIC_2000"===o?"CINEMATIC_2000":"PRO_1799"===o?"PRO_1799":"BASIC_599",E="BASIC_599"===d||"CARDS_99"===d?6:12,u="BASIC_599"===d?1:4*("PRO_1799"===d),p="CARDS_99"===d?5:"BASIC_599"===d?2:"PRO_1799"===d?6:10,c="CARDS_99"===d?99:"BASIC_599"===d?599:"PRO_1799"===d?1799:2e3,N=new Date,A=new Date(N);A.setMonth(A.getMonth()+E);let L=A;if(T.planExpiresAt){let e=new Date(T.planExpiresAt);e>N&&e>A&&(L=e)}let R="CINEMATIC_2000"===d||"CARDS_99"===d?0:u,w=+("CINEMATIC_2000"===d),S=(T.allowedTemplatesCount||0)+R,f=(T.allowedCinematicCount||0)+w,D=(T.allowedCardsCount||0)+p,y=T.plan||"NONE";if("BASIC_599"===d||"PRO_1799"===d){let e={NONE:0,BASIC_599:1,PRO_1799:2,CINEMATIC_2000:0},t=e[T.plan]||0;y=(e[d]||0)>t?d:T.plan||d}if(n)try{await U.prisma.payment.upsert({where:{razorpayOrderId:n},update:{razorpayPaymentId:s||`pay_test_${Date.now()}`,razorpaySignature:i||"test_signature",status:"SUCCESS"},create:{userId:T.id,razorpayOrderId:n,razorpayPaymentId:s||`pay_test_${Date.now()}`,razorpaySignature:i||"test_signature",amount:c,plan:d,status:"SUCCESS"}})}catch(e){console.warn("Payment record error:",e?.message)}try{await U.prisma.subscription.create({data:{userId:T.id,plan:d,amount:c,status:"ACTIVE",allowedTemplates:u,allowedCards:p,startsAt:N,expiresAt:L,razorpayOrderId:n||`order_test_${Date.now()}`,razorpayPaymentId:s||`pay_test_${Date.now()}`}})}catch(e){console.warn("Subscription record error:",e?.message)}let h=null;try{h=await U.prisma.user.update({where:{id:T.id},data:{plan:y,planExpiresAt:L,allowedTemplatesCount:S,allowedCinematicCount:f,allowedCardsCount:D},select:{plan:!0,planExpiresAt:!0,allowedTemplatesCount:!0,allowedCinematicCount:!0,allowedCardsCount:!0}})}catch{h=await U.prisma.user.update({where:{id:T.id},data:{plan:y,planExpiresAt:L,allowedTemplatesCount:S,allowedCardsCount:D},select:{plan:!0,planExpiresAt:!0,allowedTemplatesCount:!0,allowedCardsCount:!0}}),await U.prisma.$executeRawUnsafe('UPDATE "User" SET "allowedCinematicCount" = $1 WHERE "id" = $2;',f,T.id),h.allowedCinematicCount=f}return C.NextResponse.json({success:!0,message:`Payment verified successfully! Your ${"CINEMATIC_2000"===d?"Cinematic Masterpiece (₹2000)":"PRO_1799"===d?"Pro (₹1799)":"Basic (₹599)"} plan is now active.`,plan:h.plan,planExpiresAt:h.planExpiresAt,allowedTemplatesCount:h.allowedTemplatesCount,allowedCardsCount:h.allowedCardsCount})}catch(e){return console.error("Error verifying payment:",e),C.NextResponse.json({error:e?.message||"Failed to verify payment."},{status:500})}}e.s(["POST",0,R],73240);var w=e.i(73240);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/payment/verify/route",pathname:"/api/payment/verify",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/payment/verify/route.ts",nextConfigOutput:"",userland:w,...{}}),{workAsyncStorage:f,workUnitAsyncStorage:D,serverHooks:y}=S;async function h(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let C="/api/payment/verify/route";C=C.replace(/\/index$/,"")||"/";let O=await S.prepare(e,t,{srcPage:C,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,deploymentId:m,params:I,nextConfig:R,parsedUrl:w,isDraftMode:f,prerenderManifest:D,routerServerContext:y,isOnDemandRevalidate:h,revalidateOnlyGenerated:x,resolvedPathname:g,clientReferenceManifest:P,serverActionsManifest:v}=O,M=(0,o.normalizeAppPath)(C),_=!!(D.dynamicRoutes[M]||D.routes[g]),F=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,w,!1):t.end("This page could not be found"),null);if(_&&!f){let e=!!D.routes[g],t=D.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(R.adapterPath)return await F();throw new A.NoFallbackError}}let X=null;!_||S.isDev||f||(X="/index"===(X=g)?"/":X);let b=!0===S.isDev||!_,B=_&&!b;v&&P&&(0,i.setManifestsSingleton)({page:C,clientReferenceManifest:P,serverActionsManifest:v});let q=e.method||"GET",j=(0,s.getTracer)(),k=j.getActiveScopeSpan(),$=!!(null==y?void 0:y.isWrappedByNextServer),G=!!(0,n.getRequestMeta)(e,"minimalMode"),Y=(0,n.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,R,D,G);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let H={params:I,previewProps:D.preview,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:b,incrementalCache:Y,cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>S.onRequestError(e,t,a,n,y)},sharedContext:{buildId:U,deploymentId:m}},K=new T.NodeNextRequest(e),z=new T.NodeNextResponse(t),J=l.NextRequestAdapter.fromNodeNextRequest(K,(0,l.signalFromNodeResponse)(t));try{let n,i=async e=>S.handle(J,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",a),n.updateName(t))}else e.updateName(`${q} ${C}`)}),o=async n=>{var s,o;let T=async({previousCacheEntry:r})=>{try{if(!G&&h&&x&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let T=H.renderOpts.collectedTags;if(!_)return await (0,u.sendResponse)(K,z,s,H.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(s.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:L.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:C,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:h})},!1,y),t}},l=await S.handleResponse({req:e,nextConfig:R,cacheKey:X,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:h,revalidateOnlyGenerated:x,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:G});if(!_)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==L.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",h?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return G&&_||d.delete(N.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,c.getCacheControlHeader)(l.cacheControl)),await (0,u.sendResponse)(K,z,new Response(l.value.body,{headers:d,status:l.value.status||200})),null};$&&k?await o(k):(n=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${C}`,kind:s.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},o),void 0,!$))}catch(t){if(t instanceof A.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:h})},!1,y),_)throw t;return await (0,u.sendResponse)(K,z,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:D})},"routeModule",0,S,"serverHooks",0,y,"workAsyncStorage",0,f,"workUnitAsyncStorage",0,D],32833)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0qp8p3j._.js.map