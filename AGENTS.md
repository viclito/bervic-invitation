<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mandatory Agent Verification Protocol & Architectural Guidelines

Before executing any user command, chat instruction, or modifying codebase files in `bervic-invitation`, **YOU MUST READ AND FOLLOW** [`SYSTEM_VERIFICATION_AND_ARCHITECTURE.md`](file:///d:/Desktop/NEXT/bervic-invitation/SYSTEM_VERIFICATION_AND_ARCHITECTURE.md).

## Mandatory Execution Rules:
1. **Pre-flight Check:** Inspect existing files, Prisma schema, and API contracts before making edits. Always enforce multi-tenant boundaries (`userId` isolation).
2. **Performance & Low-Latency First:** Ensure no N+1 database queries, apply dynamic imports for heavy components (`framer-motion`, `lenis`), use static/ISR caching for public invitation routes (`/[slug]`), and use debounced live preview inputs.
3. **Mandatory Post-Execution Verification:** Before marking any task complete or declaring success, execute:
   - `npx tsc --noEmit` (Static Typecheck)
   - `npm run lint` (ESLint audit)
   - `npm run build` (Next.js production build verification)
   - `npx prisma validate` (Prisma schema validation)
