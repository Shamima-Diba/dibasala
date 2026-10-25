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
  }
];
