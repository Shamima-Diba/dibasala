# Architecture ও Secret Policy (BanglaLearn)

## প্রস্তাবিত topology

- **Frontend:** `apps/web` — React + TypeScript + Vite; Vercel বা Netlify static hosting। প্রথম পর্যায়ে যেকোনো একটিকে বেছে নিন; একইসঙ্গে দুটিতে deploy করার প্রয়োজন নেই।
- **Identity/data/storage:** Supabase Auth + PostgreSQL + RLS; প্রয়োজন হলে Supabase Storage-এ public learning assets।
- **AI:** browser → authenticated Supabase Edge Function `ai-tutor` → Gemini API. Gemini key কখনো browser bundle-এ যায় না।
- **Gmail:** Gmail account-কে Gemini API key-এর সমতুল্য ভাববেন না। Gemini API এবং Gmail API পৃথক service/permission/billing path। Gmail দরকার হলে use case নির্দিষ্ট করে OAuth consent + minimum scopes + refresh-token handling আলাদা করে design করুন।

## কোন secret কোথায় থাকবে?

| Secret/credential | সঠিক জায়গা | কোথায় রাখা যাবে না |
|---|---|---|
| `VITE_SUPABASE_URL` | frontend build env; public endpoint | — |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | frontend build env; browser-visible key | RLS ছাড়া নিরাপদ ধরে নেওয়া যাবে না |
| `GEMINI_API_KEY` | Supabase Edge Function project secrets; local dev-এ ignored `supabase/functions/.env` | Git, ZIP, browser `VITE_*`, localStorage, client logs |
| Supabase secret/service-role key | শুধুমাত্র trusted server/Edge Function admin code যেখানে অপরিহার্য | browser, public repo, user metadata |
| Gmail OAuth client secret/refresh token | Gmail integration server/Edge Function secret store; DB-side-only workflow হলে tightly restricted Vault | browser, `profiles`, logs, source files |
| DB trigger/SQL-side integration secret | Supabase Vault, decrypted view/function access কড়া সীমাবদ্ধ করে | public SQL function বা broadly granted view |

Supabase Edge Functions runtime secrets environment variable থেকে পড়ে; Vault encrypted database secret এবং SQL-side access-এর জন্য। Edge Function-এর জন্য সরাসরি project secret ব্যবহার করাই এই starter-এর default। Vault-এ রাখার অনুরোধ থাকলেই runtime secret retrieval-এর জন্য অপ্রয়োজনীয় RPC bridge বানাবেন না—সেটি decrypted secret ফেরত দেওয়ার নতুন attack surface তৈরি করবে।

## Google/Gmail সংক্রান্ত সতর্কতা

- ব্যক্তিগত Gmail account ব্যবহার করলেই API usage unlimited/free হয় না। Gemini API key, supported model, quota, billing, region/terms আলাদাভাবে Google AI Studio/Google Cloud-এ যাচাই করতে হবে।
- Gemini key-কে Gemini API-তেই সীমাবদ্ধ রাখুন, usage/billing alerts দিন, rate-limit server-side রাখুন।
- Gmail API ব্যবহার কেবল তখনই যুক্ত করুন যখন নির্দিষ্ট ফিচার আছে (যেমন teacher notification বা support email); Gmail mailbox-এর পূর্ণ access চেয়ে বসবেন না। Scope কম রাখুন এবং token rotation/revocation procedure লিখুন।
- কোনো credential এই ZIP-এ যোগ করবেন না। প্রয়োজন হলে আপনি নিজে provider dashboard-এ সেট করবেন; secret chat-এ পাঠাবেন না।

## Supabase data/security model

`supabase/migrations/202610250001_initial_learning_schema.sql` একটি starter schema: profiles, courses, lessons, lesson progress, bookmarks, daily AI quota। `profiles.role` client-updateable নয়; user নিজে teacher/admin হতে পারবে না। Published course/lesson public read, learner progress/bookmarks user-scoped, AI quota RPC server-side 10 request/user/day সীমা প্রয়োগ করে।

এই SQL **পরীক্ষিত production migration নয়**। Local Supabase-এ apply করে policy tests, function privilege tests, concurrency/quota tests, trigger tests এবং rollback/backup strategy যাচাই করতে হবে। Existing live project-এ এই migration চালাবেন না যতক্ষণ না schema diff ও migration approval সম্পন্ন হয়।
