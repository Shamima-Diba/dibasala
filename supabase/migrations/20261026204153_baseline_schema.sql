--
-- PostgreSQL database dump
--

\restrict CBvvST6ggEGKdRofIxRHXGZaO3SqlfpbUZZrSGW1NIsUTjbwbV6HOBEAMDNFA7m

-- Dumped from database version 17.11
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA private;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: award_xp(uuid, text, uuid, integer); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.award_xp(p_user_id uuid, p_source_type text, p_source_id uuid, p_amount integer) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_event uuid;
begin
  insert into public.xp_events (user_id, source_type, source_id, amount)
  values (p_user_id, p_source_type, p_source_id, p_amount)
  on conflict (user_id, source_type, source_id) do nothing
  returning id into v_event;
  if v_event is null then
    return 0;
  end if;
  perform private.record_activity(p_user_id, p_amount);
  return p_amount;
end;
$$;


--
-- Name: evaluate_badges(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.evaluate_badges(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  s public.user_stats%rowtype;
  v_lessons integer;
  v_quiz_passes integer;
begin
  select * into s from public.user_stats where user_id = p_user_id;
  select count(*) into v_lessons from public.lesson_progress where user_id = p_user_id and completed_at is not null;
  select count(*) into v_quiz_passes from public.xp_events where user_id = p_user_id and source_type = 'quiz_passed';
  insert into public.user_badges (user_id, badge_code)
  select p_user_id, t.code
  from (values
    ('first_lesson', v_lessons >= 1),
    ('lessons_10', v_lessons >= 10),
    ('first_quiz_pass', v_quiz_passes >= 1),
    ('streak_3', coalesce(s.longest_streak, 0) >= 3),
    ('streak_7', coalesce(s.longest_streak, 0) >= 7),
    ('xp_500', coalesce(s.xp, 0) >= 500)
  ) as t(code, earned)
  where t.earned
  on conflict do nothing;
end;
$$;


--
-- Name: has_role(text); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.has_role(required_role text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = (select auth.uid()) and p.role = required_role
  );
$$;


--
-- Name: on_lesson_progress_change(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.on_lesson_progress_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_completed boolean;
  v_touch boolean;
begin
  if tg_op = 'INSERT' then
    v_completed := new.completed_at is not null;
    v_touch := true;
  else
    v_completed := new.completed_at is not null and old.completed_at is null;
    v_touch := v_completed or new.seconds_spent > old.seconds_spent;
  end if;
  if v_touch then
    perform private.record_activity(new.user_id, 0);
  end if;
  if v_completed then
    perform private.award_xp(new.user_id, 'lesson_completed', new.lesson_id, 10);
  end if;
  return new;
end;
$$;


--
-- Name: owns_course(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.owns_course(p_course_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.courses c
    where c.id = p_course_id
      and c.created_by = (select auth.uid())
      and (private.has_role('teacher') or private.has_role('admin'))
  );
$$;


--
-- Name: owns_question(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.owns_question(p_question_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.quiz_questions qq
    join public.quizzes z on z.id = qq.quiz_id
    where qq.id = p_question_id and private.owns_course(z.course_id)
  );
$$;


--
-- Name: record_activity(uuid, integer); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.record_activity(p_user_id uuid, p_xp integer DEFAULT 0) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  today date := (now() at time zone 'Asia/Dhaka')::date;
  v_stats public.user_stats%rowtype;
  v_streak integer;
begin
  select * into v_stats from public.user_stats where user_id = p_user_id;
  if not found then
    v_streak := 1;
  elsif v_stats.last_activity_date = today then
    v_streak := greatest(v_stats.current_streak, 1);
  elsif v_stats.last_activity_date = today - 1 then
    v_streak := v_stats.current_streak + 1;
  else
    v_streak := 1;
  end if;
  insert into public.user_stats as us (user_id, xp, current_streak, longest_streak, last_activity_date)
  values (p_user_id, greatest(p_xp, 0), v_streak, v_streak, today)
  on conflict (user_id) do update set
    xp = us.xp + greatest(p_xp, 0),
    current_streak = v_streak,
    longest_streak = greatest(us.longest_streak, v_streak),
    last_activity_date = today,
    updated_at = now();
  perform private.evaluate_badges(p_user_id);
end;
$$;


--
-- Name: submit_quiz_attempt(uuid, jsonb); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_uid uuid := (select auth.uid());
  v_pass smallint;
  v_total integer;
  v_missing integer;
  v_correct integer;
  v_score integer;
  v_passed boolean;
  v_results jsonb;
  v_attempt uuid;
  v_xp integer := 0;
  v_recent integer;
begin
  if v_uid is null then
    raise exception 'Sign in required' using errcode = '28000';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' or length(p_answers::text) > 20000 then
    raise exception 'answers must be a JSON object of question_id -> option_id' using errcode = '22023';
  end if;

  select q.pass_percent into v_pass from public.quizzes q
  where q.id = p_quiz_id and q.status = 'published'
    and exists (select 1 from public.courses c where c.id = q.course_id and c.status = 'published');
  if not found then
    raise exception 'Quiz not available' using errcode = 'P0002';
  end if;

  select count(*) into v_recent from public.quiz_attempts
  where user_id = v_uid and quiz_id = p_quiz_id and created_at > now() - interval '1 day';
  if v_recent >= 20 then
    raise exception 'Too many attempts today' using errcode = 'P0001';
  end if;

  select count(*),
         count(*) filter (where k.question_id is null),
         count(*) filter (where k.question_id is not null and (p_answers ->> qq.id::text) = k.correct_option_id),
         jsonb_agg(jsonb_build_object(
           'question_id', qq.id,
           'chosen_option_id', p_answers ->> qq.id::text,
           'correct', coalesce((p_answers ->> qq.id::text) = k.correct_option_id, false),
           'correct_option_id', k.correct_option_id,
           'explanation_bn', k.explanation_bn
         ) order by qq.sort_order, qq.id)
  into v_total, v_missing, v_correct, v_results
  from public.quiz_questions qq
  left join public.quiz_question_keys k on k.question_id = qq.id
  where qq.quiz_id = p_quiz_id;

  if v_total = 0 or v_missing > 0 then
    raise exception 'Quiz is not ready' using errcode = 'P0002';
  end if;

  v_score := round(100.0 * v_correct / v_total);
  v_passed := v_score >= v_pass;

  insert into public.quiz_attempts (user_id, quiz_id, correct_count, total_count, score_percent, passed, answers)
  values (v_uid, p_quiz_id, v_correct, v_total, v_score, v_passed, p_answers)
  returning id into v_attempt;

  perform private.record_activity(v_uid, 0);
  if v_passed then
    v_xp := private.award_xp(v_uid, 'quiz_passed', p_quiz_id, 30);
  end if;

  return jsonb_build_object(
    'attempt_id', v_attempt,
    'score_percent', v_score,
    'correct_count', v_correct,
    'total_count', v_total,
    'passed', v_passed,
    'pass_percent', v_pass,
    'xp_awarded', v_xp,
    'results', v_results
  );
end;
$$;


--
-- Name: validate_quiz_key(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_quiz_key() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not exists (
    select 1 from public.quiz_questions q, jsonb_array_elements(q.options) o
    where q.id = new.question_id and o ->> 'id' = new.correct_option_id
  ) then
    raise exception 'correct_option_id must match one of the question options' using errcode = '22023';
  end if;
  return new;
end;
$$;


--
-- Name: validate_quiz_question(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_quiz_question() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if exists (
    select 1 from jsonb_array_elements(new.options) o
    where jsonb_typeof(o) <> 'object' or coalesce(o ->> 'id', '') = '' or coalesce(o ->> 'text_bn', '') = ''
  ) then
    raise exception 'each option needs a non-empty id and text_bn' using errcode = '22023';
  end if;
  if (select count(distinct o ->> 'id') from jsonb_array_elements(new.options) o) <> jsonb_array_length(new.options) then
    raise exception 'option ids must be unique' using errcode = '22023';
  end if;
  return new;
end;
$$;


--
-- Name: append_ai_exchange(uuid, uuid, uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.append_ai_exchange(p_user_id uuid, p_conversation_id uuid, p_lesson_id uuid, p_question text, p_answer text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_conv uuid := p_conversation_id;
begin
  if p_user_id is null then
    raise exception 'p_user_id required' using errcode = '22004';
  end if;
  if v_conv is null then
    insert into public.ai_conversations (user_id, lesson_id, title)
    values (p_user_id, p_lesson_id, left(btrim(p_question), 80))
    returning id into v_conv;
  else
    update public.ai_conversations set updated_at = now() where id = v_conv and user_id = p_user_id;
    if not found then
      raise exception 'conversation not found' using errcode = 'P0002';
    end if;
    if (select count(*) from public.ai_messages where conversation_id = v_conv) >= 400 then
      raise exception 'conversation is full' using errcode = 'P0001';
    end if;
  end if;
  insert into public.ai_messages (conversation_id, role, content)
  values (v_conv, 'user', left(p_question, 8000)), (v_conv, 'assistant', left(p_answer, 8000));
  return v_conv;
end;
$$;


--
-- Name: consume_ai_quota(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.consume_ai_quota(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  utc_today date := (now() at time zone 'UTC')::date;
  v_limit int := 100;
  v_new_count int;
begin
  if p_user_id is null then
    raise exception 'p_user_id required' using errcode = '22004';
  end if;
  insert into public.ai_usage_daily (user_id, usage_date, request_count)
  values (p_user_id, utc_today, 1)
  on conflict (user_id, usage_date) do update
    set request_count = public.ai_usage_daily.request_count + 1
    where public.ai_usage_daily.request_count < v_limit
  returning request_count into v_new_count;
  if not found then
    raise exception 'AI quota exceeded: % per day', v_limit using errcode = 'P0001';
  end if;
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
  tbl name;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        SELECT c.relname INTO tbl FROM pg_catalog.pg_class c WHERE c.oid = cmd.objid;
        EXECUTE format('alter table if exists %I.%I enable row level security', cmd.schema_name, tbl);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


--
-- Name: search_catalog(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_catalog(p_query text, p_limit integer DEFAULT 20) RETURNS TABLE(kind text, id uuid, course_id uuid, title_bn text, title_en text)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with q as (
    select '%' || replace(replace(replace(btrim(p_query), '\', '\\'), '%', '\%'), '_', '\_') || '%' as pat,
           char_length(btrim(p_query)) >= 2 as ok
  )
  (select 'course'::text, c.id, c.id, c.title_bn, c.title_en
     from public.courses c, q
    where q.ok and (c.title_bn ilike q.pat or c.title_en ilike q.pat or c.subject ilike q.pat or c.description ilike q.pat))
  union all
  (select 'lesson'::text, l.id, l.course_id, l.title_bn, l.title_en
     from public.lessons l, q
    where q.ok and (l.title_bn ilike q.pat or l.title_en ilike q.pat))
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
begin
  new.updated_at := now();
  return new;
end;
$$;


--
-- Name: submit_quiz_attempt(uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb) RETURNS jsonb
    LANGUAGE sql
    SET search_path TO ''
    AS $$
  select private.submit_quiz_attempt(p_quiz_id, p_answers);
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid,
    title text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ai_conversations_title_check CHECK ((char_length(title) <= 200))
);


--
-- Name: ai_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ai_messages_content_check CHECK (((char_length(content) >= 1) AND (char_length(content) <= 8000))),
    CONSTRAINT ai_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


--
-- Name: ai_usage_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage_daily (
    user_id uuid NOT NULL,
    usage_date date DEFAULT (timezone('utc'::text, now()))::date NOT NULL,
    request_count integer DEFAULT 0 NOT NULL,
    CONSTRAINT ai_usage_daily_request_count_check CHECK (((request_count >= 0) AND (request_count <= 100)))
);


--
-- Name: badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badges (
    code text NOT NULL,
    name_bn text NOT NULL,
    name_en text NOT NULL,
    description_bn text DEFAULT ''::text NOT NULL,
    description_en text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    CONSTRAINT badges_code_check CHECK ((code ~ '^[a-z0-9_]+$'::text))
);


--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title_bn text NOT NULL,
    title_en text,
    subject text NOT NULL,
    grade_level smallint NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT courses_grade_level_check CHECK (((grade_level >= 1) AND (grade_level <= 12))),
    CONSTRAINT courses_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lesson_notes_body_check CHECK (((char_length(body) >= 1) AND (char_length(body) <= 5000)))
);


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_progress (
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    completed_at timestamp with time zone,
    seconds_spent integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lesson_progress_seconds_spent_check CHECK (((seconds_spent >= 0) AND (seconds_spent <= 86400)))
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    slug text NOT NULL,
    title_bn text NOT NULL,
    title_en text,
    body_markdown text DEFAULT ''::text NOT NULL,
    video_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lessons_sort_order_check CHECK ((sort_order >= 0)),
    CONSTRAINT lessons_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: my_course_progress; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.my_course_progress WITH (security_invoker='true') AS
 SELECT e.course_id,
    c.slug,
    c.title_bn,
    c.title_en,
    e.enrolled_at,
    count(l.id) AS total_lessons,
    count(lp.completed_at) AS completed_lessons,
        CASE
            WHEN (count(l.id) = 0) THEN 0
            ELSE (round(((100.0 * (count(lp.completed_at))::numeric) / (count(l.id))::numeric)))::integer
        END AS percent_complete,
    max(lp.updated_at) AS last_activity_at
   FROM (((public.enrollments e
     JOIN public.courses c ON ((c.id = e.course_id)))
     LEFT JOIN public.lessons l ON (((l.course_id = e.course_id) AND (l.status = 'published'::text))))
     LEFT JOIN public.lesson_progress lp ON (((lp.lesson_id = l.id) AND (lp.user_id = e.user_id))))
  WHERE (e.user_id = ( SELECT auth.uid() AS uid))
  GROUP BY e.course_id, c.slug, c.title_bn, c.title_en, e.enrolled_at;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    user_id uuid NOT NULL,
    display_name text DEFAULT ''::text NOT NULL,
    role text DEFAULT 'learner'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avatar_url text,
    grade_level smallint,
    preferred_language text DEFAULT 'bn'::text NOT NULL,
    daily_goal_minutes smallint DEFAULT 15 NOT NULL,
    CONSTRAINT profiles_avatar_url_check CHECK (((avatar_url IS NULL) OR ((avatar_url ~ '^https://'::text) AND (char_length(avatar_url) <= 500)))),
    CONSTRAINT profiles_daily_goal_minutes_check CHECK (((daily_goal_minutes >= 5) AND (daily_goal_minutes <= 240))),
    CONSTRAINT profiles_grade_level_check CHECK (((grade_level IS NULL) OR ((grade_level >= 1) AND (grade_level <= 12)))),
    CONSTRAINT profiles_preferred_language_check CHECK ((preferred_language = ANY (ARRAY['bn'::text, 'en'::text]))),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['learner'::text, 'teacher'::text, 'admin'::text])))
);


--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quiz_id uuid NOT NULL,
    correct_count integer NOT NULL,
    total_count integer NOT NULL,
    score_percent smallint NOT NULL,
    passed boolean NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT quiz_attempts_correct_count_check CHECK ((correct_count >= 0)),
    CONSTRAINT quiz_attempts_score_percent_check CHECK (((score_percent >= 0) AND (score_percent <= 100))),
    CONSTRAINT quiz_attempts_total_count_check CHECK ((total_count > 0))
);


--
-- Name: quiz_question_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_question_keys (
    question_id uuid NOT NULL,
    correct_option_id text NOT NULL,
    explanation_bn text DEFAULT ''::text NOT NULL
);


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quiz_id uuid NOT NULL,
    prompt_bn text NOT NULL,
    prompt_en text,
    options jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT quiz_questions_options_check CHECK (((jsonb_typeof(options) = 'array'::text) AND ((jsonb_array_length(options) >= 2) AND (jsonb_array_length(options) <= 6)))),
    CONSTRAINT quiz_questions_sort_order_check CHECK ((sort_order >= 0))
);


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    lesson_id uuid,
    title_bn text NOT NULL,
    title_en text,
    pass_percent smallint DEFAULT 60 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT quizzes_pass_percent_check CHECK (((pass_percent >= 1) AND (pass_percent <= 100))),
    CONSTRAINT quizzes_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    user_id uuid NOT NULL,
    badge_code text NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_stats (
    user_id uuid NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    level integer GENERATED ALWAYS AS (((floor(sqrt(((xp)::numeric / 50.0))))::integer + 1)) STORED,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_activity_date date,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_stats_current_streak_check CHECK ((current_streak >= 0)),
    CONSTRAINT user_stats_longest_streak_check CHECK ((longest_streak >= 0)),
    CONSTRAINT user_stats_xp_check CHECK ((xp >= 0))
);


--
-- Name: xp_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xp_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    amount integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT xp_events_amount_check CHECK (((amount >= 1) AND (amount <= 500))),
    CONSTRAINT xp_events_source_type_check CHECK ((source_type = ANY (ARRAY['lesson_completed'::text, 'quiz_passed'::text])))
);


--
-- Name: ai_conversations ai_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_pkey PRIMARY KEY (id);


--
-- Name: ai_messages ai_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_pkey PRIMARY KEY (id);


--
-- Name: ai_usage_daily ai_usage_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_daily
    ADD CONSTRAINT ai_usage_daily_pkey PRIMARY KEY (user_id, usage_date);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (code);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (user_id, course_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (user_id, course_id);


--
-- Name: lesson_notes lesson_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (user_id, lesson_id);


--
-- Name: lessons lessons_course_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_slug_key UNIQUE (course_id, slug);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_question_keys quiz_question_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_question_keys
    ADD CONSTRAINT quiz_question_keys_pkey PRIMARY KEY (question_id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (user_id, badge_code);


--
-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (user_id);


--
-- Name: xp_events xp_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_events
    ADD CONSTRAINT xp_events_pkey PRIMARY KEY (id);


--
-- Name: xp_events xp_events_user_id_source_type_source_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_events
    ADD CONSTRAINT xp_events_user_id_source_type_source_id_key UNIQUE (user_id, source_type, source_id);


--
-- Name: ai_conversations_lesson_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_conversations_lesson_id_idx ON public.ai_conversations USING btree (lesson_id);


--
-- Name: ai_conversations_user_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_conversations_user_updated_idx ON public.ai_conversations USING btree (user_id, updated_at DESC);


--
-- Name: ai_messages_conversation_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_messages_conversation_created_idx ON public.ai_messages USING btree (conversation_id, created_at);


--
-- Name: bookmarks_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookmarks_course_id_idx ON public.bookmarks USING btree (course_id);


--
-- Name: courses_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX courses_created_by_idx ON public.courses USING btree (created_by);


--
-- Name: courses_published_grade_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX courses_published_grade_idx ON public.courses USING btree (status, grade_level, subject);


--
-- Name: enrollments_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX enrollments_course_id_idx ON public.enrollments USING btree (course_id);


--
-- Name: lesson_notes_lesson_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_notes_lesson_id_idx ON public.lesson_notes USING btree (lesson_id);


--
-- Name: lesson_notes_user_lesson_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_notes_user_lesson_idx ON public.lesson_notes USING btree (user_id, lesson_id);


--
-- Name: lesson_progress_lesson_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_progress_lesson_id_idx ON public.lesson_progress USING btree (lesson_id);


--
-- Name: lessons_course_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lessons_course_order_idx ON public.lessons USING btree (course_id, sort_order);


--
-- Name: progress_user_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_user_updated_idx ON public.lesson_progress USING btree (user_id, updated_at DESC);


--
-- Name: quiz_attempts_quiz_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quiz_attempts_quiz_id_idx ON public.quiz_attempts USING btree (quiz_id);


--
-- Name: quiz_attempts_user_quiz_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quiz_attempts_user_quiz_idx ON public.quiz_attempts USING btree (user_id, quiz_id, created_at DESC);


--
-- Name: quiz_questions_quiz_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quiz_questions_quiz_order_idx ON public.quiz_questions USING btree (quiz_id, sort_order);


--
-- Name: quizzes_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quizzes_course_id_idx ON public.quizzes USING btree (course_id);


--
-- Name: quizzes_lesson_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quizzes_lesson_id_idx ON public.quizzes USING btree (lesson_id);


--
-- Name: user_badges_badge_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_badges_badge_code_idx ON public.user_badges USING btree (badge_code);


--
-- Name: courses courses_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER courses_set_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: lesson_notes lesson_notes_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER lesson_notes_set_updated_at BEFORE UPDATE ON public.lesson_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: lesson_progress lesson_progress_gamification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER lesson_progress_gamification AFTER INSERT OR UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION private.on_lesson_progress_change();


--
-- Name: lesson_progress lesson_progress_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER lesson_progress_set_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: lessons lessons_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER lessons_set_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: profiles profiles_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: quiz_question_keys quiz_question_keys_validate; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER quiz_question_keys_validate BEFORE INSERT OR UPDATE ON public.quiz_question_keys FOR EACH ROW EXECUTE FUNCTION private.validate_quiz_key();


--
-- Name: quiz_questions quiz_questions_validate; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER quiz_questions_validate BEFORE INSERT OR UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION private.validate_quiz_question();


--
-- Name: quizzes quizzes_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER quizzes_set_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: ai_conversations ai_conversations_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL;


--
-- Name: ai_conversations ai_conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_conversations
    ADD CONSTRAINT ai_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ai_messages ai_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.ai_conversations(id) ON DELETE CASCADE;


--
-- Name: ai_usage_daily ai_usage_daily_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_daily
    ADD CONSTRAINT ai_usage_daily_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: lesson_notes lesson_notes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_notes lesson_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_question_keys quiz_question_keys_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_question_keys
    ADD CONSTRAINT quiz_question_keys_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL;


--
-- Name: user_badges user_badges_badge_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_code_fkey FOREIGN KEY (badge_code) REFERENCES public.badges(code) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_stats user_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: xp_events xp_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_events
    ADD CONSTRAINT xp_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ai_conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_usage_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_usage_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: badges badge catalogue is public; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "badge catalogue is public" ON public.badges FOR SELECT TO authenticated, anon USING (true);


--
-- Name: badges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

--
-- Name: bookmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: lessons course owners delete lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners delete lessons" ON public.lessons FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))))));


--
-- Name: quiz_questions course owners delete questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners delete questions" ON public.quiz_questions FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.quizzes z
  WHERE ((z.id = quiz_questions.quiz_id) AND private.owns_course(z.course_id)))));


--
-- Name: quizzes course owners delete quizzes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners delete quizzes" ON public.quizzes FOR DELETE TO authenticated USING (private.owns_course(course_id));


--
-- Name: lessons course owners insert lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners insert lessons" ON public.lessons FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))))));


--
-- Name: quiz_questions course owners insert questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners insert questions" ON public.quiz_questions FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.quizzes z
  WHERE ((z.id = quiz_questions.quiz_id) AND private.owns_course(z.course_id)))));


--
-- Name: quizzes course owners insert quizzes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners insert quizzes" ON public.quizzes FOR INSERT TO authenticated WITH CHECK (private.owns_course(course_id));


--
-- Name: lessons course owners update lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners update lessons" ON public.lessons FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))))));


--
-- Name: quiz_questions course owners update questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners update questions" ON public.quiz_questions FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.quizzes z
  WHERE ((z.id = quiz_questions.quiz_id) AND private.owns_course(z.course_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.quizzes z
  WHERE ((z.id = quiz_questions.quiz_id) AND private.owns_course(z.course_id)))));


--
-- Name: quizzes course owners update quizzes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "course owners update quizzes" ON public.quizzes FOR UPDATE TO authenticated USING (private.owns_course(course_id)) WITH CHECK (private.owns_course(course_id));


--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: bookmarks learners create own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners create own bookmarks" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: bookmarks learners delete own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners delete own bookmarks" ON public.bookmarks FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: ai_conversations learners delete own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners delete own conversations" ON public.ai_conversations FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_notes learners delete own notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners delete own notes" ON public.lesson_notes FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_progress learners delete own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners delete own progress" ON public.lesson_progress FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_notes learners edit own notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners edit own notes" ON public.lesson_notes FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: enrollments learners enroll in published courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners enroll in published courses" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = enrollments.course_id) AND (c.status = 'published'::text))))));


--
-- Name: enrollments learners leave courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners leave courses" ON public.enrollments FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: quiz_attempts learners read own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: user_badges learners read own badges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own badges" ON public.user_badges FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: bookmarks learners read own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: ai_conversations learners read own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own conversations" ON public.ai_conversations FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: enrollments learners read own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own enrollments" ON public.enrollments FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: ai_messages learners read own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own messages" ON public.ai_messages FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.ai_conversations c
  WHERE ((c.id = ai_messages.conversation_id) AND (c.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: lesson_notes learners read own notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own notes" ON public.lesson_notes FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_progress learners read own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own progress" ON public.lesson_progress FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: user_stats learners read own stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own stats" ON public.user_stats FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: xp_events learners read own xp events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners read own xp events" ON public.xp_events FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_progress learners update own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners update own progress" ON public.lesson_progress FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_notes learners write own notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners write own notes" ON public.lesson_notes FOR INSERT TO authenticated WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.lessons l
  WHERE (l.id = lesson_notes.lesson_id)))));


--
-- Name: lesson_progress learners write own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "learners write own progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: lesson_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_question_keys owners delete answer keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners delete answer keys" ON public.quiz_question_keys FOR DELETE TO authenticated USING (private.owns_question(question_id));


--
-- Name: quiz_question_keys owners insert answer keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners insert answer keys" ON public.quiz_question_keys FOR INSERT TO authenticated WITH CHECK (private.owns_question(question_id));


--
-- Name: quiz_question_keys owners read answer keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners read answer keys" ON public.quiz_question_keys FOR SELECT TO authenticated USING (private.owns_question(question_id));


--
-- Name: quiz_question_keys owners update answer keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "owners update answer keys" ON public.quiz_question_keys FOR UPDATE TO authenticated USING (private.owns_question(question_id)) WITH CHECK (private.owns_question(question_id));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: courses published courses readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "published courses readable" ON public.courses FOR SELECT TO authenticated, anon USING (((status = 'published'::text) OR (created_by = ( SELECT auth.uid() AS uid)) OR private.has_role('admin'::text)));


--
-- Name: lessons published lessons readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "published lessons readable" ON public.lessons FOR SELECT TO authenticated, anon USING ((((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.status = 'published'::text))))) OR (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = lessons.course_id) AND (c.created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))))) OR private.has_role('admin'::text)));


--
-- Name: quizzes published quizzes readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "published quizzes readable" ON public.quizzes FOR SELECT TO authenticated, anon USING ((((status = 'published'::text) AND (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = quizzes.course_id) AND (c.status = 'published'::text))))) OR private.owns_course(course_id) OR private.has_role('admin'::text)));


--
-- Name: quiz_questions questions follow quiz visibility; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "questions follow quiz visibility" ON public.quiz_questions FOR SELECT TO authenticated, anon USING ((EXISTS ( SELECT 1
   FROM public.quizzes z
  WHERE (z.id = quiz_questions.quiz_id))));


--
-- Name: quiz_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_question_keys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_question_keys ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: quizzes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

--
-- Name: courses teachers create own courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "teachers create own courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))));


--
-- Name: courses teachers update own courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "teachers update own courses" ON public.courses FOR UPDATE TO authenticated USING (((created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text)))) WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND (private.has_role('teacher'::text) OR private.has_role('admin'::text))));


--
-- Name: user_badges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

--
-- Name: user_stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles users read own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: profiles users update own display name; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own display name" ON public.profiles FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: xp_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict CBvvST6ggEGKdRofIxRHXGZaO3SqlfpbUZZrSGW1NIsUTjbwbV6HOBEAMDNFA7m

