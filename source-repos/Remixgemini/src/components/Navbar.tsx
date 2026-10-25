import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, BookOpen, Code2, Image as ImageIcon, Lightbulb, Server, Languages, TrendingUp, WifiOff, Download, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang, setLang }) => {
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
    { id: 'chat', labelBn: 'জেমিনি টিউটর', labelEn: 'Gemini Chat', icon: MessageSquare },
    { id: 'study', labelBn: 'পাঠ ও কুইজ', labelEn: 'Study & Quiz', icon: BookOpen },
    { id: 'offline', labelBn: 'অফলাইন শিক্ষা', labelEn: 'Offline Hub', icon: Download },
    { id: 'opensource', labelBn: 'ওপেন এআই হাব', labelEn: 'Open AI Hub', icon: HeartHandshake },
    { id: 'progress', labelBn: 'শিক্ষা ট্র্যাকার', labelEn: 'Learning Progress', icon: TrendingUp },
    { id: 'code', labelBn: 'কোডিং মেন্টর', labelEn: 'Code Mentor', icon: Code2 },
    { id: 'image', labelBn: 'এআই ইমেজ ল্যাব', labelEn: 'AI Studio', icon: ImageIcon },
    { id: 'prompts', labelBn: 'প্রম্পট লাইব্রেরি', labelEn: 'Prompt Lab', icon: Lightbulb },
    { id: 'deploy', labelBn: 'ভিএম ডেপ্লয় গাইড', labelEn: 'GCP Deploy', icon: Server },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#0F1117]/95 backdrop-blur-md border-b border-[#1F2937] text-[#E6E8EB] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  JUNIOR GEMINI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></span>
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                {lang === 'bn' ? 'মুক্ত ও নিরবচ্ছিন্ন এআই শিক্ষা ড্যাশবোর্ড' : 'Accessible AI Learning Platform'}
              </p>
            </div>
          </div>

          {/* Right Action Items: Lang Toggle, Offline Status & Server Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Offline Status Badge */}
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              }`}
              title={lang === 'bn' ? 'অফলাইন লার্নিং হাব দেখুন' : 'View Offline Hub'}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  <span>{lang === 'bn' ? 'অনলাইন' : 'ONLINE'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'অফলাইন মোড' : 'OFFLINE MODE'}</span>
                </>
              )}
            </button>

            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 border border-[#2D3139] transition-colors"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'বাংলা' : 'English'}</span>
            </button>

            <div id="server-status-badge" className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#13161C] text-green-400 border border-[#2D3139]">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
              <span>GCP VM ACTIVE</span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto pb-2.5 scrollbar-none border-t border-[#1F2937] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 font-semibold'
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

