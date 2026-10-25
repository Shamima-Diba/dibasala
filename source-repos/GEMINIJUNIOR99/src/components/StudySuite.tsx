import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  ArrowRight,
  BookMarked,
  Lightbulb
} from 'lucide-react';
import { QuizData } from '../types';

interface StudySuiteProps {
  lang: 'bn' | 'en';
}

export const StudySuite: React.FC<StudySuiteProps> = ({ lang }) => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('HSC / Class 11-12');
  const [activeMode, setActiveMode] = useState<'lesson' | 'quiz'>('lesson');
  const [loading, setLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const presetTopics = [
    { bn: 'বিসিএস আইসিটি ও কম্পিউটার (১৫ মার্কস)', en: 'BCS ICT & Computer (15 Marks)', category: 'BCS' },
    { bn: 'বিসিএস গাণিতিক যুক্তি ও মানসিক দক্ষতা', en: 'BCS Math & Mental Ability', category: 'BCS' },
    { bn: 'বিসিএস বাংলাদেশ বিষয়াবলী সাম্প্রতিক', en: 'BCS Bangladesh Affairs', category: 'BCS' },
    { bn: 'ভার্সিটি CSE: Data Structures & Algorithms', en: 'University CSE: DSA & Complexity', category: 'University' },
    { bn: 'ভার্সিটি CSE: Machine Learning & AI Basics', en: 'University CSE: ML & AI Basics', category: 'University' },
    { bn: 'গবেষণা ও থিসিস প্রপোজাল (Thesis & SOP)', en: 'Research Proposal & SOP Assistant', category: 'University' },
    { bn: 'আইসিটি সংখ্যা পদ্ধতি ও বাইনারি (HSC)', en: 'ICT Number Systems & Binary', category: 'HSC' },
    { bn: 'পাইথন ভেরিয়েবল ও ফর লুপ', en: 'Python Variables & For Loops', category: 'Coding' },
  ];

  const handleGenerate = async (presetTopic?: string) => {
    const selectedTopic = presetTopic || topic;
    if (!selectedTopic.trim()) return;

    setLoading(true);
    setLessonContent(null);
    setQuizData(null);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          gradeLevel,
          language: lang,
          type: activeMode,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');

      if (activeMode === 'quiz' && data.quiz) {
        setQuizData(data.quiz);
      } else if (data.lesson) {
        setLessonContent(data.lesson);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !quizData) return;
    setIsAnswerSubmitted(true);
    const currentQ = quizData.questions[currentQuestionIndex];
    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-white/10">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {lang === 'bn' ? 'স্মার্ট শিক্ষা ও কুইজ জেনারেটর' : 'Smart Lesson & Quiz Generator'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'bn'
                ? 'আইসিটি, সায়েন্স, ম্যাথ ও প্রোগ্রামিং এর যেকোনো বিষয়ের ওপর তাৎক্ষণিক লেসন বা কুইজ তৈরি করুন'
                : 'Generate structured AI lessons or interactive quizzes for any subject instantly'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-[#1A1D24] rounded-xl border border-[#2D3139]">
          <button
            onClick={() => setActiveMode('lesson')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'lesson'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পূর্ণাঙ্গ পাঠ (Lesson)' : 'Detailed Lesson'}</span>
          </button>
          <button
            onClick={() => setActiveMode('quiz')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'quiz'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ইন্টারেক্টিভ কুইজ (Quiz)' : 'Interactive Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="mt-4 p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              {lang === 'bn' ? 'টপিক বা বিষয়ের নাম লিখুন:' : 'Enter Topic / Subject:'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'যেমন: এইচএসসি আইসিটি বুলিয়ান অ্যালজেব্রা বা পাইথন লুপ...'
                  : 'e.g. Python Functions, Photosynthesis, Quadratic Equation...'
              }
              className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-4 py-2.5 text-sm text-[#E6E8EB] focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              {lang === 'bn' ? 'শ্রেণী / লেভেল:' : 'Grade Level:'}
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-4 py-2.5 text-sm text-[#E6E8EB] focus:outline-none focus:border-blue-500"
            >
              <option value="BCS Preliminary & Written Prep">BCS & Government Job / বিসিএস প্রিলি ও লিখিত প্রস্তুতি</option>
              <option value="University CSE / Engineering Majors">University CSE / Engineering / ইঞ্জিনিয়ারিং অনার্স</option>
              <option value="University General / Thesis & SOP">University Honors / বিশ্ববিদ্যালয় থিসিস ও হায়ার স্টাডি</option>
              <option value="HSC / Class 11-12">HSC / একাদশ-দ্বাদশ শ্রেণী (NCTB ICT)</option>
              <option value="SSC / Class 9-10">SSC / নবম-দশম শ্রেণী</option>
              <option value="Class 6-8 (Lower Secondary)">Class 6-8 / ষষ্ঠ-অষ্টম শ্রেণী</option>
            </select>
          </div>

        </div>

        {/* Preset Quick Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-gray-500">
            {lang === 'bn' ? 'পপুলার টপিকস:' : 'Popular Topics:'}
          </span>
          {presetTopics.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(lang === 'bn' ? p.bn : p.en);
                handleGenerate(lang === 'bn' ? p.bn : p.en);
              }}
              className="px-2.5 py-1 rounded-md bg-[#13161C] hover:bg-[#1A1D24] text-[11px] text-blue-400 border border-[#2D3139] transition-colors font-medium"
            >
              {lang === 'bn' ? p.bn : p.en}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !topic.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {loading
                ? lang === 'bn' ? 'জেনারেট হচ্ছে...' : 'Generating...'
                : activeMode === 'lesson'
                ? lang === 'bn' ? 'পাঠ তৈরি করুন' : 'Generate Lesson'
                : lang === 'bn' ? 'কুইজ তৈরি করুন' : 'Generate Quiz'}
            </span>
          </button>
        </div>
      </div>

      {/* Output Content Display Area */}
      <div className="mt-6">
        
        {/* Lesson View */}
        {activeMode === 'lesson' && lessonContent && (
          <div className="p-6 bg-[#0A0C10] rounded-xl border border-[#1F2937] prose prose-invert prose-slate max-w-none text-[#E6E8EB]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lessonContent}</ReactMarkdown>
          </div>
        )}

        {/* Quiz View */}
        {activeMode === 'quiz' && quizData && (
          <div className="p-6 bg-[#0A0C10] rounded-xl border border-[#1F2937]">
            <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-400">{quizData.title}</h3>
                <p className="text-xs text-gray-400">
                  {lang === 'bn' ? `বিষয়: ${quizData.topic}` : `Topic: ${quizData.topic}`}
                </p>
              </div>

              {!quizFinished && (
                <div className="text-xs font-mono font-bold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/30">
                  Question {currentQuestionIndex + 1} of {quizData.questions.length}
                </div>
              )}
            </div>

            {!quizFinished ? (
              <div>
                {/* Question */}
                <h4 className="text-base font-semibold text-[#E6E8EB] mb-4">
                  {currentQuestionIndex + 1}. {quizData.questions[currentQuestionIndex].question}
                </h4>

                {/* Options */}
                <div className="space-y-2.5 mb-6">
                  {quizData.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === quizData.questions[currentQuestionIndex].correctAnswerIndex;

                    let btnStyle = 'bg-[#13161C] border-[#2D3139] text-gray-200 hover:bg-[#1A1D24]';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-green-950/80 border-green-500 text-green-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-950 border-blue-500 text-blue-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Next controls */}
                <div className="flex items-center justify-between border-t border-[#1F2937] pt-4">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {lang === 'bn' ? 'উত্তর জমা দিন' : 'Submit Answer'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1 ml-auto"
                    >
                      <span>
                        {currentQuestionIndex + 1 < quizData.questions.length
                          ? lang === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question'
                          : lang === 'bn' ? 'ফলাফল দেখুন' : 'See Results'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Explanation block after submission */}
                {isAnswerSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-[#13161C] border border-[#2D3139] text-xs leading-relaxed text-gray-300">
                    <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-4 h-4" />
                      {lang === 'bn' ? 'ব্যাখ্যা:' : 'Explanation:'}
                    </span>
                    {quizData.questions[currentQuestionIndex].explanation}
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Score Summary */
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold text-[#E6E8EB] mb-1">
                  {lang === 'bn' ? 'অভিনন্দন! কুইজ সম্পন্ন হয়েছে' : 'Congratulations! Quiz Completed'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {lang === 'bn'
                    ? `আপনার স্কোর: ${score} / ${quizData.questions.length}`
                    : `Your Score: ${score} out of ${quizData.questions.length}`}
                </p>
                <button
                  onClick={() => handleGenerate()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  {lang === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Another Quiz'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
