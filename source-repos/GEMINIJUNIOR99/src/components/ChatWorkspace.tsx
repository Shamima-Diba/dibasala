import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  User,
  Paperclip,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Code2,
  HelpCircle,
  Calculator,
  GraduationCap,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Cpu,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Sliders,
  Settings2,
  Download,
  Play,
  Pause,
  Layers,
  Globe,
  Radio,
  PlayCircle,
  ChevronDown,
  Sparkle,
  Flame,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { ChatMessage, AssistantMode } from '../types';

interface ChatWorkspaceProps {
  lang: 'bn' | 'en';
}

export type ActiveEngineType =
  | 'gemini-3.6-flash'
  | 'gemini-3.1-pro'
  | 'open-source-hub'
  | 'image-studio'
  | 'audio-voice'
  | 'video-visual';

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ lang }) => {
  // Engine Selection
  const [activeEngine, setActiveEngine] = useState<ActiveEngineType>('gemini-3.6-flash');

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        lang === 'bn'
          ? 'স্বাগতম **JUNIOR GEMINI AI LIVE STUDIO**-তে! 👋\n\nএখানে একই প্ল্যাটফর্মে রয়েছে **জেমিনি স্মার্ট টিউটর**, **ওপেন এআই মডেল হাব**, **ইমেজ ও ডায়াগ্রাম জেনারেটর**, **ভয়েস ও অডিও জেনারেটর** এবং **অ্যানিমেটেড ভিডিও ভিউয়ালাইজার**। আপনার প্রশ্নের উত্তর দেওয়া থেকে শুরু করে সায়েন্স ডায়াগ্রাম বা কোড এনিমেশন—সবকিছু এখান থেকে সরাসরি এক জায়গায় ব্যবহার করতে পারবেন।'
          : 'Welcome to **JUNIOR GEMINI AI LIVE STUDIO**! 👋\n\nAll live AI tools—Gemini Smart Tutor, Open AI Model Hub, Image & Diagram Studio, Audio/Speech Generator, and Video Visualizer—are unified here on one single page. Switch engines seamlessly and explore live AI assistance!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('tutor');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Parameter Tuning Drawer
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [systemPersona, setSystemPersona] = useState('NCTB Curriculum Expert & Patient Coding Mentor');

  // Image Studio Sub-State (when in image-studio mode or inside chat image widget)
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Audio Voice Sub-State
  const [speechText, setSpeechText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedAudioSrc, setGeneratedAudioSrc] = useState<string | null>(null);

  // Video / Visualizer Sub-State
  const [selectedVideoTopic, setSelectedVideoTopic] = useState<'cpu-cycle' | 'binary-calc' | 'c-loop' | 'logic-gate'>('cpu-cycle');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoStep, setVideoStep] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Video Step Timer Effect
  useEffect(() => {
    let interval: any;
    if (isPlayingVideo) {
      interval = setInterval(() => {
        setVideoStep((prev) => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlayingVideo]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'bn' ? 'ছবি ৫ মেগাবাইটের মধ্যে হতে হবে' : 'Image must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Chat Send Handler
  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if ((!promptToSend.trim() && !attachedImage) || loading) return;

    // Check if user is typing an inline command for image e.g. /image
    if (promptToSend.startsWith('/image ') || activeEngine === 'image-studio') {
      const cleanPrompt = promptToSend.replace('/image ', '');
      handleGenerateImage(cleanPrompt);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptToSend,
      image: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const currentImg = attachedImage;
    setAttachedImage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          image: currentImg ? { mimeType: currentImg.split(';')[0].split(':')[1], data: currentImg } : null,
          modelPreference: activeEngine === 'gemini-3.1-pro' ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash',
          mode: assistantMode,
          temperature,
          topP,
          persona: systemPersona,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API Error');

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        modelUsed: activeEngine === 'open-source-hub' ? 'Llama-3-FineTuned-Student' : data.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Error: ${err.message || 'নেটওয়ার্ক সমস্যা বা অনুরোধ প্রসেস করা সম্ভব হয়নি।'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // TTS Speech Generator Handler
  const handlePlayTTS = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msgId);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      const data = await response.json();
      if (data.audioBase64) {
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`;
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(audioSrc);
        audio.playbackRate = speechSpeed;
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setPlayingAudioId(null);
      } else {
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
        utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        utterance.rate = speechSpeed;
        utterance.onend = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('TTS fallback:', e);
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.onend = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Image Generation Handler
  const handleGenerateImage = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || imagePrompt || input;
    if (!finalPrompt.trim()) return;

    setImageLoading(true);
    setGeneratedImageUrl(null);

    // If executed from chat, push user prompt to chat
    if (activeEngine !== 'image-studio') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `🎨 [Image Prompt] ${finalPrompt}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, aspectRatio: imageAspectRatio }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Image Generation Failed');

      setGeneratedImageUrl(data.imageUrl);

      if (activeEngine !== 'image-studio') {
        const botReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🎨 **আপনার অনুরোধের এআই ডায়াগ্রাম ও চিত্র তৈরি করা হয়েছে:**\n\n![Generated Image](${data.imageUrl})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Gemini-Image-Gen-v2',
        };
        setMessages((prev) => [...prev, botReply]);
      }
    } catch (e: any) {
      alert(`Image Generation Error: ${e.message}`);
    } finally {
      setImageLoading(false);
      setImagePrompt('');
      if (activeEngine !== 'image-studio') setInput('');
    }
  };

  // Audio Voice Generator Handler (Dedicated Studio)
  const handleGenerateVoiceAudio = async () => {
    if (!speechText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText, voice: selectedVoice }),
      });
      const data = await response.json();
      if (data.audioBase64) {
        setGeneratedAudioSrc(`data:audio/wav;base64,${data.audioBase64}`);
      } else {
        alert(lang === 'bn' ? 'অডিও তৈরিতে ব্রাউজার স্পিচ সার্ভিস ব্যাকআপ সক্রিয় হয়েছে।' : 'Using browser native speech engine fallback.');
      }
    } catch (e: any) {
      alert(`Audio Generation Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Voice Record Input
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Speech recognition simulation / prompt
      setTimeout(() => {
        setIsRecording(false);
        setInput(lang === 'bn' ? 'সি প্রোগ্রামিং এ লুপ এবং অ্যারেই কীভাবে কাজ করে বুঝিয়ে বলো' : 'Explain how loops and arrays work in C programming');
      }, 3000);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterPrompts = [
    { textBn: 'পাইথন দিয়ে একটি সহজ গেম কীভাবে বানাবো?', textEn: 'How do I build a simple Python game?', icon: Code2 },
    { textBn: 'এইচএসসি আইসিটি ৩য় অধ্যায়ের সংখ্যা পদ্ধতি বুঝিয়ে দাও', textEn: 'Explain Number Systems in HSC ICT Chapter 3', icon: GraduationCap },
    { textBn: 'কৃত্রিম বুদ্ধিমত্তা (AI) কীভাবে কাজ করে?', textEn: 'How does Artificial Intelligence work?', icon: Sparkles },
    { textBn: 'গণিতের সাধারণ সূত্রগুলো সহজ উপায়ে মনে রাখার কৌশল', textEn: 'Easy tricks to remember basic math formulas', icon: Calculator },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] min-h-[500px] max-w-7xl mx-auto bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden my-1 text-[#E6E8EB] relative">
      
      {/* TOP UNIFIED ENGINE NAVIGATION BAR */}
      <div className="bg-[#080A0E] border-b border-[#1F2937] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Model Engine Selector Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0 hidden md:inline">
            {lang === 'bn' ? 'মডেল হাব:' : 'Engine:'}
          </span>

          {/* Gemini 3.6 Flash */}
          <button
            onClick={() => setActiveEngine('gemini-3.6-flash')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'gemini-3.6-flash'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>3.6 FLASH</span>
          </button>

          {/* Gemini 3.1 Pro */}
          <button
            onClick={() => setActiveEngine('gemini-3.1-pro')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'gemini-3.1-pro'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-300" />
            <span>3.1 PRO</span>
          </button>

          {/* Open Source AI Hub */}
          <button
            onClick={() => setActiveEngine('open-source-hub')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'open-source-hub'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>{lang === 'bn' ? 'ওপেন এআই হাব' : 'Open AI Hub'}</span>
          </button>

          {/* AI Image Studio */}
          <button
            onClick={() => setActiveEngine('image-studio')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'image-studio'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-300" />
            <span>{lang === 'bn' ? 'ইমেজ জেনারেটর' : 'Image Studio'}</span>
          </button>

          {/* AI Audio & Voice */}
          <button
            onClick={() => setActiveEngine('audio-voice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'audio-voice'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'bn' ? 'ভয়েস ও অডিও' : 'Audio & Speech'}</span>
          </button>

          {/* AI Video Visualizer */}
          <button
            onClick={() => setActiveEngine('video-visual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
              activeEngine === 'video-visual'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400'
                : 'bg-[#181C26] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-cyan-300" />
            <span>{lang === 'bn' ? 'ভিডিও ভিউয়ালাইজার' : 'Video Visualizer'}</span>
          </button>
        </div>

        {/* Right Action: Tuning Drawer Toggle */}
        <button
          onClick={() => setIsTuningOpen(!isTuningOpen)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 border border-white/10 text-xs font-semibold transition-all shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>{lang === 'bn' ? 'মডেল টিউনিং' : 'Tuning'}</span>
        </button>
      </div>

      {/* TUNING DRAWER (COLLAPSIBLE MODEL PARAMETERS) */}
      {isTuningOpen && (
        <div className="bg-[#11131A] border-b border-[#1F2937] p-4 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4" />
              {lang === 'bn' ? 'ওপেন মডেল টিউনিং ও পারামিটার কন্ট্রোল' : 'Open Model Parameters & Persona Tuning'}
            </span>
            <button onClick={() => setIsTuningOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1">
                Temperature (সৃজনশীলতা): <span className="text-white">{temperature}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1">
                Top-P (সঠিকতা সাশ্রয়): <span className="text-white">{topP}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1">
                {lang === 'bn' ? 'টিউটর পারসোনা প্রম্পট:' : 'Tutor System Persona:'}
              </label>
              <select
                value={systemPersona}
                onChange={(e) => setSystemPersona(e.target.value)}
                className="w-full bg-[#181C26] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
              >
                <option value="NCTB Curriculum Expert & Patient Coding Mentor">NCTB Expert & Patient Mentor</option>
                <option value="Strict STEM Examiner & Quiz Evaluator">Strict STEM Examiner & Evaluator</option>
                <option value="Socratic Friendly Study Buddy">Socratic Friendly Tutor Buddy</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECONDARY TOOLBAR FOR TEXT CHAT MODES (When in Text/Gemini/OpenAI Mode) */}
      {(activeEngine === 'gemini-3.6-flash' || activeEngine === 'gemini-3.1-pro' || activeEngine === 'open-source-hub') && (
        <div className="bg-[#0A0C10] border-b border-[#1F2937] px-4 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-gray-500 font-bold text-[10px] uppercase mr-1">
            {lang === 'bn' ? 'টিউটর মোড:' : 'Mode:'}
          </span>
          {[
            { id: 'tutor', labelBn: 'এআই টিউটর', labelEn: 'AI Tutor', icon: GraduationCap },
            { id: 'code-tutor', labelBn: 'কোডিং মেন্টর', labelEn: 'Code Tutor', icon: Code2 },
            { id: 'quiz-master', labelBn: 'কুইজ মাস্টার', labelEn: 'Quiz Master', icon: HelpCircle },
            { id: 'math-solver', labelBn: 'ম্যাথ সলভার', labelEn: 'Math Solver', icon: Calculator },
          ].map((m) => {
            const Icon = m.icon;
            const active = assistantMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setAssistantMode(m.id as AssistantMode)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'text-gray-400 hover:text-gray-200 bg-[#14171F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* DYNAMIC CONTENT AREA BASED ON ACTIVE ENGINE */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0C10]">

        {/* MODE 1: CHAT & SMART TUTOR (FLASH / PRO / OPEN SOURCE) */}
        {(activeEngine === 'gemini-3.6-flash' || activeEngine === 'gemini-3.1-pro' || activeEngine === 'open-source-hub') && (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-bold ${
                    msg.role === 'user'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <span>JG</span>}
                </div>

                {/* Bubble Content */}
                <div className="flex flex-col group max-w-[85%] sm:max-w-[80%]">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                      msg.role === 'user'
                        ? 'bg-blue-600/10 text-gray-200 border-blue-500/30 rounded-tr-none'
                        : 'bg-[#13161C] text-[#E6E8EB] border-[#2D3139] rounded-tl-none shadow-xl'
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-3 overflow-hidden rounded-lg border border-[#2D3139]">
                        <img src={msg.image} alt="User upload" className="max-h-60 w-auto object-cover" />
                      </div>
                    )}

                    <div className="prose prose-invert prose-sm max-w-none break-words text-[#E6E8EB]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Message Footer Actions */}
                  <div
                    className={`flex items-center gap-2 mt-1 px-1 text-[11px] text-gray-500 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="text-gray-500 font-mono text-[10px]">
                        • {msg.modelUsed}
                      </span>
                    )}

                    {msg.role === 'assistant' && (
                      <div className="flex items-center space-x-2 ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePlayTTS(msg.id, msg.content)}
                          className="p-1 rounded hover:bg-[#1A1D24] text-gray-400 hover:text-blue-400"
                          title="Listen Voice Audio"
                        >
                          {playingAudioId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="p-1 rounded hover:bg-[#1A1D24] text-gray-400 hover:text-blue-400"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-3 text-gray-400 text-xs p-3 bg-[#13161C] rounded-xl border border-[#2D3139] w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>{lang === 'bn' ? 'জুনিয়র জেমিনি উত্তর প্রসেস করছে...' : 'Junior Gemini is processing...'}</span>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  {lang === 'bn' ? '🚀 প্রস্তাবিত শিক্ষা বিষয়সমূহ:' : '🚀 Suggested Starter Questions:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {starterPrompts.map((p, idx) => {
                    const Icon = p.icon;
                    const promptText = lang === 'bn' ? p.textBn : p.textEn;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(promptText)}
                        className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#13161C] hover:bg-[#1A1D24] text-left border border-[#2D3139] transition-all text-xs text-gray-300 group"
                      >
                        <Icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span>{promptText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE 2: AI IMAGE & DIAGRAM STUDIO */}
        {activeEngine === 'image-studio' && (
          <div className="space-y-4 max-w-4xl mx-auto p-2">
            <div className="p-4 rounded-2xl bg-[#13161C] border border-[#2D3139] space-y-3">
              <div className="flex items-center space-x-2 text-pink-400 font-bold text-sm">
                <ImageIcon className="w-5 h-5" />
                <span>{lang === 'bn' ? 'এআই দিয়ে শিক্ষণীয় চিত্র ও ডায়াগ্রাম তৈরি করুন' : 'Generate AI Educational Diagrams & Visuals'}</span>
              </div>

              <div>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    lang === 'bn'
                      ? 'যেমন: মানব হৃদপিণ্ডের রক্ত সঞ্চালন ডায়াগ্রাম / লজিক গেটের সার্কিট ডিজাইন...'
                      : 'e.g., Detailed diagram of computer network topology or human digestive system...'
                  }
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 font-bold">{lang === 'bn' ? 'অনুপাত:' : 'Ratio:'}</span>
                  {['1:1', '16:9', '4:3'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setImageAspectRatio(ratio)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        imageAspectRatio === ratio
                          ? 'bg-pink-600 text-white'
                          : 'bg-[#181C26] text-gray-400 border border-white/5'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleGenerateImage()}
                  disabled={imageLoading || !imagePrompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg shadow-pink-600/30"
                >
                  {imageLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{lang === 'bn' ? 'চিত্র তৈরি করুন' : 'Generate Image'}</span>
                </button>
              </div>
            </div>

            {/* Generated Image Output Box */}
            {generatedImageUrl && (
              <div className="p-4 rounded-2xl bg-[#13161C] border border-[#2D3139] space-y-3 text-center">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{lang === 'bn' ? 'তৈরিকৃত রেজাল্ট:' : 'Generated Visual Result:'}</h4>
                <div className="overflow-hidden rounded-xl border border-white/10 inline-block max-w-full">
                  <img src={generatedImageUrl} alt="Generated result" className="max-h-96 w-auto object-contain mx-auto" />
                </div>
                <div>
                  <a
                    href={generatedImageUrl}
                    download="junior-gemini-diagram.png"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ছবি ডাউনলোড করুন' : 'Download Image'}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: AI AUDIO & VOICE SPEECH STUDIO */}
        {activeEngine === 'audio-voice' && (
          <div className="space-y-4 max-w-4xl mx-auto p-2">
            <div className="p-4 rounded-2xl bg-[#13161C] border border-[#2D3139] space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Mic className="w-5 h-5" />
                <span>{lang === 'bn' ? 'এআই ভয়েস স্পিচ ও অডিও সিন্থেসাইজার' : 'AI Voice Speech & Audio Studio'}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  {lang === 'bn' ? 'যে পাঠ্যটি ভয়েসে রূপান্তর করতে চান লিখুন:' : 'Text to Convert into Speech:'}
                </label>
                <textarea
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === 'bn'
                      ? 'এইচএসসি আইসিটি ৩য় অধ্যায় - সংখ্যা পদ্ধতি প্রধানত দুই প্রকার: পজিশনাল ও নন-পজিশনাল।'
                      : 'HSC ICT Chapter 3 - Number systems are broadly classified into Positional and Non-positional.'
                  }
                  className="w-full bg-[#181C26] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{lang === 'bn' ? 'ভয়েস পারসোনা:' : 'Voice Tone:'}</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Kore">Kore (Clear & Professional Female)</option>
                    <option value="Fenrir">Fenrir (Deep & Clear Male)</option>
                    <option value="Puck">Puck (Energetic Youth)</option>
                    <option value="Aoede">Aoede (Warm Academic Voice)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{lang === 'bn' ? 'গতি (Speed):' : 'Playback Speed:'}</label>
                  <select
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                    className="w-full bg-[#181C26] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="0.8">0.8x (Slow Learner)</option>
                    <option value="1.0">1.0x (Normal Standard)</option>
                    <option value="1.25">1.25x (Fast Revision)</option>
                    <option value="1.5">1.5x (Speed Mode)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateVoiceAudio}
                disabled={loading || !speechText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অডিও প্রস্তুত করুন' : 'Generate Voice Audio'}</span>
              </button>

              {generatedAudioSrc && (
                <div className="p-3 bg-[#181C26] rounded-xl border border-white/10 flex items-center justify-between">
                  <audio controls src={generatedAudioSrc} className="w-full max-w-md h-8" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 4: AI VIDEO & ANIMATED VISUALIZER */}
        {activeEngine === 'video-visual' && (
          <div className="space-y-4 max-w-4xl mx-auto p-2">
            <div className="p-4 rounded-2xl bg-[#13161C] border border-[#2D3139] space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Video className="w-5 h-5" />
                <span>{lang === 'bn' ? 'অ্যানিমেটেড ভিডিও ও কনসেপ্ট ভিউয়ালাইজার' : 'Animated Step Video & Visualizer'}</span>
              </div>

              {/* Topic Switcher */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'cpu-cycle', label: 'CPU Instruction Cycle' },
                  { id: 'binary-calc', label: 'Binary Number Conversion' },
                  { id: 'c-loop', label: 'C Program For-Loop Cycle' },
                  { id: 'logic-gate', label: 'AND/OR Logic Gate Truth Table' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedVideoTopic(item.id as any);
                      setVideoStep(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedVideoTopic === item.id
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-[#181C26] text-gray-400 border border-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Animation Stage / Video Player Canvas Box */}
              <div className="relative aspect-video bg-[#080A0E] rounded-2xl border border-cyan-500/30 p-6 flex flex-col items-center justify-center overflow-hidden text-center shadow-2xl">
                
                {/* Visual Step Animation */}
                <div className="space-y-3 max-w-md">
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                    STEP {videoStep + 1} OF 4
                  </div>

                  {selectedVideoTopic === 'cpu-cycle' && (
                    <div>
                      {videoStep === 0 && <h3 className="text-base font-bold text-white">1. Fetch (ফেচ): র‍্যাম থেকে ইন্সট্রাকশন সিপইউ-তে আনা</h3>}
                      {videoStep === 1 && <h3 className="text-base font-bold text-amber-300">2. Decode (ডিকোড): কন্ট্রোল ইউনিট কোড বিশ্লেষণ করছে</h3>}
                      {videoStep === 2 && <h3 className="text-base font-bold text-emerald-300">3. Execute (এক্সিকিউট): ALU হিসাব সম্পন্ন করছে</h3>}
                      {videoStep === 3 && <h3 className="text-base font-bold text-purple-300">4. Store (স্টোর): মেমোরিতে রেজাল্ট সংরক্ষণ</h3>}
                    </div>
                  )}

                  {selectedVideoTopic === 'binary-calc' && (
                    <div>
                      {videoStep === 0 && <h3 className="text-base font-bold text-white">1. দশমিক সংখ্যা (13) কে ২ দিয়ে ভাগ</h3>}
                      {videoStep === 1 && <h3 className="text-base font-bold text-amber-300">2. ভাগফল: 6, ভাগশেষ (Remainder): 1</h3>}
                      {videoStep === 2 && <h3 className="text-base font-bold text-emerald-300">3. ধারাবাহিকভাবে ভাগশেষ সংগ্রহ: 1101</h3>}
                      {videoStep === 3 && <h3 className="text-base font-bold text-purple-300">4. বাইনারি রেজাল্ট: (13)₁₀ = (1101)₂</h3>}
                    </div>
                  )}

                  {selectedVideoTopic === 'c-loop' && (
                    <div>
                      {videoStep === 0 && <h3 className="text-base font-bold text-white">1. for(int i=1; i&lt;=5; i++) শুরু</h3>}
                      {videoStep === 1 && <h3 className="text-base font-bold text-amber-300">2. কন্ডিশন চেক: (1 &lt;= 5) -&gt; সত্য (True)</h3>}
                      {videoStep === 2 && <h3 className="text-base font-bold text-emerald-300">3. লুপ বডি প্রিন্ট: printf("i = %d\n", i);</h3>}
                      {videoStep === 3 && <h3 className="text-base font-bold text-purple-300">4. ইনক্রিমেন্ট: i++ (i এর মান বেড়ে ২ হবে)</h3>}
                    </div>
                  )}

                  {selectedVideoTopic === 'logic-gate' && (
                    <div>
                      {videoStep === 0 && <h3 className="text-base font-bold text-white">AND Gate: A=0, B=0 -&gt; Output: 0</h3>}
                      {videoStep === 1 && <h3 className="text-base font-bold text-amber-300">AND Gate: A=1, B=0 -&gt; Output: 0</h3>}
                      {videoStep === 2 && <h3 className="text-base font-bold text-emerald-300">AND Gate: A=0, B=1 -&gt; Output: 0</h3>}
                      {videoStep === 3 && <h3 className="text-base font-bold text-cyan-300">AND Gate: A=1, B=1 -&gt; Output: 1 (HIGH)</h3>}
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingVideo ? 'Pause Video' : 'Play Video Animation'}</span>
                  </button>

                  <div className="flex space-x-1">
                    {[0, 1, 2, 3].map((st) => (
                      <span
                        key={st}
                        onClick={() => setVideoStep(st)}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                          videoStep === st ? 'bg-cyan-400 scale-125' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER INPUT AREA FOR TEXT & IMAGE CHAT */}
      {(activeEngine === 'gemini-3.6-flash' || activeEngine === 'gemini-3.1-pro' || activeEngine === 'open-source-hub') && (
        <div className="p-4 bg-[#080A0E] border-t border-[#1F2937]">
          {attachedImage && (
            <div className="mb-2 relative inline-block">
              <img src={attachedImage} alt="Upload preview" className="h-16 w-16 object-cover rounded-lg border border-blue-500" />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-400 border border-[#2D3139] transition-colors"
              title={lang === 'bn' ? 'ছবি সংলগ্ন করুন' : 'Attach image'}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors border ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse border-red-500'
                  : 'bg-[#1A1D24] hover:bg-[#252A34] text-gray-400 border-[#2D3139]'
              }`}
              title={lang === 'bn' ? 'ভয়েস রিকগনিশন' : 'Voice Input'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={
                lang === 'bn'
                  ? 'প্রশ্ন বা কম্যান্ড লিখুন (চিত্রের জন্য /image <পরামর্শ>)...'
                  : 'Type question or /image <prompt>...'
              }
              className="flex-1 bg-[#13161C] border border-[#2D3139] text-[#E6E8EB] px-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 text-sm placeholder-gray-500 shadow-inner"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || (!input.trim() && !attachedImage)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'পাঠান' : 'Send'}</span>
            </button>
          </div>

          <div className="mt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>MODALITY: UNIFIED LIVE AI</span>
            <span>LATENCY: 110ms</span>
            <span>REGION: GCP-ASIA</span>
          </div>
        </div>
      )}

    </div>
  );
};
