create extension if not exists pgcrypto;

create table if not exists public.subscription_plans (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug in ('premium_monthly','premium_annual')),
 name text not null,
 billing_interval text not null check (billing_interval in ('month','year')),
 amount_bdt numeric(10,2) not null check (amount_bdt >= 10 and amount_bdt <= 500000),
 currency text not null default 'BDT' check (currency='BDT'),
 features jsonb not null default '[]'::jsonb,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
insert into public.subscription_plans(slug,name,billing_interval,amount_bdt,features) values
('premium_monthly','DIBASALA Premium Monthly','month',299.00,'["Premium course access","Expanded AI Tutor allowance","Learning progress analytics","Priority learning plan"]'::jsonb),
('premium_annual','DIBASALA Premium Annual','year',2990.00,'["Premium course access","Expanded AI Tutor allowance","Learning progress analytics","Priority learning plan","Two months equivalent savings"]'::jsonb)
on conflict(slug) do update set name=excluded.name,billing_interval=excluded.billing_interval,amount_bdt=excluded.amount_bdt,features=excluded.features,active=true;

create table if not exists public.subscriptions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 plan_id uuid not null references public.subscription_plans(id),
 status text not null default 'pending' check(status in ('pending','active','past_due','cancelled','expired','refunded')),
 current_period_start timestamptz,
 current_period_end timestamptz,
 cancel_at_period_end boolean not null default false,
 gateway text not null default 'sslcommerz' check(gateway='sslcommerz'),
 gateway_customer_ref text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists subscriptions_one_current_per_user on public.subscriptions(user_id) where status in ('pending','active','past_due');
create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id,status);
create index if not exists subscriptions_period_end_idx on public.subscriptions(current_period_end);

create table if not exists public.payment_orders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 plan_id uuid not null references public.subscription_plans(id),
 subscription_id uuid references public.subscriptions(id) on delete set null,
 gateway text not null default 'sslcommerz' check(gateway='sslcommerz'),
 tran_id text not null unique,
 sessionkey text,
 validation_id text,
 amount_bdt numeric(10,2) not null check(amount_bdt >= 10 and amount_bdt <= 500000),
 currency text not null default 'BDT' check(currency='BDT'),
 status text not null default 'pending' check(status in ('pending','paid','failed','cancelled','expired','review')),
 gateway_status text,
 bank_tran_id text,
 paid_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists payment_orders_user_created_idx on public.payment_orders(user_id,created_at desc);
create index if not exists payment_orders_status_created_idx on public.payment_orders(status,created_at);

alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_orders enable row level security;
drop policy if exists "Active subscription plans are readable" on public.subscription_plans;
create policy "Active subscription plans are readable" on public.subscription_plans for select to anon,authenticated using(active=true);
drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions" on public.subscriptions for select to authenticated using(auth.uid()=user_id);
drop policy if exists "Users can read own payment orders" on public.payment_orders;
create policy "Users can read own payment orders" on public.payment_orders for select to authenticated using(auth.uid()=user_id);
revoke all on public.subscriptions from anon,authenticated;
revoke all on public.payment_orders from anon,authenticated;
grant select on public.subscriptions,public.payment_orders to authenticated;
revoke all on public.subscription_plans from anon,authenticated;
grant select on public.subscription_plans to anon,authenticated;

create or replace function public.has_active_premium(p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.subscriptions s where s.user_id=p_user_id and s.status='active' and s.current_period_start<=now() and s.current_period_end>now())
$$;
revoke all on function public.has_active_premium(uuid) from public,anon;
grant execute on function public.has_active_premium(uuid) to authenticated;

create or replace function public.touch_subscription_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end;
$$;
drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at before update on public.subscriptions for each row execute function public.touch_subscription_updated_at();
drop trigger if exists payment_orders_touch_updated_at on public.payment_orders;
create trigger payment_orders_touch_updated_at before update on public.payment_orders for each row execute function public.touch_subscription_updated_at();
comment on table public.payment_orders is 'SSLCOMMERZ order ledger. Client writes blocked; only trusted server-side handlers mutate orders.';
comment on table public.subscriptions is 'Premium entitlements. Client writes blocked; only trusted server-side handlers mutate subscriptions.';
