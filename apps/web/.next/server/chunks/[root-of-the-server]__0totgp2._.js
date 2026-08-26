module.exports=[54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n.default}});var s=e.r(16020);Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})});var n=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=T(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var n=a?Object.getOwnPropertyDescriptor(e,s):null;n&&(n.get||n.set)?Object.defineProperty(r,s,n):r[s]=e[s]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function T(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(T=function(e){return e?r:t})(e)}Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},36830,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),n=e.i(61916),T=e.i(74677),i=e.i(69741),o=e.i(16795),E=e.i(87718),d=e.i(95169),l=e.i(47587),u=e.i(66012),N=e.i(70101),p=e.i(26937),c=e.i(10372),L=e.i(93695);e.i(52474);var A=e.i(220),O=e.i(89171),U=e.i(57660),R=e.i(2918),I=e.i(7064),C=e.i(62802);let D=I.prisma;async function m(e,t){try{await (0,C.ensureDbSchema)();let e=await (0,U.getServerSession)(R.authOptions);if(!e||!e.user||!e.user.email)return O.NextResponse.json({error:"Unauthorized. Please log in."},{status:401});let{id:r}=await t.params;if(!r)return O.NextResponse.json({error:"Order ID is required."},{status:400});let a=e.user.email.toLowerCase().trim(),s=await I.prisma.user.findUnique({where:{email:a},select:{id:!0}});if(!s)return O.NextResponse.json({error:"User profile not found."},{status:404});let n=await D.cardOrder.findFirst({where:{id:r,OR:[{userId:s.id},{customerEmail:a}]},include:{items:!0,messages:{orderBy:{createdAt:"asc"}}}});if(!n)return O.NextResponse.json({error:"Order not found or access denied."},{status:404});return O.NextResponse.json({order:n})}catch(e){return console.error("User Order Detail GET Error:",e),O.NextResponse.json({error:e?.message||"Failed to fetch order details."},{status:500})}}e.s(["GET",0,m],64859);var S=e.i(64859);let f=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/user/orders/[id]/route",pathname:"/api/user/orders/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/user/orders/[id]/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:x,workUnitAsyncStorage:h,serverHooks:M}=f;async function F(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),f.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let O="/api/user/orders/[id]/route";O=O.replace(/\/index$/,"")||"/";let U=await f.prepare(e,t,{srcPage:O,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:C,nextConfig:D,parsedUrl:m,isDraftMode:S,prerenderManifest:x,routerServerContext:h,isOnDemandRevalidate:M,revalidateOnlyGenerated:F,resolvedPathname:v,clientReferenceManifest:w,serverActionsManifest:X}=U,g=(0,i.normalizeAppPath)(O),P=!!(x.dynamicRoutes[g]||x.routes[v]),y=async()=>((null==h?void 0:h.render404)?await h.render404(e,t,m,!1):t.end("This page could not be found"),null);if(P&&!S){let e=!!x.routes[v],t=x.dynamicRoutes[g];if(t&&!1===t.fallback&&!e){if(D.adapterPath)return await y();throw new L.NoFallbackError}}let b=null;!P||f.isDev||S||(b="/index"===(b=v)?"/":b);let _=!0===f.isDev||!P,j=P&&!_;X&&w&&(0,T.setManifestsSingleton)({page:O,clientReferenceManifest:w,serverActionsManifest:X});let k=e.method||"GET",q=(0,n.getTracer)(),B=q.getActiveScopeSpan(),G=!!(null==h?void 0:h.isWrappedByNextServer),K=!!(0,s.getRequestMeta)(e,"minimalMode"),$=(0,s.getRequestMeta)(e,"incrementalCache")||await f.getIncrementalCache(e,D,x,K);null==$||$.resetRequestCache(),globalThis.__incrementalCache=$;let H={params:C,previewProps:x.preview,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:_,incrementalCache:$,cacheLifeProfiles:D.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>f.onRequestError(e,t,a,s,h)},sharedContext:{buildId:R,deploymentId:I}},Y=new o.NodeNextRequest(e),J=new o.NodeNextResponse(t),V=E.NextRequestAdapter.fromNodeNextRequest(Y,(0,E.signalFromNodeResponse)(t));try{let s,T=async e=>f.handle(V,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${k} ${O}`)}),i=async s=>{var n,i;let o=async({previousCacheEntry:r})=>{try{if(!K&&M&&F&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await T(s);e.fetchMetrics=H.renderOpts.fetchMetrics;let i=H.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let o=H.renderOpts.collectedTags;if(!P)return await (0,u.sendResponse)(Y,J,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(n.headers);o&&(t[c.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=c.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=c.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:M})},!1,h),t}},E=await f.handleResponse({req:e,nextConfig:D,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:x,isRoutePPREnabled:!1,isOnDemandRevalidate:M,revalidateOnlyGenerated:F,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:K});if(!P)return null;if((null==E||null==(n=E.value)?void 0:n.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(i=E.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",M?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,N.fromNodeOutgoingHttpHeaders)(E.value.headers);return K&&P||d.delete(c.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,u.sendResponse)(Y,J,new Response(E.value.body,{headers:d,status:E.value.status||200})),null};G&&B?await i(B):(s=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${O}`,kind:n.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},i),void 0,!G))}catch(t){if(t instanceof L.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:M})},!1,h),P)throw t;return await (0,u.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,F,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:h})},"routeModule",0,f,"serverHooks",0,M,"workAsyncStorage",0,x,"workUnitAsyncStorage",0,h],36830)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0totgp2._.js.map