import React, { useState } from 'react';
import {
  Tv,
  MonitorPlay,
  Play,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  QrCode,
  Award,
  Users,
  Printer,
  Zap,
  BookOpen,
  BrainCircuit,
  MessageSquare,
  GraduationCap,
  ShieldCheck,
  MousePointer,
  RotateCcw
} from 'lucide-react';

interface ProjectorClassroomProps {
  lang: 'bn' | 'en';
}

interface SlideItem {
  id: number;
  slideTitleBn: string;
  slideType: 'overview' | 'concept' | 'formula' | 'quiz' | 'ai_ask';
  contentBn: string;
  highlightsBn?: string[];
  formulaList?: { formula: string; explanation: string }[];
  quizQuestion?: {
    q: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const ProjectorClassroom: React.FC<ProjectorClassroomProps> = ({ lang }) => {
  const isBn = lang === 'bn';

  // School branding state
  const [schoolName, setSchoolName] = useState<string>('ধুনট সরকারি পাইলট উচ্চ বিদ্যালয় (স্মার্ট ক্লাসরুম ল্যাব)');
  const [teacherName, setTeacherName] = useState<string>('মো: আব্দুর রহিম (প্রধান শিক্ষক / আইসিটি শিক্ষক)');
  const [selectedCategory, setSelectedCategory] = useState<'bcs' | 'kids' | 'junior' | 'ssc' | 'hsc'>('ssc');
  const [selectedSubject, setSelectedSubject] = useState<string>('গণিত ও বীজগণিতীয় রাশি');

  // Display & Projector settings
  const [projectorTheme, setProjectorTheme] = useState<'dark' | 'contrast' | 'daylight'>('dark');
  const [fontSizeLevel, setFontSizeLevel] = useState<'lg' | 'xl' | '2xl'>('xl');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showLaserPointer, setShowLaserPointer] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: 300, y: 200 });
  const [showStudentQr, setShowStudentQr] = useState<boolean>(false);

  // Active slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Interactive AI Teacher Question state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Sample slides dataset for different levels
  const getSlideDeck = (): SlideItem[] => {
    if (selectedCategory === 'bcs') {
      return [
        {
          id: 1,
          slideTitleBn: 'বিসিএস ক্লাসরুম প্রেজেন্টেশন: বাংলাদেশ বিষয়াবলী (সংবিধান ও অনুচ্ছেদ)',
          slideType: 'overview',
          contentBn: 'আজকের বিসিএস ক্লাসরুম সেশনে গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের ৩য় ভাগ (মৌলিক অধিকার) এবং গুরুত্বপূর্ণ অনুচ্ছেদসমূহ সরাসরি প্রজেক্টরে এআই বিশ্লেষণের মাধ্যমে অনুধাবন করা হবে।',
          highlightsBn: [
            'অনুচ্ছেদ ২৬: মৌলিক অধিকারের সাথে অসামঞ্জস্য আইন বাতিল',
            'অনুচ্ছেদ ২৭: আইনের দৃষ্টিতে সমতা',
            'অনুচ্ছেদ ২৮: ধর্ম, গোষ্ঠী, বর্ণ, নারী-পুরুষভেদে বৈষম্য না করা',
            'অনুচ্ছেদ ৩১: আইনের আশ্রয় লাভের অধিকার',
            'অনুচ্ছেদ ৩৬-৪৩: চলাফেরা, সমাবেশ, সংগঠন, চিন্তা, বাক-স্বাধীনতা ও ধর্মীয় স্বাধীনতা'
          ]
        },
        {
          id: 2,
          slideTitleBn: 'সংবিধানিক মূলনীতি ও আন্তর্জাতিক ভূ-রাজনীতি স্পটলাইট',
          slideType: 'concept',
          contentBn: 'সংবিধানের মূলনীতি চারটি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা (অনুচ্ছেদ ৮)। আন্তর্জাতিক বিষয়াবলীতে জাতিসংঘ সনদ, ভিটো পাওয়ার এবং আঞ্চলিক বাণিজ্য জোট (SAARC, BIMSTEC, ASEAN) থেকে বিসিএসে সর্বাধিক প্রশ্ন আসে।',
          highlightsBn: [
            '১৯৭২ সালের ৪ঠা নভেম্বর সংবিধান গৃহীত হয় এবং ১৬ই ডিসেম্বর থেকে কার্যকর হয়।',
            'সংবিধান সংশোধনীর জন্য জাতীয় সংসদের দুই-তৃতীয়াংশ (২/৩) সদস্যের ভোটের প্রয়োজন।',
            'আন্তর্জাতিক বিষয়াবলীতে জলবায়ু চুক্তি (COP) এবং ভূ-রাজনৈতিক প্রভাব সম্পর্কিত প্রশ্ন নিশ্চিত।'
          ]
        },
        {
          id: 3,
          slideTitleBn: 'বিসিএস গাণিতিক যুক্তি ও মানসিক দক্ষতা কুইক ফর্মুলা',
          slideType: 'formula',
          contentBn: 'প্রজেক্টর স্ক্রিনে নিচে প্রদর্শিত শর্টকাট সূত্রগুলো দ্রুত খাতায় নোট করুন:',
          formulaList: [
            { formula: 'লগারিদম সূচক: log_a(M × N) = log_a(M) + log_a(N)', explanation: 'গুণফলকে যোগফলে রূপান্তর করার মৌলিক সমীকরণ।' },
            { formula: 'লাভ-ক্ষতি শতাংশ: লাভ % = (মোট লাভ ÷ ক্রয়মূল্য) × ১০০', explanation: 'ক্রয়মূল্যের উপর ভিত্তি করেই লাভ বা ক্ষতির শতকরা হার হিসাব করা হয়।' },
            { formula: 'সমান্তর ধারা: n-তম পদ = a + (n - 1)d', explanation: 'a = প্রথম পদ, d = সাধারণ অন্তর, n = পদ সংখ্যা।' }
          ]
        },
        {
          id: 4,
          slideTitleBn: 'বিসিএস মডেল লাইভ কুইজ টেস্ট (শ্রেণীকক্ষ ভোট)',
          slideType: 'quiz',
          contentBn: 'সকল চাকরিপ্রার্থী ও শিক্ষার্থী হাত তুলে বা ফোনে ভোট দিন:',
          quizQuestion: {
            q: 'বাংলাদেশের সংবিধানের কত নম্বর অনুচ্ছেদে মৌলিক অধিকার বলবৎকরণের জন্য হাইকোর্টে আবেদন (রিট) করার অধিকার দেওয়া হয়েছে?',
            options: ['অনুচ্ছেদ ৪৪ ও ১০২', 'অনুচ্ছেদ ২১ ও ৫৬', 'অনুচ্ছেদ ৬৩ ও ৭০', 'অনুচ্ছেদ ৯৫ ও ১১৭'],
            correctIndex: 0,
            explanation: 'অনুচ্ছেদ ৪৪ অনুযায়ী মৌলিক অধিকার বলবৎ করার জন্য অনুচ্ছেদ ১০২ (১) এর অধীন হাইকোর্ট বিভাগে মামলা দায়ের করার অধিকার নিশ্চিত করা হয়েছে।'
          }
        },
        {
          id: 5,
          slideTitleBn: 'জেমিনি এআই টিউটর লাইভ ক্লাসরুম সমাধান',
          slideType: 'ai_ask',
          contentBn: 'শিক্ষক বা যেকোনো শিক্ষার্থী বিসিএস বা বিষয়ভিত্তিক প্রশ্ন লিখুন—এআই সঙ্গে সঙ্গে প্রজেক্টরের বড় স্ক্রিনে বিস্তারিত সমাধান প্রডিউস করবে।'
        }
      ];
    } else if (selectedCategory === 'kids') {
      return [
        {
          id: 1,
          slideTitleBn: 'প্রারম্ভিক শিশু শিক্ষা প্রজেক্টর ল্যাব: বর্ণমালা ও সংখ্যা পরিচয়',
          slideType: 'overview',
          contentBn: 'আজকের প্রজেক্টর ক্লাসে শিশুরা স্বরবর্ণ, ব্যঞ্জনবর্ণ এবং ১ ২ ৩ মজার এআই ভয়েস ও স্পেলিং প্লেয়ারের মাধ্যমে শিখবে।',
          highlightsBn: [
            'অ তে অজগর আসছে তেরে, আ তে আমটি খাব পেড়ে',
            '১ (এক), ২ (দুই), ৩ (তিন), ৪ (চার), ৫ (পাঁচ)',
            'প্রজেক্টরের বড় রঙিন স্ক্রিনে বর্ণমালা শেখা শিশু মনের বিকাশ ঘটায়।'
          ]
        },
        {
          id: 2,
          slideTitleBn: 'মজার অ আ ক খ এবং ১ ২ ৩ উচ্চ ধ্বনি ল্যাব',
          slideType: 'concept',
          contentBn: 'শিক্ষক স্পিকার বাটনে ক্লিক করলে শ্রেণীকক্ষের প্রজেক্টর স্পিকারে উচ্চস্বরে সঠিক বাংলা উচ্চারণ বাজবে।',
          highlightsBn: [
            'বাংলা স্বরবর্ণ মোট ১১টি ও ব্যঞ্জনবর্ণ ৩৯টি।',
            'শিশুরা একসঙ্গে মুখে স্বর মিলিয়ে উচ্চস্বরে রিডিং পড়বে।',
            'স্মার্ট প্রজেক্টরে বর্ণমালার সচিত্র কার্টুন ও এআই ভিজ্যুয়াল স্পষ্ট দেখা যায়।'
          ]
        },
        {
          id: 3,
          slideTitleBn: 'প্রারম্ভিক গণিত ও ছোট যোগ-বিয়োগের ছবি',
          slideType: 'formula',
          contentBn: 'মজার ছবির সাহায্যে প্রাথমিক গণিত গণনা:',
          formulaList: [
            { formula: '🍎🍎 + 🍎 = 🍎🍎🍎 (২ + ১ = ৩)', explanation: '২টি লাল আপেল আর ১টি আপেল একত্র করলে ৩টি হয়।' },
            { formula: '🎈🎈🎈 + 🎈🎈 = 🎈🎈🎈🎈🎈 (৩ + ২ = ৫)', explanation: '৩টি বেলুন আর ২টো বেলুন যোগ করলে ৫টি বেলুন হয়।' }
          ]
        },
        {
          id: 4,
          slideTitleBn: 'মজার শিশু কুইজ (শ্রেণীকক্ষ কুইজ)',
          slideType: 'quiz',
          contentBn: 'প্রজেক্টর স্ক্রিনে ছবি দেখে সঠিক উত্তরটি চিহ্নিত করো:',
          quizQuestion: {
            q: 'আমাদের বাংলাদেশের জাতীয় ফুলের নাম কী?',
            options: ['শাপলা (Shapla)', 'গোলাপ (Rose)', 'সূর্যমুখী (Sunflower)', 'জবা (Hibiscus)'],
            correctIndex: 0,
            explanation: 'সঠিক উত্তর শাপলা! এটি আমাদের জাতীয় ফুল এবং জলে ফোটে।'
          }
        },
        {
          id: 5,
          slideTitleBn: 'প্রজেক্টর এআই স্টোরিটেলার ও প্রশ্নাবলী',
          slideType: 'ai_ask',
          contentBn: 'শিক্ষক যেকোনো শিক্ষণীয় গল্প বা বিষয় জানতে চাইলে এআই উত্তরটি বড় স্ক্রিনে উপস্থাপন করবে।'
        }
      ];
    } else {
      // Default SSC / Junior / HSC STEM Deck
      return [
        {
          id: 1,
          slideTitleBn: 'এসএসসি ও জুনিয়র STEM প্রজেক্টর ল্যাব: বীজগণিতীয় রাশি ও গতিবিজ্ঞান',
          slideType: 'overview',
          contentBn: 'আজকের স্মার্ট ক্লাসরুম প্রজেক্টর সেশনে অধ্যায় ৩: বীজগণিতীয় রাশি উৎপাদক বিশ্লেষণ এবং পদার্থবিজ্ঞানের গতি ও বলের সমীকরণ ল্যাব উপস্থাপন করা হচ্ছে।',
          highlightsBn: [
            '১. (a + b)² = a² + 2ab + b² এবং (a - b)² = a² - 2ab + b²',
            '২. a² - b² = (a + b)(a - b)',
            '৩. পদার্থবিজ্ঞানের গতি সমীকরণ: v = u + at, s = ut + ½at², v² = u² + 2as',
            '৪. নিউটনের গতির ২য় সূত্র: F = ma'
          ]
        },
        {
          id: 2,
          slideTitleBn: 'গতির ৩টি সমীকরণ ও পদার্থের গাণিতিক ব্যাখ্যার স্লাইড',
          slideType: 'concept',
          contentBn: 'গতির সমীকরণে প্রতিটি প্রতীকের অর্থ ও তাৎপর্য খাতায় স্পষ্টভাবে লিপিবদ্ধ করুন:',
          highlightsBn: [
            'u = বস্তুর আদিবেগ (m/s)',
            'v = t সময় পর বস্তুর শেষবেগ (m/s)',
            'a = বস্তুর সুষম ত্বরণ (m/s²)',
            's = অতিক্রান্ত দূরত্ব (m)',
            't = প্রয়োজনীয় সময় (s)'
          ]
        },
        {
          id: 3,
          slideTitleBn: 'ডিজিটাল সমীকরণ ও সূত্র ডিকশনারি (Projector Display)',
          slideType: 'formula',
          contentBn: 'প্রজেক্টর স্ক্রিনের জন্য বিশেষ হাই-কনট্রাস্ট ফর্মুলা গাইড:',
          formulaList: [
            { formula: 'v = u + at', explanation: 'আদিবেগ, ত্বরণ এবং সময় জানা থাকলে শেষবেগ নির্ণয়ের সূত্র।' },
            { formula: 's = ut + ½at²', explanation: 'ত্বরণসহ স্থির বা চলমান বস্তুর অতিক্রান্ত দূরত্ব নির্ণয়ের সূত্র।' },
            { formula: 'F = ma', explanation: 'm ভরের বস্তুর উপর F বল প্রয়োগ করলে উৎপন্ন ত্বরণ a নির্ণয়ের সূত্র।' },
            { formula: 'E = mc²', explanation: 'আইনস্টাইনের ভর-শক্তি সমীকরণ।' }
          ]
        },
        {
          id: 4,
          slideTitleBn: 'শ্রেণীকক্ষ লাইভ স্পিড সলভিং কুইজ প্রতিযোগিতা',
          slideType: 'quiz',
          contentBn: 'একটি বস্তু স্থির অবস্থা (u = 0) থেকে ২ m/s² সুষম ত্বরণে চলা শুরু করল। ৫ সেকেন্ড পর এর শেষবেগ (v) কত হবে?',
          quizQuestion: {
            q: 'u = 0 m/s, a = 2 m/s², t = 5 s হলে v = ?',
            options: ['8 m/s', '10 m/s', '12 m/s', '20 m/s'],
            correctIndex: 1,
            explanation: 'সূত্র: v = u + at = 0 + (2 × 5) = 10 m/s। সঠিক উত্তর ১০ m/s!'
          }
        },
        {
          id: 5,
          slideTitleBn: 'জেমিনি এআই টিউটর লাইভ ডাউট সলভার (Projector Screen)',
          slideType: 'ai_ask',
          contentBn: 'যেকোনো কঠিন সমীকরণ বা অধ্যায়ের অনুচ্ছেদ লিখুন—এআই টিউটর বড় অক্ষরে শিক্ষার্থীদের উপযোগী সমাধান বানিয়ে দেবে।'
        }
      ];
    }
  };

  const currentDeck = getSlideDeck();
  const currentSlide = currentDeck[currentSlideIndex] || currentDeck[0];

  // Text reader using SpeechSynthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(isBn ? 'আপনার ব্রাউজারে স্পিচ সাপোর্ট নেই।' : 'Speech synthesis not supported.');
    }
  };

  // Generate AI Answer on demand for Projector Display
  const handleAskProjectorAi = async () => {
    if (!aiQuestion.trim()) return;
    setIsGeneratingAi(true);
    setAiAnswer('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `[Projector Mode Question for Class Level: ${selectedCategory.toUpperCase()}]: ${aiQuestion}` }],
          mode: 'math-solver'
        })
      });
      const data = await response.json();
      if (data.reply) {
        setAiAnswer(data.reply);
      } else {
        setAiAnswer(isBn ? 'উত্তরের প্রক্রিয়া সম্পন্ন করা যাচ্ছে না।' : 'Could not generate answer.');
      }
    } catch (e) {
      setAiAnswer(isBn ? 'এআই সার্ভারে সংযোগ করা যাচ্ছে না।' : 'Connection error.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Laser Pointer Position Handler
  const handleMouseMoveOverScreen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showLaserPointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Theme styling classes
  const getThemeClasses = () => {
    if (projectorTheme === 'contrast') {
      return 'bg-black text-yellow-300 border-2 border-yellow-400 font-bold shadow-[0_0_50px_rgba(250,204,21,0.3)]';
    } else if (projectorTheme === 'daylight') {
      return 'bg-slate-50 text-slate-900 border-2 border-slate-300 font-semibold shadow-2xl';
    } else {
      return 'bg-[#090B10] text-gray-100 border border-[#1F2937] shadow-2xl';
    }
  };

  const getFontSizeClass = () => {
    if (fontSizeLevel === '2xl') return 'text-xl sm:text-2xl md:text-3xl leading-relaxed';
    if (fontSizeLevel === 'xl') return 'text-lg sm:text-xl md:text-2xl leading-relaxed';
    return 'text-base sm:text-lg md:text-xl leading-relaxed';
  };

  return (
    <div id="projector-classroom-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-[#0E131F] to-indigo-950 border border-emerald-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-black tracking-wide uppercase flex items-center space-x-1.5 shadow-sm">
                <Tv className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>স্মার্ট প্রজেক্টর ও ডিসপ্লে মোড (Smart Classroom Mode)</span>
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[11px] font-bold">
                বিগ স্ক্রীন অপটিমাইজড
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              বিদ্যালয় ও মাল্টিমিডিয়া ক্লাসরুম প্রজেক্টর সেন্টার
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              বাংলাদেশের যেকোনো প্রাথমিক বিদ্যালয়, হাই স্কুল, কলেজ বা বিশ্ববিদ্যালয় যদি ক্লাসরুম প্রজেক্টর বা স্মার্ট টিভিতে মাটি এআই ব্যবহার করে পাঠদান করতে চায়—তবে এই বড় ফন্ট, হাই-কনট্রাস্ট এবং ইন্টারঅ্যাকটিভ স্লাইড মোড দিয়ে অতি সহজে ক্লাস নেওয়া সম্ভব।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowStudentQr(!showStudentQr)}
              className="px-4 py-2.5 bg-[#171B26] hover:bg-[#202636] border border-indigo-500/40 text-indigo-300 font-bold rounded-2xl text-xs transition-all flex items-center space-x-2 shadow-lg"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>ছাত্রদের কানেক্ট কিউআর (QR)</span>
            </button>
            <button
              onClick={() => speakText(`স্বাগতম ${schoolName} এর স্মার্ট প্রজেক্টর ক্লাসরুমে। আজকের পাঠ্যবিষয়: ${selectedSubject}`)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl text-xs transition-all flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-black" />
              <span>শ্রেণীকক্ষে অডিও অ্যানাউন্সমেন্ট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student QR Modal */}
      {showStudentQr && (
        <div className="p-5 bg-[#0F1117] border border-indigo-500/40 rounded-3xl shadow-2xl text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#252A36] pb-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <span className="text-sm">শিক্ষার্থীদের মোবাইল / ট্যাবলেট সংযোগ কোড</span>
            </div>
            <button onClick={() => setShowStudentQr(false)} className="text-gray-400 hover:text-white p-1">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-black/50 rounded-2xl border border-indigo-500/20">
            <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0 text-center">
              {/* SVG QR Code Simulation */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" fill="white"/>
                <rect x="10" y="10" width="30" height="30" fill="black"/>
                <rect x="15" y="15" width="20" height="20" fill="white"/>
                <rect x="20" y="20" width="10" height="10" fill="black"/>
                <rect x="80" y="10" width="30" height="30" fill="black"/>
                <rect x="85" y="15" width="20" height="20" fill="white"/>
                <rect x="90" y="20" width="10" height="10" fill="black"/>
                <rect x="10" y="80" width="30" height="30" fill="black"/>
                <rect x="15" y="85" width="20" height="20" fill="white"/>
                <rect x="20" y="90" width="10" height="10" fill="black"/>
                <rect x="50" y="10" width="20" height="10" fill="black"/>
                <rect x="50" y="30" width="10" height="20" fill="black"/>
                <rect x="60" y="60" width="20" height="20" fill="black"/>
                <rect x="90" y="50" width="20" height="20" fill="black"/>
                <rect x="50" y="90" width="30" height="10" fill="black"/>
                <rect x="90" y="90" width="20" height="20" fill="black"/>
              </svg>
              <span className="text-[10px] font-mono text-black font-bold block mt-1">SESSION: MATI-7821</span>
            </div>
            <div className="space-y-2 text-gray-300">
              <h3 className="font-bold text-white text-sm">মোবাইলে প্রজেক্টর সেশনে যুক্ত হওয়ার নিয়ম:</h3>
              <ol className="list-decimal list-inside space-y-1 text-xs text-gray-300">
                <li>শিক্ষার্থীরা ফোনের ক্যামেরা দিয়ে কিউআর কোডটি স্ক্যান করবে।</li>
                <li>অথবা ব্রাউজারে প্রবেশ করে সেশন কোড <span className="font-mono text-amber-300 font-bold">MATI-7821</span> লিখবে।</li>
                <li>শ্রেণীকক্ষের যেকোনো শিক্ষার্থী কুইজ উত্তর জমা দিলে প্রজেক্টর স্ক্রিনে লাইভ স্কোর প্রদর্শিত হবে!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel for Teachers */}
      <div className="p-4 bg-[#131620] border border-[#252A36] rounded-2xl space-y-4 shadow-lg text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252A36] pb-3">
          
          {/* School Name Setup */}
          <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
            <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="বিদ্যালয়ের নাম লিখুন..."
              className="bg-[#090B10] border border-[#252A36] rounded-xl px-3 py-1.5 text-xs text-white font-bold w-full focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Switcher */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {[
              { id: 'ssc', label: '১০ম / SSC' },
              { id: 'bcs', label: 'বিসিএস প্রিলি' },
              { id: 'kids', label: 'প্রারম্ভিক শিশু' },
              { id: 'junior', label: '৬ষ্ঠ-৮ম ল্যাব' },
              { id: 'hsc', label: '১১শ-১২শ / HSC' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  setCurrentSlideIndex(0);
                  setSelectedQuizOption(null);
                  setShowAnswer(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-[#1C202C] text-gray-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projector Adjustments */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Theme Selector for Projector Light Conditions */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-medium">প্রজেক্টর কালার মোড:</span>
            <div className="flex items-center space-x-1 bg-[#090B10] p-1 rounded-xl border border-[#252A36]">
              <button
                onClick={() => setProjectorTheme('dark')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                  projectorTheme === 'dark' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>ডার্ক নাইট</span>
              </button>
              <button
                onClick={() => setProjectorTheme('contrast')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                  projectorTheme === 'contrast' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>হাই-কনট্রাস্ট (হলুদ-কালো)</span>
              </button>
              <button
                onClick={() => setProjectorTheme('daylight')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                  projectorTheme === 'daylight' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>ডে-লাইট (উজ্জ্বল)</span>
              </button>
            </div>
          </div>

          {/* Font Size & Tools */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400">ফন্ট সাইজ:</span>
              {(['lg', 'xl', '2xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSizeLevel(sz)}
                  className={`px-2 py-0.5 rounded-lg font-mono font-bold text-xs ${
                    fontSizeLevel === sz ? 'bg-emerald-500 text-black' : 'bg-[#1C202C] text-gray-300'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Laser Pointer Switch */}
            <button
              onClick={() => setShowLaserPointer(!showLaserPointer)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                showLaserPointer ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.8)]' : 'bg-[#1C202C] text-gray-300'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>{showLaserPointer ? 'লেজার অফ' : 'লেজার পয়েন্টার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Projector Interactive Screen */}
      <div
        onMouseMove={handleMouseMoveOverScreen}
        className={`relative p-6 sm:p-10 rounded-3xl transition-all duration-300 min-h-[480px] flex flex-col justify-between overflow-hidden ${getThemeClasses()}`}
      >
        {/* Simulated Red Laser Pointer */}
        {showLaserPointer && (
          <div
            className="absolute pointer-events-none w-5 h-5 bg-red-500 rounded-full blur-[2px] shadow-[0_0_20px_#EF4444] transition-all duration-75 z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: laserPos.x, top: laserPos.y }}
          >
            <div className="w-2 h-2 bg-white rounded-full mx-auto my-1.5"></div>
          </div>
        )}

        {/* Top Screen Bar */}
        <div className="flex items-center justify-between border-b border-current/20 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide uppercase opacity-90">
                {schoolName}
              </h3>
              <p className="text-xs opacity-75">
                স্মার্ট প্রজেক্টর লাইভ ক্লাসরুম • স্লাইড {currentSlideIndex + 1} / {currentDeck.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 rounded-full border border-current/30 font-bold opacity-80">
              {selectedCategory === 'bcs' ? '🎓 বিসিএস ক্যাডার ল্যাব' : selectedCategory === 'kids' ? '👶 প্রারম্ভিক শিশু ল্যাব' : '🏫 এসএসসি ও জুনিয়র STEM'}
            </span>
            <button
              onClick={() => speakText(currentSlide.slideTitleBn + '. ' + currentSlide.contentBn)}
              className="p-2 rounded-xl bg-current/10 hover:bg-current/20 transition-all"
              title="রিডিং পড়ুন"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Title */}
        <div className="space-y-4 mb-8">
          <div className="inline-block px-3 py-1 bg-current/10 rounded-xl text-xs font-bold tracking-wider uppercase">
            {currentSlide.slideType === 'overview' && '📌 শিখনফল ও প্রেক্ষাপট'}
            {currentSlide.slideType === 'concept' && '💡 মূল ধারণা ও ব্যাখ্যা'}
            {currentSlide.slideType === 'formula' && '📐 সমীকরণ ও সূত্র ডিকশনারি'}
            {currentSlide.slideType === 'quiz' && '🏆 শ্রেণীকক্ষ লাইভ কুইজ போட்டி'}
            {currentSlide.slideType === 'ai_ask' && '🤖 প্রজেক্টর এআই লাইভ সমাধান'}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {currentSlide.slideTitleBn}
          </h2>

          <p className={`${getFontSizeClass()} font-medium opacity-90`}>
            {currentSlide.contentBn}
          </p>
        </div>

        {/* Dynamic Slide Content Body */}
        <div className="flex-1 my-4">
          
          {/* Bullet Points / Highlights */}
          {currentSlide.highlightsBn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {currentSlide.highlightsBn.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-current/5 border border-current/15 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className={`${getFontSizeClass()} font-semibold`}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Formula Table Display */}
          {currentSlide.formulaList && (
            <div className="space-y-3 my-4">
              {currentSlide.formulaList.map((fObj, i) => (
                <div key={i} className="p-4 rounded-2xl bg-current/10 border border-current/20 space-y-1">
                  <div className="font-mono font-black text-xl sm:text-2xl tracking-wide">
                    {fObj.formula}
                  </div>
                  <div className="text-xs sm:text-sm opacity-80">{fObj.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Classroom Quiz Slide */}
          {currentSlide.quizQuestion && (
            <div className="space-y-4 p-5 rounded-2xl bg-current/5 border border-current/20 my-4">
              <h3 className="text-xl sm:text-2xl font-black">{currentSlide.quizQuestion.q}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSlide.quizQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizOption === optIdx;
                  const isCorrect = optIdx === currentSlide.quizQuestion?.correctIndex;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedQuizOption(optIdx);
                        setShowAnswer(true);
                      }}
                      className={`p-4 rounded-2xl text-left font-bold text-base sm:text-lg transition-all border ${
                        showAnswer && isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black'
                          : showAnswer && isSelected && !isCorrect
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : isSelected
                          ? 'bg-current/20 border-current'
                          : 'bg-current/5 border-current/20 hover:bg-current/10'
                      }`}
                    >
                      <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm sm:text-base font-bold animate-fadeIn">
                  ✨ সঠিক উত্তর ব্যাখ্যা: {currentSlide.quizQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {/* AI Interactive Doubt Solver Slide */}
          {currentSlide.slideType === 'ai_ask' && (
            <div className="space-y-4 my-4 p-5 rounded-2xl bg-current/5 border border-current/20">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <BrainCircuit className="w-6 h-6" />
                <span className="text-base sm:text-lg">শ্রেণীকক্ষের শিক্ষার্থীদের সরাসরি প্রশ্ন ব্যাংক:</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="যেমন: অনুচ্ছেদ ৪৪ এবং রিট আবেদন এর মধ্যে পার্থক্য বুঝিয়ে দাও..."
                  className="flex-1 bg-black/40 border border-current/30 rounded-2xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-emerald-400 text-white w-full"
                />
                <button
                  onClick={handleAskProjectorAi}
                  disabled={isGeneratingAi}
                  className="px-6 py-3 bg-emerald-500 text-black font-black rounded-2xl text-sm transition-all hover:bg-emerald-400 disabled:opacity-50 shrink-0 w-full sm:w-auto"
                >
                  {isGeneratingAi ? 'উত্তর তৈরি হচ্ছে...' : 'প্রজেক্টরে উত্তর আনো'}
                </button>
              </div>

              {aiAnswer && (
                <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 text-emerald-200 text-sm sm:text-base leading-relaxed animate-fadeIn font-medium whitespace-pre-wrap">
                  {aiAnswer}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="flex items-center justify-between border-t border-current/20 pt-4 mt-6">
          <button
            disabled={currentSlideIndex === 0}
            onClick={() => {
              setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
              setSelectedQuizOption(null);
              setShowAnswer(false);
            }}
            className="px-4 py-2 rounded-2xl bg-current/10 hover:bg-current/20 disabled:opacity-30 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>পূর্ববর্তী স্লাইড</span>
          </button>

          {/* Slide Progress Circles */}
          <div className="flex items-center space-x-2">
            {currentDeck.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setSelectedQuizOption(null);
                  setShowAnswer(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'bg-emerald-400 scale-125 shadow-[0_0_8px_#34D399]' : 'bg-current/30'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentSlideIndex === currentDeck.length - 1}
            onClick={() => {
              setCurrentSlideIndex((prev) => Math.min(currentDeck.length - 1, prev + 1));
              setSelectedQuizOption(null);
              setShowAnswer(false);
            }}
            className="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-extrabold text-xs sm:text-sm flex items-center space-x-1.5 transition-all hover:bg-emerald-400 disabled:opacity-30"
          >
            <span>পরবর্তী স্লাইড</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Classroom Guide & Features Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-[#131620] border border-[#252A36] rounded-2xl space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Tv className="w-4 h-4" />
            <span>১. লো-লুমেন্স ও কম বাজেটের প্রজেক্টর ফ্রেন্ডলি</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            গ্রামাঞ্চলের স্কুলের যেসব প্রজেক্টরে আলো কম থাকে, সেখানে 'হাই-কনট্রাস্ট (হলুদ-কালো)' মোড চালু করলে পেছনের বেঞ্চ থেকেও স্পষ্ট পড়া যাবে।
          </p>
        </div>

        <div className="p-4 bg-[#131620] border border-[#252A36] rounded-2xl space-y-1.5">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold">
            <Users className="w-4 h-4" />
            <span>২. সরাসরি প্রশ্ন ও কুইজ শিক্ষক-ছাত্র সংযোগ</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            শিক্ষক স্ক্রিনে কুইজ চালু রেখে হাত তুলে বা ছাত্রদের মোবাইল ডিভাইস কানেক্ট করে তাৎক্ষণিক সঠিক উত্তর যাচাই করতে পারবেন।
          </p>
        </div>

        <div className="p-4 bg-[#131620] border border-[#252A36] rounded-2xl space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <Printer className="w-4 h-4" />
            <span>৩. লেকচার প্রিন্ট ও স্মার্ট পিডিএফ সেভ</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            ক্লাস শেষে শিক্ষক স্লাইডের সকল ফর্মুলা ও লেকচার নোট এক ক্লিকে প্রিন্ট করে শিক্ষার্থীদের মধ্যে বিতরণ করতে পারবেন।
          </p>
        </div>
      </div>

    </div>
  );
};
