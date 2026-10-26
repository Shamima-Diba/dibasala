import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownToLine, ArrowRight, Bell, BookOpen, Bookmark, CheckCircle2, ChevronDown, CircleHelp, Clock3, Compass, GraduationCap, Home, Languages, Menu, Play, Search, Sparkles, Target, TrendingUp, Trophy, WifiOff, X, Bot, Moon, Sun } from 'lucide-react';

type Course = { id: number; title: string; subject: string; grade: string; lessons: number; progress: number; color: string; icon: string; label: string; duration: string };
const courses: Course[] = [
  { id: 1, title: 'গণিত: বীজগণিতের ভিত্তি', subject: 'গণিত', grade: '৯ম শ্রেণি', lessons: 12, progress: 65, color: 'violet', icon: '∑', label: 'চলমান', duration: '৪৫ মিনিট' },
  { id: 2, title: 'পদার্থবিজ্ঞান: বল ও গতি', subject: 'বিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 8, progress: 30, color: 'blue', icon: '⚛', label: 'চলমান', duration: '৩৫ মিনিট' },
  { id: 3, title: 'ইংরেজি Grammar Essentials', subject: 'ইংরেজি', grade: '৯ম শ্রেণি', lessons: 10, progress: 0, color: 'orange', icon: 'Aa', label: 'নতুন', duration: '২৫ মিনিট' },
  { id: 4, title: 'বাংলাদেশ ও বিশ্বপরিচয়', subject: 'সমাজবিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 14, progress: 80, color: 'green', icon: '🌏', label: 'চলমান', duration: '৩০ মিনিট' },
];
const bn = { home:'হোম', learn:'শিখুন', library:'আমার লাইব্রেরি', progress:'আমার অগ্রগতি', offline:'অফলাইনে পড়ুন', help:'সহায়তা', greeting:'আবার স্বাগতম, আরিফ! 👋', sub:'আজ একটু একটু করে এগিয়ে যাওয়াই বড় সাফল্য।', search:'কী শিখতে চাও? বিষয়, অধ্যায় বা কোর্স খুঁজুন', continue:'পড়াশোনা চালিয়ে যাও', seeAll:'সব দেখুন', today:'আজকের লক্ষ্য', minutes:'মিনিট পড়া', streak:'দিনের ধারাবাহিকতা', completed:'সম্পন্ন অধ্যায়', recommended:'তোমার জন্য সাজেস্ট করা', all:'সব বিষয়', math:'গণিত', science:'বিজ্ঞান', english:'ইংরেজি', social:'সমাজবিজ্ঞান', start:'শুরু করো', resume:'চালিয়ে যাও', free:'সম্পূর্ণ ফ্রি', noResults:'কোনো কোর্স পাওয়া যায়নি', offlineNote:'কম ইন্টারনেটেও শেখা চলবে', offlineSub:'পছন্দের নোট ও পাঠ আগে থেকে সংরক্ষণ করে রাখো।', quick:'দ্রুত কাজ', quiz:'আজকের কুইজ', notes:'সংরক্ষিত নোট', plan:'সাপ্তাহিক পরিকল্পনা', todayPlan:'আজকের পড়ার পরিকল্পনা', task1:'বীজগণিতের ১টি ভিডিও', task2:'১০টি MCQ অনুশীলন', task3:'আগের পাঠ রিভিশন', profile:'শিক্ষার্থী', searchResults:'কোর্সের ফলাফল', allCourses:'সব কোর্স', aiTutor:'AI টিউটর', askAi:'AI-কে জিজ্ঞাসা করো', aiPlaceholder:'যেকোনো বিষয় জিজ্ঞাসা করো...' };
const en = { home:'Home', learn:'Explore', library:'My library', progress:'My progress', offline:'Offline learning', help:'Help', greeting:'Welcome back, Arif! 👋', sub:'Small steps every day lead to big progress.', search:'What do you want to learn?', continue:'Continue learning', seeAll:'See all', today:"Today's goal", minutes:'Minutes learned', streak:'Day streak', completed:'Lessons completed', recommended:'Recommended for you', all:'All subjects', math:'Math', science:'Science', english:'English', social:'Social studies', start:'Start learning', resume:'Continue', free:'100% free', noResults:'No courses found', offlineNote:'Learning works on slow internet', offlineSub:'Save notes and lessons before you go offline.', quick:'Quick actions', quiz:'Daily quiz', notes:'Saved notes', plan:'Weekly plan', todayPlan:"Today's learning plan", task1:'Watch one algebra lesson', task2:'Practice 10 MCQs', task3:"Review yesterday's lesson", profile:'Learner', searchResults:'Course results', allCourses:'All courses', aiTutor:'AI Tutor', askAi:'Ask AI', aiPlaceholder:'Ask anything about your subjects...' };

export default function App() {
  const [language, setLanguage] = useState<'bn'|'en'>('bn');
  const [active, setActive] = useState('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState<number[]>(() => readDemoState('dibasala-demo-saved', [2]));
  const [done, setDone] = useState<string[]>(() => readDemoState('dibasala-demo-tasks', []));
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => readDemoState('dibasala-demo-completed-lessons', []));
  const [notice, setNotice] = useState('');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQ, setAiQ] = useState('');
  useEffect(() => { writeDemoState('dibasala-demo-saved', saved); }, [saved]);
  useEffect(() => { writeDemoState('dibasala-demo-tasks', done); }, [done]);
  useEffect(() => { writeDemoState('dibasala-demo-completed-lessons', completedLessons); }, [completedLessons]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const t = language === 'bn' ? bn : en;
  const filteredCourses = useMemo(() => courses.map(c => completedLessons.includes(c.id) ? {...c, progress:100, label: language==='bn'?'সম্পন্ন':'Completed'} : c).filter(c => {
    const s = query.trim().toLowerCase();
    return (!s || `${c.title} ${c.subject} ${c.grade}`.toLowerCase().includes(s)) && (filter==='all' || c.subject===filter);
  }), [query, filter, completedLessons, language]);
  const navItems = [{id:'home',label:t.home,icon:Home},{id:'learn',label:t.learn,icon:Compass},{id:'library',label:t.library,icon:BookOpen},{id:'progress',label:t.progress,icon:TrendingUp},{id:'offline',label:t.offline,icon:ArrowDownToLine}];
  const startCourse = (course: Course) => {
    setCompletedLessons(old => old.includes(course.id) ? old : [...old, course.id]);
    setNotice((language==='bn'?'ডেমো পাঠ শুরু: ':'Demo started: ') + course.title);
    setTimeout(() => setNotice(''), 3200);
  };
  return (
    <div className={`app-shell ${dark?'is-dark':''}`}>
      <aside className={`sidebar ${mobileMenu?'sidebar-open':''}`}>
        <div className="brand-row"><div className="brand-mark"><GraduationCap size={22}/></div><div><strong>পাঠশালা<span className="brand-dot">.</span></strong><small>PREMIUM LEARN</small></div><button className="icon-btn mobile-close" onClick={()=>setMobileMenu(false)}><X size={18}/></button></div>
        <div className="profile-mini"><div className="avatar">আ</div><div className="profile-text"><b>{language==='bn'?'আরিফ হাসান':'Arif Hasan'}</b><span>{language==='bn'?'৯ম শ্রেণি · SSC 2028':'Grade 9 · SSC 2028'}</span></div></div>
        <nav>{navItems.map(({id,label,icon:Icon})=><button key={id} className={`nav-item ${active===id?'active':''}`} onClick={()=>{setActive(id);setMobileMenu(false)}}><Icon size={18}/><span>{label}</span></button>)}</nav>
        <button className="ai-launch" onClick={()=>setAiOpen(true)}><Bot size={18}/><span>{t.aiTutor}</span><Sparkles size={14}/></button>
        <div className="sidebar-spacer"/>
        <div className="offline-card"><WifiOff size={18}/><strong>{t.offlineNote}</strong><p>{t.offlineSub}</p></div>
        <div className="sidebar-foot">Made for Bangladesh 🇧🇩</div>
      </aside>
      {mobileMenu && <button className="scrim" onClick={()=>setMobileMenu(false)}/>}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button>
          <div className="breadcrumb">{t.home} / <b>{navItems.find(n=>n.id===active)?.label}</b></div>
          <div className="top-actions">
            <span className="free-pill"><CheckCircle2 size={13}/>{t.free}</span>
            <button className="icon-btn" onClick={()=>setDark(d=>!d)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
            <button className="language-btn" onClick={()=>setLanguage(l=>l==='bn'?'en':'bn')}><Languages size={16}/>{language==='bn'?'বাংলা':'EN'}</button>
            <button className="icon-btn" onClick={()=>setNotice(language==='bn'?'নতুন নোটিফিকেশন নেই':'No new notifications')}><Bell size={18}/></button>
            <div className="top-avatar">আ</div>
          </div>
        </header>
        <div className="page-content">
          <section className="welcome-row">
            <div><div className="eyebrow"><Sparkles size={14}/>{language==='bn'?'প্রিমিয়াম শেখার যাত্রা':'PREMIUM JOURNEY'}</div>
            <h1>{active==='home'?t.greeting:navItems.find(n=>n.id===active)?.label}</h1>
            <p>{active==='home'?t.sub:(language==='bn'?'সবকিছু এক জায়গায়।':'Everything in one place.')}</p></div>
            <button className="ai-fab" onClick={()=>setAiOpen(true)}><Bot size={20}/><span>{t.askAi}</span></button>
          </section>
          <section className="search-panel"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>{query&&<button className="clear-search" onClick={()=>setQuery('')}><X size={15}/></button>}</section>
          <section className="stats-grid">
            <div className="stat-card glass"><div className="stat-icon purple"><Target size={18}/></div><span>{t.today}</span><strong>৩৫ <small>/ ৪৫</small></strong><div className="progress-track"><div className="progress-fill purple-fill" style={{width:'78%'}}/></div></div>
            <div className="stat-card glass"><div className="stat-icon orange"><Clock3 size={18}/></div><span>{t.minutes}</span><strong>১২৮</strong><em className="positive">+১৮%</em></div>
            <div className="stat-card glass"><div className="stat-icon pink"><Sparkles size={18}/></div><span>{t.streak}</span><strong>৭ <small>{language==='bn'?'দিন':'days'}</small></strong></div>
            <div className="stat-card glass"><div className="stat-icon green"><Trophy size={18}/></div><span>{t.completed}</span><strong>২৪ <small>/ ৪০</small></strong></div>
          </section>
          <section className="section-block">
            <div className="section-heading"><div><h2>{query?t.searchResults:t.continue}</h2><p>{language==='bn'?'যেখানে শেষ করেছিলে সেখান থেকে':'Pick up where you left off'}</p></div><button className="text-link" onClick={()=>{setActive('learn');setFilter('all')}}>{t.seeAll}<ArrowRight size={15}/></button></div>
            <div className="course-grid">{filteredCourses.slice(0,2).map(c=><CourseCard key={c.id} course={c} language={language} saved={saved.includes(c.id)} onSave={()=>setSaved(o=>o.includes(c.id)?o.filter(x=>x!==c.id):[...o,c.id])} onStart={()=>startCourse(c)} t={t}/>)}{filteredCourses.length===0&&<div className="empty-state"><Search size={26}/><strong>{t.noResults}</strong></div>}</div>
          </section>
          <section className="section-block lower-grid">
            <div className="recommend-panel glass">
              <div className="section-heading compact"><div><h2>{t.recommended}</h2></div></div>
              <div className="filter-row">{[{id:'all',label:t.all},{id:'গণিত',label:t.math},{id:'বিজ্ঞান',label:t.science},{id:'ইংরেজি',label:t.english},{id:'সমাজবিজ্ঞান',label:t.social}].map(f=><button key={f.id} className={`filter-chip ${filter===f.id?'selected':''}`} onClick={()=>setFilter(f.id)}>{f.label}</button>)}</div>
              <div className="mini-course-list">{filteredCourses.slice(0,4).map(c=><button className="mini-course" key={c.id} onClick={()=>startCourse(c)}><div className={`mini-icon ${c.color}`}>{c.icon}</div><div className="mini-info"><b>{c.title}</b><span>{c.grade}</span></div><ArrowRight size={15}/></button>)}</div>
            </div>
            <div className="plan-panel glass">
              <div className="section-heading compact"><div><h2>{t.todayPlan}</h2></div></div>
              <div className="task-list">{[{id:'a',label:t.task1},{id:'b',label:t.task2},{id:'c',label:t.task3}].map(task=><label key={task.id} className={`task-row ${done.includes(task.id)?'task-done':''}`}><input type="checkbox" checked={done.includes(task.id)} onChange={()=>setDone(o=>o.includes(task.id)?o.filter(x=>x!==task.id):[...o,task.id])}/><span className="custom-check"><CheckCircle2 size={16}/></span><span className="task-label">{task.label}</span></label>)}</div>
              <div className="plan-footer"><span>{done.length}/3</span><div className="progress-track"><div className="progress-fill purple-fill" style={{width:`${done.length/3*100}%`}}/></div></div>
            </div>
          </section>
          <footer className="page-footer"><span>© 2026 পাঠশালা</span><span>✓ Privacy first</span></footer>
        </div>
      </main>
      {aiOpen && (
        <div className="ai-overlay" onClick={()=>setAiOpen(false)}>
          <div className="ai-sheet" onClick={e=>e.stopPropagation()}>
            <div className="ai-head"><Bot size={20}/><b>{t.aiTutor}</b><button onClick={()=>setAiOpen(false)}><X size={18}/></button></div>
            <p className="ai-hint">{language==='bn'?'Gemini Edge Function দিয়ে উত্তর আসবে (কনফিগার করুন)':'Answers via Gemini Edge Function (configure secrets)'}</p>
            <div className="ai-input-row"><input value={aiQ} onChange={e=>setAiQ(e.target.value)} placeholder={t.aiPlaceholder}/><button onClick={()=>{setNotice(language==='bn'?'AI রেসপন্স ডেমো — Secrets সেট করুন':'AI demo — set Edge secrets');setAiOpen(false);setTimeout(()=>setNotice(''),3000)}}><ArrowRight size={18}/></button></div>
          </div>
        </div>
      )}
      {notice && <div className="toast"><CheckCircle2 size={16}/>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
    </div>
  );
}
function readDemoState<T>(key:string, fallback:T):T { try{const r=localStorage.getItem(key);return r?JSON.parse(r) as T:fallback}catch{return fallback} }
function writeDemoState(key:string, value:unknown){ try{localStorage.setItem(key,JSON.stringify(value))}catch{} }
function CourseCard({course,language,saved,onSave,onStart,t}:{course:Course;language:'bn'|'en';saved:boolean;onSave:()=>void;onStart:()=>void;t:typeof bn}) {
  return <article className="course-card glass"><div className={`course-art ${course.color}`}><span className="course-subject">{course.subject}</span><span className="course-symbol">{course.icon}</span><button className={`save-btn ${saved?'saved':''}`} onClick={onSave}><Bookmark size={16} fill={saved?'currentColor':'none'}/></button></div><div className="course-body"><div className="course-meta"><span>{course.grade}</span>·<span>{course.lessons} {language==='bn'?'পাঠ':'lessons'}</span></div><h3>{course.title}</h3><div className="course-progress-row"><span>{course.progress}%</span></div><div className="progress-track"><div className={`progress-fill \( {course.color==='green'?'green-fill':course.color==='orange'?'orange-fill':'purple-fill'}`} style={{width:` \){course.progress}%`}}/></div><button className="course-cta" onClick={onStart}>{course.progress>0?t.resume:t.start}<Play size={13} fill="currentColor"/></button></div></article>;
}
