import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  WifiOff,
  Download,
  CheckCircle2,
  BookOpen,
  Code2,
  Award,
  Sparkles,
  Zap,
  HardDrive,
  RefreshCw,
  Trash2,
  FileText,
  Search,
  HelpCircle,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { OFFLINE_LEARNING_MATERIALS, OfflineMaterialItem } from '../data/offlineMaterials';
import { getSWCacheStats, sendMaterialsToServiceWorker, clearSWCache, ServiceWorkerCacheStats } from '../lib/swRegister';

interface OfflineHubProps {
  lang: 'bn' | 'en';
}

export const OfflineHub: React.FC<OfflineHubProps> = ({ lang }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<OfflineMaterialItem | null>(null);
  const [cacheStats, setCacheStats] = useState<ServiceWorkerCacheStats | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Offline AI Query state
  const [offlineQuery, setOfflineQuery] = useState<string>('');
  const [offlineAiResponse, setOfflineAiResponse] = useState<string | null>(null);

  // Monitor Network Online/Offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache stats load
    fetchCacheStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchCacheStats = async () => {
    const stats = await getSWCacheStats();
    setCacheStats(stats);
  };

  const handleDownloadMaterials = async () => {
    setIsDownloading(true);
    setDownloadSuccessMsg(null);

    // Save to localStorage as redundancy
    localStorage.setItem('junior_gemini_offline_materials', JSON.stringify(OFFLINE_LEARNING_MATERIALS));

    // Send to Service Worker
    const success = await sendMaterialsToServiceWorker(OFFLINE_LEARNING_MATERIALS);

    setTimeout(async () => {
      setIsDownloading(false);
      await fetchCacheStats();
      const msg = lang === 'bn'
        ? '🎉 সব পাঠ্যক্রম ও কুইজ সফলভাবে অফলাইন ক্যাশে (Service Worker Storage) সংরক্ষিত হয়েছে!'
        : '🎉 All core learning materials pre-cached for offline access!';
      setDownloadSuccessMsg(msg);
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    }, 800);
  };

  const handleClearCache = async () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি অফলাইন ক্যাশ মুছে ফেলতে চান?' : 'Are you sure you want to clear offline cached content?')) {
      await clearSWCache();
      localStorage.removeItem('junior_gemini_offline_materials');
      await fetchCacheStats();
      setSelectedMaterial(null);
    }
  };

  // Offline AI assistant logic (matches query against offline materials)
  const handleOfflineAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineQuery.trim()) return;

    const q = offlineQuery.toLowerCase();
    let matches: string[] = [];

    OFFLINE_LEARNING_MATERIALS.forEach(mat => {
      if (mat.titleBn.toLowerCase().includes(q) || mat.titleEn.toLowerCase().includes(q) || mat.contentMarkdownBn.toLowerCase().includes(q)) {
        matches.push(`📌 **${mat.titleBn}**\n\n${mat.summaryBn}\n\n*পড়তে উপরের কার্ডটিতে ক্লিক করুন।*`);
      }
    });

    if (matches.length > 0) {
      setOfflineAiResponse(matches.join('\n\n---\n\n'));
    } else {
      setOfflineAiResponse(
        lang === 'bn'
          ? `⚡ [অফলাইন সার্চ ফল]: "${offlineQuery}" সম্পর্কিত নির্দিষ্ট নোট পাওয়া যায়নি। তবে আপনি আমাদের এইচএসসি আইসিটি, সি প্রোগ্রামিং, বা পাইথন মডিউলগুলো বিনামূল্যে অফলাইনে দেখতে পারেন।`
          : `⚡ [Offline Search]: No exact offline note found for "${offlineQuery}". Please check our pre-cached HSC ICT, C Programming, or Python modules.`
      );
    }
  };

  const filteredMaterials = OFFLINE_LEARNING_MATERIALS.filter((mat) => {
    const matchesCategory = activeCategory === 'all' || mat.category === activeCategory;
    const matchesSearch =
      mat.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.summaryBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${isOnline ? 'bg-gradient-to-tr from-blue-600 via-purple-600 to-emerald-600' : 'bg-gradient-to-tr from-amber-600 to-rose-600'} shadow-lg border border-white/10`}>
            {isOnline ? <Wifi className="w-6 h-6 text-white" /> : <WifiOff className="w-6 h-6 text-white animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {lang === 'bn' ? 'অফলাইন শিক্ষা কেন্দ্র (Service Worker Caching)' : 'Offline Learning Hub'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'}`}>
                {isOnline ? (lang === 'bn' ? 'অনলাইন যুক্ত' : 'ONLINE') : (lang === 'bn' ? 'অফলাইন মোড' : 'OFFLINE MODE')}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'bn'
                ? 'ইন্টারনেট বা বিদ্যুৎ না থাকলেও সার্ভিস ওয়ার্কারের মাধ্যমে সম্পূর্ণ সিলেবাস ও কুইজ অফলাইনে পড়ুন'
                : 'Service Worker powered core syllabus caching for uninterrupted learning without internet'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadMaterials}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'bn' ? 'সংরক্ষিত হচ্ছে...' : 'Caching...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সব মডিউল ডাউনলোড করুন' : 'Pre-Cache All Materials'}</span>
              </>
            )}
          </motion.button>

          <button
            onClick={handleClearCache}
            className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-400 hover:text-rose-400 border border-[#2D3139] transition-colors"
            title={lang === 'bn' ? 'অফলাইন ক্যাশ ক্লিন করুন' : 'Clear Cache'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {downloadSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/40 text-green-300 text-xs font-semibold flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              {downloadSuccessMsg}
            </span>
            <span className="font-mono text-[10px] bg-green-500/20 px-2 py-0.5 rounded text-green-400 font-bold">PWA READY</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Worker Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <div className="p-3.5 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-gray-300">
                {lang === 'bn' ? 'সার্ভিস ওয়ার্কার স্টেটাস' : 'Service Worker State'}
              </div>
              <div className="text-[11px] text-gray-400">
                {cacheStats?.isRegistered ? '✅ sw.js Active & Registered' : '⚡ Local Cache Active'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-xs font-bold text-gray-300">
                {lang === 'bn' ? 'ক্যাশ করা কনটেন্ট' : 'Pre-Cached Material'}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                {OFFLINE_LEARNING_MATERIALS.length} {lang === 'bn' ? 'টি মূল মডিউল' : 'Core Modules Ready'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-xs font-bold text-gray-300">
                {lang === 'bn' ? 'অফলাইন সুবিধা' : 'Offline Benefits'}
              </div>
              <div className="text-[11px] text-green-400 font-medium">
                ⚡ {lang === 'bn' ? 'বিদ্যুৎ/ইন্টারনেট ছাড়াই পড়া সম্ভব' : '100% Offline Accessible'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Material Viewer vs Selection Grid */}
      {selectedMaterial ? (
        /* Detailed Reader View */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-[#0A0C10] p-5 sm:p-6 rounded-2xl border border-[#1F2937] shadow-xl"
        >
          <button
            onClick={() => setSelectedMaterial(null)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#13161C] hover:bg-[#1A1D24] text-xs font-bold text-gray-300 border border-[#2D3139] mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to List'}</span>
          </button>

          <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {lang === 'bn' ? selectedMaterial.badgeBn : selectedMaterial.badgeEn}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {lang === 'bn' ? selectedMaterial.titleBn : selectedMaterial.titleEn}
              </h3>
            </div>
            <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <span>⏱️ {selectedMaterial.readTimeMins} min read</span>
            </div>
          </div>

          {/* Interactive Quiz Mode if Quiz Bank */}
          {selectedMaterial.quizQuestions && selectedMaterial.quizQuestions.length > 0 ? (
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-[#13161C] rounded-xl border border-[#2D3139]">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400">
                  <span>
                    {lang === 'bn' ? 'অফলাইন কুইজ প্রশ্ন' : 'Offline Quiz Question'} {currentQuizIndex + 1} / {selectedMaterial.quizQuestions.length}
                  </span>
                  <span className="text-purple-400 font-mono">Score: {quizScore} XP</span>
                </div>

                <p className="text-sm font-semibold text-white mb-4">
                  {lang === 'bn'
                    ? selectedMaterial.quizQuestions[currentQuizIndex].questionBn
                    : selectedMaterial.quizQuestions[currentQuizIndex].questionEn}
                </p>

                <div className="space-y-2.5">
                  {(lang === 'bn'
                    ? selectedMaterial.quizQuestions[currentQuizIndex].optionsBn
                    : selectedMaterial.quizQuestions[currentQuizIndex].optionsEn
                  ).map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === selectedMaterial.quizQuestions![currentQuizIndex].correctIndex;
                    let btnStyle = 'bg-[#0A0C10] border-[#2D3139] hover:border-blue-500 text-gray-300';

                    if (selectedAnswer !== null) {
                      if (isCorrect) btnStyle = 'bg-green-500/20 border-green-500 text-green-300 font-bold';
                      else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (selectedAnswer === null) {
                            setSelectedAnswer(idx);
                            if (isCorrect) setQuizScore(prev => prev + 50);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300"
                  >
                    <p className="font-bold mb-1">💡 {lang === 'bn' ? 'ব্যাখ্যা:' : 'Explanation:'}</p>
                    <p>
                      {lang === 'bn'
                        ? selectedMaterial.quizQuestions[currentQuizIndex].explanationBn
                        : selectedMaterial.quizQuestions[currentQuizIndex].explanationEn}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedAnswer(null);
                        setCurrentQuizIndex(prev => (prev + 1) % selectedMaterial.quizQuestions!.length);
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      {lang === 'bn' ? 'পরবর্তী প্রশ্ন ➔' : 'Next Question ➔'}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            /* Markdown Lesson Content */
            <div className="mt-6 space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
              {lang === 'bn' ? selectedMaterial.contentMarkdownBn : selectedMaterial.contentMarkdownEn}
            </div>
          )}
        </motion.div>
      ) : (
        /* Material List Overview */
        <>
          {/* Controls & Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
            {/* Category tabs */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', bn: 'সব নোট', en: 'All' },
                { id: 'ict', bn: 'এইচএসসি আইসিটি', en: 'HSC ICT' },
                { id: 'python', bn: 'পাইথন', en: 'Python' },
                { id: 'math_science', bn: 'গণিত ও বিজ্ঞান', en: 'Math & Science' },
                { id: 'quiz_bank', bn: 'কুইজ ব্যাংক', en: 'Quiz Bank' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-[#13161C] text-gray-400 hover:text-gray-200 border border-[#2D3139]'
                  }`}
                >
                  {lang === 'bn' ? cat.bn : cat.en}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'অফলাইন নোট সার্চ করুন...' : 'Search offline notes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#E6E8EB] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Offline Material Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {filteredMaterials.map((mat, idx) => (
              <motion.div
                key={mat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedMaterial(mat)}
                className="p-4 bg-[#0A0C10] rounded-2xl border border-[#1F2937] hover:border-blue-500/50 shadow-xl cursor-pointer flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {lang === 'bn' ? mat.badgeBn : mat.badgeEn}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      ⏱️ {mat.readTimeMins}m
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-100 group-hover:text-blue-400 transition-colors mb-1.5">
                    {lang === 'bn' ? mat.titleBn : mat.titleEn}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? mat.summaryBn : mat.summaryEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {lang === 'bn' ? 'অফলাইনে পড়ুন' : 'Read Offline'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Offline AI Knowledge Query Box */}
          <div className="mt-8 p-5 bg-[#0A0C10] rounded-2xl border border-[#1F2937] shadow-xl">
            <h3 className="text-sm font-bold text-[#E6E8EB] flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{lang === 'bn' ? 'অফলাইন জুনিয়র জেমিনী সহকারী (Search Engine)' : 'Offline Junior Gemini Assistant'}</span>
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              {lang === 'bn'
                ? 'ইন্টারনেট বিচ্ছিন্ন থাকলেও আপনার প্রাক-সংরক্ষিত সকল নোট ও সিলেবাস থেকে প্রশ্নটির সঠিক উত্তর খুঁজুন'
                : 'Search pre-cached knowledge base instantly even without an internet connection'}
            </p>

            <form onSubmit={handleOfflineAiQuery} className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'bn' ? 'যেমন: বায়োমেট্রিক্স, NAND Gate, Python loop...' : 'e.g., Biometrics, NAND Gate, Python loop...'}
                value={offlineQuery}
                onChange={(e) => setOfflineQuery(e.target.value)}
                className="flex-1 bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-[#E6E8EB] focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                {lang === 'bn' ? 'সার্চ করুন' : 'Search Offline'}
              </button>
            </form>

            {offlineAiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-[#13161C] border border-[#2D3139] text-xs text-gray-200 font-sans leading-relaxed whitespace-pre-wrap"
              >
                {offlineAiResponse}
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};
