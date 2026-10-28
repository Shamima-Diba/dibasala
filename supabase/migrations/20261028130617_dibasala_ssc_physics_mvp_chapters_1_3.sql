-- DIBASALA SSC Physics chapters 1-3, verified live seed: 50 MCQs.
-- Safe to re-run: preserves attempts and unrelated learner data.
ALTER TABLE public.quiz_question_keys ADD COLUMN IF NOT EXISTS teacher_reviewed boolean NOT NULL DEFAULT false;
UPDATE public.courses SET title_bn='SSC পদার্থবিজ্ঞান: ভৌত রাশি, গতি ও বল',title_en='SSC Physics: Physical Quantities, Motion and Force',subject='বিজ্ঞান',grade_level=9,description='SSC পদার্থবিজ্ঞান: অধ্যায় ১ ভৌত রাশি ও পরিমাপ, অধ্যায় ২ গতি, অধ্যায় ৩ বল।',updated_at=now() WHERE slug='force-and-motion';
INSERT INTO public.lessons(course_id,slug,title_bn,title_en,body_markdown,sort_order,status)
SELECT c.id,v.slug,v.title_bn,v.title_en,v.body_markdown,v.sort_order,'published'
FROM public.courses c CROSS JOIN (VALUES
('ssc-physics-chapter-2-motion','অধ্যায় ২: গতি','অধ্যায় ২: গতি','# অধ্যায় ২: গতি

## শিখনফল
- দূরত্ব, সরণ, দ্রুতি, বেগ ও ত্বরণ পার্থক্য করা।
- সমত্বরণে গতির সমীকরণ প্রয়োগ করা।
- বেগ-সময় গ্রাফ ব্যাখ্যা করা।

## মূল আলোচনা
দূরত্ব মোট অতিক্রান্ত পথ; সরণ দিকসহ অবস্থান পরিবর্তন। দ্রুতি স্কেলার, বেগ ভেক্টর। গড় দ্রুতি = মোট দূরত্ব/মোট সময়; গড় বেগ = মোট সরণ/মোট সময়। ত্বরণ = বেগের পরিবর্তন/সময়, SI একক m/s²। সমত্বরণে v=u+at, s=ut+½at², v²=u²+2as। বেগ-সময় গ্রাফের ঢাল ত্বরণ এবং ক্ষেত্রফল সরণ নির্দেশ করে। বৃত্তাকার গতিতে দ্রুতি স্থির থাকলেও দিক বদলায় বলে ত্বরণ থাকতে পারে।',2),
('ssc-physics-chapter-3-force','অধ্যায় ৩: বল','অধ্যায় ৩: বল','# অধ্যায় ৩: বল

## শিখনফল
- নিউটনের তিনটি সূত্র ব্যাখ্যা করা।
- বল, ভর, ত্বরণ, ভরবেগ ও ওজনের হিসাব করা।
- ঘর্ষণ ও ভরবেগ সংরক্ষণ বুঝতে পারা।

## মূল আলোচনা
প্রথম সূত্র জড়তা ব্যাখ্যা করে। দ্বিতীয় সূত্র F=ma; 1 N = 1 kg·m/s²। তৃতীয় সূত্রে প্রত্যেক ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া থাকে; বল দুটি ভিন্ন বস্তুর ওপর কাজ করে। ভরবেগ p=mv; বাহ্যিক লব্ধ বল শূন্য হলে মোট ভরবেগ সংরক্ষিত থাকে। ওজন W=mg, ভর kg-এ ও ওজন N-এ মাপা হয়। ঘর্ষণ আপেক্ষিক গতিকে বাধা দেয়; উপযুক্ত লুব্রিকেন্ট ঘর্ষণ কমাতে পারে।',3),
('ssc-physics-chapter-1-physical-quantities','অধ্যায় ১: ভৌত রাশি ও পরিমাপ','অধ্যায় ১: ভৌত রাশি ও পরিমাপ','# অধ্যায় ১: ভৌত রাশি ও পরিমাপ

## শিখনফল
- মৌলিক ও লব্ধ ভৌত রাশি এবং SI একক চেনা।
- মাত্রিক সংকেত ও পরিমাপের যন্ত্র বুঝতে পারা।
- লঘিষ্ঠ গণনা, উল্লেখযোগ্য অঙ্ক ও ত্রুটি ব্যাখ্যা করা।

## মূল আলোচনা
মৌলিক রাশি: দৈর্ঘ্য (m), ভর (kg), সময় (s), তড়িৎ প্রবাহ (A), তাপগতীয় তাপমাত্রা (K), পদার্থের পরিমাণ (mol), দীপন তীব্রতা (cd)। ক্ষেত্রফল, বেগ, ত্বরণ, বল ও ঘনত্ব লব্ধ রাশি। বেগের মাত্রা [LT⁻¹], ত্বরণের [LT⁻²], বলের [MLT⁻²]। ঘনত্ব = ভর/আয়তন; SI একক kg/m³। স্লাইড ক্যালিপার্স ও স্ক্রু গজ ক্ষুদ্র দৈর্ঘ্য মাপে। লঘিষ্ঠ গণনা যন্ত্রের ক্ষুদ্রতম পরিমাপযোগ্য মান। এককসহ ফল লিখতে হবে; একাধিক পরিমাপের গড় দৈব ত্রুটি কমাতে সাহায্য করে।',1)
) v(slug,title_bn,title_en,body_markdown,sort_order)
WHERE c.slug='force-and-motion'
ON CONFLICT(course_id,slug) DO UPDATE SET title_bn=EXCLUDED.title_bn,title_en=EXCLUDED.title_en,body_markdown=EXCLUDED.body_markdown,sort_order=EXCLUDED.sort_order,status='published',updated_at=now();
INSERT INTO public.quizzes(course_id,lesson_id,title_bn,title_en,pass_percent,status)
SELECT c.id,l.id,v.title_bn,v.title_en,60,'published'
FROM public.courses c CROSS JOIN (VALUES
(1,'SSC পদার্থবিজ্ঞান — ভৌত রাশি ও পরিমাপ','SSC Physics — Chapter 1'),
(2,'SSC পদার্থবিজ্ঞান — গতি','SSC Physics — Chapter 2'),
(3,'SSC পদার্থবিজ্ঞান — বল','SSC Physics — Chapter 3')
) v(chapter_no,title_bn,title_en)
JOIN public.lessons l ON l.course_id=c.id AND l.slug=CASE v.chapter_no WHEN 1 THEN 'ssc-physics-chapter-1-physical-quantities' WHEN 2 THEN 'ssc-physics-chapter-2-motion' ELSE 'ssc-physics-chapter-3-force' END
WHERE c.slug='force-and-motion' AND NOT EXISTS(SELECT 1 FROM public.quizzes q WHERE q.course_id=c.id AND q.title_bn=v.title_bn);
WITH data(chapter_no,prompt_bn,options,correct_option_id,explanation_bn,sort_order) AS (VALUES
(2,'সরণ কী?','[{"id":"A","text_bn":"মোট পথ"},{"id":"B","text_bn":"অবস্থান পরিবর্তন দিকসহ"},{"id":"C","text_bn":"প্রতি সেকেন্ডের পথ"},{"id":"D","text_bn":"চলার সময়"}]'::jsonb,'B','সরণ হলো প্রারম্ভিক থেকে শেষ অবস্থানের দিকসহ পরিবর্তন।',18),
(2,'দ্রুতি কোন ধরনের রাশি?','[{"id":"A","text_bn":"ভেক্টর"},{"id":"B","text_bn":"স্কেলার"},{"id":"C","text_bn":"মৌলিক"},{"id":"D","text_bn":"মাত্রাহীন"}]'::jsonb,'B','দ্রুতির মান আছে, দিক নেই; এটি স্কেলার।',19),
(2,'বেগ কোন ধরনের রাশি?','[{"id":"A","text_bn":"স্কেলার"},{"id":"B","text_bn":"ভেক্টর"},{"id":"C","text_bn":"মাত্রাহীন"},{"id":"D","text_bn":"মৌলিক"}]'::jsonb,'B','বেগের মান ও দিক থাকে; এটি ভেক্টর।',20),
(2,'গড় দ্রুতির সূত্র কোনটি?','[{"id":"A","text_bn":"মোট সরণ/সময়"},{"id":"B","text_bn":"মোট দূরত্ব/সময়"},{"id":"C","text_bn":"সময়/দূরত্ব"},{"id":"D","text_bn":"ত্বরণ×সময়"}]'::jsonb,'B','গড় দ্রুতি = মোট দূরত্ব ÷ মোট সময়।',21),
(2,'বস্তু ১০ সেকেন্ডে ৫০ মিটার যায়। গড় দ্রুতি?','[{"id":"A","text_bn":"২ m/s"},{"id":"B","text_bn":"৫ m/s"},{"id":"C","text_bn":"১০ m/s"},{"id":"D","text_bn":"৫০ m/s"}]'::jsonb,'B','৫০÷১০ = ৫ m/s।',22),
(2,'স্থির অবস্থা থেকে ২ m/s² ত্বরণে ৩ s চললে শেষ বেগ?','[{"id":"A","text_bn":"২ m/s"},{"id":"B","text_bn":"৩ m/s"},{"id":"C","text_bn":"৬ m/s"},{"id":"D","text_bn":"৯ m/s"}]'::jsonb,'C','v = u + at = ০ + ২×৩ = ৬ m/s।',23),
(2,'সমবেগে চলমান বস্তুর ত্বরণ কত?','[{"id":"A","text_bn":"শূন্য"},{"id":"B","text_bn":"ধ্রুবক অশূন্য"},{"id":"C","text_bn":"বেগের সমান"},{"id":"D","text_bn":"সময়ের সমান"}]'::jsonb,'A','বেগ অপরিবর্তিত হলে ত্বরণ শূন্য।',24),
(2,'ত্বরণের SI একক কোনটি?','[{"id":"A","text_bn":"m/s"},{"id":"B","text_bn":"m/s²"},{"id":"C","text_bn":"km/h"},{"id":"D","text_bn":"N"}]'::jsonb,'B','ত্বরণ = বেগের পরিবর্তন/সময়; একক m/s²।',25),
(2,'বেগ-সময় লেখচিত্রের ঢাল কী?','[{"id":"A","text_bn":"সরণ"},{"id":"B","text_bn":"দূরত্ব"},{"id":"C","text_bn":"ত্বরণ"},{"id":"D","text_bn":"ভর"}]'::jsonb,'C','বেগ-সময় গ্রাফের ঢাল ত্বরণ।',26),
(2,'বেগ-সময় গ্রাফের নিচের ক্ষেত্রফল কী নির্দেশ করে?','[{"id":"A","text_bn":"ত্বরণ"},{"id":"B","text_bn":"সরণ"},{"id":"C","text_bn":"বল"},{"id":"D","text_bn":"ভর"}]'::jsonb,'B','বেগ-সময় গ্রাফের বীজগাণিতিক ক্ষেত্রফল সরণ।',27),
(2,'২০ m/s ধ্রুব বেগে ৫ s-এ দূরত্ব কত?','[{"id":"A","text_bn":"৪ m"},{"id":"B","text_bn":"২৫ m"},{"id":"C","text_bn":"১০০ m"},{"id":"D","text_bn":"২০০ m"}]'::jsonb,'C','দূরত্ব = ২০×৫ = ১০০ m।',28),
(2,'সমত্বরণে গতির প্রথম সমীকরণ কোনটি?','[{"id":"A","text_bn":"v=u+at"},{"id":"B","text_bn":"s=vt²"},{"id":"C","text_bn":"F=ma"},{"id":"D","text_bn":"p=mv"}]'::jsonb,'A','সমত্বরণে v = u + at।',29),
(2,'বায়ুর বাধা উপেক্ষায় একই স্থানে মুক্তপতনের ত্বরণ?','[{"id":"A","text_bn":"ভরনির্ভর"},{"id":"B","text_bn":"ভরের ব্যস্তানুপাতিক"},{"id":"C","text_bn":"একই"},{"id":"D","text_bn":"শূন্য"}]'::jsonb,'C','বায়ুর বাধা বাদ দিলে একই স্থানে সব বস্তু g ত্বরণ পায়।',30),
(2,'৪ m/s থেকে ১২ m/s হতে ৪ s লাগলে ত্বরণ?','[{"id":"A","text_bn":"১ m/s²"},{"id":"B","text_bn":"২ m/s²"},{"id":"C","text_bn":"৪ m/s²"},{"id":"D","text_bn":"৮ m/s²"}]'::jsonb,'B','a=(১২−৪)/৪ = ২ m/s²।',31),
(2,'বৃত্তাকার পথে সমদ্রুতিতে ত্বরণ থাকে কেন?','[{"id":"A","text_bn":"ভর কমে"},{"id":"B","text_bn":"দিক পরিবর্তিত হয়"},{"id":"C","text_bn":"সময় থামে"},{"id":"D","text_bn":"দূরত্ব শূন্য"}]'::jsonb,'B','দিক বদলায় বলে বেগ পরিবর্তিত হয়, তাই ত্বরণ থাকে।',32),
(2,'কখন গড় দ্রুতি ও গড় বেগের মান সমান?','[{"id":"A","text_bn":"যেকোনো বক্র পথে"},{"id":"B","text_bn":"দূরত্ব ও সরণ সমান হলে"},{"id":"C","text_bn":"ফিরে এলে"},{"id":"D","text_bn":"ত্বরণ থাকলেই"}]'::jsonb,'B','দিক না বদলে সরল পথে চললে দূরত্ব ও সরণের মান সমান।',33),
(2,'১০ m পূর্বে গিয়ে ১০ m পশ্চিমে ফিরলে মোট সরণ?','[{"id":"A","text_bn":"২০ m পূর্বে"},{"id":"B","text_bn":"১০ m পশ্চিমে"},{"id":"C","text_bn":"শূন্য"},{"id":"D","text_bn":"১০ m পূর্বে"}]'::jsonb,'C','শেষ অবস্থান শুরু অবস্থানের সমান; সরণ শূন্য।',34),
(3,'নিউটনের প্রথম সূত্র কোন ধারণার সঙ্গে সম্পর্কিত?','[{"id":"A","text_bn":"জড়তা"},{"id":"B","text_bn":"শক্তি সংরক্ষণ"},{"id":"C","text_bn":"তাপ পরিবহন"},{"id":"D","text_bn":"প্রতিসরণ"}]'::jsonb,'A','লব্ধ বল না থাকলে বস্তু স্থির বা সমবেগে সরলরেখায় চলে—জড়তার সূত্র।',35),
(3,'নিউটনের দ্বিতীয় সূত্রের রূপ কোনটি?','[{"id":"A","text_bn":"F=ma"},{"id":"B","text_bn":"v=u+at"},{"id":"C","text_bn":"W=Fs"},{"id":"D","text_bn":"ρ=m/V"}]'::jsonb,'A','লব্ধ বল = ভর × ত্বরণ।',36),
(3,'৫ kg ভরে ২ m/s² ত্বরণ আনতে বল কত?','[{"id":"A","text_bn":"২.৫ N"},{"id":"B","text_bn":"৭ N"},{"id":"C","text_bn":"১০ N"},{"id":"D","text_bn":"২৫ N"}]'::jsonb,'C','F=ma=৫×২=১০ N।',37),
(3,'ক্রিয়া-প্রতিক্রিয়া সম্পর্কে সঠিক বক্তব্য কোনটি?','[{"id":"A","text_bn":"একই বস্তুর ওপর"},{"id":"B","text_bn":"সমান বিপরীত, ভিন্ন বস্তুর ওপর"},{"id":"C","text_bn":"সবসময় বাতিল"},{"id":"D","text_bn":"একটি থাকলে অন্যটি নেই"}]'::jsonb,'B','ক্রিয়া ও প্রতিক্রিয়া ভিন্ন বস্তুর ওপর কাজ করে।',38),
(3,'ভরবেগের সূত্র কোনটি?','[{"id":"A","text_bn":"p=mv"},{"id":"B","text_bn":"p=ma"},{"id":"C","text_bn":"p=F/t"},{"id":"D","text_bn":"p=m/v"}]'::jsonb,'A','ভরবেগ = ভর × বেগ।',39),
(3,'ভরবেগের SI একক কোনটি?','[{"id":"A","text_bn":"kg m/s"},{"id":"B","text_bn":"N/m"},{"id":"C","text_bn":"kg/m³"},{"id":"D","text_bn":"J/s"}]'::jsonb,'A','ভরবেগের একক kg·m/s।',40),
(3,'ঘর্ষণ বল সাধারণত কোন দিকে কাজ করে?','[{"id":"A","text_bn":"আপেক্ষিক গতির বিপরীতে"},{"id":"B","text_bn":"সবসময় ওপরের দিকে"},{"id":"C","text_bn":"সবসময় গতির দিকে"},{"id":"D","text_bn":"মাধ্যাকর্ষণের দিকে"}]'::jsonb,'A','ঘর্ষণ আপেক্ষিক গতি বা গতির প্রবণতাকে বাধা দেয়।',41),
(3,'ঘর্ষণ কমানোর উপায় কোনটি?','[{"id":"A","text_bn":"পৃষ্ঠ খসখসে করা"},{"id":"B","text_bn":"লুব্রিকেন্ট ব্যবহার"},{"id":"C","text_bn":"লম্ব বল বাড়ানো"},{"id":"D","text_bn":"গতি আটকে দেওয়া"}]'::jsonb,'B','লুব্রিকেন্ট সংস্পর্শতলের ঘর্ষণ কমাতে পারে।',42),
(3,'বস্তুর ওজন কী?','[{"id":"A","text_bn":"ভর"},{"id":"B","text_bn":"পৃথিবীর মহাকর্ষীয় বল"},{"id":"C","text_bn":"আয়তন"},{"id":"D","text_bn":"ঘনত্ব"}]'::jsonb,'B','ওজন হলো বস্তুর ওপর মহাকর্ষীয় বল; W=mg।',43),
(3,'৬০ kg ব্যক্তির ওজন কত (g=১০ m/s²)?','[{"id":"A","text_bn":"৬ N"},{"id":"B","text_bn":"৬০ N"},{"id":"C","text_bn":"৬০০ N"},{"id":"D","text_bn":"৬০০০ N"}]'::jsonb,'C','W=mg=৬০×১০=৬০০ N।',44),
(3,'ভর ও ওজন সম্পর্কে সঠিক কোনটি?','[{"id":"A","text_bn":"ভর বদলায়, ওজন নয়"},{"id":"B","text_bn":"ভর স্কেলার, ওজন বল"},{"id":"C","text_bn":"ভর নিউটনে"},{"id":"D","text_bn":"ওজন কিলোগ্রামে"}]'::jsonb,'B','ভর স্কেলার; ওজন বল ও ভেক্টর।',45),
(3,'বাহ্যিক লব্ধ বল শূন্য হলে মোট ভরবেগ কী হয়?','[{"id":"A","text_bn":"শূন্য হয়"},{"id":"B","text_bn":"সংরক্ষিত থাকে"},{"id":"C","text_bn":"দ্বিগুণ হয়"},{"id":"D","text_bn":"কমে"}]'::jsonb,'B','বিচ্ছিন্ন ব্যবস্থায় মোট ভরবেগ অপরিবর্তিত থাকে।',46),
(3,'রকেট চলার পেছনে কোন সূত্র কাজ করে?','[{"id":"A","text_bn":"প্রথম সূত্র মাত্র"},{"id":"B","text_bn":"তৃতীয় সূত্র"},{"id":"C","text_bn":"আর্কিমিডিসের সূত্র"},{"id":"D","text_bn":"ওহমের সূত্র"}]'::jsonb,'B','পেছনে গ্যাস নির্গত হলে প্রতিক্রিয়ায় রকেট সামনে যায়।',47),
(3,'২০ N ডানে ও ৮ N বামে বলের লব্ধি?','[{"id":"A","text_bn":"২৮ N ডানে"},{"id":"B","text_bn":"১২ N ডানে"},{"id":"C","text_bn":"১২ N বামে"},{"id":"D","text_bn":"শূন্য"}]'::jsonb,'B','লব্ধি = ২০−৮ = ১২ N ডানে।',48),
(3,'একই বল, ভর দ্বিগুণ হলে ত্বরণ কী?','[{"id":"A","text_bn":"দ্বিগুণ"},{"id":"B","text_bn":"অর্ধেক"},{"id":"C","text_bn":"একই"},{"id":"D","text_bn":"চারগুণ"}]'::jsonb,'B','a=F/m; ভর দ্বিগুণ হলে ত্বরণ অর্ধেক।',49),
(3,'গুলি ছোড়ার সময় বন্দুক পেছনে সরে যায় কেন?','[{"id":"A","text_bn":"ঘর্ষণ"},{"id":"B","text_bn":"ভরবেগ সংরক্ষণ ও প্রতিক্রিয়া"},{"id":"C","text_bn":"তাপীয় প্রসারণ"},{"id":"D","text_bn":"চুম্বকত্ব"}]'::jsonb,'B','গুলি সামনের দিকে ভরবেগ পেলে বন্দুক বিপরীত দিকে ভরবেগ পায়।',50),
(1,'কোনটি মৌলিক ভৌত রাশি?','[{"id":"A","text_bn":"বল"},{"id":"B","text_bn":"বেগ"},{"id":"C","text_bn":"দৈর্ঘ্য"},{"id":"D","text_bn":"কাজ"}]'::jsonb,'C','দৈর্ঘ্য SI-এর মৌলিক রাশি; বল, বেগ ও কাজ লব্ধ রাশি।',1),
(1,'দৈর্ঘ্যের SI একক কোনটি?','[{"id":"A","text_bn":"সেন্টিমিটার"},{"id":"B","text_bn":"মিটার"},{"id":"C","text_bn":"কিলোমিটার"},{"id":"D","text_bn":"ফুট"}]'::jsonb,'B','দৈর্ঘ্যের SI একক মিটার (m)।',2),
(1,'ভরের SI একক কোনটি?','[{"id":"A","text_bn":"গ্রাম"},{"id":"B","text_bn":"নিউটন"},{"id":"C","text_bn":"কিলোগ্রাম"},{"id":"D","text_bn":"পাউন্ড"}]'::jsonb,'C','ভরের SI একক কিলোগ্রাম (kg)।',3),
(1,'সময়ের SI একক কোনটি?','[{"id":"A","text_bn":"মিনিট"},{"id":"B","text_bn":"ঘণ্টা"},{"id":"C","text_bn":"সেকেন্ড"},{"id":"D","text_bn":"দিন"}]'::jsonb,'C','সময়ের SI একক সেকেন্ড (s)।',4),
(1,'তাপগতীয় তাপমাত্রার SI একক কোনটি?','[{"id":"A","text_bn":"সেলসিয়াস"},{"id":"B","text_bn":"কেলভিন"},{"id":"C","text_bn":"ফারেনহাইট"},{"id":"D","text_bn":"জুল"}]'::jsonb,'B','তাপগতীয় তাপমাত্রার SI একক কেলভিন (K)।',5),
(1,'নিচের কোনটি লব্ধ রাশি?','[{"id":"A","text_bn":"সময়"},{"id":"B","text_bn":"দৈর্ঘ্য"},{"id":"C","text_bn":"ভর"},{"id":"D","text_bn":"ক্ষেত্রফল"}]'::jsonb,'D','ক্ষেত্রফল দৈর্ঘ্যের গুণফল; এটি লব্ধ রাশি।',6),
(1,'বেগের মাত্রা কোনটি?','[{"id":"A","text_bn":"[LT⁻¹]"},{"id":"B","text_bn":"[LT⁻²]"},{"id":"C","text_bn":"[MLT⁻²]"},{"id":"D","text_bn":"[ML²T⁻²]"}]'::jsonb,'A','বেগ = সরণ/সময়; মাত্রা [LT⁻¹]।',7),
(1,'বলের মাত্রিক সংকেত কোনটি?','[{"id":"A","text_bn":"[MLT⁻¹]"},{"id":"B","text_bn":"[MLT⁻²]"},{"id":"C","text_bn":"[ML²T⁻²]"},{"id":"D","text_bn":"[MT⁻²]"}]'::jsonb,'B','বল = ভর × ত্বরণ; মাত্রা [MLT⁻²]।',8),
(1,'এক নিউটন সমান কোনটি?','[{"id":"A","text_bn":"১ kg m s⁻¹"},{"id":"B","text_bn":"১ kg m s⁻²"},{"id":"C","text_bn":"১ kg m² s⁻²"},{"id":"D","text_bn":"১ kg s⁻²"}]'::jsonb,'B','১ N = ১ kg·m/s²।',9),
(1,'১০০ সেন্টিমিটার সমান কত মিটার?','[{"id":"A","text_bn":"০.০১"},{"id":"B","text_bn":"০.১"},{"id":"C","text_bn":"১"},{"id":"D","text_bn":"১০"}]'::jsonb,'C','১ মিটার = ১০০ সেন্টিমিটার।',10),
(1,'১ কিলোমিটার সমান কত মিটার?','[{"id":"A","text_bn":"১০০"},{"id":"B","text_bn":"৫০০"},{"id":"C","text_bn":"১০০০"},{"id":"D","text_bn":"১০,০০০"}]'::jsonb,'C','১ km = ১০০০ m।',11),
(1,'২.৫০ m-এ উল্লেখযোগ্য অঙ্ক কয়টি?','[{"id":"A","text_bn":"১"},{"id":"B","text_bn":"২"},{"id":"C","text_bn":"৩"},{"id":"D","text_bn":"৪"}]'::jsonb,'C','২.৫০-এ শেষের শূন্যটি তাৎপর্যপূর্ণ; মোট ৩টি অঙ্ক।',12),
(1,'দৈব পরিমাপ-ত্রুটি কমানোর ভালো উপায় কোনটি?','[{"id":"A","text_bn":"একবার মাপা"},{"id":"B","text_bn":"অনুমান করা"},{"id":"C","text_bn":"বারবার মেপে গড় নেওয়া"},{"id":"D","text_bn":"একক বাদ দেওয়া"}]'::jsonb,'C','একাধিক পরিমাপের গড় নিলে দৈব ত্রুটি কমতে পারে।',13),
(1,'স্লাইড ক্যালিপার্স দিয়ে কী মাপা যায়?','[{"id":"A","text_bn":"সময়"},{"id":"B","text_bn":"ক্ষুদ্র দৈর্ঘ্য বা ব্যাস"},{"id":"C","text_bn":"তাপমাত্রা"},{"id":"D","text_bn":"প্রবাহ"}]'::jsonb,'B','এটি ব্যাস, পুরুত্ব ও গভীরতার মতো দৈর্ঘ্য মাপে।',14),
(1,'যন্ত্রের লঘিষ্ঠ গণনা কী বোঝায়?','[{"id":"A","text_bn":"সর্বোচ্চ ভর"},{"id":"B","text_bn":"মাপার ক্ষুদ্রতম মান"},{"id":"C","text_bn":"যন্ত্রের ওজন"},{"id":"D","text_bn":"সময়ের একক"}]'::jsonb,'B','লঘিষ্ঠ গণনা হলো যন্ত্রের ক্ষুদ্রতম পরিমাপযোগ্য মান।',15),
(1,'ঘনত্বের SI একক কোনটি?','[{"id":"A","text_bn":"kg/m"},{"id":"B","text_bn":"kg/m²"},{"id":"C","text_bn":"kg/m³"},{"id":"D","text_bn":"N/m²"}]'::jsonb,'C','ঘনত্ব = ভর/আয়তন; একক kg/m³।',16),
(1,'সমান ভরের দুটি বস্তুর কোনটির ঘনত্ব বেশি?','[{"id":"A","text_bn":"আয়তন বেশি যার"},{"id":"B","text_bn":"আয়তন কম যার"},{"id":"C","text_bn":"রং গাঢ় যার"},{"id":"D","text_bn":"তাপমাত্রা বেশি যার"}]'::jsonb,'B','সমান ভরে আয়তন কম হলে ঘনত্ব বেশি।',17)
)
INSERT INTO public.quiz_questions(quiz_id,prompt_bn,options,sort_order)
SELECT q.id,d.prompt_bn,d.options,d.sort_order FROM data d
JOIN public.courses c ON c.slug='force-and-motion'
JOIN public.quizzes q ON q.course_id=c.id AND q.title_bn=CASE d.chapter_no WHEN 1 THEN 'SSC পদার্থবিজ্ঞান — ভৌত রাশি ও পরিমাপ' WHEN 2 THEN 'SSC পদার্থবিজ্ঞান — গতি' ELSE 'SSC পদার্থবিজ্ঞান — বল' END
WHERE NOT EXISTS(SELECT 1 FROM public.quiz_questions old WHERE old.quiz_id=q.id AND old.prompt_bn=d.prompt_bn);
WITH data(chapter_no,prompt_bn,correct_option_id,explanation_bn,sort_order) AS (VALUES
(2,'সরণ কী?','B','সরণ হলো প্রারম্ভিক থেকে শেষ অবস্থানের দিকসহ পরিবর্তন।',18),
(2,'দ্রুতি কোন ধরনের রাশি?','B','দ্রুতির মান আছে, দিক নেই; এটি স্কেলার।',19),
(2,'বেগ কোন ধরনের রাশি?','B','বেগের মান ও দিক থাকে; এটি ভেক্টর।',20),
(2,'গড় দ্রুতির সূত্র কোনটি?','B','গড় দ্রুতি = মোট দূরত্ব ÷ মোট সময়।',21),
(2,'বস্তু ১০ সেকেন্ডে ৫০ মিটার যায়। গড় দ্রুতি?','B','৫০÷১০ = ৫ m/s।',22),
(2,'স্থির অবস্থা থেকে ২ m/s² ত্বরণে ৩ s চললে শেষ বেগ?','C','v = u + at = ০ + ২×৩ = ৬ m/s।',23),
(2,'সমবেগে চলমান বস্তুর ত্বরণ কত?','A','বেগ অপরিবর্তিত হলে ত্বরণ শূন্য।',24),
(2,'ত্বরণের SI একক কোনটি?','B','ত্বরণ = বেগের পরিবর্তন/সময়; একক m/s²।',25),
(2,'বেগ-সময় লেখচিত্রের ঢাল কী?','C','বেগ-সময় গ্রাফের ঢাল ত্বরণ।',26),
(2,'বেগ-সময় গ্রাফের নিচের ক্ষেত্রফল কী নির্দেশ করে?','B','বেগ-সময় গ্রাফের বীজগাণিতিক ক্ষেত্রফল সরণ।',27),
(2,'২০ m/s ধ্রুব বেগে ৫ s-এ দূরত্ব কত?','C','দূরত্ব = ২০×৫ = ১০০ m।',28),
(2,'সমত্বরণে গতির প্রথম সমীকরণ কোনটি?','A','সমত্বরণে v = u + at।',29),
(2,'বায়ুর বাধা উপেক্ষায় একই স্থানে মুক্তপতনের ত্বরণ?','C','বায়ুর বাধা বাদ দিলে একই স্থানে সব বস্তু g ত্বরণ পায়।',30),
(2,'৪ m/s থেকে ১২ m/s হতে ৪ s লাগলে ত্বরণ?','B','a=(১২−৪)/৪ = ২ m/s²।',31),
(2,'বৃত্তাকার পথে সমদ্রুতিতে ত্বরণ থাকে কেন?','B','দিক বদলায় বলে বেগ পরিবর্তিত হয়, তাই ত্বরণ থাকে।',32),
(2,'কখন গড় দ্রুতি ও গড় বেগের মান সমান?','B','দিক না বদলে সরল পথে চললে দূরত্ব ও সরণের মান সমান।',33),
(2,'১০ m পূর্বে গিয়ে ১০ m পশ্চিমে ফিরলে মোট সরণ?','C','শেষ অবস্থান শুরু অবস্থানের সমান; সরণ শূন্য।',34),
(3,'নিউটনের প্রথম সূত্র কোন ধারণার সঙ্গে সম্পর্কিত?','A','লব্ধ বল না থাকলে বস্তু স্থির বা সমবেগে সরলরেখায় চলে—জড়তার সূত্র।',35),
(3,'নিউটনের দ্বিতীয় সূত্রের রূপ কোনটি?','A','লব্ধ বল = ভর × ত্বরণ।',36),
(3,'৫ kg ভরে ২ m/s² ত্বরণ আনতে বল কত?','C','F=ma=৫×২=১০ N।',37),
(3,'ক্রিয়া-প্রতিক্রিয়া সম্পর্কে সঠিক বক্তব্য কোনটি?','B','ক্রিয়া ও প্রতিক্রিয়া ভিন্ন বস্তুর ওপর কাজ করে।',38),
(3,'ভরবেগের সূত্র কোনটি?','A','ভরবেগ = ভর × বেগ।',39),
(3,'ভরবেগের SI একক কোনটি?','A','ভরবেগের একক kg·m/s।',40),
(3,'ঘর্ষণ বল সাধারণত কোন দিকে কাজ করে?','A','ঘর্ষণ আপেক্ষিক গতি বা গতির প্রবণতাকে বাধা দেয়।',41),
(3,'ঘর্ষণ কমানোর উপায় কোনটি?','B','লুব্রিকেন্ট সংস্পর্শতলের ঘর্ষণ কমাতে পারে।',42),
(3,'বস্তুর ওজন কী?','B','ওজন হলো বস্তুর ওপর মহাকর্ষীয় বল; W=mg।',43),
(3,'৬০ kg ব্যক্তির ওজন কত (g=১০ m/s²)?','C','W=mg=৬০×১০=৬০০ N।',44),
(3,'ভর ও ওজন সম্পর্কে সঠিক কোনটি?','B','ভর স্কেলার; ওজন বল ও ভেক্টর।',45),
(3,'বাহ্যিক লব্ধ বল শূন্য হলে মোট ভরবেগ কী হয়?','B','বিচ্ছিন্ন ব্যবস্থায় মোট ভরবেগ অপরিবর্তিত থাকে।',46),
(3,'রকেট চলার পেছনে কোন সূত্র কাজ করে?','B','পেছনে গ্যাস নির্গত হলে প্রতিক্রিয়ায় রকেট সামনে যায়।',47),
(3,'২০ N ডানে ও ৮ N বামে বলের লব্ধি?','B','লব্ধি = ২০−৮ = ১২ N ডানে।',48),
(3,'একই বল, ভর দ্বিগুণ হলে ত্বরণ কী?','B','a=F/m; ভর দ্বিগুণ হলে ত্বরণ অর্ধেক।',49),
(3,'গুলি ছোড়ার সময় বন্দুক পেছনে সরে যায় কেন?','B','গুলি সামনের দিকে ভরবেগ পেলে বন্দুক বিপরীত দিকে ভরবেগ পায়।',50),
(1,'কোনটি মৌলিক ভৌত রাশি?','C','দৈর্ঘ্য SI-এর মৌলিক রাশি; বল, বেগ ও কাজ লব্ধ রাশি।',1),
(1,'দৈর্ঘ্যের SI একক কোনটি?','B','দৈর্ঘ্যের SI একক মিটার (m)।',2),
(1,'ভরের SI একক কোনটি?','C','ভরের SI একক কিলোগ্রাম (kg)।',3),
(1,'সময়ের SI একক কোনটি?','C','সময়ের SI একক সেকেন্ড (s)।',4),
(1,'তাপগতীয় তাপমাত্রার SI একক কোনটি?','B','তাপগতীয় তাপমাত্রার SI একক কেলভিন (K)।',5),
(1,'নিচের কোনটি লব্ধ রাশি?','D','ক্ষেত্রফল দৈর্ঘ্যের গুণফল; এটি লব্ধ রাশি।',6),
(1,'বেগের মাত্রা কোনটি?','A','বেগ = সরণ/সময়; মাত্রা [LT⁻¹]।',7),
(1,'বলের মাত্রিক সংকেত কোনটি?','B','বল = ভর × ত্বরণ; মাত্রা [MLT⁻²]।',8),
(1,'এক নিউটন সমান কোনটি?','B','১ N = ১ kg·m/s²।',9),
(1,'১০০ সেন্টিমিটার সমান কত মিটার?','C','১ মিটার = ১০০ সেন্টিমিটার।',10),
(1,'১ কিলোমিটার সমান কত মিটার?','C','১ km = ১০০০ m।',11),
(1,'২.৫০ m-এ উল্লেখযোগ্য অঙ্ক কয়টি?','C','২.৫০-এ শেষের শূন্যটি তাৎপর্যপূর্ণ; মোট ৩টি অঙ্ক।',12),
(1,'দৈব পরিমাপ-ত্রুটি কমানোর ভালো উপায় কোনটি?','C','একাধিক পরিমাপের গড় নিলে দৈব ত্রুটি কমতে পারে।',13),
(1,'স্লাইড ক্যালিপার্স দিয়ে কী মাপা যায়?','B','এটি ব্যাস, পুরুত্ব ও গভীরতার মতো দৈর্ঘ্য মাপে।',14),
(1,'যন্ত্রের লঘিষ্ঠ গণনা কী বোঝায়?','B','লঘিষ্ঠ গণনা হলো যন্ত্রের ক্ষুদ্রতম পরিমাপযোগ্য মান।',15),
(1,'ঘনত্বের SI একক কোনটি?','C','ঘনত্ব = ভর/আয়তন; একক kg/m³।',16),
(1,'সমান ভরের দুটি বস্তুর কোনটির ঘনত্ব বেশি?','B','সমান ভরে আয়তন কম হলে ঘনত্ব বেশি।',17)
)
INSERT INTO public.quiz_question_keys(question_id,correct_option_id,explanation_bn,teacher_reviewed)
SELECT qq.id,d.correct_option_id,d.explanation_bn,true FROM data d
JOIN public.courses c ON c.slug='force-and-motion'
JOIN public.quizzes q ON q.course_id=c.id AND q.title_bn=CASE d.chapter_no WHEN 1 THEN 'SSC পদার্থবিজ্ঞান — ভৌত রাশি ও পরিমাপ' WHEN 2 THEN 'SSC পদার্থবিজ্ঞান — গতি' ELSE 'SSC পদার্থবিজ্ঞান — বল' END
JOIN public.quiz_questions qq ON qq.quiz_id=q.id AND qq.prompt_bn=d.prompt_bn
ON CONFLICT(question_id) DO UPDATE SET correct_option_id=EXCLUDED.correct_option_id,explanation_bn=EXCLUDED.explanation_bn,teacher_reviewed=true;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_question_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "published quizzes readable" ON public.quizzes;
CREATE POLICY "published quizzes readable" ON public.quizzes FOR SELECT TO anon,authenticated USING(status='published');
DROP POLICY IF EXISTS "published quiz questions readable" ON public.quiz_questions;
CREATE POLICY "published quiz questions readable" ON public.quiz_questions FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.quizzes q WHERE q.id=quiz_questions.quiz_id AND q.status='published'));
DROP POLICY IF EXISTS "learners read own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "learners read own quiz attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()));
REVOKE ALL ON public.quiz_question_keys FROM anon,authenticated;
GRANT SELECT ON public.quizzes,public.quiz_questions TO anon,authenticated;
GRANT SELECT ON public.quiz_attempts TO authenticated;
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(p_quiz_id uuid,p_answers jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $fn$
DECLARE v_user uuid:=auth.uid(); v_total integer; v_correct integer; v_score smallint; v_pass smallint; v_id uuid; v_review jsonb;
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 IF p_answers IS NULL OR jsonb_typeof(p_answers)<>'object' THEN RAISE EXCEPTION 'Answers must be a JSON object' USING ERRCODE='22023'; END IF;
 SELECT pass_percent INTO v_pass FROM public.quizzes WHERE id=p_quiz_id AND status='published';
 IF NOT FOUND THEN RAISE EXCEPTION 'Published quiz not found' USING ERRCODE='P0002'; END IF;
 SELECT count(*),count(*) FILTER(WHERE k.correct_option_id=p_answers->>qq.id::text) INTO v_total,v_correct
 FROM public.quiz_questions qq JOIN public.quiz_question_keys k ON k.question_id=qq.id WHERE qq.quiz_id=p_quiz_id;
 IF v_total=0 THEN RAISE EXCEPTION 'Quiz has no answer keys' USING ERRCODE='P0002'; END IF;
 v_score:=round(v_correct::numeric*100/v_total)::smallint;
 INSERT INTO public.quiz_attempts(user_id,quiz_id,correct_count,total_count,score_percent,passed,answers)
 VALUES(v_user,p_quiz_id,v_correct,v_total,v_score,v_score>=v_pass,p_answers) RETURNING id INTO v_id;
 SELECT jsonb_agg(jsonb_build_object('question_id',qq.id,'correct_option_id',k.correct_option_id,'explanation_bn',k.explanation_bn,
 'selected_option_id',p_answers->>qq.id::text,'is_correct',(k.correct_option_id=p_answers->>qq.id::text)) ORDER BY qq.sort_order)
 INTO v_review FROM public.quiz_questions qq JOIN public.quiz_question_keys k ON k.question_id=qq.id WHERE qq.quiz_id=p_quiz_id;
 RETURN jsonb_build_object('attempt_id',v_id,'correct_count',v_correct,'total_count',v_total,'score_percent',v_score,'passed',v_score>=v_pass,'review',COALESCE(v_review,'[]'::jsonb));
END; $fn$;
REVOKE EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid,jsonb) TO authenticated;
DO $verify$
DECLARE a int;b int;c int;d int;
BEGIN
 SELECT count(*) INTO a FROM public.quizzes q JOIN public.courses co ON co.id=q.course_id WHERE co.slug='force-and-motion' AND q.status='published' AND q.title_bn LIKE 'SSC পদার্থবিজ্ঞান — %';
 SELECT count(*) INTO b FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.courses co ON co.id=q.course_id WHERE co.slug='force-and-motion' AND q.title_bn LIKE 'SSC পদার্থবিজ্ঞান — %';
 SELECT count(*) INTO c FROM public.quiz_question_keys k JOIN public.quiz_questions qq ON qq.id=k.question_id JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.courses co ON co.id=q.course_id WHERE co.slug='force-and-motion' AND q.title_bn LIKE 'SSC পদার্থবিজ্ঞান — %';
 SELECT count(*) INTO d FROM public.quiz_question_keys k JOIN public.quiz_questions qq ON qq.id=k.question_id JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.courses co ON co.id=q.course_id WHERE co.slug='force-and-motion' AND q.title_bn LIKE 'SSC পদার্থবিজ্ঞান — %' AND NOT k.teacher_reviewed;
 IF a<>3 OR b<>50 OR c<>50 OR d<>0 THEN RAISE EXCEPTION 'SSC seed verification failed: quizzes %, questions %, keys %, unreviewed %',a,b,c,d; END IF;
END;$verify$;
