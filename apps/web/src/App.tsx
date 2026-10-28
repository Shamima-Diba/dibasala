import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './lib/supabase'
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
  slug: string
  dbId?: string
}

const COURSES: Course[] = [
  { id: 1, slug: 'algebra-foundations', title: 'গণিত: বীজগণিতের ভিত্তি', subject: 'গণিত', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'violet', icon: '∑', duration: '১০ মিনিট' },
  { id: 2, slug: 'force-and-motion', title: 'SSC পদার্থবিজ্ঞান: ভৌত রাশি, গতি ও বল', subject: 'বিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 3, progress: 0, color: 'blue', icon: '⚛', duration: '৩ অধ্যায়' },
  { id: 3, slug: 'english-grammar-essentials', title: 'ইংরেজি Grammar Essentials', subject: 'ইংরেজি', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'orange', icon: 'Aa', duration: '১০ মিনিট' },
  { id: 4, slug: 'bangladesh-world-identity', title: 'বাংলাদেশ ও বিশ্বপরিচয়', subject: 'সমাজবিজ্ঞান', grade: '৯ম শ্রেণি', lessons: 1, progress: 0, color: 'green', icon: '🌏', duration: '১০ মিনিট' },
]

const bn = {
  home: 'হোম', learn: 'শিখুন', library: 'লাইব্রেরি', progress: 'অগ্রগতি', offline: 'অফলাইন',
  greeting: 'আবার স্বাগতম! 👋', sub: 'আজ একটু একটু করে এগিয়ে যাওয়াই বড় সাফল্য।',
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
type Quiz = { id: string; course_id: string; lesson_id: string | null; title_bn: string; title_en: string | null; pass_percent: number; status: string }
type QuizQuestion = { id: string; quiz_id: string; prompt_bn: string; options: { id: string; text_bn: string }[]; sort_order: number }
type QuizReview = { question_id: string; correct_option_id: string; explanation_bn: string; selected_option_id: string | null; is_correct: boolean }
type QuizResult = { attempt_id: string; correct_count: number; total_count: number; score_percent: number; passed: boolean; review: QuizReview[] }

const en = {
  home: 'Home', learn: 'Explore', library: 'Library', progress: 'Progress', offline: 'Offline',
  greeting: 'Welcome back! 👋', sub: 'Small steps every day lead to big progress.',
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
  const [displayName, setDisplayName] = useState('শিক্ষার্থী')
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizList, setQuizList] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizSubmitting, setQuizSubmitting] = useState(false)
  const [quizError, setQuizError] = useState('')

  const t = lang === 'bn' ? bn : en

  useEffect(() => {
    if (!supabase) return
    const applyUser = (user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
      setUserEmail(user?.email ?? null)
      setUserId(user?.id ?? null)
      const fullName = user?.user_metadata?.full_name
      setDisplayName(typeof fullName === 'string' && fullName.trim() ? fullName.trim() : user?.email?.split('@')[0] || 'শিক্ষার্থী')
    }
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error) setAuthError('আপনার সাইন-ইন অবস্থা যাচাই করা যায়নি।')
      applyUser(data.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null)
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
      const mapped: Course[] = courseRows.map((row, index) => {
        const subject = row.subject || 'অন্যান্য'
        const palette = subject.includes('গণিত') ? { color: 'violet', icon: '∑' }
          : subject.includes('বিজ্ঞান') || subject.includes('পদার্থ') ? { color: 'blue', icon: '⚛' }
          : subject.includes('ইংরেজি') ? { color: 'orange', icon: 'Aa' }
          : { color: 'green', icon: '📘' }
        const lessonCount = lessonRows.filter(lesson => lesson.course_id === row.id).length
        return {
          id: index + 1, dbId: row.id, slug: row.slug, title: row.title_bn,
          subject, grade: `${row.grade_level}ম শ্রেণি`, lessons: lessonCount,
          progress: 0, ...palette,
          duration: lessonCount ? `${lessonCount}টি পাঠ` : 'পাঠ শিগগিরই আসছে',
        }
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

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) toast(error.message)
    else toast(lang === 'bn' ? 'সাইন আউট হয়েছে' : 'Signed out')
  }

  const openQuizLibrary = async () => {
    if (!supabase) {
      toast(lang === 'bn' ? 'Supabase সংযোগ পাওয়া যায়নি।' : 'Supabase connection is unavailable.')
      return
    }
    setQuizOpen(true)
    setSelectedQuiz(null)
    setQuizResult(null)
    setQuizQuestions([])
    setQuizError('')
    setQuizLoading(true)
    try {
      const { data: course, error: courseError } = await supabase.from('courses')
        .select('id').eq('slug', 'force-and-motion').eq('status', 'published').maybeSingle()
      if (courseError) throw courseError
      if (!course) throw new Error(lang === 'bn' ? 'SSC পদার্থবিজ্ঞান কোর্স পাওয়া যায়নি।' : 'SSC Physics course was not found.')
      const { data, error } = await supabase.from('quizzes')
        .select('id, course_id, lesson_id, title_bn, title_en, pass_percent, status')
        .eq('course_id', course.id).eq('status', 'published').order('created_at', { ascending: true })
      if (error) throw error
      setQuizList(data ?? [])
      if (!data?.length) setQuizError(lang === 'bn' ? 'এখনও কোনো প্রকাশিত কুইজ নেই।' : 'No published quizzes yet.')
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : (lang === 'bn' ? 'কুইজ লোড হয়নি।' : 'Could not load quizzes.'))
    } finally {
      setQuizLoading(false)
    }
  }

  const startQuiz = async (quiz: Quiz) => {
    if (!supabase) return
    setSelectedQuiz(quiz)
    setQuizQuestions([])
    setQuizAnswers({})
    setQuizResult(null)
    setQuizError('')
    setQuizLoading(true)
    try {
      const { data, error } = await supabase.from('quiz_questions')
        .select('id, quiz_id, prompt_bn, options, sort_order')
        .eq('quiz_id', quiz.id).order('sort_order', { ascending: true })
      if (error) throw error
      setQuizQuestions((data ?? []) as QuizQuestion[])
      if (!data?.length) setQuizError(lang === 'bn' ? 'এই কুইজে প্রশ্ন নেই।' : 'This quiz has no questions.')
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : (lang === 'bn' ? 'প্রশ্ন লোড হয়নি।' : 'Could not load questions.'))
    } finally {
      setQuizLoading(false)
    }
  }

  const submitQuiz = async () => {
    if (!supabase || !selectedQuiz || quizSubmitting) return
    if (!userId) {
      setQuizError(lang === 'bn' ? 'ফলাফল সংরক্ষণ করতে আগে সাইন ইন করুন।' : 'Sign in first to save your result.')
      setAuthMode('signin')
      setAuthOpen(true)
      return
    }
    if (Object.keys(quizAnswers).length !== quizQuestions.length) {
      setQuizError(lang === 'bn' ? 'সব প্রশ্নের উত্তর দিন।' : 'Please answer every question.')
      return
    }
    setQuizSubmitting(true)
    setQuizError('')
    try {
      const { data, error } = await supabase.rpc('submit_quiz_attempt', {
        p_quiz_id: selectedQuiz.id,
        p_answers: quizAnswers,
      })
      if (error) throw error
      setQuizResult(data as QuizResult)
      toast(lang === 'bn' ? 'কুইজের ফলাফল সংরক্ষণ হয়েছে।' : 'Quiz result saved.')
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : (lang === 'bn' ? 'ফলাফল জমা হয়নি।' : 'Could not submit quiz.'))
    } finally {
      setQuizSubmitting(false)
    }
  }

  const askAI = async () => {
    if (!aiQ.trim()) return
    if (!supabase) {
      setAiAnswer(lang === 'bn' ? 'AI Tutor কনফিগার করা হয়নি, পরে চেষ্টা করুন।' : 'AI Tutor is not configured. Please try again later.')
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
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      if (!url || !key) throw new Error(lang === 'bn' ? 'Supabase কনফিগারেশন অসম্পূর্ণ।' : 'Supabase configuration is incomplete.')
      const res = await fetch(`${url}/functions/v1/ai-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
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
            <b>{displayName}</b>
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
              <strong>{done.length} <small>/ ৩</small></strong>
              <div className="progress-track"><div className="progress-fill purple-fill" style={{ width: `${Math.min(100, (done.length / 3) * 100)}%` }} /></div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon orange"><Clock3 size={18} /></div>
              <span>{t.minutes}</span>
              <strong>—</strong>
              <em>{lang === 'bn' ? 'সময় ট্র্যাকিং চালু হয়নি' : 'Time tracking not enabled'}</em>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon pink"><Sparkles size={18} /></div>
              <span>{t.streak}</span>
              <strong>—</strong>
              <em>{lang === 'bn' ? 'ধারাবাহিকতার তথ্য নেই' : 'Streak data unavailable'}</em>
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
            <button onClick={() => { void openQuizLibrary() }}>
              <span className="quick-icon orange"><Target size={18} /></span>
              <b>{t.quiz}</b>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => { setActive('library'); toast(lang === 'bn' ? 'লাইব্রেরি খোলা হয়েছে' : 'Library opened') }}>
              <span className="quick-icon blue"><Bookmark size={18} /></span>
              <b>{t.notes}</b>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => { setActive('progress'); toast(lang === 'bn' ? 'আপনার সংরক্ষিত অগ্রগতি দেখুন' : 'View your saved progress') }}>
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

      {quizOpen && (
        <div className="ai-overlay" onClick={() => { setQuizOpen(false); setSelectedQuiz(null) }}>
          <section className="ai-sheet" role="dialog" aria-modal="true" aria-label={lang === 'bn' ? 'SSC পদার্থবিজ্ঞান কুইজ' : 'SSC Physics quizzes'} onClick={event => event.stopPropagation()}>
            <div className="ai-head">
              <Target size={20} />
              <b>{selectedQuiz?.title_bn ?? (lang === 'bn' ? 'SSC পদার্থবিজ্ঞান কুইজ' : 'SSC Physics quizzes')}</b>
              <button onClick={() => { setQuizOpen(false); setSelectedQuiz(null) }} aria-label="Close"><X size={18} /></button>
            </div>
            {quizLoading && <p className="ai-hint">{lang === 'bn' ? 'লোড হচ্ছে…' : 'Loading…'}</p>}
            {quizError && <p className="auth-error" role="alert">{quizError}</p>}
            {!selectedQuiz && !quizLoading && quizList.map(quiz => (
              <button key={quiz.id} className="mini-course" style={{ width: '100%', textAlign: 'left' }} onClick={() => { void startQuiz(quiz) }}>
                <div className="mini-icon orange"><Target size={17} /></div>
                <div className="mini-info"><b>{quiz.title_bn}</b><span>{lang === 'bn' ? `পাস নম্বর: ${quiz.pass_percent}%` : `Pass mark: ${quiz.pass_percent}%`}</span></div>
                <ArrowRight size={15} />
              </button>
            ))}
            {selectedQuiz && !quizResult && !quizLoading && quizQuestions.map((question, index) => (
              <fieldset key={question.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 12, margin: '12px 0' }}>
                <legend style={{ padding: '0 6px', fontWeight: 700 }}>{index + 1}. {question.prompt_bn}</legend>
                <div style={{ display: 'grid', gap: 8 }}>
                  {question.options.map(option => (
                    <label key={option.id} className="task-row" style={{ cursor: 'pointer', alignItems: 'flex-start' }}>
                      <input type="radio" name={question.id} value={option.id} checked={quizAnswers[question.id] === option.id}
                        onChange={() => setQuizAnswers(old => ({ ...old, [question.id]: option.id }))} />
                      <span className="task-label">{option.id}. {option.text_bn}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            {selectedQuiz && !quizResult && !quizLoading && quizQuestions.length > 0 && (
              <button className="auth-submit" disabled={quizSubmitting} onClick={() => { void submitQuiz() }}>
                {quizSubmitting ? (lang === 'bn' ? 'জমা হচ্ছে…' : 'Submitting…') : (lang === 'bn' ? 'উত্তর জমা দিন' : 'Submit answers')}
              </button>
            )}
            {quizResult && (
              <div>
                <h3>{lang === 'bn' ? `আপনার স্কোর: ${quizResult.score_percent}%` : `Your score: ${quizResult.score_percent}%`}</h3>
                <p className="ai-hint">{lang === 'bn' ? `${quizResult.total_count}টির মধ্যে ${quizResult.correct_count}টি সঠিক। ${quizResult.passed ? 'অভিনন্দন, পাস করেছেন!' : 'আরও অনুশীলন করুন।'}` : `${quizResult.correct_count} of ${quizResult.total_count} correct. ${quizResult.passed ? 'Passed!' : 'Keep practicing.'}`}</p>
                {quizResult.review.map((item, index) => {
                  const question = quizQuestions.find(row => row.id === item.question_id)
                  const correct = question?.options.find(option => option.id === item.correct_option_id)
                  return <div key={item.question_id} className="ai-answer" style={{ margin: '10px 0', lineHeight: 1.6 }}>
                    <b>{index + 1}. {question?.prompt_bn}</b>
                    <p>{item.is_correct ? '✓ ' : '✗ '}{lang === 'bn' ? 'সঠিক উত্তর: ' : 'Correct answer: '}{item.correct_option_id}. {correct?.text_bn}</p>
                    <p>{item.explanation_bn}</p>
                  </div>
                })}
                <button className="auth-submit" onClick={() => { setSelectedQuiz(null); setQuizResult(null); setQuizQuestions([]); setQuizError('') }}>{lang === 'bn' ? 'অন্য কুইজ বেছে নিন' : 'Choose another quiz'}</button>
              </div>
            )}
            {!userId && selectedQuiz && !quizResult && <p className="ai-hint">{lang === 'bn' ? 'ফলাফল সংরক্ষণ করতে সাইন ইন করতে হবে।' : 'Sign in to save your result.'}</p>}
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
