import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, BookOpen, Bookmark,
  Bot, CheckCircle2, Clock3, Compass, GraduationCap, Home, Languages,
  Menu, Moon, Play, Search, Sparkles, Sun, Target, TrendingUp, Trophy,
  WifiOff, X
} from 'lucide-react'

type Course = {
  id: number
  title: string
  subject: string
  grade: string
  lessons: number
  progress: number
  color: string
  icon: string
  duration: string
}

const COURSES: Course[] = [
  { id: 1, title: 'গণিত: বীজগণিতের ভিত্তি', subject: 'গণিত', grade: '৯ম শ্রেণি', lessons: 12, progress: 65, color: 'violet', icon: '∑', duration: '৪৫ মিনিট' },
  { id: 2, title: 'পদার্থবিজ্ঞান: বল ও গতি', subject: 'বিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 8, progress: 30, color: 'blue', icon: '⚛', duration: '৩৫ মিনিট' },
  { id: 3, title: 'ইংরেজি Grammar Essentials', subject: 'ইংরেজি', grade: '৯ম শ্রেণি', lessons: 10, progress: 0, color: 'orange', icon: 'Aa', duration: '২৫ মিনিট' },
  { id: 4, title: 'বাংলাদেশ ও বিশ্বপরিচয়', subject: 'সমাজবিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 14, progress: 80, color: 'green', icon: '🌏', duration: '৩০ মিনিট' },
]

const bn = {
  home: 'হোম', learn: 'শিখুন', library: 'লাইব্রেরি', progress: 'অগ্রগতি', offline: 'অফলাইন',
  greeting: 'আবার স্বাগতম, আরিফ! 👋', sub: 'আজ একটু একটু করে এগিয়ে যাওয়াই বড় সাফল্য।',
  search: 'কী শিখতে চাও? বিষয় বা কোর্স খুঁজুন', continue: 'পড়াশোনা চালিয়ে যাও', seeAll: 'সব দেখুন',
  today: 'আজকের লক্ষ্য', minutes: 'মিনিট পড়া', streak: 'ধারাবাহিকতা', completed: 'সম্পন্ন পাঠ',
  recommended: 'তোমার জন্য সাজেস্ট', all: 'সব', math: 'গণিত', science: 'বিজ্ঞান', english: 'ইংরেজি', social: 'সমাজ',
  start: 'শুরু করো', resume: 'চালিয়ে যাও', free: 'সম্পূর্ণ ফ্রি', noResults: 'কোনো কোর্স পাওয়া যায়নি',
  offlineNote: 'কম নেটেও শেখা চলবে', offlineSub: 'পছন্দের পাঠ আগে থেকে সেভ করে রাখো।',
  quick: 'দ্রুত কাজ', quiz: 'আজকের কুইজ', notes: 'সংরক্ষিত নোট', plan: 'সাপ্তাহিক প্ল্যান',
  todayPlan: 'আজকের পরিকল্পনা', task1: 'বীজগণিতের ১টি ভিডিও', task2: '১০টি MCQ', task3: 'আগের পাঠ রিভিশন',
  aiTutor: 'AI টিউটর', askAi: 'AI-কে জিজ্ঞাসা করো', aiPlaceholder: 'যেকোনো বিষয় জিজ্ঞাসা করো...',
  aiHint: 'Gemini Edge Function দিয়ে উত্তর আসবে। Secrets সেট করুন।', send: 'পাঠাও',
  dark: 'ডার্ক', light: 'লাইট', saved: 'সংরক্ষিত', done: 'সম্পন্ন'
}

const en = {
  home: 'Home', learn: 'Explore', library: 'Library', progress: 'Progress', offline: 'Offline',
  greeting: 'Welcome back, Arif! 👋', sub: 'Small steps every day lead to big progress.',
  search: 'What do you want to learn?', continue: 'Continue learning', seeAll: 'See all',
  today: "Today's goal", minutes: 'Minutes', streak: 'Streak', completed: 'Completed',
  recommended: 'Recommended', all: 'All', math: 'Math', science: 'Science', english: 'English', social: 'Social',
  start: 'Start', resume: 'Continue', free: '100% free', noResults: 'No courses found',
  offlineNote: 'Works on slow internet', offlineSub: 'Save lessons before going offline.',
  quick: 'Quick actions', quiz: 'Daily quiz', notes: 'Saved notes', plan: 'Weekly plan',
  todayPlan: "Today's plan", task1: 'Watch one algebra video', task2: 'Practice 10 MCQs', task3: 'Review last lesson',
  aiTutor: 'AI Tutor', askAi: 'Ask AI', aiPlaceholder: 'Ask anything about your subjects...',
  aiHint: 'Answers via Gemini Edge Function. Configure secrets.', send: 'Send',
  dark: 'Dark', light: 'Light', saved: 'Saved', done: 'Done'
}

function readState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function writeState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn')
  const [active, setActive] = useState('home')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [menu, setMenu] = useState(false)
  const [dark, setDark] = useState(false)
  const [saved, setSaved] = useState<number[]>(() => readState('dibasala-saved', [2]))
  const [done, setDone] = useState<string[]>(() => readState('dibasala-tasks', []))
  const [completed, setCompleted] = useState<number[]>(() => readState('dibasala-completed', []))
  const [notice, setNotice] = useState('')
  const [aiOpen, setAiOpen] = useState(false)
  const [aiQ, setAiQ] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAnswer, setAiAnswer] = useState('')

  const t = lang === 'bn' ? bn : en

  useEffect(() => { writeState('dibasala-saved', saved) }, [saved])
  useEffect(() => { writeState('dibasala-tasks', done) }, [done])
  useEffect(() => { writeState('dibasala-completed', completed) }, [completed])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const courses = useMemo(() => {
    return COURSES.map(c =>
      completed.includes(c.id) ? { ...c, progress: 100 } : c
    ).filter(c => {
      const s = query.trim().toLowerCase()
      const matchQ = !s || `${c.title} ${c.subject} ${c.grade}`.toLowerCase().includes(s)
      const matchF = filter === 'all' || c.subject === filter
      return matchQ && matchF
    })
  }, [query, filter, completed])

  const nav = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'learn', label: t.learn, icon: Compass },
    { id: 'library', label: t.library, icon: BookOpen },
    { id: 'progress', label: t.progress, icon: TrendingUp },
    { id: 'offline', label: t.offline, icon: ArrowDownToLine },
  ]

  const toast = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3200)
  }

  const startCourse = (c: Course) => {
    setCompleted(old => (old.includes(c.id) ? old : [...old, c.id]))
    toast((lang === 'bn' ? 'পাঠ শুরু: ' : 'Started: ') + c.title)
  }

  const askAI = async () => {
    if (!aiQ.trim()) return
    setAiLoading(true)
    setAiAnswer('')
    try {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      if (!url || !key) {
        setAiAnswer(lang === 'bn'
          ? 'ডেমো মোড: VITE_SUPABASE_URL ও PUBLISHABLE_KEY সেট করুন।'
          : 'Demo mode: set VITE_SUPABASE_URL and PUBLISHABLE_KEY.')
        return
      }
      const res = await fetch(`${url}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ question: aiQ.trim() }),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Request failed')
      }
      const data = await res.json()
      setAiAnswer(data.answer || data.message || JSON.stringify(data))
    } catch (e: any) {
      setAiAnswer((lang === 'bn' ? 'সমস্যা: ' : 'Error: ') + (e.message || 'Unknown'))
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className={`app-shell ${dark ? 'is-dark' : ''}`}>
      <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><GraduationCap size={22} /></div>
          <div>
            <strong>পাঠশালা<span className="brand-dot">.</span></strong>
            <small>PREMIUM LEARN</small>
          </div>
          <button className="icon-btn mobile-close" onClick={() => setMenu(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="profile-mini">
          <div className="avatar">আ</div>
          <div className="profile-text">
            <b>{lang === 'bn' ? 'আরিফ হাসান' : 'Arif Hasan'}</b>
            <span>{lang === 'bn' ? '৯ম শ্রেণি · SSC 2028' : 'Grade 9 · SSC 2028'}</span>
          </div>
        </div>

        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => { setActive(id); setMenu(false) }}
            >
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="ai-launch" onClick={() => setAiOpen(true)}>
          <Bot size={18} /><span>{t.aiTutor}</span><Sparkles size={14} />
        </button>

        <div className="sidebar-spacer" />
        <div className="offline-card">
          <WifiOff size={18} />
          <strong>{t.offlineNote}</strong>
          <p>{t.offlineSub}</p>
        </div>
        <div className="sidebar-foot">Made for Bangladesh 🇧🇩</div>
      </aside>

      {menu && <button className="scrim" onClick={() => setMenu(false)} aria-label="Close menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            {t.home} / <b>{nav.find(n => n.id === active)?.label}</b>
          </div>
          <div className="top-actions">
            <span className="free-pill"><CheckCircle2 size={13} />{t.free}</span>
            <button className="icon-btn" onClick={() => setDark(d => !d)} aria-label="Theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="language-btn" onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')}>
              <Languages size={16} />{lang === 'bn' ? 'বাংলা' : 'EN'}
            </button>
            <button className="icon-btn" onClick={() => toast(lang === 'bn' ? 'নতুন নোটিফিকেশন নেই' : 'No new notifications')} aria-label="Bell">
              <Bell size={18} />
            </button>
            <div className="top-avatar">আ</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14} />{lang === 'bn' ? 'প্রিমিয়াম শেখার যাত্রা' : 'PREMIUM JOURNEY'}</div>
              <h1>{active === 'home' ? t.greeting : nav.find(n => n.id === active)?.label}</h1>
              <p>{active === 'home' ? t.sub : (lang === 'bn' ? 'সবকিছু এক জায়গায়।' : 'Everything in one place.')}</p>
            </div>
            <button className="ai-fab" onClick={() => setAiOpen(true)}>
              <Bot size={20} /><span>{t.askAi}</span>
            </button>
          </section>

          <section className="search-panel">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label="Search" />
            {query && (
              <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear">
                <X size={15} />
              </button>
            )}
          </section>

          <section className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon purple"><Target size={18} /></div>
              <span>{t.today}</span>
              <strong>৩৫ <small>/ ৪৫</small></strong>
              <div className="progress-track"><div className="progress-fill purple-fill" style={{ width: '78%' }} /></div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon orange"><Clock3 size={18} /></div>
              <span>{t.minutes}</span>
              <strong>১২৮</strong>
              <em className="positive">+১৮%</em>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon pink"><Sparkles size={18} /></div>
              <span>{t.streak}</span>
              <strong>৭ <small>{lang === 'bn' ? 'দিন' : 'days'}</small></strong>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon green"><Trophy size={18} /></div>
              <span>{t.completed}</span>
              <strong>{completed.length + 24} <small>/ ৪০</small></strong>
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <h2>{query ? (lang === 'bn' ? 'সার্চ ফলাফল' : 'Search results') : t.continue}</h2>
                <p>{lang === 'bn' ? 'যেখানে শেষ করেছিলে সেখান থেকে' : 'Pick up where you left off'}</p>
              </div>
              <button className="text-link" onClick={() => { setActive('learn'); setFilter('all') }}>
                {t.seeAll}<ArrowRight size={15} />
              </button>
            </div>
            <div className="course-grid">
              {courses.slice(0, 2).map(c => (
                <CourseCard
                  key={c.id}
                  course={c}
                  lang={lang}
                  saved={saved.includes(c.id)}
                  onSave={() => setSaved(o => o.includes(c.id) ? o.filter(x => x !== c.id) : [...o, c.id])}
                  onStart={() => startCourse(c)}
                  t={t}
                />
              ))}
              {courses.length === 0 && (
                <div className="empty-state">
                  <Search size={26} />
                  <strong>{t.noResults}</strong>
                </div>
              )}
            </div>
          </section>

          <section className="section-block lower-grid">
            <div className="recommend-panel glass">
              <div className="section-heading compact">
                <div><h2>{t.recommended}</h2></div>
              </div>
              <div className="filter-row">
                {[
                  { id: 'all', label: t.all },
                  { id: 'গণিত', label: t.math },
                  { id: 'বিজ্ঞান', label: t.science },
                  { id: 'ইংরেজি', label: t.english },
                  { id: 'সমাজবিজ্ঞান', label: t.social },
                ].map(f => (
                  <button
                    key={f.id}
                    className={`filter-chip ${filter === f.id ? 'selected' : ''}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="mini-course-list">
                {courses.slice(0, 4).map(c => (
                  <button key={c.id} className="mini-course" onClick={() => startCourse(c)}>
                    <div className={`mini-icon ${c.color}`}>{c.icon}</div>
                    <div className="mini-info">
                      <b>{c.title}</b>
                      <span>{c.grade}</span>
                    </div>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            </div>

            <div className="plan-panel glass">
              <div className="section-heading compact">
                <div><h2>{t.todayPlan}</h2></div>
              </div>
              <div className="task-list">
                {[
                  { id: 'a', label: t.task1 },
                  { id: 'b', label: t.task2 },
                  { id: 'c', label: t.task3 },
                ].map(task => (
                  <label key={task.id} className={`task-row ${done.includes(task.id) ? 'task-done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={done.includes(task.id)}
                      onChange={() =>
                        setDone(o =>
                          o.includes(task.id) ? o.filter(x => x !== task.id) : [...o, task.id]
                        )
                      }
                    />
                    <span className="custom-check"><CheckCircle2 size={16} /></span>
                    <span className="task-label">{task.label}</span>
                  </label>
                ))}
              </div>
              <div className="plan-footer">
                <span>{done.length}/3</span>
                <div className="progress-track">
                  <div className="progress-fill purple-fill" style={{ width: `${(done.length / 3) * 100}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section className="quick-actions">
            <div>
              <h2>{t.quick}</h2>
              <p>{lang === 'bn' ? 'এক ট্যাপে দরকারি জায়গায়' : 'Jump into what you need'}</p>
            </div>
            <button onClick={() => toast(lang === 'bn' ? 'কুইজ শিগগিরই আসছে' : 'Quiz coming soon')}>
              <span className="quick-icon orange"><Target size={18} /></span>
              <b>{t.quiz}</b>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => { setActive('library'); toast(lang === 'bn' ? 'লাইব্রেরি খোলা হয়েছে' : 'Library opened') }}>
              <span className="quick-icon blue"><Bookmark size={18} /></span>
              <b>{t.notes}</b>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => toast(lang === 'bn' ? 'সাপ্তাহিক প্ল্যান ডেমো' : 'Weekly plan demo')}>
              <span className="quick-icon green"><Activity size={18} /></span>
              <b>{t.plan}</b>
              <ArrowRight size={15} />
            </button>
          </section>

          <footer className="page-footer">
            <span>© 2026 পাঠশালা</span>
            <span>✓ Privacy first</span>
          </footer>
        </div>
      </main>

      {aiOpen && (
        <div className="ai-overlay" onClick={() => setAiOpen(false)}>
          <div className="ai-sheet" onClick={e => e.stopPropagation()}>
            <div className="ai-head">
              <Bot size={20} />
              <b>{t.aiTutor}</b>
              <button onClick={() => setAiOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <p className="ai-hint">{t.aiHint}</p>
            {aiAnswer && (
              <div className="ai-answer" style={{
                background: 'var(--line)',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                fontSize: 14,
                lineHeight: 1.5,
                maxHeight: 180,
                overflow: 'auto'
              }}>
                {aiAnswer}
              </div>
            )}
            <div className="ai-input-row">
              <input
                value={aiQ}
                onChange={e => setAiQ(e.target.value)}
                placeholder={t.aiPlaceholder}
                onKeyDown={e => e.key === 'Enter' && askAI()}
                disabled={aiLoading}
              />
              <button onClick={askAI} disabled={aiLoading || !aiQ.trim()}>
                {aiLoading ? '...' : <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={16} />
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={14} /></button>
        </div>
      )}
    </div>
  )
}

function CourseCard({
  course, lang, saved, onSave, onStart, t
}: {
  course: Course
  lang: 'bn' | 'en'
  saved: boolean
  onSave: () => void
  onStart: () => void
  t: typeof bn
}) {
  return (
    <article className="course-card glass">
      <div className={`course-art ${course.color}`}>
        <span className="course-subject">{course.subject}</span>
        <span className="course-symbol">{course.icon}</span>
        <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={onSave} aria-label="Save">
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="course-body">
        <div className="course-meta">
          <span>{course.grade}</span>·
          <span>{course.lessons} {lang === 'bn' ? 'পাঠ' : 'lessons'}</span>
        </div>
        <h3>{course.title}</h3>
        <div className="course-progress-row">
          <span>{course.progress}%</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${
              course.color === 'green' ? 'green-fill' :
              course.color === 'orange' ? 'orange-fill' : 'purple-fill'
            }`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <button className="course-cta" onClick={onStart}>
          {course.progress > 0 ? t.resume : t.start}
          <Play size={13} fill="currentColor" />
        </button>
      </div>
    </article>
  )
}
