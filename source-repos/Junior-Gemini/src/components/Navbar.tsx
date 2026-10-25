import React, { useState } from 'react';
import { Sparkles, MessageSquare, BookOpen, Code2, Image as ImageIcon, Lightbulb, Scale, Server, Languages, GraduationCap, Palette, Users, Trophy, Video, Eye, Sun, Sliders, Tv, Briefcase, FileText } from 'lucide-react';
import { SystemDocumentationModal } from './SystemDocumentationModal';

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
  const tabs = [
    { id: 'video_quiz', labelBn: '🎬 কুইজ বিজয়ী এআই ভিডিও', labelEn: 'Quiz & AI Video Studio', icon: Video },
    { id: 'projector', labelBn: '🖥️ স্মার্ট প্রজেক্টর ক্লাসরুম', labelEn: 'Smart Projector Mode', icon: Tv },
    { id: 'business', labelBn: '💼 ব্যাংকিং, ডিসট্রিবিউশন ও ব্যবসা ল্যাব', labelEn: 'Business & FinTech Lab', icon: Briefcase },
    { id: 'kids_art', labelBn: '🎨 বাচ্চাদের আর্ট ও ফান ক্লাব', labelEn: 'Kids Art & Fun Zone', icon: Palette },
    { id: 'study', labelBn: 'শিক্ষা ও STEM গবেষণা', labelEn: 'Edu & STEM Research', icon: GraduationCap },
    { id: 'teacher_student', labelBn: '👨‍🏫 শিক্ষক-ছাত্র কানেক্ট', labelEn: 'Teacher-Student Hub', icon: Users },
    { id: 'sports', labelBn: '🏆 খেলাধুলা ও ফিটনেস', labelEn: 'Sports & Fitness', icon: Trophy },
    { id: 'chat', labelBn: 'জেমিনি এআই টিউটর', labelEn: 'Gemini AI Tutor', icon: MessageSquare },
    { id: 'code', labelBn: 'কোডিং মেন্টর', labelEn: 'Code Mentor', icon: Code2 },
    { id: 'image', labelBn: 'এআই সাইন্স ডায়াগ্রাম', labelEn: 'AI Diagrams', icon: ImageIcon },
    { id: 'prompts', labelBn: 'প্রম্পট লাইব্রেরি', labelEn: 'Prompt Lab', icon: Lightbulb },
    { id: 'legal', labelBn: 'প্যাটেন্ট ও আইনি গাইড', labelEn: 'IP & Legal', icon: Scale },
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
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  MATI AI (মাটি এআই)
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

          {/* Right Action Items: Eye Protection, Lang Toggle & Server Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3 relative">
            
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isEyeCareMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 border-[#2D3139]'
                }`}
                title="চোখের সুরক্ষা ও নাইট রিডিং ফিল্টার"
              >
                <Eye className={`w-3.5 h-3.5 ${isEyeCareMode ? 'text-amber-400 animate-pulse' : 'text-amber-300'}`} />
                <span className="hidden sm:inline">
                  {isEyeCareMode ? (lang === 'bn' ? 'চোখের সুরক্ষা অন' : 'Eye Care ON') : (lang === 'bn' ? 'চোখের সুরক্ষা' : 'Eye Care')}
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
                      ? 'দীর্ঘ সময় পড়ার সুবিধার্থে ক্ষতিকর নীল আলো কমিয়ে স্ক্রিনকে চোখের জন্য আরামদায়ক ওয়ার্ম ফিল্টারে রূপান্তর করুন।'
                      : 'Reduces blue light radiation to prevent eye fatigue during long study sessions.'}
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 transition-all shadow-md active:scale-95"
              title="সিস্টেম ম্যানুয়েল ও পিডিএফ সেভ করুন"
            >
              <FileText className="w-4 h-4 text-black shrink-0" />
              <span>{lang === 'bn' ? '📄 ম্যানুয়েল পিডিএফ' : '📄 Doc PDF'}</span>
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

            <div id="server-status-badge" className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#13161C] text-green-400 border border-[#2D3139]">
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

      <SystemDocumentationModal
        isOpen={showSystemDocModal}
        onClose={() => setShowSystemDocModal(false)}
        lang={lang}
      />
    </header>
  );
};
