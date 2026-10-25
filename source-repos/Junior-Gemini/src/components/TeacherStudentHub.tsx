import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Bell,
  BookOpen,
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Award,
  Pin,
  FileText,
  UserCheck,
  Plus,
  Trophy,
  Flame,
  Heart,
  Share2,
  Globe,
  Filter,
  Image as ImageIcon,
  PlusCircle,
  X,
  ThumbsUp,
  FileBadge
} from 'lucide-react';

interface TeacherStudentHubProps {
  lang: 'bn' | 'en';
}

interface Notice {
  id: string;
  teacherName: string;
  subject: string;
  title: string;
  content: string;
  date: string;
  pinned?: boolean;
}

interface Question {
  id: string;
  studentName: string;
  grade: string;
  question: string;
  teacherAnswer?: string;
  answeredBy?: string;
  likes: number;
}

interface StudentAchievement {
  id: string;
  studentName: string;
  grade: string;
  institution: string;
  division: string;
  category: 'science' | 'coding' | 'art' | 'sports' | 'math' | 'social';
  categoryLabelBn: string;
  title: string;
  story: string;
  badge: string;
  imageUrl?: string;
  inspiredCount: number;
  awesomeCount: number;
  saluteCount: number;
  date: string;
  userReacted?: { inspired?: boolean; awesome?: boolean; salute?: boolean };
}

export const TeacherStudentHub: React.FC<TeacherStudentHubProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [activeSubTab, setActiveSubTab] = useState<'group' | 'personal' | 'showcase' | 'notice' | 'qa'>('showcase');

  // National Student Showcase State
  const [achievements, setAchievements] = useState<StudentAchievement[]>([
    {
      id: 'ach1',
      studentName: 'মালিহা মোস্তফা',
      grade: '১০ম শ্রেণী',
      institution: 'রংপুর সরকারি বালিকা উচ্চ বিদ্যালয়',
      division: 'রংপুর',
      category: 'science',
      categoryLabelBn: '🤖 বিজ্ঞান ও টেকনোলজি',
      title: 'আর্সেনিক ও পানি বিশুদ্ধকরণের জন্য সোলো-সেন্সর ওয়াটার ফিল্টার প্রজেক্ট',
      story: 'আমাদের পল্লী এলাকায় খাবার পানিতে আর্সেনিকের ঝুঁকি রয়েছে। আমি মাটি এআই সাইন্স মডিউলের আইডিয়া নিয়ে অডুইনো আনো ও সেন্সর দিয়ে একটি কম খরচের স্মার্ট ওয়াটার ফিল্টার বানিয়েছি। জেলা বিজ্ঞান মেলায় ১ম স্থান লাভ করেছি। সহপাঠীদের জন্য বার্তা: ছোট প্রজেক্ট হলেও নিজের আশেপাশের সমস্যা সমাধানে এগিয়ে এসো!',
      badge: '🥇 ১ম স্থান (জেলা বিজ্ঞান মেলা)',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      inspiredCount: 245,
      awesomeCount: 180,
      saluteCount: 135,
      date: 'আজ সকাল ১০:১৫'
    },
    {
      id: 'ach2',
      studentName: 'তাহমিদ চৌধুরী',
      grade: 'একাদশ শ্রেণী',
      institution: 'চট্টগ্রাম সরকারি মডেল কলেজ',
      division: 'চট্টগ্রাম',
      category: 'coding',
      categoryLabelBn: '💻 কোডিং ও সফটওয়্যার',
      title: 'দৃষ্টিপ্রতিবন্ধী ভাইবোনদের জন্য এআই ভয়েস নেভিগেশন গ্লাস',
      story: 'মাটি এআই কোড টিউটর থেকে পাইথন ও ওপেনসিভি শিখে একটি এআই স্মার্ট চশমা কোড করেছি যা সামনে দেয়াল বা গাড়ি থাকলে সাউন্ড এলার্ট দেয়। তরুণদের বলবো: কোডিং কোনো কঠিন বিষয় নয়, নিয়মিত প্র্যাকটিস করলে তোমরাও যেকোনো চমৎকার অ্যাপ বা ডিভাইস বানাতে পারবে!',
      badge: '🌟 শ্রেষ্ঠ ইয়ুথ এআই প্রজেক্ট',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      inspiredCount: 312,
      awesomeCount: 240,
      saluteCount: 195,
      date: 'গতকাল'
    },
    {
      id: 'ach3',
      studentName: 'ফারজানা ইয়াসমিন',
      grade: '৮ম শ্রেণী',
      institution: 'খুলনা জিলা স্কুল',
      division: 'খুলনা',
      category: 'art',
      categoryLabelBn: '🎨 চিত্রাঙ্কন ও শিল্পকর্ম',
      title: 'সুন্দরবন ও ম্যানগ্রোভ বনাঞ্চল রক্ষায় আঁকা জলরং চিত্র প্রদর্শনীর পুরস্কার',
      story: 'আমাদের পরিবেশ ও বনাঞ্চল বাঁচানো খুবই জরুরি। জাতীয় সুন্দরবন দিবস উপলক্ষে আঁকা আমার ছবিতে ১টি গোল্ড মেডেল পেয়েছি। পড়াশোনার পাশাপশি যেকোনো একটি সৃজনশীল শখ তোমাকে অনেক মানসিক শান্তি দেবে।',
      badge: '🥇 জাতীয় স্বর্ণপদক বিজয়ী',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      inspiredCount: 189,
      awesomeCount: 142,
      saluteCount: 98,
      date: '২ দিন আগে'
    },
    {
      id: 'ach4',
      studentName: 'আরিয়ান হাবিব',
      grade: '১০ম শ্রেণী',
      institution: 'রাজউক উত্তরা মডেল কলেজ',
      division: 'ঢাকা',
      category: 'sports',
      categoryLabelBn: '🏆 খেলাধুলা ও ফিটনেস',
      title: 'জাতীয় ইয়ুথ অ্যাথলেটিকসে ১০০ মিটার স্প্রিন্টে গোল্ড মেডেল',
      story: 'প্রতিদিন সকালে মাটি এআই স্পোর্টস অ্যান্ড ফিটনেস গাইডের টিপস অনুসরণ করে ভোরে রানিং প্র্যাকটিস করেছি। শারীরিক ফিটনেস ভালো থাকলে পড়ার টেবিলেও মাথা অনেক সতেজ থাকে!',
      badge: '🏆 জাতীয় রেকর্ডধারী অ্যাথলেট',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
      inspiredCount: 220,
      awesomeCount: 165,
      saluteCount: 140,
      date: '৩ দিন আগে'
    }
  ]);

  // Showcase Filters
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Showcase Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newGrade, setNewGrade] = useState<string>('');
  const [newInstitution, setNewInstitution] = useState<string>('');
  const [newDivision, setNewDivision] = useState<string>('ঢাকা');
  const [newCategory, setNewCategory] = useState<'science' | 'coding' | 'art' | 'sports' | 'math' | 'social'>('science');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newStory, setNewStory] = useState<string>('');
  const [newBadge, setNewBadge] = useState<string>('💡 বিশেষ উদ্ভাবন ও কৃতিত্ব');
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // AI Certificate / Citation Generator
  const [selectedCertificatePost, setSelectedCertificatePost] = useState<StudentAchievement | null>(null);
  const [generatedCertificateText, setGeneratedCertificateText] = useState<string>('');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState<boolean>(false);

  const handleUploadAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newStudentName || !newStory) return;

    const categoryLabels: Record<string, string> = {
      science: '🤖 বিজ্ঞান ও টেকনোলজি',
      coding: '💻 কোডিং ও সফটওয়্যার',
      art: '🎨 চিত্রাঙ্কন ও শিল্পকর্ম',
      sports: '🏆 খেলাধুলা ও ফিটনেস',
      math: '📐 গণিত ও অলিম্পিয়াড',
      social: '🌿 পরিবেশ ও সামাজিক কাজ'
    };

    const newPost: StudentAchievement = {
      id: Date.now().toString(),
      studentName: newStudentName,
      grade: newGrade || (isBn ? '১০ম শ্রেণী' : 'Grade 10'),
      institution: newInstitution || (isBn ? 'বিদ্যালয় / কলেজ' : 'School/College'),
      division: newDivision,
      category: newCategory,
      categoryLabelBn: categoryLabels[newCategory] || '🌟 বিশেষ কৃতিত্ব',
      title: newTitle,
      story: newStory,
      badge: newBadge || '🌟 বিশেষ কৃতিত্ব',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      inspiredCount: 1,
      awesomeCount: 1,
      saluteCount: 1,
      date: 'এইমাত্র'
    };

    setAchievements([newPost, ...achievements]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewStudentName('');
    setNewGrade('');
    setNewInstitution('');
    setNewStory('');
    setNewImageUrl('');
  };

  const handleReaction = (id: string, type: 'inspired' | 'awesome' | 'salute') => {
    setAchievements(prev => prev.map(post => {
      if (post.id === id) {
        const userReacted = post.userReacted || {};
        const hasReacted = userReacted[type];

        let newInspired = post.inspiredCount;
        let newAwesome = post.awesomeCount;
        let newSalute = post.saluteCount;

        if (type === 'inspired') newInspired = hasReacted ? newInspired - 1 : newInspired + 1;
        if (type === 'awesome') newAwesome = hasReacted ? newAwesome - 1 : newAwesome + 1;
        if (type === 'salute') newSalute = hasReacted ? newSalute - 1 : newSalute + 1;

        return {
          ...post,
          inspiredCount: newInspired,
          awesomeCount: newAwesome,
          saluteCount: newSalute,
          userReacted: { ...userReacted, [type]: !hasReacted }
        };
      }
      return post;
    }));
  };

  const handleGenerateCertificate = async (post: StudentAchievement) => {
    setSelectedCertificatePost(post);
    setIsGeneratingCertificate(true);
    setGeneratedCertificateText('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `বাংলাদেশ জাতীয় ডিজিটাল ইয়ুথ প্লাটফর্মের পক্ষ থেকে কৃতি শিক্ষার্থী "${post.studentName}" (${post.institution}, ${post.division}) এর বিশেষ অর্জন "${post.title}" এবং বিশেষ বার্তা "${post.story}" এর উপর ভিত্তি করে একটি হৃদয়স্পর্শী, অনুপ্রেরণামূলক ও গৌরবময় সম্মাননা প্রশংসাপত্র ও সাইটেশন বাক্য তৈরি করুন।`,
          gradeLevel: 'National Youth Citation',
          type: 'lesson',
          language: lang,
        }),
      });

      const data = await response.json();
      setGeneratedCertificateText(data.lesson || (isBn ? 'জাতীয় কৃতি শিক্ষার্থী অভিনন্দন পত্র তৈরি হয়েছে।' : 'National Student Citation Generated.'));
    } catch (e) {
      setGeneratedCertificateText(isBn ? 'প্রশংসাপত্র তৈরিতে সাময়িক সমস্যা হয়েছে।' : 'Error generating citation.');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  // Group Study Channels
  const [selectedGroup, setSelectedGroup] = useState<string>('g1');
  const [groupMessage, setGroupMessage] = useState<string>('');
  
  const groupChannels = [
    { id: 'g1', nameBn: 'এইচএসসি ও এসএসসি আইসিটি গ্রুপ', nameEn: 'HSC & SSC ICT Group', members: 42, icon: '💻' },
    { id: 'g2', nameBn: 'বিজ্ঞান, রোবোটিক্স ও এআই ক্লাব', nameEn: 'Science & Robotics Club', members: 28, icon: '🤖' },
    { id: 'g3', nameBn: 'গণিত ও অলিম্পিয়াড প্র্যাকটিস', nameEn: 'Math Olympiad Practice', members: 35, icon: '📐' },
    { id: 'g4', nameBn: 'কিশোর কোডিং ও পাইথন স্টাডি', nameEn: 'Python & Youth Coding', members: 50, icon: '🐍' },
  ];

  const [groupMessages, setGroupMessages] = useState<Record<string, Array<{ id: string; sender: string; role: 'student' | 'teacher'; text: string; time: string }>>>({
    g1: [
      { id: 'gm1', sender: 'মোঃ রফিকুল ইসলাম (শিক্ষক)', role: 'teacher', text: 'সবাইকে স্বাগতম! আইসিটি চ্যাপ্টার ৩ এর বাইনারি টু ডেসিমাল কনভার্সনে কারোর কনফিউশন থাকলে এখানে প্রশ্ন পাঠাও।', time: '১০:১৫ AM' },
      { id: 'gm2', sender: 'আরিফ হোসেন (শিক্ষার্থী)', role: 'student', text: 'স্যার, 2s Complement নির্ণয় করার সহজ ট্রিকটি আরেকবার বললে ভালো হতো।', time: '১০:১৮ AM' },
      { id: 'gm3', sender: 'সামিয়া রহমান (শিক্ষার্থী)', role: 'student', text: '১ এর পরিপূরক বের করে শেষে ১ যোগ করলেই ২ এর পরিপূরক পাওয়া যায়!', time: '১০:২০ AM' },
    ],
    g2: [
      { id: 'gm4', sender: 'ড. ফারহানা আক্তার (শিক্ষিকা)', role: 'teacher', text: 'বিজ্ঞান মেলা ২০২৬ এর জন্য যারা সেন্সর ভিত্তিক প্রজেক্ট করছ তারা আপডেট শেয়ার করো।', time: 'গতকাল' },
      { id: 'gm5', sender: 'সাকিব হাসান (শিক্ষার্থী)', role: 'student', text: 'ম্যাম, আমরা অডুইনো দিয়ে ডাস্টবিন অটোমেশন প্রজেক্টের কোড কমপ্লিট করেছি!', time: 'গতকাল' }
    ]
  });

  // Personal 1-on-1 Direct Messaging
  const [selectedContact, setSelectedContact] = useState<string>('t1');
  const [personalMessage, setPersonalMessage] = useState<string>('');
  const [isAiReplyingPersonal, setIsAiReplyingPersonal] = useState<boolean>(false);

  const contacts = [
    { id: 't1', nameBn: 'মোঃ রফিকুল ইসলাম (আইসিটি শিক্ষক)', roleBn: 'প্রাইভেট আইসিটি টিউটর', avatar: '👨‍🏫', status: 'online' },
    { id: 't2', nameBn: 'ড. ফারহানা আক্তার (বিজ্ঞান শিক্ষিকা)', roleBn: 'ফিজিক্স ও কেমিস্ট্রি গাইড', avatar: '👩‍🏫', status: 'online' },
    { id: 'p1', nameBn: 'সাকিব হাসান (সহপাঠী - ১০ম শ্রেণী)', roleBn: 'স্টাডি পার্টনার', avatar: '👦', status: 'offline' },
  ];

  const [personalChats, setPersonalChats] = useState<Record<string, Array<{ id: string; sender: string; text: string; time: string; isMe: boolean }>>>({
    t1: [
      { id: 'pm1', sender: 'মোঃ রফিকুল ইসলাম', text: 'সালামু আলাইকুম স্যার, আমার পাইথন লুপের অ্যাসাইনমেন্টটি মেইলে জমা দিয়েছি।', time: 'গতকাল', isMe: true },
      { id: 'pm2', sender: 'মোঃ রফিকুল ইসলাম', text: 'ওয়ালাইকুমুস সালাম! আমি দেখেছি, তোমার ফোর-লুপের লজিক ঠিক আছে। খুব ভালো কাজ হয়েছে।', time: 'গতকাল', isMe: false }
    ],
    t2: [
      { id: 'pm3', sender: 'ড. ফারহানা আক্তার', text: 'ম্যাম, আগামীকাল কি ফিজিক্স এক্সপেরিমেন্টের জন্য ল্যাবে প্র্যাকটিক্যাল হবে?', time: 'সকাল ৮:০০', isMe: true },
      { id: 'pm4', sender: 'ড. ফারহানা আক্তার', text: 'হ্যাঁ, সকাল ১০টায় ১ম শিফটের প্র্যাকটিক্যাল শুরু হবে। নোটবই সাথে আনবে।', time: 'সকাল ৮:০৫', isMe: false }
    ]
  });

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: isBn ? 'আমি (শিক্ষার্থী)' : 'Me (Student)',
      role: 'student' as const,
      text: groupMessage,
      time: 'এইমাত্র'
    };

    setGroupMessages({
      ...groupMessages,
      [selectedGroup]: [...(groupMessages[selectedGroup] || []), newMsg]
    });
    setGroupMessage('');
  };

  const handleSendPersonalMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalMessage.trim()) return;

    const myMsgText = personalMessage;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Me',
      text: myMsgText,
      time: 'এইমাত্র',
      isMe: true
    };

    const updated = {
      ...personalChats,
      [selectedContact]: [...(personalChats[selectedContact] || []), newMsg]
    };
    setPersonalChats(updated);
    setPersonalMessage('');

    // Instant Teacher AI Reply
    setIsAiReplyingPersonal(true);
    try {
      const activeContactObj = contacts.find(c => c.id === selectedContact);
      const teacherTitle = activeContactObj ? activeContactObj.nameBn : 'সম্মানিত শিক্ষক';

      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `You are playing the role of ${teacherTitle}. Write a brief, encouraging, professional private response to the student's personal message: "${myMsgText}"`,
          gradeLevel: 'Student Private Chat',
          type: 'lesson',
          language: lang,
        }),
      });

      const data = await response.json();
      const replyText = data.lesson || (isBn ? 'আপনার বার্তাটি পেয়েছি, ধন্যবাদ!' : 'Received your message, thanks!');

      setPersonalChats(prev => ({
        ...prev,
        [selectedContact]: [
          ...(prev[selectedContact] || []),
          {
            id: (Date.now() + 1).toString(),
            sender: teacherTitle,
            text: replyText,
            time: 'এইমাত্র',
            isMe: false
          }
        ]
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiReplyingPersonal(false);
    }
  };

  // Sample Notices
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      teacherName: 'মোঃ রফিকুল ইসলাম (আইসিটি শিক্ষক)',
      subject: 'এইচএসসি আইসিটি ও প্রোগ্রামিং',
      title: 'আগামী রবিবারের বিশেষ আইসিটি প্র্যাকটিক্যাল ও পাইথন ক্লাসের নোটিশ',
      content: 'প্রিয় শিক্ষার্থীবৃন্দ, আগামী রবিবার সকাল ১০টায় আমাদের আইসিটি ল্যাবে পাইথন ভেরিয়েবল ও লুপ নিয়ে স্পেশাল ক্লাস হবে। সবাই মাটি এআই এর কোডিং টিউটর মডিউলটি রিভিশন দিয়ে আসবে।',
      date: 'আজ, সকাল ৯:৩০',
      pinned: true
    },
    {
      id: '2',
      teacherName: 'ড. ফারহানা আক্তার (বিজ্ঞান শিক্ষিকা)',
      subject: 'পদার্থবিজ্ঞান ও মহাকাশ বিজ্ঞান',
      title: 'বিজ্ঞান মেলা ২০২৬ এর প্রজেক্ট সাবমিশন',
      content: 'স্কুলের বার্ষিক বিজ্ঞান মেলায় অংশ নেওয়ার জন্য যারা রোবোটিক্স ও এআই ভিত্তিক প্রজেক্ট বানাতে চাও, তারা মাটি এআই এর STEM গবেষণা টুল ব্যবহার করে খসড়া জমা দাও।',
      date: 'গতকাল, বিকেল ৪:১৫'
    }
  ]);

  // Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeTeacher, setNewNoticeTeacher] = useState('সহকারী শিক্ষক');
  const [newNoticeSubject, setNewNoticeSubject] = useState('গণিত ও বিজ্ঞান');

  // Q&A Forum State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      studentName: 'সাকিব হাসান (দশম শ্রেণী)',
      grade: 'Class 10',
      question: 'স্যার, অ্যালগরিদম ও ফ্লোচার্টের মধ্যে মূল পার্থক্য কী? কোনটি আগে আঁকতে হয়?',
      teacherAnswer: 'অ্যালগরিদম হলো সমস্যা সমাধানের লিখিত ধাপ বা ইনস্ট্রাকশন, আর ফ্লোচার্ট হলো সেই ধাপগুলোর চিত্ররূপ (Diagram)। সাধারণত অ্যালগরিদম আগে লিখে নিয়ে তারপর ফ্লোচার্ট আঁকা হয়।',
      answeredBy: 'মোঃ রফিকুল ইসলাম (আইসিটি শিক্ষক)',
      likes: 12
    },
    {
      id: 'q2',
      studentName: 'তানজিলা রহমান (একাদশ শ্রেণী)',
      grade: 'HSC Candidate',
      question: 'ম্যাম, ফোটোসিন্থেসিস প্রক্রিয়ায় সূর্যালোক কীভাবে রাসায়নিক শক্তিতে রূপান্তরিত হয়?',
      teacherAnswer: 'ক্লোরোফিলের সাহায্যে সৌরশক্তিকে শোষণ করে এটি ATP এবং NADPH নামের রাসায়নিক শক্তিতে পরিণত করে। এটি উদ্ভিদের শর্করা তৈরি করে।',
      answeredBy: 'ড. ফারহানা আক্তার',
      likes: 8
    }
  ]);

  const [askStudentName, setAskStudentName] = useState('');
  const [askQuestion, setAskQuestion] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Add New Notice Handler
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    const newObj: Notice = {
      id: Date.now().toString(),
      teacherName: newNoticeTeacher || 'সম্মানিত শিক্ষক',
      subject: newNoticeSubject || 'সাধারণ বিষয়',
      title: newNoticeTitle,
      content: newNoticeContent,
      date: 'আজ, এইমাত্র',
      pinned: false
    };

    setNotices([newObj, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    alert(isBn ? 'নতুন ক্লাস নোটিশ সফলভাবে পোস্ট করা হয়েছে!' : 'Notice posted successfully!');
  };

  // Ask Question & Get Immediate AI Teacher Answer
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) return;

    setIsAskingAI(true);
    const qObj: Question = {
      id: Date.now().toString(),
      studentName: askStudentName || (isBn ? 'উদ্যমী শিক্ষার্থী' : 'Student'),
      grade: 'Class 9-12',
      question: askQuestion,
      likes: 1
    };

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: askQuestion,
          gradeLevel: 'School Student',
          type: 'lesson',
          language: lang,
        }),
      });

      const data = await response.json();
      qObj.teacherAnswer = data.lesson || (isBn ? 'শিক্ষক উত্তর প্রদান করছেন...' : 'Teacher is preparing answer...');
      qObj.answeredBy = isBn ? 'মাটি এআই ডিজিটাল শিক্ষক মেন্টর' : 'Mati AI Digital Teacher Mentor';

      setQuestions([qObj, ...questions]);
      setAskQuestion('');
      setAskStudentName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-white/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {isBn ? 'শিক্ষক ও শিক্ষার্থী কানেক্ট রুম' : 'Teacher & Student Connection Hub'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isBn
                ? 'শ্রেণীকক্ষের নোটিশ, সরাসরি প্রশ্ন-উত্তর, বাড়ির কাজ এবং শিক্ষক-শিক্ষার্থী মুক্ত আলোচনার ডিজিটাল হাব'
                : 'Digital Classroom Noticeboard, Instant Q&A Forum, and Teacher Mentorship Portal'}
            </p>
          </div>
        </div>

        {/* Subtabs - Both Group, Personal and National Showcase Options */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#1A1D24] rounded-xl border border-[#2D3139] overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('showcase')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'showcase'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{isBn ? '১. 🌟 জাতীয় কৃতি ও অনুপ্রেরণা ওয়াল' : '1. National Showcase'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('group')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'group'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? '২. গ্রুপ স্টাডি রুম (যৌথ)' : '2. Group Study Chat'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('personal')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'personal'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <span>{isBn ? '৩. ১-অন-১ পার্সোনাল মেসেজ' : '3. Personal Chat'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notice')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'notice'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? '৪. ক্লাস নোটিশ বোর্ড' : '4. Class Notices'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('qa')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'qa'
                ? 'bg-teal-700 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-teal-300" />
            <span>{isBn ? '৫. শিক্ষক Q&A ফোরাম' : '5. Teacher Q&A'}</span>
          </button>
        </div>
      </div>

      {/* SUBTAB: NATIONAL STUDENT SHOWCASE WALL (সারাদেশের শিক্ষার্থীদের কৃতি ও অনুপ্রেরণা ওয়াল) */}
      {activeSubTab === 'showcase' && (
        <div className="space-y-6">
          
          {/* Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-cyan-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded-full border border-amber-500/30">
                  {isBn ? 'জাতীয় শিক্ষার্থী অনুপ্রেরণা গ্যালাক্সি' : 'National Youth Showcase'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isBn ? 'সারাদেশের শিক্ষার্থীদের বিশেষ উদ্ভাবন, মেডেল ও প্রেরণার গল্প' : 'National Showcase of Youth Achievements & Inspirations'}
              </h3>
              <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                {isBn
                  ? 'টেকনাফ থেকে তেঁতুলিয়া—বাংলাদেশের যেকোনো শিক্ষার্থী তাদের বিজ্ঞান প্রজেক্ট, সফটওয়্যার, আর্ট, স্পোর্টস বা অলিম্পিয়াডের অর্জন এখানে শেয়ার করে অন্যান্য সহপাঠীদের অনুপ্রাণিত করতে পারে!'
                  : 'Share your school projects, science innovations, sports awards, and inspire students across Bangladesh!'}
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center space-x-2 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-amber-100" />
              <span>{isBn ? 'আপনার অর্জন আপলোড করুন' : 'Upload Your Achievement'}</span>
            </button>
          </div>

          {/* Division & Category Filter Controls */}
          <div className="p-4 bg-[#0A0C10] border border-[#1F2937] rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <Filter className="w-4 h-4" />
              <span>{isBn ? 'বিভাগ ও ক্যাটাগরি ফিল্টার করুন:' : 'Filter Division & Category:'}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Division Filter */}
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">{isBn ? 'সকল বিভাগ / জেলা (All Bangladesh)' : 'All Divisions'}</option>
                <option value="ঢাকা">ঢাকা বিভাগ</option>
                <option value="চট্টগ্রাম">চট্টগ্রাম বিভাগ</option>
                <option value="রাজশাহী">রাজশাহী বিভাগ</option>
                <option value="খুলনা">খুলনা বিভাগ</option>
                <option value="সিলেট">সিলেট বিভাগ</option>
                <option value="বরিশাল">বরিশাল বিভাগ</option>
                <option value="রংপুর">রংপুর বিভাগ</option>
                <option value="ময়মনসিংহ">ময়মনসিংহ বিভাগ</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">{isBn ? 'সকল বিষয় / বিষয়শ্রেণী (All Categories)' : 'All Categories'}</option>
                <option value="science">🤖 বিজ্ঞান ও টেকনোলজি (Science)</option>
                <option value="coding">💻 কোডিং ও সফটওয়্যার (Coding & Apps)</option>
                <option value="art">🎨 চিত্রাঙ্কন ও শিল্পকর্ম (Art & Craft)</option>
                <option value="sports">🏆 খেলাধুলা ও ফিটনেস (Sports)</option>
                <option value="math">📐 গণিত ও অলিম্পিয়াড (Math Olympiad)</option>
                <option value="social">🌿 সামাজিক কাজ ও নেতৃত্ব (Social Work)</option>
              </select>
            </div>
          </div>

          {/* Achievements Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {achievements
              .filter(item => (filterDivision === 'all' || item.division === filterDivision))
              .filter(item => (filterCategory === 'all' || item.category === filterCategory))
              .map((post) => (
                <div
                  key={post.id}
                  className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-4 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Student Info & Division Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#252A36] pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 text-white font-black text-sm flex items-center justify-center shadow">
                          {post.studentName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-none">{post.studentName}</h4>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {post.institution} • <span className="text-amber-400 font-bold">{post.grade}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                          📍 {post.division}
                        </span>
                        <span className="text-[10px] text-gray-500">{post.date}</span>
                      </div>
                    </div>

                    {/* Title & Badge */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-md border border-emerald-500/30">
                          {post.categoryLabelBn}
                        </span>
                        <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-md border border-amber-500/30">
                          {post.badge}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-white leading-snug">{post.title}</h3>
                    </div>

                    {/* Optional Photo / Image */}
                    {post.imageUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-[#2A3142] max-h-48">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Inspiring Story */}
                    <div className="p-3 bg-[#0A0C10] rounded-xl border border-[#1F2533] space-y-1">
                      <p className="text-[11px] font-bold text-amber-400">💡 সহপাঠীদের জন্য প্রেরণার কথা:</p>
                      <p className="text-xs text-gray-300 leading-relaxed italic">"{post.story}"</p>
                    </div>
                  </div>

                  {/* Reactions & AI Certificate Button */}
                  <div className="pt-3 border-t border-[#252A36] space-y-2">
                    <div className="flex items-center justify-between text-xs gap-1">
                      <button
                        onClick={() => handleReaction(post.id, 'inspired')}
                        className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 text-[11px] font-bold ${
                          post.userReacted?.inspired
                            ? 'bg-pink-600/30 text-pink-300 border-pink-500'
                            : 'bg-[#1A1D24] text-gray-400 hover:text-pink-300 border-[#2D3139]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.userReacted?.inspired ? 'fill-pink-400 text-pink-400' : ''}`} />
                        <span>❤️ অনুপ্রাণিত ({post.inspiredCount})</span>
                      </button>

                      <button
                        onClick={() => handleReaction(post.id, 'awesome')}
                        className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 text-[11px] font-bold ${
                          post.userReacted?.awesome
                            ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                            : 'bg-[#1A1D24] text-gray-400 hover:text-amber-300 border-[#2D3139]'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${post.userReacted?.awesome ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>🔥 অসাধারণ ({post.awesomeCount})</span>
                      </button>

                      <button
                        onClick={() => handleReaction(post.id, 'salute')}
                        className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 text-[11px] font-bold ${
                          post.userReacted?.salute
                            ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                            : 'bg-[#1A1D24] text-gray-400 hover:text-emerald-300 border-[#2D3139]'
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>👏 অভিনন্দন ({post.saluteCount})</span>
                      </button>
                    </div>

                    {/* AI Citation Certificate Trigger */}
                    <button
                      onClick={() => handleGenerateCertificate(post)}
                      className="w-full py-1.5 bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-900/60 hover:to-blue-900/60 text-purple-200 border border-purple-500/30 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>{isBn ? 'এআই অভিনন্দন সাইটেশন তৈরি করুন' : 'Generate AI Citation'}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* UPLOAD MODAL */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0F1117] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{isBn ? 'আপনার বিশেষ কৃতি বা উদ্ভাবন আপলোড করুন' : 'Upload Your Achievement Post'}</span>
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 hover:bg-[#1F2533] rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadAchievement} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'কৃতি/প্রজেক্টের শিরোনাম (Title):' : 'Title:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={isBn ? 'যেমন: সৌরশক্তি চালিত রোবট তৈরি করেছি...' : 'e.g., Created Solar Powered Robot...'}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'আপনার নাম:' : 'Your Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder={isBn ? 'যেমন: সাকিব আহসান' : 'e.g., Sakib Ahsan'}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'শ্রেণী / গ্রেড:' : 'Grade:'}
                      </label>
                      <input
                        type="text"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        placeholder={isBn ? 'যেমন: ১০ম শ্রেণী' : 'Grade 10'}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'স্কুল / কলেজের নাম:' : 'Institution:'}
                      </label>
                      <input
                        type="text"
                        value={newInstitution}
                        onChange={(e) => setNewInstitution(e.target.value)}
                        placeholder={isBn ? 'যেমন: রাজশাহী জিলা স্কুল' : 'e.g., Rajshahi Zilla School'}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'বিভাগ / জেলা:' : 'Division:'}
                      </label>
                      <select
                        value={newDivision}
                        onChange={(e) => setNewDivision(e.target.value)}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="ঢাকা">ঢাকা বিভাগ</option>
                        <option value="চট্টগ্রাম">চট্টগ্রাম বিভাগ</option>
                        <option value="রাজশাহী">রাজশাহী বিভাগ</option>
                        <option value="খুলনা">খুলনা বিভাগ</option>
                        <option value="সিলেট">সিলেট বিভাগ</option>
                        <option value="বরিশাল">বরিশাল বিভাগ</option>
                        <option value="রংপুর">রংপুর বিভাগ</option>
                        <option value="ময়মনসিংহ">ময়মনসিংহ বিভাগ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'বিষয়শ্রেণী (Category):' : 'Category:'}
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="science">🤖 বিজ্ঞান ও টেকনোলজি</option>
                        <option value="coding">💻 কোডিং ও সফটওয়্যার</option>
                        <option value="art">🎨 চিত্রাঙ্কন ও শিল্পকর্ম</option>
                        <option value="sports">🏆 খেলাধুলা ও ফিটনেস</option>
                        <option value="math">📐 গণিত ও অলিম্পিয়াড</option>
                        <option value="social">🌿 সামাজিক কাজ ও নেতৃত্ব</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">
                        {isBn ? 'মেডেল বা ব্যাজ (Badge):' : 'Badge:'}
                      </label>
                      <input
                        type="text"
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        placeholder={isBn ? 'যেমন: 🥇 ১ম স্থান (বিজ্ঞান মেলা)' : '1st Prize'}
                        className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'প্রজেক্টের ছবি ইউআরএল (ঐচ্ছিক Image URL):' : 'Image URL (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      {isBn ? 'প্রেরণার গল্প ও অন্যান্যদের জন্য পরামর্শ:' : 'Inspiring Story & Advice:'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newStory}
                      onChange={(e) => setNewStory(e.target.value)}
                      placeholder={isBn ? 'কীভাবে এই কাজ করলেন এবং অন্যান্য শিক্ষার্থীদের উৎসাহিত করতে আপনার অভিজ্ঞতা লিখুন...' : 'Describe how you built this and tips for peers...'}
                      className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 bg-[#1A1D24] text-gray-300 text-xs font-bold rounded-xl border border-[#2D3139]"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
                    >
                      <Trophy className="w-4 h-4 text-amber-100" />
                      <span>{isBn ? 'সারাদেশে প্রকাশ করুন' : 'Publish Nationally'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI CITATION CERTIFICATE MODAL */}
          {selectedCertificatePost && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0F1117] border border-purple-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setSelectedCertificatePost(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-[#1F2533] rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-amber-500 to-red-500 mx-auto flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {isBn ? 'জাতীয় কৃতি শিক্ষার্থী বিশেষ অভিনন্দন সনদ' : 'National Citation of Honor'}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">
                    {selectedCertificatePost.studentName} • {selectedCertificatePost.institution} ({selectedCertificatePost.division})
                  </p>
                </div>

                <div className="p-4 bg-[#07090D] border border-purple-500/30 rounded-xl space-y-3">
                  {isGeneratingCertificate ? (
                    <div className="py-8 text-center text-xs text-purple-300 animate-pulse space-y-2">
                      <Sparkles className="w-6 h-6 mx-auto animate-spin text-purple-400" />
                      <p>{isBn ? 'মাটি এআই অভিনন্দন সাইটেশন লিখছে...' : 'Generating AI Certificate Citation...'}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-200 leading-relaxed italic whitespace-pre-wrap">
                      "{generatedCertificateText}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'মাটি এআই উইং দ্বারা সত্যায়িত' : 'Verified by MATI AI'}</span>
                  </span>
                  <button
                    onClick={() => setSelectedCertificatePost(null)}
                    className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    {isBn ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB: GROUP STUDY CHAT (যৌথ যোগাযোগ) */}
      {activeSubTab === 'group' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Group Channel List */}
          <div className="bg-[#0A0C10] p-4 rounded-2xl border border-[#1F2937] space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{isBn ? 'সাবজেক্ট ও স্টাডি গ্রুপসমূহ:' : 'Subject Study Groups:'}</span>
            </h3>

            <div className="space-y-2">
              {groupChannels.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedGroup === group.id
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md'
                      : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:bg-[#1A1E27]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">{group.icon}</span>
                    <div>
                      <p className="text-xs font-bold">{isBn ? group.nameBn : group.nameEn}</p>
                      <p className="text-[10px] text-gray-400">{group.members} {isBn ? 'জন সদস্য সক্রিয়' : 'Members'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Chat Messages Box */}
          <div className="md:col-span-2 bg-[#0A0C10] p-4 rounded-2xl border border-[#1F2937] flex flex-col justify-between h-[420px]">
            {/* Header */}
            <div className="pb-3 border-b border-[#1F2937] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>{groupChannels.find(g => g.id === selectedGroup)?.icon}</span>
                  <span>{isBn ? groupChannels.find(g => g.id === selectedGroup)?.nameBn : groupChannels.find(g => g.id === selectedGroup)?.nameEn}</span>
                </h4>
                <p className="text-[11px] text-emerald-400 mt-0.5">
                  {isBn ? 'যৌথ গ্রুপ ডিসকাশন প্যানেল • শিক্ষক ও শিক্ষার্থীরা একত্রে যুক্ত' : 'Group Discussion Panel'}
                </p>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2 scrollbar-thin">
              {(groupMessages[selectedGroup] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-[85%] text-xs space-y-1 ${
                    msg.role === 'teacher'
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-100 ml-auto'
                      : 'bg-[#13161C] border border-[#252A36] text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400">
                    <span className={`font-bold ${msg.role === 'teacher' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {msg.sender}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendGroupMessage} className="pt-2 flex gap-2 border-t border-[#1F2937]">
              <input
                type="text"
                value={groupMessage}
                onChange={(e) => setGroupMessage(e.target.value)}
                placeholder={isBn ? 'গ্রুপে আপনার মতামত বা প্রশ্ন লিখুন...' : 'Type your group message...'}
                className="flex-1 bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'পাঠান' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB: PERSONAL 1-ON-1 DIRECT CHAT (পার্সোনাল মেসেজ) */}
      {activeSubTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Contacts List */}
          <div className="bg-[#0A0C10] p-4 rounded-2xl border border-[#1F2937] space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>{isBn ? '১-অন-১ প্রাইভেট কন্টাক্টস:' : '1-on-1 Direct Contacts:'}</span>
            </h3>

            <div className="space-y-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedContact === contact.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md'
                      : 'bg-[#13161C] border-[#252A36] text-gray-300 hover:bg-[#1A1E27]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{contact.avatar}</span>
                    <div>
                      <p className="text-xs font-bold">{contact.nameBn}</p>
                      <p className="text-[10px] text-cyan-400">{contact.roleBn}</p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${contact.status === 'online' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Personal Chat Box */}
          <div className="md:col-span-2 bg-[#0A0C10] p-4 rounded-2xl border border-[#1F2937] flex flex-col justify-between h-[420px]">
            {/* Active Contact Header */}
            <div className="pb-3 border-b border-[#1F2937] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{contacts.find(c => c.id === selectedContact)?.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {contacts.find(c => c.id === selectedContact)?.nameBn}
                  </h4>
                  <p className="text-[11px] text-emerald-400">
                    {isBn ? '🔒 শতভাগ গোপনীয় ১-অন-১ পার্সোনাল প্রাইভেট মেসেজিং' : 'Private 1-on-1 Direct Chat'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2 scrollbar-thin">
              {(personalChats[selectedContact] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-[80%] text-xs space-y-1 ${
                    msg.isMe
                      ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-100 ml-auto'
                      : 'bg-[#13161C] border border-[#252A36] text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400">
                    <span className={`font-bold ${msg.isMe ? 'text-cyan-300' : 'text-emerald-400'}`}>
                      {msg.sender}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}

              {isAiReplyingPersonal && (
                <div className="p-3 rounded-xl bg-[#13161C] border border-cyan-500/30 text-xs text-cyan-300 animate-pulse w-fit">
                  {isBn ? 'শিক্ষক উত্তর টাইপ করছেন...' : 'Teacher is typing...'}
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendPersonalMessage} className="pt-2 flex gap-2 border-t border-[#1F2937]">
              <input
                type="text"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder={isBn ? 'শিক্ষক বা সহপাঠীকে প্রাইভেট মেসেজ লিখুন...' : 'Type private message...'}
                className="flex-1 bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isAiReplyingPersonal || !personalMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'পাঠান' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 1: CLASS NOTICEBOARD */}
      {activeSubTab === 'notice' && (
        <div className="space-y-6">
          
          {/* Post New Notice (For Teachers & Class Captains) */}
          <div className="bg-[#0A0C10] p-5 rounded-xl border border-[#1F2937] space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'শিক্ষক বা ক্লাস ক্যাপ্টেন নতুন নোটিশ প্রকাশ করুন:' : 'Publish New Classroom Notice:'}</span>
            </h3>

            <form onSubmit={handleAddNotice} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newNoticeTeacher}
                  onChange={(e) => setNewNoticeTeacher(e.target.value)}
                  placeholder={isBn ? 'শিক্ষকের নাম / নাম প্রস্তাবনা' : 'Teacher Name'}
                  className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={newNoticeSubject}
                  onChange={(e) => setNewNoticeSubject(e.target.value)}
                  placeholder={isBn ? 'বিষয় (যেমন: আইসিটি, গণিত, বিজ্ঞান)' : 'Subject'}
                  className="bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <input
                type="text"
                value={newNoticeTitle}
                onChange={(e) => setNewNoticeTitle(e.target.value)}
                placeholder={isBn ? 'নোটিশের শিরোনাম (Title)' : 'Notice Title'}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <textarea
                value={newNoticeContent}
                onChange={(e) => setNewNoticeContent(e.target.value)}
                rows={2}
                placeholder={isBn ? 'নোটিশের বিস্তারিত বার্তা লিখুন...' : 'Write notice message...'}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isBn ? 'নোটিশ পোস্ট করুন' : 'Post Notice'}</span>
              </button>
            </form>
          </div>

          {/* List of Notices */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'সাম্প্রতিক ক্লাস নোটিশসমূহ:' : 'Recent Class Announcements:'}</span>
            </h3>

            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-3 relative hover:border-emerald-500/40 transition-all shadow-md"
              >
                {notice.pinned && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
                    <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{isBn ? 'পিন করা বার্তা' : 'Pinned Notice'}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-md">
                    {notice.subject}
                  </span>
                  <span className="text-[11px] text-gray-400">• {notice.date}</span>
                </div>

                <h4 className="text-base font-bold text-white pr-20">{notice.title}</h4>

                <p className="text-xs text-gray-300 leading-relaxed bg-[#0A0C10] p-3.5 rounded-xl border border-[#1F2533]">
                  {notice.content}
                </p>

                <div className="flex items-center space-x-2 text-xs text-gray-400 pt-1">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">{notice.teacherName}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 2: ASK TEACHER (Q&A FORUM) */}
      {activeSubTab === 'qa' && (
        <div className="space-y-6">
          
          {/* Ask Question Form */}
          <div className="bg-[#0A0C10] p-5 rounded-xl border border-[#1F2937] space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>{isBn ? 'পড়ালেখায় যেকোনো সমস্যা? শিক্ষককে সরাসরি প্রশ্ন জিজ্ঞাসা করো:' : 'Stuck on a lesson? Ask your teacher or AI mentor:'}</span>
            </h3>

            <form onSubmit={handleAskQuestion} className="space-y-3">
              <input
                type="text"
                value={askStudentName}
                onChange={(e) => setAskStudentName(e.target.value)}
                placeholder={isBn ? 'তোমার নাম ও শ্রেণী (যেমন: রাইয়ান, দশম শ্রেণী)' : 'Your Name & Grade'}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />

              <textarea
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                rows={3}
                placeholder={isBn ? 'তোমার প্রশ্নটি এখানে স্পষ্টভাবে লিখো (যেমন: বীজগণিত বা আইসিটির যেকোনো জটিল নিয়ম)...' : 'Write your question clearly here...'}
                className="w-full bg-[#13161C] border border-[#2D3139] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />

              <button
                type="submit"
                disabled={isAskingAI || !askQuestion.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center space-x-2"
              >
                {isAskingAI ? (
                  <span>{isBn ? 'শিক্ষক উত্তর প্রস্তুত করছেন...' : 'Getting Teacher Answer...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isBn ? 'প্রশ্ন জমা দাও ও উত্তর নাও' : 'Submit Question'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of Questions & Answers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>{isBn ? 'শিক্ষার্থীদের প্রশ্ন ও শিক্ষকের সমাধান:' : 'Questions & Teacher Solutions:'}</span>
            </h3>

            {questions.map((q) => (
              <div key={q.id} className="p-5 bg-[#13161C] border border-[#252A36] rounded-2xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-300">{q.studentName}</span>
                  <span className="text-gray-400 bg-[#1F2533] px-2 py-0.5 rounded text-[10px]">{q.grade}</span>
                </div>

                <p className="text-sm font-bold text-gray-100">{q.question}</p>

                {/* Teacher Answer Box */}
                {q.teacherAnswer && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>{q.answeredBy}</span>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {q.teacherAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
