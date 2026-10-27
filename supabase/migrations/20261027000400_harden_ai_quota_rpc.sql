-- Harden quota RPC: the authenticated caller may only mutate their own daily quota row.
-- SECURITY INVOKER lets table RLS enforce ownership instead of bypassing it.

drop policy if exists "learners read own AI quota" on public.ai_usage_daily;
create policy "learners read own AI quota"
  on public.ai_usage_daily for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "learners insert own AI quota" on public.ai_usage_daily;
create policy "learners insert own AI quota"
  on public.ai_usage_daily for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "learners update own AI quota" on public.ai_usage_daily;
create policy "learners update own AI quota"
  on public.ai_usage_daily for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.ai_usage_daily to authenticated;

alter function public.consume_ai_quota() security invoker;
revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;

-- Legacy overload accepts an arbitrary user_id and has a different 100/day cap.
-- It is not used by the deployed AI Tutor, so make it service-role-only.
revoke all on function public.consume_ai_quota(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_quota(uuid) to service_role;
