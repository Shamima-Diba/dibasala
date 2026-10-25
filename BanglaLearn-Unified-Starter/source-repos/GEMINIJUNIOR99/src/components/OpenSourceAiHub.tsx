import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askAiStudioEngine } from '../models/aiEngine';
import {
  Sparkles,
  Zap,
  Check,
  Copy,
  Send,
  Bot,
  User,
  HeartHandshake,
  Layers,
  Cpu,
  RefreshCw,
  ShieldCheck,
  BookOpen,
  Code2,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface OpenSourceAiHubProps {
  lang: 'bn' | 'en';
}

interface OpenChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  engineInfo?: string;
  timestamp: string;
}

export const OpenSourceAiHub: React.FC<OpenSourceAiHubProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'bento' | 'chat'>('chat');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<OpenChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: lang === 'bn'
        ? 'স্বাগতম! এটি **জুনিয়র জেমিনি ওপেন এআই ড্যাশবোর্ড**।\nঅর্থনৈতিক সংকট থাকলেও কোনো শিক্ষার্থী যেন এআই শিক্ষা থেকে পিছিয়ে না পড়ে—সেজন্য এই সিস্টেমে কোনো ক্রেডিট কার্ড বা ফি ছাড়াই সরাসরি পড়াশোনা ও বিষয়ভিত্তিক উত্তর মিলবে!'
        : 'Welcome to **Junior Gemini AI Studio**!\nTo ensure no student is left behind due to financial constraints, this studio offers zero-cost, intelligent AI guidance with full Bengali & English support!',
      engineInfo: 'Powered by Google AI Studio',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: OpenChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await askAiStudioEngine(textToSend);

      const botMsg: OpenChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.reply,
        engineInfo: result.engineInfo,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: OpenChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: lang === 'bn'
          ? `⚠️ **উত্তর তৈরিতে সমস্যা হয়েছে:** ${err.message}`
          : `⚠️ **AI Engine Notice:** ${err.message}`,
        engineInfo: 'Powered by Google AI Studio',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const BENTO_FEATURES = [
    {
      titleBn: '১০০% ফ্রি শিক্ষার্থীবান্ধব এআই',
      titleEn: '100% Free Student AI',
      descBn: 'কোনো হিডেন ফি, মাসিক সাবস্ক্রিপশন বা ক্রেডিট কার্ড ছাড়াই পড়াশোনায় অবিরাম সাহায্য।',
      descEn: 'Zero monthly subscriptions, hidden fees, or credit cards required.',
      icon: HeartHandshake,
      badge: 'Zero-Cost Access',
      gradient: 'from-blue-600/20 via-purple-600/10 to-transparent border-blue-500/30'
    },
    {
      titleBn: 'সি প্রোগ্রামিং ও কোডিং মেন্টর',
      titleEn: 'C Programming & Coding Tutor',
      descBn: 'এইচএসসি ও ডিপ্লোমা শিক্ষার্থীদের জন্য লুপ, অ্যারে, পয়েন্টার ও অ্যালগরিদম শেখায়।',
      descEn: 'Master C loops, arrays, pointers, and data structures in Bengali.',
      icon: Code2,
      badge: 'Code Engine',
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent border-emerald-500/30'
    },
    {
      titleBn: 'লজিক গেট ও আইসিটি গাইড',
      titleEn: 'Logic Gates & ICT Guide',
      descBn: 'সত্যক সারণী (Truth Table), বাইনারি রূপান্তর ও ডিজিটাল ডিভাইসের পরিষ্কার ব্যাখ্যা।',
      descEn: 'Truth tables, binary conversion, and digital logic gates step-by-step.',
      icon: Cpu,
      badge: 'Logic Reasoning',
      gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent border-amber-500/30'
    },
    {
      titleBn: 'অফলাইন ও ব্যাকআপ সাপোর্ট',
      titleEn: 'Offline & Fallback System',
      descBn: 'ইন্টারনেট সমস্যা বা স্লো নেটওয়ার্কেও অ্যাপের ভেতরে অফলাইন লাইব্রেরি সচল থাকে।',
      descEn: 'In-app offline fallback library remains active even in poor network.',
      icon: Layers,
      badge: 'Always Available',
      gradient: 'from-pink-600/20 via-rose-600/10 to-transparent border-pink-500/30'
    }
  ];

  const SAMPLE_QUICK_PROMPTS = [
    { labelBn: 'C প্রোগ্রামিং লুপ', prompt: 'C প্রোগ্রামিংয়ে for loop এবং while loop এর মধ্যে পার্থক্য কী? উদাহরণসহ বুঝাও।' },
    { labelBn: 'লজিক গেট টেবিল', prompt: 'AND gate এবং OR gate এর ট্রুথ টেবিল ও বৈশিষ্ট্য সহজভাবে ব্যাখ্যা কর।' },
    { labelBn: 'বাইনারি থেকে ডেসিমেল', prompt: 'বাইনারি সংখ্যা (1101)_2 কে কীভাবে ডেসিমেল সংখ্যায় রূপান্তর করব?' },
    { labelBn: 'দ্বিপদী সমীকরণ', prompt: 'ax^2 + bx + c = 0 সমীকরণ কীভাবে সমাধান করতে হয় ধাপগুলো বুঝিয়ে দাও।' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto my-3 p-4 sm:p-6 bg-[#0B0D13]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#E6E8EB] relative overflow-hidden"
    >
      {/* Background Spatial Glow Accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1F2937]/80 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent tracking-tight">
                {lang === 'bn' ? 'স্মার্ট এআই টিউটর ও বেন্টো ড্যাশবোর্ড' : 'Smart AI Tutor & Bento Workspace'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                CURRICULUM ALIGNED
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'bn'
                ? 'সাধারণ সার্চ ইঞ্জিনের বাইরে—এনসিটিবি ও এইচএসসি সিলেবাস, সি কোডিং, লজিক গেট ও অফলাইন রিভিশনের জন্য বিশেষায়িত স্টুডেন্ট হাব'
                : 'Beyond raw web search: Tailored HSC ICT syllabus, C code execution, and offline revision suite for students'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#12151E]/90 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'এআই স্টুডিও চ্যাট' : 'AI Studio Chat'}</span>
          </button>
          <button
            onClick={() => setActiveTab('bento')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'bento'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বেন্টো বক্স ড্যাশবোর্ড' : 'Bento Box Overview'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Chat Space */}
      {activeTab === 'chat' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10">
          {/* Left Column: Quick Prompts & Bento Pills */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 bg-[#12151E]/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
              <label className="block text-xs font-extrabold text-gray-200 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'স্মার্ট টপিকস' : 'Suggested Topics'}</span>
              </label>
              <div className="space-y-2">
                {SAMPLE_QUICK_PROMPTS.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sp.prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#1A1E2B]/80 hover:bg-[#252A3D] border border-white/5 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>💡 {sp.labelBn}</span>
                    <Send className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent backdrop-blur-xl rounded-2xl border border-blue-500/20 text-xs">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
                STUDENT ADVANTAGE
              </span>
              <p className="text-gray-300 leading-relaxed">
                {lang === 'bn'
                  ? 'সব ধরণের এআই সার্ভিস গুগল ও ওপেন সোর্স মডেল দ্বারা অভ্যন্তরীনভাবে প্রসেস করা হয়। আপনার পড়ার কোনো ক্ষতি হবে না।'
                  : 'All queries run securely through integrated AI engines automatically under the hood.'}
              </p>
            </div>
          </div>

          {/* Right Column: Glassmorphism Spatial Chat Container */}
          <div className="lg:col-span-3 flex flex-col h-[520px] bg-[#12151E]/70 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-[#181C28]/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                <span className="text-xs font-black text-white">Junior Gemini AI Studio</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                SMART TUTOR SUITE
              </span>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white shadow-blue-600/30'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-600/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#181C28]/90 border border-white/10 text-gray-200 rounded-tl-none shadow-xl'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono mb-2 pb-1.5 border-b border-white/10">
                        <span>⚡ {msg.engineInfo || 'Powered by Google AI Studio'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>

                    {msg.role === 'user' && (
                      <div className="text-[9px] text-blue-200 mt-1 text-right">{msg.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-blue-400 text-xs p-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'bn' ? 'জুনিয়র জেমিনি উত্তর তৈরি করছে...' : 'Junior Gemini is thinking...'}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#181C28]/90 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'যেকোনো বিষয় প্রশ্ন করুন (যেমন: C প্রোগ্রামিং বা দ্বিপদী সমীকরণ)...'
                      : 'Ask Junior Gemini anything (Coding, Math, Science)...'
                  }
                  className="flex-1 bg-[#12151E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bento UI Overview */}
      {activeTab === 'bento' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {BENTO_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`p-5 rounded-2xl bg-gradient-to-b ${item.gradient} bg-[#12151E]/80 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/10 text-gray-300 border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white mb-1.5">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {lang === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="mt-4 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-colors"
                >
                  {lang === 'bn' ? 'ব্যবহার করুন' : 'Launch Feature'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
