import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Code2,
  Play,
  Bug,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Terminal,
  FileCode2,
  Lightbulb
} from 'lucide-react';

interface CodeTutorProps {
  lang: 'bn' | 'en';
}

export const CodeTutor: React.FC<CodeTutorProps> = ({ lang }) => {
  const [selectedLang, setSelectedLang] = useState<'python' | 'javascript' | 'html' | 'cpp'>('python');

  const defaultCodes = {
    python: `# জুনিয়র জেমিনি পাইথন টিউটোরিয়াল
# ২ টি সংখ্যার যোগফল ও গড় নির্ণয়

a = 15
b = 25
sum_result = a + b
average = sum_result / 2

print("যোগফল:", sum_result)
print("গড়:", average)

# একটি লুপ চালিয়ে গণনা
for i in range(1, 6):
    print(f"ধাপ নম্বর: {i}")`,

    javascript: `// Junior Gemini JavaScript Tutorial
function calculateGrade(marks) {
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "A-";
  return "F";
}

const studentMarks = 85;
console.log("গ্রেড:", calculateGrade(studentMarks));`,

    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #1e293b; color: white; padding: 20px; }
    .card { background: #334155; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>JUNIOR GEMINI HTML Page</h1>
    <p>এইচটিএমএল ও সিএসএস দিয়ে ওয়েবসাইটের সুন্দর লেআউট শিখুন।</p>
  </div>
</body>
</html>`,

    cpp: `// C++ Basic Program
#include <iostream>
using namespace std;

int main() {
    int x = 10, y = 20;
    cout << "Sum is: " << (x + y) << endl;
    return 0;
}`,
  };

  const [code, setCode] = useState(defaultCodes.python);
  const [loading, setLoading] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (newLang: 'python' | 'javascript' | 'html' | 'cpp') => {
    setSelectedLang(newLang);
    setCode(defaultCodes[newLang]);
    setAiReview(null);
    setSimulatedOutput(null);
  };

  const handleReviewAndDebug = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setAiReview(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Analyze and explain this ${selectedLang} code step-by-step in ${
                lang === 'bn' ? 'Bengali' : 'English'
              }. Check for bugs, syntax errors, and suggest best practices:\n\n\`\`\`${selectedLang}\n${code}\n\`\`\``,
            },
          ],
          mode: 'code-tutor',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAiReview(data.reply);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateRun = () => {
    if (selectedLang === 'python') {
      setSimulatedOutput('যোগফল: 40\nগড়: 20.0\nধাপ নম্বর: 1\nধাপ নম্বর: 2\nধাপ নম্বর: 3\nধাপ নম্বর: 4\nধাপ নম্বর: 5');
    } else if (selectedLang === 'javascript') {
      setSimulatedOutput('গ্রেড: A+');
    } else if (selectedLang === 'html') {
      setSimulatedOutput('HTML Web view simulated successfully below!');
    } else {
      setSimulatedOutput('Sum is: 30');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-white/10">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {lang === 'bn' ? 'কোডিং মেন্টর ও প্লেগ্রাউন্ড' : 'Interactive Code Mentor'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'bn'
                ? 'কোড লিখুন, এআই দিয়ে ডিবাগ করুন এবং প্রতিটি লাইনের সহজ ব্যাখায় কোডিং শিখুন'
                : 'Write code, test ideas, and get instant line-by-line AI code reviews'}
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-[#1A1D24] rounded-xl border border-[#2D3139]">
          {(['python', 'javascript', 'html', 'cpp'] as const).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedLang === l
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {l === 'cpp' ? 'C++' : l}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        
        {/* Code Input Panel */}
        <div className="flex flex-col bg-[#0A0C10] rounded-xl border border-[#1F2937] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#13161C] border-b border-[#2D3139] text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 font-bold">
              <FileCode2 className="w-4 h-4 text-blue-400" />
              main.{selectedLang === 'python' ? 'py' : selectedLang === 'javascript' ? 'js' : selectedLang === 'html' ? 'html' : 'cpp'}
            </span>

            <button
              onClick={copyCode}
              className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full p-4 bg-[#0A0C10] text-green-400 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none"
            spellCheck={false}
          />

          <div className="flex items-center justify-between p-3 bg-[#080A0E] border-t border-[#1F2937]">
            <button
              onClick={handleSimulateRun}
              className="px-4 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-[#2D3139] transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-green-400" />
              <span>{lang === 'bn' ? 'রান করুন' : 'Run Code'}</span>
            </button>

            <button
              onClick={handleReviewAndDebug}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Bug className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{lang === 'bn' ? 'এআই টিউটর রিভিউ' : 'AI Review & Debug'}</span>
            </button>
          </div>
        </div>

        {/* Output & AI Commentary Panel */}
        <div className="flex flex-col space-y-4">
          
          {/* Simulated Console Log */}
          {simulatedOutput && (
            <div className="bg-[#050608] p-4 rounded-xl border border-[#1F2937] font-mono text-xs text-gray-300 shadow-inner">
              <div className="flex items-center gap-1.5 text-gray-400 mb-2 font-bold uppercase tracking-wider text-[10px]">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>$ console.log(output)</span>
              </div>
              <pre className="text-green-400 whitespace-pre-wrap font-mono">{simulatedOutput}</pre>
            </div>
          )}

          {/* AI Line-by-Line Review */}
          <div className="flex-1 bg-[#0A0C10] p-4 rounded-xl border border-[#1F2937] overflow-y-auto max-h-[420px]">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'এআই টিউটর প্রতিক্রিয়া ও ব্যাখ্যা:' : 'AI Tutor Code Analysis:'}</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                <span>{lang === 'bn' ? 'কোড বিশ্লেষণ করা হচ্ছে...' : 'Analyzing code with Gemini...'}</span>
              </div>
            ) : aiReview ? (
              <div className="prose prose-invert prose-xs max-w-none text-[#E6E8EB]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReview}</ReactMarkdown>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-[#2D3139] rounded-xl bg-[#080A0E]">
                <Lightbulb className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p>
                  {lang === 'bn'
                    ? '"এআই টিউটর রিভিউ" বাটনে ক্লিক করলে জেমিনি আপনার কোডের সূক্ষ্ম ব্যাখ্যা ও ভুলত্রুটি শুধরে দেবে।'
                    : 'Click "AI Review & Debug" to get line-by-line feedback and bug analysis.'}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
