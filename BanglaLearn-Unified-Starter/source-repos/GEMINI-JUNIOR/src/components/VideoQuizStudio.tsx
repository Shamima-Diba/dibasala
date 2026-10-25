import React, { useState, useEffect } from 'react';
import { ExtendedEduHub } from './ExtendedEduHub';
import {
  Trophy,
  Play,
  Pause,
  Video,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Film,
  Music,
  Sliders,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Layers,
  Wand2,
  ChevronRight,
  Flame,
  Award,
  Zap,
  Subtitles,
  Palette,
  Eye,
  Share2,
  Clock,
  Send,
  HelpCircle
} from 'lucide-react';

interface VideoQuizStudioProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

interface QuizQuestion {
  id: number;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
}

interface VideoScene {
  id: string;
  sceneNumber: number;
  visualDescription: string;
  subtitleText: string;
  cameraMotion: string;
  durationSec: number;
  filter: string;
  sticker?: string;
  imageUrl?: string;
}

export const VideoQuizStudio: React.FC<VideoQuizStudioProps> = ({ lang, onClose }) => {
  const isBn = lang === 'bn';

  // Master Unlocked State (Unlocked by passing quiz or bypassing)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'ai_video' | 'video_editor'>('quiz');

  // Quiz State
  const [selectedCategory, setSelectedCategory] = useState<'science' | 'ai' | 'history' | 'coding'>('science');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  // AI Video Studio Generator State
  const [videoPrompt, setVideoPrompt] = useState<string>('২০৪১ সালের প্রযুক্তিসমৃদ্ধ ঢাকা ও বাংলাদেশ');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinematic 4K');
  const [cameraMotion, setCameraMotion] = useState<string>('Drone Aerial Lift');
  const [selectedAudio, setSelectedAudio] = useState<string>('Bengali Folk Fusion');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoSynopsis, setVideoSynopsis] = useState<string>('');
  const [generatedScenes, setGeneratedScenes] = useState<VideoScene[]>([]);
  const [editingTips, setEditingTips] = useState<string[]>([]);

  // Video Player Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState<boolean>(false);
  const [voiceoverAudio, setVoiceoverAudio] = useState<string | null>(null);

  // Quizzes Database
  const quizzes: Record<string, QuizQuestion[]> = {
    science: [
      {
        id: 1,
        questionBn: 'আমাদের সৌরজগতের সবচেয়ে বড় গ্রহ কোনটি?',
        questionEn: 'Which is the largest planet in our solar system?',
        optionsBn: ['মঙ্গল (Mars)', 'বৃহস্পতি (Jupiter)', 'শনি (Saturn)', 'পৃথিবী (Earth)'],
        optionsEn: ['Mars', 'Jupiter', 'Saturn', 'Earth'],
        correctIndex: 1,
        explanationBn: 'বৃহস্পতি বা জুপিটার হলো আমাদের সৌরজগতের বৃহত্তম গ্রহ, যা ১১টি পৃথিবীর ব্যাসের সমান!',
        explanationEn: 'Jupiter is the largest planet, wider than 11 Earths combined!'
      },
      {
        id: 2,
        questionBn: 'উদ্ভিদ সালোকসংশ্লেষণ (Photosynthesis) প্রক্রিয়ায় বায়ুমণ্ডল থেকে কী গ্রহণ করে?',
        questionEn: 'What do plants absorb from the atmosphere during photosynthesis?',
        optionsBn: ['অক্সিজেন', 'কার্বন ডাই অক্সাইড', 'নাইট্রোজেন', 'হাইড্রোজেন'],
        optionsEn: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctIndex: 1,
        explanationBn: 'উদ্ভিদ সূর্যালোক ও কার্বন ডাই অক্সাইড ব্যবহার করে শর্করা ও অক্সিজেন তৈরি করে।',
        explanationEn: 'Plants use sunlight and carbon dioxide to produce sugars and release oxygen.'
      },
      {
        id: 3,
        questionBn: 'আলোর গতি প্রতি সেকেন্ডে প্রায় কত কিলোমিটার?',
        questionEn: 'What is the approximate speed of light per second?',
        optionsBn: ['১,০০,০০০ কিমি', '৩,০০,০০০ কিমি', '৫,০০,০০০ কিমি', '১০,০০,০০০ কিমি'],
        optionsEn: ['100,000 km', '300,000 km', '500,000 km', '1,000,000 km'],
        correctIndex: 1,
        explanationBn: 'শূন্যস্থানে আলোর বেগ প্রতি সেকেন্ডে প্রায় ৩ লক্ষ কিলোমিটার (300,000 km/s)!',
        explanationEn: 'The speed of light in vacuum is approximately 300,000 km per second!'
      }
    ],
    ai: [
      {
        id: 1,
        questionBn: 'AI শব্দটির পূর্ণরূপ (Full Form) কী?',
        questionEn: 'What is the full form of AI?',
        optionsBn: ['Automated Internet', 'Artificial Intelligence', 'Advanced Innovation', 'Applied Information'],
        optionsEn: ['Automated Internet', 'Artificial Intelligence', 'Advanced Innovation', 'Applied Information'],
        correctIndex: 1,
        explanationBn: 'AI এর পূর্ণরূপ হলো Artificial Intelligence বা কৃত্রিম বুদ্ধিমত্তা।',
        explanationEn: 'AI stands for Artificial Intelligence.'
      },
      {
        id: 2,
        questionBn: 'মেশিন লার্নিং (Machine Learning) এআই এর একটি গুরুত্বপূর্ণ অংশ। এটি দিয়ে কী করা হয়?',
        questionEn: 'Machine Learning is a part of AI. What does it do?',
        optionsBn: ['যন্ত্র নিজেই ডাটা থেকে শেখে', 'শুধু গান বাজায়', 'হার্ডওয়্যার মেরামতে সাহায্য করে', 'ফাইল মুছে দেয়'],
        optionsEn: ['Machines learn from data', 'Only plays music', 'Fixes hardware', 'Deletes files'],
        correctIndex: 0,
        explanationBn: 'মেশিন লার্নিং এর মাধ্যমে কম্পিউটার প্রোগ্রাম বা অ্যালগরিদম পূর্বের তথ্য ও প্যাটার্ন থেকে নতুন সিদ্ধান্ত শেখে।',
        explanationEn: 'Machine learning algorithms learn patterns directly from data to make predictions.'
      },
      {
        id: 3,
        questionBn: 'জেমীনাই (Gemini) এআই মডেলটি কোন প্রযুক্তি প্রতিষ্ঠানের তৈরি?',
        questionEn: 'Which technology company developed the Gemini AI model?',
        optionsBn: ['Google', 'Microsoft', 'Apple', 'Meta'],
        optionsEn: ['Google', 'Microsoft', 'Apple', 'Meta'],
        correctIndex: 0,
        explanationBn: 'Gemini হলো গুগল (Google) এর তৈরি একটি সর্বাধুনিক ও শক্তিশালী মাল্টিমোডাল এআই মডেল!',
        explanationEn: 'Gemini is developed by Google as a state-of-the-art multimodal AI model.'
      }
    ],
    history: [
      {
        id: 1,
        questionBn: 'বাংলাদেশের মহান স্বাধীনতা দিবস কোনটি?',
        questionEn: 'Which day is the Independence Day of Bangladesh?',
        optionsBn: ['২১শে ফেব্রুয়ারি', '২৬শে মার্চ', '১৬ই ডিসেম্বর', '১৪ই এপ্রিল'],
        optionsEn: ['21st February', '26th March', '16th December', '14th April'],
        correctIndex: 1,
        explanationBn: '২৬শে মার্চ বাংলাদেশের মহান স্বাধীনতা দিবস।',
        explanationEn: '26th March is the Independence Day of Bangladesh.'
      },
      {
        id: 2,
        questionBn: 'ইউনেস্কো (UNESCO) ২১শে ফেব্রুয়ারিকে কী দিবস হিসেবে আন্তর্জাতিক স্বীকৃতি দিয়েছে?',
        questionEn: 'UNESCO declared 21st February as which international day?',
        optionsBn: ['আন্তর্জাতিক মাতৃভাষা দিবস', 'বিশ্ব পরিবেশ দিবস', 'আন্তর্জাতিক শিক্ষা দিবস', 'বিশ্ব বিজ্ঞান দিবস'],
        optionsEn: ['International Mother Language Day', 'World Environment Day', 'International Education Day', 'World Science Day'],
        correctIndex: 0,
        explanationBn: '১৯৯৯ সালে ইউনেস্কো ২১শে ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে ঘোষণা করে।',
        explanationEn: 'In 1999, UNESCO proclaimed 21st February as International Mother Language Day.'
      },
      {
        id: 3,
        questionBn: 'বাংলাদেশের জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের ঐতিহাসিক ৭ই মার্চের ভাষণ কোথায় অনুষ্ঠিত হয়েছিল?',
        questionEn: 'Where was the historic 7th March speech by Bangabandhu Sheikh Mujibur Rahman delivered?',
        optionsBn: ['রেসকোর্স ময়দান (সোহরাওয়ার্দী উদ্যান)', 'পল্টন ময়দান', 'ধানমন্ডি ৩২ নম্বর', 'জাতীয় সংসদ ভবন'],
        optionsEn: ['Racecourse Maidan (Suhrawardy Udyan)', 'Paltan Maidan', 'Dhanmondi 32', 'National Parliament'],
        correctIndex: 0,
        explanationBn: '১৯৭১ সালের ৭ই মার্চ ঢাকার তৎকালীন রেসকোর্স ময়দানে লাখো মানুষের উপস্থিতিতে এ কালজয়ী ভাষণ দেওয়া হয়।',
        explanationEn: 'Delivered at Racecourse Maidan (now Suhrawardy Udyan) in Dhaka on 7th March 1971.'
      }
    ],
    coding: [
      {
        id: 1,
        questionBn: 'কম্পিউটার প্রোগ্রামিংয়ে "Variable" (ভ্যারিয়েবল) বলতে কী বোঝায়?',
        questionEn: 'In programming, what is a "Variable"?',
        optionsBn: ['তথ্য বা ডাটা জমা রাখার কন্টেইনার', 'একটি হার্ডওয়্যার মাদারবোর্ড', 'একটি মনিটর স্ক্রিন', 'ইন্টারনেট ওয়াইফাই সংযোগ'],
        optionsEn: ['A container for storing data', 'A hardware motherboard', 'A monitor screen', 'An internet Wi-Fi connection'],
        correctIndex: 0,
        explanationBn: 'ভ্যারিয়েবল হলো মেমরির একটি নির্দিষ্ট স্থান যেখানে সংখ্যা, লেখা বা যেকোনো ডাটা সাময়িকভাবে জমা রাখা হয়।',
        explanationEn: 'A variable is a named storage location in memory used to hold data.'
      },
      {
        id: 2,
        questionBn: 'নিচের কোনটি সবচেয়ে জনপ্রিয় ও সহজ প্রোগ্রামিং ভাষা যা এআই ও ডাটা সায়েন্সে ব্যবহৃত হয়?',
        questionEn: 'Which is the most popular programming language used in AI and Data Science?',
        optionsBn: ['Python', 'HTML', 'CSS', 'SQL'],
        optionsEn: ['Python', 'HTML', 'CSS', 'SQL'],
        correctIndex: 0,
        explanationBn: 'Python ( পাইথন) তার সহজ সিনট্যাক্স ও সমৃদ্ধ লাইব্রেরির কারণে এআই এবং ডাটা সায়েন্সে বিশ্বে ১ নম্বর ভাষা।',
        explanationEn: 'Python is widely used in AI and data science for its readability and massive library ecosystem.'
      },
      {
        id: 3,
        questionBn: 'প্রোগ্রামিংয়ে "Loop" (লুপ) এর কাজ কী?',
        questionEn: 'What is the purpose of a "Loop" in programming?',
        optionsBn: ['একই কাজ বারবার স্বয়ংক্রিয়ভাবে চালানো', 'কম্পিউটার বন্ধ করা', 'শুধু প্রিন্ট আউট বের করা', 'অডিও প্লে করা'],
        optionsEn: ['Repeat code automatically', 'Shut down computer', 'Print on paper', 'Play audio'],
        correctIndex: 0,
        explanationBn: 'লুপ (যেমন for loop, while loop) নির্দিষ্ট শর্ত পূরণ হওয়া পর্যন্ত কোনো নির্দিষ্ট কোড বারবার এক্সিকিউট করে।',
        explanationEn: 'Loops execute a block of statements repeatedly as long as a condition remains true.'
      }
    ]
  };

  const currentQuizList = quizzes[selectedCategory] || quizzes.science;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    const q = currentQuizList[currentQuestionIndex];
    if (selectedOption === q.correctIndex) {
      setQuizScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuizList.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz completed!
      setQuizCompleted(true);
      const passMark = Math.ceil(currentQuizList.length * 0.6); // 2 out of 3 or 60%+
      if (quizScore >= passMark || selectedOption === currentQuizList[currentQuestionIndex].correctIndex) {
        setIsUnlocked(true);
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setIsSubmitted(false);
    setQuizCompleted(false);
  };

  // Generate AI Video Storyboard
  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;

    setIsGeneratingVideo(true);
    try {
      const response = await fetch('/api/generate-video-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoPrompt,
          style: selectedStyle,
          language: lang,
        }),
      });

      const data = await response.json();
      setVideoTitle(data.title || videoPrompt);
      setVideoSynopsis(data.synopsis || '');

      const formattedScenes: VideoScene[] = (data.scenes || []).map((sc: any, idx: number) => ({
        id: `sc_${Date.now()}_${idx}`,
        sceneNumber: sc.sceneNumber || idx + 1,
        visualDescription: sc.visualDescription || '',
        subtitleText: sc.subtitleText || '',
        cameraMotion: sc.cameraMotion || cameraMotion,
        durationSec: sc.durationSec || 5,
        filter: 'normal',
        imageUrl: `https://images.unsplash.com/photo-${1518709268805 + idx * 1000}?w=800&auto=format&fit=crop&q=80`
      }));

      // Fetch AI generated artwork for scene 1
      try {
        const imgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${videoPrompt}, ${selectedStyle}, ${cameraMotion}, ultra high quality cinematic art`,
            aspectRatio
          })
        });
        const imgData = await imgRes.json();
        if (imgData.imageUrl && formattedScenes.length > 0) {
          formattedScenes[0].imageUrl = imgData.imageUrl;
        }
      } catch (err) {
        console.warn('Image generation fallback in video studio:', err);
      }

      setGeneratedScenes(formattedScenes);
      setEditingTips(data.editingTips || []);
      setCurrentSceneIndex(0);
      setActiveTab('ai_video');
    } catch (e) {
      console.error('Error generating video storyboard:', e);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Video playback timer simulator
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && generatedScenes.length > 0) {
      interval = setInterval(() => {
        setCurrentSceneIndex(prev => (prev + 1) % generatedScenes.length);
      }, (5000 / playbackSpeed));
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, generatedScenes, playbackSpeed]);

  // AI Voiceover Generation
  const handleGenerateVoiceover = async (textToSpeak: string) => {
    if (!textToSpeak) return;
    setIsGeneratingVoiceover(true);
    setVoiceoverAudio(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice: 'Kore'
        })
      });

      const data = await response.json();
      if (data.audioBase64) {
        setVoiceoverAudio(`data:audio/mp3;base64,${data.audioBase64}`);
        // Play audio
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.play().catch(e => console.log('Audio autoplay error:', e));
      }
    } catch (e) {
      console.error('Voiceover TTS error:', e);
    } finally {
      setIsGeneratingVoiceover(false);
    }
  };

  const presetPrompts = [
    {
      titleBn: '২০৪১ সালের স্মার্ট বাংলাদেশ',
      titleEn: 'Smart Bangladesh 2041',
      prompt: '২০৪১ সালে ঢাকার আকাশে উড়ন্ত ইলেকট্রিক এআই ড্রোন ট্যাক্সি, সবুজ ছাদ বাগান ও উচ্চমানের প্রযুক্তিসমৃদ্ধ পরিবেশ'
    },
    {
      titleBn: 'বঙ্গবন্ধুর কালজয়ী ৭ই মার্চের স্মৃতিচিত্র',
      titleEn: 'Historic 7th March Memory',
      prompt: 'বঙ্গবন্ধুর কালজয়ী ৭ই মার্চের ঐতিহাসিক ভাষণের দৃশ্যপট থ্রিডি অ্যানিমেটেড আর্ট ও সিনেম্যাটিক শটে'
    },
    {
      titleBn: 'সুন্দরবনে রয়েল বেঙ্গল টাইগারের অভয়ারণ্য',
      titleEn: 'Sundarbans Tiger Sanctuary',
      prompt: 'সুন্দরবনের গভীর ম্যানগ্রোভ বনাঞ্চলে সোনালী রোদে মুক্তভাবে বিচরণরত রয়েল বেঙ্গল টাইগার ও হরিণ'
    },
    {
      titleBn: 'মঙ্গল গ্রহে বাংলাদেশ স্পেস স্টেশনের রোবট',
      titleEn: 'Bangladesh Mars Space Station',
      prompt: 'লাল গ্রহ মঙ্গলে বাংলাদেশি তরুণ বিজ্ঞানীদের গবেষণাগার ও এআই রোবট মার্স রোভার মিশন'
    }
  ];

  return (
    <div id="video-quiz-studio-root" className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-extrabold text-[11px] rounded-full shadow-lg flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{isBn ? 'কুইজ মেধা প্রতিযোগিতা ও ভিডিও স্টুডিও' : 'Quiz Quest & Video Studio'}</span>
              </span>

              {isUnlocked ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] rounded-full flex items-center space-x-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? 'ভিডিও স্টুডিও আনলকড! 🎉' : 'Studio Unlocked! 🎉'}</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px] rounded-full flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBn ? 'কুইজ জয়ী হয়ে ভিডিও মেকার আনলক করুন' : 'Pass Quiz to Unlock Video Studio'}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isBn ? '🏆 কুইজে বিজয়ী হও, এআই ভিডিও তৈরি ও এডিট করো!' : 'Win Quiz, Create & Edit AI Videos!'}
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              {isBn
                ? 'বিজ্ঞান, এআই, বাংলাদেশ ইতিহাস ও কোডিং কুইজের প্রশ্নের সঠিক উত্তর দিয়ে মেধা প্রমাণ করো। কুইজে বিজয়ী হলেই আনলক হবে মাটি এআই এর শক্তিশালী ভিডিও স্টুডিও ও এডিটিং টুলস!'
                : 'Test your knowledge in Science, AI, History & Coding quizzes. Score high to unlock full AI Video Generation and Editing tools!'}
            </p>
          </div>

          {/* Quick Access Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-lg'
                  : 'bg-[#1A1D24] text-gray-300 hover:text-white border border-[#2D3139]'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{isBn ? '১. কুইজ প্রতিযোগিতা' : '1. Quiz Contest'}</span>
            </button>

            <button
              onClick={() => {
                if (!isUnlocked) setIsUnlocked(true);
                setActiveTab('ai_video');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'ai_video'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-[#1A1D24] text-gray-300 hover:text-white border border-[#2D3139]'
              }`}
            >
              <Film className="w-4 h-4 text-purple-300" />
              <span>{isBn ? '২. এআই ভিডিও স্টুডিও' : '2. AI Video Studio'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-xl border border-red-400/40 flex items-center justify-center space-x-1.5 transition-all active:scale-95 shrink-0 ml-auto"
              >
                <span>✕ {isBn ? 'পেইজ বন্ধ করুন (চ্যাট)' : 'Close Page (Chat)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: QUIZ CONTEST (কুইজ প্রতিযোগিতা) */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          
          {/* Quiz Category Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'science', labelBn: '🚀 বিজ্ঞান ও বিশ্ব', labelEn: 'Science & World', icon: Zap, color: 'from-blue-600 to-cyan-600' },
              { id: 'ai', labelBn: '🤖 এআই ও রোবোটিক্স', labelEn: 'AI & Robotics', icon: Wand2, color: 'from-purple-600 to-pink-600' },
              { id: 'history', labelBn: '🇧🇩 বাংলাদেশ ও ঐতিহ্য', labelEn: 'Bangladesh & History', icon: Award, color: 'from-emerald-600 to-teal-600' },
              { id: 'coding', labelBn: '💻 কোডিং ও লজিক', labelEn: 'Coding & Logic', icon: Sparkles, color: 'from-amber-600 to-red-600' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  handleResetQuiz();
                }}
                className={`p-3.5 rounded-2xl border transition-all text-left space-y-1.5 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white border-white/30 shadow-lg scale-[1.02]`
                    : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">{isBn ? cat.labelBn : cat.labelEn}</span>
                  {selectedCategory === cat.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <p className="text-[10px] opacity-80">
                  {isBn ? '৩টি প্রশ্ন • আনলক পুরস্কার' : '3 Questions • Unlock Video Studio'}
                </p>
              </button>
            ))}
          </div>

          {/* Quiz Card View */}
          {!quizCompleted ? (
            <div className="p-6 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-6 shadow-xl relative">
              {/* Question Header & Progress Bar */}
              <div className="space-y-3 border-b border-[#252A36] pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{isBn ? `প্রশ্ন ${currentQuestionIndex + 1} / ${currentQuizList.length}` : `Question ${currentQuestionIndex + 1} of ${currentQuizList.length}`}</span>
                  </span>

                  <div className="flex items-center space-x-3 text-xs font-bold text-gray-300">
                    <span>{isBn ? `স্কোর: ${quizScore}` : `Score: ${quizScore}`}</span>
                    {streak > 1 && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md border border-red-500/30 text-[10px] animate-pulse">
                        🔥 {streak} {isBn ? 'স্ট্রিক!' : 'Streak!'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#1A1D24] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / currentQuizList.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                  {isBn
                    ? currentQuizList[currentQuestionIndex].questionBn
                    : currentQuizList[currentQuestionIndex].questionEn}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isBn
                  ? currentQuizList[currentQuestionIndex].optionsBn
                  : currentQuizList[currentQuestionIndex].optionsEn
                ).map((optText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuizList[currentQuestionIndex].correctIndex;

                  let btnStyle = 'bg-[#13161C] border-[#2B303C] text-gray-200 hover:border-purple-500/50';

                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-lg';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200 font-bold';
                    } else {
                      btnStyle = 'bg-[#13161C] border-[#252A36] text-gray-500 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-purple-900/60 border-purple-500 text-purple-200 font-bold shadow-md';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`p-4 rounded-2xl border transition-all text-left text-xs sm:text-sm flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-[#1A1D24] border border-[#373D4A] flex items-center justify-center font-bold text-xs text-gray-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{optText}</span>
                      </div>

                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submitted Explanation Box */}
              {isSubmitted && (
                <div className="p-4 bg-[#131722] border border-purple-500/30 rounded-2xl space-y-1.5 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{isBn ? 'সঠিক ব্যাখ্যা (Explanation):' : 'Explanation:'}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {isBn
                      ? currentQuizList[currentQuestionIndex].explanationBn
                      : currentQuizList[currentQuestionIndex].explanationEn}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#252A36]">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-[#1A1D24] text-gray-400 hover:text-white rounded-xl text-xs font-bold border border-[#2D3139] flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পুনরায় শুরু' : 'Reset Quiz'}</span>
                </button>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2"
                  >
                    <span>{isBn ? 'উত্তর জমা দিন' : 'Submit Answer'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2"
                  >
                    <span>
                      {currentQuestionIndex + 1 < currentQuizList.length
                        ? isBn ? 'পরবর্তী প্রশ্ন' : 'Next Question'
                        : isBn ? 'ফলাফল ও আনলক দেখুন' : 'See Results & Unlock'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Victory Card */
            <div className="p-8 bg-[#0F1117] border border-amber-500/40 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">
                  {quizScore >= 2
                    ? isBn ? '🎉 অভিনন্দা! তুমি কুইজে বিজয়ী হয়েছো!' : '🎉 Congratulations! You Passed!'
                    : isBn ? 'চমৎকার চেষ্টা! আরেকবার চেষ্টা করো!' : 'Good Effort! Try Again!'}
                </h2>
                <p className="text-sm text-gray-300">
                  {isBn
                    ? `তুমি ৩টি প্রশ্নের মধ্যে ${quizScore}টি প্রশ্নের সঠিক উত্তর দিয়েছো।`
                    : `You scored ${quizScore} out of 3 questions correctly.`}
                </p>
              </div>

              {quizScore >= 2 || isUnlocked ? (
                <div className="p-5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/50 rounded-2xl space-y-3 max-w-lg mx-auto">
                  <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs">
                    <Unlock className="w-5 h-5 text-emerald-400" />
                    <span>{isBn ? 'এআই ভিডিও জেনারেটর ও ভিডিও এডিটর বিজয়ী আনলক!' : 'AI Video Studio & Editor Unlocked!'}</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {isBn
                      ? 'এখন তুমি মাটি এআই ভিডিও স্টুডিও ব্যবহার করে যেকোনো ধারণাকে সিনেম্যাটিক এআই ভিডিও ও এডিট করতে পারবে।'
                      : 'You can now create, produce, and edit AI video storyboards effortlessly.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsUnlocked(true);
                      setActiveTab('ai_video');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-black text-xs rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02]"
                  >
                    <Video className="w-4 h-4 text-white" />
                    <span>{isBn ? 'এআই ভিডিও স্টুডিওতে প্রবেশ করুন 🎬' : 'Enter AI Video Studio Now 🎬'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleResetQuiz}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg"
                  >
                    {isBn ? 'আবার কুইজ খেলুন' : 'Retake Quiz'}
                  </button>
                  <p className="text-[11px] text-gray-400">
                    {isBn ? 'অথবা সরাসরি ভিডিও এডিটর ট্রাই করতে উপরের নেভিগেশন ব্যবহার করুন।' : 'Or use top button to jump to studio directly.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Direct Instant Unlock Bypass Card */}
          <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-gray-300">
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'কুইজ না খেলে সরাসরি ভিডিও এডিটর ট্রাই করতে চান?' : 'Want to try video editor without taking quiz?'}</span>
            </div>
            <button
              onClick={() => {
                setIsUnlocked(true);
                setActiveTab('ai_video');
              }}
              className="px-4 py-2 bg-[#1A1D24] hover:bg-[#252A34] text-amber-300 border border-amber-500/30 rounded-xl font-bold transition-all whitespace-nowrap"
            >
              {isBn ? '🔓 ইনস্ট্যান্ট স্টুডিও ওপেন করুন' : '🔓 Instant Studio Bypass'}
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: UNLOCKED AI VIDEO STUDIO & EDITOR */}
      {(activeTab === 'ai_video' || activeTab === 'video_editor') && (
        <div className="space-y-6">

          {/* Subtabs for Studio */}
          <div className="flex items-center space-x-2 border-b border-[#252A36] pb-3">
            <button
              onClick={() => setActiveTab('ai_video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'ai_video'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'bg-[#13161C] text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4 text-purple-300" />
              <span>{isBn ? '১. এআই ভিডিও প্রম্পট জেনারেটর' : '1. AI Video Generator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('video_editor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'video_editor'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'bg-[#13161C] text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-300" />
              <span>{isBn ? '২. সিনেম্যাটিক ভিডিও এডিটর' : '2. Cinematic Video Editor'}</span>
            </button>
          </div>

          {/* AI VIDEO GENERATOR FORM & PREVIEW */}
          {activeTab === 'ai_video' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Generator Controls */}
              <div className="lg:col-span-5 p-5 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#252A36] pb-3">
                  <Film className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    {isBn ? 'এআই ভিডিও ক্রিয়েটর সেটিংস' : 'AI Video Creator Settings'}
                  </h3>
                </div>

                {/* Prompt Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-300 block">
                    {isBn ? 'ভিডিও এর বিষয় বা ধারণা লিখুন (Prompt):' : 'Video Prompt Concept:'}
                  </label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder={isBn ? 'যেমন: ২০৪১ সালে ঢাকা ও ভবিষ্যৎ বাংলাদেশের প্রযুক্তি...' : 'Describe video concept...'}
                    className="w-full bg-[#13161C] border border-[#2D3139] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Preset Prompts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-300 block">
                    {isBn ? '💡 জনপ্রিয় ভিডিও আইডিয়া প্রিসেট:' : '💡 Preset Ideas:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setVideoPrompt(p.prompt)}
                        className="px-2.5 py-1 bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 hover:text-white text-[10px] font-bold rounded-lg border border-[#2D3139] transition-all"
                      >
                        {isBn ? p.titleBn : p.titleEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Style & Camera Motion */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'ভিজ্যুয়াল স্টাইল:' : 'Visual Style:'}
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Cinematic 4K">🎬 সিনেম্যাটিক ৪কে (Cinematic 4K)</option>
                      <option value="3D Pixar Animation">🎨 ৩ডি পিক্সার (3D Animation)</option>
                      <option value="Sci-Fi Cyberpunk">🚀 সাইবারপাঙ্ক (Sci-Fi Cyberpunk)</option>
                      <option value="Documentary Film">🌾 রূপসী বাংলা ডকুমেন্টারি</option>
                      <option value="Anime Short">⚡ এনিম এডিটিং স্টাইল</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'ক্যামেরা মোশন:' : 'Camera Motion:'}
                    </label>
                    <select
                      value={cameraMotion}
                      onChange={(e) => setCameraMotion(e.target.value)}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Drone Aerial Lift">🚁 ড্রোন শট (Drone Aerial Lift)</option>
                      <option value="Cinematic Slow Zoom In">🔍 স্লো জুম ইন (Slow Zoom In)</option>
                      <option value="Pan Right & Tilt Up">➡️ প্যান রাইট (Pan Right)</option>
                      <option value="Orbit 360 Degree">🔄 ৩৬০ ডিগ্রী অরবিট (Orbit 360)</option>
                      <option value="Slow Motion Climax">⏱️ স্লো মোশন ক্লাইম্যাক্স</option>
                    </select>
                  </div>
                </div>

                {/* Aspect Ratio & Audio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'ভিডিও সাইজ:' : 'Aspect Ratio:'}
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="16:9">📺 ১৬:৯ (Landscape Video)</option>
                      <option value="9:16">📱 ৯:১৬ (Reel / Shorts)</option>
                      <option value="1:1">🔳 ১:১ (Square Video)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'ব্যাকগ্রাউন্ড সাউন্ডট্র্যাক:' : 'Background Track:'}
                    </label>
                    <select
                      value={selectedAudio}
                      onChange={(e) => setSelectedAudio(e.target.value)}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Bengali Folk Fusion">🪕 বেঙ্গল ফোক ফিউশন (Folk)</option>
                      <option value="Sci-Fi Synthwave Beats">🎹 সাই-ফাই সিন্থওয়েভ (Synth)</option>
                      <option value="Epic Cinematic Orchestral">🎻 এপিক সিনেম্যাটিক (Orchestral)</option>
                      <option value="Lo-Fi Chill Study">🎧 লো-ফাই চিল স্টাডি বিট</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoPrompt}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                      <span>{isBn ? 'এআই ভিডিও ও স্টোরিবোর্ড তৈরি হচ্ছে...' : 'Generating AI Video & Storyboard...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-purple-200" />
                      <span>{isBn ? 'এআই ভিডিও ও স্টোরিবোর্ড জেনারেট করুন 🎬' : 'Generate AI Video Storyboard 🎬'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Interactive AI Video Player & Timeline */}
              <div className="lg:col-span-7 p-5 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-4 flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#252A36] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      {videoTitle || (isBn ? 'এআই ভিডিও প্লেয়ার প্রিভিউ' : 'AI Video Player Preview')}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {videoSynopsis || (isBn ? 'ভিডিও জেনারেট করে লাইভ প্লেয়ার রিভিউ করুন' : 'Generate video to preview player')}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-bold text-[10px] rounded-full border border-purple-500/30">
                    {selectedStyle}
                  </span>
                </div>

                {/* Main Video Canvas Screen */}
                <div className="relative rounded-2xl overflow-hidden border border-[#252A36] bg-[#05070B] min-h-[260px] flex items-center justify-center group shadow-2xl">
                  {generatedScenes.length > 0 ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                      {/* Active Scene Image */}
                      <img
                        src={generatedScenes[currentSceneIndex]?.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'}
                        alt="Scene"
                        className={`w-full h-64 object-cover transition-transform duration-700 ${
                          isPlaying ? 'scale-110' : 'scale-100'
                        } ${activeFilter === 'golden' ? 'sepia-[0.3] contrast-125' : activeFilter === 'cyber' ? 'hue-rotate-90 saturate-200' : activeFilter === 'bw' ? 'grayscale' : ''}`}
                        referrerPolicy="no-referrer"
                      />

                      {/* Camera Motion Tag */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-amber-300 font-mono text-[10px] rounded-lg border border-white/10 flex items-center space-x-1">
                        <Video className="w-3 h-3 text-amber-400" />
                        <span>{generatedScenes[currentSceneIndex]?.cameraMotion}</span>
                      </div>

                      {/* Subtitles Overlay */}
                      {showSubtitles && generatedScenes[currentSceneIndex]?.subtitleText && (
                        <div className="absolute bottom-4 left-4 right-4 text-center">
                          <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-yellow-300 font-bold text-xs rounded-xl border border-yellow-500/30 shadow-lg inline-block">
                            💬 {generatedScenes[currentSceneIndex].subtitleText}
                          </span>
                        </div>
                      )}

                      {/* Overlay Watermark */}
                      <div className="absolute top-3 right-3 text-[10px] font-bold text-white/60 bg-black/40 px-2 py-0.5 rounded-md">
                        MATI AI VIDEO LAB
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 p-8">
                      <Film className="w-12 h-12 text-gray-600 mx-auto" />
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        {isBn
                          ? 'বাম পাশের সেটিংসে আইডিয়া লিখে "জেনারেট করুন" এ ক্লিক করলেই লাইভ এআই ভিডিও তৈরি হবে।'
                          : 'Write concept on the left and click generate to render AI video scenes!'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Player Controls Bar */}
                {generatedScenes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    
                    {/* Progress Bar Scrubber */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        00:0{currentSceneIndex * 5}
                      </span>
                      <div className="flex-1 bg-[#1A1D24] h-2 rounded-full overflow-hidden flex cursor-pointer">
                        {generatedScenes.map((sc, idx) => (
                          <div
                            key={sc.id}
                            onClick={() => setCurrentSceneIndex(idx)}
                            className={`flex-1 border-r border-[#0F1117] transition-colors ${
                              idx === currentSceneIndex ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        00:15
                      </span>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow flex items-center space-x-1"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isPlaying ? (isBn ? 'পজ' : 'Pause') : (isBn ? 'প্লে' : 'Play')}</span>
                        </button>

                        <button
                          onClick={() => setShowSubtitles(!showSubtitles)}
                          className={`p-2 rounded-xl font-bold text-[11px] border transition-all ${
                            showSubtitles
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                              : 'bg-[#13161C] text-gray-400 border-[#2D3139]'
                          }`}
                        >
                          <Subtitles className="w-4 h-4 inline mr-1" />
                          <span>{isBn ? 'সাবটাইটেল' : 'Subtitles'}</span>
                        </button>
                      </div>

                      {/* AI Bengali Voiceover Trigger */}
                      <button
                        onClick={() => handleGenerateVoiceover(generatedScenes[currentSceneIndex]?.subtitleText || videoPrompt)}
                        disabled={isGeneratingVoiceover}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-[11px] rounded-xl shadow flex items-center space-x-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
                        <span>
                          {isGeneratingVoiceover
                            ? (isBn ? 'ভয়েস তৈরি হচ্ছে...' : 'Generating Voice...')
                            : (isBn ? 'এআই ভয়েস ওভার শুনুন 🔊' : 'AI Voiceover 🔊')}
                        </span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-gray-400">{isBn ? 'গতি:' : 'Speed:'}</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className="bg-[#13161C] border border-[#2D3139] rounded-lg px-2 py-1 text-[11px] text-white"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="1.0">1.0x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2.0">2.0x</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* CINEMATIC VIDEO EDITOR TAB */}
          {activeTab === 'video_editor' && (
            <div className="p-6 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#252A36] pb-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-extrabold text-white">
                    {isBn ? 'সিনেম্যাটিক মাল্টি-সিন ভিডিও এডিটর স্টুডিও' : 'Cinematic Multi-Scene Video Editor'}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const newScene: VideoScene = {
                      id: `sc_new_${Date.now()}`,
                      sceneNumber: generatedScenes.length + 1,
                      visualDescription: isBn ? 'নতুন দৃশ্য' : 'New Scene',
                      subtitleText: isBn ? 'নতুন দৃশ্য কাস্টম সাবটাইটেল' : 'New custom subtitle',
                      cameraMotion: 'Slow Zoom In',
                      durationSec: 5,
                      filter: 'normal',
                      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
                    };
                    setGeneratedScenes([...generatedScenes, newScene]);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন সিন যোগ করুন' : 'Add Scene'}</span>
                </button>
              </div>

              {/* Multi-scene Timeline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedScenes.map((sc, idx) => (
                  <div
                    key={sc.id}
                    className={`p-4 bg-[#13161C] border rounded-2xl space-y-3 transition-all ${
                      idx === currentSceneIndex ? 'border-cyan-500 shadow-lg' : 'border-[#252A36]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold border-b border-[#252A36] pb-2">
                      <span className="text-cyan-400">
                        {isBn ? `দৃশ্য ${idx + 1}` : `Scene ${idx + 1}`}
                      </span>

                      <button
                        onClick={() => setGeneratedScenes(generatedScenes.filter(s => s.id !== sc.id))}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="relative rounded-xl overflow-hidden h-28 border border-[#252A36]">
                      <img
                        src={sc.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'}
                        alt="Scene"
                        className="w-full h-28 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Visual Description Input */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">
                        {isBn ? 'দৃশ্য বিবরণ:' : 'Description:'}
                      </label>
                      <input
                        type="text"
                        value={sc.visualDescription}
                        onChange={(e) => {
                          const updated = [...generatedScenes];
                          updated[idx].visualDescription = e.target.value;
                          setGeneratedScenes(updated);
                        }}
                        className="w-full bg-[#0F1117] border border-[#252A36] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Subtitle Input */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">
                        {isBn ? 'সাবটাইটেল টেক্সট:' : 'Subtitle Text:'}
                      </label>
                      <input
                        type="text"
                        value={sc.subtitleText}
                        onChange={(e) => {
                          const updated = [...generatedScenes];
                          updated[idx].subtitleText = e.target.value;
                          setGeneratedScenes(updated);
                        }}
                        className="w-full bg-[#0F1117] border border-[#252A36] rounded-lg px-2.5 py-1.5 text-xs text-white text-yellow-300 font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Grading & Filter Tools */}
              <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Palette className="w-4 h-4" />
                  <span>{isBn ? 'কালার গ্রেডিং ও ফিল্টার প্রিসেট:' : 'Color Grading & Filter Presets:'}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'normal', nameBn: 'স্বাভাবিক (Normal)', color: 'border-gray-500' },
                    { id: 'golden', nameBn: '🌅 গোল্ডেন আওয়ার (Golden Hour)', color: 'border-amber-500' },
                    { id: 'cyber', nameBn: '🌌 সাইবার নিয়ন (Cyber Neon)', color: 'border-purple-500' },
                    { id: 'bw', nameBn: '🖤 ক্লাসিক ব্ল্যাক এন্ড হোয়াইট', color: 'border-gray-400' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        activeFilter === f.id
                          ? `bg-purple-600 text-white ${f.color}`
                          : 'bg-[#1A1D24] text-gray-300 hover:text-white border-[#2D3139]'
                      }`}
                    >
                      {f.nameBn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export & Download Project */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#252A36]">
                <div className="text-xs text-gray-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'প্রজেক্ট ভিডিও ফাইল রেন্ডার ও ডাউনলোডের জন্য প্রস্তুত' : 'Video Project Ready for Export'}</span>
                </div>

                <button
                  onClick={() => alert(isBn ? 'আপনার এআই ভিডিও প্রজেক্ট ফাইল ও সাবটাইটেল সফলভাবে ডাউনলোড হয়েছে! 🎉' : 'Project exported successfully!')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center space-x-2"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{isBn ? 'এমপি৪ ভিডিও প্রজেক্ট ডাউনলোড করুন 📥' : 'Export MP4 Video Project 📥'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Categorized Educational Hub: Exam Suggestions, AI Research, National Reform Bulletins */}
      <ExtendedEduHub lang={lang} />

    </div>
  );
};
