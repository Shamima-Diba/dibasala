import React, { useState } from 'react';
import { BookOpen, Search, Volume2, X, Sparkles, CheckCircle2, Copy, Bookmark, Lightbulb, ArrowRight } from 'lucide-react';

interface PopUpDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  initialWord?: string;
}

interface DictionaryEntry {
  word: string;
  phoneticBn: string;
  phoneticEn: string;
  posBn: string;
  posEn: string;
  meaningBn: string;
  meaningEn: string;
  definitionBn: string;
  definitionEn: string;
  exampleBn: string;
  exampleEn: string;
  synonymsBn: string[];
  synonymsEn: string[];
  nctbCategoryBn: string;
  nctbCategoryEn: string;
}

const DICTIONARY_DATABASE: Record<string, DictionaryEntry> = {
  photosynthesis: {
    word: 'Photosynthesis',
    phoneticBn: '[ফোটোসিন্থেসিস]',
    phoneticEn: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    posBn: 'বিশেষ্য (Noun)',
    posEn: 'Noun',
    meaningBn: 'শালোকসংশ্লেষণ',
    meaningEn: 'Process of manufacturing food using sunlight',
    definitionBn: 'উদ্ভিদ সূর্যরশ্মি, কার্বন ডাই অক্সাইড ও পানির সাহায্যে ক্লোরোফিলের উপস্থিতিতে নিজের খাদ্য (গ্লুকোজ) প্রস্তুত করার জৈবরাসায়নিক প্রক্রিয়া।',
    definitionEn: 'The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.',
    exampleBn: 'শালোকসংশ্লেষণের ফলে বায়ুমণ্ডলে অক্সিজেন নির্গত হয়।',
    exampleEn: 'Photosynthesis releases oxygen into the atmosphere.',
    synonymsBn: ['উদ্ভিদের খাদ্য প্রস্তুতকরণ', 'জৈবরাসায়নিক সংশ্লেষ'],
    synonymsEn: ['Bio-synthesis', 'Chlorophyll action'],
    nctbCategoryBn: '৯ম-১০ম শ্রেণী ও এইচএসসি জীববিজ্ঞান (NCTB Biology)',
    nctbCategoryEn: 'Class 9-12 Biology'
  },
  quantum: {
    word: 'Quantum',
    phoneticBn: '[কোয়ান্টাম]',
    phoneticEn: '/ˈkwɑːn.təm/',
    posBn: 'বিশেষ্য / বিশেষণ (Noun/Adj)',
    posEn: 'Noun/Adjective',
    meaningBn: 'পরমাণুর শক্তি বা শক্তির ন্যূনতম একক / কোয়ান্টাম',
    meaningEn: 'A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents',
    definitionBn: 'পদার্থবিজ্ঞানে শক্তির ক্ষুদ্রতম ও অবিভাজ্য পরিমাণ বা কণা, যা শক্তির বিনিময় নিশ্চিত করে।',
    definitionEn: 'The smallest discrete quantity of any physical property, such as energy or matter.',
    exampleBn: 'কোয়ান্টাম মেকানিক্স আধুনিক পদার্থবিজ্ঞানের মূল ভিত্তি।',
    exampleEn: 'Quantum mechanics is the foundation of modern physics.',
    synonymsBn: ['শক্তি কণা', 'অণু-একক'],
    synonymsEn: ['Energy Packet', 'Photon level'],
    nctbCategoryBn: 'এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পদার্থবিজ্ঞান (HSC Physics)',
    nctbCategoryEn: 'HSC & Admission Physics'
  },
  algorithm: {
    word: 'Algorithm',
    phoneticBn: '[অ্যালগরিদম]',
    phoneticEn: '/ˈæl.ɡə.rɪ.ðəm/',
    posBn: 'বিশেষ্য (Noun)',
    posEn: 'Noun',
    meaningBn: 'সমস্যা সমাধানের পর্যায়ক্রমিক নিয়ম বা অ্যালগরিদম',
    meaningEn: 'A process or set of rules to be followed in calculations or other problem-solving operations',
    definitionBn: 'কোনো নির্দিষ্ট গাণিতিক বা লজিক্যাল সমস্যা সমাধানের জন্য ধাপে ধাপে অনুসরনযোগ্য সুনির্দিষ্ট নির্দেশনাবলী।',
    definitionEn: 'A finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation.',
    exampleBn: 'কৃত্রিম বুদ্ধিমত্তা দ্রুত অনুসন্ধানের জন্য দক্ষ অ্যালগরিদম ব্যবহার করে।',
    exampleEn: 'Artificial Intelligence relies on efficient algorithms for fast data processing.',
    synonymsBn: ['লজিক ধাপ', 'পদ্ধতিমালা'],
    synonymsEn: ['Procedure', 'Formula', 'Code logic'],
    nctbCategoryBn: 'আইসিটি ও কম্পিউটার সায়েন্স (NCTB ICT)',
    nctbCategoryEn: 'ICT & Computer Science'
  },
  biodiversity: {
    word: 'Biodiversity',
    phoneticBn: '[বায়োডাইভারসিটি]',
    phoneticEn: '/ˌbaɪ.oʊ.daɪˈvɝː.sə.t̬i/',
    posBn: 'বিশেষ্য (Noun)',
    posEn: 'Noun',
    meaningBn: 'জীববৈচিত্র্য',
    meaningEn: 'The variety of life in the world or in a particular habitat or ecosystem',
    definitionBn: 'পৃথিবীতে বা কোনো নির্দিষ্ট পরিবেশ বাস্তুতন্ত্রে বসবাসকারী প্রাণী, উদ্ভিদ ও অণুজীবের প্রজাতিগত বৈচিত্র্য ও সমাহার।',
    definitionEn: 'The variety and variability of life on Earth, encompassing genetic, species, and ecosystem variation.',
    exampleBn: 'সুন্দরবন বাংলাদেশের জীববৈচিত্র্যের অন্যতম প্রধান প্রাকৃতিক কেন্দ্র।',
    exampleEn: 'The Sundarbans is a vital sanctuary for Bangladesh’s biodiversity.',
    synonymsBn: ['জীব প্রজাতি বৈচিত্র্য', 'বাস্তুতান্ত্রিক বৈচিত্র্য'],
    synonymsEn: ['Ecosystem variety', 'Biological diversity'],
    nctbCategoryBn: '৭ম-১০ম শ্রেণী বিজ্ঞান ও ভূগোল (NCTB Science)',
    nctbCategoryEn: 'Class 7-10 General Science'
  },
  constitution: {
    word: 'Constitution',
    phoneticBn: '[কনস্টিটিউশন]',
    phoneticEn: '/ˌkɑːn.stəˈtuː.ʃən/',
    posBn: 'বিশেষ্য (Noun)',
    posEn: 'Noun',
    meaningBn: 'সংবিধান / শাসনতন্ত্র',
    meaningEn: 'A body of fundamental principles according to which a state or organization is governed',
    definitionBn: 'কোনো রাষ্ট্রের শাসন ব্যবস্থার মূল ও সর্বোচ্চ আইন, যা নাগরিক অধিকার ও রাষ্ট্রীয় ক্ষমতার সীমা নির্ধারণ করে।',
    definitionEn: 'The supreme law of a nation establishing the character and organization of its government.',
    exampleBn: '১৯৭২ সালের ৪ নভেম্বর বাংলাদেশের সংবিধান গৃহীত হয়।',
    exampleEn: 'The Constitution of Bangladesh was adopted on November 4, 1972.',
    synonymsBn: ['শাসনতন্ত্র', 'মৌলিক আইন'],
    synonymsEn: ['Charter', 'Supreme Law', 'Statute'],
    nctbCategoryBn: 'পৌরনীতি, বিসিএস ও বিশ্ববিদ্যালয় ভর্তি (BCS & Civics)',
    nctbCategoryEn: 'BCS & General Knowledge'
  }
};

export const PopUpDictionaryModal: React.FC<PopUpDictionaryModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialWord = ''
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [searchTerm, setSearchTerm] = useState<string>(initialWord || 'photosynthesis');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [savedBookmark, setSavedBookmark] = useState<boolean>(false);

  const cleanKey = searchTerm.trim().toLowerCase();
  const currentEntry = DICTIONARY_DATABASE[cleanKey] || {
    word: searchTerm || 'Search Term',
    phoneticBn: `[${searchTerm}]`,
    phoneticEn: `/${searchTerm}/`,
    posBn: 'বিশেষ্য (Noun)',
    posEn: 'Noun / Term',
    meaningBn: isBn ? `"${searchTerm}" শব্দের বাংলা অনুবাদ ও বিশ্লেষণ` : `Translation of "${searchTerm}"`,
    meaningEn: `Academic definition of ${searchTerm}`,
    definitionBn: isBn
      ? `"${searchTerm}" একটি গুরুত্বপূর্ণ শিক্ষণীয় শব্দ। এর মাধ্যমে বিষয়টি সহজভাবে বিশ্লেষণ করা হয়।`
      : `An important academic keyword in NCTB curriculum syllabus.`,
    definitionEn: `Detailed concept explanation for ${searchTerm}.`,
    exampleBn: isBn ? `পরীক্ষার খাতায় "${searchTerm}" এর সঠিক উত্তর প্রদান আবশ্যক।` : `Proper understanding of ${searchTerm} is required for exams.`,
    exampleEn: `Students should remember the key concept of ${searchTerm}.`,
    synonymsBn: ['মূল ধারণা', 'শব্দার্থ'],
    synonymsEn: ['Keyword', 'Term'],
    nctbCategoryBn: 'এনসিটিবি সাধারণ শিক্ষা কোড (NCTB Education)',
    nctbCategoryEn: 'NCTB General Syllabus'
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSay = currentEntry.word;
      const utterance = new SpeechSynthesisUtterance(textToSay);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(isBn ? 'আপনার ব্রাউজারে স্পিচ সাপোর্ট নেই।' : 'Speech synthesis not supported.');
    }
  };

  const handleCopy = () => {
    const textToCopy = `${currentEntry.word} (${currentEntry.meaningBn}) - ${currentEntry.definitionBn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F121A] border border-blue-500/40 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden text-[#E6E8EB] card-3d">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-[#0F121A] p-5 border-b border-[#252A36] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                {isBn ? '📖 স্মার্ট পপ-আপ ডিকশনারি ও শব্দার্থ' : '📖 Smart Bilingual Dictionary'}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                  NCTB Ready
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                {isBn ? 'কঠিন ইংরেজি শব্দের তাৎক্ষণিক বাংলা অর্থ, উচ্চারণ ও উদাহরণ' : 'Instant Bengali meaning, pronunciation & example for study words'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#181C26] text-gray-400 hover:text-white hover:bg-[#252A36] transition-all border border-[#2D3342]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dictionary Search Bar */}
        <div className="p-4 bg-[#141822] border-b border-[#252A36]">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'যেকোনো ইংরেজি বা বাংলা শব্দ অনুসন্ধান করুন (যেমন: Photosynthesis, Quantum)...' : 'Search any word (e.g. Photosynthesis, Quantum)...'}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-[#0B0D14] border border-[#2A3040] focus:border-blue-500 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <button
                onClick={handleTextToSpeech}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  isSpeaking ? 'bg-amber-500 text-black animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
                title="উচ্চারণ শুনুন (Text to Speech)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Words Chips */}
          <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-400 shrink-0 font-medium">{isBn ? 'জনপ্রিয় শব্দ:' : 'Popular:'}</span>
            {['photosynthesis', 'quantum', 'algorithm', 'biodiversity', 'constitution'].map((w) => (
              <button
                key={w}
                onClick={() => setSearchTerm(w)}
                className={`px-2.5 py-1 rounded-lg border transition-all capitalize font-medium ${
                  cleanKey === w
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-[#181C26] text-gray-300 border-[#2D3342] hover:bg-[#252A36]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Word Detail Card */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Main Word Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-[#181D2A] to-[#121520] p-4 rounded-2xl border border-blue-500/30">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentEntry.word}
                </h2>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {isBn ? currentEntry.posBn : currentEntry.posEn}
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-1.5 text-sm text-emerald-400 font-mono font-medium">
                <span>{currentEntry.phoneticBn}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">{currentEntry.phoneticEn}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleTextToSpeech}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isBn ? 'উচ্চারণ শুনুন' : 'Listen Pronunciation'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-[#202636] hover:bg-[#2B3348] text-gray-300 transition-all border border-[#343D54]"
                title="অনুলিপি করুন"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setSavedBookmark(!savedBookmark)}
                className={`p-2 rounded-xl transition-all border ${
                  savedBookmark
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-[#202636] hover:bg-[#2B3348] text-gray-300 border-[#343D54]'
                }`}
                title="বুকমার্ক করুন"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bengali Meaning & Definition Box */}
          <div className="space-y-3">
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                {isBn ? '🎯 মূল বাংলা অর্থ (Bengali Meaning):' : '🎯 Primary Bengali Meaning:'}
              </span>
              <p className="text-xl font-extrabold text-emerald-200">
                {currentEntry.meaningBn}
              </p>
            </div>

            <div className="bg-[#141824] border border-[#282F42] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                {isBn ? '💡 বিস্তারিত ব্যাখ্যা (Educational Definition):' : '💡 Detailed Definition:'}
              </span>
              <p className="text-sm text-gray-200 leading-relaxed font-medium">
                {isBn ? currentEntry.definitionBn : currentEntry.definitionEn}
              </p>
            </div>
          </div>

          {/* Example Usage */}
          <div className="bg-[#141824] border border-[#282F42] p-4 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {isBn ? '✍️ বাক্যে সঠিক ব্যবহার (Example Sentence):' : '✍️ Example Usage:'}
            </span>
            <div className="space-y-1 bg-[#0D1018] p-3 rounded-xl border border-[#202638]">
              <p className="text-sm text-amber-200 font-semibold italic">
                "{currentEntry.exampleEn}"
              </p>
              <p className="text-xs text-gray-300">
                👉 {currentEntry.exampleBn}
              </p>
            </div>
          </div>

          {/* NCTB Alignment Badge & Synonyms */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11141F] p-3.5 rounded-2xl border border-[#242A3C] text-xs">
            <div>
              <span className="text-gray-400 block font-medium">
                {isBn ? '📚 এনসিটিবি কারিকুলাম বিভাগ:' : '📚 NCTB Curriculum Level:'}
              </span>
              <span className="font-bold text-blue-300">
                {isBn ? currentEntry.nctbCategoryBn : currentEntry.nctbCategoryEn}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-gray-400">{isBn ? 'সমার্থক শব্দ:' : 'Synonyms:'}</span>
              {(isBn ? currentEntry.synonymsBn : currentEntry.synonymsEn).map((s, idx) => (
                <span key={idx} className="bg-[#1D2230] text-gray-300 px-2 py-0.5 rounded-md border border-[#2E364A] text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#11141F] p-4 border-t border-[#252A36] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'পড়ার সময় যেকোনো শব্দের অর্থ ও উচ্চারণ জানতে এই ডিকশনারি ব্যবহার করুন।' : 'Use dictionary anytime during reading for instant definitions.'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-95"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
