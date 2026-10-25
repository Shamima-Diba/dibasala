import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, RefreshCw, Layers } from 'lucide-react';

interface ImageStudioProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ lang }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const presets = [
    {
      bn: 'কম্পিউটার সিপিইউ এবং ভেতরের মাদারবোর্ডের সুন্দর ইলাস্ট্রেশন',
      en: 'Futuristic diagram of computer CPU and motherboard components',
    },
    {
      bn: 'গাছের শালোকসংশ্লেষণ প্রক্রিয়ার বিজ্ঞানসম্মত ডায়াগ্রাম',
      en: 'Scientific educational diagram of plant photosynthesis',
    },
    {
      bn: 'মহাকাশের সৌরজগতের গ্রহগুলোর সুন্দর ২ডি আর্টওয়ার্ক',
      en: 'Vibrant educational 2D artwork of the solar system planets',
    },
    {
      bn: 'কৃত্রিম বুদ্ধিমত্তা ও রোবোটিক্স শিক্ষার ডিজিটাল পোস্টার',
      en: 'Digital learning poster for artificial intelligence and robotics',
    },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate image');

      setGeneratedImage(data.imageUrl);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#1F2937] flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-white/10">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {lang === 'bn' ? 'এআই ভিজ্যুয়াল ও চিত্র ল্যাব' : 'AI Diagram & Image Studio'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'bn'
              ? 'পড়াশোনা ও শিক্ষার জন্য যেকোনো চিত্র, সায়েন্স ডায়াগ্রাম বা আর্টওয়ার্ক এআই দিয়ে তৈরি করুন'
              : 'Generate educational diagrams, illustrations, and visual art with Gemini AI'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        
        {/* Input Form */}
        <div className="space-y-4 bg-[#0A0C10] p-4 rounded-xl border border-[#1F2937]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              {lang === 'bn' ? 'ছবির বিবরণ বা প্রম্পট লিখুন:' : 'Describe Image Prompt:'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                lang === 'bn'
                  ? 'যেমন: মানব হৃদপিণ্ডের গঠন ও রক্ত সঞ্চালন প্রক্রিয়ার শিক্ষণীয় ডায়াগ্রাম...'
                  : 'e.g., An educational diagram showing human heart anatomy and blood circulation...'
              }
              className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl p-3 text-xs text-[#E6E8EB] focus:outline-none focus:border-blue-500 resize-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              {lang === 'bn' ? 'অ্যাসপেক্ট রেশিও:' : 'Aspect Ratio:'}
            </label>
            <div className="flex space-x-2">
              {['1:1', '16:9', '4:3', '9:16'].map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                    aspectRatio === r
                      ? 'bg-blue-600 border-blue-500 text-white shadow'
                      : 'bg-[#13161C] border-[#2D3139] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              {lang === 'bn' ? '💡 নমুনা প্রম্পট আইডিয়া:' : '💡 Sample Prompt Ideas:'}
            </span>
            <div className="space-y-2">
              {presets.map((p, idx) => {
                const text = lang === 'bn' ? p.bn : p.en;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(text);
                      handleGenerate(text);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#13161C] hover:bg-[#1A1D24] border border-[#2D3139] text-xs text-gray-300 transition-all flex items-center justify-between group"
                  >
                    <span>{text}</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {loading
                ? lang === 'bn' ? 'ছবি জেনারেট হচ্ছে...' : 'Generating Image...'
                : lang === 'bn' ? 'ছবি তৈরি করুন' : 'Generate Image'}
            </span>
          </button>
        </div>

        {/* Display Canvas */}
        <div className="flex flex-col items-center justify-center bg-[#0A0C10] border border-[#1F2937] rounded-xl p-4 min-h-[360px]">
          {loading ? (
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs text-gray-400">
                {lang === 'bn'
                  ? 'জেমিনি ইমেজ মডেল প্রসেস করছে, অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন...'
                  : 'Gemini Image Model is synthesizing the artwork...'}
              </p>
            </div>
          ) : generatedImage ? (
            <div className="w-full flex flex-col items-center space-y-3">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="max-h-96 w-auto object-contain rounded-xl border border-[#2D3139] shadow-2xl"
              />
              <a
                href={generatedImage}
                download="junior-gemini-artwork.png"
                className="px-4 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-[#2D3139]"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>{lang === 'bn' ? 'ছবি ডাউনলোড করুন' : 'Download Artwork'}</span>
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6">
              <Layers className="w-12 h-12 mx-auto mb-2 opacity-40 text-blue-400" />
              <p className="text-xs">
                {lang === 'bn'
                  ? 'বামে প্রম্পট লিখে "ছবি তৈরি করুন" বাটনে ক্লিক করুন।'
                  : 'Enter a prompt on the left and click "Generate Image".'}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
