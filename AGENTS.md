<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mandatory Agent Verification Protocol & Architectural Guidelines

Before executing any user command, chat instruction, or modifying codebase files in `bervic-invitation`, **YOU MUST READ AND FOLLOW** [`SYSTEM_VERIFICATION_AND_ARCHITECTURE.md`](file:///d:/Desktop/NEXT/bervic-invitation/SYSTEM_VERIFICATION_AND_ARCHITECTURE.md).

## Mandatory Execution Rules:
1. **Strict Workspace Boundary Isolation (Expo Mobile vs. Web):** When working, chatting, altering, or implementing code for Expo / React Native (`apps/mobile`), **DO NOT TOUCH, MODIFY, OR EDIT ANY WEBSITE CODE (`apps/web`)** unless the user explicitly instructs website or shared API changes. Touching website files unintentionally can introduce regressions, break production web flows, and create an uncomfortable user experience. Keep mobile changes strictly isolated within `apps/mobile/`.
2. **Pre-flight Check:** Inspect existing files, Prisma schema, and API contracts before making edits. Always enforce multi-tenant boundaries (`userId` isolation).
3. **Performance & Low-Latency First:** Ensure no N+1 database queries, apply dynamic imports for heavy components (`framer-motion`, `lenis`), use static/ISR caching for public invitation routes (`/[slug]`), and use debounced live preview inputs.
4. **No Dummy / Mock Data:** NEVER insert fake, mock, placeholder, or dummy data into the database, API responses, or frontend hooks/components. The application and database must strictly operate on genuine user and administrator data only.
5. **Per-File Error & Runtime Verification (Zero-Error Production Guarantee):** For EVERY single file that you create, modify, or edit, you MUST actively check, trace, and test whether any error could occur in that specific file (runtime exceptions, undefined properties, API 500 responses, SQL/column/constraint mismatches, missing defaults, or unhandled promises). Never leave unverified execution paths in created or edited files that could cause production failure or outages.
6. **Mandatory Post-Execution Verification:** Before marking any task complete or declaring success, execute:
   - `npx tsc --noEmit` (Static Typecheck)
   - `npm run lint` (ESLint audit)
   - `npm run build` (Next.js production build verification)
   - `npx prisma validate` (Prisma schema validation)
7. **Zero 500 Error Guarantee & API Resilience (Mandatory Check in EVERY Chat):**
   - In EVERY single chat and task, ensure all API endpoints (especially mission-critical transaction routes like `/api/orders/create`, `/api/cart`, `/api/payment/*`, and drafts) implement bulletproof data validation, schema auto-migration (`ensureDbSchema.ts`), defensive direct database fallbacks, and non-blocking background notifications.
   - NO user or administrator submission (e.g. placing an order, uploading drafts, saving templates) is ever allowed to return an unhandled 500 Internal Server Error. Trace and verify the end-to-end flow.
8. **Permanent Deletion & No Auto-Generation / Re-Seeding (Zero Category or Record Resurrection - Mandatory Check in EVERY Chat):**
   - NEVER auto-generate, re-seed, or re-insert default records (such as `ShopCategory`, `ShopDimension`, `ShopProduct`, or templates) in database initialization or auto-migration files (`ensureDbSchema.ts`).
   - When an administrator or user deletes a record (e.g., categories, templates, dimensions), that entity MUST stay deleted permanently. NEVER use `INSERT ... ON CONFLICT DO NOTHING` or hardcoded fallback arrays that resurrect deleted records upon server requests or page reloads.
