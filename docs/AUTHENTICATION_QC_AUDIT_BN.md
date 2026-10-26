# Authentication QC Audit — BanglaLearn / dibasala

**Audit date:** 2026-10-27  
**Scope:** Static review of the default-branch source and repository docs. No live Supabase project, deployment, secret store, browser session, database, or runtime test was accessed. This is a code-and-docs audit, not a penetration test.

## Executive verdict

**Status: NO-GO for claiming production authentication is implemented.** The repository contains a reasonably layered authentication check for the AI Edge Function, but the learner-facing React app is explicitly documented as a demo UI that is not wired to live Supabase Auth, courses, or progress. Authentication infrastructure in one backend endpoint does not make the whole app an authenticated LMS.

Evidence:
- `README.md` says the dashboard uses illustrative demo content and the screen is not wired to live courses/progress/auth.
- `apps/web/src/App.tsx` has hard-coded sample courses and localStorage-backed UI state; the inspected component does not establish an authenticated-user state.
- `apps/web/src/lib/supabase.ts` calls `createClient()` even when env vars are missing, substituting a placeholder URL/key after only logging a warning.
- `supabase/config.toml` sets `[functions.ai-tutor].verify_jwt = true`.
- `supabase/functions/ai-tutor/index.ts` validates a Bearer header, calls `supabase.auth.getUser()`, and applies a server-side per-user AI quota before calling Gemini.

## Components and responsibility

| Component | Responsibility | QC result |
|---|---|---|
| `apps/web/src/lib/supabase.ts` | Creates the browser Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe key choice is correct. Missing env currently falls back to fake values, which can hide a misconfigured deployment. |
| `apps/web/.env.example` | Documents frontend environment values | Correctly warns not to put Gemini, Gmail, Supabase secret/service-role credentials in `VITE_*`. |
| `apps/web/src/App.tsx` | Demo learner dashboard, sample courses and local UI persistence | Not an authentication component: no sign-in/sign-out/session guard is established in the inspected app flow. localStorage progress/bookmarks are not identity or authorization. |
| `supabase/config.toml` | Edge Function gateway configuration | `verify_jwt = true` is a good first gate; deployment must use matching project configuration. |
| `supabase/functions/ai-tutor/index.ts` | Origin checks, request validation, user verification, quota and Gemini proxy | Layered checks are present. Needs adversarial runtime tests and request-size hardening before production. |
| Supabase Auth + RLS migrations | Identity and row-level data access | Migration and RLS behavior have not been executed or adversarially tested in this audit. |

## Request flow: AI tutor

1. The browser is expected to call the Supabase Edge Function with a Supabase session access token in `Authorization: Bearer <access-token>`, plus the Supabase publishable/anon key in `apikey` as required by the client/gateway setup.
2. The Supabase Functions gateway checks the JWT because `verify_jwt = true`.
3. The function handles `OPTIONS` preflight and checks `Origin` against comma-separated `ALLOWED_ORIGINS`. Origin allowlisting is a browser policy, **not** user authentication; non-browser clients can forge Origin.
4. The handler accepts POST only, requires a Bearer header, parses JSON, and requires a `question` string of 1–2000 characters.
5. It creates a Supabase client using the server URL and publishable/anon key, forwarding the incoming Authorization header. It disables session persistence/auto-refresh for this server-side client.
6. `supabase.auth.getUser()` verifies the supplied token against Supabase Auth and identifies the user. Missing/invalid identity returns 401.
7. `supabase.rpc('consume_ai_quota')` enforces the daily limit (10 questions/user/day); quota backend errors fail closed with 503, exhausted quota returns 429.
8. The function sends the question to Gemini using server-side `GEMINI_API_KEY`, applies a 20-second timeout, and returns a sanitized answer/error. It does not intentionally return upstream response bodies or the Gemini key.

## Credential and token handling

- **Supabase publishable key:** intended to be browser-visible; it is not a user identity and must be paired with correct RLS/policies.
- **Supabase access token:** should be issued by Supabase Auth after a real sign-in. The inspected app does not yet implement that user journey. Supabase JS normally manages session persistence/refresh defaults in a browser client, but this audit did not verify a live session or the deployed SDK version/config.
- **Edge Function Authorization:** forwarded to the server-side Supabase client and validated via `getUser()`; this is preferable to trusting a user ID supplied in JSON.
- **Gemini API key:** read from Edge Function environment, never intentionally sent to the browser. Confirm the production secret is set in the Supabase project secret store, not committed to Git.
- **Service-role/secret key:** no need is demonstrated in the current AI handler; do not introduce it into browser code. Keep it server-only if later required.
- **Gmail OAuth credentials:** Gmail is not part of the current authentication request flow. If added later, use a separate OAuth consent flow, minimum scopes, server-side refresh-token storage, and revocation/rotation procedures.

## Findings ranked by severity

### P0 — Production auth journey is absent from the learner UI
**Evidence:** README's verification note and `apps/web/src/App.tsx` demo data/state.  
**Impact:** users may see a polished dashboard without an actual identity boundary; localStorage state can be edited or shared and does not protect server data.  
**Required action:** implement sign-up/sign-in/sign-out, session restoration, loading/error states, protected learner routes, and authenticated API calls. Do not label the app production-authenticated until end-to-end tests pass.

### P1 — Missing environment values silently become placeholder client configuration
**Evidence:** `apps/web/src/lib/supabase.ts`.  
**Impact:** broken or misconfigured deployments may appear to start in demo mode rather than fail clearly; downstream calls can fail unpredictably.  
**Required action:** expose an explicit configuration status. Do not create a live Supabase client with placeholder credentials; either block live-mode startup with a clear error or intentionally instantiate a separate demo adapter.

### P1 — RLS/migration guarantees are unverified
**Evidence:** README and architecture docs explicitly say migration, RLS adversarial tests and deployment are unverified.  
**Impact:** a valid JWT alone does not prevent one learner from reading or modifying another learner's rows.  
**Required action:** review every exposed table's grants and RLS policies; verify ownership predicates on SELECT/UPDATE/DELETE and `WITH CHECK` on writes; test anonymous, user A, and user B access separately. Never treat `TO authenticated` alone as ownership authorization.

### P2 — Request body is parsed before a hard byte-size cap
**Evidence:** the function checks question length after `await request.json()`.  
**Impact:** a very large JSON body can consume memory/CPU before the 2,000-character question check.  
**Required action:** enforce a small request-body byte limit before or during parsing; reject oversized requests with 413 and test malformed/oversized payloads.

### P2 — Deployment secrets and origin configuration are not verified
**Evidence:** configuration is documented, but the live Supabase/Vercel environment was not accessible in this audit.  
**Impact:** missing or overbroad `ALLOWED_ORIGINS`, absent Gemini secrets, or incorrect project URLs can break or weaken production behavior.  
**Required action:** set exact production origins and required function secrets in provider dashboards; verify with deployment smoke tests. Never paste secrets into issues, PRs, source files, or chat.

### P2 — No verified automated release gate was established by this audit
**Evidence:** repository documentation says install/build/runtime/security tests are unverified.  
**Impact:** regressions can merge without reproducible build and auth/RLS evidence.  
**Required action:** CI should run lockfile-based install, lint, typecheck, production build, dependency/secret scanning, and automated auth/RLS tests.

## QC acceptance gates

- [ ] Real sign-in, sign-out, session restore and expired-token behavior verified in browser.
- [ ] Unauthenticated requests to protected UI/API are denied.
- [ ] AI function: missing token and invalid/expired token return 401.
- [ ] AI function: disallowed origin, non-POST method, malformed JSON and oversized body are rejected.
- [ ] AI quota: concurrent calls cannot exceed the per-user daily quota; quota RPC cannot be invoked to consume another user's quota.
- [ ] RLS: user A cannot read/update/delete user B's progress, bookmarks, profile, or quota records.
- [ ] Client bundle and Git history contain no Gemini, Gmail, service-role, or Supabase secret key.
- [ ] Production build and deployment smoke tests pass against a dedicated staging project.
- [ ] Rollback, secret rotation, session revocation and incident response steps are documented.

## Recommended execution plan

1. **First PR:** this audit and explicit go/no-go gates (this change).
2. **Auth implementation PR:** session-aware auth provider and sign-in/out UI; remove placeholder client fallback; keep demo mode explicit and separate.
3. **Security PR:** body-size cap, CORS/origin tests, RLS policy tests and quota concurrency tests.
4. **Release PR:** CI gates, staging configuration checklist, deployment smoke test, and verified rollback.
5. **Release decision:** deploy only after all blocking gates pass. Do not merge directly to production or claim successful deployment based only on static inspection.

## Sources inspected

- [README.md](../README.md)
- [Frontend Supabase client](../apps/web/src/lib/supabase.ts)
- [Frontend environment example](../apps/web/.env.example)
- [Dashboard](../apps/web/src/App.tsx)
- [Supabase Function configuration](../supabase/config.toml)
- [AI tutor Edge Function](../supabase/functions/ai-tutor/index.ts)
- [Architecture and secret policy](./ARCHITECTURE_AND_SECRET_POLICY_BN.md)
- [Final source audit](./FINAL_AUDIT_BN.md)
