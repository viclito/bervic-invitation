# System Verification Protocol & High-Performance Architecture Specification

> **Project:** Bervic Invitation Suite (`bervic-invitation`)  
> **Target Audience:** AI Agents, Lead Engineers, and Core Developers  
> **Status:** Active System Rule & Architectural Blueprint  

---

## 1. Mandatory Command & Chat Verification Protocol

Every AI agent or developer making changes to this codebase **MUST** strictly execute this verification protocol. No task is considered complete until all verification steps pass cleanly without errors, warnings, or regressions.

```
┌────────────────────────────────────────────────────────┐
│               RECEIVED COMMAND / REQUEST                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ STEP 1: PRE-FLIGHT VERIFICATION                        │
│ • Inspect existing code & API contracts                │
│ • Verify database schemas in prisma/schema.prisma      │
│ • Enforce multi-tenant boundary check (userId context) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ STEP 2: CODE IMPLEMENTATION                            │
│ • Write modular, clean TypeScript code                 │
│ • Use proper error handling & non-blocking patterns    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ STEP 3: MANDATORY POST-EXECUTION CHECKS                │
│ 1. Typecheck:   npx tsc --noEmit                       │
│ 2. Linting:     npm run lint                           │
│ 3. Build Check: npm run build                          │
│ 4. DB Sync:     npx prisma validate                    │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │  ALL CHECKS PASSED CLEAN  │
              └─────────────┬─────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               REPORT SUCCESS TO USER                   │
└────────────────────────────────────────────────────────┘
```

### 1.1 Pre-Flight Rules (Before Editing)
1. **Strict Workspace Boundary Isolation (Expo Mobile vs. Website Code):** When implementing, chatting about, altering, or debugging features for the Expo / React Native mobile app (`apps/mobile`), **NEVER touch, edit, or modify website code (`apps/web`)** unless the user explicitly and intentionally directs website changes. Modifying website components, styles, or routes while working on Expo can introduce unexpected regressions on the live production website and disrupt web users. Keep mobile changes strictly isolated within `apps/mobile/`.
2. **Never Assume Code Structure:** Always inspect existing files using `view_file` or code search tools before implementing features.
3. **Multi-Tenant Boundary Check:** Ensure every database query involving user data strictly filters by `userId` to prevent data leakage across different accounts.
4. **No Breaking API Contracts:** When altering API routes or Prisma models, locate all invocation sites and update them synchronously.
5. **No Dummy / Mock Data:** NEVER insert fake, mock, placeholder, or dummy records into the database or hardcode mock fallback data into hooks/components. The database and client components must only contain and display genuine user and administrator data.
6. **Per-File Error & Runtime Verification (Zero-Error Production Guarantee):** For EVERY single file that you create, modify, or edit, you MUST actively verify whether any error could occur in that specific file (runtime exceptions, undefined properties, API 500 responses, SQL/column/constraint mismatches, missing defaults, or unhandled promises). Test and trace the execution path of the created/edited file so that broken code is never left behind to cause production failure.
7. **Zero 500 Error Guarantee & Dual-Tier Fallback Protocol (Mandatory Check in EVERY Chat):**
   - Every API endpoint that receives user inputs (especially `/api/orders/create`, `/api/cart`, `/api/payment/*`, and draft saving routes) MUST implement resilient dual-tier database execution (primary typed model queries + direct dynamic/SQL fallback), full schema synchronization (`ensureDbSchema.ts`), and non-blocking background notification handlers.
   - Under no circumstances should any user or admin submission return an unhandled 500 Internal Server Error.
8. **Permanent Deletion & Zero Record Resurrection (Mandatory Check in EVERY Chat):**
   - NEVER auto-generate, re-seed, or re-insert default records (such as `ShopCategory`, `ShopDimension`, `ShopProduct`, or templates) in database initialization or auto-migration files (`ensureDbSchema.ts`).
   - When an administrator or user deletes an entity, it MUST permanently stay deleted. NEVER use `INSERT ... ON CONFLICT DO NOTHING` or hardcoded fallback lists that resurrect deleted records upon server requests or page reloads.

### 1.2 Post-Execution Verification Commands
Before marking any chat request or command as complete, run the following verification steps:
- **TypeScript Static Analysis:**  
  ```bash
  npx tsc --noEmit
  ```
- **Linter Audit:**  
  ```bash
  npm run lint
  ```
- **Next.js Production Build Validation:**  
  ```bash
  npm run build
  ```
- **Prisma Schema Integrity:**  
  ```bash
  npx prisma validate
  ```

---

## 2. High-Concurrency & Low-Latency Performance Architecture

To handle thousands of concurrent users logging in, creating, and viewing wedding invitation templates simultaneously without lag, latency, or server bottlenecks, the following architecture must be maintained:

### 2.1 Handling High User Logins & Auth Spikes
- **JWT Session Caching:** Use NextAuth with optimized JWT session tokens to eliminate database queries on every authenticated API request.
- **Rate Limiting:** Protect login, signup, and OTP endpoints (`app/api/auth/*`) using token-bucket rate limiting via Upstash Redis (`@upstash/ratelimit`) to prevent brute-force attacks and server overload during traffic spikes.
- **Database Connection Pooling:** 
  - Use Prisma Client as a singleton pattern (`lib/prisma.ts`).
  - Configure PostgreSQL connection pooling using PgBouncer or Supabase/Neon pooled connection URLs (`DATABASE_URL` with connection limit tuning, and `DIRECT_URL` for migrations).

### 2.2 Database Query Optimization & Indexing Strategy
- **Index Requirements:** Ensure all lookup columns in `prisma/schema.prisma` have explicit indexes:
  - `User`: `email` (unique index)
  - `UserInvitation`: `[userId]`, `[slug]` (unique index)
  - `Guest`: `[invitationId]`, `[uniqueCode]` (indexed)
  - `OtpVerification`: `[email]`, `[code]` (indexed)
- **N+1 Query Prevention:** Avoid looping over Prisma queries. Use `include` or batch queries (`findMany` with `in` operators).

### 2.3 Sub-100ms Public Invitation Rendering (`/[slug]`)
- **Incremental Static Regeneration (ISR):** Public wedding invitation pages (`app/invitations/[slug]/page.tsx`) must be rendered using Next.js ISR with a background revalidation strategy (`export const revalidate = 60;`). This serves statically cached HTML directly from CDN edge nodes, reducing latency to < 50ms.
- **Optimistic UI Updates:** Use React `useOptimistic` and `useTransition` hooks for guest RSVP forms so UI interactions complete instantly before backend requests finish.

### 2.4 Frontend Bundle & Media Optimization
- **Dynamic Imports & Code Splitting:** Heavy libraries (e.g. Framer Motion, Lenis smooth scroll, Canvas animation plugins, audio players) must be loaded dynamically using `next/dynamic` or `React.lazy()` with `ssr: false` when not needed immediately on first paint.
- **Image Pipeline:** 
  - Use `next/image` with explicit `width`, `height`, and `sizes` attributes for Cloudinary images.
  - Enable WebP/AVIF format conversion and CDN edge caching.
- **State Debouncing:** Live invitation editor components must debounce preview state updates (200–300ms) to prevent unnecessary re-renders during typing.

---

## 3. Full Technical Architecture Roadmap (~98% Remaining Implementation)

Currently, the project is at an initial ~2% MVP stage (basic layout, initial auth setup, and Prisma models). Below is the comprehensive technical roadmap to build out the remaining 98% of the platform.

### Module 1: Multi-Tenant Authentication & Account Hardening
- [ ] Implement password reset flow & magic links via Nodemailer.
- [ ] Add OAuth providers (Google Auth, Apple ID) in `lib/authOptions.ts`.
- [ ] Implement RBAC (Role-Based Access Control: `USER`, `ADMIN`, `VIP_ORGANIZER`).
- [ ] Enforce security headers (HSTS, CSP, X-Frame-Options) in `next.config.ts`.

### Module 2: Schema-Driven Template Engine & Visual Editor
- [ ] Define JSON schema for invitation content structure (`types/template.ts`).
- [ ] Create modular dynamic template renderers (`components/templates/ClassicTheme.tsx`, `RoyalGoldTheme.tsx`, `ModernMinimalTheme.tsx`).
- [ ] Build a live split-screen customizable editor with real-time preview, color pickers, font selector, and custom section toggles.
- [ ] Server-side Open Graph (OG) Image generation (`app/api/og/route.tsx`) for rich social media cards when sharing invitation links on WhatsApp/Instagram.

### Module 3: Asynchronous Background Queue (WhatsApp & Email Engine)
- [ ] Integrate Redis Queue (BullMQ / QStash) for background job processing.
- [ ] WhatsApp Webhook & API integration (Meta Graph API / Twilio) to send digital event passes directly to guest phones.
- [ ] Automated RSVP follow-up & reminder scheduler for guests who haven't responded 3 days before the event.
- [ ] Resilient retry logic with exponential backoff for failed message deliveries.

### Module 4: Guest Management, RSVP & Check-in System
- [ ] Unique QR Code generation for each registered guest (`lib/qrcode.ts`).
- [ ] Guest check-in scanning scanner app / web portal for event organizers at venue entrances.
- [ ] Bulk Guest Import/Export via CSV / Excel files.
- [ ] Real-time RSVP analytical dashboard (Attendance breakdown, dietary preferences, plus-ones counter).

### Module 5: Subscription, Payments & Custom Domains
- [ ] Stripe / Razorpay Webhooks and Checkout session integration.
- [ ] Tiered pricing enforcement (Free: 1 invitation/50 guests; Premium: Unlimited guests/Custom domains/WhatsApp automation).
- [ ] Custom domain middleware routing (allowing couples to point `wedding.johnandjane.com` directly to their invitation page via Next.js Middleware).

### Module 6: Observability, Analytics & System Health
- [ ] Integrate Sentry for real-time frontend and server-side crash reporting.
- [ ] Implement `/api/health` monitoring endpoint for uptime metrics.
- [ ] Database query latency tracking & automated slow query alerts.

---

## 4. Summary Checklist for Every Task

Before submitting any code change, verify against this checklist:
- [ ] Code passes `npx tsc --noEmit` without errors.
- [ ] Code passes `npm run lint` without warnings/errors.
- [ ] Application builds successfully via `npm run build`.
- [ ] `userId` multi-tenant boundaries are strictly enforced.
- [ ] Performance metrics (no un-debounced state, no N+1 queries, dynamic imports used for heavy components) are preserved.
