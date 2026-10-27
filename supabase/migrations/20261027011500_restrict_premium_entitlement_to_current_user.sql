create or replace function public.has_active_premium(p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path='' as $$
 select case when auth.uid() is null or (p_user_id is not null and p_user_id <> auth.uid()) then false
 else exists(select 1 from public.subscriptions s where s.user_id=auth.uid() and s.status='active' and s.current_period_start<=now() and s.current_period_end>now())
 end
$$;
revoke all on function public.has_active_premium(uuid) from public,anon;
grant execute on function public.has_active_premium(uuid) to authenticated;
