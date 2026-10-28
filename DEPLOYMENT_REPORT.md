# DIBASALA Deployment Report

Date: 2026-10-28

## Release evidence

- Repository: `Shamima-Diba/dibasala`
- Branch: `fix/ready-deploy-final`
- Deployed code commit: `b94deceb865200c47dbf086a4c562c8dd7721924`
- GitHub Actions CI run #48: success; `npm ci`, `npm run build`, archive packaging and artifact upload completed.
- Vercel production deployment: `dpl_G2oRvVRNxgJuJjFCuQYgASodh3kw`, state `READY`, target `production`.
- Production site smoke test: `https://dibasala.vercel.app/` returned HTTP 200 and the DIBASALA page title.
- Production JavaScript asset returned HTTP 200; it contains dynamic profile-name lookup and the required Bengali AI configuration message; it does not contain the old Arif greeting or hard-coded course slug.
- Supabase project: `ruamhcchaeogodsltskw`.
- Database migrations applied through Supabase migration runner: six covering indexes and least-privilege policies for premium access-code tables.
- Live verification confirmed all six indexes and the intended policies exist.
- `ai-tutor` Edge Function is active at version 26 with JWT verification enabled.
- Vercel runtime error query returned no runtime errors in the selected range.

## Remaining security follow-up

Supabase Security Advisor still reports `auth_leaked_password_protection` as disabled. The available Supabase tool connection did not expose an Auth settings mutation action, so this setting was not changed. Enable it in Supabase Dashboard → Authentication → Settings / Password Security (wording may vary), then rerun the Security Advisor. The Advisor also warns that `public.consume_ai_quota()` is callable by authenticated users as a `SECURITY DEFINER` function; this was left unchanged because it is the intended authenticated 10/day quota RPC and should be reviewed separately before altering its permissions.

## Scope

No payment provider or payment flow was added. The live course catalog is database-backed, profile greeting reads `profiles.display_name` by `user_id`, and the AI request body remains `{ question: aiQ.trim() }`.
