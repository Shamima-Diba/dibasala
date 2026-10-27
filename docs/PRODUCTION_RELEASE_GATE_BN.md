# DIBASALA production release gate (বাংলা)

এই checklist live release-এর আগে চালাতে হবে। Secret value GitHub issue, chat, log বা frontend environment-এ প্রকাশ করবেন না।

## 1. Vercel frontend configuration

Vercel → Project → Settings → Environment Variables-এ production environment-এর জন্য যাচাই করুন:

- `VITE_SUPABASE_URL` = Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = Supabase publishable key

Environment variable পরিবর্তন করলে নতুন deployment তৈরি হয়েছে কি না দেখুন। Vite-এর `VITE_*` values browser bundle-এ প্রকাশিত হয়; এখানে কখনও Gemini API key, Supabase secret/service-role key বা অন্য server secret রাখবেন না।

## 2. Supabase Edge Function secrets

Supabase Dashboard → Edge Functions → `ai-tutor` → Secrets (বা project secrets) এ নিশ্চিত করুন:

- `GEMINI_API_KEY` — server-side Gemini key
- `GEMINI_MODEL` — সক্রিয় Gemini model ID
- `ALLOWED_ORIGINS` — comma-separated exact origins, যেমন `https://your-production-domain.example`

`ALLOWED_ORIGINS`-এ scheme, hostname এবং প্রয়োজন হলে port ঠিক মেলাতে হবে। Production domain এবং ব্যবহৃত preview domain আলাদা হলে শুধু প্রয়োজনীয় origins যোগ করুন। Wildcard (`*`) ব্যবহার করে CORS সমস্যাকে আড়াল করবেন না। Function code allowlist-এর বাইরে origin-কে ইচ্ছাকৃতভাবে reject করে; browser preflight-এ 403 পাওয়া গেলে প্রথমে এই allowlist পরীক্ষা করুন।

## 3. Smoke check

Repository root থেকে চালান:

```bash
SUPABASE_URL='https://YOUR_PROJECT_REF.supabase.co' \
SITE_ORIGIN='https://your-production-domain.example' \
SITE_URL='https://your-production-domain.example' \
bash scripts/check-production.sh
```

Script frontend HTTP 200 এবং AI Tutor CORS preflight-এর 204 + exact `Access-Control-Allow-Origin` পরীক্ষা করে। Publishable key বা user token প্রয়োজন নেই, এবং script কোনো secret print করে না।

## 4. Manual end-to-end release test

একটি test account দিয়ে, বাস্তব learner account নয়:

1. Sign-up করুন; email confirmation চালু থাকলে confirmation link অনুসরণ করুন।
2. Sign-in করুন; refresh-এর পর session বজায় থাকে কি না যাচাই করুন।
3. AI Tutor-এ একটি ছোট প্রশ্ন পাঠান; প্রত্যাশিত ফল HTTP 200 ও উত্তর।
4. Sign-out করুন; signed-out অবস্থায় AI Tutor-এ প্রবেশ প্রত্যাখ্যাত হয় কি না যাচাই করুন।
5. দুইটি test account দিয়ে bookmark/progress/checklist একে অপরের কাছে দৃশ্যমান নয় নিশ্চিত করুন।
6. নতুন deployment-এর commit SHA, CI status, Vercel deployment status ও Supabase function logs নথিবদ্ধ করুন।

## 5. বর্তমান release blockers

- Supabase `ai-tutor`-এর OPTIONS request-এ 403 দেখা গেলে origin allowlist / deployed secret যাচাই করা প্রয়োজন।
- Course catalog, progress, bookmarks এবং checklist-এর UI এখনো demo/localStorage-নির্ভর; সম্পূর্ণ learner-specific server persistence যাচাই না হওয়া পর্যন্ত এই অংশগুলো production LMS feature হিসেবে ঘোষণা করবেন না।
- Security Advisor finding পর্যালোচনা করুন। `ai_usage_daily`-তে direct table access বন্ধ থাকা ইচ্ছাকৃত হতে পারে; `consume_ai_quota()` authenticated caller-এর `auth.uid()` দিয়ে quota প্রয়োগ করে, তবু direct RPC invocation-এর abuse/operational risk ও grants পরীক্ষা করুন।
- এই smoke script একা authentication, email delivery, AI provider secrets, database policies বা full LMS behaviour certify করে না।
