import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, BookOpen, Code2, Image as ImageIcon, Lightbulb, Server, Languages, TrendingUp, WifiOff, Download, HeartHandshake, UserCheck, LogIn, LayoutDashboard, KeyRound } from 'lucide-react';
import { StudentProfile } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  currentUser: StudentProfile | null;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang, setLang, currentUser, onOpenAuthModal }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const tabs = [
    { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', labelBn: 'এআই লাইভ স্টুডিও', labelEn: 'AI Live Studio', icon: MessageSquare },
    { id: 'study', labelBn: 'সিলেবাস ও কুইজ', labelEn: 'Syllabus & Quiz', icon: BookOpen },
    { id: 'code', labelBn: 'সি কোডিং ল্যাব', labelEn: 'C Code Lab', icon: Code2 },
    { id: 'offline', labelBn: 'অফলাইন লার্নিং', labelEn: 'Offline Hub', icon: Download },
    { id: 'progress', labelBn: 'শিক্ষা ট্র্যাকার', labelEn: 'Learning Progress', icon: TrendingUp },
    { id: 'prompts', labelBn: 'প্রম্পট লাইব্রেরি', labelEn: 'Prompt Lab', icon: Lightbulb },
    { id: 'deploy', labelBn: 'ভিএম গাইড', labelEn: 'GCP Deploy', icon: Server },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#0F1117]/95 backdrop-blur-md border-b border-[#1F2937] text-[#E6E8EB] shadow-2xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-white/10">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  JUNIOR GEMINI
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-300 border border-blue-400/30 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse"></span>
                  STUDENT AI
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Items: Lang Toggle, Offline Status & HIGH-PROMINENCE AUTH BUTTON */}
          <div className="flex items-center space-x-2">
            {/* Offline Status Badge */}
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              }`}
              title={lang === 'bn' ? 'অফলাইন লার্নিং হাব' : 'View Offline Hub'}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
              <span className="hidden sm:inline">{lang === 'bn' ? 'অনলাইন' : 'ONLINE'}</span>
            </button>

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 border border-[#2D3139] transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* HIGH-PROMINENCE STUDENT AUTH BUTTON */}
            <button
              id="student-auth-btn"
              onClick={onOpenAuthModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border shadow-lg ${
                currentUser
                  ? 'bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border-blue-400/50 shadow-blue-500/20'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-white border-white/20 shadow-purple-500/30 animate-pulse'
              }`}
            >
              {currentUser ? (
                <>
                  <span className="text-base leading-none">{currentUser.avatar || '👨‍🎓'}</span>
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span>{lang === 'bn' ? '🔑 শিক্ষার্থী লগইন' : '🔑 Student Login'}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto pb-1.5 scrollbar-none border-t border-[#1F2937]/60 pt-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
