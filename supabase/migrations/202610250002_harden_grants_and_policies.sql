-- Hardening pass based on the 2026-10-25 Supabase audit.
-- Supabase's default privileges grant ALL on new public tables to anon/authenticated,
-- which silently widened the narrow grants in the initial migration. Reset them explicitly.

begin;

-- 1. Least-privilege table grants -------------------------------------------------
revoke all on public.profiles, public.courses, public.lessons,
  public.lesson_progress, public.bookmarks, public.ai_usage_daily
  from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select on public.courses, public.lessons to anon, authenticated;
grant insert, update on public.courses to authenticated;
grant insert, update, delete on public.lessons to authenticated;

grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select, insert, delete on public.bookmarks to authenticated;

-- 2. Function execute grants ------------------------------------------------------
revoke all on function public.has_role(text) from public, anon;
grant execute on function public.has_role(text) to authenticated;

revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;

do $$
begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

-- 2b. Default privileges only affect objects created later, so existing grants are
-- reset above. Stop future tables/functions created by postgres from auto-granting.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon;

-- 3. Split policies per role so anon never evaluates has_role() --------------------
-- Drops make this file safe to re-run (e.g. pasted into the SQL editor, then db push).
drop policy if exists "anon reads published courses" on public.courses;
drop policy if exists "authenticated reads visible courses" on public.courses;
drop policy if exists "anon reads published lessons" on public.lessons;
drop policy if exists "authenticated reads visible lessons" on public.lessons;
drop policy if exists "course owners insert lessons" on public.lessons;
drop policy if exists "course owners update lessons" on public.lessons;
drop policy if exists "course owners delete lessons" on public.lessons;
drop policy if exists "published courses readable" on public.courses;
create policy "anon reads published courses" on public.courses
for select to anon
using (status = 'published');
create policy "authenticated reads visible courses" on public.courses
for select to authenticated
using (
  status = 'published'
  or created_by = (select auth.uid())
  or (select public.has_role('admin'))
);

drop policy if exists "published lessons readable" on public.lessons;
drop policy if exists "course owners manage lessons" on public.lessons;

create policy "anon reads published lessons" on public.lessons
for select to anon
using (
  status = 'published' and exists (
    select 1 from public.courses c
    where c.id = lessons.course_id and c.status = 'published'
  )
);
create policy "authenticated reads visible lessons" on public.lessons
for select to authenticated
using (
  (status = 'published' and exists (
    select 1 from public.courses c
    where c.id = lessons.course_id and c.status = 'published'
  ))
  or exists (
    select 1 from public.courses c
    where c.id = lessons.course_id and c.created_by = (select auth.uid())
  )
  or (select public.has_role('admin'))
);
create policy "course owners insert lessons" on public.lessons
for insert to authenticated
with check (exists (
  select 1 from public.courses c
  where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and ((select public.has_role('teacher')) or (select public.has_role('admin')))
));
create policy "course owners update lessons" on public.lessons
for update to authenticated
using (exists (
  select 1 from public.courses c
  where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and ((select public.has_role('teacher')) or (select public.has_role('admin')))
))
with check (exists (
  select 1 from public.courses c
  where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and ((select public.has_role('teacher')) or (select public.has_role('admin')))
));
create policy "course owners delete lessons" on public.lessons
for delete to authenticated
using (exists (
  select 1 from public.courses c
  where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and ((select public.has_role('teacher')) or (select public.has_role('admin')))
));

-- 4. Foreign-key indexes ----------------------------------------------------------
create index if not exists bookmarks_course_id_idx on public.bookmarks (course_id);
create index if not exists courses_created_by_idx on public.courses (created_by);
create index if not exists lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);

commit;
