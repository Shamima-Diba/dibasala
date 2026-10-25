import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Lock, School, GraduationCap, CheckCircle2, ShieldCheck, Sparkles, LogOut, Edit3, ArrowRight } from 'lucide-react';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  classLevel: string;
  avatar: string;
  joinedDate: string;
  studyStreakDays: number;
}

const DEFAULT_AVATARS = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🚀', '🧠', '📘'];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  currentUser: StudentProfile | null;
  onLogin: (user: StudentProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>('login');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('ঢাকা কলেজ');
  const [classLevel, setClassLevel] = useState('HSC 2026');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🎓');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setActiveTab('profile');
      setName(currentUser.name);
      setEmail(currentUser.email);
      setInstitution(currentUser.institution);
      setClassLevel(currentUser.classLevel);
      setSelectedAvatar(currentUser.avatar || '👨‍🎓');
    } else {
      setActiveTab('login');
    }
  }, [currentUser, isOpen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: StudentProfile = {
      id: currentUser?.id || `student-${Date.now()}`,
      name: name.trim() || (lang === 'bn' ? 'তানভীর হোসেন' : 'Tanvir Hossain'),
      email: email.trim() || 'student@juniorgemini.edu',
      institution: institution || (lang === 'bn' ? 'ঢাকা কলেজ' : 'Dhaka College'),
      classLevel: classLevel || 'HSC 2026',
      avatar: selectedAvatar,
      joinedDate: currentUser?.joinedDate || new Date().toLocaleDateString(),
      studyStreakDays: currentUser?.studyStreakDays || 7,
    };

    onLogin(loggedUser);
    setSuccessMsg(lang === 'bn' ? 'সফলভাবে লগইন করা হয়েছে!' : 'Logged in successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleQuickGuestLogin = () => {
    const guestUser: StudentProfile = {
      id: `guest-${Date.now()}`,
      name: lang === 'bn' ? 'শিক্ষার্থী (গেস্ট)' : 'Student Learner',
      email: 'learner@juniorgemini.edu',
      institution: lang === 'bn' ? 'বাংলা মিডিয়াম/ডিপ্লোমা' : 'General Education',
      classLevel: 'HSC ICT / Programming',
      avatar: '👨‍🎓',
      joinedDate: new Date().toLocaleDateString(),
      studyStreakDays: 3,
    };
    onLogin(guestUser);
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: StudentProfile = {
      ...currentUser,
      name,
      institution,
      classLevel,
      avatar: selectedAvatar,
    };
    onLogin(updated);
    setSuccessMsg(lang === 'bn' ? 'প্রোফাইল আপডেট সম্পন্ন হয়েছে!' : 'Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[#11131A] border border-white/10 rounded-3xl p-6 shadow-2xl text-[#E6E8EB] relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {lang === 'bn' ? 'শিক্ষার্থী অ্যাকাউন্ট ও প্রোফাইল' : 'Student Account & Profile'}
              </h3>
              <p className="text-xs text-gray-400">
                {lang === 'bn' ? 'জুনিয়র জেমিনি স্টুডেন্ট স্টাডি ট্র্যাকার' : 'Junior Gemini Student Study Suite'}
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex bg-[#181C26] p-1 rounded-2xl border border-white/10 mb-5">
            {!currentUser ? (
              <>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {lang === 'bn' ? 'লগইন' : 'Login'}
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
                </button>
              </>
            ) : (
              <button
                className="w-full py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              >
                {lang === 'bn' ? 'প্রোফাইল তথ্য ও স্ট্যাটস' : 'My Profile & Stats'}
              </button>
            )}
          </div>

          {/* Alert Success */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && !currentUser && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'শিক্ষার্থীর নাম বা ইমেইল' : 'Student Name / Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: তানভীর হোসেন' : 'e.g., Tanvir Hossain'}
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickGuestLogin}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>⚡ {lang === 'bn' ? 'বিনামূল্যে গেস্ট স্টুডেন্ট প্রবেশ' : 'Quick Instant Student Access'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && !currentUser && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'তানভীর হোসেন' : 'Tanvir Hossain'}
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Institution / College'}
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: ঢাকা কলেজ / পলিটেকনিক' : 'e.g., Dhaka College'}
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'শ্রেণি / কোর্স' : 'Class / Course'}
                </label>
                <input
                  type="text"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  placeholder="HSC 2026 / C Programming"
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {lang === 'bn' ? 'অবতার নির্বাচন করুন' : 'Select Avatar'}
                </label>
                <div className="flex space-x-2">
                  {DEFAULT_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2 rounded-xl text-lg transition-all ${
                        selectedAvatar === av
                          ? 'bg-blue-600 border border-blue-400 scale-110'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                {lang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Student Account'}
              </button>
            </form>
          )}

          {/* TAB 3: PROFILE & STATS */}
          {currentUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-[#181C26] border border-white/10">
                <div className="text-3xl p-2 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                  {currentUser.avatar || '👨‍🎓'}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">{currentUser.name}</h4>
                  <p className="text-xs text-gray-400">{currentUser.institution} • {currentUser.classLevel}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🔥 {currentUser.studyStreakDays} {lang === 'bn' ? 'দিনের স্টাডি স্ট্রিক' : 'Day Streak'}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {lang === 'bn' ? 'নাম পরিবর্তন' : 'Edit Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {lang === 'bn' ? 'শিক্ষা প্রতিষ্ঠান' : 'Institution'}
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs transition-all flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
