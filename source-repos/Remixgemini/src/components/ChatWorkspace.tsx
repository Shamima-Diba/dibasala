import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Bot,
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
  Cpu
} from 'lucide-react';
import { ChatMessage, AssistantMode } from '../types';

interface ChatWorkspaceProps {
  lang: 'bn' | 'en';
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: lang === 'bn'
        ? 'স্বাগতম! আমি **JUNIOR GEMINI (জুনিয়র জেমিনি)**।\nগুগল জেমিনি এআই দিয়ে পরিচালিত আপনার নিজস্ব এআই শিক্ষক ও টিউটর। যেকোনো বিষয়ে প্রশ্ন করুন—প্রোগ্রামিং, আইসিটি, গণিত, বিজ্ঞান বা ইংরেজি শিখতে আমি প্রস্তুত।'
        : 'Welcome! I am **JUNIOR GEMINI**, your personal AI teacher powered by Google Gemini. Ask me anything about programming, ICT, math, science, or learning!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('tutor');
  const [modelPref, setModelPref] = useState<'gemini-3.6-flash' | 'gemini-3.1-pro-preview'>('gemini-3.6-flash');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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

  // Send Message
  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if ((!promptToSend.trim() && !attachedImage) || loading) return;

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
          modelPreference: modelPref,
          mode: mode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        modelUsed: data.modelUsed,
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
          content: `⚠️ Error: ${err.message || 'নেটওয়ার্ক সমস্যা বা API কী ভুল রয়েছে।'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // TTS Speech Playback
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
        body: JSON.stringify({ text, voice: 'Kore' }),
      });

      const data = await response.json();
      if (data.audioBase64) {
        // Convert base64 to audio blob or play directly
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`;
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setPlayingAudioId(null);
      } else {
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
        utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        utterance.onend = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('TTS error, using fallback:', e);
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.onend = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
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
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden my-2">
      
      {/* Top Toolbar: Mode & Model Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#080A0E] border-b border-[#1F2937] text-xs font-medium">
        
        {/* Mode Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
            {lang === 'bn' ? 'মোড:' : 'Mode:'}
          </span>
          {[
            { id: 'tutor', labelBn: 'এআই টিউটর', labelEn: 'AI Tutor', icon: GraduationCap },
            { id: 'code-tutor', labelBn: 'কোডিং মেন্টর', labelEn: 'Code Tutor', icon: Code2 },
            { id: 'quiz-master', labelBn: 'কুইজ মাস্টার', labelEn: 'Quiz Master', icon: HelpCircle },
            { id: 'math-solver', labelBn: 'ম্যাথ সলভার', labelEn: 'Math Solver', icon: Calculator },
          ].map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as AssistantMode)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                  active
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 bg-[#1A1D24]/60 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Model Toggle */}
        <div className="flex items-center space-x-1 bg-[#1A1D24] p-1 rounded-lg border border-[#2D3139]">
          <button
            onClick={() => setModelPref('gemini-3.6-flash')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors ${
              modelPref === 'gemini-3.6-flash'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Gemini 3.6 Flash (Fast & Efficient)"
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>3.6 FLASH</span>
          </button>
          <button
            onClick={() => setModelPref('gemini-3.1-pro-preview')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors ${
              modelPref === 'gemini-3.1-pro-preview'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Gemini 3.1 Pro (Deep Reasoning & STEM)"
          >
            <Cpu className="w-3 h-3 text-cyan-300" />
            <span>3.1 PRO</span>
          </button>
        </div>

      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0C10]">
        
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
              {msg.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <span>JG</span>
              )}
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
                {/* User uploaded image preview */}
                {msg.image && (
                  <div className="mb-3 overflow-hidden rounded-lg border border-[#2D3139]">
                    <img src={msg.image} alt="User upload" className="max-h-60 w-auto object-cover" />
                  </div>
                )}

                {/* Markdown text */}
                <div className="prose prose-invert prose-sm max-w-none break-words text-[#E6E8EB]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {/* Message footer / controls */}
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

                {/* Assistant Audio / Copy Buttons */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-2 ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayTTS(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-[#1A1D24] text-gray-400 hover:text-blue-400"
                      title="Listen audio"
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
                      title="Copy message"
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

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-3 text-gray-400 text-xs p-3 bg-[#13161C] rounded-xl border border-[#2D3139] w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            <span>{lang === 'bn' ? 'জুনিয়র জেমিনি চিন্তা করছে...' : 'Junior Gemini is processing...'}</span>
          </div>
        )}

        {/* Starter Prompt Cards on empty message list */}
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

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#080A0E] border-t border-[#1F2937]">
        
        {/* Attached image preview */}
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
            title={lang === 'bn' ? 'ছবি যুক্ত করুন' : 'Attach image'}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={
              lang === 'bn'
                ? 'জুনিয়র জেমিনিকে প্রশ্ন করুন (বাংলা বা ইংরেজি)...'
                : 'Ask Junior Gemini anything...'
            }
            className="flex-1 bg-[#13161C] border border-[#2D3139] text-[#E6E8EB] px-5 py-3 rounded-2xl focus:outline-none focus:border-blue-500 text-sm placeholder-gray-500 shadow-inner"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || (!input.trim() && !attachedImage)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === 'bn' ? 'পাঠান' : 'Send'}
            </span>
          </button>
        </div>

        <div className="mt-2.5 flex justify-center gap-6 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          <span>LATENCY: 110ms</span>
          <span>QUOTA SAVER: ACTIVE</span>
          <span>VM REGION: GCP-ASIA</span>
        </div>
      </div>

    </div>
  );
};
