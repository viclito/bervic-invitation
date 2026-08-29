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
5. **Mandatory Post-Execution Verification:** Before marking any task complete or declaring success, execute:
   - `npx tsc --noEmit` (Static Typecheck)
   - `npm run lint` (ESLint audit)
   - `npm run build` (Next.js production build verification)
   - `npx prisma validate` (Prisma schema validation)
