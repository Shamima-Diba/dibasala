-- Run AFTER applying 202610250002, as one script in the SQL Editor.
-- Creates its own fixtures as postgres, then switches to simulated roles.
-- Expected denials are caught per check. Ends with an explicit ROLLBACK: nothing is saved.
-- Every row in the result must have pass = true.

begin;

create temp table rls_report (seq serial, pass boolean, check_name text) on commit drop;

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  pub_course uuid;
  draft_course uuid;
  pub_lesson uuid;
  draft_lesson uuid;
  n int;
  results text[] := '{}';
  passes boolean[] := '{}';
begin
  -- Fixtures (as postgres, before any role switch)
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at) values
    (a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-a-' || a || '@example.invalid', '{}', now(), now()),
    (b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-b-' || b || '@example.invalid', '{}', now(), now());

  select count(*) into n from public.profiles where user_id in (a, b);
  passes := passes || (n = 2); results := results || 'signup trigger created both profiles'::text;

  update public.profiles set role = 'teacher' where user_id = a;
  insert into public.courses (slug, title_bn, subject, grade_level, status, created_by)
    values ('rls-pub-' || a, 'T', 'math', 5, 'published', a) returning id into pub_course;
  insert into public.courses (slug, title_bn, subject, grade_level, status, created_by)
    values ('rls-draft-' || a, 'T', 'math', 5, 'draft', a) returning id into draft_course;
  insert into public.lessons (course_id, slug, title_bn, status)
    values (pub_course, 'pub', 'L', 'published') returning id into pub_lesson;
  insert into public.lessons (course_id, slug, title_bn, status)
    values (pub_course, 'draft', 'L', 'draft') returning id into draft_lesson;
  insert into public.lesson_progress (user_id, lesson_id) values (a, pub_lesson), (b, pub_lesson);
  insert into public.bookmarks (user_id, course_id) values (a, pub_course), (b, pub_course);
  insert into public.ai_usage_daily (user_id) values (a);

  -- User A: teacher who owns both courses
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);

  select count(*) into n from public.profiles;
  passes := passes || (n = 1); results := results || 'A sees exactly 1 profile'::text;
  select count(*) into n from public.profiles where user_id = b;
  passes := passes || (n = 0); results := results || 'A cannot see B profile'::text;
  select count(*) into n from public.lesson_progress where user_id = b;
  passes := passes || (n = 0); results := results || 'A cannot see B progress'::text;
  select count(*) into n from public.bookmarks where user_id = b;
  passes := passes || (n = 0); results := results || 'A cannot see B bookmarks'::text;
  select count(*) into n from public.lesson_progress where user_id = a;
  passes := passes || (n = 1); results := results || 'A sees own progress'::text;
  select count(*) into n from public.lessons where id = draft_lesson;
  passes := passes || (n = 1); results := results || 'teacher owner sees own draft lesson'::text;

  update public.profiles set display_name = 'x' where user_id = b;
  get diagnostics n = row_count;
  passes := passes || (n = 0); results := results || 'A cannot edit B profile'::text;

  update public.profiles set display_name = 'ok' where user_id = a;
  get diagnostics n = row_count;
  passes := passes || (n = 1); results := results || 'A can edit own display_name'::text;

  delete from public.bookmarks where user_id = b;
  get diagnostics n = row_count;
  passes := passes || (n = 0); results := results || 'A cannot delete B bookmark'::text;

  begin
    update public.profiles set role = 'admin' where user_id = a;
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'A cannot change own role'::text;

  begin
    perform count(*) from public.ai_usage_daily;
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'ai_usage_daily not readable by client'::text;

  perform set_config('role', 'postgres', true);

  -- A demoted to learner: loses lesson authoring and draft-lesson access
  update public.profiles set role = 'learner' where user_id = a;
  perform set_config('role', 'authenticated', true);

  select count(*) into n from public.lessons where id = draft_lesson;
  passes := passes || (n = 0); results := results || 'demoted owner loses draft lesson'::text;

  begin
    insert into public.lessons (course_id, slug, title_bn) values (pub_course, 'x', 'x');
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'learner cannot add lesson'::text;

  perform set_config('role', 'postgres', true);

  -- User B: learner
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);

  select count(*) into n from public.courses where id = draft_course;
  passes := passes || (n = 0); results := results || 'B cannot see A draft course'::text;
  select count(*) into n from public.lessons where id = draft_lesson;
  passes := passes || (n = 0); results := results || 'B cannot see draft lesson'::text;
  select count(*) into n from public.lessons where id = pub_lesson;
  passes := passes || (n = 1); results := results || 'B sees published lesson'::text;
  select count(*) into n from public.lesson_progress where user_id = a;
  passes := passes || (n = 0); results := results || 'B cannot see A progress'::text;

  begin
    insert into public.courses (slug, title_bn, subject, grade_level, created_by)
      values ('x' || b, 'x', 'x', 1, b);
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'learner cannot create course'::text;

  perform set_config('role', 'postgres', true);

  -- Anonymous
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('role', 'anon', true);

  select count(*) into n from public.courses where id = pub_course;
  passes := passes || (n = 1); results := results || 'anon sees published course'::text;
  select count(*) into n from public.courses where id = draft_course;
  passes := passes || (n = 0); results := results || 'anon cannot see draft course'::text;
  select count(*) into n from public.lessons where id = pub_lesson;
  passes := passes || (n = 1); results := results || 'anon sees published lesson'::text;

  begin
    perform count(*) from public.profiles;
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'anon cannot read profiles'::text;

  begin
    perform public.has_role('admin');
    passes := passes || false;
  exception when insufficient_privilege then
    passes := passes || true;
  end;
  results := results || 'anon cannot execute has_role'::text;

  perform set_config('role', 'postgres', true);

  for i in 1 .. array_length(results, 1) loop
    insert into rls_report (pass, check_name) values (passes[i], results[i]);
  end loop;

exception when others then
  -- Any unexpected error: the block's fixtures are undone, the error is reported as a failure.
  perform set_config('role', 'postgres', true);
  insert into rls_report (pass, check_name)
    values (false, 'UNEXPECTED ERROR: ' || sqlstate || ' ' || sqlerrm);
end;
$$;

select pass, check_name from rls_report order by seq;

rollback;
