# DIBASALA Rollback Plan

Do not deploy until CI passes and the migration history is reconciled. Record the previous frontend deployment and Edge Function version before rollout.

## Database rollback (only if regression is confirmed)

```sql
DROP INDEX IF EXISTS public.idx_course_progress_course_id;
DROP INDEX IF EXISTS public.idx_payment_orders_plan_id;
DROP INDEX IF EXISTS public.idx_payment_orders_subscription_id;
DROP INDEX IF EXISTS public.idx_premium_code_redemptions_subscription_id;
DROP INDEX IF EXISTS public.idx_premium_code_redemptions_user_id;
DROP INDEX IF EXISTS public.idx_subscriptions_plan_id;
DROP POLICY IF EXISTS premium_access_codes_service_role_all ON public.premium_access_codes;
DROP POLICY IF EXISTS premium_code_attempts_service_role_all ON public.premium_code_attempts;
DROP POLICY IF EXISTS premium_code_attempts_select_own ON public.premium_code_attempts;
DROP POLICY IF EXISTS premium_code_redemptions_service_role_all ON public.premium_code_redemptions;
DROP POLICY IF EXISTS premium_code_redemptions_select_own ON public.premium_code_redemptions;
```

Do not disable RLS or drop tables/data as a rollback shortcut. If a rollback is required, review client/server dependencies first. Revert frontend to the prior known-good Vercel deployment and redeploy the previously saved Edge Function version if needed.

Leaked-password protection is not changed by these migrations and must be handled independently in Supabase Auth settings.
