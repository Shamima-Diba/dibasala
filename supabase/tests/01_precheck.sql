-- Read-only. Run before applying 202610250002. Every "ok" column must be true.

select
  p.proname,
  p.prosecdef                                   as security_definer,
  p.proconfig                                   as settings,
  (p.prosecdef and p.proconfig = array['search_path=""']) as ok
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('handle_new_user', 'consume_ai_quota', 'has_role')
union all
select
  'on_auth_user_created -> handle_new_user',
  null,
  null,
  exists (
    select 1
    from pg_trigger t
    join pg_proc f on f.oid = t.tgfoid
    join pg_namespace fn on fn.oid = f.pronamespace
    where t.tgrelid = 'auth.users'::regclass
      and not t.tgisinternal
      and t.tgname = 'on_auth_user_created'
      and t.tgenabled = 'O'
      and fn.nspname = 'public'
      and f.proname = 'handle_new_user'
  )
union all
select 'current_user is postgres', null, null, current_user = 'postgres'
order by 1;
