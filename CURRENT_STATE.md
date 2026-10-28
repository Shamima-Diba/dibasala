# DIBASALA Current State — pre-deployment inspection

Inspection date: 2026-10-28.

- Repository: `Shamima-Diba/dibasala`, default branch `main`.
- Supabase project ref: `ruamhcchaeogodsltskw`.
- Live `profiles` primary key is `user_id`; `display_name` exists.
- Live `courses` uses `status` and includes `slug`, `title_bn`, `title_en`, `subject`, and `grade_level`.
- Supabase Advisor reported six missing FK indexes: `course_progress(course_id)`, `payment_orders(plan_id)`, `payment_orders(subscription_id)`, `premium_code_redemptions(subscription_id)`, `premium_code_redemptions(user_id)`, and `subscriptions(plan_id)`.
- Advisor reported no policies on `premium_access_codes`, `premium_code_attempts`, and `premium_code_redemptions`.
- Advisor reported leaked-password protection disabled. That is an Auth configuration setting, not a SQL migration.
- Live `ai-tutor` was active with JWT verification enabled at inspection time.

This is a pre-change snapshot; it does not claim build or deployment success.
