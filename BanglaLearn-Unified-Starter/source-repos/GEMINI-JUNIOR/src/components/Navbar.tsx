import React, { useState } from 'react';
import { Sparkles, MessageSquare, BookOpen, Code2, Image as ImageIcon, Lightbulb, Scale, Server, Languages, GraduationCap, Palette, Users, Trophy, Video, Eye, Sun, Sliders, Tv, Briefcase, FileText, Download, CreditCard, Search, User, UserCheck } from 'lucide-react';
import { SystemDocumentationModal } from './SystemDocumentationModal';
import { PopUpDictionaryModal } from './PopUpDictionaryModal';
import { AuthModal, UserProfile } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  isEyeCareMode: boolean;
  setIsEyeCareMode: (val: boolean) => void;
  eyeCareWarmth: number;
  setEyeCareWarmth: (val: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isEyeCareMode,
  setIsEyeCareMode,
  eyeCareWarmth,
  setEyeCareWarmth
}) => {
  const [showEyeCareMenu, setShowEyeCareMenu] = useState<boolean>(false);
  const [showSystemDocModal, setShowSystemDocModal] = useState<boolean>(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile | null>({
    name: 'আব্দুল্লাহ আল মামুন',
    phoneOrEmail: '01700000000',
    role: 'student',
    nctbClass: '১০ম শ্রেণী (SSC 2026)',
    isVerified: true,
    points: 450,
  });

  const tabs = [
    { id: 'chat', labelBn: '🤖 জেমিনি এআই এজেন্ট (Google AI Supported)', labelEn: 'Gemini AI Agent (Google AI)', icon: MessageSquare },
    { id: 'video_quiz', labelBn: '🎬 কুইজ বিজয়ী এআই ভিডিও', labelEn: 'Quiz & Video Studio', icon: Video },
    { id: 'study', labelBn: '📚 এনসিটিবি, বিসিএস ও STEM ল্যাব', labelEn: 'NCTB, BCS & STEM Lab', icon: GraduationCap },
    { id: 'offline', labelBn: '📱 অফলাইন ডাউনলোড সেন্টার', labelEn: 'Offline Downloads', icon: Download },
    { id: 'payments', labelBn: '💳 বিল পে ও ফি গেটওয়ে', labelEn: 'Local Payments & Fees', icon: CreditCard },
    { id: 'projector', labelBn: '🖥️ প্রজেক্টর ক্লাসরুম', labelEn: 'Projector Mode', icon: Tv },
    { id: 'business', labelBn: '💼 ব্যবসা ও ফিনটেক ল্যাব', labelEn: 'Business & FinTech', icon: Briefcase },
    { id: 'kids_art', labelBn: '🎨 বাচ্চাদের আর্ট ও ক্লাব', labelEn: 'Kids Art Club', icon: Palette },
    { id: 'teacher_student', labelBn: '👨‍🏫 শিক্ষক-ছাত্র কানেক্ট', labelEn: 'Teacher-Student Hub', icon: Users },
    { id: 'sports', labelBn: '🏆 খেলাধুলা ও ফিটনেস', labelEn: 'Sports & Fitness', icon: Trophy },
    { id: 'code', labelBn: '💻 কোডিং মেন্টর', labelEn: 'Code Mentor', icon: Code2 },
    { id: 'image', labelBn: '🎨 এআই সাইন্স ডায়াগ্রাম', labelEn: 'AI Diagrams', icon: ImageIcon },
    { id: 'prompts', labelBn: '💡 প্রম্পট লাইব্রেরি', labelEn: 'Prompt Lab', icon: Lightbulb },
    { id: 'legal', labelBn: '⚖️ প্যাটেন্ট ও আইনি গাইড', labelEn: 'IP & Legal', icon: Scale },
    { id: 'deploy', labelBn: '🖥️ ভিএম ডেপ্লয় গাইড', labelEn: 'GCP Deploy', icon: Server },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#0F1117]/95 backdrop-blur-md border-b border-[#1F2937] text-[#E6E8EB] shadow-2xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('chat')}>
            <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-amber-400 shadow-[0_0_18px_rgba(59,130,246,0.5)]">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-[14px] bg-[#0A0D14] border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-emerald-500/10 blur-sm"></div>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse relative z-10" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#0A0D14] shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent drop-shadow">
                  MATI AI (মাটি এআই)
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-300 border border-cyan-500/40 rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,1)] animate-ping"></span>
                  SMART AI ARCHITECTURE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-300 hidden sm:block">
                {lang === 'bn' ? 'বিশ্বমানের স্মার্ট ও আধুনিক এআই আর্কিটেকচার (Google Gemini Supported)' : 'World-Class Smart AI Architecture (Powered by Google Gemini)'}
              </p>
            </div>
          </div>

          {/* Right Action Items: Dictionary, Eye Protection, Lang Toggle & Server Badge */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 relative shrink-0">
            
            {/* Pop-up Dictionary Trigger Button */}
            <button
              id="dictionary-trigger-btn"
              onClick={() => setShowDictionaryModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/50 transition-all shadow-md active:scale-95"
              title="শব্দার্থ ও পপ-আপ ডিকশনারি"
            >
              <BookOpen className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="hidden sm:inline">{lang === 'bn' ? '📖 শব্দার্থ' : '📖 Dictionary'}</span>
            </button>

            {/* Eye Protection / Eye-Care Mode Control */}
            <div className="relative">
              <button
                id="eye-care-toggle-btn"
                onClick={() => {
                  if (!isEyeCareMode) {
                    setIsEyeCareMode(true);
                  }
                  setShowEyeCareMenu(!showEyeCareMenu);
                }}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isEyeCareMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 border-[#2D3139]'
                }`}
                title="চোখের সুরক্ষা ও নাইট রিডিং ফিল্টার"
              >
                <Eye className={`w-3.5 h-3.5 ${isEyeCareMode ? 'text-amber-400 animate-pulse' : 'text-amber-300'}`} />
                <span className="hidden md:inline">
                  {isEyeCareMode ? (lang === 'bn' ? 'আই কেয়ার ON' : 'Eye Care ON') : (lang === 'bn' ? 'চোখের সুরক্ষা' : 'Eye Care')}
                </span>
              </button>

              {/* Eye Care Settings Popover */}
              {showEyeCareMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F1117] border border-amber-500/40 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fadeIn text-xs">
                  <div className="flex items-center justify-between border-b border-[#252A36] pb-2">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'bn' ? 'চোখের সুরক্ষা ও নাইট ফিল্টার' : 'Eye Protection Filter'}</span>
                    </div>
                    <button
                      onClick={() => setShowEyeCareMenu(false)}
                      className="text-gray-400 hover:text-white px-1.5"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-snug">
                    {lang === 'bn'
                      ? 'ডিজিটাল স্ক্রিনের কালার টেম্পারেচার সামঞ্জস্য করে নাইট ভিউ ফিল্টার সক্রিয় করুন।'
                      : 'Adjust display color temperature and warmth level.'}
                  </p>

                  <div className="flex items-center justify-between bg-[#13161C] p-2.5 rounded-xl border border-[#252A36]">
                    <span className="font-bold text-gray-200">
                      {lang === 'bn' ? 'আই-প্রোটেকশন স্ট্যাটাস:' : 'Protection Status:'}
                    </span>
                    <button
                      onClick={() => setIsEyeCareMode(!isEyeCareMode)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        isEyeCareMode
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-[#252A36] text-gray-400'
                      }`}
                    >
                      {isEyeCareMode ? 'চালু (ON)' : 'বন্ধ (OFF)'}
                    </button>
                  </div>

                  {isEyeCareMode && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-amber-300">
                        <span>{lang === 'bn' ? 'ওয়ার্ম লাইট মাত্রা (Warmth):' : 'Warm Light Level:'}</span>
                        <span>{eyeCareWarmth}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={eyeCareWarmth}
                        onChange={(e) => setEyeCareWarmth(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              id="system-doc-btn"
              onClick={() => setShowSystemDocModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 transition-all shadow-md active:scale-95"
              title="সিস্টেম ম্যানুয়েল ও পিডিএফ সেভ করুন"
            >
              <FileText className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="hidden lg:inline">{lang === 'bn' ? '📄 ম্যানুয়েল' : '📄 Doc PDF'}</span>
            </button>

            {/* Language Switcher 3D Button */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#1E2433] to-[#2B3348] hover:from-[#283146] hover:to-[#364260] text-emerald-300 border border-emerald-500/40 transition-all shadow-md active:scale-95"
              title="ভাষা পরিবর্তন করুন / Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Login / Profile Button */}
            <button
              id="user-auth-btn"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/40 shadow-md transition-all active:scale-95"
              title="লগইন বা প্রোফাইল দেখুন"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">
                {user ? user.name.split(' ')[0] : (lang === 'bn' ? 'লগইন' : 'Login')}
              </span>
            </button>

          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto pb-2.5 scrollbar-none border-t border-[#1F2937] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
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

      <SystemDocumentationModal
        isOpen={showSystemDocModal}
        onClose={() => setShowSystemDocModal(false)}
        lang={lang}
      />

      <PopUpDictionaryModal
        isOpen={showDictionaryModal}
        onClose={() => setShowDictionaryModal(false)}
        lang={lang}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        lang={lang}
        currentUser={user}
        onLoginSuccess={(u) => setUser(u)}
        onLogout={() => setUser(null)}
      />
    </header>
  );
};

