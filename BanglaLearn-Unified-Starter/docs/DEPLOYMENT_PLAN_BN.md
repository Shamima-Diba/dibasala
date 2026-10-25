# Deployment Plan: Vercel/Netlify + Supabase

## সিদ্ধান্তের ক্রম

1. একটি Git repository-তে এই starter আনুন; চারটি `source-repos/` শুধু audit reference হিসেবে রাখুন। পরে archive দরকার না হলে source snapshots আলাদা private archive-এ সরিয়ে production repo ছোট করা যাবে।
2. `apps/web`-কে frontend root directory করুন। Vercel বা Netlify—একটি provider নির্বাচন করুন।
3. প্রথমে আলাদা **development Supabase project** তৈরি/নির্বাচন করুন। production project-এ সরাসরি migration নয়।
4. Supabase CLI/local stack-এ migration apply ও RLS tests চালান; schema diff review করুন।
5. Frontend build environment-এ শুধু `VITE_SUPABASE_URL` এবং `VITE_SUPABASE_PUBLISHABLE_KEY` দিন।
6. Supabase Edge Function secrets-এ `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGINS` দিন। `ALLOWED_ORIGINS`-এ exact HTTPS preview/production origins রাখুন, wildcard নয়। Local development-এর জন্য local function `.env` gitignore-এ থাকবে।
7. `ai-tutor` function deploy করার আগে auth, CORS, quota, provider timeout, output/error sanitization পরীক্ষা করুন।
8. Preview deploy-এ Android/mobile, Bangla font/text wrapping, keyboard, low-bandwidth, login/session expiry এবং anonymous/user A/user B access পরীক্ষা করুন।
9. backup/restore, monitoring, quota/billing alert ও privacy/retention policy অনুমোদনের পরই production rollout।

## Build configuration

- Vercel config: `apps/web/vercel.json` (SPA route fallback)।
- Netlify config: `apps/web/public/_redirects` (SPA route fallback)।
- Build command: `npm run build` (dependency install ও lockfile যোগ করার পর)।
- Output directory: `dist`.
- Root directory: `apps/web`.

## Required CI checks before deploy

- Reproducible install using committed lockfile.
- `npm run typecheck` and `npm run build`.
- SQL migration apply on clean local Supabase database.
- RLS tests: anon, learner A, learner B, teacher, admin.
- Edge Function tests: missing/invalid JWT, malformed JSON, >2000 chars, disallowed origin, quota exhausted, provider timeout/429/5xx.
- Dependency/license audit and secret scan.
- Preview smoke test and accessibility review.

No deployment or remote Supabase action was executed while creating this package.
