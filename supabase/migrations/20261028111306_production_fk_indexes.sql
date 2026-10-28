-- Matches the six missing covering indexes reported by the live Supabase Advisor.
-- Standard CREATE INDEX is used because migrations run transactionally; CONCURRENTLY is not allowed in a transaction.
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON public.course_progress (course_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_plan_id ON public.payment_orders (plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_subscription_id ON public.payment_orders (subscription_id);
CREATE INDEX IF NOT EXISTS idx_premium_code_redemptions_subscription_id ON public.premium_code_redemptions (subscription_id);
CREATE INDEX IF NOT EXISTS idx_premium_code_redemptions_user_id ON public.premium_code_redemptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions (plan_id);
