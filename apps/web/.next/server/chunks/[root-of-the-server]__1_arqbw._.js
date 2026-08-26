module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i.default}});var s=e.r(16020);Object.keys(s).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===s[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return s[e]}})});var i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var i=a?Object.getOwnPropertyDescriptor(e,s):null;i&&(i.get||i.set)?Object.defineProperty(r,s,i):r[s]=e[s]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(n=function(e){return e?r:t})(e)}Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},83811,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064);async function s(e){if(e){let t=e.headers.get("authorization")||e.headers.get("Authorization");if(t&&t.startsWith("Bearer ")){let e=t.replace("Bearer ","").trim();try{let t=JSON.parse(Buffer.from(e,"base64url").toString("utf-8"));if(t.userId){let e=await a.prisma.user.findUnique({where:{id:t.userId}});if(e)return e}else if(t.email){let e=await a.prisma.user.findUnique({where:{email:t.email.toLowerCase().trim()}});if(e)return e}}catch{}}}try{let e=await (0,t.getServerSession)(r.authOptions);if(e?.user?.email){let t=await a.prisma.user.findUnique({where:{email:e.user.email.toLowerCase().trim()}});if(t)return t}}catch{}return null}e.s(["getAuthUser",0,s])},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},4446,(e,t,r)=>{t.exports=e.x("net",()=>require("net"))},46786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},55004,(e,t,r)=>{t.exports=e.x("tls",()=>require("tls"))},71282,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),i=e.i(61916),n=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),u=e.i(95169),d=e.i(47587),E=e.i(66012),p=e.i(70101),c=e.i(26937),N=e.i(10372),L=e.i(93695);e.i(52474);var m=e.i(220),A=e.i(89171),O=e.i(7064),U=e.i(83811),R=e.i(62802),I=e.i(67403);let f=O.prisma;async function C(e){try{let t,r;await (0,R.ensureDbSchema)();let a=await (0,U.getAuthUser)(e);if(!a||!a.email)return A.NextResponse.json({error:"Unauthorized. Please log in to place an order."},{status:401});let s=await O.prisma.user.findUnique({where:{id:a.id},select:{id:!0,name:!0,email:!0,phone:!0}});if(!s)return A.NextResponse.json({error:"User profile not found"},{status:404});let{customerName:i,customerEmail:n,customerPhone:o,deliveryAddress:T,city:l,pincode:u,notes:d="",items:E=[],isCartCheckout:p=!1}=await e.json(),c=String(i||s.name||"Valued Customer").trim();if(!c||c.length<2)return A.NextResponse.json({error:"Please enter a valid customer name (minimum 2 characters)."},{status:400});let N=String(o||s.phone||"").trim(),L=N.replace(/\D/g,"");if(!L||L.length<10)return A.NextResponse.json({error:"Please enter a valid 10-digit WhatsApp or contact phone number."},{status:400});let m=L.length>15?L.slice(-10):N,C=String(n||s.email||"").trim().toLowerCase();if(C&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(C))return A.NextResponse.json({error:"Please enter a valid email address."},{status:400});let S=String(T||"").trim();if(!S||S.length<3)return A.NextResponse.json({error:"Please enter your delivery / shipping address."},{status:400});if(!String(l||"").trim())return A.NextResponse.json({error:"Please enter your City / District / State."},{status:400});let D=String(u||"").trim(),g=D.replace(/\D/g,"");if(!D||6!==g.length)return A.NextResponse.json({error:"Please enter a valid 6-digit postal pincode."},{status:400});if(!Array.isArray(E)||0===E.length)return A.NextResponse.json({error:"No items provided for ordering."},{status:400});for(let e of E){let t=Number(e.copies);if(isNaN(t)||t<1)return A.NextResponse.json({error:`Invalid quantity for item "${e.templateName||"Custom Card"}". Minimum is 1 copy.`},{status:400})}let h=E.reduce((e,t)=>e+Math.max(1,Number(t.copies)||1),0),x=E.reduce((e,t)=>e+(Number(t.price)||0)*(Number(t.copies)||1),0),w=(t=new Date().toISOString().slice(2,10).replace(/-/g,""),r=Math.floor(1e3+9e3*Math.random()).toString(),`BV-${t}-${r}`),y=await f.cardOrder.create({data:{orderNumber:w,userId:s.id,customerName:c,customerEmail:C,customerPhone:m,deliveryAddress:S,city:l?String(l).trim():null,pincode:u?String(u).trim():null,status:"PENDING",totalCopies:h,totalAmount:x,paymentStatus:"PENDING",notes:d?String(d).trim():null,items:{create:E.map(e=>({itemType:e.itemType||"CANVA_CARD",templateId:String(e.templateId||"custom"),templateName:String(e.templateName||"Custom Card"),previewImage:e.previewImage||null,copies:Math.max(1,Number(e.copies)||1),cardDetailsJson:"string"==typeof e.cardDetails?e.cardDetails:JSON.stringify(e.cardDetails||{}),elementsJson:"string"==typeof e.elements?e.elements:JSON.stringify(e.elements||[]),customNotes:e.customNotes?String(e.customNotes).trim():null,price:Number(e.price)||0}))}},include:{items:!0}});p&&await f.cartItem.deleteMany({where:{userId:s.id}});try{await Promise.allSettled([(0,I.sendAdminNewOrderNotification)(y,y.items||[]),(0,I.sendUserOrderConfirmation)(y,y.items||[])])}catch(e){console.error("Order notification email error (non-fatal):",e)}return A.NextResponse.json({success:!0,orderNumber:y.orderNumber,orderId:y.id,message:"Order placed successfully!"})}catch(e){return console.error("Order Creation Error:",e),A.NextResponse.json({error:e?.message||"Failed to place order"},{status:500})}}e.s(["POST",0,C],36614);var S=e.i(36614);let D=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/orders/create/route",pathname:"/api/orders/create",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/orders/create/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:h,serverHooks:x}=D;async function w(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),D.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let A="/api/orders/create/route";A=A.replace(/\/index$/,"")||"/";let O=await D.prepare(e,t,{srcPage:A,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,deploymentId:R,params:I,nextConfig:f,parsedUrl:C,isDraftMode:S,prerenderManifest:g,routerServerContext:h,isOnDemandRevalidate:x,revalidateOnlyGenerated:w,resolvedPathname:y,clientReferenceManifest:v,serverActionsManifest:M}=O,P=(0,o.normalizeAppPath)(A),F=!!(g.dynamicRoutes[P]||g.routes[y]),X=async()=>((null==h?void 0:h.render404)?await h.render404(e,t,C,!1):t.end("This page could not be found"),null);if(F&&!S){let e=!!g.routes[y],t=g.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(f.adapterPath)return await X();throw new L.NoFallbackError}}let b=null;!F||D.isDev||S||(b="/index"===(b=y)?"/":b);let _=!0===D.isDev||!F,q=F&&!_;M&&v&&(0,n.setManifestsSingleton)({page:A,clientReferenceManifest:v,serverActionsManifest:M});let j=e.method||"GET",k=(0,i.getTracer)(),B=k.getActiveScopeSpan(),G=!!(null==h?void 0:h.isWrappedByNextServer),$=!!(0,s.getRequestMeta)(e,"minimalMode"),K=(0,s.getRequestMeta)(e,"incrementalCache")||await D.getIncrementalCache(e,f,g,$);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let H={params:I,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:_,incrementalCache:K,cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>D.onRequestError(e,t,a,s,h)},sharedContext:{buildId:U,deploymentId:R}},Y=new T.NodeNextRequest(e),J=new T.NodeNextResponse(t),V=l.NextRequestAdapter.fromNodeNextRequest(Y,(0,l.signalFromNodeResponse)(t));try{let s,n=async e=>D.handle(V,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=k.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${j} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${j} ${A}`)}),o=async s=>{var i,o;let T=async({previousCacheEntry:r})=>{try{if(!$&&x&&w&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(s);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let T=H.renderOpts.collectedTags;if(!F)return await (0,E.sendResponse)(Y,J,i,H.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await D.onRequestError(e,t,{routerKind:"App Router",routePath:A,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:x})},!1,h),t}},l=await D.handleResponse({req:e,nextConfig:f,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:w,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:$});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});$||t.setHeader("x-nextjs-cache",x?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return $&&F||u.delete(N.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,c.getCacheControlHeader)(l.cacheControl)),await (0,E.sendResponse)(Y,J,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};G&&B?await o(B):(s=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(u.BaseServerSpan.handleRequest,{spanName:`${j} ${A}`,kind:i.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},o),void 0,!G))}catch(t){if(t instanceof L.NoFallbackError||await D.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:x})},!1,h),F)throw t;return await (0,E.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,w,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:h})},"routeModule",0,D,"serverHooks",0,x,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,h],71282)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1_arqbw._.js.map