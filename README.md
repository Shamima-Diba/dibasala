# BanglaLearn — Unified EdTech Starter

একটি mobile-first Bangla learning UI + Supabase backend starter। এটি চারটি source repository-এর audit-ভিত্তিক বাছাই করা architecture, UI/UX prototype, starter database schema এবং authenticated Gemini Edge Function এক জায়গায় রাখে। **এটি এখনো production-ready LMS নয়।**

## Folder map

- `apps/web/` — React + TypeScript + Vite responsive Bangla-first learner dashboard; Supabase client/AI helper scaffolding; Vercel/Netlify SPA config.
- `supabase/migrations/` — learner profile, course, lesson, progress, bookmark, AI daily quota schema with RLS starter policies.
- `supabase/functions/ai-tutor/` — authenticated Gemini Edge Function; request validation, exact-origin allowlist, per-user daily quota, provider timeout and sanitized errors.
- `source-repos/` — all four source snapshots retained for audit/reference; `.git` history omitted.
- `docs/FINAL_AUDIT_BN.md` — evidence-based source comparison, SHA evidence, risk decisions, test status.
- `docs/ARCHITECTURE_AND_SECRET_POLICY_BN.md` — Supabase/Vault/Edge Function/Gemini/Gmail credential design.
- `docs/DEPLOYMENT_PLAN_BN.md` — Vercel/Netlify and Supabase rollout sequence.

## Run frontend

Requirements: Node.js 22+ and npm.

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Set only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for the browser. Do not put Gemini/Gmail/secret/service-role credentials in frontend variables. The dashboard currently uses illustrative demo content; backend helper functions exist but the screen is not yet wired to live courses/progress/auth.

## Backend local setup

Install the Supabase CLI and Docker, then review the migration before applying it to a **local/development project only**. Configure local Edge Function values in `supabase/functions/.env` (never commit that file): `GEMINI_API_KEY`, `GEMINI_MODEL` (বর্তমানে সমর্থিত model ID), `ALLOWED_ORIGINS`. `SUPABASE_URL` and a publishable/anon key are provided by the local Supabase runtime. Confirm exact env names against your Supabase CLI version.

```bash
supabase start
supabase db reset
supabase functions serve ai-tutor --env-file supabase/functions/.env
```

Do not run these against production. The SQL and function are starters and require local validation and security tests before any remote deployment.

## Audit verdict

`GEMINIJUNIOR99` is a reference candidate for dashboard/progress/offline concepts, `Remixgemini` for PWA ideas, `Junior-Gemini` for broader learning tools, and `GEMINI-JUNIOR` for offline/payment UX reference. Identical hashes show substantial overlap, so wholesale merge is not recommended. See the detailed audit.

## Verification status

The source archive and hash comparison were inspected. Build, dependency install, migration apply, Edge Function runtime, RLS adversarial tests and deploy are **UNVERIFIED** in this environment. A prior npm dependency installation timed out. Do not claim build passes or deploy this starter until the documented gates pass.
