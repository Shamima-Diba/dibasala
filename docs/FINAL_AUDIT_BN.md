# চারটি Source Repository: Evidence-based Audit ও Merge Decision

**Audit scope:** `Gemini_4_Repo_All.zip` থেকে সংরক্ষিত চারটি source snapshot; ZIP-এর ফাইল/কোডের static inspection, manifest/hash তুলনা, এবং পরিচিত ঝুঁকিপূর্ণ pattern search। এটি live GitHub history, live API, Supabase database, deploy বা runtime security test নয়।

## 1. সিদ্ধান্ত

**একটি নতুন canonical app তৈরি করুন; চারটি app-এর directory merge করবেন না।** এই deliverable-এ `apps/web`-এর Bangla-first UX prototype-কে frontend starting point রাখা হয়েছে, চারটি snapshot `source-repos/`-এ audit/reference হিসেবে রাখা হয়েছে, এবং `supabase/`-এ একটি starter schema ও authenticated AI Edge Function যোগ করা হয়েছে। এটি একটি implementation starter—এখনো production-ready বা fully integrated LMS নয়।

## 2. Source-level evidence

| Source | Snapshot-এ সরাসরি পাওয়া evidence | Merge সিদ্ধান্ত |
|---|---|---|
| `GEMINIJUNIOR99` | `src/components/Dashboard.tsx`, `LearningProgress.tsx`, `OfflineHub.tsx`, `src/models/aiEngine.ts`, `src/lib/swRegister.ts`; `src/App.tsx` profile state `localStorage`-এ পড়ে/লেখে | Dashboard/progress/offline/AI-provider abstraction-এর reference; auth ও progress persistence নতুন Supabase/RLS layer-এ port করতে হবে |
| `Remixgemini` | `GEMINIJUNIOR99`-এর সঙ্গে `server.ts`, `OfflineHub.tsx`, `LearningProgress.tsx`, `swRegister.ts`, `public/sw.js`, `public/manifest.json`-এর exact SHA-256 match | আলাদা করে merge করলে একই code duplicate হবে; PWA কেবল cache lifecycle, private-data caching ও update tests পাসের পরে port |
| `GEMINI-JUNIOR` | `src/components/EduFeePaymentGateway.tsx`, `OfflineDownloadHub.tsx`, `AuthModal.tsx`; payment receipt/form UI | payment UX reference মাত্র; payment provider, server-side verification ও reconciliation না হওয়া পর্যন্ত real payment হিসেবে চালু নয় |
| `Junior-Gemini` | `BusinessEntrepreneurLab.tsx`, `KidsArtFunZone.tsx`, `TeacherStudentHub.tsx`, `ProjectorClassroom.tsx`, `VideoQuizStudio.tsx`, `StudySuite.tsx` | feature inventory; প্রথম release-এ core learner journey প্রমাণের আগে সব creator/business tools আনবেন না |

### Exact duplicate evidence

- চারটির `vite.config.ts` SHA-256 prefix `c7b7cc4b3a6b6a08`—সব snapshot-এ একই।
- চারটির `tsconfig.json` SHA-256 prefix `e93e15c3794e43a1`—একই।
- চারটির `.env.example` SHA-256 prefix `b6d12c728de0aac8`—একই placeholder config।
- `GEMINIJUNIOR99` এবং `Remixgemini`: `server.ts` SHA-256 prefix `23662471af17f12d`, `OfflineHub.tsx` `24ab0b73f8e8dfb1`, `LearningProgress.tsx` `975ccfab24940d1e`, `public/sw.js` `d706ce5830650969`—একই content।
- `GEMINI-JUNIOR` ও `Junior-Gemini`-এর `package.json` একই hash prefix `6689bd41fd4b8679`; `GEMINIJUNIOR99` ও `Remixgemini`-এর `package.json` একই prefix `f92b4b53451c63ad`। সবগুলোর package name `react-example`, যা release identity হিসেবে বদলানো উচিত।

এই hash-গুলো একই snapshot content প্রমাণ করে; এগুলো source code সঠিক, secure বা runtime-এ কাজ করে—তা প্রমাণ করে না।

## 3. নিরাপত্তা ও রিলিজ-ঝুঁকি: evidence → সিদ্ধান্ত

| Evidence | ঝুঁকি | করণীয় |
|---|---|---|
| `source-repos/GEMINIJUNIOR99/src/App.tsx`-এ `junior_gemini_student_user` localStorage key; `LearningProgress.tsx`-এ progress localStorage-এ লেখা | shared device-এ ব্যক্তিগত/ভুল/পুরোনো state; localStorage authentication নয় | Supabase Auth session ও RLS; localStorage-এ শুধু non-sensitive UI preference রাখুন |
| চারটি server snapshot-এ `express.json({ limit: "20mb" })` আছে | প্রয়োজনের চেয়ে বড় request payload resource abuse-এর ঝুঁকি বাড়ায় | নতুন server endpoint না বাড়িয়ে AI request Supabase Edge Function-এ রাখুন; input size cap, auth, quota, origin allowlist ব্যবহার করুন |
| `GEMINI-JUNIOR/src/components/EduFeePaymentGateway.tsx` payment UI ও receipt state | UI receipt real payment settlement প্রমাণ করে না | payment integration আলাদা scope; provider webhook/server-side verification/reconciliation ছাড়া payment feature disabled রাখুন |
| `GEMINIJUNIOR99/src/lib/swRegister.ts` এবং `public/sw.js` আছে | stale content, cache invalidation ও shared-device privacy risk অডিট হয়নি | প্রথম pilot-এ PWA cache rollout স্থগিত; পরে public static content-ই cache করুন, auth/private API response নয় |
| `GEMINIJUNIOR99/src/models/aiEngine.ts` `/api/open-source-chat`-এ fallback করে | fallback endpoint/provider availability, cost, data handling ও model licence প্রমাণিত নয় | একটিমাত্র server-side provider adapter দিয়ে শুরু; timeout, quota, error handling ও privacy notice যোগ করুন |
| source `server.ts`-এ `GEMINI_API_KEY` server environment থেকে নেওয়া হয় | key browser bundle/log/repo-তে চলে গেলে quota/billing abuse হতে পারে | browser-এ key নয়; Supabase Edge Function project secret-এ runtime key; secret কখনো log/response নয় |
| সব source `package.json`-এ `react-example`, version `0.0.0`; snapshots-এ npm lockfile নেই (bun.lock আছে) | dependency resolution/build reproducibility অনিশ্চিত | এক canonical package; এক package manager বেছে lockfile commit; CI install/build/typecheck/secret scan |

## 4. Canonical merge plan

1. `apps/web`-এ নতুন Bangla-first responsive dashboard UI/UX ভিত্তি।
2. `GEMINIJUNIOR99`/`Remixgemini` থেকে প্রয়োজনীয় learning-progress/offline ideas; legacy localStorage data model কপি নয়।
3. `Junior-Gemini` থেকে subject tools/quiz/projector/teacher features—ব্যবহারকারী গবেষণা ও priority অনুযায়ী পরে।
4. `GEMINI-JUNIOR` payment/auth UI সরাসরি production-এ নয়; proper provider/auth workflow তৈরি হলে পুনর্নির্মাণ।
5. backend data access শুধু Supabase Auth + RLS; AI শুধু authenticated Edge Function দিয়ে; browser key শুধুমাত্র Supabase publishable key।
6. প্রথম vertical slice: public course catalogue → lesson detail → authenticated progress/bookmark → bounded AI tutor. Offline, payments, teacher/admin console পরে।

## 5. Test status (honest status)

- Source archive extraction/inventory and SHA-256 comparison: **DONE**.
- Static risky-pattern search: **DONE**, limited to searched patterns, not a formal SAST scan.
- New ZIP integrity: **must be checked in final packaging step**.
- `npm install` timed out on a repeat attempt; `npm run typecheck` cannot pass because npm dependencies (React, Vite, Supabase JS) are not installed, so the emitted diagnostics are dependency/type-environment failures rather than a completed source validation. `npm run build`, SQL migration, Edge Function runtime, RLS adversarial tests: **UNVERIFIED**. Do not deploy until these checks pass in CI/local environment.
- Live Supabase/Vercel/Netlify/Gmail/Google API checks: **NOT RUN**; no credentials used and no remote changes made.

## 6. Release gate

Do not deploy until: lockfile generated, install/build/typecheck pass, migration tested against local Supabase, RLS tests cover anonymous/user A/user B/teacher/admin, Edge Function auth/quota/origin/error tests pass, dependency and secret scans pass, student-data retention/privacy policy approved, backup/restore rehearsed, and a preview URL is manually reviewed on Android low-bandwidth/mobile and keyboard navigation.
