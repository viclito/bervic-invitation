module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n.default}});var i=e.r(16020);Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}})});var n=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=o(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&({}).hasOwnProperty.call(e,i)){var n=a?Object.getOwnPropertyDescriptor(e,i):null;n&&(n.get||n.set)?Object.defineProperty(r,i,n):r[i]=e[i]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function o(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(o=function(e){return e?r:t})(e)}Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},83811,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064);async function i(e){if(e){let t=e.headers.get("authorization")||e.headers.get("Authorization");if(t&&t.startsWith("Bearer ")){let e=t.replace("Bearer ","").trim();try{let t=JSON.parse(Buffer.from(e,"base64url").toString("utf-8"));if(t.userId){let e=await a.prisma.user.findUnique({where:{id:t.userId}});if(e)return e}else if(t.email){let e=await a.prisma.user.findUnique({where:{email:t.email.toLowerCase().trim()}});if(e)return e}}catch{}}}try{let e=await (0,t.getServerSession)(r.authOptions);if(e?.user?.email){let t=await a.prisma.user.findUnique({where:{email:e.user.email.toLowerCase().trim()}});if(t)return t}}catch{}return null}e.s(["getAuthUser",0,i])},83835,e=>{"use strict";e.s(["checkInvitationLockStatus",0,function(e){let t=new Date,r=e.createdAt?new Date(e.createdAt):new Date,a=e.weddingDate?new Date(e.weddingDate):null,i=Math.max(1,Math.ceil(Math.max(0,t.getTime()-r.getTime())/864e5));if(e.isUnlockedByAdmin)return{isLocked:!1,daysInUse:i,timeUntilLockText:"Admin Unlocked (Unlimited)"};if(e.isLockedByAdmin)return{isLocked:!0,lockReason:"Editing has been manually locked for this invitation by Admin.",daysInUse:i,timeUntilLockText:"Admin Locked"};if(!a||isNaN(a.getTime())||isNaN(r.getTime()))return{isLocked:!1,daysInUse:i,timeUntilLockText:"Wedding Date Not Set"};let n=new Date(a.getTime()-72e5),o=n.getTime()-t.getTime(),s=(t.getTime()-r.getTime())/36e5;if(t>=n&&!(s<24))return{isLocked:!0,lockReason:`Editing is locked starting 2 hours before your event date (${a.toLocaleDateString("en-IN")}) to protect invitation data and prevent multi-event reuse.`,hoursUntilLock:0,timeUntilLockText:"Locked (2H Pre-Event)",lockStartTime:n.toISOString(),daysInUse:i};let T="";if(o>0){let e=Math.floor(o/6e4),t=Math.floor(e/1440),r=Math.floor(e%1440/60),a=e%60;T=t>0?`Locks in ${t}d ${r}h`:r>0?`Locks in ${r}h ${a}m`:`Locks in ${a} mins`}else{let e=Math.floor((24-s)*36e5/6e4),t=Math.floor(e/60);T=`Creation Grace Active (Locks in ${t}h ${e%60}m)`}return{isLocked:!1,hoursUntilLock:Math.max(0,Math.round(o/36e5)),timeUntilLockText:T,lockStartTime:n.toISOString(),daysInUse:i}}])},98127,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),i=e.i(59756),n=e.i(61916),o=e.i(74677),s=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),E=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),N=e.i(10372),L=e.i(93695);e.i(52474);var A=e.i(220),U=e.i(89171),m=e.i(7064),O=e.i(83811),I=e.i(42848);async function R(e){for(let t of e)try{await (0,I.deleteCloudinaryImage)(t)}catch(e){console.error(`Failed to destroy Cloudinary image ${t}:`,e)}}async function f(){try{let e=new Date;for(let t of(await m.prisma.userInvitation.findMany({include:{user:!0}}))){let r=t.user?.planExpiresAt;if(r&&new Date(r)>e||r&&e.getTime()-new Date(r).getTime()<6048e5)continue;let a=[];if(t.heroImage&&a.push(t.heroImage),t.coupleImage&&a.push(t.coupleImage),t.locationsJson)try{for(let e of JSON.parse(t.locationsJson))e.image&&a.push(e.image)}catch(e){}if(t.galleryImagesJson)try{for(let e of JSON.parse(t.galleryImagesJson))"string"==typeof e&&a.push(e)}catch(e){}await R(a),await m.prisma.userInvitation.delete({where:{id:t.id}}),console.log(`Cleaned expired invitation ID: ${t.id} (Slug: ${t.slug}) post subscription expiry.`)}}catch(e){console.error("Error during automatic invitation cleanup:",e)}}var D=e.i(62802),h=e.i(83835);async function C(e){try{await (0,D.ensureDbSchema)(),f().catch(e=>{console.warn("Background invitation cleanup warning:",e?.message)});let t=await (0,O.getAuthUser)(e);if(!t)return U.NextResponse.json({error:"Authentication required"},{status:401});let r=t.email.toLowerCase().trim(),a=t.id,i=[];if(a)try{i=await m.prisma.userInvitation.findMany({where:{OR:[{userId:a},...r?[{userId:`user_otp_${r}`}]:[]]},orderBy:{updatedAt:"desc"}})}catch(e){console.warn("Invitations fetch DB warning in my-invitations:",e?.message);try{i=await m.prisma.$queryRawUnsafe('SELECT * FROM "UserInvitation" WHERE "userId" = $1 ORDER BY "updatedAt" DESC',a)}catch{}}let n=(i||[]).map(e=>{let t=(0,h.checkInvitationLockStatus)({createdAt:e.createdAt,weddingDate:e.weddingDate||e.weddingTime,isUnlockedByAdmin:e.isUnlockedByAdmin,isLockedByAdmin:e.isLockedByAdmin});return{...e,isLocked:t.isLocked,timeUntilLockText:t.timeUntilLockText,lockReason:t.lockReason}});return U.NextResponse.json({invitations:n})}catch(e){return console.error("Fetch User Invitations Error:",e),U.NextResponse.json({invitations:[],error:e?.message||"Failed to fetch user invitations"},{status:200})}}e.s(["GET",0,C,"dynamic",0,"force-dynamic","revalidate",0,0],33783);var g=e.i(33783);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/invitations/my-invitations/route",pathname:"/api/invitations/my-invitations",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/invitations/my-invitations/route.ts",nextConfigOutput:"",userland:g,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:w,serverHooks:y}=S;async function x(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let U="/api/invitations/my-invitations/route";U=U.replace(/\/index$/,"")||"/";let m=await S.prepare(e,t,{srcPage:U,multiZoneDraftMode:!1});if(!m)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,deploymentId:I,params:R,nextConfig:f,parsedUrl:D,isDraftMode:h,prerenderManifest:C,routerServerContext:g,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,resolvedPathname:y,clientReferenceManifest:x,serverActionsManifest:M}=m,F=(0,s.normalizeAppPath)(U),X=!!(C.dynamicRoutes[F]||C.routes[y]),P=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,D,!1):t.end("This page could not be found"),null);if(X&&!h){let e=!!C.routes[y],t=C.dynamicRoutes[F];if(t&&!1===t.fallback&&!e){if(f.adapterPath)return await P();throw new L.NoFallbackError}}let k=null;!X||S.isDev||h||(k="/index"===(k=y)?"/":k);let b=!0===S.isDev||!X,_=X&&!b;M&&x&&(0,o.setManifestsSingleton)({page:U,clientReferenceManifest:x,serverActionsManifest:M});let q=e.method||"GET",B=(0,n.getTracer)(),j=B.getActiveScopeSpan(),$=!!(null==g?void 0:g.isWrappedByNextServer),G=!!(0,i.getRequestMeta)(e,"minimalMode"),H=(0,i.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,f,C,G);null==H||H.resetRequestCache(),globalThis.__incrementalCache=H;let K={params:R,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:b,incrementalCache:H,cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>S.onRequestError(e,t,a,i,g)},sharedContext:{buildId:O,deploymentId:I}},Y=new T.NodeNextRequest(e),J=new T.NodeNextResponse(t),W=l.NextRequestAdapter.fromNodeNextRequest(Y,(0,l.signalFromNodeResponse)(t));try{let i,o=async e=>S.handle(W,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=B.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${q} ${U}`)}),s=async i=>{var n,s;let T=async({previousCacheEntry:r})=>{try{if(!G&&v&&w&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let T=K.renderOpts.collectedTags;if(!X)return await (0,u.sendResponse)(Y,J,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,g),t}},l=await S.handleResponse({req:e,nextConfig:f,cacheKey:k,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:G});if(!X)return null;if((null==l||null==(n=l.value)?void 0:n.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(s=l.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",v?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),h&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,c.fromNodeOutgoingHttpHeaders)(l.value.headers);return G&&X||d.delete(N.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,p.getCacheControlHeader)(l.cacheControl)),await (0,u.sendResponse)(Y,J,new Response(l.value.body,{headers:d,status:l.value.status||200})),null};$&&j?await s(j):(i=B.getActiveScopeSpan(),await B.withPropagatedContext(e.headers,()=>B.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${U}`,kind:n.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},s),void 0,!$))}catch(t){if(t instanceof L.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,g),X)throw t;return await (0,u.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:w})},"routeModule",0,S,"serverHooks",0,y,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,w],98127)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__19tmkbs._.js.map