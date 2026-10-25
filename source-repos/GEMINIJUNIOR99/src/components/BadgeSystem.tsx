import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Star,
  Trophy,
  BookOpen,
  Clock,
  HelpCircle,
  Share2,
  ChevronRight,
  X
} from 'lucide-react';

export interface Badge {
  id: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  category: 'streak' | 'lesson' | 'quiz' | 'time' | 'special';
  xp: number;
  condition: (data: { lessons: number; streak: number; minutes: number; quizzes: number }) => boolean;
  getProgress: (data: { lessons: number; streak: number; minutes: number; quizzes: number }) => { current: number; target: number };
}

export interface BadgeSystemProps {
  lang: 'bn' | 'en';
  totalLessons: number;
  currentStreak: number;
  totalMinutes: number;
  totalQuizzes: number;
}

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first-step',
    icon: '🥇',
    titleBn: 'প্রথম পদক্ষেপ',
    titleEn: 'First Step',
    descBn: 'প্রথমটি পাঠ সম্পন্ন করুন',
    descEn: 'Complete your 1st lesson',
    category: 'lesson',
    xp: 100,
    condition: ({ lessons }) => lessons >= 1,
    getProgress: ({ lessons }) => ({ current: Math.min(lessons, 1), target: 1 })
  },
  {
    id: 'streak-3-days',
    icon: '⚡',
    titleBn: '৩ দিনের ধারায়',
    titleEn: '3-Day Momentum',
    descBn: 'ধারাবাহিক ৩ দিন পড়াশোনা করুন',
    descEn: 'Maintain a 3-day study streak',
    category: 'streak',
    xp: 200,
    condition: ({ streak }) => streak >= 3,
    getProgress: ({ streak }) => ({ current: Math.min(streak, 3), target: 3 })
  },
  {
    id: 'streak-5-days',
    icon: '🔥',
    titleBn: '৫ দিনের অলিম্পিয়ান',
    titleEn: '5-Day Streak',
    descBn: 'পর পর ৫ দিন শিক্ষার ধারা বজায় রাখুন',
    descEn: 'Maintain a 5-day study streak',
    category: 'streak',
    xp: 350,
    condition: ({ streak }) => streak >= 5,
    getProgress: ({ streak }) => ({ current: Math.min(streak, 5), target: 5 })
  },
  {
    id: 'streak-7-days',
    icon: '🌟',
    titleBn: '৭ দিনের মাস্টার',
    titleEn: '7-Day Master',
    descBn: 'এক টানা ৭ দিন পড়াশোনার অনন্য রুটিন',
    descEn: 'Master a full 7-day learning week',
    category: 'streak',
    xp: 500,
    condition: ({ streak }) => streak >= 7,
    getProgress: ({ streak }) => ({ current: Math.min(streak, 7), target: 7 })
  },
  {
    id: 'quiz-wizard',
    icon: '🎯',
    titleBn: 'কুইজ উইজার্ড',
    titleEn: 'Quiz Wizard',
    descBn: '৫টি বা তার বেশি কুইজ অনুশীলন করুন',
    descEn: 'Complete 5 or more practice quizzes',
    category: 'quiz',
    xp: 250,
    condition: ({ quizzes }) => quizzes >= 5,
    getProgress: ({ quizzes }) => ({ current: Math.min(quizzes, 5), target: 5 })
  },
  {
    id: 'ict-scholar',
    icon: '💻',
    titleBn: 'আইসিটি স্কলার',
    titleEn: 'ICT Scholar',
    descBn: '১০টি আইসিটি বা সি প্রোগ্রামিং পাঠ সম্পন্ন করুন',
    descEn: 'Complete 10 ICT or Coding lessons',
    category: 'lesson',
    xp: 400,
    condition: ({ lessons }) => lessons >= 10,
    getProgress: ({ lessons }) => ({ current: Math.min(lessons, 10), target: 10 })
  },
  {
    id: 'century-learner',
    icon: '⏱️',
    titleBn: '১০০ মিনিটের স্টাডি ট্রেইলবিলেজার',
    titleEn: '100-Minute Trailblazer',
    descBn: 'কমপক্ষে ১০০ মিনিট সক্রিয়ভাবে পড়াশোনায় ব্যয় করুন',
    descEn: 'Accumulate 100+ minutes of active learning',
    category: 'time',
    xp: 300,
    condition: ({ minutes }) => minutes >= 100,
    getProgress: ({ minutes }) => ({ current: Math.min(minutes, 100), target: 100 })
  },
  {
    id: 'rural-ai-pioneer',
    icon: '💎',
    titleBn: 'গ্রামীন এআই পাইওনিয়ার',
    titleEn: 'Rural AI Pioneer',
    descBn: '১৫টি পাঠ সম্পন্ন করে প্রযুক্তির আলো ছড়িয়ে দিন',
    descEn: 'Complete 15 lessons as a technology pioneer',
    category: 'special',
    xp: 750,
    condition: ({ lessons }) => lessons >= 15,
    getProgress: ({ lessons }) => ({ current: Math.min(lessons, 15), target: 15 })
  }
];

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  lang,
  totalLessons,
  currentStreak,
  totalMinutes,
  totalQuizzes
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const currentData = {
    lessons: totalLessons,
    streak: currentStreak,
    minutes: totalMinutes,
    quizzes: totalQuizzes
  };

  const unlockedCount = BADGE_DEFINITIONS.filter((b) => b.condition(currentData)).length;
  const totalXp = BADGE_DEFINITIONS.reduce((acc, b) => {
    if (b.condition(currentData)) return acc + b.xp;
    return acc;
  }, 0);

  const filteredBadges = BADGE_DEFINITIONS.filter((b) => {
    const isUnlocked = b.condition(currentData);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="bg-[#0A0C10] p-5 sm:p-6 rounded-2xl border border-[#1F2937] shadow-xl">
      {/* Header with Title & Stats Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">
              {lang === 'bn' ? 'স্মার্ট অর্জন ও ব্যাজ সিস্টেম' : 'Smart Achievement & Badge System'}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'bn'
              ? 'আপনার শিক্ষায় অর্জন করা প্রতিটি মাইলফলকে নতুন ভার্চুয়াল ব্যাজ ও XP পয়েন্ট আনলক করুন'
              : 'Unlock virtual badges & XP reward points as you accomplish learning milestones'}
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{totalXp} XP</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>
              {unlockedCount} / {BADGE_DEFINITIONS.length} {lang === 'bn' ? 'আনলকড' : 'Unlocked'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-1.5">
          {[
            { id: 'all', labelBn: 'সব ব্যাজ', labelEn: 'All Badges' },
            { id: 'unlocked', labelBn: 'আনলক করা', labelEn: 'Unlocked' },
            { id: 'locked', labelBn: 'বাকি অর্জন', labelEn: 'Locked' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[#13161C] text-gray-400 hover:text-gray-200 border border-[#2D3139]'
              }`}
            >
              {lang === 'bn' ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
          {Math.round((unlockedCount / BADGE_DEFINITIONS.length) * 100)}% {lang === 'bn' ? 'সম্পূর্ণ' : 'Completed'}
        </span>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.condition(currentData);
          const { current, target } = badge.getProgress(currentData);
          const pct = Math.min(100, Math.round((current / target) * 100));

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 rounded-xl border relative cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#131722] to-[#0D1017] border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-400'
                  : 'bg-[#0F1117] border-[#2D3139] opacity-75 hover:opacity-100 hover:border-gray-500'
              }`}
            >
              {/* Unlocked / Locked Top Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{badge.icon}</span>
                {isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-gray-800 text-gray-400 border border-gray-700 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    LOCKED
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-xs font-extrabold text-white line-clamp-1">
                  {lang === 'bn' ? badge.titleBn : badge.titleEn}
                </h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {lang === 'bn' ? badge.descBn : badge.descEn}
                </p>
              </div>

              {/* Progress Bar / XP Badge bottom */}
              <div className="mt-3 pt-2 border-t border-[#1F2937]/60">
                {isUnlocked ? (
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                    <span>+ {badge.xp} XP</span>
                    <span className="text-gray-400 hover:text-white transition-colors flex items-center">
                      {lang === 'bn' ? 'বিস্তারিত' : 'Details'} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono mb-1">
                      <span>{current} / {target}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1D24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Inspect Modal Dialog */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-[#0F1117] border border-[#2D3139] p-6 rounded-2xl max-w-sm w-full text-center relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1A1D24] text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-5xl my-3 animate-bounce">{selectedBadge.icon}</div>

              <h3 className="text-lg font-extrabold text-white">
                {lang === 'bn' ? selectedBadge.titleBn : selectedBadge.titleEn}
              </h3>

              <div className="mt-1">
                {selectedBadge.condition(currentData) ? (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {lang === 'bn' ? 'অর্জিত ব্যাজ (+ ' + selectedBadge.xp + ' XP)' : 'Unlocked (+ ' + selectedBadge.xp + ' XP)'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700">
                    <Lock className="w-3 h-3" />
                    {lang === 'bn' ? 'এখনো লকড রয়েছে' : 'Locked Milestone'}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 my-4 leading-relaxed">
                {lang === 'bn' ? selectedBadge.descBn : selectedBadge.descEn}
              </p>

              {/* Progress status inside modal */}
              {!selectedBadge.condition(currentData) && (
                <div className="p-3 bg-[#13161C] rounded-xl border border-[#2D3139] mb-4 text-left">
                  <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                    <span>{lang === 'bn' ? 'অগ্রগতি:' : 'Progress:'}</span>
                    <span>
                      {selectedBadge.getProgress(currentData).current} / {selectedBadge.getProgress(currentData).target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#1A1D24] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (selectedBadge.getProgress(currentData).current /
                              selectedBadge.getProgress(currentData).target) *
                              100
                          )
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/20"
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Got It'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
