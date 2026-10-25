import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Activity,
  Zap,
  Target,
  Medal,
  Dumbbell,
  HelpCircle,
  Award,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Play,
  Volume2,
  VolumeX,
  Video,
  Radio,
  RefreshCw,
  Sparkle,
  Mic
} from 'lucide-react';

interface SportsHubProps {
  lang: 'bn' | 'en';
}

interface SportsMatch {
  id: string;
  tournament: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
  type: 'cricket' | 'football';
}

interface MotivationalSpeech {
  id: string;
  titleBn: string;
  titleEn: string;
  speakerBn: string;
  speakerEn: string;
  duration: string;
  videoUrl: string; // Embed or YouTube link
  summaryBn: string;
  speechTextBn: string;
  category: string;
}

export const SportsHub: React.FC<SportsHubProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'matches' | 'school' | 'quiz' | 'fitness' | 'speech'>('speech');

  // Audio Speech Synthesis State
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Custom Speech Generator State
  const [customGoal, setCustomGoal] = useState<string>('');
  const [generatedSpeech, setGeneratedSpeech] = useState<string>('');
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState<boolean>(false);

  // Live Sports Tracker State
  const [matches, setMatches] = useState<SportsMatch[]>([
    {
      id: 'm1',
      tournament: 'বাংলাদেশ বনাম শ্রীলঙ্কা সিরিজ ২০২৬ (আন্তর্জাতিক ক্রিকেট)',
      teamA: '🇧🇩 বাংলাদেশ (Tigers)',
      teamB: '🇱🇰 শ্রীলঙ্কা',
      scoreA: '২৮৫/৬ (৫০ ওভার)',
      scoreB: '২৪২/১০ (৪৭.২ ওভার)',
      status: 'বাংলাদেশ ৪৩ রানে জয়ী! 🏆',
      type: 'cricket'
    },
    {
      id: 'm2',
      tournament: 'সাফ চ্যাম্পিয়নশিপ ফুটবল (SAFF Championship)',
      teamA: '🇧🇩 বাংলাদেশ ন্যাশনাল টিম',
      teamB: '🇮🇳 ভারত',
      scoreA: '২',
      scoreB: '১',
      status: 'দ্বিতীয় হাফ চলমান (৮২ মিনিট)',
      type: 'football'
    },
    {
      id: 'm3',
      tournament: 'বাংলাদেশ প্রিমিয়ার লীগ (BPL T20)',
      teamA: 'ঢাকা ডায়নামাইটস',
      teamB: 'রংপুর রাইডার্স',
      scoreA: '১৭৮/৪ (২০ ওভার)',
      scoreB: '১৬৫/৮ (২০ ওভার)',
      status: 'ঢাকা ১৩ রানে জয়ী',
      type: 'cricket'
    }
  ]);

  // Motivational Video & Audio Speeches
  const speeches: MotivationalSpeech[] = [
    {
      id: 'sp1',
      titleBn: 'কেন শারীরিক চর্চা তরুণদের পড়ালেখার মনোযোগ ১০ গুণ বাড়িয়ে দেয়?',
      titleEn: 'Why Physical Fitness Boosts Student Focus by 10x?',
      speakerBn: 'অধ্যাপক ড. আশরাফ আলী (ফিটনেস বিশেষজ্ঞ ও গবেষক)',
      speakerEn: 'Prof. Dr. Ashraf Ali (Fitness Researcher)',
      duration: '৩:৪৫ মিনিট',
      videoUrl: 'https://www.youtube.com/embed/gCzcbXiZQIY', // Educational workout video
      category: 'ব্রেইন পাওয়ার ও ফিটনেস',
      summaryBn: 'নিয়মিত সকালে ১৫ মিনিট ব্যায়াম বা দৌড়ানো মস্তিষ্কে ডোপামিন ও এন্ডোরফিন হরমোন নিঃসৃত করে, যা বিষণ্ণতা ও অলসতা দূর করে মনোযোগ বৃদ্ধি করে।',
      speechTextBn: 'প্রিয় তরুণ ভাইয়েরা, সকালে মাত্র ১৫ মিনিটের শারীরিক চর্চা তোমার পুরো দিনের মেজাজ ও পড়ার গতি বদলে দিতে পারে! বিজ্ঞান বলে, যখন তুমি ব্যায়াম করো তখন মস্তিষ্কে নতুন নিউরন তৈরি হয়। তাই অলস হয়ে বসে না থেকে প্রতিদিন অন্তত ২০ মিনিট খেলাধুলা বা ব্যায়াম করো।'
    },
    {
      id: 'sp2',
      titleBn: 'মাশরাফি ও সাকিব আল হাসানের টিমওয়ার্ক ও মানসিক শক্তির স্পিচ',
      titleEn: 'Mental Toughness & Teamwork Lesson from Bangladesh Legends',
      speakerBn: 'মাশরাফি বিন মর্তুজা (সাবেক জাতীয় অধিনায়ক)',
      speakerEn: 'Mashrafe Mortaza (Ex-National Captain)',
      duration: '৪:২০ মিনিট',
      videoUrl: 'https://www.youtube.com/embed/5Peo-vgS3iU',
      category: 'মানসিক শক্তি ও স্পোর্টসম্যানশিপ',
      summaryBn: 'জীবন ও খেলার মাঠ উভয় জায়গায় পরাজয় মেনে নিয়ে নতুন করে ঘুরে দাঁড়ানোর নামই প্রকৃত জয়। সাতবার হাঁটুতে অস্ত্রোপচারের পরও মাঠে ফেরার প্রেরণা।',
      speechTextBn: 'হার না মানা মানসিকতাই একজন তরুণকে সাধারণ থেকে অসাধারণ করে তোলে। সাতবার হাঁটুতে অপারেশন হওয়ার পরও আমি মাঠে ফিরেছি কারণ আমি বিশ্বাস করি চেষ্টা করলে মানুষ অসম্ভবকে সম্ভব করতে পারে। তোমাদেরও জীবনে কখনো হার মানা যাবে না!'
    },
    {
      id: 'sp3',
      titleBn: 'অলসতা কাটিয়ে সকালে ৫টায় ওঠার এবং ফিট থাকার সেরা উপায়',
      titleEn: 'Overcoming Lethargy & Morning Fitness Habits for Youth',
      speakerBn: 'তামিম আহমেদ (অ্যাথলেটিক ট্রেইনার)',
      speakerEn: 'Tamim Ahmed (Athletic Trainer)',
      duration: '৫:১০ মিনিট',
      videoUrl: 'https://www.youtube.com/embed/1_3a4k2wB_o',
      category: 'দৈনন্দিন অভ্যাস ও ডিসিপ্লিন',
      summaryBn: 'যে তরুণ নিজের সকালকে জয় করতে পারে, সে পুরো দিনকে জয় করতে পারে। প্রতিদিন রাতে জলদি ঘুমানো ও সকালে ফ্রি-হ্যান্ড এক্সারসাইজ করার উপকারিতা।',
      speechTextBn: 'যদি তুমি জীবনে বড় হতে চাও, তবে নিজের অলসতাকে আগে পরাজিত করো। প্রতিদিন সকালে আলো ফোটার আগেই উঠে কিছুটা হাঁটা বা জগিং করা তোমাকে যেকোনো মানসিক স্ট্রেস থেকে মুক্ত রাখবে।'
    }
  ];

  // School Tournament State
  const [schoolMatches, setSchoolMatches] = useState([
    {
      id: 's1',
      event: 'বার্ষিক ইন্টার-স্কুল ফুটবল ফাইনাল ২০২৬',
      teams: '১০ম শ্রেণী (রেড হাউস) vs ৯ম শ্রেণী (ব্লু হাউস)',
      result: 'রেড হাউস ৩ - ১ গোলেই জয়ী ⚽',
      time: 'আজ বিকেল ৪:০০'
    },
    {
      id: 's2',
      event: 'স্কুল ব্যাডমিন্টন চ্যাম্পিয়নশিপ',
      teams: 'রাকিব (একাদশ শ্রেণী) vs সামিউল (দ্বাদশ শ্রেণী)',
      result: 'সামিউল ২১-১৯, ২১-১৭ সেট জয়ে ফাইনালিস্ট 🏸',
      time: 'গতকাল বিকেল ৩:৩০'
    }
  ]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTeams, setNewEventTeams] = useState('');
  const [newEventResult, setNewEventResult] = useState('');

  // Sports Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [showQuizAns, setShowQuizAns] = useState(false);

  const sportsQuizzes = [
    {
      qBn: 'বাংলাদেশের ক্রিকেট ইতিহাসে ওয়ানডেতে প্রথম হ্যাট্রিক করেছিলেন কোন বোলার?',
      qEn: 'Who scored Bangladesh’s first ODI hat-trick in cricket history?',
      aBn: 'শাহাদাত হোসেন রাজিব (২০০৬ সালে জিম্বাবুয়ের বিরুদ্ধে)! 🏏',
      aEn: 'Shahadat Hossain (in 2006 against Zimbabwe)! 🏏'
    },
    {
      qBn: 'ফুটবল ইতিহাসে রেকর্ড ৮ বার ব্যালন ডি অর (Ballon d’Or) খেতাব জিতেছেন কে?',
      qEn: 'Who won a record 8 Ballon d’Or awards in football history?',
      aBn: 'লিওনেল মেসি (Lionel Messi)! ⚽',
      aEn: 'Lionel Messi! ⚽'
    },
    {
      qBn: 'বাংলাদেশের জাতীয় খেলা কোনটি?',
      qEn: 'What is the national sport of Bangladesh?',
      aBn: 'কাবাডি (Kabaddi / হা-ডু-ডু)! 🤼‍♂️',
      aEn: 'Kabaddi! 🤼‍♂️'
    },
    {
      qBn: 'অলিম্পিক গেমে ১০০ মিটার স্প্রিন্টে বিশ্বের দ্রুততম মানব কে?',
      qEn: 'Who is the fastest man in world Olympic 100m sprint?',
      aBn: 'উসাইন বোল্ট (Usain Bolt - ৯.৫৮ সেকেন্ড)! ⚡',
      aEn: 'Usain Bolt (9.58 seconds)! ⚡'
    }
  ];

  // Daily Student Fitness Tips
  const fitnessTips = [
    {
      titleBn: '১. প্রতিদিন ১৫ মিনিট স্কিপিং বা রোপ জাম্পিং',
      titleEn: '1. 15 Minutes Rope Skipping',
      descBn: 'সহজে শরীরের রক্ত সঞ্চালন বাড়ায়, মস্তিষ্ক সতেজ রাখে এবং ক্লাসে মনোযোগ দ্বিগুণ করে।'
    },
    {
      titleBn: '২. পড়ালেখার মাঝে ২০ মিনিট পর ২০ ফুট দূরে তাকানো (20-20-20 Rule)',
      titleEn: '2. 20-20-20 Eye Stretch Rule',
      descBn: 'স্ক্রিন বা বইয়ের দিকে তাকিয়ে থাকার পর চোখের ক্লান্তি দূর করার বিজ্ঞানসম্মত উপায়।'
    },
    {
      titleBn: '৩. প্রতিদিন সকালের পুষ্টিকর নাস্তা ও ১০ গ্লাস পানি',
      titleEn: '3. Healthy Breakfast & 10 Glasses Water',
      descBn: 'শারীরিক বৃদ্ধি ও শক্তি বজায় রাখতে প্রতিদিন প্রচুর পরিষ্কার পানি পান করা জরুরি।'
    }
  ];

  // Play Speech Audio via Browser SpeechSynthesis
  const playSpeechAudio = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (currentlyPlayingId === id && isSpeaking) {
        setCurrentlyPlayingId(null);
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setCurrentlyPlayingId(null);
        setIsSpeaking(false);
      };

      setCurrentlyPlayingId(id);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('আপনার ব্রাউজার ভয়েস স্পিচ প্লে ব্যাক সাপোর্ট করে না।');
    }
  };

  // Generate Custom Motivational Speech with Gemini
  const handleGenerateCustomSpeech = async () => {
    if (!customGoal.trim()) return;

    setIsGeneratingSpeech(true);
    setGeneratedSpeech('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `তরুণদের শারীরিক চর্চা, খেলাধুলা ও আত্মবিশ্বাসের গুরুত্ব নিয়ে একটি আকর্ষণীয় ও অনুপ্রেরণামূলক ৩-৪ লাইনের সংক্ষিপ্ত স্পিচ বা ভাষণ তৈরি করুন। বিষয়: ${customGoal}`,
          gradeLevel: 'Youth',
          type: 'lesson',
          language: lang,
        }),
      });

      const data = await response.json();
      if (data.lesson) {
        setGeneratedSpeech(data.lesson);
      } else {
        setGeneratedSpeech('স্পিচ তৈরি করা সম্ভব হয়নি।');
      }
    } catch (e) {
      setGeneratedSpeech('সার্ভার কানেকশন এরর।');
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const handleAddSchoolEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventTeams) return;

    setSchoolMatches([
      {
        id: Date.now().toString(),
        event: newEventTitle,
        teams: newEventTeams,
        result: newEventResult || 'টুর্নামেন্ট চলমান',
        time: 'আজ'
      },
      ...schoolMatches
    ]);

    setNewEventTitle('');
    setNewEventTeams('');
    setNewEventResult('');
    alert(isBn ? 'স্কুল স্পোর্টস ইভেন্ট যুক্ত হয়েছে!' : 'School sports event added!');
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-white/20">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {isBn ? 'খেলাধুলা, ভিডিও স্পিচ ও স্টুডেন্ট ফিটনেস' : 'Sports, Video Speeches & Youth Fitness'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isBn
                ? 'শারীরিক চর্চার গুরুত্ব নিয়ে অনুপ্রেরণামূলক ভিডিও-অডিও স্পিচ, বাংলাদেশ ক্রিকেট-ফুটবল ট্র্যাকার ও স্পোর্টস কুইজ'
                : 'Motivational Video & Audio Speeches, Live Scoreboard, School Tournaments & Fitness'}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#1A1D24] rounded-xl border border-[#2D3139] overflow-x-auto">
          <button
            onClick={() => setActiveTab('speech')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'speech'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Video className="w-4 h-4 text-amber-300" />
            <span>{isBn ? '১. অনুপ্রেরণামূলক ভিডিও স্পিচ' : '1. Video Speeches'}</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-amber-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{isBn ? '২. ক্রিকেট ও ফুটবল' : '2. Live Sports'}</span>
          </button>

          <button
            onClick={() => setActiveTab('school')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'school'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Medal className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? '৩. স্কুল টুর্নামেন্ট' : '3. School Sports'}</span>
          </button>

          <button
            onClick={() => setActiveTab('fitness')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'fitness'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-purple-300" />
            <span>{isBn ? '৪. হেলথ টিপস' : '4. Fitness Tips'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MOTIVATIONAL VIDEO & AUDIO SPEECHES */}
      {activeTab === 'speech' && (
        <div className="space-y-6">
          
          {/* AI Custom Speech Generator */}
          <div className="bg-[#0A0C10] p-5 rounded-2xl border border-[#1F2937] space-y-3 shadow-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {isBn ? 'এআই মোটিভেটর: নিজের জন্য কাস্টম অনুপ্রেরণামূলক স্পিচ তৈরি ও শুনুন' : 'AI Motivator: Generate & Listen to Custom Speeches'}
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: সকালে ৬ টায় উঠে দৌড়ানোর অলসতা কাটানো...'
                    : 'e.g., Overcoming laziness to go for morning workout...'
                }
                className="flex-1 bg-[#13161C] border border-[#2D3139] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleGenerateCustomSpeech}
                disabled={isGeneratingSpeech || !customGoal.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                {isGeneratingSpeech ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{isBn ? 'স্পিচ লেখা হচ্ছে...' : 'Writing Speech...'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-amber-200" />
                    <span>{isBn ? 'স্পিচ তৈরি করুন' : 'Generate Speech'}</span>
                  </>
                )}
              </button>
            </div>

            {generatedSpeech && (
              <div className="p-4 bg-[#13161C] border border-amber-500/30 rounded-xl space-y-3 animate-fadeIn">
                <p className="text-xs text-amber-200 leading-relaxed font-semibold italic">
                  "{generatedSpeech}"
                </p>
                <button
                  onClick={() => playSpeechAudio(generatedSpeech, 'custom_speech')}
                  className="px-4 py-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{currentlyPlayingId === 'custom_speech' ? (isBn ? 'থামান' : 'Stop Audio') : (isBn ? 'অডিও স্পিচ শুনুন' : 'Listen Audio Speech')}</span>
                </button>
              </div>
            )}
          </div>

          {/* List of Motivational Video & Audio Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'শারীরিক চর্চা ও মানসিক শক্তির ভিডিও স্পিচসমূহ:' : 'Inspirational Video & Audio Speeches:'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {speeches.map((sp) => (
                <div
                  key={sp.id}
                  className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-4 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {sp.category}
                      </span>
                      <span className="text-gray-400">{sp.duration}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">{sp.titleBn}</h4>

                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-[#1F2533] space-y-1.5">
                      <p className="text-xs font-bold text-emerald-400">{sp.speakerBn}</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{sp.summaryBn}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#252A36]">
                    <button
                      onClick={() => playSpeechAudio(sp.speechTextBn, sp.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                        currentlyPlayingId === sp.id
                          ? 'bg-red-600/30 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30'
                      }`}
                    >
                      {currentlyPlayingId === sp.id ? (
                        <>
                          <VolumeX className="w-4 h-4 text-red-400" />
                          <span>{isBn ? 'অডিও থামান' : 'Pause Speech'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span>{isBn ? '🔊 অডিও স্পিচ শুনুন' : 'Listen Audio Speech'}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={sp.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isBn ? 'ভিডিও ওয়াচ' : 'Watch Video'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MATCHES TRACKER */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'বাংলাদেশ ও আন্তর্জাতিক খেলার স্কোর আপডেট:' : 'National & International Sports Scoreboard:'}</span>
            </h3>
            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>LIVE</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <div
                key={m.id}
                className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-3 hover:border-amber-500/40 transition-all shadow-md"
              >
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-[#252A36] pb-2">
                  <span>{m.tournament}</span>
                  <span className="uppercase text-[10px] bg-[#1F2533] px-2 py-0.5 rounded">{m.type}</span>
                </div>

                <div className="space-y-2 py-1">
                  <div className="flex justify-between items-center text-sm font-black text-white">
                    <span>{m.teamA}</span>
                    <span className="text-amber-300 bg-[#0A0C10] px-2.5 py-1 rounded-lg border border-[#252A36]">{m.scoreA}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black text-white">
                    <span>{m.teamB}</span>
                    <span className="text-amber-300 bg-[#0A0C10] px-2.5 py-1 rounded-lg border border-[#252A36]">{m.scoreB}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCHOOL SPORTS TOURNAMENT */}
      {activeTab === 'school' && (
        <div className="space-y-6">
          
          {/* Add School Event */}
          <div className="bg-[#0A0C10] p-5 rounded-xl border border-[#1F2937] space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Medal className="w-4 h-4" />
              <span>{isBn ? 'আপনার স্কুলের টুর্নামেন্ট/ম্যাচের খবর আপডেট করুন:' : 'Add School Sports Match Result:'}</span>
            </h3>

            <form onSubmit={handleAddSchoolEvent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder={isBn ? 'ইভেন্টের নাম (যেমন: বার্ষিক ক্রিকেট টুর্নামেন্ট)' : 'Tournament Name'}
                  className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <input
                  type="text"
                  value={newEventTeams}
                  onChange={(e) => setNewEventTeams(e.target.value)}
                  placeholder={isBn ? 'দল বা প্রতিযোগীদের নাম (যেমন: ১০ম শ্রেণী vs ৯ম শ্রেণী)' : 'Teams / Players'}
                  className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <input
                type="text"
                value={newEventResult}
                onChange={(e) => setNewEventResult(e.target.value)}
                placeholder={isBn ? 'ম্যাচের ফলাফল বা স্কোর (যেমন: ১০ম শ্রেণী ৩ উইকেটে জয়ী)' : 'Match Result'}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg"
              >
                {isBn ? 'স্কোর আপডেট করুন' : 'Post Match Update'}
              </button>
            </form>
          </div>

          {/* List of School Events */}
          <div className="space-y-3">
            {schoolMatches.map((s) => (
              <div key={s.id} className="p-4 bg-[#13161C] border border-[#252A36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-400 block">{s.event}</span>
                  <span className="text-sm font-extrabold text-white">{s.teams}</span>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-300">
                  {s.result}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: FITNESS TIPS */}
      {activeTab === 'fitness' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fitnessTips.map((tip, idx) => (
            <div key={idx} className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-2">
              <Dumbbell className="w-6 h-6 text-purple-400" />
              <h4 className="text-sm font-bold text-white">{isBn ? tip.titleBn : tip.titleEn}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{tip.descBn}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

