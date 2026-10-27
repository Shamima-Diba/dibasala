-- Admin-managed, redeemable Premium/Pro access codes.
create table if not exists public.premium_access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  plan_slug text not null default 'premium_monthly' check (plan_slug in ('premium_monthly','premium_annual')),
  access_days integer not null default 30 check (access_days between 1 and 3660),
  max_redemptions integer not null default 1 check (max_redemptions between 1 and 100000),
  redeemed_count integer not null default 0 check (redeemed_count >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  created_by text
);
alter table public.premium_access_codes enable row level security;
revoke all on public.premium_access_codes from anon, authenticated;
grant select, insert, update, delete on public.premium_access_codes to service_role;

create table if not exists public.premium_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.premium_access_codes(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id),
  redeemed_at timestamptz not null default now(),
  unique(code_id, user_id)
);
alter table public.premium_code_redemptions enable row level security;
revoke all on public.premium_code_redemptions from anon, authenticated;
grant select, insert on public.premium_code_redemptions to service_role;

create or replace function public.redeem_premium_access_code(p_code text, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code public.premium_access_codes%rowtype;
  v_plan_id uuid;
  v_subscription_id uuid;
  v_end timestamptz;
begin
  if p_user_id is null or nullif(trim(p_code), '') is null then
    raise exception 'Enter a valid access code';
  end if;

  select * into v_code
  from public.premium_access_codes
  where upper(code) = upper(trim(p_code))
  for update;

  if not found or not v_code.active then raise exception 'Access code is invalid or inactive'; end if;
  if v_code.expires_at is not null and v_code.expires_at <= now() then raise exception 'Access code has expired'; end if;
  if v_code.redeemed_count >= v_code.max_redemptions then raise exception 'Access code redemption limit reached'; end if;
  if exists (select 1 from public.premium_code_redemptions where code_id = v_code.id and user_id = p_user_id) then
    raise exception 'This account has already used this code';
  end if;

  update public.subscriptions set status = 'expired'
    where user_id = p_user_id and status in ('active','past_due') and current_period_end <= now();
  if exists (select 1 from public.subscriptions where user_id = p_user_id and status in ('active','past_due') and current_period_end > now()) then
    raise exception 'Premium is already active for this account';
  end if;

  select id into v_plan_id from public.subscription_plans where slug = v_code.plan_slug and active = true limit 1;
  if v_plan_id is null then raise exception 'Premium plan is not configured'; end if;

  v_end := now() + make_interval(days => v_code.access_days);
  insert into public.subscriptions(user_id, plan_id, status, gateway, current_period_start, current_period_end)
    values (p_user_id, v_plan_id, 'active', 'access_code', now(), v_end)
    returning id into v_subscription_id;

  insert into public.premium_code_redemptions(code_id, user_id, subscription_id)
    values (v_code.id, p_user_id, v_subscription_id);
  update public.premium_access_codes set redeemed_count = redeemed_count + 1 where id = v_code.id;

  return jsonb_build_object('ok', true, 'status', 'active', 'current_period_end', v_end, 'access_days', v_code.access_days);
end;
$$;

revoke all on function public.redeem_premium_access_code(text, uuid) from public, anon, authenticated;
grant execute on function public.redeem_premium_access_code(text, uuid) to service_role;
