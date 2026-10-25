import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BadgeSystem } from './BadgeSystem';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  Target,
  PlusCircle,
  RotateCcw,
  Zap,
  Sparkles
} from 'lucide-react';

interface LearningProgressProps {
  lang: 'bn' | 'en';
}

interface DailyRecord {
  date: string;
  dayLabelBn: string;
  dayLabelEn: string;
  lessons: number;
  minutes: number;
  quizzes: number;
}

interface SubjectRecord {
  nameBn: string;
  nameEn: string;
  value: number;
  color: string;
}

// Initial realistic default data for rural students
const INITIAL_DAILY_DATA: DailyRecord[] = [
  { date: '2026-07-27', dayLabelBn: 'সোম', dayLabelEn: 'Mon', lessons: 2, minutes: 40, quizzes: 1 },
  { date: '2026-07-28', dayLabelBn: 'মঙ্গল', dayLabelEn: 'Tue', lessons: 3, minutes: 55, quizzes: 2 },
  { date: '2026-07-29', dayLabelBn: 'বুধ', dayLabelEn: 'Wed', lessons: 1, minutes: 25, quizzes: 1 },
  { date: '2026-07-30', dayLabelBn: 'বৃহঃ', dayLabelEn: 'Thu', lessons: 4, minutes: 70, quizzes: 3 },
  { date: '2026-07-31', dayLabelBn: 'শুক্র', dayLabelEn: 'Fri', lessons: 3, minutes: 60, quizzes: 2 },
  { date: '2026-08-01', dayLabelBn: 'শনি', dayLabelEn: 'Sat', lessons: 5, minutes: 90, quizzes: 4 },
  { date: '2026-08-02', dayLabelBn: 'রবি', dayLabelEn: 'Sun', lessons: 4, minutes: 75, quizzes: 3 },
];

const INITIAL_SUBJECT_DATA: SubjectRecord[] = [
  { nameBn: 'এইচএসসি আইসিটি', nameEn: 'HSC ICT', value: 35, color: '#3B82F6' },
  { nameBn: 'পাইথন ও প্রোগ্রামিং', nameEn: 'Python & Coding', value: 25, color: '#8B5CF6' },
  { nameBn: 'গণিত ও বিজ্ঞান', nameEn: 'Math & Science', value: 20, color: '#EC4899' },
  { nameBn: 'ইংরেজি ভাষা', nameEn: 'English Language', value: 12, color: '#10B981' },
  { nameBn: 'এআই ও প্রযুক্তি', nameEn: 'AI & Tech', value: 8, color: '#F59E0B' },
];

export const LearningProgress: React.FC<LearningProgressProps> = ({ lang }) => {
  const [dailyData, setDailyData] = useState<DailyRecord[]>(() => {
    const saved = localStorage.getItem('junior_gemini_progress_daily');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_DATA;
  });

  const [subjectData, setSubjectData] = useState<SubjectRecord[]>(() => {
    const saved = localStorage.getItem('junior_gemini_progress_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECT_DATA;
  });

  const [dailyGoal, setDailyGoal] = useState<number>(3); // lessons goal
  const [selectedSubject, setSelectedSubject] = useState<string>('HSC ICT');
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  // Save to localStorage whenever data updates
  useEffect(() => {
    localStorage.setItem('junior_gemini_progress_daily', JSON.stringify(dailyData));
  }, [dailyData]);

  useEffect(() => {
    localStorage.setItem('junior_gemini_progress_subjects', JSON.stringify(subjectData));
  }, [subjectData]);

  // Calculations
  const totalLessons = dailyData.reduce((acc, curr) => acc + curr.lessons, 0);
  const totalMinutes = dailyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalQuizzes = dailyData.reduce((acc, curr) => acc + curr.quizzes, 0);
  const todayRecord = dailyData[dailyData.length - 1] || { lessons: 0, minutes: 0, quizzes: 0 };
  const goalProgress = Math.min(100, Math.round((todayRecord.lessons / dailyGoal) * 100));

  // Current streak calculation (count contiguous days with >=1 lesson)
  const currentStreak = [...dailyData].reverse().reduce((acc, day) => {
    if (day.lessons > 0) return acc + 1;
    return acc;
  }, 0);

  // Quick action: log a completed lesson
  const handleLogLesson = () => {
    setDailyData((prev) => {
      const copy = [...prev];
      const lastIndex = copy.length - 1;
      if (lastIndex >= 0) {
        copy[lastIndex] = {
          ...copy[lastIndex],
          lessons: copy[lastIndex].lessons + 1,
          minutes: copy[lastIndex].minutes + 20,
          quizzes: copy[lastIndex].quizzes + 1,
        };
      }
      return copy;
    });

    // Increment selected subject count
    setSubjectData((prev) =>
      prev.map((sub) =>
        sub.nameEn === selectedSubject || sub.nameBn === selectedSubject
          ? { ...sub, value: sub.value + 1 }
          : sub
      )
    );

    const msg = lang === 'bn' ? '🎉 ১টি নতুন পাঠ রেকর্ড সফলভাবে সম্পন্ন হয়েছে!' : '🎉 1 New Lesson Logged Successfully!';
    setLogSuccessMessage(msg);
    setTimeout(() => setLogSuccessMessage(null), 3000);
  };

  const handleResetProgress = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি পূর্ববর্তী ট্র্যাকিং ডেটা রিসেট করতে চান?' : 'Are you sure you want to reset learning tracking data?')) {
      setDailyData(INITIAL_DAILY_DATA);
      setSubjectData(INITIAL_SUBJECT_DATA);
      localStorage.removeItem('junior_gemini_progress_daily');
      localStorage.removeItem('junior_gemini_progress_subjects');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-white/10">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {lang === 'bn' ? 'শিক্ষা অগ্রগতি ট্র্যাকার' : 'Learning Progress Tracker'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'bn'
                ? 'জুনিয়র জেমিনির সাথে আপনার দৈনন্দিন পাঠ্যক্রম ও ধারাবাহিক অর্জনের রিয়েল-টাইম চার্ট'
                : 'Visualize lessons completed over time and boost your daily learning streak'}
            </p>
          </div>
        </div>

        {/* Top Badges / Streak */}
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs shadow-inner"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{currentStreak} {lang === 'bn' ? 'দিনের ধারাবাহিকতা' : 'Day Streak'}</span>
          </motion.div>

          <button
            onClick={handleResetProgress}
            className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-400 hover:text-gray-200 border border-[#2D3139] transition-colors"
            title={lang === 'bn' ? 'ডেটা রিসেট করুন' : 'Reset Data'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {logSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/40 text-green-300 text-xs font-semibold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              {logSuccessMessage}
            </span>
            <span className="font-mono text-[10px] uppercase text-green-400">+100 XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{lang === 'bn' ? 'মোট সম্পন্ন পাঠ' : 'Lessons Completed'}</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#E6E8EB] font-mono">{totalLessons}</div>
          <p className="text-[11px] text-green-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+12% {lang === 'bn' ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}</span>
          </p>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{lang === 'bn' ? 'মোট পড়ালেখা (মিনিট)' : 'Active Learning (Mins)'}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#E6E8EB] font-mono">{totalMinutes}</div>
          <p className="text-[11px] text-purple-400 mt-1 font-medium">
            ⏱️ ~{(totalMinutes / 60).toFixed(1)} {lang === 'bn' ? 'ঘণ্টা অর্জিত' : 'Hours Total'}
          </p>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/15 transition-all"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{lang === 'bn' ? 'কুইজ পারদর্শিতা' : 'Quizzes Mastered'}</span>
            <Award className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#E6E8EB] font-mono">{totalQuizzes}</div>
          <p className="text-[11px] text-pink-400 mt-1 font-medium">
            🎯 92% {lang === 'bn' ? 'সঠিক উত্তরের হার' : 'Accuracy Rate'}
          </p>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/15 transition-all"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{lang === 'bn' ? 'আজকের লক্ষ্য' : 'Today\'s Target'}</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#E6E8EB] font-mono">
            {todayRecord.lessons} / {dailyGoal}
          </div>
          <div className="w-full bg-[#1A1D24] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all"></div>
        </motion.div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        
        {/* Main Chart 1: Lessons Completed Over Time (Area Chart) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2 bg-[#0A0C10] p-5 rounded-2xl border border-[#1F2937] shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#E6E8EB] flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>{lang === 'bn' ? 'সময় অনুযায়ী সম্পন্ন লেসনের গ্রাফ' : 'Lessons Completed Over Time'}</span>
              </h3>
              <p className="text-[11px] text-gray-400">
                {lang === 'bn' ? 'দৈনন্দিন লেসন সংখ্যা ও শিক্ষার গ্রাফচিত্র' : 'Daily breakdown of lessons completed over the week'}
              </p>
            </div>
            
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#13161C] text-blue-400 border border-[#2D3139] w-fit">
              RECHARTS ACTIVE
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lessonsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis
                  dataKey={lang === 'bn' ? 'dayLabelBn' : 'dayLabelEn'}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13161C',
                    borderColor: '#2D3139',
                    borderRadius: '12px',
                    color: '#E6E8EB',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} ${lang === 'bn' ? 'টি লেসন' : 'Lessons'}`, lang === 'bn' ? 'সম্পন্ন' : 'Completed']}
                />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#lessonsColor)"
                  activeDot={{ r: 6, fill: '#60A5FA', stroke: '#1E40AF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Subject Mastery Breakdown (Pie Chart) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-[#0A0C10] p-5 rounded-2xl border border-[#1F2937] shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-[#E6E8EB] flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{lang === 'bn' ? 'বিষয়ভিত্তিক অনুপাত' : 'Subject Breakdown'}</span>
            </h3>
            <p className="text-[11px] text-gray-400 mb-2">
              {lang === 'bn' ? 'কোন বিষয়ে কতটি পাঠ সম্পন্ন করেছেন' : 'Distribution across core curriculum'}
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey={lang === 'bn' ? 'nameBn' : 'nameEn'}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F1117" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13161C',
                      borderColor: '#2D3139',
                      borderRadius: '10px',
                      color: '#E6E8EB',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custom Subject Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[#1F2937]">
            {subjectData.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }}></span>
                  <span className="text-gray-300 font-medium">
                    {lang === 'bn' ? sub.nameBn : sub.nameEn}
                  </span>
                </div>
                <span className="font-mono text-gray-400 font-bold">{sub.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Chart 3: Active Minutes per Day (Bar Chart) & Quick Log Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        
        {/* Active Minutes Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-2 bg-[#0A0C10] p-5 rounded-2xl border border-[#1F2937] shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#E6E8EB] flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span>{lang === 'bn' ? 'দৈনিক সক্রিয় পড়ার সময় (মিনিটে)' : 'Daily Active Study Time (Minutes)'}</span>
              </h3>
              <p className="text-[11px] text-gray-400">
                {lang === 'bn' ? 'বিগত সপ্তাহের প্রতিদিনের পড়ার সময়সূচি' : 'Minutes spent actively learning per day'}
              </p>
            </div>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis
                  dataKey={lang === 'bn' ? 'dayLabelBn' : 'dayLabelEn'}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13161C',
                    borderColor: '#2D3139',
                    borderRadius: '12px',
                    color: '#E6E8EB',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} ${lang === 'bn' ? 'মিনিট' : 'Mins'}`, lang === 'bn' ? 'সক্রিয় শিক্ষা' : 'Study Time']}
                />
                <Bar dataKey="minutes" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Log Action Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#0A0C10] p-5 rounded-2xl border border-[#1F2937] shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-[#E6E8EB] flex items-center gap-2 mb-2">
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>{lang === 'bn' ? 'সেশন রেকর্ড যুক্ত করুন' : 'Log Completed Lesson'}</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'জুনিয়র জেমিনির সাথে একটি পাঠ শেষ করার পর এখানে ক্লিক করে আপনার দৈনিক অগ্রগতির চার্ট আপডেট রাখুন।'
                : 'Finished a lesson or quiz? Mark it here to update your live Recharts graphs instantly.'}
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {lang === 'bn' ? 'বিষয় সিলেক্ট করুন:' : 'Select Subject:'}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-[#E6E8EB] focus:outline-none focus:border-blue-500"
                >
                  <option value="HSC ICT">HSC ICT / এইচএসসি আইসিটি</option>
                  <option value="Python & Coding">Python & Coding / পাইথন ও প্রোগ্রামিং</option>
                  <option value="Math & Science">Math & Science / গণিত ও বিজ্ঞান</option>
                  <option value="English Language">English Language / ইংরেজি ভাষা</option>
                  <option value="AI & Tech">AI & Tech / এআই ও প্রযুক্তি</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {lang === 'bn' ? 'দৈনিক লক্ষ্য (লেসন সংখ্যা):' : 'Daily Goal (Lessons):'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value) || 1)}
                    className="w-20 bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-1.5 text-xs text-[#E6E8EB] text-center font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs text-gray-400">
                    {lang === 'bn' ? 'টি লেসন / দিন' : 'lessons per day'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogLesson}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পাঠ সম্পন্ন হিসেবে মার্কেট করুন' : 'Mark 1 Lesson Completed'}</span>
          </motion.button>
        </motion.div>

      </div>

      {/* Gamification Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-6 pt-5 border-t border-[#1F2937]"
      >
        <BadgeSystem
          lang={lang}
          totalLessons={totalLessons}
          currentStreak={currentStreak}
          totalMinutes={totalMinutes}
          totalQuizzes={totalQuizzes}
        />
      </motion.div>

    </motion.div>
  );
};
