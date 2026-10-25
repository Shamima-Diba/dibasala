import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Cpu,
  Layers,
  Terminal,
  Code2,
  Sparkles,
  Zap,
  Check,
  Copy,
  Server,
  Globe,
  Download,
  BookOpen,
  Play,
  RefreshCw,
  Send,
  Bot,
  User,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
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
  modelUsed?: string;
  provider?: string;
  timestamp: string;
}

export const OpenSourceAiHub: React.FC<OpenSourceAiHubProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'models' | 'tester'>('chat');

  // Open Model Chat State
  const [selectedModel, setSelectedModel] = useState<string>('deepseek-r1:8b');
  const [provider, setProvider] = useState<'auto' | 'huggingface' | 'ollama'>('auto');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<OpenChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: lang === 'bn'
        ? 'স্বাগতম! এটি **ওপেন সোর্স এআই জোন (Open Source AI Studio)**।\nঅর্থনৈতিক সংকট থাকলেও যেন কোনো শিক্ষার্থী এআই শিক্ষা থেকে পিছিয়ে না পড়ে, সেজন্য আপনি এই ইন্টারফেস থেকে সরাসরি **DeepSeek-R1, Llama 3.1, Qwen 2.5 Coder** এবং **Mistral 7B**-এর মতো সেরা ওপেন সোর্স মডেলসমূহ কোনো ফ্রি ছাড়া সরাসরি ব্যবহার করতে পারবেন!'
        : 'Welcome! This is the **Open Source AI Studio**.\nTo ensure no student is deprived of AI learning due to financial constraints, you can directly interact with top open-source models like **DeepSeek-R1, Llama 3.1, Qwen 2.5 Coder**, and **Mistral 7B** right inside this app for free!',
      modelUsed: 'DeepSeek-R1 (Open Weights)',
      provider: 'In-App Open Engine (100% Free)',
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
      const response = await fetch('/api/open-source-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          model: selectedModel,
          provider: provider
        })
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with Open Source AI Engine.');
      }

      const data = await response.json();

      const botMsg: OpenChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'কোনো উত্তর তৈরি করা যায়নি।',
        modelUsed: data.modelUsed || selectedModel,
        provider: data.provider || 'Open Source Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: OpenChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: lang === 'bn'
          ? `⚠️ **ওপেন সোর্স উত্তর পেতে সমস্যা হয়েছে:** ${err.message}\n\nতবে চিন্তা করবেন না! আপনি ব্যাকআপ অফলাইন হাব থেকেও পড়া চালিয়ে যেতে পারেন।`
          : `⚠️ **Open Source Engine Error:** ${err.message}`,
        modelUsed: 'Fallback Engine',
        provider: 'System Error Handler',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const OPEN_SOURCE_MODELS_LIST = [
    {
      id: 'deepseek-r1:8b',
      name: 'DeepSeek-R1 (Open Weights)',
      badge: 'Reasoning & Logic',
      descBn: 'গণিত, যুক্তি ও জটিল বিষয় সহজভাবে বোঝাতে ওপেন সোর্স জগতের অন্যতম সেরা মডেল।',
      descEn: 'Top-tier open reasoning model for complex math, logic & step-by-step reasoning.',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'llama3.1',
      name: 'Meta Llama 3.1 / 3.3',
      badge: 'Multilingual Leader',
      descBn: 'মেটার সেরা ওপেন সোর্স মডেল। বাংলা ও ইংরেজি উভয় ভাষায় খুব সাবলীল উত্তর দেয়।',
      descEn: 'Meta flagship open-weights model with excellent Bengali & English support.',
      tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'qwen2.5:7b',
      name: 'Qwen 2.5 Coder',
      badge: 'Programming Specialist',
      descBn: 'সি প্রোগ্রামিং, পাইথন, জাভাস্ক্রিপ্ট ও ডেটাস্ট্রাকচারের মাস্টার টিউটর।',
      descEn: 'Specialized open model for C programming, Python & data structures.',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'mistral',
      name: 'Mistral 7B Instruct',
      badge: 'Fast & Concise',
      descBn: 'খুব দ্রুত গতির উত্তর প্রদানের উপযোগী লাইটওয়েট ওপেন মডেল।',
      descEn: 'High-speed, low resource open model for instant homework guidance.',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  ];

  const SAMPLE_OPEN_PROMPTS = [
    { labelBn: 'C প্রোগ্রামিং লুপ কী?', labelEn: 'Explain C Loops', prompt: 'C প্রোগ্রামিংয়ে for loop এবং while loop এর মধ্যে পার্থক্য কী? উদাহরণসহ বাংলায় বুঝাও।' },
    { labelBn: 'লজিক গেট টেবিল', labelEn: 'Logic Gates Truth Table', prompt: 'AND gate, OR gate এবং NOT gate এর কাজ ও ট্রুথ টেবিল সহজভাবে এঁকে বুঝাও।' },
    { labelBn: 'দ্বিপদী সমীকরণ সমাধান', labelEn: 'Solve Quadratic Eq', prompt: 'ax^2 + bx + c = 0 সমীকরণ কীভাবে সমাধান করতে হয় ধাপগুলো বুঝিয়ে দাও।' },
    { labelBn: 'বাইনারি থেকে ডেসিমেল', labelEn: 'Binary to Decimal', prompt: 'বাইনারি সংখ্যা (1101)_2 কে কীভাবে ডেসিমেল এ রূপান্তর করব উদাহরণসহ দেখাও।' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 shadow-lg border border-white/10">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {lang === 'bn' ? 'ওপেন সোর্স এআই স্টুডিও' : 'Open Source AI Studio'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% DIRECT IN-APP ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'bn'
                ? 'শিক্ষার্থীদের জন্য বিনামূল্যে ব্যবহারের উন্মুক্ত এআই ইঞ্জিন (DeepSeek-R1, Llama 3.1, Qwen 2.5 Coder)। সরাসরি এই অ্যাপ থেকে মেসেজ পাঠাতে পারবেন।'
                : 'Directly use top open-source AI models (DeepSeek-R1, Llama 3.1, Qwen 2.5) right inside this app without subscription fees or API keys!'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#13161C] p-1 rounded-xl border border-[#2D3139]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ওপেন এআই চ্যাট' : 'Open AI Chat'}</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'models' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মডেল গ্যালারি' : 'Model Gallery'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Live Open Model Chat Workspace */}
      {activeTab === 'chat' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column: Model Settings & Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 bg-[#0A0C10] rounded-2xl border border-[#1F2937]">
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'মডেল নির্বাচন করুন' : 'Select Open Model'}</span>
              </label>

              <div className="space-y-2">
                {OPEN_SOURCE_MODELS_LIST.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedModel === m.id
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-[#13161C] border-[#2D3139] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      {selectedModel === m.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${m.tagColor}`}>
                      {m.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Strategy Selection */}
            <div className="p-4 bg-[#0A0C10] rounded-2xl border border-[#1F2937]">
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'প্রোভাইডার মোড' : 'Provider Engine'}</span>
              </label>

              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="auto">⚡ In-App Zero Cost (Auto Fallback)</option>
                <option value="huggingface">🌐 Hugging Face Serverless API</option>
                <option value="ollama">💻 Local Ollama (localhost:11434)</option>
              </select>

              <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                {lang === 'bn'
                  ? 'স্মার্ট ফলব্যাক ইঞ্জিনের কারণে কোনো এপিআই কি ছাড়াও শিক্ষার্থীরা যেকোনো প্রশ্ন ফ্রিতে করতে পারবে।'
                  : 'Zero-cost fallback engine allows instant queries even with zero API credits!'}
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="p-4 bg-[#0A0C10] rounded-2xl border border-[#1F2937]">
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'দ্রুত প্রশ্ন পাঠান' : 'Sample Prompts'}</span>
              </label>
              <div className="space-y-1.5">
                {SAMPLE_OPEN_PROMPTS.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sp.prompt)}
                    className="w-full text-left p-2 rounded-lg bg-[#13161C] hover:bg-[#1C202B] border border-[#2D3139] text-xs text-gray-300 hover:text-white transition-all line-clamp-1"
                  >
                    💡 {lang === 'bn' ? sp.labelBn : sp.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Box */}
          <div className="lg:col-span-3 flex flex-col h-[520px] bg-[#0A0C10] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
            {/* Top Bar showing active model */}
            <div className="px-4 py-3 bg-[#13161C] border-b border-[#1F2937] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold text-white">
                  {OPEN_SOURCE_MODELS_LIST.find((m) => m.id === selectedModel)?.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  ACTIVE MODEL
                </span>
              </div>

              <div className="text-[10px] text-gray-400 font-mono">
                {provider === 'auto' ? '⚡ Auto Open Engine' : provider === 'huggingface' ? '🌐 HuggingFace API' : '💻 Ollama Local'}
              </div>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#13161C] border border-[#2D3139] text-gray-200 rounded-tl-none shadow-md'
                  }`}>
                    {msg.role === 'assistant' && msg.modelUsed && (
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono mb-1.5 pb-1 border-b border-[#2D3139]">
                        <span>⚡ {msg.modelUsed}</span>
                        <span>{msg.provider}</span>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[9px] text-gray-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs p-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'bn' ? 'ওপেন সোর্স এআই মডেল উত্তর তৈরি করছে...' : 'Open Source Model Generating Response...'}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#13161C] border-t border-[#1F2937]">
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
                      ? 'ওপেন সোর্স এআইকে প্রশ্ন করুন (যেমন: C প্রোগ্রামিং বা গণিত)...'
                      : 'Ask Open Source AI any question (Coding, Math, Science)...'
                  }
                  className="flex-1 bg-[#0A0C10] border border-[#2D3139] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Models Comparison & Specs Gallery */}
      {activeTab === 'models' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPEN_SOURCE_MODELS_LIST.map((m) => (
              <div key={m.id} className="p-5 bg-[#0A0C10] rounded-2xl border border-[#1F2937] hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-extrabold text-white">{m.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.tagColor}`}>{m.badge}</span>
                </div>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">{lang === 'bn' ? m.descBn : m.descEn}</p>

                <div className="p-3 bg-[#13161C] rounded-xl border border-[#2D3139] flex items-center justify-between text-xs">
                  <span className="text-gray-400">{lang === 'bn' ? 'সরাসরি টেস্ট করুন:' : 'Try Directly:'}</span>
                  <button
                    onClick={() => {
                      setSelectedModel(m.id);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>{lang === 'bn' ? 'চ্যাটে ব্যবহার করুন' : 'Use in Chat'}</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
