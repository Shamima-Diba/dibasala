# DIBASALA Deployment Readiness

**Status: DEPLOYED — one security configuration follow-up remains.**

Target: `Shamima-Diba/dibasala`, branch `fix/ready-deploy-final`, Supabase ref `ruamhcchaeogodsltskw`.

## Verified complete
- CI `npm ci` and `npm run build` passed (GitHub Actions run #48 for commit `b94deceb865200c47dbf086a4c562c8dd7721924`).
- Published courses are mapped dynamically from `public.courses`; no hard-coded fallback catalog remains.
- Dashboard display name reads `public.profiles.display_name` by `user_id`.
- Frontend and Edge Function use the required Bengali AI configuration error while preserving the `{ question: aiQ.trim() }` request payload.
- Six live Advisor-reported FK indexes were applied and verified.
- Least-privilege RLS policies were applied and verified; access-code values remain unavailable to authenticated clients.
- `ai-tutor` Edge Function version 26 is active with JWT verification enabled.
- Vercel production deployment `dpl_G2oRvVRNxgJuJjFCuQYgASodh3kw` is READY; `https://dibasala.vercel.app/` returned HTTP 200.
- The production JavaScript asset contains the updated profile and AI message code and no longer contains the hard-coded Arif greeting or course slug template.

## Outstanding
- Supabase Auth leaked-password protection is still disabled according to Security Advisor. Enable it in the Supabase Dashboard's Authentication password-security settings and rerun the Advisor.
- Review the Advisor warning for `public.consume_ai_quota()` separately; its authenticated 10/day behavior was preserved.
- Continue monitoring runtime errors and validate real sign-in, course loading, and AI Tutor flows with a test account.

This report does not claim the remaining Auth setting has been enabled.
