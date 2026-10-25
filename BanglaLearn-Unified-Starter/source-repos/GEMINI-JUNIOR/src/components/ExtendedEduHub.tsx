import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Megaphone,
  Bell,
  Calendar,
  Layers,
  Zap,
  Eye,
  Volume2,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Award,
  Cpu,
  Bookmark,
  Activity,
  BarChart3,
  CheckSquare,
  Compass,
  Heart,
  Smile,
  UserCheck,
  Smartphone
} from 'lucide-react';

interface ExtendedEduHubProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

interface ExamSuggestion {
  id: string;
  classNameBn: string;
  classNameEn: string;
  classGroup: 'class_6_8' | 'class_9_10_ssc' | 'hsc_11_12' | 'admission';
  subjectBn: string;
  subjectEn: string;
  titleBn: string;
  titleEn: string;
  hotTopicsBn: string[];
  sampleQuestionsBn: { q: string; mark: string; type: string }[];
  importanceLevel: 'উচ্চ (High)' | 'মাঝারি (Medium)' | 'জরুরি (Urgent)';
  downloadCount: number;
}

interface AIResearchPaper {
  id: string;
  titleBn: string;
  titleEn: string;
  authors: string[];
  publicationDate: string;
  categoryBn: string;
  categoryEn: string;
  abstractBn: string;
  abstractEn: string;
  keyFindingsBn: string[];
  pdfSize: string;
  citationCount: number;
}

interface EducationalChangeNotice {
  id: string;
  date: string;
  categoryBn: string;
  categoryEn: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  impactBn: string;
  impactEn: string;
  status: 'জরুরি নির্দেশিকা' | 'নতুন শিক্ষাক্রম' | 'পরীক্ষা নীতি' | 'ভর্তি আপডেট';
  actionForStudentsBn: string;
}

export const ExtendedEduHub: React.FC<ExtendedEduHubProps> = ({ lang, onClose }) => {
  const isBn = lang === 'bn';

  // Active Category Section View
  const [selectedMainTab, setSelectedMainTab] = useState<'class_software' | 'suggestions' | 'research' | 'news'>('class_software');

  // Class Software Suite Specific State
  const [selectedClassSuite, setSelectedClassSuite] = useState<'early_kids' | 'class_6_8' | 'class_9_10' | 'class_11_12' | 'admission' | 'bcs_cadre'>('bcs_cadre');
  const [activeClassModuleTab, setActiveClassModuleTab] = useState<'overview' | 'subjects' | 'mcq_test' | 'ai_tutor'>('overview');
  const [classMcqScore, setClassMcqScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Exam Suggestions Filters
  const [selectedClassGroup, setSelectedClassGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSuggestionId, setExpandedSuggestionId] = useState<string | null>('sug_1');

  // Research Paper Detail View
  const [selectedResearchPaper, setSelectedResearchPaper] = useState<AIResearchPaper | null>(null);

  // Audio Speech Reader State
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingText === text) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(isBn ? 'আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই।' : 'Voice synthesis not supported on this browser.');
    }
  };

  // Exam Suggestions Mock Database
  const suggestions: ExamSuggestion[] = [
    {
      id: 'sug_1',
      classNameBn: '১০ম শ্রেণী / এসএসসি (SSC)',
      classNameEn: 'Class 10 / SSC',
      classGroup: 'class_9_10_ssc',
      subjectBn: 'উচ্চতর গণিত ও এআই লজিক',
      subjectEn: 'Higher Math & AI Logic',
      titleBn: 'এসএসসি ২০২৬ উচ্চতর গণিত ১০০% কমন স্পেশাল সাজেশন ও মডেল টেস্ট',
      titleEn: 'SSC 2026 Higher Math Special Exam Prep & Model Test',
      importanceLevel: 'উচ্চ (High)',
      downloadCount: 1420,
      hotTopicsBn: [
        'ত্রিকোণমিতি ও স্থানাংক জ্যামিতি গাণিতিক সমাধান',
        'বীজগণিতীয় রাশি ও সম্ভাবনার ১০০% গুরুত্বপূর্ণ সৃজনশীল',
        'ভেক্টর ক্যালকুলাস ও ম্যাট্রিক্স বেসিক অ্যালগরিদম'
      ],
      sampleQuestionsBn: [
        { q: 'P(x) = x^3 - 3x^2 + 4x - 12 বহুপদীটির একটি উৎপাদক নির্ণয় করো এবং লজিক ব্যাখ্যা করো।', mark: '৪ মার্কস', type: 'সৃজনশীল' },
        { q: 'tan A + sec A = x হলে প্রমাণ করো যে sin A = (x^2 - 1) / (x^2 + 1)', mark: '৪ মার্কস', type: 'সৃজনশীল' },
        { q: 'একটি নিখুঁত ছক্কা ও দুটি মুদ্রা একসাথে নিক্ষেপ করলে বিজোড় সংখ্যা আসার সম্ভাবনা কত?', mark: '২ মার্কস', type: 'সংক্ষিপ্ত' }
      ]
    },
    {
      id: 'sug_2',
      classNameBn: 'দ্বাদশ শ্রেণী / এইচএসসি (HSC)',
      classNameEn: 'Class 12 / HSC',
      classGroup: 'hsc_11_12',
      subjectBn: 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র',
      subjectEn: 'Physics 1st & 2nd Paper',
      titleBn: 'এইচএসসি ২০২৬ পদার্থবিজ্ঞান সৃজনশীল ও গাণিতিক চূড়ান্ত সাজেশন',
      titleEn: 'HSC 2026 Physics Mathematical Final Suggestion',
      importanceLevel: 'জরুরি (Urgent)',
      downloadCount: 2310,
      hotTopicsBn: [
        'ভেক্টর ও নিউটনীয় বলবিদ্যা (ঘর্ষণ, কেন্দ্রমুখী বল)',
        'তাপগতিবিদ্যা (কার্নো ইঞ্জিন, এনট্রপি ও দক্ষতা)',
        'আধুনিক পদার্থবিজ্ঞান ও সেমিকন্ডাক্টর ডায়োড'
      ],
      sampleQuestionsBn: [
        { q: 'কার্নো ইঞ্জিনের কর্মদক্ষতা ৬০% হলে উৎসের তাপমাত্রা ও তাপ গ্রাহকের অনুপাত নির্ণয় করো।', mark: '৪ মার্কস', type: 'গাণিতিক' },
        { q: 'ইয়াং এর দ্বিশ্লিট পরীক্ষায় ডোরার প্রস্থ এবং আলোর তরঙ্গদৈর্ঘ্যের সম্পর্ক প্রতিষ্ঠা করো।', mark: '৪ মার্কস', type: 'সৃজনশীল' }
      ]
    },
    {
      id: 'sug_3',
      classNameBn: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষা (Admission)',
      classNameEn: 'Varsity Admission Prep',
      classGroup: 'admission',
      subjectBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT) ও AI',
      subjectEn: 'ICT & Artificial Intelligence',
      titleBn: 'বুয়েট, ঢাবি ও জিএসটি ভর্তি পরীক্ষা আইসিটি এক্সক্লুসিভ প্রশ্ন ব্যাংক',
      titleEn: 'BUET & DU Admission ICT Question Bank & AI Practice',
      importanceLevel: 'উচ্চ (High)',
      downloadCount: 3890,
      hotTopicsBn: [
        'সি প্রোগ্রামিং (Loop, Array, Pointer) ও কোডিং লজিক',
        'ডিজিটাল ডিভাইস (লজিক গেট, এনকোডার, ডিকোডার)',
        'এইচটিএমএল, সিএসএস ও ডাটাবেজ ম্যানেজমেন্ট (SQL)'
      ],
      sampleQuestionsBn: [
        { q: 'Python দিয়ে একটি সংখ্যা মৌলিক (Prime) কিনা তা বের করার অ্যালগরিদম ব্যাখ্যা করো।', mark: '৫ মার্কস', type: 'কোডিং' },
        { q: 'NAND গেট দিয়ে ইউনিভার্সাল NOR গেট বাস্তবায়নের চিত্র আঁকো।', mark: '৩ মার্কস', type: 'লজিক' }
      ]
    },
    {
      id: 'sug_4',
      classNameBn: '৮ম শ্রেণী (Class 8)',
      classNameEn: 'Class 8',
      classGroup: 'class_6_8',
      subjectBn: 'সাধারণ বিজ্ঞান ও ডিজিটাল প্রযুক্তি',
      subjectEn: 'General Science & Digital Tech',
      titleBn: '৮ম শ্রেণী বার্ষিক পরীক্ষা বিজ্ঞান ও ডিজিটাল প্রযুক্তি সুপার ভিআইপি সাজেশন',
      titleEn: 'Class 8 Science & Digital Technology VIP Suggestion',
      importanceLevel: 'মাঝারি (Medium)',
      downloadCount: 980,
      hotTopicsBn: [
        'জীবের বৃদ্ধি ও বংশগতি (মায়োসিস ও মাইটোসিস)',
        'রাসায়নিক বিক্রিয়া ও সমতা আনয়ন',
        'ইন্টারনেট নিরাপত্তা, সাইবার বুলিং ও ডাটা এনক্রিপশন'
      ],
      sampleQuestionsBn: [
        { q: 'উদ্ভিদের বৃদ্ধির জন্য মাইটোসিস কোষ বিভাজনের ভূমিকা চিত্রসহ লিখ।', mark: '৪ মার্কস', type: 'সৃজনশীল' },
        { q: 'পাসওয়ার্ড শক্তিশালী করার ৪টি প্রধান নিয়ম উল্লেখ করো।', mark: '২ মার্কস', type: 'প্রযুক্তি' }
      ]
    }
  ];

  // AI Research Papers Mock Database
  const researchPapers: AIResearchPaper[] = [
    {
      id: 'paper_1',
      titleBn: 'বাংলা ভাষায় মাল্টিমোডাল এআই ও জেমিনি এর শিক্ষা ক্ষেত্রে সফল প্রয়োগ',
      titleEn: 'Successful Application of Multimodal Gemini AI in Bengali Education',
      authors: ['ড. তানভীর আহমেদ (বুয়েট)', 'মাটি এআই শিক্ষা গবেষণা দল'],
      publicationDate: '১৫ জুলাই, ২০২৬',
      categoryBn: 'এডুকেশনাল এআই (Edu AI)',
      categoryEn: 'Educational AI',
      pdfSize: '২.৪ মেগাবাইট (PDF)',
      citationCount: 42,
      abstractBn: 'এই গবেষণাপত্রে বাংলাদেশি শিক্ষার্থীদের জন্য বাংলা প্রাকৃতিক ভাষা প্রক্রিয়াকরণ (Bengali NLP) এবং জেমিনি ৩.৬ মাল্টিমোডাল এআই মডেলের মাধ্যমে গণিত ও সায়েন্স প্রশ্নের অটোমেটেড রিয়েল-টাইম টিউটরিং পারফরম্যান্স বিশ্লেষণ করা হয়েছে।',
      abstractEn: 'This paper analyzes the performance of Bengali NLP combined with Gemini multimodal models in providing automated real-time math and STEM tutoring for Bangladeshi students.',
      keyFindingsBn: [
        'বাংলা প্রশ্ন বুদ্ধিমান উপায়ে বুঝতে ৯৬.৮% নিখুঁত নির্ভুলতা অর্জিত হয়েছে।',
        'শিক্ষার্থীদের পাঠ্যবই পড়া ও মুখস্থ করার চেয়ে বাস্তবধর্মী কোডিং ও সিমুলেশনে আগ্রহ ৮০% বেড়েছে।',
        'গ্রামীণ অঞ্চলের বিদ্যালয়গুলোতে এআই লার্নিং এসিস্ট্যান্ট ব্যবহারে ফলাফলে ৩৫% উন্নতি দেখা গেছে।'
      ]
    },
    {
      id: 'paper_2',
      titleBn: 'বাংলাদেশের প্রাথমিক ও মাধ্যমিক শিক্ষাক্রমে কৃত্রিম বুদ্ধিমত্তা ও রোবোটিক্স রোডম্যাপ',
      titleEn: 'Artificial Intelligence & Robotics Roadmap for Bangladesh K-12 Curriculum',
      authors: ['অধ্যাপক ড. রাশেদুল হাসান (ঢাবি)', 'এনসিটিবি এআই প্যানেল'],
      publicationDate: '০২ জুন, ২০২৬',
      categoryBn: 'শিক্ষাক্রম নীতি ও প্রযুক্তি',
      categoryEn: 'Curriculum & Tech Policy',
      pdfSize: '৪.১ মেগাবাইট (PDF)',
      citationCount: 88,
      abstractBn: 'ষষ্ঠ থেকে দ্বাদশ শ্রেণী পর্যন্ত প্রতিটি বিষয়ভিত্তিক পাঠ্যক্রমে প্র্যাকটিক্যাল এআই ল্যাব, পাইথন কোডিং এবং এআই ইথিক্স সংযুক্ত করার জাতীয় রূপরেখা ও সুপারিশসমূহ এই পত্রে সংকলিত।',
      abstractEn: 'A national framework recommending practical AI labs, Python coding, and AI ethics integration into K-12 textbooks across Bangladesh.',
      keyFindingsBn: [
        '২০২৭ সালের মধ্যে ক্লাসরুমে এআই সিমুলেটর প্রজেক্টর স্থাপনের জাতীয় মাস্টারপ্ল্যান।',
        'শিক্ষকদের জন্য ১০০ ঘন্টার এআই পেডাগোজি ও ডিজিটাল লিটারেসি ট্রেনিং মডিউল তৈরি।',
        'শ্রেণীকক্ষে মোবাইল ও ল্যাপটপ দিয়ে নিরাপদ এআই টুলস ব্যবহারের গাইডলাইন।'
      ]
    },
    {
      id: 'paper_3',
      titleBn: 'জেনারেটিভ এআই দিয়ে শিশুদের মেধা বিকাশ ও ডিজিটাল আর্ট থেরাপি',
      titleEn: 'Child Cognitive Development & Digital Art Therapy using Generative AI',
      authors: ['ড. ফারজানা ইয়াসমিন (শিশু মনস্তত্ত্ববিদ)', 'মাটি ক্রিয়েটিভ ল্যাব'],
      publicationDate: '১০ মে, ২০২৬',
      categoryBn: 'শিশু শিক্ষা ও আর্ট',
      categoryEn: 'Child Education & Art',
      pdfSize: '১.৮ মেগাবাইট (PDF)',
      citationCount: 19,
      abstractBn: 'বাচ্চাদের কল্পনাশক্তি প্রকাশে টেক্সট-টু-ইমেজ ও ভয়েস কম্যান্ড নির্ভর এআই ক্যানভাসের ভূমিকা এবং তাদের মানসিক একাগ্রতা বৃদ্ধিতে এর ইতিবাচক প্রভাব নিয়ে গবেষণালব্ধ পর্যবেক্ষণ।',
      abstractEn: 'Observational study on text-to-image and voice-guided AI canvas impact on childhood imagination and mental focus.',
      keyFindingsBn: [
        'বাচ্চাদের ভিজ্যুয়াল আর্ট ও রূপকথার গল্প বানানোর মানসিক আগ্রহ ৪ গুণ বৃদ্ধি পায়।',
        'এআই ভয়েস অ্যাসিস্ট্যান্টের সাথে কথা বলে ইংরেজি ও বাংলা শব্দভাণ্ডার দ্রুত সমৃদ্ধ হয়।'
      ]
    }
  ];

  // Educational Changes / Policy Bulletins
  const educationalNotices: EducationalChangeNotice[] = [
    {
      id: 'notice_1',
      date: '২৪ জুলাই, ২০২৬',
      status: 'জরুরি নির্দেশিকা',
      categoryBn: 'এসএসসি ও এইচএসসি পরীক্ষা ২০২৬',
      categoryEn: 'SSC & HSC Exam 2026',
      titleBn: '২০২৬ সালের এসএসসি ও এইচএসসি পরীক্ষার সময়সূচী ও নতুন উত্তরপত্র রুলস ঘোষণা',
      titleEn: 'SSC & HSC 2026 Routine & New Answer Script Rules Announced',
      summaryBn: 'শিক্ষা বোর্ড থেকে ২০২৬ সালের পরীক্ষার জন্য সংক্ষিপ্ত সিলেবাস ও সৃজনশীল প্রশ্নের নম্বর বন্টন চূড়ান্ত করা হয়েছে। ব্যবহারিক পরীক্ষায় যুক্ত হচ্ছে এআই ও কোডিং প্রজেক্ট মার্কস।',
      summaryEn: 'Education Board finalized exam marks distribution. Practical exams now include AI and coding project evaluation.',
      impactBn: 'শিক্ষার্থীদের লিখিত ৭০ নম্বরের পাশাপাশি ৩০ নম্বর ল্যাব ও এআই প্রজেক্ট প্র্যাকটিক্যালে অর্জনের সুযোগ থাকবে।',
      impactEn: 'Students will have 70 written marks and 30 practical lab/AI project evaluation marks.',
      actionForStudentsBn: 'স্কুলের কম্পিউটার ল্যাবে কোডিং ও ডিজিটাল প্রজেক্টের রেকর্ড ফাইল সংরক্ষণ করতে হবে।'
    },
    {
      id: 'notice_2',
      date: '১৮ জুলাই, ২০২৬',
      status: 'নতুন শিক্ষাক্রম',
      categoryBn: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      categoryEn: 'National Curriculum Reform',
      titleBn: 'পাঠ্যবইয়ে যুক্ত হচ্ছে "এআই লিটারেসি ও এথিক্স" এর পৃথক নতুন অধ্যায়',
      titleEn: 'New "AI Literacy & Ethics" Chapter Included in Textbooks',
      summaryBn: 'ষষ্ঠ থেকে দশম শ্রেণীর তথ্য প্রযুক্তি বইতে এআই কীভাবে কাজ করে, ফেক নিউজ শনাক্তকরণ এবং নিরাপদ এআই ব্যবহারের মূলনীতি বাধ্যতামূলক অধ্যায় হিসেবে যুক্ত করা হলো।',
      summaryEn: 'AI working mechanics, fake news detection, and safe AI guidelines mandated for Class 6-10 ICT textbooks.',
      impactBn: 'শিক্ষার্থীরা শুরু থেকেই আন্তর্জাতিক মানের প্রযুক্তি ধারণা লাভ করবে।',
      impactEn: 'Students will gain world-class technology foundational literacy from early grades.',
      actionForStudentsBn: 'আমাদের মাটি এআই প্ল্যাটফর্মের "এআই লার্নিং হাব" থেকে প্র্যাকটিক্যাল অধ্যায়গুলো টিউটোরিয়াল থেকে দেখে নেওয়া।'
    },
    {
      id: 'notice_3',
      date: '০৫ জুলাই, ২০২৬',
      status: 'ভর্তি আপডেট',
      categoryBn: 'বিশ্ববিদ্যালয় সমন্বিত ভর্তি পরীক্ষা',
      categoryEn: 'Varsity GST Admission Update',
      titleBn: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় আইসিটি ও এআই লজিক অংশে বিশেষ নম্বর বরাদ্দ',
      titleEn: 'Varsity Admission Tests Allocate Special Marks for ICT & AI Logic',
      summaryBn: 'ঢাকা বিশ্ববিদ্যালয় ও প্রকৌশল বিশ্ববিদ্যালয়গুলোতে গণিত ও বিজ্ঞানের পাশাপাশি আধুনিক সমস্যা সমাধান ও অ্যালগরিদম চিন্তার ওপর ১০% নম্বর রাখা হয়েছে।',
      summaryEn: 'University admission tests allocate 10% marks for algorithmic problem solving and technology logic.',
      impactBn: 'শুধু মুখস্থ বিদ্যা নয়, বরং বাস্তবিক প্রবলেম সলভিং স্কিল থাকা পরীক্ষার্থীরা অগ্রাধিকার পাবে।',
      impactEn: 'Candidates with practical problem-solving logic will be prioritized over rote memory.',
      actionForStudentsBn: 'প্রতিদিন কোডিং টিউটোরিয়াল ও অনলাইন মডেল টেস্ট প্র্যাকটিস অব্যাহত রাখা।'
    }
  ];

  // Filter Suggestions Logic
  const filteredSuggestions = suggestions.filter((sug) => {
    const matchesGroup = selectedClassGroup === 'all' || sug.classGroup === selectedClassGroup;
    const matchesSearch =
      searchQuery === '' ||
      sug.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sug.subjectBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sug.classNameBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div id="extended-edu-hub-root" className="space-y-8 pt-6 border-t border-[#252A36]">
      
      {/* Top Banner: Credibility & Mission Statement */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-[11px] font-bold flex items-center space-x-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isBn ? 'স্মার্ট প্রযুক্তি ও মানসম্পন্ন শিক্ষা হাব' : 'Smart Education & Technology Hub'}</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? '১০০% উন্মুক্ত ও ফ্রি' : '100% Free Access'}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {isBn
                ? '🎓 স্মার্ট ডিজিটাল শিক্ষা ও প্র্যাকটিক্যাল লার্নিং পোর্টাল'
                : 'Smart Digital Education & Practical Learning Portal'}
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isBn
                ? 'মানসম্পন্ন পাঠ্যক্রমের সাথে হাতে-কলমে কোডিং, ২৪/৭ স্মার্ট এআই টিউটরিং এবং সায়েন্স গবেষণার সমন্বিত সুযোগ—যা সকল শিক্ষার্থী সম্পূর্ণ বিনামূল্যে ব্যবহার করতে পারবে।'
                : 'Combining standard curriculum with practical coding, 24/7 AI tutoring, and science research opportunities for all students completely free of cost.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <div className="bg-[#13161C] p-3.5 rounded-2xl border border-indigo-500/30 text-xs space-y-1.5 shrink-0">
              <div className="text-amber-400 font-bold flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>{isBn ? 'শিক্ষা রূপান্তর স্কোর:' : 'Education Reform Index:'}</span>
              </div>
              <div className="text-xl font-black text-white">৯৪.৮% নিখুঁত সুবিধা</div>
              <div className="text-[10px] text-gray-400">{isBn ? '৮টি বিভাগের প্রান্তিক শিক্ষার্থীদের জন্য' : 'Active across all 8 divisions'}</div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-2xl shadow-xl border border-red-400/40 flex items-center justify-center space-x-2 transition-all active:scale-95 shrink-0"
              >
                <span>✕ {isBn ? 'পেইজ বন্ধ করুন (চ্যাট)' : 'Close Page (Chat)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO COLUMN MAIN DASHBOARD & MEDIA FEED LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: DASHBOARD NAVIGATION & CONTROL WIDGETS (বাম দিকে ড্যাশবোর্ড) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Dashboard Overview Widget */}
          <div className="p-5 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#252A36] pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black text-white tracking-wider uppercase">
                  {isBn ? 'ড্যাশবোর্ড সংক্ষেপ (Dashboard)' : 'Dashboard Overview'}
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                লাইভ আপডেট
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-1">
                <span className="text-[10px] text-gray-400 block">{isBn ? 'পরীক্ষা সাজেশন' : 'Exam Suggestions'}</span>
                <span className="text-lg font-black text-amber-400">১০২+ ফাইল</span>
              </div>
              <div className="p-3 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-1">
                <span className="text-[10px] text-gray-400 block">{isBn ? 'এআই গবেষণা' : 'Research Papers'}</span>
                <span className="text-lg font-black text-purple-400">১৮টি ওপেন</span>
              </div>
            </div>

            {/* Educational Gap Fulfillment Checklist */}
            <div className="p-3.5 bg-[#131722] border border-indigo-500/30 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>{isBn ? 'শিক্ষার্থীদের প্রযুক্তিভিত্তিক আধুনিক ৩টি সুবিধা:' : '3 Key Educational Advantages:'}</span>
              </span>
              <ul className="space-y-1.5 text-[11px] text-gray-300">
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>ব্যবহারিক জ্ঞান বৃদ্ধি:</strong> হাতে-কলমে সিমুলেশন ও প্র্যাকটিক্যাল কোডিং</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>২৪/৭ স্মার্ট টিউটর:</strong> যেকোনো সময় ভার্চুয়াল এআই লার্নিং অ্যাসিস্ট্যান্ট</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>১০০% উন্মুক্ত ও ফ্রি:</strong> সকল শিক্ষার্থী ও শিক্ষকদের জন্য সমসুযোগ</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Main Module Navigation Tabs (বাম পাশে নেভিগেশন তালিকা) */}
          <div className="p-5 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-gray-400 tracking-wider uppercase flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'মূল বিভাগসমূহ নির্বাচন করুন:' : 'Select Section:'}</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedMainTab('class_software')}
                className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  selectedMainTab === 'class_software'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white border-emerald-400 shadow-xl ring-2 ring-emerald-500/30'
                    : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span>{isBn ? '১. শ্রেণী-ভিত্তিক সফটওয়্যার স্যুট' : '1. Class Software Suite'}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-extrabold border border-emerald-500/40">
                  স্পেশাল
                </span>
              </button>

              <button
                onClick={() => setSelectedMainTab('suggestions')}
                className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  selectedMainTab === 'suggestions'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg'
                    : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>{isBn ? '২. ক্লাসভিত্তিক পরীক্ষা সাজেশন' : '2. Exam Prep Suggestions'}</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">হট</span>
              </button>

              <button
                onClick={() => setSelectedMainTab('research')}
                className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  selectedMainTab === 'research'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg'
                    : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>{isBn ? '৩. শিক্ষা ও এআই গবেষণা' : '3. Science & AI Research'}</span>
                </div>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full">এক্সক্লুসিভ</span>
              </button>

              <button
                onClick={() => setSelectedMainTab('news')}
                className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                  selectedMainTab === 'news'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg'
                    : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>{isBn ? '৪. শিক্ষাক্রম ও বোর্ড পরিবর্তন' : '4. National Reform Bulletins'}</span>
                </div>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full">জরুরি</span>
              </button>
            </div>
          </div>

          {/* 3. Class Filters Shortcuts */}
          {selectedMainTab === 'suggestions' && (
            <div className="p-5 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-3 shadow-xl">
              <h3 className="text-xs font-black text-gray-300 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>{isBn ? 'শ্রেণী ফিল্টার করুন:' : 'Filter Class:'}</span>
              </h3>

              <div className="flex flex-col space-y-1.5">
                {[
                  { id: 'all', labelBn: 'সকল শ্রেণী (All Classes)' },
                  { id: 'class_6_8', labelBn: '৬ষ্ঠ - ৮ই শ্রেণী' },
                  { id: 'class_9_10_ssc', labelBn: '৯ম - ১০ম শ্রেণী (SSC)' },
                  { id: 'hsc_11_12', labelBn: '১১দশ - ১২দশ শ্রেণী (HSC)' },
                  { id: 'admission', labelBn: 'বিশ্ববিদ্যালয় ভর্তি (Admission)' }
                ].map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => setSelectedClassGroup(grp.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                      selectedClassGroup === grp.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#13161C] text-gray-400 border border-[#252A36] hover:text-white'
                    }`}
                  >
                    • {grp.labelBn}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MEDIA FEED & SCIENCE/RESEARCH PORTAL */}
        <div className="lg:col-span-8 space-y-6">

          {/* RIGHT VIEW 0: CLASS-WISE DEDICATED LEARNING SOFTWARE SUITE */}
          {selectedMainTab === 'class_software' && (
            <div className="space-y-6">
              
              {/* Class Software Header & Selector Bar */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center space-x-2">
                        <span>{isBn ? 'শ্রেণী-ভিত্তিক পৃথক ডেডিকেটেড লার্নিং সফটওয়্যার' : 'Class-Wise Dedicated Software Environment'}</span>
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/40 font-mono">
                          v4.2 ACTIVE
                        </span>
                      </h3>
                      <p className="text-xs text-gray-300">
                        {isBn
                          ? 'নিচের বোতাম চেপে যেকোনো শ্রেণীর জন্য আলাদা সফটওয়্যার ইন্টারফেসে রূপান্তর করুন:'
                          : 'Select a class below to launch its dedicated class software suite:'}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-bold shrink-0">
                    {isBn ? '👁️ চোখের সুরক্ষা অপটিমাইজড' : '👁️ Eye Protection Ready'}
                  </span>
                </div>

                {/* Class Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'bcs_cadre', nameBn: 'বিসিএস ও সরকারি চাকরি', tag: 'বিসিএস ক্যাডার হ্যাকেathon', icon: ShieldCheck },
                    { id: 'early_kids', nameBn: 'মা ও শিশু (প্লে-৫ম)', tag: 'প্রারম্ভিক প্রযুক্তি গাইড', icon: Heart },
                    { id: 'class_6_8', nameBn: '৬ষ্ঠ - ৮ই শ্রেণী', tag: 'জুনিয়র ল্যাব', icon: GraduationCap },
                    { id: 'class_9_10', nameBn: '৯ম - ১০ম (SSC)', tag: 'এসএসসি প্রো', icon: BookOpen },
                    { id: 'class_11_12', nameBn: '১১দশ - ১২দশ (HSC)', tag: 'এইচএসসি সাইন্স', icon: Zap },
                    { id: 'admission', nameBn: 'বিশ্ববিদ্যালয় ভর্তি', tag: 'ভর্তি হ্যাকার', icon: Award },
                  ].map((cls) => {
                    const Icon = cls.icon;
                    const isSelected = selectedClassSuite === cls.id;
                    return (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClassSuite(cls.id as any)}
                        className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between space-y-1 border ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-xl ring-2 ring-emerald-400/40'
                            : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-400'}`} />
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-white' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {cls.tag}
                          </span>
                        </div>
                        <span className="text-xs font-black">{cls.nameBn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEDICATED CLASS SOFTWARE CANVAS */}
              <div className="p-6 bg-[#0F1117] border border-[#252A36] rounded-3xl space-y-6 shadow-2xl">
                
                {/* Active Software Suite Title & Sub-tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#252A36] pb-4">
                  <div>
                    <div className="text-xs text-amber-400 font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        {selectedClassSuite === 'bcs_cadre' && 'বিসিএস ও সরকারি প্রথম শ্রেণীর চাকরির এআই প্রিপারেশন ও প্রশ্ন ব্যাংক স্যুট'}
                        {selectedClassSuite === 'early_kids' && 'মা ও শিশুর জন্য প্রারম্ভিক ডিজিটাল শিক্ষা ও ক্যারিয়ার সচেতনতা সফটওয়্যার'}
                        {selectedClassSuite === 'class_6_8' && '৬ষ্ঠ, ৭ম ও ৮ম শ্রেণী ডিজিটাল STEM ল্যাব সফটওয়্যার'}
                        {selectedClassSuite === 'class_9_10' && '১০ম শ্রেণী / এসএসসি স্পেশালিস্ট ক্র্যাশ কোর্স সফটওয়্যার'}
                        {selectedClassSuite === 'class_11_12' && 'এইচএসসি পদার্থ ও আইসিটি হাই-স্পিড সফটওয়্যার'}
                        {selectedClassSuite === 'admission' && 'বুয়েট, ঢাবি ও সমন্বিত বিশ্ববিদ্যালয় ভর্তি প্রিপারেশন সফটওয়্যার'}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white mt-1">
                      {selectedClassSuite === 'bcs_cadre' && '46th & 47th BCS Prelims & Written Smart Cadre Hub'}
                      {selectedClassSuite === 'early_kids' && 'Early Kids & Mother Tech Foundation Suite (প্লে - ৫ম শ্রেণী)'}
                      {selectedClassSuite === 'class_6_8' && 'Junior Digital Science & Coding Suite'}
                      {selectedClassSuite === 'class_9_10' && 'SSC Exam Conqueror & Smart Math Solver'}
                      {selectedClassSuite === 'class_11_12' && 'HSC Science & ICT Master Suite'}
                      {selectedClassSuite === 'admission' && 'Varsity Admission Question Bank & Rank Predictor'}
                    </h2>
                  </div>

                  {/* Canvas Navigation Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#13161C] p-1.5 rounded-2xl border border-[#252A36]">
                    {[
                      { id: 'overview', labelBn: selectedClassSuite === 'early_kids' ? 'মায়েদের গাইড' : 'সিলেবাস' },
                      { id: 'subjects', labelBn: selectedClassSuite === 'early_kids' ? 'ভয়েস অ আ ক খ' : 'সলভার ও সূত্র' },
                      { id: 'mcq_test', labelBn: selectedClassSuite === 'early_kids' ? 'ফানি কুইজ' : 'লাইব MCQ কুইজ' },
                      { id: 'ai_tutor', labelBn: selectedClassSuite === 'early_kids' ? 'মা-শিশু এআই' : '২৪/৭ এআই টিউটর' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveClassModuleTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeClassModuleTab === tab.id
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.labelBn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SUB TAB 1: OVERVIEW & SYLLABUS TRACKER */}
                {activeClassModuleTab === 'overview' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-1">
                        <span className="text-[11px] text-gray-400">সিলেবাস কভারেজ</span>
                        <div className="text-xl font-black text-emerald-400">৮৮% সম্পন্ন</div>
                        <div className="w-full bg-[#1A1D24] h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[88%]"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-1">
                        <span className="text-[11px] text-gray-400">পরীক্ষার বাকি দিন</span>
                        <div className="text-xl font-black text-amber-400">১০৪ দিন (কাউন্টডাউন)</div>
                        <span className="text-[10px] text-amber-300">প্রতিদিনের টার্গেট রিভিশন চালু</span>
                      </div>
                      <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-1">
                        <span className="text-[11px] text-gray-400">প্র্যাকটিক্যাল সিমুলেটর</span>
                        <div className="text-xl font-black text-purple-400">১২টি রেডি প্রজেক্ট</div>
                        <span className="text-[10px] text-purple-300">কোডিং ও সায়েন্স ল্যাব</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#131722] border border-indigo-500/30 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-indigo-300 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>পাঠ্যবইয়ের প্রধান প্রধান গুরুত্বপূর্ণ অধ্যায় ও সফটওয়্যার গাইড:</span>
                      </h4>

                      <div className="space-y-2 text-xs">
                        {selectedClassSuite === 'bcs_cadre' && [
                          { ch: 'বাংলাদেশ বিষয়াবলী (৩০ নম্বর): সংবিধান, মুক্তিযুদ্ধ ও অর্থনৈতিক সমীক্ষা', status: 'বিসিএস প্রিলি হট', note: 'সংবিধানের প্রধান অনুচ্ছেদ, ৭ই মার্চের ভাষণ ও মেগা প্রজেক্ট আপডেট।' },
                          { ch: 'আন্তর্জাতিক বিষয়াবলী (২০ নম্বর): ভূ-রাজনীতি, চুক্তি ও বিশ্ব সংস্থা', status: 'হাই ইম্প্যাক্ট', note: 'জাতিসংঘ, ন্যাটোভুক্ত আঞ্চলিক জোট ও সাম্প্রতিক বিশ্ব অর্থনৈতিক প্রভাব।' },
                          { ch: 'বাংলা ভাষা ও সাহিত্য (৩৫ নম্বর): প্রাচীন, মধ্য ও আধুনিক যুগ', status: 'বিসিএস স্পেশাল', note: 'চর্যাপদ, মঙ্গলকাব্য, রবীন্দ্রনাথ ও নজরুল সাহিত্যকর্ম বিসিএস প্রশ্ন ব্যাংক।' },
                          { ch: 'গাণিতিক যুক্তি ও আইসিটি (৩০ নম্বর): সেট, লগ, কম্পিউটার নেটওয়ার্ক', status: '১০০% নিশ্চিত মার্কস', note: 'লগারিদম, লাভ-ক্ষতি, কম্পিউটার মেমোরি ও সাইবার সিকিউরিটি কোশ্চেন সলভার।' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-[#0F1117] border border-emerald-500/30 rounded-xl flex items-center justify-between">
                            <div>
                              <div className="font-bold text-emerald-300">{item.ch}</div>
                              <div className="text-[11px] text-gray-300">{item.note}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold">
                              {item.status}
                            </span>
                          </div>
                        ))}

                        {selectedClassSuite === 'early_kids' && [
                          { ch: 'মায়েদের মূল দায়িত্ব: মোবাইল গেমের আসক্তি থেকে শিশুকে রক্ষা', status: 'প্যারেন্টিং গাইড', note: 'গেমের সময় শিশুকে এআই ড্রয়িং, অ আ ক খ এবং লজিক অ্যাপ দিয়ে প্রযুক্তির সঠিক ব্যবহারে উৎসাহিত করুন।' },
                          { ch: 'ডিজিটাল ক্যারিয়ার পরিচিতি (শিশুকাল থেকেই)', status: 'ভবিষ্যৎ ভিশন', note: 'প্রযুক্তি যে শুধু বিনোদনের জন্য নয়—এটি দিয়ে ভবিষ্যতের সফল জীবন গড়া সম্ভব তা শিশুকাল থেকেই শেখানো।' },
                          { ch: 'দৈনিক ২০ মিনিটের প্লে-লার্নিং ও ভয়েস কার্টুন রুটিন', status: 'প্রাক-প্রাথমিক ল্যাব', note: 'ছড়া, বর্ণমালা, ১ ২ ৩ এবং আঁকাআঁকি থেকে লজিক বিল্ডিং অনুশীলনী।' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-[#0F1117] border border-amber-500/30 rounded-xl flex items-center justify-between">
                            <div>
                              <div className="font-bold text-amber-300">{item.ch}</div>
                              <div className="text-[11px] text-gray-300">{item.note}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold">
                              {item.status}
                            </span>
                          </div>
                        ))}

                        {selectedClassSuite === 'class_9_10' && [
                          { ch: 'অধ্যায় ৩: বীজগণিতীয় রাশি', status: '১০০% কমন', note: 'উৎপাদকে বিশ্লেষণ ও ৩টি গাণিতিক প্রমাণ।' },
                          { ch: 'অধ্যায় ৮: বৃত্ত ও সম্পাদ্য', status: 'ভিআইপি', note: 'বৃত্তের কেন্দ্রস্থ কোণ ও বৃত্তস্থ কোণের দ্বিগুণ প্রমাণ।' },
                          { ch: 'উচ্চতর গণিত: ভেক্টর ও স্থানাঙ্ক জ্যামিতি', status: 'প্র্যাকটিক্যাল', note: 'ত্রিভুজের ক্ষেত্রফল নির্ণয় ও ভেক্টর যোগ।' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-[#0F1117] border border-[#252A36] rounded-xl flex items-center justify-between">
                            <div>
                              <div className="font-bold text-white">{item.ch}</div>
                              <div className="text-[11px] text-gray-400">{item.note}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold">
                              {item.status}
                            </span>
                          </div>
                        ))}

                        {selectedClassSuite !== 'class_9_10' && [
                          { ch: 'আইসিটি: সি প্রোগ্রামিং ও পাইথন লজিক', status: 'প্র্যাকটিক্যাল ল্যাব', note: 'লুপ, কন্ডিশন ও ফাংশন কোডিং প্র্যাকটিস।' },
                          { ch: 'পদার্থবিজ্ঞান: ভেক্টর ক্যালকুলাস ও গতিবিদ্যা', status: 'উচ্চ গাণিতিক', note: 'প্রাসের গতিপথ ও তড়িৎ ক্ষেত্র গাণিতিক সমীকরণ।' },
                          { ch: 'উচ্চতর গণিত: ম্যাট্রিক্স ও ডিটারমিন্যান্ট', status: '১০০% কমন', note: 'ক্র্যামারের নিয়মে সমীকরণ সমাধান।' }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-[#0F1117] border border-[#252A36] rounded-xl flex items-center justify-between">
                            <div>
                              <div className="font-bold text-white">{item.ch}</div>
                              <div className="text-[11px] text-gray-400">{item.note}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: SUBJECT SOLVER & FORMULA BANK */}
                {activeClassModuleTab === 'subjects' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>
                            {selectedClassSuite === 'early_kids'
                              ? 'মজার অ আ ক খ ও ১ ২ ৩ ভয়েস প্লেয়ার (Mother & Child Audio Playback)'
                              : 'দ্রুত সমাধান ও সূত্র ডিকশনারি (Formula Quick Solver)'}
                          </span>
                        </span>
                        <button
                          onClick={() => handleSpeakText(selectedClassSuite === 'early_kids' ? 'স্বাগতম! মা ও শিশুর প্রারম্ভিক অ আ ক খ এবং ১ ২ ৩ শিক্ষা বোর্ডে।' : 'এখানে প্রতিটি বিষয়ের সূত্র এবং ধাপভিত্তিক গাণিতিক সমাধান রয়েছে।')}
                          className="p-1.5 bg-[#1A1D24] text-gray-300 rounded-lg text-[11px] hover:text-white flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>ভয়েসে শুনুন</span>
                        </button>
                      </div>

                      {selectedClassSuite === 'early_kids' ? (
                        <div className="space-y-4">
                          <div className="p-3.5 bg-[#0F1117] border border-emerald-500/30 rounded-2xl space-y-2">
                            <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                              <Smile className="w-4 h-4 text-emerald-400" />
                              <span>১. বাংলা স্বরবর্ণ ও ব্যঞ্জনবর্ণ ভয়েস সাউন্ড প্লেয়ার (ক্লিক করে শুনুন):</span>
                            </span>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center font-black text-sm">
                              {['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ'].map((char) => (
                                <button
                                  key={char}
                                  onClick={() => handleSpeakText(char)}
                                  className="p-2.5 bg-[#13161C] hover:bg-emerald-500 hover:text-black border border-[#252A36] rounded-xl text-white transition-all shadow-md active:scale-95"
                                >
                                  {char}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 block text-right">🔊 বাটন চাপলে স্পষ্ট বাংলা উচ্চারণ শোনা যাবে।</span>
                          </div>

                          <div className="p-3.5 bg-[#0F1117] border border-purple-500/30 rounded-2xl space-y-2">
                            <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <span>২. গণিত ও ইংরেজি সংখ্যা শিক্ষা (১ ২ ৩ / 1 2 3):</span>
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-bold text-xs">
                              {['১ (এক)', '২ (দুই)', '৩ (তিন)', '৪ (চার)', '৫ (পাঁচ)', '6 (Six)', '7 (Seven)', '8 (Eight)', '9 (Nine)', '10 (Ten)'].map((numStr) => (
                                <button
                                  key={numStr}
                                  onClick={() => handleSpeakText(numStr)}
                                  className="p-2.5 bg-[#13161C] hover:bg-purple-500 hover:text-white border border-[#252A36] rounded-xl text-purple-200 transition-all active:scale-95"
                                >
                                  {numStr}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-[#0F1117] border border-amber-500/30 rounded-xl space-y-1.5">
                            <span className="text-amber-300 font-bold">১. গতি ও বলের সমীকরণ</span>
                            <p className="text-gray-300 font-mono bg-black/40 p-2 rounded text-[11px]">
                              v = u + at <br />
                              s = ut + ½at² <br />
                              v² = u² + 2as
                            </p>
                            <span className="text-[10px] text-gray-400 block">u = আদিবেগ, v = শেষবেগ, a = ত্বরণ, t = সময়</span>
                          </div>

                          <div className="p-3 bg-[#0F1117] border border-indigo-500/30 rounded-xl space-y-1.5">
                            <span className="text-indigo-300 font-bold">২. ত্রিকোণমিতিক অভেদাবলী</span>
                            <p className="text-gray-300 font-mono bg-black/40 p-2 rounded text-[11px]">
                              sin²θ + cos²θ = 1 <br />
                              sec²θ - tan²θ = 1 <br />
                              cosec²θ - cot²θ = 1
                            </p>
                            <span className="text-[10px] text-gray-400 block">সমকোণী ত্রিভুজের বাহু ও কোণের সম্পর্ক</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB TAB 3: TIMED MCQ TEST */}
                {activeClassModuleTab === 'mcq_test' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-4 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-[#252A36] pb-2 text-xs">
                        <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span>রিয়েল-টাইম লাইভ কুইজ পরীক্ষা</span>
                        </span>
                        <span className="text-gray-300">বর্তমান স্কোর: <strong className="text-amber-400">{classMcqScore}</strong></span>
                      </div>

                      <div className="space-y-3 text-xs">
                        {(selectedClassSuite === 'bcs_cadre' ? [
                          {
                            id: 201,
                            q: 'বাংলাদেশের সংবিধানের ৩য় ভাগে কোনটি সংরক্ষিত আছে?',
                            options: ['মৌলিক অধিকার (অণু ২৬-৪৪)', 'রাষ্ট্র পরিচালনার মূলনীতি', 'প্রজাতন্ত্র ও শাসনবিভাগ', 'জরুরি অবস্থা ঘোষণা'],
                            correct: 0,
                            exp: 'বাংলাদেশের সংবিধানের ৩য় ভাগে অনুচ্ছেদ ২৬ থেকে ৪৪ পর্যন্ত নাগরিকদের মৌলিক অধিকারগুলো লিপিবদ্ধ করা হয়েছে।'
                          },
                          {
                            id: 202,
                            q: 'চর্যাপদের সর্বাধিক পদ (১৩টি পদ) রচয়িতা পদকর্তা কে?',
                            options: ['লুইপা', 'কাণহপা', 'ভুসুকুপা', 'শবরপা'],
                            correct: 1,
                            exp: 'চর্যাপদের সর্বমোট ৪৬টি সম্পূর্ণ পদের মধ্যে কাণহপা একাই ১৩টি পদ রচনা করেন।'
                          },
                          {
                            id: 203,
                            q: 'জাতির পিতা বঙ্গবন্ধুর ঐতিহাসিক ৭ই মার্চের ভাষণ সংবিধানের কোন তফসিলে যুক্ত করা হয়েছে?',
                            options: ['পঞ্চম তফসিল (Fifth Schedule)', 'ষষ্ঠ তফসিল', 'সপ্তম তফসিল', 'চতুর্থ তফসিল'],
                            correct: 0,
                            exp: '২০১১ সালের ১৫ই জুন গৃহীত সংবিধানের ১৫তম সংশোধনীর মাধ্যমে বঙ্গবন্ধুর ৭ই মার্চের ভাষণকে ৫ম তফসিলে অন্তর্ভুক্ত করা হয়।'
                          }
                        ] : selectedClassSuite === 'early_kids' ? [
                          {
                            id: 101,
                            q: 'নিচের কোনটি আমাদের জাতীয় পাখি?',
                            options: ['কাক', 'দোয়েল', 'ময়না', 'টিয়া'],
                            correct: 1,
                            exp: 'বাংলাদেশের জাতীয় পাখি হলো দোয়েল।'
                          },
                          {
                            id: 102,
                            q: '৩ এর সাথে ২ যোগ করলে কত হয়?',
                            options: ['৪', '৫', '৬', '৭'],
                            correct: 1,
                            exp: '৩ + ২ = ৫ (পাঁচ)'
                          }
                        ] : [
                          {
                            id: 1,
                            q: 'একটি বস্তুর আদিবেগ ১০ m/s এবং ত্বরণ ২ m/s² হলে ৫ সেকেন্ড পর এর শেষবেগ কত হবে?',
                            options: ['১৫ m/s', '২০ m/s', '২৫ m/s', '৩০ m/s'],
                            correct: 1, // 20 m/s
                            exp: 'v = u + at = 10 + (2 × 5) = 20 m/s'
                          },
                          {
                            id: 2,
                            q: 'sin 30° + cos 60° এর মান কত?',
                            options: ['১/২', '১', '√৩/২', '০'],
                            correct: 1, // 1
                            exp: 'sin 30° = 1/2, cos 60° = 1/2 => 1/2 + 1/2 = 1'
                          }
                        ]).map((qObj) => {
                          const userAns = selectedAnswers[qObj.id];
                          return (
                            <div key={qObj.id} className="p-3.5 bg-[#0F1117] border border-[#252A36] rounded-xl space-y-2">
                              <p className="font-bold text-white text-xs">প্রশ্ন {qObj.id}: {qObj.q}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {qObj.options.map((opt, oidx) => {
                                  const isSelected = userAns === oidx;
                                  const isCorrect = oidx === qObj.correct;
                                  let btnStyle = 'bg-[#13161C] border-[#252A36] text-gray-300';
                                  if (userAns !== undefined) {
                                    if (isCorrect) btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
                                    else if (isSelected) btnStyle = 'bg-red-500/20 text-red-300 border-red-500/50';
                                  }
                                  return (
                                    <button
                                      key={oidx}
                                      onClick={() => {
                                        if (userAns === undefined) {
                                          setSelectedAnswers((prev) => ({ ...prev, [qObj.id]: oidx }));
                                          if (oidx === qObj.correct) setClassMcqScore((s) => s + 10);
                                        }
                                      }}
                                      className={`p-2 rounded-lg text-left border transition-all text-[11px] ${btnStyle}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {userAns !== undefined && (
                                <div className="p-2 bg-[#131722] border border-indigo-500/30 rounded-lg text-[10px] text-indigo-300">
                                  💡 <strong>ব্যাখ্যা:</strong> {qObj.exp}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 4: 24/7 CLASS AI TUTOR */}
                {activeClassModuleTab === 'ai_tutor' && (
                  <div className="p-5 bg-[#13161C] border border-emerald-500/30 rounded-2xl space-y-3 text-xs animate-fadeIn">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold border-b border-[#252A36] pb-2">
                      <BrainCircuit className="w-5 h-5 text-emerald-400" />
                      <span>
                        {selectedClassSuite === 'bcs_cadre'
                          ? '২৪/৭ বিসিএস ক্যাডার ও সরকারি চাকরি প্রস্তুতি এআই মেন্টর'
                          : selectedClassSuite === 'early_kids'
                          ? 'মা ও শিশুর ২৪/৭ এআই প্যারেন্টিং ও প্রযুক্তি শিক্ষা গাইড'
                          : '২৪/৭ ডেডিকেটেড ক্লাসরুম এআই টিউটর অ্যাসিস্ট্যান্ট'}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedClassSuite === 'bcs_cadre'
                        ? 'বিসিএস প্রিলিমিনারি, লিখিত কিংবা ভাইভার যেকোনো বিষয় (সংবিধান, আন্তর্জাতিক সম্পর্ক, গাণিতিক যুক্তি, মানসিক দক্ষতা বা ক্যাডার চয়েস) সম্পর্কে প্রশ্ন করুন:'
                        : selectedClassSuite === 'early_kids'
                        ? 'সম্মানিত মা/অভিভাবক, আপনার সন্তানের মোবাইল গেমের আসক্তি কাটিয়ে কীভাবে অ্যাপের মাধ্যমে পড়ালেখায় আগ্রহ জন্মাবেন এবং শিশুকাল থেকেই প্রযুক্তিতে পারদর্শী করবেন—যেকোনো প্রশ্ন লিখুন:'
                        : 'তোমার শ্রেণীর গণিত, বিজ্ঞান বা কোডিং সংক্রান্ত যেকোনো কঠিন প্রশ্নের ছবি তোলো বা টাইপ করো—আমাদের এআই টিউটর সঙ্গে সঙ্গে প্রাঞ্জল বাংলায় উত্তর বুঝিয়ে দেবে।'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={
                          selectedClassSuite === 'bcs_cadre'
                            ? 'যেমন: বিসিএস প্রিলিমিনারির জন্য বাংলাদেশ বিষয়াবলীর ১০০% নিশ্চিত প্রস্তুতি কৌশল কী?'
                            : selectedClassSuite === 'early_kids'
                            ? 'যেমন: সন্তানকে মোবাইলে গেমের বদলে পড়াশোনায় মনোযোগী করার সহজ কৌশল কী?'
                            : 'এখানে তোমার প্রশ্নটি লেখো (যেমন: ৩য় অধ্যায়ের অনুশীলনী ৩.১ এর ৫ নম্বর অংকটি বুঝিয়ে দাও)...'
                        }
                        className="flex-1 bg-[#0F1117] border border-[#252A36] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => alert(isBn ? 'এআই টিউটর মা ও শিশুর জন্য বিশেষ পরামর্শ তৈরি করছে...' : 'AI Tutor is generating guidance...')}
                        className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl shadow hover:bg-emerald-400 transition-all shrink-0"
                      >
                        প্রশ্ন পাঠাও
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* RIGHT VIEW 1: EXAM PREPARATION SUGGESTIONS & MODEL TESTS */}
          {selectedMainTab === 'suggestions' && (
            <div className="space-y-6">
              
              {/* Media Portal Sub Header */}
              <div className="p-4 bg-[#0F1117] border border-[#252A36] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{isBn ? 'ক্লাস-ভিত্তিক ১০০% কমন প্রস্তুতিমূলক সাজেশন পোর্টাল' : 'Class Prep Suggestions Portal'}</span>
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={isBn ? 'বিষয় বা সাজেশন সার্চ করুন...' : 'Search suggestion...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-4">
                {filteredSuggestions.map((sug) => {
                  const isExpanded = expandedSuggestionId === sug.id;
                  return (
                    <div
                      key={sug.id}
                      className={`p-5 bg-[#0F1117] border rounded-3xl space-y-4 transition-all shadow-xl ${
                        isExpanded ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-[#252A36] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold text-[11px]">
                            {sug.classNameBn}
                          </span>
                          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg font-medium text-[11px]">
                            {sug.subjectBn}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md font-bold text-[10px]">
                          গ্যারান্টি: {sug.importanceLevel}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white leading-snug">
                        {sug.titleBn}
                      </h3>

                      {/* Hot Topics Bullets */}
                      <div className="p-3 bg-[#13161C] rounded-2xl border border-[#252A36] space-y-2">
                        <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isBn ? '🔥 সবচেয়ে গুরুত্বপূর্ণ অধ্যায় ও টপিকস:' : 'Hot Topics:'}</span>
                        </span>
                        <ul className="space-y-1 text-xs text-gray-300">
                          {sug.hotTopicsBn.map((topic, tidx) => (
                            <li key={tidx} className="flex items-start space-x-2">
                              <span className="text-amber-400 mt-0.5">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expanded Sample Model Questions */}
                      {isExpanded && (
                        <div className="p-4 bg-[#131722] border border-indigo-500/30 rounded-2xl space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-[#252A36] pb-2 text-xs font-bold text-indigo-300">
                            <span className="flex items-center space-x-1.5">
                              <FileText className="w-4 h-4 text-indigo-400" />
                              <span>{isBn ? 'নমুনা সৃজনশীল ও গাণিতিক প্রশ্নাবলী:' : 'Sample Questions:'}</span>
                            </span>
                            <span>{sug.sampleQuestionsBn.length}টি নমুনা প্রশ্ন</span>
                          </div>

                          <div className="space-y-2.5">
                            {sug.sampleQuestionsBn.map((sq, qidx) => (
                              <div key={qidx} className="p-2.5 bg-[#0F1117] border border-[#252A36] rounded-xl text-xs space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                  <span className="text-amber-400">প্রশ্ন {qidx + 1} ({sq.type})</span>
                                  <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-500/30">{sq.mark}</span>
                                </div>
                                <p className="text-gray-200 font-medium">{sq.q}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Action Footer */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#252A36] text-xs">
                        <span className="text-gray-400 text-[11px]">
                          📥 {sug.downloadCount} জন শিক্ষার্থী ডাউনলোড করেছে
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setExpandedSuggestionId(isExpanded ? null : sug.id)}
                            className="px-3.5 py-1.5 bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 rounded-xl text-xs font-bold border border-[#2D3139] flex items-center space-x-1"
                          >
                            <span>{isExpanded ? 'প্রশ্নসমূহ গুটিয়ে রাখুন' : 'নমুনা প্রশ্ন দেখুন'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => alert(isBn ? `${sug.titleBn} সাজেশন ফাইল ও নোটস ডাউনলোড সম্পন্ন হয়েছে! 📥` : 'Downloaded!')}
                            className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isBn ? 'পিডিএফ (PDF) ডাউনলোড' : 'Download PDF'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT VIEW 2: EXCLUSIVE SCIENCE & AI RESEARCH PUBLICATIONS */}
          {selectedMainTab === 'research' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#0F1117] border border-[#252A36] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-purple-300 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>{isBn ? 'গণমাধ্যম স্টাইল শিক্ষা ও বিজ্ঞান বিষয়ক গবেষণা কেন্দ্র' : 'Science & AI Media Research Portal'}</span>
                </div>
                <span className="text-gray-400">{researchPapers.length}টি ওপেন অ্যাক্সেস পেপার</span>
              </div>

              <div className="space-y-4">
                {researchPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-6 bg-[#0F1117] border border-[#252A36] hover:border-purple-500/50 rounded-3xl space-y-4 shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-bold text-[11px]">
                        {paper.categoryBn}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{paper.publicationDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug">
                      {paper.titleBn}
                    </h3>

                    <div className="text-xs text-gray-400 font-medium">
                      গবেষকবৃন্দ: <span className="text-gray-200">{paper.authors.join(', ')}</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#13161C] p-3.5 rounded-2xl border border-[#252A36]">
                      {paper.abstractBn}
                    </p>

                    {/* Key Findings */}
                    <div className="p-3.5 bg-[#131722] border border-emerald-500/30 rounded-2xl space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 block">
                        💡 গবেষণার মূল অর্জনসমূহ (Key Findings):
                      </span>
                      <ul className="space-y-1 text-xs text-gray-300">
                        {paper.keyFindingsBn.map((find, fidx) => (
                          <li key={fidx} className="flex items-start space-x-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{find}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-[#252A36] flex items-center justify-between text-xs">
                      <span className="text-gray-400 text-[11px]">
                        📄 {paper.pdfSize} • {paper.citationCount} Citations
                      </span>

                      <button
                        onClick={() => setSelectedResearchPaper(paper)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isBn ? 'সম্পূর্ণ গবেষণাপত্র দেখুন' : 'View Full Paper'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RIGHT VIEW 3: EDUCATIONAL REFORM BULLETINS (শিক্ষাক্রম ও পরীক্ষা নীতির বড় বড় পরিবর্তন) */}
          {selectedMainTab === 'news' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#0F1117] border border-[#252A36] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Megaphone className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>{isBn ? 'জাতীয় শিক্ষা বোর্ড ও নতুন শিক্ষাক্রমের বড় বড় পরিবর্তন বুলেটিন' : 'Ministry Education Reform Bulletins'}</span>
                </div>
                <span className="text-gray-400">লাইভ আপডেট ২০২৬</span>
              </div>

              <div className="space-y-4">
                {educationalNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-6 bg-[#0F1117] border border-[#252A36] hover:border-amber-500/40 rounded-3xl space-y-4 shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252A36] pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold text-[11px] flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>{notice.status}</span>
                        </span>
                        <span className="px-2.5 py-1 bg-[#13161C] text-gray-300 rounded-lg text-xs font-medium">
                          {notice.categoryBn}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{notice.date}</span>
                      </span>
                    </div>

                    {/* Title & Voice Read Aloud Button */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black text-white">
                          {notice.titleBn}
                        </h3>

                        <button
                          onClick={() => handleSpeakText(`${notice.titleBn}। ${notice.summaryBn}`)}
                          className="px-3 py-1.5 bg-[#13161C] hover:bg-[#1C202B] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all shadow-sm"
                          title="বাংলায় ভয়েস শুনুন"
                        >
                          <Volume2 className={`w-4 h-4 ${speakingText === `${notice.titleBn}। ${notice.summaryBn}` ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
                          <span>{speakingText === `${notice.titleBn}। ${notice.summaryBn}` ? 'থামান' : 'ভয়েসে শুনুন'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed">
                        {notice.summaryBn}
                      </p>
                    </div>

                    {/* Impact & Action Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 bg-[#131722] border border-indigo-500/30 rounded-2xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-300 flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5 text-indigo-400" />
                          <span>শিক্ষার্থীর ফলাফলে বড় প্রভাব (Impact):</span>
                        </span>
                        <p className="text-xs text-gray-300">{notice.impactBn}</p>
                      </div>

                      <div className="p-3.5 bg-[#171322] border border-purple-500/30 rounded-2xl space-y-1">
                        <span className="text-[11px] font-bold text-purple-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>শিক্ষার্থীর করনীয় (Action Needed):</span>
                        </span>
                        <p className="text-xs text-gray-300">{notice.actionForStudentsBn}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* PAPER MODAL DETAIL VIEW */}
      {selectedResearchPaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1117] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#252A36] pb-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full font-bold text-xs">
                {selectedResearchPaper.categoryBn}
              </span>
              <button
                onClick={() => setSelectedResearchPaper(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#13161C]"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-black text-white">
              {selectedResearchPaper.titleBn}
            </h2>

            <div className="text-xs text-gray-300 space-y-1">
              <p><strong>লেখকগণ:</strong> {selectedResearchPaper.authors.join(', ')}</p>
              <p><strong>প্রকাশনা তারিখ:</strong> {selectedResearchPaper.publicationDate}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-300">সারসংক্ষেপ (Abstract):</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-[#13161C] p-4 rounded-2xl border border-[#252A36]">
                {selectedResearchPaper.abstractBn}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-300">প্রধান ফলাফল (Key Findings):</h4>
              <ul className="space-y-1.5 text-xs text-gray-200">
                {selectedResearchPaper.keyFindingsBn.map((kf, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-[#13161C] p-2.5 rounded-xl border border-[#252A36]">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{kf}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#252A36]">
              <span className="text-xs text-gray-400">PDF সাইজ: {selectedResearchPaper.pdfSize}</span>
              <button
                onClick={() => {
                  alert('গবেষণাপত্র পিডিএফ সফলভাবে ডাউনলোড হয়েছে!');
                  setSelectedResearchPaper(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>পিডিএফ ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
