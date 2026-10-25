import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { StudySuite } from './components/StudySuite';
import { ExtendedEduHub } from './components/ExtendedEduHub';
import { OfflineDownloadHub } from './components/OfflineDownloadHub';
import { EduFeePaymentGateway } from './components/EduFeePaymentGateway';
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
  const [activeTab, setActiveTab] = useState<string>('chat');
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
      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        {/* Universal Back-to-Chat / Close Feature Bar when in sub-modules */}
        {activeTab !== 'chat' && (
          <div className="max-w-6xl mx-auto mb-3 p-2.5 bg-gradient-to-r from-[#13161C] via-[#1A1F2C] to-[#13161C] border border-blue-500/50 rounded-2xl flex items-center justify-between gap-2 shadow-2xl">
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>
                {lang === 'bn'
                  ? 'বর্তমান ফিচার পেজ সক্রিয় আছে। চ্যাট করতে বা পেইজ বন্ধ করতে বোতাম চাপুন:'
                  : 'Active feature workspace. Return to AI Chat or close page:'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-black shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 shrink-0 border border-red-400/30"
            >
              <span>{lang === 'bn' ? '✕ পেইজটি বন্ধ করুন / চ্যাটে ফিরে যান' : '✕ Close Page / Back to Chat'}</span>
            </button>
          </div>
        )}

        {activeTab === 'video_quiz' && <VideoQuizStudio lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'study' && <ExtendedEduHub lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'offline' && <OfflineDownloadHub lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'payments' && <EduFeePaymentGateway lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'projector' && <ProjectorClassroom lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'business' && <BusinessEntrepreneurLab lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'kids_art' && <KidsArtFunZone lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'teacher_student' && <TeacherStudentHub lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'sports' && <SportsHub lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'chat' && <ChatWorkspace lang={lang} />}
        {activeTab === 'code' && <CodeTutor lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'image' && <ImageStudio lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'prompts' && (
          <PromptLab lang={lang} onSelectPrompt={handleSelectPromptFromLab} onClose={() => setActiveTab('chat')} />
        )}
        {activeTab === 'legal' && <LegalOwnershipSuite lang={lang} onClose={() => setActiveTab('chat')} />}
        {activeTab === 'deploy' && <VmDeployGuide lang={lang} onClose={() => setActiveTab('chat')} />}
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

