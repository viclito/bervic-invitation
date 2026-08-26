module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},21517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},24836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},45706,(e,t,r)=>{t.exports=e.x("querystring",()=>require("querystring"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},7064,e=>{"use strict";let t;var r=e.i(63021);let a=globalThis.prisma??new r.PrismaClient({datasourceUrl:((t=process.env.DATABASE_URL||"")&&!t.includes("pool_timeout")&&(t+=(t.includes("?")?"&":"?")+"connection_limit=25&pool_timeout=60&connect_timeout=30"),t),log:["error"]});e.s(["prisma",0,a])},6461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},16020,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0})},57660,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n.default}});var i=e.r(16020);Object.keys(i).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}})});var n=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=s(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&({}).hasOwnProperty.call(e,i)){var n=a?Object.getOwnPropertyDescriptor(e,i):null;n&&(n.get||n.set)?Object.defineProperty(r,i,n):r[i]=e[i]}return r.default=e,t&&t.set(e,r),r}(e.r(23667));function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}Object.keys(n).forEach(function(e){"default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e)||e in r&&r[e]===n[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return n[e]}})})},62802,e=>{"use strict";var t=e.i(7064);let r=null;async function a(){return r||(r=(async()=>{try{await t.prisma.$executeRawUnsafe(`
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
        `)}catch(e){console.warn("Db Schema Auto-Migration warning:",e?.message)}})()),r}e.s(["ensureDbSchema",0,a])},77894,e=>{"use strict";var t=e.i(57660),r=e.i(2918),a=e.i(7064),i=e.i(62802);let n=["berglin1998@gmail.com"],s=[{key:"ORDERS_MANAGE",label:"Orders & Print Fulfillment",description:"Manage physical card orders, print status, shipping, customer chat, and work order PDFs."},{key:"USERS_MANAGE",label:"Users & Quota Allocation",description:"View registered users, grant template & card credits, and manage user subscriptions."},{key:"INVITATIONS_MANAGE",label:"Invitations & Lock Security",description:"Inspect customer digital invitations, view RSVP guests, and lock/unlock public links."},{key:"CANVA_TEMPLATES_MANAGE",label:"Canva Template Studio",description:"Create, edit, and publish dynamic Canva card templates and decorative motif assets."},{key:"SHOP_PRODUCTS_MANAGE",label:"Print Shop Catalog",description:"Manage physical print products, paper stocks, wax seals, and pricing tiers."},{key:"ADMINS_MANAGE",label:"Staff & Permissions (Super Admin)",description:"Create new sub-admins, promote existing users to admin, and manage staff permissions."}];async function o(e){await (0,i.ensureDbSchema)();let o=await (0,t.getServerSession)(r.authOptions);if(!o||!o.user||!o.user.email)return{error:"Unauthorized. Please sign in.",status:401};let T=o.user.email.toLowerCase().trim(),E=n.includes(T),d=null;try{d=await a.prisma.user.findUnique({where:{email:T},select:{id:!0,name:!0,email:!0,role:!0,adminPermissions:!0}})}catch(e){console.warn("Error finding admin user via prisma, attempting fallback:",e?.message);try{let e=await a.prisma.$queryRawUnsafe('SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1',T);e&&e.length>0&&(d=e[0])}catch(e){console.error("SQL query error in getAdminAuth:",e?.message)}}if(!d)return{error:"User account not found.",status:404};let l=E?"SUPER_ADMIN":(d.role||"USER").toUpperCase(),u=E||"SUPER_ADMIN"===l;if(!u&&"ADMIN"!==l&&"SUB_ADMIN"!==l)return{error:"Forbidden. Admin privileges required.",status:403};let c=[];if(Array.isArray(d.adminPermissions))c=d.adminPermissions;else if("string"==typeof d.adminPermissions)try{c=JSON.parse(d.adminPermissions)}catch{c=[]}if(u||"ADMIN"!==l||0!==c.length||(c=["ORDERS_MANAGE","USERS_MANAGE","INVITATIONS_MANAGE","CANVA_TEMPLATES_MANAGE","SHOP_PRODUCTS_MANAGE"]),u&&(c=s.map(e=>e.key)),e&&!u){if("ADMINS_MANAGE"===e)return{error:"Forbidden. Only Super Admin can manage administrative staff.",status:403};if(!c.includes(e))return{error:`Forbidden. You lack the required '${e}' administrative permission.`,status:403}}return{admin:{id:d.id,name:d.name,email:d.email,role:l,adminPermissions:c,isSuperAdmin:u}}}e.s(["ALL_ADMIN_PERMISSIONS",0,s,"SUPER_ADMIN_EMAILS",0,n,"getAdminAuth",0,o])},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},88716,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),i=e.i(59756),n=e.i(61916),s=e.i(74677),o=e.i(69741),T=e.i(16795),E=e.i(87718),d=e.i(95169),l=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),N=e.i(10372),A=e.i(93695);e.i(52474);var L=e.i(220),U=e.i(89171),O=e.i(22734),m=e.i(14747),R=e.i(77894);async function I(){try{let e=await (0,R.getAdminAuth)("CANVA_TEMPLATES_MANAGE");if(e.error||!e.admin)return U.NextResponse.json({error:e.error||"Unauthorized"},{status:e.status||401});let t=m.default.join(process.cwd(),"public","images","canva","backgrounds"),r=[];O.default.existsSync(t)&&(r=O.default.readdirSync(t).filter(e=>e.endsWith(".webp")||e.endsWith(".png")||e.endsWith(".jpg")).sort((e,t)=>e.localeCompare(t,void 0,{numeric:!0,sensitivity:"base"})));let a=r.map((e,t)=>{let r=String(t+1).padStart(2,"0");return{id:`texture-${r}`,name:`Texture ${r}`,num:r,src:`/images/canva/backgrounds/${e}`}});return U.NextResponse.json({textures:a,count:a.length})}catch(e){return console.error("Failed to list textures:",e),U.NextResponse.json({error:"Failed to list textures",textures:[]},{status:500})}}e.s(["GET",0,I,"dynamic",0,"force-dynamic"],4759);var S=e.i(4759);let C=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/canva-textures/route",pathname:"/api/admin/canva-textures",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/app/api/admin/canva-textures/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:D,workUnitAsyncStorage:f,serverHooks:M}=C;async function g(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),C.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let U="/api/admin/canva-textures/route";U=U.replace(/\/index$/,"")||"/";let O=await C.prepare(e,t,{srcPage:U,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:m,deploymentId:R,params:I,nextConfig:S,parsedUrl:D,isDraftMode:f,prerenderManifest:M,routerServerContext:g,isOnDemandRevalidate:x,revalidateOnlyGenerated:h,resolvedPathname:v,clientReferenceManifest:y,serverActionsManifest:P}=O,w=(0,o.normalizeAppPath)(U),F=!!(M.dynamicRoutes[w]||M.routes[v]),X=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,D,!1):t.end("This page could not be found"),null);if(F&&!f){let e=!!M.routes[v],t=M.dynamicRoutes[w];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await X();throw new A.NoFallbackError}}let _=null;!F||C.isDev||f||(_="/index"===(_=v)?"/":_);let b=!0===C.isDev||!F,k=F&&!b;P&&y&&(0,s.setManifestsSingleton)({page:U,clientReferenceManifest:y,serverActionsManifest:P});let q=e.method||"GET",G=(0,n.getTracer)(),j=G.getActiveScopeSpan(),B=!!(null==g?void 0:g.isWrappedByNextServer),$=!!(0,i.getRequestMeta)(e,"minimalMode"),H=(0,i.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,S,M,$);null==H||H.resetRequestCache(),globalThis.__incrementalCache=H;let K={params:I,previewProps:M.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:b,incrementalCache:H,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>C.onRequestError(e,t,a,i,g)},sharedContext:{buildId:m,deploymentId:R}},Y=new T.NodeNextRequest(e),V=new T.NodeNextResponse(t),W=E.NextRequestAdapter.fromNodeNextRequest(Y,(0,E.signalFromNodeResponse)(t));try{let i,s=async e=>C.handle(W,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=G.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${q} ${U}`)}),o=async i=>{var n,o;let T=async({previousCacheEntry:r})=>{try{if(!$&&x&&h&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(i);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let T=K.renderOpts.collectedTags;if(!F)return await (0,u.sendResponse)(Y,V,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);T&&(t[N.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:L.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,g),t}},E=await C.handleResponse({req:e,nextConfig:S,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:M,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:h,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:$});if(!F)return null;if((null==E||null==(n=E.value)?void 0:n.kind)!==L.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(o=E.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});$||t.setHeader("x-nextjs-cache",x?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,c.fromNodeOutgoingHttpHeaders)(E.value.headers);return $&&F||d.delete(N.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,u.sendResponse)(Y,V,new Response(E.value.body,{headers:d,status:E.value.status||200})),null};B&&j?await o(j):(i=G.getActiveScopeSpan(),await G.withPropagatedContext(e.headers,()=>G.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${U}`,kind:n.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof A.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,g),F)throw t;return await (0,u.sendResponse)(Y,V,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:f})},"routeModule",0,C,"serverHooks",0,M,"workAsyncStorage",0,D,"workUnitAsyncStorage",0,f],88716)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cwxxyu._.js.map