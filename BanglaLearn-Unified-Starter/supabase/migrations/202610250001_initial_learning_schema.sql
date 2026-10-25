-- BanglaLearn initial learning schema (starter, review before production)
-- Roles are intentionally NOT user-editable. Promote teachers/admins only through a trusted admin workflow.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'learner' check (role in ('learner', 'teacher', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_bn text not null,
  title_en text,
  subject text not null,
  grade_level smallint not null check (grade_level between 1 and 12),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title_bn text not null,
  title_en text,
  body_markdown text not null default '',
  video_url text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  seconds_spent integer not null default 0 check (seconds_spent between 0 and 86400),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

-- Private accounting table; clients have no direct policies or grants.
create table if not exists public.ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default (timezone('utc', now()))::date,
  request_count integer not null default 0 check (request_count between 0 and 10),
  primary key (user_id, usage_date)
);

create index if not exists lessons_course_order_idx on public.lessons (course_id, sort_order);
create index if not exists courses_published_grade_idx on public.courses (status, grade_level, subject);
create index if not exists progress_user_updated_idx on public.lesson_progress (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    'learner'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Definer helper avoids leaking profile rows through role checks. Users cannot set their own role.
create or replace function public.has_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = required_role
  );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.ai_usage_daily enable row level security;

create policy "users read own profile" on public.profiles
for select to authenticated using (user_id = (select auth.uid()));
create policy "users update own display name" on public.profiles
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Public catalogue only exposes published material. Course owners and admins may see drafts.
create policy "published courses readable" on public.courses
for select to anon, authenticated
using (status = 'published' or created_by = (select auth.uid()) or public.has_role('admin'));
create policy "teachers create own courses" on public.courses
for insert to authenticated
with check (created_by = (select auth.uid()) and (public.has_role('teacher') or public.has_role('admin')));
create policy "teachers update own courses" on public.courses
for update to authenticated
using (created_by = (select auth.uid()) and (public.has_role('teacher') or public.has_role('admin')))
with check (created_by = (select auth.uid()) and (public.has_role('teacher') or public.has_role('admin')));

create policy "published lessons readable" on public.lessons
for select to anon, authenticated
using (
  (status = 'published' and exists (
    select 1 from public.courses c where c.id = lessons.course_id and c.status = 'published'
  ))
  or exists (
    select 1 from public.courses c where c.id = lessons.course_id
      and c.created_by = (select auth.uid())
      and (public.has_role('teacher') or public.has_role('admin'))
  )
  or public.has_role('admin')
);
create policy "course owners manage lessons" on public.lessons
for all to authenticated
using (exists (
  select 1 from public.courses c where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and (public.has_role('teacher') or public.has_role('admin'))
))
with check (exists (
  select 1 from public.courses c where c.id = lessons.course_id
    and c.created_by = (select auth.uid())
    and (public.has_role('teacher') or public.has_role('admin'))
));

create policy "learners read own progress" on public.lesson_progress
for select to authenticated using (user_id = (select auth.uid()));
create policy "learners write own progress" on public.lesson_progress
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "learners update own progress" on public.lesson_progress
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy "learners delete own progress" on public.lesson_progress
for delete to authenticated using (user_id = (select auth.uid()));

create policy "learners read own bookmarks" on public.bookmarks
for select to authenticated using (user_id = (select auth.uid()));
create policy "learners create own bookmarks" on public.bookmarks
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "learners delete own bookmarks" on public.bookmarks
for delete to authenticated using (user_id = (select auth.uid()));

-- Explicit grants: profile role is not updateable from client. No client grants for AI usage table.
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select on public.courses, public.lessons to anon, authenticated;
grant insert, update on public.courses to authenticated;
grant insert, update, delete on public.lessons to authenticated;
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select, insert, delete on public.bookmarks to authenticated;
revoke all on public.ai_usage_daily from anon, authenticated;

-- Called by the authenticated AI Edge Function. Hard limit is fixed server-side (10 requests/user/day).
create or replace function public.consume_ai_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_day date := (timezone('utc', now()))::date;
  updated_count integer;
begin
  if current_user_id is null then
    return false;
  end if;

  insert into public.ai_usage_daily (user_id, usage_date, request_count)
  values (current_user_id, current_day, 1)
  on conflict (user_id, usage_date)
  do update set request_count = public.ai_usage_daily.request_count + 1
  where public.ai_usage_daily.request_count < 10
  returning request_count into updated_count;

  return updated_count is not null;
end;
$$;

revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
revoke all on function public.has_role(text) from public, anon;
grant execute on function public.has_role(text) to anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
