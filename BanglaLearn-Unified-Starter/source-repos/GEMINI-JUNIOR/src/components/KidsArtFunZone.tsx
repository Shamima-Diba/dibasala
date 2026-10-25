import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Download,
  RefreshCw,
  Gamepad2,
  HelpCircle,
  Zap,
  Flame,
  Rocket,
  Wand2,
  BrainCircuit,
  Trophy,
  Smile,
  Copy,
  ChevronRight
} from 'lucide-react';

interface KidsArtFunZoneProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

export const KidsArtFunZone: React.FC<KidsArtFunZoneProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'art' | 'riddles' | 'scifi' | 'avatar'>('art');

  // Kids Art Generator State
  const [artPrompt, setArtPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3D Pixar Cartoon');
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [generatedArtUrl, setGeneratedArtUrl] = useState<string | null>(null);

  // Riddles State
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  // SciFi Story State
  const [heroName, setHeroName] = useState('আরিফ');
  const [storyTopic, setStoryTopic] = useState('মহাকাশে সময় ভ্রমণ ও টাইম মেশিন');
  const [storyContent, setStoryContent] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Preset Kids Art Prompts
  const kidsPresets = [
    {
      titleBn: 'সুন্দর বাংলা গ্রাম ও রূপসী নদী',
      titleEn: 'Beautiful Bangladesh Village & River',
      prompt: 'A joyful 3D Pixar animated illustration of a beautiful peaceful Bangladeshi village with green paddy fields, river with colorful wooden boats, palm trees, sunny morning, ultra cute aesthetic'
    },
    {
      titleBn: 'মহাকাশে রকেট ও নতুন গ্রহ',
      titleEn: 'Space Rocket & Outer Planets',
      prompt: 'Vibrant futuristic sci-fi cartoon illustration of a cool teenager astronaut riding a colorful space rocket through glowing nebula stars and planets, high detail 3D render'
    },
    {
      titleBn: 'বন্ধু রোবট ও উড়ন্ত বাইক',
      titleEn: 'Friendly Robot & Flying Bike',
      prompt: 'Cute friendly friendly metallic robot driving a futuristic flying hoverbike with a teenage boy in 2041 Dhaka city, sunset neon lights, anime style artwork'
    },
    {
      titleBn: 'সুন্দর রয়েল বেঙ্গল টাইগার বন্ধু',
      titleEn: 'Cute Royal Bengal Tiger Friend',
      prompt: 'Adorable cute friendly cartoon Royal Bengal tiger wearing a superhero cape in the Sundarbans mangrove forest, fairytale fantasy watercolor style'
    },
    {
      titleBn: 'ভবিষ্যতের স্মার্ট বাংলাদেশ স্কুল',
      titleEn: 'Futuristic Smart School 2041',
      prompt: 'An inspiring futuristic high-tech school classroom with hologram teacher, flying books, friendly AI assistant, happy children, bright vibrant colors'
    },
    {
      titleBn: 'সাইবারস্পেস ও ডিজিটাল সুপারহিরো',
      titleEn: 'Cyberspace Tech Superhero',
      prompt: 'Cool teenage superhero with glowing blue digital neon armor coding on a futuristic transparent laptop, energetic comic book cover art style'
    }
  ];

  const artStyles = [
    '3D Pixar Cartoon',
    'Anime Digital Art',
    'Comic Book Superhero',
    'Watercolor Fantasy',
    'Cyberpunk Neon',
    'Pencil Color Sketch'
  ];

  // Kids Riddles Data
  const riddles = [
    {
      qBn: 'আমি লাল, আমি সবুজ, কিন্তু পানি দিলে আমি মরে যাই। বাতাসে আমি বড় হই। আমি কে?',
      qEn: 'I am red or green, I die with water, but grow with air. What am I?',
      aBn: 'আগুন (Fire)! 🔥',
      aEn: 'Fire! 🔥'
    },
    {
      qBn: 'যত বেশি ব্যবহার করবে, তত বেশি আমি বড় ও শক্তিশালী হব। চিন্তা না করলে আমি দুর্বল হয়ে যাই। আমি কী?',
      qEn: 'The more you use me, the stronger I get. If you stop thinking, I weaken. What am I?',
      aBn: 'তোমার ব্রেইন বা মস্তিষ্ক (Brain)! 🧠',
      aEn: 'Your Brain! 🧠'
    },
    {
      qBn: 'আমার চারটা পা আছে কিন্তু হাঁটতে পারি না। পিঠে তোমার বই রাখতে পারো। আমি কে?',
      qEn: 'I have four legs but cannot walk. You put your books on me. What am I?',
      aBn: 'পড়াশোনার টেবিল (Study Table)! 🪑',
      aEn: 'A Study Table! 🪑'
    },
    {
      qBn: 'এমন একটি ঘর আছে যার কোন দরজা বা জানালা নেই, কিন্তু তার ভেতরে পুষ্টিকর সুস্বাদু খাবার থাকে! সেটি কী?',
      qEn: 'A house with no doors or windows, yet full of yummy healthy food inside! What is it?',
      aBn: 'ডিম (Egg) অথবা নারিকেল (Coconut)! 🥚🥥',
      aEn: 'An Egg or Coconut! 🥚🥥'
    }
  ];

  const handleGenerateArt = async (customPrompt?: string) => {
    const promptToUse = customPrompt || artPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingArt(true);
    setGeneratedArtUrl(null);

    const styledPrompt = `${promptToUse}, styled as ${selectedStyle}, highly detailed, vibrant colors, kid-friendly art`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: styledPrompt, aspectRatio: '1:1' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate art');
      setGeneratedArtUrl(data.imageUrl);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    setStoryContent('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `An exciting sci-fi adventure story featuring a brave young hero named ${heroName} dealing with ${storyTopic}. Make it highly engaging, full of fun science facts, moral lessons, and thrilling plot twists!`,
          gradeLevel: 'Teens & Kids',
          type: 'lesson',
          language: lang,
        }),
      });

      const data = await response.json();
      if (data.lesson) {
        setStoryContent(data.lesson);
      } else {
        setStoryContent(isBn ? 'গল্প তৈরি করা সম্ভব হয়নি।' : 'Failed to generate story.');
      }
    } catch (e: any) {
      setStoryContent(isBn ? 'সার্ভার ত্রুটি।' : 'Server error.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB] space-y-6">
      
      {/* Friendly Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-white/20">
            <Smile className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
              {isBn ? 'বাচ্চাদের ছবি আঁকা ও কিশোর ফান ক্লাব' : 'Kids Art Studio & Youth Fun Zone'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isBn
                ? 'সহজ ও আকর্ষণীয় ইন্টারফেসে কার্টুন ছবি তৈরি, ধোঁধাঁ গেম এবং কল্পবিজ্ঞান গল্প উপভোগ করুন!'
                : 'Simple, interactive, and colorful fun space with AI Art, Brain Riddles & Sci-Fi Adventures!'}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#1A1D24] rounded-xl border border-[#2D3139] overflow-x-auto">
          <button
            onClick={() => setActiveTab('art')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'art'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-300" />
            <span>{isBn ? '১. বাচ্চাদের আর্ট স্টুডিও' : '1. Kids Art Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('riddles')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'riddles'
                ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>{isBn ? '২. ধাঁধা ও ব্রেইন চ্যালেঞ্জ' : '2. Brain Riddles'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scifi')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'scifi'
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Rocket className="w-4 h-4 text-cyan-300" />
            <span>{isBn ? '৩. সাই-ফাই গল্প জেনারেটর' : '3. Sci-Fi Adventure'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KIDS ART STUDIO */}
      {activeTab === 'art' && (
        <div className="space-y-6">
          
          {/* Quick Style Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isBn ? '🎨 আর্ট স্টাইল নির্বাচন করুন:' : '🎨 Select Art Style:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {artStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedStyle === style
                      ? 'bg-pink-600/20 text-pink-300 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                      : 'bg-[#13161C] text-gray-400 border-[#2D3139] hover:text-gray-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* 1-Click Kids Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'এক ক্লিকে বাচ্চাদের কার্টুন ছবি জেনারেট করুন:' : 'One-Click Kids Cartoon Presets:'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {kidsPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setArtPrompt(preset.prompt);
                    handleGenerateArt(preset.prompt);
                  }}
                  className="p-3.5 rounded-xl bg-[#13161C] hover:bg-[#1A1E29] border border-[#252A36] hover:border-pink-500/50 cursor-pointer transition-all group space-y-1 shadow-md hover:shadow-pink-500/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 group-hover:text-pink-300 transition-colors">
                      {isBn ? preset.titleBn : preset.titleEn}
                    </span>
                    <Wand2 className="w-3.5 h-3.5 text-gray-400 group-hover:scale-125 group-hover:text-pink-400 transition-all" />
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">
                    {preset.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompt Box & Generate */}
          <div className="bg-[#0A0C10] p-4 rounded-xl border border-[#1F2937] space-y-3">
            <label className="block text-xs font-bold text-gray-300">
              {isBn ? 'অথবা নিজের ইচ্ছেমতো ছবির প্রম্পট লিখুন:' : 'Or type your own imaginative artwork prompt:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={artPrompt}
                onChange={(e) => setArtPrompt(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: লাল শাপলা ফুল ও রঙিন প্রজাপতি নিয়ে খেলা করছে একটি বাচ্চা মেয়ে...'
                    : 'e.g., A cute little boy playing with a shiny silver friendly robot dog in a sunny garden...'
                }
                className="flex-1 bg-[#13161C] border border-[#2D3139] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => handleGenerateArt()}
                disabled={isGeneratingArt || !artPrompt.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isGeneratingArt ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{isBn ? 'আকা হচ্ছে...' : 'Drawing...'}</span>
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 text-amber-300" />
                    <span>{isBn ? 'ছবি তৈরি করো' : 'Draw Image'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Render Generated Artwork */}
          {generatedArtUrl && (
            <div className="bg-[#0A0C10] border border-[#1F2937] p-4 rounded-2xl flex flex-col items-center space-y-3 shadow-2xl">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>{isBn ? 'আপনার তৈরি কার্টুন চিত্র:' : 'Your Custom Cartoon Artwork:'}</span>
              </span>
              <img
                src={generatedArtUrl}
                alt="Kids AI Art"
                className="max-h-96 w-auto object-contain rounded-xl border border-pink-500/30 shadow-2xl"
              />
              <a
                href={generatedArtUrl}
                download="mati-ai-kids-art.png"
                className="px-4 py-2 rounded-xl bg-pink-600/20 text-pink-300 hover:bg-pink-600/30 text-xs font-bold border border-pink-500/30 flex items-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'ছবিটি সেভ বা গ্যালারিতে ডাউনলোড করো' : 'Save / Download Image'}</span>
              </a>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: BRAIN RIDDLES & FUN PUZZLES */}
      {activeTab === 'riddles' && (
        <div className="bg-[#0A0C10] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                {isBn ? 'মজাদার বুদ্ধির ধাঁধা ও মাইন্ড গেম' : 'Fun Mind Riddles & Brain Teasers'}
              </h3>
            </div>

            <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">
                {isBn ? `স্কোর: ${score}` : `Score: ${score}`}
              </span>
            </div>
          </div>

          <div className="p-6 bg-[#13161C] rounded-2xl border border-[#252A36] space-y-4 text-center">
            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {isBn ? `ধাঁধা নম্বর ${riddleIndex + 1} / ${riddles.length}` : `Riddle #${riddleIndex + 1} of ${riddles.length}`}
            </span>

            <p className="text-base sm:text-lg font-bold text-gray-100 leading-relaxed px-2">
              "{isBn ? riddles[riddleIndex].qBn : riddles[riddleIndex].qEn}"
            </p>

            {showAnswer ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 animate-fadeIn">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {isBn ? 'সঠিক উত্তর:' : 'Correct Answer:'}
                </span>
                <p className="text-base font-black text-emerald-300">
                  {isBn ? riddles[riddleIndex].aBn : riddles[riddleIndex].aEn}
                </p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAnswer(true);
                  setScore((s) => s + 10);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-emerald-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                {isBn ? 'উত্তর দেখুন' : 'Show Answer'}
              </button>
            )}

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowAnswer(false);
                  setRiddleIndex((idx) => (idx + 1) % riddles.length);
                }}
                className="px-4 py-2 bg-[#1F2533] hover:bg-[#2A3142] text-gray-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all border border-[#343D52]"
              >
                <span>{isBn ? 'পরবর্তী ধাঁধা' : 'Next Riddle'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCI-FI STORY ADVENTURE */}
      {activeTab === 'scifi' && (
        <div className="bg-[#0A0C10] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="border-b border-[#1F2937] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span>{isBn ? 'কিশোর কল্পবিজ্ঞান ও অ্যাডভেঞ্চার গল্প জেনারেটর' : 'Teen Sci-Fi Adventure Story Generator'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isBn
                ? 'তোমার নাম ও পছন্দের বিষয় দিয়ে চমৎকার সায়েন্স ফিকশন গল্প তৈরি করো:'
                : 'Create personalized exciting science fiction adventure stories with your name:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {isBn ? 'নায়ক বা ক্যারেক্টারের নাম:' : 'Hero / Character Name:'}
              </label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="আরিফ / সাকিব"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {isBn ? 'গল্পের বিষয় বা অ্যাডভেঞ্চার:' : 'Adventure Topic:'}
              </label>
              <select
                value={storyTopic}
                onChange={(e) => setStoryTopic(e.target.value)}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="মহাকাশে সময় ভ্রমণ ও টাইম মেশিন">{isBn ? '১. টাইম মেশিনে ২০৪১ সালের ঢাকায় ভ্রমণ' : '1. Time Travel to Dhaka 2041'}</option>
                <option value="রোবট বন্ধুদের সাথে রকেট মিশন">{isBn ? '২. মঙ্গল গ্রহে রোবট বন্ধুদের সাথে সিক্রেট মিশন' : '2. Secret Mission to Mars'}</option>
                <option value="সাগরের অতল গহ্বরে রহস্যময় শহর">{isBn ? '৩. বঙ্গোপসাগরের তলদেশে হাই-টেক পানির শহর' : '3. Underwater Cyber City in Bay of Bengal'}</option>
                <option value="সুপারহিরো কোডিং ও এআই পাওয়ার">{isBn ? '৪. কোডিং শিখে পৃথিবী বাঁচানোর এআই মিশন' : '4. Saving the Planet with AI Coding'}</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateStory}
            disabled={isGeneratingStory}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            {isGeneratingStory ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{isBn ? 'গল্প তৈরি হচ্ছে...' : 'Generating Story...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{isBn ? 'অ্যাডভেঞ্চার গল্প তৈরি করো' : 'Generate Adventure Story'}</span>
              </>
            )}
          </button>

          {storyContent && (
            <div className="p-5 bg-[#13161C] rounded-xl border border-[#252A36] text-xs text-gray-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {storyContent}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
