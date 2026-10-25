import React from 'react';
import { Lightbulb, BookOpen, Code, Calculator, Languages, Sprout, FileText, ArrowRight } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/prompts';
import { PromptTemplate } from '../types';

interface PromptLabProps {
  lang: 'bn' | 'en';
  onSelectPrompt: (promptText: string) => void;
}

export const PromptLab: React.FC<PromptLabProps> = ({ lang, onSelectPrompt }) => {
  const categories = [
    { id: 'learning', labelBn: 'শিক্ষা ও আইসিটি', labelEn: 'Education & ICT', icon: BookOpen },
    { id: 'coding', labelBn: 'প্রোগ্রামিং ও টেক', labelEn: 'Coding & Tech', icon: Code },
    { id: 'math', labelBn: 'গণিত ও লজিক', labelEn: 'Math & Logic', icon: Calculator },
    { id: 'english', labelBn: 'ইংরেজি ভাষা', labelEn: 'English Language', icon: Languages },
    { id: 'practical', labelBn: 'ব্যবহারিক ও কৃষি প্রযুক্তি', labelEn: 'Practical & Agri-Tech', icon: Sprout },
  ];

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#1F2937] flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-white/10">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {lang === 'bn' ? 'প্রম্পট ল্যাব ও রেডিমেড টেমপ্লেট' : 'Prompt Lab & Readiness Templates'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'bn'
              ? 'গ্রামগঞ্জ ও প্রত্যন্ত অঞ্চলের শিক্ষার্থীদের জন্য তৈরি বিশেষ প্রম্পট টেমপ্লেট (এক ক্লিকে ক্লিক করুন)'
              : 'Pre-engineered prompt templates for students, teachers, and learners'}
          </p>
        </div>
      </div>

      {/* Grid of Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {PROMPT_TEMPLATES.map((tmpl: PromptTemplate) => {
          const title = lang === 'bn' ? tmpl.titleBn : tmpl.title;
          const promptText = lang === 'bn' ? tmpl.promptBn : tmpl.prompt;

          return (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between p-4 bg-[#0A0C10] hover:bg-[#13161C] rounded-xl border border-[#1F2937] hover:border-blue-500/50 transition-all group shadow-md hover:shadow-blue-500/5"
            >
              <div>
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Lightbulb className="w-4 h-4 text-amber-300" />
                  </div>
                  <h3 className="text-sm font-bold text-[#E6E8EB] group-hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                  "{promptText}"
                </p>
              </div>

              <button
                onClick={() => onSelectPrompt(promptText)}
                className="w-full py-2.5 rounded-xl bg-[#13161C] hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-[#2D3139] hover:border-transparent transition-all flex items-center justify-center space-x-1.5 shadow"
              >
                <span>{lang === 'bn' ? 'এই প্রম্পটটি চালান' : 'Run Prompt'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
