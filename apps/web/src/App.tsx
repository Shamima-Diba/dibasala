import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, BookOpen, Bookmark, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Compass, GraduationCap, Home, Languages,
  Menu, Play, Search, Settings2, Sparkles, Target, TrendingUp, Trophy, WifiOff, X
} from 'lucide-react';

type Course = { id: number; title: string; subject: string; grade: string; lessons: number; progress: number; color: string; icon: string; label: string; duration: string };
const courses: Course[] = [
  { id: 1, title: 'গণিত: বীজগণিতের ভিত্তি', subject: 'গণিত', grade: '৯ম শ্রেণি', lessons: 12, progress: 65, color: 'violet', icon: '∑', label: 'চলমান', duration: '৪৫ মিনিট' },
  { id: 2, title: 'পদার্থবিজ্ঞান: বল ও গতি', subject: 'বিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 8, progress: 30, color: 'blue', icon: '⚛', label: 'চলমান', duration: '৩৫ মিনিট' },
  { id: 3, title: 'ইংরেজি Grammar Essentials', subject: 'ইংরেজি', grade: '৯ম শ্রেণি', lessons: 10, progress: 0, color: 'orange', icon: 'Aa', label: 'নতুন', duration: '২৫ মিনিট' },
  { id: 4, title: 'বাংলাদেশ ও বিশ্বপরিচয়', subject: 'সমাজবিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 14, progress: 80, color: 'green', icon: '🌏', label: 'চলমান', duration: '৩০ মিনিট' },
];
const bn = {
  home: 'হোম', learn: 'শিখুন', library: 'আমার লাইব্রেরি', progress: 'আমার অগ্রগতি', offline: 'অফলাইনে পড়ুন',
  help: 'সহায়তা কেন্দ্র', greeting: 'আবার স্বাগতম, আরিফ! 👋', sub: 'আজ একটু একটু করে এগিয়ে যাওয়াই বড় সাফল্য।',
  search: 'কী শিখতে চাও? বিষয়, অধ্যায় বা কোর্স খুঁজুন', continue: 'পড়াশোনা চালিয়ে যাও', seeAll: 'সব দেখুন',
  today: 'আজকের লক্ষ্য', minutes: 'মিনিট পড়া', streak: 'দিনের ধারাবাহিকতা', completed: 'সম্পন্ন অধ্যায়',
  recommended: 'তোমার জন্য সাজেস্ট করা', all: 'সব বিষয়', math: 'গণিত', science: 'বিজ্ঞান', english: 'ইংরেজি',
  social: 'সমাজবিজ্ঞান', start: 'শুরু করো', resume: 'চালিয়ে যাও', free: 'সম্পূর্ণ ফ্রি', noResults: 'কোনো কোর্স পাওয়া যায়নি',
  offlineNote: 'কম ইন্টারনেটেও শেখা চলবে', offlineSub: 'পছন্দের নোট ও পাঠ আগে থেকে সংরক্ষণ করে রাখো।',
  quick: 'দ্রুত কাজ', quiz: 'আজকের কুইজ', notes: 'সংরক্ষিত নোট', plan: 'সাপ্তাহিক পরিকল্পনা',
  todayPlan: 'আজকের পড়ার পরিকল্পনা', task1: 'বীজগণিতের ১টি ভিডিও', task2: '১০টি MCQ অনুশীলন', task3: 'আগের পাঠ রিভিশন',
  profile: 'শিক্ষার্থী', searchResults: 'কোর্সের ফলাফল', allCourses: 'সব কোর্স'
};
const en = {
  home: 'Home', learn: 'Explore', library: 'My library', progress: 'My progress', offline: 'Offline learning',
  help: 'Help center', greeting: 'Welcome back, Arif! 👋', sub: 'Small steps every day lead to big progress.',
  search: 'What do you want to learn? Search subjects, chapters or courses', continue: 'Continue learning', seeAll: 'See all',
  today: 'Today’s goal', minutes: 'Minutes learned', streak: 'Day streak', completed: 'Lessons completed',
  recommended: 'Recommended for you', all: 'All subjects', math: 'Math', science: 'Science', english: 'English',
  social: 'Social studies', start: 'Start learning', resume: 'Continue', free: '100% free', noResults: 'No courses found',
  offlineNote: 'Learning works on slow internet', offlineSub: 'Save notes and lessons before you go offline.',
  quick: 'Quick actions', quiz: 'Daily quiz', notes: 'Saved notes', plan: 'Weekly plan',
  todayPlan: 'Today’s learning plan', task1: 'Watch one algebra lesson', task2: 'Practice 10 MCQs', task3: 'Review yesterday’s lesson',
  profile: 'Learner', searchResults: 'Course results', allCourses: 'All courses'
};

export default function App() {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [active, setActive] = useState('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState<number[]>(() => readDemoState<number[]>('dibasala-demo-saved', [2]));
  const [done, setDone] = useState<string[]>(() => readDemoState<string[]>('dibasala-demo-tasks', []));
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => readDemoState<number[]>('dibasala-demo-completed-lessons', []));
  const [notice, setNotice] = useState('');
  useEffect(() => { writeDemoState('dibasala-demo-saved', saved); }, [saved]);
  useEffect(() => { writeDemoState('dibasala-demo-tasks', done); }, [done]);
  useEffect(() => { writeDemoState('dibasala-demo-completed-lessons', completedLessons); }, [completedLessons]);
  const t = language === 'bn' ? bn : en;

  const filteredCourses = useMemo(() => courses.filter((course) => {
    const search = query.trim().toLocaleLowerCase();
    const matchesQuery = !search || `${course.title} ${course.subject} ${course.grade}`.toLocaleLowerCase().includes(search);
    const matchesFilter = filter === 'all' || course.subject === filter;
    return matchesQuery && matchesFilter;
  }), [query, filter]);

  const navItems = [
    { id: 'home', label: t.home, icon: Home }, { id: 'learn', label: t.learn, icon: Compass },
    { id: 'library', label: t.library, icon: BookOpen }, { id: 'progress', label: t.progress, icon: TrendingUp },
    { id: 'offline', label: t.offline, icon: ArrowDownToLine },
  ];
  const startCourse = (course: Course) => {
    setNotice(language === 'bn' ? `“${course.title}” পাঠটি ডেমো হিসেবে খোলা হয়েছে।` : `"${course.title}" opened in demo mode.`);
    window.setTimeout(() => setNotice(''), 3500);
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><GraduationCap size={23}/></div><div><strong>পাঠশালা<span className="brand-dot">.</span></strong><small>LEARN WITHOUT LIMITS</small></div><button className="icon-btn mobile-close" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X size={18}/></button></div>
      <div className="profile-mini"><div className="avatar">আ</div><div className="profile-text"><b>{language === 'bn' ? 'আরিফ হাসান' : 'Arif Hasan'}</b><span>{language === 'bn' ? '৯ম শ্রেণি · SSC 2028' : 'Grade 9 · SSC 2028'}</span></div><ChevronDown size={16}/></div>
      <div className="nav-caption">{language === 'bn' ? 'শেখার জায়গা' : 'LEARNING SPACE'}</div>
      <nav aria-label="Main navigation">{navItems.map(({id,label,icon:Icon}) => <button key={id} className={`nav-item ${active===id?'active':''}`} onClick={() => {setActive(id);setMobileMenu(false);}}><Icon size={19}/><span>{label}</span>{id==='offline' && <span className="nav-new">NEW</span>}</button>)}</nav>
      <div className="sidebar-spacer"/>
      <div className="offline-card"><div className="offline-icon"><WifiOff size={19}/></div><strong>{t.offlineNote}</strong><p>{t.offlineSub}</p><button onClick={() => {setActive('offline');setMobileMenu(false)}}>{language==='bn'?'অফলাইন লাইব্রেরি':'Open offline library'} <ArrowRight size={14}/></button></div>
      <button className="nav-item muted" onClick={() => setNotice(language==='bn'?'সহায়তা বিভাগ শিগগিরই আসছে।':'Help section coming soon.')}><CircleHelp size={19}/><span>{t.help}</span></button>
      <div className="sidebar-foot">Made for every learner in Bangladesh 🇧🇩</div>
    </aside>
    {mobileMenu && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)}/>}
    <main className="main-area">
      <header className="topbar">
        <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={21}/></button>
        <div className="breadcrumb">{t.home}<span>/</span><b>{navItems.find(n=>n.id===active)?.label || t.home}</b></div>
        <div className="top-actions"><span className="free-pill"><CheckCircle2 size={14}/>{t.free}</span><button className="language-btn" onClick={() => setLanguage(language==='bn'?'en':'bn')}><Languages size={17}/>{language==='bn'?'বাংলা':'English'}</button><button className="icon-btn notification" aria-label="Notifications" onClick={() => setNotice(language==='bn'?'নতুন কোনো নোটিফিকেশন নেই।':'No new notifications.')}><Bell size={19}/><i/></button><div className="top-avatar">আ</div></div>
      </header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={15}/>{language==='bn'?'তোমার শেখার যাত্রা':'YOUR LEARNING JOURNEY'}</div><h1>{active==='home'?t.greeting:(navItems.find(n=>n.id===active)?.label || t.home)}</h1><p>{active==='home'?t.sub:(language==='bn'?'তোমার শেখার সবকিছু এক জায়গায়।':'Everything you need to learn, in one place.')}</p></div><div className="welcome-illustration" aria-hidden="true"><div className="sun-disc"/><div className="book book-one"/><div className="book book-two"/><div className="plant">✦</div></div></section>
        <section className="search-panel"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>{query && <button className="clear-search" aria-label="Clear search" onClick={()=>setQuery('')}><X size={16}/></button>}<kbd>⌘ K</kbd></section>
        <section className="stats-grid" aria-label="Learning statistics">
          <div className="stat-card"><div className="stat-icon purple"><Target size={20}/></div><span>{t.today}</span><strong>৩৫ <small>/ ৪৫ {language==='bn'?'মিনিট':'min'}</small></strong><div className="progress-track"><div className="progress-fill purple-fill" style={{width:'78%'}}/></div><em>{language==='bn'?'আর মাত্র ১০ মিনিট!':'Only 10 minutes to go!'}</em></div>
          <div className="stat-card"><div className="stat-icon orange"><Clock3 size={20}/></div><span>{t.minutes}</span><strong>১২৮ <small>{language==='bn'?'মিনিট':'min'}</small></strong><em className="positive"><TrendingUp size={13}/> +১৮% {language==='bn'?'গত সপ্তাহ থেকে':'vs last week'}</em></div>
          <div className="stat-card"><div className="stat-icon pink"><Sparkles size={20}/></div><span>{t.streak}</span><strong>৭ <small>{language==='bn'?'দিন':'days'}</small></strong><em>{language==='bn'?'চালিয়ে যাও! 🔥':'Keep it up! 🔥'}</em></div>
          <div className="stat-card"><div className="stat-icon green"><Trophy size={20}/></div><span>{t.completed}</span><strong>২৪ <small>/ ৪০</small></strong><div className="progress-track"><div className="progress-fill green-fill" style={{width:'60%'}}/></div><em>{language==='bn'?'দারুণ অগ্রগতি':'Great progress'}</em></div>
        </section>
        <section className="section-block">
          <div className="section-heading"><div><h2>{query ? t.searchResults : t.continue}</h2><p>{language==='bn'?'যেখানে শেষ করেছিলে, সেখান থেকেই শুরু করো':'Pick up right where you left off'}</p></div><button className="text-link" onClick={()=>{setActive('learn');setFilter('all');setQuery('')}}>{t.seeAll}<ArrowRight size={16}/></button></div>
          <div className="course-grid">
            {filteredCourses.slice(0,2).map(course=><CourseCard key={course.id} course={course} language={language} saved={saved.includes(course.id)} onSave={()=>setSaved(old=>old.includes(course.id)?old.filter(x=>x!==course.id):[...old,course.id])} onStart={()=>startCourse(course)} t={t}/>)}
            {filteredCourses.length===0 && <div className="empty-state"><Search size={28}/><strong>{t.noResults}</strong><button onClick={()=>{setQuery('');setFilter('all')}}>{language==='bn'?'সব কোর্স দেখুন':'Show all courses'}</button></div>}
          </div>
        </section>
        <section className="section-block lower-grid">
          <div className="recommend-panel">
            <div className="section-heading compact"><div><h2>{t.recommended}</h2><p>{language==='bn'?'তোমার শ্রেণি ও আগ্রহ অনুযায়ী':'Based on your grade and interests'}</p></div><span className="sparkle-badge"><Sparkles size={15}/></span></div>
            <div className="filter-row">{[{id:'all',label:t.all},{id:'গণিত',label:t.math},{id:'বিজ্ঞান',label:t.science},{id:'ইংরেজি',label:t.english},{id:'সমাজবিজ্ঞান',label:t.social}].map(f=><button key={f.id} className={`filter-chip ${filter===f.id?'selected':''}`} onClick={()=>setFilter(f.id)}>{f.label}</button>)}</div>
            <div className="mini-course-list">{filteredCourses.slice(0,4).map(c=><button className="mini-course" key={c.id} onClick={()=>startCourse(c)}><div className={`mini-icon ${c.color}`}>{c.icon}</div><div className="mini-info"><b>{c.title}</b><span>{c.grade} · {c.lessons} {language==='bn'?'টি পাঠ':'lessons'}</span></div><span className="mini-arrow"><ArrowRight size={16}/></span></button>)}{filteredCourses.length===0 && <p className="no-mini">{t.noResults}</p>}</div>
          </div>
          <div className="plan-panel"><div className="section-heading compact"><div><h2>{t.todayPlan}</h2><p>{language==='bn'?'ছোট লক্ষ্য, বড় অগ্রগতি':'Small goals, real progress'}</p></div><span className="plan-date">২৫ অক্টো</span></div><div className="task-list">{[{id:'a',label:t.task1,time:'১২ মিনিট'},{id:'b',label:t.task2,time:'১০ মিনিট'},{id:'c',label:t.task3,time:'৮ মিনিট'}].map(task=><label className={`task-row ${done.includes(task.id)?'task-done':''}`} key={task.id}><input type="checkbox" checked={done.includes(task.id)} onChange={()=>setDone(old=>old.includes(task.id)?old.filter(x=>x!==task.id):[...old,task.id])}/><span className="custom-check"><CheckCircle2 size={17}/></span><span className="task-label">{task.label}<small>{task.time}</small></span></label>)}</div><div className="plan-footer"><span>{done.length}/3 {language==='bn'?'লক্ষ্য সম্পন্ন':'goals completed'}</span><div className="progress-track"><div className="progress-fill purple-fill" style={{width:`${done.length/3*100}%`}}/></div></div></div>
        </section>
        <section className="quick-actions"><div><h2>{t.quick}</h2><p>{language==='bn'?'এক ট্যাপে দরকারি জায়গায়':'Jump into what you need'}</p></div><button onClick={()=>setNotice(language==='bn'?'কুইজ ডেমো শিগগিরই যুক্ত হবে।':'Quiz demo coming soon.')}><span className="quick-icon orange"><Target size={18}/></span><b>{t.quiz}</b><ArrowRight size={15}/></button><button onClick={()=>{setActive('library');setNotice(language==='bn'?'তোমার সংরক্ষিত নোট এখানে থাকবে।':'Your saved notes will live here.')}}><span className="quick-icon blue"><Bookmark size={18}/></span><b>{t.notes}</b><ArrowRight size={15}/></button><button onClick={()=>setNotice(language==='bn'?'সাপ্তাহিক পরিকল্পনা ডেমো।':'Weekly plan demo.')}><span className="quick-icon green"><Activity size={18}/></span><b>{t.plan}</b><ArrowRight size={15}/></button></section>
        <footer className="page-footer"><span>© 2026 পাঠশালা · {language==='bn'?'শেখার অধিকার সবার':'Learning belongs to everyone'}</span><span><ShieldMini/> {language==='bn'?'তোমার গোপনীয়তা গুরুত্বপূর্ণ':'Your privacy matters'}</span></footer>
      </div>
    </main>
    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}<button aria-label="Dismiss" onClick={()=>setNotice('')}><X size={15}/></button></div>}
  </div>;
}
function readDemoState<T>(key: string, fallback: T): T {
  try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }
  catch { return fallback; }
}
function writeDemoState(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be disabled by the browser. */ }
}
function ShieldMini(){return <span className="shield-mini">✓</span>}
function CourseCard({course,language,saved,onSave,onStart,t}:{course:Course;language:'bn'|'en';saved:boolean;onSave:()=>void;onStart:()=>void;t:typeof bn}) {
  return <article className="course-card"><div className={`course-art ${course.color}`}><span className="course-subject">{course.subject}</span><span className="course-symbol">{course.icon}</span><span className="art-orbit orbit-one"/><span className="art-orbit orbit-two"/><button className={`save-btn ${saved?'saved':''}`} onClick={onSave} aria-label={saved?(language==='bn'?'সংরক্ষণ বাতিল':'Remove bookmark'):(language==='bn'?'কোর্স সংরক্ষণ':'Save course')}><Bookmark size={17} fill={saved?'currentColor':'none'}/></button></div><div className="course-body"><div className="course-meta"><span>{course.grade}</span><span className="dot-sep">·</span><span>{course.lessons} {language==='bn'?'টি পাঠ':'lessons'}</span><span className="meta-duration"><Clock3 size={13}/>{course.duration}</span></div><h3>{course.title}</h3><div className="course-progress-row"><span>{course.progress===0?(language==='bn'?'এখনও শুরু হয়নি':'Not started'):`${course.progress}% ${language==='bn'?'সম্পন্ন':'complete'}`}</span><b>{course.progress}%</b></div><div className="progress-track"><div className={`progress-fill ${course.color==='green'?'green-fill':course.color==='orange'?'orange-fill':'purple-fill'}`} style={{width:`${course.progress}%`}}/></div><button className="course-cta" onClick={onStart}>{course.progress>0?t.resume:t.start}<Play size={14} fill="currentColor"/></button></div></article>;
}