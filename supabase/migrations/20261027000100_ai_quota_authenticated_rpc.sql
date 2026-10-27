-- Scope AI quota accounting to the authenticated JWT, never a caller-supplied user ID.
-- This overload matches the Edge Function's no-argument RPC and enforces a 10/day limit.
create or replace function public.consume_ai_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_utc_today date := (now() at time zone 'UTC')::date;
  v_new_count integer;
  v_limit constant integer := 10;
begin
  if v_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  insert into public.ai_usage_daily (user_id, usage_date, request_count)
  values (v_user_id, v_utc_today, 1)
  on conflict (user_id, usage_date) do update
    set request_count = public.ai_usage_daily.request_count + 1
    where public.ai_usage_daily.request_count < v_limit
  returning request_count into v_new_count;

  if not found then
    return false;
  end if;

  return true;
end;
$function$;

revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
