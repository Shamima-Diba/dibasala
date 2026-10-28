# DIBASALA Deployment Readiness

**Status: NOT READY — CI build and artifact verification pending.**

Target: `Shamima-Diba/dibasala`, branch `fix/ready-deploy-final`, Supabase ref `ruamhcchaeogodsltskw`.

Changes on this branch: dynamic published-course catalog with no hard-coded fallback; profile name lookup via `profiles.user_id`; exact Bengali AI configuration error in frontend and Edge Function; six indexes matching live Advisor findings; least-privilege policies that keep code values server-only; CI build log and ZIP artifact packaging.

## Gates
- [ ] `npm ci` succeeds.
- [ ] `npm run build` succeeds.
- [ ] Build log and ZIP artifact verified.
- [ ] Migration SQL reviewed against live schema and remote migration history.
- [ ] Leaked-password protection checked in Supabase Auth settings (not SQL).
- [ ] Production frontend and Edge Function smoke tests pass.

Do not mark READY until each gate has evidence.
