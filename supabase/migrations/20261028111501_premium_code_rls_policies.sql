-- Admin-issued access-code values are server-only; authenticated clients cannot read or mutate them.
-- All redemption writes and attempt tracking remain server-side to prevent forged entitlements.
DROP POLICY IF EXISTS premium_access_codes_service_role_all ON public.premium_access_codes;
CREATE POLICY premium_access_codes_service_role_all ON public.premium_access_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS premium_code_attempts_service_role_all ON public.premium_code_attempts;
CREATE POLICY premium_code_attempts_service_role_all ON public.premium_code_attempts FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS premium_code_attempts_select_own ON public.premium_code_attempts;
CREATE POLICY premium_code_attempts_select_own ON public.premium_code_attempts FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
DROP POLICY IF EXISTS premium_code_redemptions_service_role_all ON public.premium_code_redemptions;
CREATE POLICY premium_code_redemptions_service_role_all ON public.premium_code_redemptions FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS premium_code_redemptions_select_own ON public.premium_code_redemptions;
CREATE POLICY premium_code_redemptions_select_own ON public.premium_code_redemptions FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
