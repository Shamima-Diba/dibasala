import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChatWorkspace } from './components/ChatWorkspace';
import { StudySuite } from './components/StudySuite';
import { LearningProgress } from './components/LearningProgress';
import { OfflineHub } from './components/OfflineHub';
import { OpenSourceAiHub } from './components/OpenSourceAiHub';
import { CodeTutor } from './components/CodeTutor';
import { ImageStudio } from './components/ImageStudio';
import { PromptLab } from './components/PromptLab';
import { VmDeployGuide } from './components/VmDeployGuide';
import { AuthModal, StudentProfile } from './components/AuthModal';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('junior_gemini_student_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn('Failed to load user profile');
    }
  }, []);

  const handleLogin = (user: StudentProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('junior_gemini_student_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user profile');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('junior_gemini_student_user');
    } catch (e) {
      console.warn('Failed to remove user profile');
    }
  };

  const handleSelectPromptFromLab = (promptText: string) => {
    setSelectedPrompt(promptText);
    setActiveTab('chat');
  };

  return (
    <div id="junior-gemini-root" className="min-h-screen bg-[#0A0C10] text-[#E6E8EB] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sleek Top Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-2">
        {activeTab === 'dashboard' && (
          <Dashboard
            lang={lang}
            currentUser={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
        {activeTab === 'chat' && <ChatWorkspace lang={lang} />}
        {activeTab === 'study' && <StudySuite lang={lang} />}
        {activeTab === 'offline' && <OfflineHub lang={lang} />}
        {activeTab === 'opensource' && <OpenSourceAiHub lang={lang} />}
        {activeTab === 'progress' && <LearningProgress lang={lang} />}
        {activeTab === 'code' && <CodeTutor lang={lang} />}
        {activeTab === 'image' && <ImageStudio lang={lang} />}
        {activeTab === 'prompts' && (
          <PromptLab lang={lang} onSelectPrompt={handleSelectPromptFromLab} />
        )}
        {activeTab === 'deploy' && <VmDeployGuide lang={lang} />}
      </main>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Sleek Footer */}
      <footer id="app-footer" className="bg-[#080A0E] border-t border-[#1F2937] py-3 text-center text-[11px] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <span className="font-bold tracking-wider text-gray-300">JUNIOR GEMINI</span>
            <span>— {lang === 'bn' ? 'সকলের জন্য নিরবচ্ছিন্ন মুক্ত এআই শিক্ষা' : 'Accessible AI Education for Everyone'}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-400">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
              🔒 100% Privacy & Safety Compliant
            </span>
            <div className="flex items-center space-x-1">
              <span>{lang === 'bn' ? 'বাংলাদেশের শিক্ষার্থীদের জন্য নিবেদিত' : 'Empowering Rural AI Learners in Bangladesh'}</span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

