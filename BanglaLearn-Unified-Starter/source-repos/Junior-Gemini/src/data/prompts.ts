import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'ict-hsc',
    title: 'HSC ICT Chapter Explanation',
    titleBn: 'এইচএসসি আইসিটি বিষয় সহজ ব্যাখ্যা',
    category: 'learning',
    prompt: 'Explain the concept of Web Page Design and HTML structure for an HSC ICT student in Bangladesh in clear Bengali.',
    promptBn: 'এইচএসসি আইসিটি বইয়ের এইচটিএমএল (HTML) এবং ওয়েবসাইট ডিজাইনের ধারণাটি সহজ বাংলায় বুঝিয়ে দাও।',
    iconName: 'BookOpen'
  },
  {
    id: 'python-basics',
    title: 'Python for Beginners',
    titleBn: 'নতুনদের জন্য পাইথন শিক্ষা',
    category: 'coding',
    prompt: 'Teach me Python variables, loops, and functions with simple real-life analogies and code examples.',
    promptBn: 'বাস্তব জীবনের সুন্দর উদাহরণ দিয়ে পাইথন ভেরিয়েবল, লুপ এবং ফাংশন সহজ ভাষায় কোডসহ শিখিয়ে দাও।',
    iconName: 'Code'
  },
  {
    id: 'math-help',
    title: 'Algebra & Geometry Solver',
    titleBn: 'বীজগণিত ও জ্যামিতি সমাধান',
    category: 'math',
    prompt: 'How do quadratic equations work? Show step-by-step formula and a worked example.',
    promptBn: 'দ্বিঘাত সমীকরণ (Quadratic Equation) কিভাবে সমাধান করতে হয়? ধাপ অনুসারে সূত্র ও উদাহরণ বুঝিয়ে দাও।',
    iconName: 'Calculator'
  },
  {
    id: 'english-grammar',
    title: 'English Speaking & Grammar',
    titleBn: 'ইংরেজি ব্যাকরণ ও কথা বলা',
    category: 'english',
    prompt: 'Help me practice English present perfect and past simple tense with 5 practice sentences in Bengali & English.',
    promptBn: 'বাংলা এবং ইংরেজি অনুবাদসহ ৫টি বাক্যে Present Perfect এবং Past Simple tense-এর পার্থক্য বুঝিয়ে দাও।',
    iconName: 'Languages'
  },
  {
    id: 'agri-tech',
    title: 'Agricultural Tech & AI',
    titleBn: 'কৃষি প্রযুক্তি ও এআই পরামর্শ',
    category: 'practical',
    prompt: 'How can small farmers in Bangladesh use mobile apps and AI for soil testing and weather alerts?',
    promptBn: 'বাংলাদেশের প্রান্তিক কৃষকরা কীভাবে মোবাইল অ্যাপ ও কৃত্রিম বুদ্ধিমত্তা ব্যবহার করে ফসলের রোগ নির্ণয় করতে পারেন?',
    iconName: 'Sprout'
  },
  {
    id: 'resume-maker',
    title: 'Student Resume & CV Builder',
    titleBn: 'শিক্ষার্থী সিভি ও কভার লেটার',
    category: 'practical',
    prompt: 'Draft a clean student resume template for a recent high school or college graduate in Bangladesh applying for computer internships.',
    promptBn: 'কম্পিউটার বা আইটি ইন্টার্নশিপের জন্য একজন তরুণের জন্য সুন্দর মানসম্মত সিভি (Resume) ফরমেট তৈরি করে দাও।',
    iconName: 'FileText'
  },
  {
    id: 'app-patent-guide',
    title: 'App Patentability & Copyright Advisor',
    titleBn: 'অ্যাপ প্যাটেন্ট ও কপিরাইট নির্দেশিকা',
    category: 'legal',
    prompt: 'Explain step-by-step how an app developer in Bangladesh can determine ownership, apply for software patents, register trademarks, and draft NDAs with freelancers.',
    promptBn: 'একজন অ্যাপ বা ওয়েভ ডেভেলপার কীভাবে তার কোডের কপিরাইট, ট্রেডমার্ক এবং প্যাটেন্ট সুরক্ষা পাবেন? ফ্রিল্যান্সার দিয়ে কাজ করালে ওনারশিপ বা স্বত্বাধিকার নেওয়ার সঠিক নিয়মগুলো বাংলায় ধাপে ধাপে বুঝিয়ে দাও।',
    iconName: 'Scale'
  },
  {
    id: 'tos-privacy-checker',
    title: 'Terms of Service & Privacy Checklist',
    titleBn: 'টার্মস ও প্রাইভেসি পলিসি প্রস্তুত গাইড',
    category: 'legal',
    prompt: 'What are the essential sections every software Terms of Service and Privacy Policy must include to comply with Bangladesh Digital Security Act and global standards?',
    promptBn: 'যেকোনো ওয়েবসাইট বা মোবাইল অ্যাপের জন্য ব্যবহারকারীর শর্তাবলী (Terms of Service) ও গোপনীয়তা নীতি (Privacy Policy)-তে কী কী আইনি নিয়ম অন্তর্ভুক্ত করা বাধ্যতামূলক?',
    iconName: 'FileCheck'
  }
];
