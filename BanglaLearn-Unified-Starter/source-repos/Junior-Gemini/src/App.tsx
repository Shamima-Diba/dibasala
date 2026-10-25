import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { StudySuite } from './components/StudySuite';
import { CodeTutor } from './components/CodeTutor';
import { ImageStudio } from './components/ImageStudio';
import { PromptLab } from './components/PromptLab';
import { LegalOwnershipSuite } from './components/LegalOwnershipSuite';
import { VmDeployGuide } from './components/VmDeployGuide';
import { KidsArtFunZone } from './components/KidsArtFunZone';
import { TeacherStudentHub } from './components/TeacherStudentHub';
import { SportsHub } from './components/SportsHub';
import { VideoQuizStudio } from './components/VideoQuizStudio';
import { ProjectorClassroom } from './components/ProjectorClassroom';
import { BusinessEntrepreneurLab } from './components/BusinessEntrepreneurLab';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('video_quiz');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Eye Protection Warm Lighting State
  const [isEyeCareMode, setIsEyeCareMode] = useState<boolean>(true); // Default ON for eye comfort
  const [eyeCareWarmth, setEyeCareWarmth] = useState<number>(35); // Comfortable amber warm light %

  const handleSelectPromptFromLab = (promptText: string) => {
    setSelectedPrompt(promptText);
    setActiveTab('chat');
  };

  return (
    <div
      id="junior-gemini-root"
      className="min-h-screen bg-[#0A0C10] text-[#E6E8EB] flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-all duration-300 relative"
      style={
        isEyeCareMode
          ? {
              filter: `sepia(${eyeCareWarmth}%) hue-rotate(-10deg) contrast(96%) brightness(96%)`,
            }
          : {}
      }
    >
      {/* Eye Protection Banner Notification if active */}
      {isEyeCareMode && (
        <div className="bg-[#19140C] border-b border-amber-500/30 px-4 py-1 text-center text-[11px] text-amber-300 font-medium flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>
            {lang === 'bn'
              ? '👁️ চোখের সুরক্ষা ও আই-প্রোটেকশন নাইট ফিল্টার সক্রিয় আছে (দীর্ঘক্ষণ স্ক্রিনে পড়লেও চোখের ক্লান্তি হবে না)'
              : '👁️ Eye-Care Blue Light Filter Active (Protects eyes during long study sessions)'}
          </span>
        </div>
      )}

      {/* Sleek Top Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isEyeCareMode={isEyeCareMode}
        setIsEyeCareMode={setIsEyeCareMode}
        eyeCareWarmth={eyeCareWarmth}
        setEyeCareWarmth={setEyeCareWarmth}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-2">
        {activeTab === 'video_quiz' && <VideoQuizStudio lang={lang} />}
        {activeTab === 'projector' && <ProjectorClassroom lang={lang} />}
        {activeTab === 'business' && <BusinessEntrepreneurLab lang={lang} />}
        {activeTab === 'kids_art' && <KidsArtFunZone lang={lang} />}
        {activeTab === 'study' && <StudySuite lang={lang} />}
        {activeTab === 'teacher_student' && <TeacherStudentHub lang={lang} />}
        {activeTab === 'sports' && <SportsHub lang={lang} />}
        {activeTab === 'chat' && <ChatWorkspace lang={lang} />}
        {activeTab === 'code' && <CodeTutor lang={lang} />}
        {activeTab === 'image' && <ImageStudio lang={lang} />}
        {activeTab === 'prompts' && (
          <PromptLab lang={lang} onSelectPrompt={handleSelectPromptFromLab} />
        )}
        {activeTab === 'legal' && <LegalOwnershipSuite lang={lang} />}
        {activeTab === 'deploy' && <VmDeployGuide lang={lang} />}
      </main>

      {/* Sleek Footer */}
      <footer id="app-footer" className="bg-[#080A0E] border-t border-[#1F2937] py-3 text-center text-[11px] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <span className="font-bold tracking-wider text-emerald-400">MATI AI (মাটি এআই)</span>
            <span>— {lang === 'bn' ? 'সকলের জন্য নিরবচ্ছিন্ন মুক্ত এআই শিক্ষা' : 'Accessible AI Education for Everyone'}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <span>{lang === 'bn' ? 'বাংলাদেশের প্রান্তিক শিক্ষার্থীদের জন্য নিবেদিত' : 'Empowering Rural AI Learners in Bangladesh'}</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}
