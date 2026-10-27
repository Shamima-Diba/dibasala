-- DIBASALA learner persistence and starter course catalog.
-- Additive migration: safe for existing production rows.

create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id),
  constraint course_progress_completion_consistent check (
    (progress_percent = 100 and completed_at is not null)
    or (progress_percent < 100 and completed_at is null)
  )
);

alter table public.course_progress enable row level security;
drop policy if exists "learners read own course progress" on public.course_progress;
create policy "learners read own course progress"
  on public.course_progress for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "learners insert own course progress" on public.course_progress;
create policy "learners insert own course progress"
  on public.course_progress for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
  );
drop policy if exists "learners update own course progress" on public.course_progress;
create policy "learners update own course progress"
  on public.course_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
  );
drop policy if exists "learners delete own course progress" on public.course_progress;
create policy "learners delete own course progress"
  on public.course_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.course_progress to authenticated;

create table if not exists public.learner_checklist (
  user_id uuid not null references auth.users(id) on delete cascade,
  task_key text not null check (char_length(task_key) between 1 and 80),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, task_key)
);

alter table public.learner_checklist enable row level security;
drop policy if exists "learners read own checklist" on public.learner_checklist;
create policy "learners read own checklist"
  on public.learner_checklist for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "learners insert own checklist" on public.learner_checklist;
create policy "learners insert own checklist"
  on public.learner_checklist for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "learners update own checklist" on public.learner_checklist;
create policy "learners update own checklist"
  on public.learner_checklist for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "learners delete own checklist" on public.learner_checklist;
create policy "learners delete own checklist"
  on public.learner_checklist for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.learner_checklist to authenticated;

-- Publish starter content that the frontend can now load from the database.
insert into public.courses (slug, title_bn, title_en, subject, grade_level, description, status)
values
  ('algebra-foundations', 'গণিত: বীজগণিতের ভিত্তি', 'Mathematics: Algebra Foundations', 'গণিত', 9, 'চলক, বীজগাণিতিক রাশি ও সমীকরণের প্রাথমিক ধারণা।', 'published'),
  ('force-and-motion', 'পদার্থবিজ্ঞান: বল ও গতি', 'Physics: Force and Motion', 'বিজ্ঞান', 9, 'বল, গতি ও দৈনন্দিন জীবনের সহজ পদার্থবিজ্ঞান।', 'published'),
  ('english-grammar-essentials', 'ইংরেজি Grammar Essentials', 'English Grammar Essentials', 'ইংরেজি', 9, 'Parts of speech এবং বাক্য গঠনের প্রাথমিক অনুশীলন।', 'published'),
  ('bangladesh-world-identity', 'বাংলাদেশ ও বিশ্বপরিচয়', 'Bangladesh and Global Studies', 'সমাজবিজ্ঞান', 9, 'বাংলাদেশ, নাগরিক পরিচয় এবং সমাজ সম্পর্কে পরিচিতি।', 'published')
on conflict (slug) do nothing;

insert into public.lessons (course_id, slug, title_bn, title_en, body_markdown, sort_order, status)
select c.id, seed.slug, seed.title_bn, seed.title_en, seed.body_markdown, 1, 'published'
from (values
  ('algebra-foundations', 'variables-and-expressions', 'চলক ও বীজগাণিতিক রাশি', 'Variables and expressions',
   '## চলক ও রাশি\n\nচলক হলো এমন একটি প্রতীক যার মান পরিবর্তিত হতে পারে। যেমন, **x + 3** একটি বীজগাণিতিক রাশি।\n\n- যদি x = 2 হয়, তবে x + 3 = 5।\n- যদি x = 7 হয়, তবে x + 3 = 10।\n\n**অনুশীলন:** x = 4 হলে 2x + 1-এর মান কত?'),
  ('force-and-motion', 'force-basics', 'বল কী?', 'What is force?',
   '## বলের ধারণা\n\nবল কোনো বস্তুর গতি, গতির দিক বা আকৃতি পরিবর্তন করতে পারে। বলের SI একক নিউটন (N)।\n\nউদাহরণ: ফুটবলে লাথি দিলে বলের গতি পরিবর্তিত হয়।\n\n**মনে রাখবে:** বলের মান ও দিক—দুটিই গুরুত্বপূর্ণ।'),
  ('english-grammar-essentials', 'parts-of-speech', 'Parts of Speech', 'Parts of Speech',
   '## Parts of Speech\n\nWords are grouped by their job in a sentence. Common groups include noun, pronoun, verb, adjective, adverb, preposition, conjunction, and interjection.\n\n**Example:** “The quick learner reads carefully.” Here, *learner* is a noun, *reads* is a verb, and *quick* is an adjective.'),
  ('bangladesh-world-identity', 'citizenship-basics', 'নাগরিকত্বের প্রাথমিক ধারণা', 'Citizenship basics',
   '## নাগরিকত্ব\n\nনাগরিকত্ব একটি রাষ্ট্রের সঙ্গে ব্যক্তির আইনগত সম্পর্ক। নাগরিকের অধিকার যেমন আছে, তেমনি আইন মানা ও সমাজের প্রতি দায়িত্ব পালনের মতো কর্তব্যও রয়েছে।\n\n**ভাবো:** বিদ্যালয় ও স্থানীয় সমাজে দায়িত্বশীল আচরণের দুটি উদাহরণ লেখো।')
) as seed(course_slug, slug, title_bn, title_en, body_markdown)
join public.courses c on c.slug = seed.course_slug
on conflict (course_id, slug) do nothing;
