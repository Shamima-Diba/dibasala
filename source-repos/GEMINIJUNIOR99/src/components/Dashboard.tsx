import React from 'react';
import {
  Sparkles,
  BookOpen,
  Code2,
  TrendingUp,
  Download,
  Zap,
  Cpu,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Activity,
  Flame,
  ShieldCheck,
  Layers,
  MessageSquare,
  BarChart3,
  Globe,
  Radio,
  UserCheck,
  LogIn,
  KeyRound,
  UserPlus,
  Play,
  RotateCcw
} from 'lucide-react';
import { StudentProfile } from './AuthModal';

interface DashboardProps {
  lang: 'bn' | 'en';
  currentUser: StudentProfile | null;
  onNavigate: (tabId: string) => void;
  onOpenAuth: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lang,
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const studentName = currentUser?.name || (lang === 'bn' ? 'শিক্ষার্থী' : 'Learner');
  const studentClass = currentUser?.classLevel || 'HSC ICT / Programming';
  const institution = currentUser?.institution || (lang === 'bn' ? 'ঢাকা কলেজ / বাংলা মিডিয়াম' : 'Dhaka College');
  const streak = currentUser?.studyStreakDays || 7;

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 py-2 text-[#E6E8EB]">
      
      {/* 1. HIGH-PROMINENCE STUDENT LOGIN & ACCOUNT STATUS BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111526] via-[#1A2035] to-[#111526] border border-blue-500/30 p-4 sm:p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Welcome & System Badge */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? 'বাংলাদেশ জাতীয় কারিকুলাম ও NCTB এআই ড্যাশবোর্ড' : 'NCTB National Education AI Dashboard'}</span>
              </span>

              {/* Clear Auth Status Pill */}
              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                currentUser
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              }`}>
                {currentUser ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'স্টুডেন্ট অ্যাকাউন্ট সক্রিয়' : 'Logged In Student'}</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'লগইন প্রয়োজন (Guest Mode)' : 'Guest Learner Mode'}</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {lang === 'bn' ? `স্বাগতম, ${studentName}! 👋` : `Welcome back, ${studentName}! 👋`}
            </h1>

            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
              {lang === 'bn'
                ? 'জুনিয়র জেমিনি এআই স্টুডিও - একই পেজে সমন্বিত এআই টিউটর, সরাসরি সি প্রোগ্রামিং কম্পাইলার, এবং জাতীয় পাঠ্যক্রম কুইজ প্ল্যাটফর্ম।'
                : 'Junior Gemini AI Studio — Unified AI tutoring, live C coding compiler, and national curriculum quiz suite.'}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                {studentClass}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {institution}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {streak} {lang === 'bn' ? 'দিনের স্ট্রিক' : 'Day Streak'}
              </span>
            </div>
          </div>

          {/* Dedicated Login Card / Student Card */}
          <div className="bg-[#0D1018] border border-blue-500/40 rounded-xl p-3.5 shrink-0 flex flex-col sm:flex-row lg:flex-col justify-between items-center gap-3 shadow-xl min-w-[280px]">
            <div className="flex items-center space-x-3 w-full">
              <div className="text-2xl p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shrink-0">
                {currentUser?.avatar || '👨‍🎓'}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1">
                  <h4 className="font-extrabold text-xs text-white truncate">{studentName}</h4>
                </div>
                <p className="text-[10px] text-gray-400 truncate">
                  {currentUser ? currentUser.email : (lang === 'bn' ? 'লগইন ছাড়া গেস্ট মোড সক্রিয়' : 'Guest Learner Profile')}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-2">
              <button
                id="dashboard-auth-trigger-btn"
                onClick={onOpenAuth}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5"
              >
                {currentUser ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'প্রোফাইল পরিচালনা' : 'Manage Profile'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'শিক্ষার্থী অ্যাকাউন্ট লগইন' : 'Student Login / Signup'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. REAL-TIME METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#11131A] border border-white/10 rounded-xl p-3 space-y-1 shadow-lg hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'bn' ? 'অধ্যয়ন সময়' : 'Study Hours'}</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">২৪.৫ ঘণ্টা</div>
          <p className="text-[10px] text-emerald-400 font-medium">+১৮% অগ্রগতি</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#11131A] border border-white/10 rounded-xl p-3 space-y-1 shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'bn' ? 'কুইজ স্কোর' : 'Quiz Score'}</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">৯২.৪%</div>
          <p className="text-[10px] text-purple-300 font-medium">৩৫/৩৮ সঠিক উত্তর</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#11131A] border border-white/10 rounded-xl p-3 space-y-1 shadow-lg hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'bn' ? 'কোডিং প্রবলেম' : 'C Problems'}</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Code2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">৪৭ টি সলভড</div>
          <p className="text-[10px] text-emerald-300 font-medium">লুপ ও অ্যারেই এক্সপার্ট</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#11131A] border border-white/10 rounded-xl p-3 space-y-1 shadow-lg hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'bn' ? 'এআই সার্ভার' : 'AI Ingress'}</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>GCP ONLINE</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">3.6 Flash • 110ms</p>
        </div>
      </div>

      {/* 3. CORE ACTION LAUNCHERS (NON-DUPLICATED MODULES) */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>{lang === 'bn' ? 'প্রধান শিক্ষা মডিউলসমূহ' : 'Core Learning Modules'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Module 1: AI Live Studio */}
          <div
            onClick={() => onNavigate('chat')}
            className="group cursor-pointer bg-gradient-to-b from-[#131722] to-[#0E1018] border border-blue-500/30 hover:border-blue-500 rounded-xl p-4 transition-all shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ALL-IN-ONE
                </span>
              </div>

              <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                {lang === 'bn' ? '১. এআই লাইভ স্টুডিও' : '1. AI Live Studio'}
              </h4>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'bn'
                  ? 'জেমিনি টিউটর, ওপেন এআই মডেল হাব, ইমেজ/ডায়াগ্রাম জেনারেটর, ভয়েস ও ভিডিও ভিউয়ালাইজার।'
                  : 'Gemini tutor, Open AI models, image studio, audio synthesis & animated video visualizers.'}
              </p>
            </div>

            <div className="mt-3 flex items-center text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>{lang === 'bn' ? 'লাইভ স্টুডিও খুলুন' : 'Open AI Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 2: C Code Lab */}
          <div
            onClick={() => onNavigate('code')}
            className="group cursor-pointer bg-gradient-to-b from-[#131722] to-[#0E1018] border border-emerald-500/30 hover:border-emerald-500 rounded-xl p-4 transition-all shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE COMPILER
                </span>
              </div>

              <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                {lang === 'bn' ? '২. সি কোডিং ল্যাব ও কম্পাইলার' : '2. C Code Lab & Compiler'}
              </h4>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'bn'
                  ? 'সরাসরি ব্রাউজারে C প্রোগ্রাম রান করুন, অটোমেটিক ভুল শনাক্তকরণ এবং এক্সপ্ল্যানেশন।'
                  : 'Execute C programs live in browser with automated syntax debugging.'}
              </p>
            </div>

            <div className="mt-3 flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>{lang === 'bn' ? 'কোড ল্যাবে প্রবেশ' : 'Open C Code Lab'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 3: NCTB Study Suite & Quiz */}
          <div
            onClick={() => onNavigate('study')}
            className="group cursor-pointer bg-gradient-to-b from-[#131722] to-[#0E1018] border border-purple-500/30 hover:border-purple-500 rounded-xl p-4 transition-all shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  NCTB & EXAMS
                </span>
              </div>

              <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">
                {lang === 'bn' ? '৩. সিলেবাস ও মডেল কুইজ' : '3. NCTB Syllabus & Quiz'}
              </h4>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'bn'
                  ? 'অধ্যায়ভিত্তিক সাজানো পড়াশোনা, অনলাইন মডেল টেস্ট এবং বোর্ড প্রশ্ন সমাধান।'
                  : 'Chapter-wise study guides, interactive model tests, and past board exams.'}
              </p>
            </div>

            <div className="mt-3 flex items-center text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>{lang === 'bn' ? 'পাঠ শুরু করুন' : 'Start Study Suite'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </div>

      {/* SPECIAL FEATURE: BCS PREPARATION & UNIVERSITY LEVEL EXTRAORDINARY SUITE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        
        {/* BCS Preparation Card */}
        <div className="bg-gradient-to-r from-[#181124] to-[#121626] border border-amber-500/30 rounded-xl p-4 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-300">
                  {lang === 'bn' ? '🎯 বিসিএস প্রিলি ও গভঃ জব প্রিপারেশন হাব' : '🎯 BCS & Govt Job Prep Suite'}
                </h4>
                <p className="text-[11px] text-gray-400">
                  {lang === 'bn' ? 'বিসিএস কম্পিউটার ও আইসিটি (১৫), গাণিতিক যুক্তি ও বাংলাদেশ বিষয়াবলী' : 'BCS ICT (15 Marks), Math Reasoning & Bangladesh Affairs'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              BCS SPECIAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigate('study')}
              className="p-2 rounded-lg bg-[#0E1018] hover:bg-[#181D2B] text-gray-200 border border-amber-500/20 text-left font-medium transition-all"
            >
              <span className="block text-amber-400 font-bold">• বিসিএস আইসিটি (১৫)</span>
              <span className="text-[10px] text-gray-400">কম্পিউটার ও নেটওয়ার্ক</span>
            </button>
            <button
              onClick={() => onNavigate('study')}
              className="p-2 rounded-lg bg-[#0E1018] hover:bg-[#181D2B] text-gray-200 border border-amber-500/20 text-left font-medium transition-all"
            >
              <span className="block text-amber-400 font-bold">• মানসিক দক্ষতা</span>
              <span className="text-[10px] text-gray-400">লজিক্যাল রিজনিং ও গাণিতিক</span>
            </button>
          </div>
        </div>

        {/* University Level Extraordinary Suite */}
        <div className="bg-gradient-to-r from-[#0F1826] to-[#121626] border border-cyan-500/30 rounded-xl p-4 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-cyan-300">
                  {lang === 'bn' ? '⚡ ভার্সিটি অনার্স ও হায়ার স্টাডি স্যুট' : '⚡ University Honors & Higher Study'}
                </h4>
                <p className="text-[11px] text-gray-400">
                  {lang === 'bn' ? 'DSA, মেশিন লার্নিং, থিসিস প্রপোজাল ও SOP রাইটিং' : 'DSA, Machine Learning, Research Paper & SOP Writing'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              UNIVERSITY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigate('study')}
              className="p-2 rounded-lg bg-[#0E1018] hover:bg-[#181D2B] text-gray-200 border border-cyan-500/20 text-left font-medium transition-all"
            >
              <span className="block text-cyan-400 font-bold">• DSA & Complexity</span>
              <span className="text-[10px] text-gray-400">এ অ্যালগরিদম ও ডাটা স্ট্রাকচার</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="p-2 rounded-lg bg-[#0E1018] hover:bg-[#181D2B] text-gray-200 border border-cyan-500/20 text-left font-medium transition-all"
            >
              <span className="block text-cyan-400 font-bold">• Research & SOP</span>
              <span className="text-[10px] text-gray-400">থিসিস ও বিদেশে উচ্চশিক্ষা</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. DENSE INTERACTIVE PREVIEW & SYLLABUS PROGRESS TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Left Column: Quick Code Playground Preview (2 Cols) */}
        <div className="lg:col-span-2 bg-[#11131A] border border-white/10 rounded-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {lang === 'bn' ? 'ইনস্ট্যান্ট সি কোড প্রিভিউ (Quick Code Runner)' : 'Instant C Code Preview'}
              </h4>
            </div>

            <button
              onClick={() => onNavigate('code')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-600/30 transition-all flex items-center space-x-1"
            >
              <span>{lang === 'bn' ? 'ফুল কম্পাইলার খুলুন' : 'Open Full Lab'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Embedded C Code snippet */}
          <div className="bg-[#080A0E] p-3 rounded-lg border border-white/5 font-mono text-[11px] text-gray-300 space-y-1">
            <p><span className="text-purple-400">#include</span> <span className="text-amber-300">&lt;stdio.h&gt;</span></p>
            <p><span className="text-blue-400">int</span> <span className="text-yellow-300">main</span>() &#123;</p>
            <p className="pl-4"><span className="text-blue-400">int</span> num = <span className="text-orange-400">10</span>;</p>
            <p className="pl-4"><span className="text-purple-400">if</span> (num % <span className="text-orange-400">2</span> == <span className="text-orange-400">0</span>) &#123;</p>
            <p className="pl-8"><span className="text-yellow-300">printf</span>(<span className="text-emerald-300">"Even Number!\n"</span>);</p>
            <p className="pl-4">&#125;</p>
            <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-orange-400">0</span>;</p>
            <p>&#125;</p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
            <span>[OUTPUT]: Even Number! (Execution Time: 0.02s)</span>
            <span className="text-[10px] text-gray-400">GCC Compiler v12.2</span>
          </div>
        </div>

        {/* Right Column: NCTB Syllabus Progress */}
        <div className="bg-[#11131A] border border-white/10 rounded-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {lang === 'bn' ? 'এইচএসসি আইসিটি সিলেবাস' : 'HSC ICT Syllabus'}
              </h4>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              ৭৫% সম্পন্ন
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { ch: 'অধ্যায় ১', title: 'তথ্য ও যোগাযোগ প্রযুক্তি', progress: 90, color: 'bg-emerald-500' },
              { ch: 'অধ্যায় ২', title: 'কমিউনিকেশন ও নেটওয়ার্কিং', progress: 85, color: 'bg-blue-500' },
              { ch: 'অধ্যায় ৩', title: 'সংখ্যা পদ্ধতি ও লজিক গেট', progress: 95, color: 'bg-cyan-500' },
              { ch: 'অধ্যায় ৫', title: 'প্রোগ্রামিং ভাষা (C)', progress: 65, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-gray-300 truncate max-w-[170px]">
                    <span className="text-blue-400 mr-1">{item.ch}:</span>
                    {item.title}
                  </span>
                  <span className="font-mono font-bold text-gray-400">{item.progress}%</span>
                </div>
                <div className="w-full bg-[#080A0E] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
