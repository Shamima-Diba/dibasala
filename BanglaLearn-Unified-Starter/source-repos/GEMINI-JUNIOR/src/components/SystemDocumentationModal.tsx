import React from 'react';
import {
  FileText,
  Printer,
  XCircle,
  ShieldCheck,
  Server,
  Cpu,
  CheckCircle2,
  Lock,
  Globe2,
  Building2,
  Award,
  BookOpen,
  Tv,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

interface SystemDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const SystemDocumentationModal: React.FC<SystemDocumentationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';

  const handlePrintPdf = () => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
      alert(isBn ? 'অনুগ্রহ করে অ্যাপটি নতুন ট্যাবে (New Tab) ওপেন করে প্রিন্ট করুন।' : 'Please open the app in a new tab to print.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0F1117] border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-gray-200 print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none print:p-0">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#252A36] print:border-gray-300 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl print:bg-emerald-100 print:text-emerald-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
                {isBn ? 'মাটি এআই (MATI AI) - পূর্ণাঙ্গ সিস্টেম ম্যানুয়েল ও ব্যাকএন্ড রিপোর্ট' : 'MATI AI Full System Manual & Technical Report'}
              </h2>
              <p className="text-xs text-gray-400 print:text-gray-600">
                স্মার্ট বাংলাদেশ ভিশন ও প্রযুক্তিনির্ভর শিক্ষা ব্যবস্থার টেকনিক্যাল আর্কিটেকচার
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>পিডিএফ প্রিন্ট / সেভ করুন (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1A1D24]"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* iFrame Notice */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between print:hidden">
          <span>💡 <strong>পিডিএফ টিপস:</strong> আপনি যদি এআই স্টুডিওর প্রিভিউ আইফ্রেমে থাকেন, তাহলে প্রিন্ট ডায়ালগ অন করতে উপরে ডানপাশের <strong>'Open in New Tab'</strong> বা <strong>'নতুন ট্যাবে খুলুন'</strong> বাটনে ক্লিক করে পেজটি খুলে নিয়ে সহজেই PDF হিসেবে ডাউনলোড/সেভ করে নিতে পারবেন।</span>
        </div>

        {/* Modal Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          
          {/* SECTION 1: Sovereign Respect & Security Compliance */}
          <div className="p-5 bg-[#131620] border border-emerald-500/30 rounded-2xl space-y-3 print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base print:text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
              <span>১. রাষ্ট্রীয় সার্বভৌমত্ব, সরকার ও সিকিউরিটি পলিসি (Compliance & Security)</span>
            </div>
            <ul className="space-y-2 text-gray-300 print:text-gray-800 list-disc list-inside">
              <li>
                <strong className="text-white print:text-black">শতভাগ গঠনমূলক ও সম্মানজনক অবস্থান:</strong> মাটি এআই প্ল্যাটফর্মটি দেশ, রাষ্ট্র, সরকার এবং জাতীয় কারিকুলামের প্রতি সর্বোচ্চ শ্রদ্ধাশীল। এতে কোনো প্রকার রাজনীতি, সরকারবিরোধী মন্তব্য বা নেতিবাচক উপাদান বিদ্যমান নেই।
              </li>
              <li>
                <strong className="text-white print:text-black">স্মার্ট বাংলাদেশ ভিশনে অবদান:</strong> প্ল্যাটফর্মটির একমাত্র লক্ষ্য হলো দেশের সাধারণ শিক্ষার্থী ও তরুণদের প্রযুক্তিতে দক্ষ, কোডিং ও এআই অভিজ্ঞ এবং ব্যবসায়িক জ্ঞানে সমৃদ্ধ করা।
              </li>
              <li>
                <strong className="text-white print:text-black">ডাটা সিকিউরিটি ও এপিআই প্রোটেকশন:</strong> কোনো ব্যবহারকারীর ব্যক্তিগত তথ্য বাইরে শেয়ার হয় না এবং জেমিনি এআই এপিআই কি (API Key) সার্ভার-সাইডে সুরক্ষিত এনক্রিপশনে রাখা থাকে।
              </li>
            </ul>
          </div>

          {/* SECTION 2: Backend Architecture & Workflow */}
          <div className="p-5 bg-[#131620] border border-indigo-500/30 rounded-2xl space-y-3 print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base print:text-indigo-800">
              <Server className="w-5 h-5" />
              <span>২. ব্যাকএন্ড সার্ভার আর্কিটেকচার ও সার্ভিসসমূহ (Backend Workflows)</span>
            </div>
            <p className="text-gray-300 print:text-gray-800">
              এই সিস্টেমটি শুধুমাত্র স্ট্যাটিক এইচটিএমএল (Static HTML) নয়—এর পেছনে একটি পূর্ণাঙ্গ <span className="font-mono text-emerald-400 print:text-black font-bold">Node.js Express + TypeScript</span> ব্যাকএন্ড ইঞ্জিনিয়ারিং কাজ করছে।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#090B10] border border-[#252A36] rounded-xl space-y-1 print:bg-white print:border-gray-300">
                <div className="font-bold text-indigo-300 print:text-black">১. এআই প্রক্সি রাউট (<span className="font-mono text-xs">/api/chat</span>)</div>
                <p className="text-[11px] text-gray-400 print:text-gray-700">
                  ব্রাউজার থেকে পাঠানো ম্যাথ প্রশ্ন, কোডিং সমস্যা এবং মার্কেটিং পরিকল্পনা জেমিনি মডেল (@google/genai) প্রসেস করে সার্ভার সিকিউরলি রেসপন্স ফেরত পাঠায়।
                </p>
              </div>

              <div className="p-3 bg-[#090B10] border border-[#252A36] rounded-xl space-y-1 print:bg-white print:border-gray-300">
                <div className="font-bold text-amber-300 print:text-black">২. ভিডিও কুইজ প্রসেসর (<span className="font-mono text-xs">/api/video/*</span>)</div>
                <p className="text-[11px] text-gray-400 print:text-gray-700">
                  শিক্ষার্থীদের বিজয়ী স্কোরের ওপর ভিত্তি করে সার্ভার স্বয়ংক্রিয়ভাবে ভিডিও ডায়ালগ স্ক্রিপ্ট ও রেন্ডারিং মেটাডাটা তৈরি করে।
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Main Features & Modules */}
          <div className="p-5 bg-[#131620] border border-amber-500/30 rounded-2xl space-y-3 print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base print:text-amber-800">
              <Cpu className="w-5 h-5" />
              <span>৩. অ্যাপ্লিকেশনের প্রধান মডিউল ও কার্যকারিতা (System Features)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start space-x-2 p-2.5 bg-[#090B10] rounded-xl print:bg-white print:border">
                <Tv className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black block">স্মার্ট প্রজেক্টর ক্লাসরুম:</strong>
                  স্কুল-কলেজের প্রজেক্টরে বড় ফন্টে লেজার পয়েন্টার, হাই-কনট্রাস্ট মোড ও স্টুডেন্ট কিউআর কোডসহ ক্লাস নেওয়ার সুবিধা।
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 bg-[#090B10] rounded-xl print:bg-white print:border">
                <Briefcase className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black block">ব্যাংকিং ও ডিসট্রিবিউশন ল্যাব:</strong>
                  আমানত, সুদের স্প্রেড, এনপিএল রিস্ক, FMCG ডিলার মার্জিন এবং এআই মার্কেটিং ক্যাম্পেন সিমুলেটর।
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 bg-[#090B10] rounded-xl print:bg-white print:border">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black block">বিসিএস ও ৬ষ্ঠ-১২দশ ল্যাব:</strong>
                  শ্রেণীভিত্তিক ডেডিকেটেড সফ্টওয়্যার, কুইজ প্রতিযোগিতা ও এআই টিউটরিং।
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 bg-[#090B10] rounded-xl print:bg-white print:border">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black block">বাচ্চাদের আর্ট ও ফান ক্লাব:</strong>
                  শিশুদের সৃজনশীল মনস্তত্ত্ব বিকাশ ও ডিজিটাল এআই ক্যানভাস।
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="border-t border-[#252A36] print:border-gray-300 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 print:text-gray-600 gap-2">
          <div>
            প্রডিউসড বাই: <span className="font-bold text-white print:text-black">মাটি এআই (MATI AI Version 4.2)</span> • কপিরাইট © ২০২৬
          </div>
          <div className="print:hidden">
            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 bg-emerald-500 text-black font-extrabold rounded-lg hover:bg-emerald-400 transition-all"
            >
              পিডিএফ তৈরি করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
