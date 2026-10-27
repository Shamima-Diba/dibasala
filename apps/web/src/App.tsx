import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, supabaseUrl, supabasePublishableKey } from './lib/supabase'
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, BookOpen, Bookmark,
  Bot, CheckCircle2, Clock3, Compass, GraduationCap, Home, Languages,
  Menu, Moon, Play, Search, Sparkles, Sun, Target, TrendingUp, Trophy, CreditCard,
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
  slug: string
  dbId?: string
}

const COURSES: Course[] = [
  { id: 1, slug: 'algebra-foundations', title: 'গণিত: বীজগণিতের ভিত্তি', subject: 'গণিত', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'violet', icon: '∑', duration: '১০ মিনিট' },
  { id: 2, slug: 'force-and-motion', title: 'পদার্থবিজ্ঞান: বল ও গতি', subject: 'বিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'blue', icon: '⚛', duration: '১০ মিনিট' },
  { id: 3, slug: 'english-grammar-essentials', title: 'ইংরেজি Grammar Essentials', subject: 'ইংরেজি', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'orange', icon: 'Aa', duration: '১০ মিনিট' },
  { id: 4, slug: 'bangladesh-world-identity', title: 'বাংলাদেশ ও বিশ্বপরিচয়', subject: 'সমাজবিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'green', icon: '🌏', duration: '১০ মিনিট' },
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

type Lesson = { id: string; course_id: string; title_bn: string; title_en: string | null; body_markdown: string }

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
  const [catalog, setCatalog] = useState<Course[]>(supabase ? [] : COURSES)
  const [saved, setSaved] = useState<number[]>(() => readState('dibasala-saved', []))
  const [done, setDone] = useState<string[]>(() => readState('dibasala-tasks', []))
  const [completed, setCompleted] = useState<number[]>(() => readState('dibasala-completed', []))
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [lessonDoneIds, setLessonDoneIds] = useState<string[]>([])
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState('')
  const [notice, setNotice] = useState('')
  const [aiOpen, setAiOpen] = useState(false)
  const [aiQ, setAiQ] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAnswer, setAiAnswer] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<{ status: string; current_period_end: string | null } | null>(null)
  const [billingBusy, setBillingBusy] = useState(false)
  const [billingError, setBillingError] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [codeBusy, setCodeBusy] = useState(false)

  const t = lang === 'bn' ? bn : en

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setAuthError(error.message)
      setUserEmail(data.session?.user.email ?? null)
      setUserId(data.session?.user.id ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null)
      setUserId(session?.user.id ?? null)
      setAuthError('')
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client) return
    let cancelled = false
    const loadCatalog = async () => {
      const { data: courseRows, error: courseError } = await client
        .from('courses')
        .select('id, slug, title_bn, subject, grade_level')
        .eq('status', 'published')
        .order('created_at', { ascending: true })
      if (cancelled) return
      if (courseError || !courseRows) {
        setCatalog([])
        setNotice('কোর্স ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।')
        return
      }
      const { data: lessonRows, error: lessonError } = await client
        .from('lessons')
        .select('id, course_id')
        .eq('status', 'published')
      if (cancelled) return
      if (lessonError || !lessonRows) {
        setCatalog([])
        setNotice('পাঠের ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।')
        return
      }
      const mapped = courseRows.flatMap(row => {
        const template = COURSES.find(course => course.slug === row.slug)
        if (!template) return []
        return [{
          ...template,
          dbId: row.id,
          title: row.title_bn,
          subject: row.subject,
          grade: `${row.grade_level}ম শ্রেণি`,
          lessons: lessonRows.filter(lesson => lesson.course_id === row.id).length,
          progress: 0,
        }]
      })
      setCatalog(mapped)
    }
    void loadCatalog()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!userId) {
      setSaved(readState('dibasala-saved', []))
      setDone(readState('dibasala-tasks', []))
      setCompleted(readState('dibasala-completed', []))
      return
    }
    const client = supabase
    if (!client || !catalog.length || !catalog.every(course => course.dbId)) return
    let cancelled = false
    const loadLearnerState = async () => {
      const [{ data: bookmarks, error: bookmarkError }, { data: progress, error: progressError }, { data: checklist, error: checklistError }] = await Promise.all([
        client.from('bookmarks').select('course_id').eq('user_id', userId),
        client.from('course_progress').select('course_id, progress_percent').eq('user_id', userId),
        client.from('learner_checklist').select('task_key, completed').eq('user_id', userId),
      ])
      if (cancelled) return
      const failed = bookmarkError || progressError || checklistError
      if (failed) {
        setNotice('আপনার শেখার অগ্রগতি লোড হয়নি। আবার সাইন ইন করে চেষ্টা করুন।')
        return
      }
      const idsFor = (dbId: string) => catalog.find(course => course.dbId === dbId)?.id
      setSaved((bookmarks ?? []).map(row => idsFor(row.course_id)).filter((id): id is number => id !== undefined))
      const finished = (progress ?? []).filter(row => row.progress_percent >= 100).map(row => idsFor(row.course_id)).filter((id): id is number => id !== undefined)
      setCompleted(finished)
      setCatalog(old => old.map(course => {
        const row = (progress ?? []).find(item => item.course_id === course.dbId)
        return row ? { ...course, progress: row.progress_percent } : { ...course, progress: 0 }
      }))
      setDone((checklist ?? []).filter(row => row.completed).map(row => row.task_key))
    }
    void loadLearnerState()
    return () => { cancelled = true }
  }, [userId, catalog.length, catalog.map(course => course.dbId).join(',')])

  useEffect(() => {
    if (userId) return
    writeState('dibasala-saved', saved)
  }, [saved, userId])
  useEffect(() => {
    if (userId) return
    writeState('dibasala-tasks', done)
  }, [done, userId])
  useEffect(() => {
    if (userId) return
    writeState('dibasala-completed', completed)
  }, [completed, userId])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const courses = useMemo(() => {
    return catalog.map(c =>
      completed.includes(c.id) ? { ...c, progress: 100 } : c
    ).filter(c => {
      const s = query.trim().toLowerCase()
      const matchQ = !s || `${c.title} ${c.subject} ${c.grade}`.toLowerCase().includes(s)
      const matchF = filter === 'all' || c.subject === filter
      return matchQ && matchF
    })
  }, [catalog, query, filter, completed])

  const nav = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'learn', label: t.learn, icon: Compass },
    { id: 'library', label: t.library, icon: BookOpen },
    { id: 'progress', label: t.progress, icon: TrendingUp },
    { id: 'offline', label: t.offline, icon: ArrowDownToLine },
    { id: 'pricing', label: lang === 'bn' ? 'প্রিমিয়াম' : 'Premium', icon: CreditCard },
  ]

  const toast = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3200)
  }

  const startCourse = async (c: Course) => {
    if (!supabase || !c.dbId) {
      toast(lang === 'bn' ? 'লাইভ কোর্স ডেটা পাওয়া যায়নি।' : 'Live course data is unavailable.')
      return
    }
    setCourseLoading(true)
    setCourseError('')
    setSelectedLesson(null)
    setLessonDoneIds([])
    try {
      if (userId) {
        const { data: enrollment, error: enrollmentLookupError } = await supabase.from('enrollments')
          .select('course_id').eq('user_id', userId).eq('course_id', c.dbId).maybeSingle()
        if (enrollmentLookupError) throw enrollmentLookupError
        if (!enrollment) {
          const { error: enrollmentInsertError } = await supabase.from('enrollments')
            .insert({ user_id: userId, course_id: c.dbId })
          if (enrollmentInsertError) throw enrollmentInsertError
        }
      }
      const { data: lessons, error: lessonsError } = await supabase.from('lessons')
        .select('id, course_id, title_bn, title_en, body_markdown')
        .eq('course_id', c.dbId)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
      if (lessonsError) throw lessonsError
      setCourseLessons(lessons ?? [])
      if (userId && lessons?.length) {
        const { data: progressRows, error: progressError } = await supabase.from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', userId)
          .in('lesson_id', lessons.map(lesson => lesson.id))
        if (progressError) throw progressError
        setLessonDoneIds((progressRows ?? []).map(row => row.lesson_id))
      }
      setSelectedCourse(c)
    } catch (error) {
      setCourseError(error instanceof Error ? error.message : 'Course could not be opened.')
    } finally {
      setCourseLoading(false)
    }
  }

  const markLessonComplete = async () => {
    if (!selectedCourse?.dbId || !selectedLesson || !supabase) return
    if (!userId) {
      setAuthError(lang === 'bn' ? 'অগ্রগতি সংরক্ষণ করতে আগে সাইন ইন করুন।' : 'Sign in to save your progress.')
      setAuthMode('signin')
      setAuthOpen(true)
      return
    }
    try {
      const { error: lessonError } = await supabase.from('lesson_progress').upsert({
        user_id: userId,
        lesson_id: selectedLesson.id,
        completed_at: new Date().toISOString(),
        seconds_spent: 0,
      }, { onConflict: 'user_id,lesson_id' })
      if (lessonError) throw lessonError
      const nextDone = lessonDoneIds.includes(selectedLesson.id) ? lessonDoneIds : [...lessonDoneIds, selectedLesson.id]
      setLessonDoneIds(nextDone)
      const progressPercent = Math.round((nextDone.length / Math.max(courseLessons.length, 1)) * 100)
      const { error: courseProgressError } = await supabase.from('course_progress').upsert({
        user_id: userId,
        course_id: selectedCourse.dbId,
        progress_percent: progressPercent,
        completed_at: progressPercent === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' })
      if (courseProgressError) throw courseProgressError
      setCatalog(old => old.map(course => course.id === selectedCourse.id ? { ...course, progress: progressPercent } : course))
      if (progressPercent === 100) setCompleted(old => old.includes(selectedCourse.id) ? old : [...old, selectedCourse.id])
      toast(lang === 'bn' ? 'পাঠের অগ্রগতি সংরক্ষণ হয়েছে' : 'Lesson progress saved')
    } catch (error) {
      setCourseError(error instanceof Error ? error.message : 'Progress could not be saved.')
    }
  }

  const toggleBookmark = async (c: Course) => {
    const shouldSave = !saved.includes(c.id)
    if (userId && supabase && c.dbId) {
      const result = shouldSave
        ? await supabase.from('bookmarks').insert({ user_id: userId, course_id: c.dbId })
        : await supabase.from('bookmarks').delete().eq('user_id', userId).eq('course_id', c.dbId)
      if (result.error) {
        toast(lang === 'bn' ? 'বুকমার্ক সংরক্ষণ হয়নি' : 'Bookmark could not be saved')
        return
      }
    }
    setSaved(old => shouldSave ? [...old.filter(id => id !== c.id), c.id] : old.filter(id => id !== c.id))
  }

  const toggleChecklist = async (taskId: string) => {
    const checked = !done.includes(taskId)
    if (userId && supabase) {
      const { error } = await supabase.from('learner_checklist').upsert({
        user_id: userId, task_key: taskId, completed: checked, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,task_key' })
      if (error) {
        toast(lang === 'bn' ? 'চেকলিস্ট সংরক্ষণ হয়নি' : 'Checklist could not be saved')
        return
      }
    }
    setDone(old => checked ? [...old.filter(id => id !== taskId), taskId] : old.filter(id => id !== taskId))
  }

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError('')
    if (!supabase) {
      setAuthError(lang === 'bn' ? 'লাইভ Supabase কনফিগারেশন পাওয়া যায়নি।' : 'Supabase is not configured for this deployment.')
      return
    }
    setAuthBusy(true)
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        if (!data.session) {
          setAuthError(lang === 'bn' ? 'অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল যাচাই করে সাইন ইন করুন।' : 'Account created. Verify your email, then sign in.')
          setAuthMode('signin')
        } else {
          setAuthOpen(false)
          toast(lang === 'bn' ? 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে' : 'Account created successfully')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword })
        if (error) throw error
        setAuthOpen(false)
        setAuthPassword('')
        toast(lang === 'bn' ? 'সাইন ইন সফল হয়েছে' : 'Signed in successfully')
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : (lang === 'bn' ? 'সাইন ইন ব্যর্থ হয়েছে' : 'Authentication failed'))
    } finally {
      setAuthBusy(false)
    }
  }

  useEffect(() => {
    if (!supabase || !userId) { setSubscription(null); return }
    let cancelled = false
    void supabase.from('subscriptions')
      .select('status,current_period_end')
      .eq('user_id', userId)
      .in('status', ['active','past_due','pending'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled) setSubscription(data) })
    return () => { cancelled = true }
  }, [userId])

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('billing')
    if (result === 'success') toast(lang === 'bn' ? 'পেমেন্ট যাচাই হচ্ছে। সাবস্ক্রিপশন স্ট্যাটাস কিছুক্ষণ পর দেখুন।' : 'Payment returned. Your subscription status is being verified.')
    if (result === 'failed' || result === 'cancelled' || result === 'verification_pending') {
      setBillingError(lang === 'bn' ? 'পেমেন্ট এখনও নিশ্চিত হয়নি। সাবস্ক্রিপশন সক্রিয় না হলে আবার চেষ্টা করুন বা সহায়তায় যোগাযোগ করুন।' : 'Payment is not confirmed yet. Retry or contact support if the status does not update.')
    }
  }, [])

  const startCheckout = async (planSlug: 'premium_monthly' | 'premium_annual') => {
    setBillingError('')
    if (!supabase) { setBillingError('Supabase configuration is missing.'); return }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setAuthMode('signin')
      setAuthError(lang === 'bn' ? 'Premium নিতে আগে সাইন ইন করুন।' : 'Please sign in before upgrading.')
      setAuthOpen(true)
      return
    }
    setBillingBusy(true)
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/billing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planSlug }),
      })
      const payload = await response.json()
      if (!response.ok || typeof payload.checkoutUrl !== 'string') throw new Error(payload.error || 'Checkout could not be started.')
      window.location.assign(payload.checkoutUrl)
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : 'Checkout could not be started.')
    } finally {
      setBillingBusy(false)
    }
  }

  const redeemAccessCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBillingError('')
    if (!supabase) { setBillingError('Supabase configuration is missing.'); return }
    const code = accessCode.trim().toUpperCase()
    if (!code) { setBillingError(lang === 'bn' ? 'অ্যাক্সেস কোড লিখুন।' : 'Enter your access code.'); return }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setAuthMode('signin')
      setAuthError(lang === 'bn' ? 'কোড ব্যবহার করতে আগে সাইন ইন করুন।' : 'Please sign in to redeem a code.')
      setAuthOpen(true)
      return
    }
    setCodeBusy(true)
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/premium-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey, Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ code }),
      })
      const payload = await response.json()
      if (!response.ok || payload.ok !== true) throw new Error(payload.error || 'Code could not be redeemed.')
      setAccessCode('')
      setBillingError('')
      toast(lang === 'bn' ? 'Premium সফলভাবে সক্রিয় হয়েছে!' : 'Premium activated successfully!')
      const { data: row } = await supabase.from('subscriptions').select('status,current_period_end').eq('user_id', session.user.id).eq('status', 'active').order('current_period_end', { ascending: false }).limit(1).maybeSingle()
      if (row) setSubscription({ status: row.status, current_period_end: row.current_period_end })
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : 'Code could not be redeemed.')
    } finally {
      setCodeBusy(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) toast(error.message)
    else toast(lang === 'bn' ? 'সাইন আউট হয়েছে' : 'Signed out')
  }

  const askAI = async () => {
    if (!aiQ.trim()) return
    if (!supabase) {
      setAiAnswer(lang === 'bn' ? 'AI টিউটর চালু করতে Supabase environment সেট করুন।' : 'Configure Supabase environment to enable AI Tutor.')
      return
    }
    setAiLoading(true)
    setAiAnswer('')
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session?.access_token) {
        setAiAnswer(lang === 'bn' ? 'AI টিউটর ব্যবহারের আগে সাইন ইন করুন।' : 'Please sign in before using AI Tutor.')
        setAuthOpen(true)
        return
      }
      const res = await fetch(`${supabaseUrl}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ question: aiQ.trim() }),
      })
      if (!res.ok) {
        let message = `Request failed (${res.status})`
        try {
          const payload = await res.json()
          if (typeof payload.error === 'string') message = payload.error
        } catch { /* keep generic status */ }
        throw new Error(message)
      }
      const data = await res.json()
      setAiAnswer(data.answer || (lang === 'bn' ? 'কোনো উত্তর পাওয়া যায়নি।' : 'No answer returned.'))
    } catch (error) {
      setAiAnswer((lang === 'bn' ? 'সমস্যা: ' : 'Error: ') + (error instanceof Error ? error.message : 'Unknown error'))
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
            <strong>DIBASALA<span className="brand-dot">.</span></strong>
            <small>LEARNING PLATFORM</small>
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
            {userEmail ? (
              <div className="account-actions" title={userEmail}>
                <span className="account-email">{userEmail}</span>
                <button className="auth-trigger" onClick={signOut}>{lang === 'bn' ? 'সাইন আউট' : 'Sign out'}</button>
              </div>
            ) : (
              <button className="auth-trigger" onClick={() => { setAuthError(''); setAuthOpen(true) }}>
                {lang === 'bn' ? 'সাইন ইন' : 'Sign in'}
              </button>
            )}
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

          <div style={{ display: active === 'home' ? 'contents' : 'none' }}>
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
              <strong>{completed.length} <small>/ {catalog.length}</small></strong>
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
                  onSave={() => { void toggleBookmark(c) }}
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
                      onChange={() => { void toggleChecklist(task.id) }}
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
            <span>© 2026 DIBASALA</span>
            <span>✓ Privacy first</span>
          </footer>
          </div>
          {active === 'learn' && (
            <section className="section-block">
              <div className="section-heading">
                <div><h2>{lang === 'bn' ? 'সব কোর্স' : 'All courses'}</h2><p>{lang === 'bn' ? 'ব্যাকএন্ড থেকে প্রকাশিত কোর্স' : 'Published courses from the backend'}</p></div>
              </div>
              <div className="course-grid">
                {courses.map(c => <CourseCard key={c.id} course={c} lang={lang} saved={saved.includes(c.id)} onSave={() => { void toggleBookmark(c) }} onStart={() => startCourse(c)} t={t} />)}
                {courses.length === 0 && <div className="empty-state"><BookOpen size={26} /><strong>{t.noResults}</strong></div>}
              </div>
            </section>
          )}
          {active === 'library' && (
            <section className="section-block">
              <div className="section-heading"><div><h2>{lang === 'bn' ? 'আমার লাইব্রেরি' : 'My library'}</h2><p>{lang === 'bn' ? 'আপনার সংরক্ষিত কোর্স' : 'Your bookmarked courses'}</p></div></div>
              <div className="course-grid">
                {catalog.filter(c => saved.includes(c.id)).map(c => <CourseCard key={c.id} course={c} lang={lang} saved={true} onSave={() => { void toggleBookmark(c) }} onStart={() => startCourse(c)} t={t} />)}
                {!catalog.some(c => saved.includes(c.id)) && <div className="empty-state"><Bookmark size={26} /><strong>{lang === 'bn' ? 'এখনও কোনো কোর্স সংরক্ষণ করা হয়নি' : 'No bookmarked courses yet'}</strong><button className="text-link" onClick={() => setActive('learn')}>{lang === 'bn' ? 'কোর্স দেখুন' : 'Browse courses'} <ArrowRight size={15} /></button></div>}
              </div>
            </section>
          )}
          {active === 'progress' && (
            <section className="section-block">
              <div className="section-heading"><div><h2>{lang === 'bn' ? 'আমার অগ্রগতি' : 'My progress'}</h2><p>{lang === 'bn' ? 'সাইন ইন করলে অগ্রগতি অ্যাকাউন্টে সংরক্ষিত থাকবে' : 'Sign in to keep progress saved to your account'}</p></div></div>
              <div className="mini-course-list">
                {catalog.map(c => <div key={c.id} className="mini-course"><div className={`mini-icon ${c.color}`}>{c.progress >= 100 ? '✓' : c.progress + '%'}</div><div className="mini-info"><b>{c.title}</b><span>{lang === 'bn' ? `অগ্রগতি: ${c.progress}%` : `Progress: ${c.progress}%`}</span></div><button className="text-link" onClick={() => startCourse(c)}>{lang === 'bn' ? 'চালিয়ে যান' : 'Continue'} <ArrowRight size={15} /></button></div>)}
              </div>
              {!userId && <p className="ai-hint">{lang === 'bn' ? 'এই ডিভাইসের বাইরে অগ্রগতি সিঙ্ক করতে সাইন ইন করুন।' : 'Sign in to sync progress across devices.'}</p>}
            </section>
          )}
          {active === 'pricing' && (
            <section className="section-block">
              <div className="section-heading"><div><h2>DIBASALA Premium / Pro</h2><p>{lang === 'bn' ? 'পেমেন্ট গেটওয়ে প্রস্তুত না হওয়া পর্যন্ত নির্ধারিত অ্যাক্সেস কোড দিয়ে Premium চালু করুন।' : 'Use an access code assigned by the DIBASALA team while payment checkout is paused.'}</p></div></div>
              {subscription && <div className="recommend-panel glass" style={{ padding: 18, marginBottom: 18 }}>
                <strong>{lang === 'bn' ? 'আপনার অ্যাক্সেস' : 'Your access'}: {subscription.status}</strong>
                <p>{subscription.current_period_end ? (lang === 'bn' ? 'মেয়াদ শেষ: ' : 'Access ends: ') + new Date(subscription.current_period_end).toLocaleDateString() : (lang === 'bn' ? 'কোনো সক্রিয় অ্যাক্সেস নেই।' : 'No active access yet.')}</p>
              </div>}
              <div className="course-grid">
                <article className="course-card glass" style={{ padding: 22, maxWidth: 680 }}>
                  <div className="eyebrow"><Sparkles size={15} />{lang === 'bn' ? 'প্রিমিয়াম অ্যাক্সেস কোড' : 'PREMIUM ACCESS CODE'}</div>
                  <h3 style={{ margin: '14px 0 8px' }}>{lang === 'bn' ? 'আপনার কোড দিয়ে Premium / Pro চালু করুন' : 'Activate Premium / Pro with your code'}</h3>
                  <p>{lang === 'bn' ? 'DIBASALA টিমের দেওয়া কোড ব্যবহার করুন। কোডটি আপনার অ্যাকাউন্টে নির্ধারিত মেয়াদের অ্যাক্সেস সক্রিয় করবে।' : 'Enter a code provided by the DIBASALA team. Each code activates access for its assigned duration.'}</p>
                  <form onSubmit={(event) => void redeemAccessCode(event)} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                    <input aria-label={lang === 'bn' ? 'অ্যাক্সেস কোড' : 'Access code'} value={accessCode} onChange={event => setAccessCode(event.target.value.toUpperCase())} placeholder={lang === 'bn' ? 'আপনার অ্যাক্সেস কোড লিখুন' : 'Enter access code'} autoComplete="off" maxLength={100} required />
                    <button className="auth-submit" disabled={codeBusy}>{codeBusy ? (lang === 'bn' ? 'যাচাই হচ্ছে…' : 'Verifying…') : (lang === 'bn' ? 'কোড যাচাই ও সক্রিয় করুন' : 'Verify and activate')}</button>
                  </form>
                  {!userId && <p className="ai-hint">{lang === 'bn' ? 'কোড ব্যবহারের আগে সাইন ইন বা অ্যাকাউন্ট তৈরি করুন।' : 'Sign in or create an account before redeeming a code.'}</p>}
                </article>
              </div>
              {billingError && <p className="auth-error" role="alert">{billingError}</p>}
              <p className="ai-hint">{lang === 'bn' ? 'এই মুহূর্তে অনলাইন পেমেন্ট checkout বন্ধ রাখা হয়েছে; শেখার অন্যান্য ফিচার ব্যবহার করা যাবে। অ্যাক্সেস কোড শুধুমাত্র সার্ভারে যাচাই হয়। কোড তৈরির ও মেয়াদ/ব্যবহারসীমা নির্ধারণের নিয়ন্ত্রণ DIBASALA অ্যাডমিনের হাতে থাকবে।' : 'Online payment checkout is paused for now; other learning features remain available. Codes are validated server-side and managed by DIBASALA administrators with configurable duration and redemption limits.'}</p>
            </section>
          )}
          {active === 'offline' && (
            <section className="section-block">
              <div className="section-heading"><div><h2>{lang === 'bn' ? 'অফলাইন শেখা' : 'Offline learning'}</h2><p>{lang === 'bn' ? 'অফলাইনে পড়ার জন্য পাঠ ডিভাইসে সংরক্ষণ করার সুবিধা এখনও প্রস্তুত নয়।' : 'Saving lessons for offline reading is not enabled yet.'}</p></div></div>
              <div className="recommend-panel glass" style={{ padding: 24 }}>
                <WifiOff size={28} />
                <h3>{lang === 'bn' ? 'ইন্টারনেট সংযোগ প্রয়োজন' : 'Internet connection required'}</h3>
                <p>{lang === 'bn' ? 'বর্তমানে কোর্স ও পাঠ সরাসরি DIBASALA ব্যাকএন্ড থেকে লোড হয়। অফলাইন ক্যাশিং পরবর্তী কাজের অংশ।' : 'Courses and lessons currently load from the DIBASALA backend. Offline caching remains a follow-up feature.'}</p>
                <button className="auth-submit" onClick={() => setActive('learn')}>{lang === 'bn' ? 'অনলাইন কোর্স দেখুন' : 'Browse online courses'}</button>
              </div>
            </section>
          )}
        </div>
      </main>

      {authOpen && (
        <div className="ai-overlay" onClick={() => setAuthOpen(false)}>
          <section className="auth-sheet" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={event => event.stopPropagation()}>
            <div className="ai-head">
              <GraduationCap size={22} />
              <b id="auth-title">{authMode === 'signin' ? (lang === 'bn' ? 'শিক্ষার্থী সাইন ইন' : 'Learner sign in') : (lang === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'Create account')}</b>
              <button type="button" onClick={() => setAuthOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <p className="ai-hint">{lang === 'bn' ? 'আপনার অ্যাকাউন্ট দিয়ে ব্যক্তিগত সেশন শুরু করুন।' : 'Use your account to start a personal session.'}</p>
            <form className="auth-form" onSubmit={submitAuth}>
              <label>{lang === 'bn' ? 'ইমেইল' : 'Email'}
                <input type="email" autoComplete="email" required value={authEmail} onChange={event => setAuthEmail(event.target.value)} />
              </label>
              <label>{lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                <input type="password" autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required value={authPassword} onChange={event => setAuthPassword(event.target.value)} />
              </label>
              {authError && <p className="auth-error" role="alert">{authError}</p>}
              <button className="auth-submit" type="submit" disabled={authBusy}>{authBusy ? (lang === 'bn' ? 'অপেক্ষা করুন…' : 'Please wait…') : authMode === 'signin' ? (lang === 'bn' ? 'সাইন ইন' : 'Sign in') : (lang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create account')}</button>
            </form>
            <button className="auth-switch" type="button" onClick={() => { setAuthMode(mode => mode === 'signin' ? 'signup' : 'signin'); setAuthError('') }}>
              {authMode === 'signin' ? (lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account') : (lang === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে? সাইন ইন' : 'Already have an account? Sign in')}
            </button>
            {!supabase && <p className="auth-error">{lang === 'bn' ? 'DIBASALA backend-এ সংযোগ স্থাপন করা যায়নি। Supabase configuration ও network status পরীক্ষা করুন।' : 'DIBASALA could not connect to its backend. Check Supabase configuration and network status.'}</p>}
          </section>
        </div>
      )}

      {selectedCourse && (
        <div className="ai-overlay" onClick={() => { setSelectedCourse(null); setSelectedLesson(null) }}>
          <section className="ai-sheet" role="dialog" aria-modal="true" aria-label={selectedCourse.title} onClick={event => event.stopPropagation()}>
            <div className="ai-head">
              <BookOpen size={20} />
              <b>{selectedCourse.title}</b>
              <button onClick={() => { setSelectedCourse(null); setSelectedLesson(null) }} aria-label="Close"><X size={18} /></button>
            </div>
            {courseLoading && <p className="ai-hint">{lang === 'bn' ? 'পাঠ লোড হচ্ছে…' : 'Loading lessons…'}</p>}
            {courseError && <p className="auth-error" role="alert">{courseError}</p>}
            {!courseLoading && selectedLesson && (
              <div>
                <button className="auth-switch" onClick={() => setSelectedLesson(null)}>{lang === 'bn' ? '← সব পাঠ' : '← All lessons'}</button>
                <h3>{selectedLesson.title_bn}</h3>
                <div className="ai-answer" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, maxHeight: 300, overflow: 'auto' }}>{selectedLesson.body_markdown}</div>
                {lessonDoneIds.includes(selectedLesson.id) ? (
                  <p className="ai-hint">{lang === 'bn' ? 'এই পাঠটি সম্পন্ন হয়েছে ✓' : 'Lesson completed ✓'}</p>
                ) : (
                  <button className="auth-submit" onClick={() => { void markLessonComplete() }}>{lang === 'bn' ? 'পাঠ সম্পন্ন করেছি' : 'Mark lesson complete'}</button>
                )}
                {!userId && <p className="ai-hint">{lang === 'bn' ? 'অগ্রগতি সংরক্ষণ করতে সাইন ইন করুন।' : 'Sign in to save progress.'}</p>}
              </div>
            )}
            {!courseLoading && !selectedLesson && (
              <div>
                {courseLessons.length === 0 && <p className="ai-hint">{lang === 'bn' ? 'এখনও কোনো প্রকাশিত পাঠ নেই।' : 'No published lessons yet.'}</p>}
                {courseLessons.map((lesson, index) => (
                  <button key={lesson.id} className="mini-course" style={{ width: '100%', textAlign: 'left' }} onClick={() => setSelectedLesson(lesson)}>
                    <div className="mini-icon blue">{lessonDoneIds.includes(lesson.id) ? '✓' : index + 1}</div>
                    <div className="mini-info"><b>{lesson.title_bn}</b><span>{lessonDoneIds.includes(lesson.id) ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : (lang === 'bn' ? 'পাঠ শুরু করুন' : 'Open lesson')}</span></div>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

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
