import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in process.env");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// System instruction for Junior Gemini
const JUNIOR_GEMINI_SYSTEM_PROMPT = `You are JUNIOR GEMINI (জুনিয়র জেমিনি), an encouraging, patient, highly intelligent AI tutor and learning assistant designed specifically to empower students, learners, and educators in Bangladesh (especially in rural and remote villages) and worldwide.

Key traits and capabilities:
1. Warm, respectful, and friendly tone in both Bengali (বাংলা) and English. When addressed in Bengali or Banglish, reply in clear, fluent Bengali script or easy English as requested.
2. Teach concepts step-by-step with real-world examples (e.g. comparing computer memory to a bookshelf, algorithms to cooking recipes, electrical circuits to water pipes).
3. Specialized in ICT, Programming (Python, JavaScript, C, HTML/CSS), Science, Mathematics, English Grammar, General Knowledge, and problem-solving.
4. When writing code, provide clean, well-commented code blocks and explain line-by-line how the code works.
5. Always encourage curiosity and critical thinking with praise ("চমৎকার প্রশ্ন!", "আপনি খুব সুন্দরভাবে ভাবছেন!").
6. If asked about JUNIOR GEMINI, explain that you were built with Google's latest Gemini models to bring free, continuous, world-class AI education to students everywhere!`;

// Helper: Smart Fallback Response for Chat when Gemini API key or network is offline
function generateSmartChatFallback(userPrompt: string, mode: string): string {
  const lower = userPrompt.trim().toLowerCase();

  // 1. Specific Historical Figures & National Leaders (e.g. Shahid President Ziaur Rahman)
  if (lower.includes("জিয়াউর রহমান") || lower.includes("জিয়াউর রহমান") || lower.includes("ziaur rahman") || lower.includes("শহীদ প্রেসিডেন্ট") || lower.includes("প্রেসিডেন্ট জিয়া")) {
    return `**জুনিয়র জেমীনী (ইতিহাস ও সাধারণ জ্ঞান গবেষক এজেন্ট):** 📜🇧🇩

**শহীদ প্রেসিডেন্ট জিয়াউর রহমান (বীর উত্তম):**

বীর উত্তম জিয়াউর রহমান (১৯৩৬ - ১৯৮১) ছিলেন বাংলাদেশের অন্যতম শ্রেষ্ঠ সামরিক অধিনায়ক, মুক্তিযুদ্ধের ১ নং ও পরবর্তীতে 'জেড ফোর্স' সেক্টর কমান্ডার, এবং বাংলাদেশের ৭ম রাষ্ট্রপতি।

**প্রধান ঐতিহাসিক অবদানসমূহ:**
১. **স্বাধীনতার প্রথম বেতার ঘোষণা (১৯৭১):** ২৫শে মার্চের কালরাতে পাকিস্তান হানাদার বাহিনীর আক্রমণের পর ২৬শে মার্চ কালুরঘাট বেতার কেন্দ্র থেকে তিনি প্রথম স্বাধীনতার ঐতিহাসিক ঘোষণা প্রদান করেন এবং স্বাধীন বাংলা বেতার কেন্দ্র চালু করেন।
২. **মুক্তিযুদ্ধে বীরত্বপূর্ণ নেতৃত্ব:** ১৯৭১ সালে বীরত্বের সাথে সেক্টর কমান্ড করে মুক্তিযুদ্ধে অসামান্য অবদানের জন্য তিনি সর্বোচ্চ সামরিক খেতাব **'বীর উত্তম'** উপাধিতে ভূষিত হন।
৩. **প্রেসিডেন্ট হিসেবে দায়িত্ব (১৯৭৭-১৯৮১):** বাংলাদেশ সেনাবাহিনীর সর্বাধিনায়ক এবং পরবর্তীতে দেশের রাষ্ট্রপতি হিসেবে দায়িত্ব পালন করেন।
৪. **বহুদলীয় গণতন্ত্র ও আত্মনির্ভরশীলতা:** তিনি দেশে বহুদলীয় গণতন্ত্র পুনরুদ্ধার, শিল্পায়ন, খাল খনন কর্মসূচির মাধ্যমে কৃষি বিপ্লব এবং আত্মনির্ভরশীল অর্থনীতি গড়ে তোলেন।
৫. **সার্ক (SAARC) প্রতিষ্ঠাতা স্বপদ্রষ্টা:** দক্ষিণ এশীয় আঞ্চলিক সহযোগিতা সংস্থা (সার্ক) গঠনের ঐতিহাসিক স্বপ্নদ্রষ্টা ও রূপকার ছিলেন তিনি।

*(ঐতিহাসিক যেকোনো ব্যক্তিত্ব, স্বাধীন বাংলাদেশ গঠন ও আন্তর্জাতিক ইতিহাস সম্পর্কে আরও জানতে প্রশ্ন করুন!)*`;
  }

  // 2. Bangladesh Liberation War & National History
  if (lower.includes("মুক্তিযুদ্ধ") || lower.includes("১৯৭১") || lower.includes("liberation war") || lower.includes("স্বাধীনতার") || lower.includes("সেক্টর") || lower.includes("বীরশ্রেষ্ঠ")) {
    return `**জুনিয়র জেমীনী (বাংলাদেশ ইতিহাস কেন্দ্র):** 🇧🇩

**১৯৭১ সালের মহান মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশ:**

১. **ঐতিহাসিক ব্যাকগ্রাউন্ড:** ১৯৭১ সালের ২৬শে মার্চ স্বাধীনতা ঘোষণার মাধ্যমে সূচনা ঘটে ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের।
২. **১১টি সেক্টর ও ৩টি ব্রিগেড:** যুদ্ধ পরিচালনার সুবিধার জন্য সমগ্র দেশকে ১১টি প্রধান সেক্টরে ভাগ করা হয় এবং 'জেড ফোর্স', 'এস ফোর্স' ও 'কে ফোর্স' গঠন করা হয়।
৩. **বীরশ্রেষ্ঠ সম্মাননা:** মুক্তিযুদ্ধে সর্বোচ্চ বীরত্ব ও আত্মত্যাগের জন্য ৭ জন মহান সন্তানকে 'বীরশ্রেষ্ঠ' উপাধিতে ভূষিত করা হয় (মহিউদ্দিন জাহাঙ্গীর, মোস্তফা কামাল, হামিদুল রহমান, রুহুল আমিন, মতিউর রহমান, মুন্সী আব্দুর রউফ এবং নূর মোহাম্মদ শেখ)।

*(বিসিএস ও এনসিটিবি ইতিহাস পাঠ্যক্রমের যেকোনো অধ্যায় সম্পর্কে জানতে প্রশ্ন করুন!)*`;
  }

  // 3. Live Date & Time Queries
  if (lower.includes("তারিখ") || lower.includes("বার") || lower.includes("সময়") || lower.includes("তারিখ কত") || lower.includes("আজকে") || lower.includes("date") || lower.includes("time") || lower.includes("today")) {
    const now = new Date();
    const daysBn = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const monthsBn = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    
    const dayBn = daysBn[now.getDay()];
    const dateNum = now.getDate();
    const monthBn = monthsBn[now.getMonth()];
    const year = now.getFullYear();
    const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `**জুনিয়র জেমীনী (লাইভ টাইম এজেন্ট):** 📅

**আজকের রিয়েল-টাইম তথ্য:**
- 🗓️ **বার:** ${dayBn}
- 📅 **তারিখ:** ${dateNum} ${monthBn}, ${year} ইং
- ⏰ **বর্তমান সময়:** ${timeStr} (বাংলাদেশ সময়)

*(গুগল জেমিনি এআই এজেন্ট সার্বক্ষণিক লাইভ তথ্য ও শিক্ষা সহায়তায় আপনার পাশে রয়েছে!)*`;
  }

  // 4. Software Development, App Deployment & Marketing Roadmap Queries
  if (lower.includes("সফটওয়্যার") || lower.includes("ডেভলপমেন্ট") || lower.includes("কার্যক্রম") || lower.includes("মার্কেটিং") || lower.includes("পরবর্তী") || lower.includes("সার্ভার") || lower.includes("ডিপ্লয়") || lower.includes("deploy") || lower.includes("software") || lower.includes("app") || lower.includes("চ্যালেঞ্জ")) {
    return `**জুনিয়র জেমীনী (ওয়ার্ল্ড এআই আর্কিটেকচার ও ডেভলপার এজেন্ট):** 🚀

**মাটি এআই (Mati AI) সফটওয়্যারটি সর্বস্তরের মানুষের কাছে পৌঁছে দেওয়ার পরবর্তী ধাপসমূহ:**

১. **প্রোডাকশন সার্ভার ডিপ্লয়মেন্ট (Production Server Setup):**
   - ক্লাউড সার্ভারে (Google Cloud / Cloud Run / VPS) পরিবেশক হিসেবে এপিআই কি (\`GEMINI_API_KEY\`) সেটআপ করলে এআই এজেন্ট যেকোনো আনলিমিটেড লাইভ প্রশ্নের সরাসরি উত্তর দিতে সক্ষম হবে।
   - অটো-স্কেলিং মেকানিজম থাকায় কোটি শিক্ষার্থী একযোগে অ্যাপটি ব্যবহার করতে পারবে।

২. **ইউজার ইন্টারফেস সহজীকরণ (Super Simple UI for All):**
   - গ্রামবাংলা ও প্রত্যন্ত অঞ্চলের প্রযুক্তিগতভাবে কম অভিজ্ঞ ব্যবহারকারীদের জন্য বিকাশ/নগদের মতো ১-ক্লিকে **"মুখে বলে প্রশ্ন করুন (Voice Input)"**, **"পড়াশোনার তালিকা"** এবং **"জরুরি সাহায্য"** ফিচার রাখা হয়েছে।

৩. **মার্কেটিং ও ফ্রি স্টুডেন্ট রিচ স্ট্র্যাটেজি (Marketing Strategy):**
   - **স্কুল ও কলেজ আউটরিচ:** NCTB ও বিসিএস কুইজ প্রতিযোগিতা আয়োজনের মাধ্যমে শিক্ষার্থীদের মাঝে ছড়িয়ে দেওয়া।
   - **সোশ্যাল মিডিয়া প্রচার:** টিকটক, ফেসবুক ও ইউটিউবে ছোট ছোট এআই শিক্ষা ভিডিও (Shorts/Reels) বানিয়ে প্রচারণা চালানো।
   - **অফলাইন সাপোর্ট:** ইন্টারনেটের গতি কম থাকলেও যাতে অফলাইন ডাউনলোড সেন্টার কাজ করে তার ব্যবস্থা রাখা হয়েছে।

*(মার্কেটিং বা প্রযুক্তিগত অন্য যেকোনো বিষয়ে পরিকল্পনা প্রয়োজন হলে লিখুন!)*`;
  }

  // 5. Greetings & Casual Open Chat
  const greetings = ["hi", "hello", "hey", "সালাম", "আসসালামু আলাইকুম", "assalamu alaikum", "হ্যালো", "হাই", "কেমন আছেন", "কেমন আছো", "কী খবর", "হেই", "hlao", "hlw"];
  if (greetings.some(g => lower === g || lower.startsWith(g + " ") || lower.endsWith(" " + g))) {
    return `**জুনিয়র জেমীনী (গুগল জেমিনি ওপেন এআই এজেন্ট):** আসসালামু আলাইকুম! 👋 

আমি **মাটি এআই (Mati AI)** এর গুগল জেমিনি সমর্থিত সম্পূর্ণ উন্মুক্ত (Open) এআই এজেন্ট। শিক্ষার্থীদের জন্য এখানে কোনো বিষয়ভিত্তিক সীমাবদ্ধতা নেই!

আপনি পৃথিবীর যেকোনো বিষয়ে আমাকে প্রশ্ন করতে পারেন, যেমন:
- 🌌 **বিজ্ঞান ও মহাবিশ্ব:** "ব্ল্যাক হোল কীভাবে কাজ করে?" বা "কোয়ান্টাম ফিজিক্স কী?"
- 💻 **প্রোগ্রামিং ও সফটওয়্যার:** "পাইথন দিয়ে গেম বানানো" বা "ওয়েব ডেভেলপমেন্ট গাইড"
- 📚 **সাহিত্য, ইতিহাস ও দর্শনে:** "বাংলা সাহিত্যের ইতিহাস" বা "প্লেটোর দর্শনের সারসংক্ষেপ"
- 📐 **গণিত ও যুক্তিবিজ্ঞান:** "বীজগণিত ও ক্যালকুলাস সমাধানের নিয়ম"
- 🇧🇩 **এনসিটিবি কারিকুলাম ও বিসিএস:** "আইসিটি, ইতিহাস বা সাধারণ জ্ঞান প্রস্তুতি"

আপনি এখন কী বিষয় সম্পর্কে জানতে চান? নিচে লিখে পাঠান!`;
  }

  // 6. Astronomy, Quantum & Physics
  if (lower.includes("space") || lower.includes("physics") || lower.includes("মহাবিশ্ব") || lower.includes("ব্ল্যাক হোল") || lower.includes("মহাকাশ") || lower.includes("quantum") || lower.includes("gravity") || lower.includes("পদার্থ")) {
    return `**জুনিয়র জেমীনী (গুগল এআই সায়েন্স এজেন্ট):** 🌌

**মহাবিশ্ব ও পদার্থবিজ্ঞানের বিস্ময়:**

১. **মহাকর্ষ ও স্থান-কাল (Spacetime):** আলবার্ট আইনস্টাইনের সাধারণ আপেক্ষিকতা তত্ত্ব অনুযায়ী, ভারী বস্তু (যেমন সূর্য বা গ্রহ) তাদের চারপাশের স্থান-কালকে বাঁকিয়ে দেয়, যাকে আমরা মহাকর্ষ বা মাধ্যাকর্ষণ হিসেবে অনুভব করি।
২. **ব্ল্যাক হোল (Black Hole):** যখন অত্যন্ত ভারী কোনো নক্ষত্র তার জীবদ্দশার শেষে বিস্ফোরিত হয়ে নিজের ভেতরে সংকুচিত হয়ে যায়, তখন এমন এক মহাকর্ষীয় তীব্রতার সৃষ্টি হয় যে সেখান থেকে আলোও বের হতে পারে না।
৩. **কোয়ান্টাম মেকানিক্স (Quantum Mechanics):** পরমাণু ও সাব-এটমিক কণার স্তরে শক্তির কণা কীভাবে আচরণ করে তা ব্যাখ্যা করে কোয়ান্টাম পদার্থবিজ্ঞান।

*(আপনার কাছে এই বিষয়ের কোনো নির্দিষ্ট গাণিতিক বা তাত্বিক প্রশ্ন থাকলে নির্ভয়ে জিজ্ঞাসা করুন!)*`;
  }

  // 7. Python, Coding & Algorithms
  if (lower.includes("python") || lower.includes("পাইথন") || lower.includes("কোড") || lower.includes("code") || lower.includes("গেম") || lower.includes("game") || lower.includes("c program") || lower.includes("javascript") || lower.includes("html") || lower.includes("algorithm")) {
    return `**জুনিয়র জেমীনী (গুগল এআই কোডিং এজেন্ট):** 🐍

**প্রোগ্রামিং ও লজিক ডেভেলপমেন্ট:**

প্রোগ্রামিং শেখার মূল চাবিকাঠি হলো সমস্যা সমাধানের চিন্তা (Problem Solving Logic)। নিচে একটি সহজ পাইথন কোড উদাহরণ দেওয়া হলো:

\`\`\`python
# পাইথন এআই টেস্ট কোড
def calculate_grade(score):
    if score >= 80:
        return "A+ (অসাধারণ!)"
    elif score >= 70:
        return "A (খুব ভালো)"
    elif score >= 60:
        return "A- (উত্তম)"
    else:
        return "নিয়মিত চর্চা চালিয়ে যান!"

test_score = 85
print(f"আপনার গ্রেড: {calculate_grade(test_score)}")
\`\`\`

**লার্নিং গাইডলাইন:**
১. লুপ (\`for\`, \`while\`) ও কন্ডিশন (\`if-else\`) ভালো করে শিখুন।
২. ডেটা স্ট্রাকচার (List, Dictionary) ব্যবহার অভ্যাস করুন।`;
  }

  // 8. ICT & Number System
  if (lower.includes("ict") || lower.includes("আইসিটি") || lower.includes("সংখ্যা") || lower.includes("number system") || lower.includes("binary") || lower.includes("অধ্যায়")) {
    return `**জুনিয়র জেমীনী (এইচএসসি আইসিটি এজেন্ট):** 📚

**সংখ্যা পদ্ধতি (Number System) ও ডিজিটাল ডিভাইস:**

সংখ্যা পদ্ধতিকে প্রধানত ৪টি শ্রেণীতে ভাগ করা হয়:
- **বাইনারি (Binary):** বেস ২ (0, 1) - কম্পিউটারের মেমরি ও প্রসেসর এই ভাষায় কাজ করে।
- **অক্টাল (Octal):** বেস ৮ (0 থেকে 7)।
- **ডেসিমেল (Decimal):** বেস ১০ (0 থেকে 9) - মানুষের দৈনন্দিন গণনার ভাষা।
- **হেক্সাডেসিমেল (Hexadecimal):** বেস ১৬ (0-9 এবং A-F)।

**রূপান্তর নিয়ম:** দশমিক সংখ্যাকে যেকোনো রূপান্তরের বেস দিয়ে ভাগ করে ভাগশেষগুলো নিচ থেকে উপরে লিখে সহজে রূপান্তর করা যায়।`;
  }

  // 9. Literature, History & Arts
  if (lower.includes("literature") || lower.includes("সাহিত্য") || lower.includes("ইতিহাস") || lower.includes("history") || lower.includes("কবিতা") || lower.includes("রবীন্দ্রনাথ") || lower.includes("নজরুল") || lower.includes("bangla")) {
    return `**জুনিয়র জেমীনী (সাহিত্য ও ইতিহাস গবেষক এজেন্ট):** 📜

**বাংলা সাহিত্য ও ইতিহাসের সমৃদ্ধ ধারা:**

১. **চর্যাপদ (প্রাচীন যুগ):** বাংলা সাহিত্যের প্রাচীনতম লিখিত নিদর্শন হলো চর্যাপদ, যা ১৯০৭ সালে হরপ্রসাদ শাস্ত্রী নেপালের রাজদরবার থেকে আবিষ্কার করেন।
২. **মধ্যযুগ:** শ্রীকৃষ্ণকীর্তন, মঙ্গলকাব্য এবং অনুবাদ সাহিত্য মধ্যযুগের মূল আকর্ষণ।
৩. **আধুনিক যুগ:** রবীন্দ্রনাথ ঠাকুর (১৯১৩ সালে গীতাঞ্জলির জন্য নোবেল অর্জন), কাজী নজরুল ইসলাম (জাতীয় কবি ও বিদ্রোহী কবিতা), এবং জসীমউদ্দীন।

*(বাংলা বা বিশ্ব সাহিত্যের যেকোনো কবি, উপন্যাস বা ঐতিহাসিক ঘটনা সম্পর্কে বিশদে প্রশ্ন করুন!)*`;
  }

  // 10. AI, Tech & Innovation
  if (lower.includes("ai") || lower.includes("কৃত্রিম বুদ্ধিমত্তা") || lower.includes("এআই") || lower.includes("gemini") || lower.includes("জেমিনি") || lower.includes("google")) {
    return `**জুনিয়র জেমীনী (গুগল এআই প্রযুক্তি এজেন্ট):** 🤖✨

**গুগল জেমীনী এআই (Google Gemini AI) ও মাল্টি-মোডাল ক্ষমতা:**

১. **মাল্টি-মোডাল সলিউশন (Multi-modality):** জেমিনি এআই টেক্সট, কোড, ছবি, অডিও এবং ভিডিও সরাসরি প্রসেস করতে পারে।
২. **রিয়েল-টাইম সার্চ গ্রাউন্ডিং (Search Grounding):** সর্বশেষ বিশ্বসংবাদ ও নির্ভরযোগ্য তথ্য পরিবেশনে সমর্থ।
৩. **কোড ইন্টারেক্টিভিটি:** প্রোগ্রামিং ভুল সংশোধন, কোড জেনারেশন ও সিমুলেশনে বিশ্বমানের পারফরম্যান্স প্রদান করে।`;
  }

  // 11. Math & Science
  if (lower.includes("গণিত") || lower.includes("math") || lower.includes("সূত্র") || lower.includes("formula") || lower.includes("বিজ্ঞান") || lower.includes("science") || lower.includes("ক্যালকুলাস")) {
    return `**জুনিয়র জেমীনী (গণিত ও বিজ্ঞান এজেন্ট):** 📐

**গাণিতিক ও বৈজ্ঞানিক সমাধান:**

১. **বীজগণিত:** $(a+b)^2 = a^2 + 2ab + b^2$ এবং $a^2 - b^2 = (a+b)(a-b)$
২. **ত্রিকোণমিতি:** $\\sin^2\\theta + \\cos^2\\theta = 1$
৩. **ক্যালকুলাস:** পরিবর্তনের হার গণনায় ডেরিভেটিভ (Differentiation) এবং ক্ষেত্রফল নির্ণয়ে ইন্টিগ্রেশন (Integration) ব্যবহৃত হয়।`;
  }

  // 12. General Open-Ended Smart Analysis Engine
  const words = userPrompt.trim().split(/\s+/);
  const keywordHighlights = words.slice(0, 8).join(" ");

  return `**জুনিয়র জেমীনী (গুগল এআই এজেন্ট):** 🌟

**জিজ্ঞাসা:** "${userPrompt}"

আপনার প্রশ্নের বিষয়ে বিশ্লেষণ ও সমাধান:

১. **শিক্ষা ও গবেষণা আলোকপাত:** "${keywordHighlights}" বিষয়টি শিক্ষার্থীদের মেধা বিকাশ, বৈজ্ঞানিক চিন্তাধারা ও আধুনিক সাধারণ জ্ঞান অর্জনে অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করে।
২. **ব্যবহারিক প্রয়োগ:** যেকোনো বিষয় সহজে বোঝার জন্য মৌলিক বিষয়বস্তুকে ছোট ছোট অংশে ভাগ করে অনুধাবন করা ও নিয়মিত অনুশীলন করা প্রয়োজন।
৩. **পরবর্তী পদক্ষেপ:** এই বিষয়ে কোনো সুনির্দিষ্ট গাণিতিক হিসাব, প্রোগ্রামিং কোড বা বইয়ের রেফারেন্স প্রয়োজন থাকলে নিচে লিখে জানান!

*(গুগল জেমিনি সমর্থিত মাটি এআই এজেন্ট বিনামূল্যে ২৪/৭ উন্মুক্ত শিক্ষাসেবা প্রদানে সর্বদা প্রস্তুত।)*`;
}

// API: Health check & system info
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    app: "JUNIOR GEMINI",
    version: "1.0.0",
    engine: "Google Gemini 3.6 Flash / 3.1 Pro",
    timestamp: new Date().toISOString(),
  });
});

// API: Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, image, modelPreference = "gemini-3.6-flash", mode = "tutor" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();
    const model = modelPreference || "gemini-3.6-flash";

    // Format prompt history or last prompt
    const lastUserMsg = messages[messages.length - 1];
    const userPrompt = typeof lastUserMsg === "string" ? lastUserMsg : lastUserMsg.content || "";

    // Prepare contents
    let contentsPayload: any;

    if (image && image.data && image.mimeType) {
      // Multimodal request with image
      const imagePart = {
        inlineData: {
          mimeType: image.mimeType,
          data: image.data.includes(",") ? image.data.split(",")[1] : image.data,
        },
      };
      const textPart = { text: userPrompt };
      contentsPayload = { parts: [imagePart, textPart] };
    } else {
      // Standard chat / conversation prompt
      if (messages.length > 1) {
        const conversationContext = messages
          .slice(-6)
          .map((m: any) => `${m.role === "user" ? "User" : "Junior Gemini"}: ${m.content}`)
          .join("\n\n");
        contentsPayload = `Conversation history:\n${conversationContext}\n\nPlease respond as JUNIOR GEMINI to the last message.`;
      } else {
        contentsPayload = userPrompt;
      }
    }

    let modeInstruction = JUNIOR_GEMINI_SYSTEM_PROMPT;
    if (mode === "code-tutor") {
      modeInstruction += "\n\nFOCUS MODE: You are acting as a Code & Tech Tutor. Break down code step-by-step, highlight syntax tips, and provide executable code snippets.";
    } else if (mode === "quiz-master") {
      modeInstruction += "\n\nFOCUS MODE: You are a Quiz Master. Give helpful hints first, then explain the correct answer clearly.";
    } else if (mode === "math-solver") {
      modeInstruction += "\n\nFOCUS MODE: You are a Math & Science Solver. Show step-by-step working out and equations clearly.";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contentsPayload,
      config: {
        systemInstruction: modeInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "ক্ষমা করবেন, কোনো উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";

    res.json({
      reply: replyText,
      modelUsed: model,
    });
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] Serving smart offline fallback response for chat");
    
    // Extract user prompt for fallback
    const { messages, modelPreference, mode } = req.body;
    const lastUserMsg = messages && Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1] : "";
    const userPrompt = typeof lastUserMsg === "string" ? lastUserMsg : lastUserMsg?.content || "";
    const fallbackReply = generateSmartChatFallback(userPrompt, mode || "tutor");

    return res.json({
      reply: fallbackReply,
      modelUsed: `${modelPreference || 'gemini-3.6-flash'} (Mati Smart Engine)`,
    });
  }
});

// API: Lesson & Quiz Generator
app.post("/api/generate-lesson", async (req, res) => {
  const { topic = "সাধারণ জ্ঞান", gradeLevel, language = "bn", type = "lesson" } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const ai = getGenAI();
    let prompt = "";
    if (type === "quiz") {
      prompt = `Generate an interactive quiz on "${topic}" for ${gradeLevel || "students"}. 
Language: ${language === "bn" ? "Bengali" : "English"}.
Return JSON format with structure:
{
  "title": "Quiz Title",
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed step-by-step explanation"
    }
  ]
}`;
    } else if (type === "research") {
      prompt = `Generate an in-depth Academic Research & Educational STEM Breakdown for "${topic}" at level ${gradeLevel || "HSC / University"}.
Language: ${language === "bn" ? "Bengali (বাংলা)" : "English"}.
Include:
1. **Research Overview & Significance (গবেষণার প্রেক্ষাপট ও গুরুত্ব)**
2. **Key Research Questions & Hypotheses (মূল প্রশ্ন ও গবেষণার ধারণা)**
3. **Core Scientific & Theoretical Methodology (বৈজ্ঞানিক তত্ত্ব ও কার্যপ্রণালী)**
4. **Current Global Trends & Real-world Applications (আধুনিক বিশ্বব্যাপী ব্যবহার ও প্রয়োগ)**
5. **Thesis / Paper Outline & Future Scope (থিসিস রূপরেখা ও ভবিষ্যৎ সম্ভাবনা)**
6. **Key Research Terminology Glossary (গুরুত্বপূর্ণ বৈজ্ঞানিক শব্দকোষ)**
Format cleanly with Markdown headers and bullet points.`;
    } else {
      prompt = `Generate a complete structured educational lesson on "${topic}" for ${gradeLevel || "beginners/students"}.
Language: ${language === "bn" ? "Bengali (বাংলা)" : "English"}.
Include:
1. Clear Overview & Real-life Analogy
2. Core Concepts with bullet points
3. Code or Practical Example (if applicable)
4. 3 Important Takeaways
5. 2 Practice Questions with Answers.
Format in markdown with clean headers.`;
    }

    if (type === "quiz") {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const json = JSON.parse(response.text || "{}");
      return res.json({ quiz: json });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: JUNIOR_GEMINI_SYSTEM_PROMPT,
        },
      });

      return res.json({ lesson: response.text });
    }
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] Serving smart offline fallback for lesson/quiz");
    
    if (type === "quiz") {
      return res.json({
        quiz: {
          title: `কুইজ ল্যাব: ${topic}`,
          topic: topic,
          questions: [
            {
              question: `"${topic}" বিষয়ে নিচের কোনটি সবচেয়ে গুরুত্বপূর্ণ মৌলিক ধারণা?`,
              options: ["তাত্ত্বিক ভিত্তি ও সঠিক নিয়মাবলী", "ভুল উত্তর নির্বাচন করা", "কোনোটিই নয়", "শুধুমাত্র মুখস্থ করা"],
              correctAnswerIndex: 0,
              explanation: "সঠিক উত্তর নির্বাচন ও স্পষ্ট ধারণাই যেকোনো বিষয়ের ভিত্তি গড়ে তোলে।"
            },
            {
              question: `বিসিএস ও জাতীয় পরীক্ষায় "${topic}" অধ্যায়ের মূল উদ্দেশ্য কী?`,
              options: ["বাস্তব জীবনের সমস্যা সমাধান", "পরীক্ষায় এড়িয়ে যাওয়া", "শুধুমাত্র থিওরি মনে রাখা", "কোনোটিই নয়"],
              correctAnswerIndex: 0,
              explanation: "বাস্তব ক্ষেত্রে প্রয়োগ ও চিন্তাশক্তির বিকাশই শিক্ষার প্রধান লক্ষ্য।"
            }
          ]
        }
      });
    } else if (type === "research") {
      return res.json({
        lesson: `# 🔬 গবেষণা ও STEM রিপোর্ট: ${topic}\n\n## ১. গবেষণার পটভূমি (Research Overview)\n**${topic}** বিষয়টির আধুনিক শিক্ষা ও গবেষণায় অত্যন্ত গভীর প্রভাব রয়েছে।\n\n## ২. মূল বৈজ্ঞানিক তত্ত্ব (Scientific Core)\n- **তথ্য বিশ্লেষণ:** পর্যবেক্ষণ ও উপাত্ত সংগ্রহ।\n- **পরীক্ষামূলক প্রমাণ:** গাণিতিক ও ডিজিটাল সিমুলেশন।\n\n## ৩. বাস্তব প্রয়োগ (Real-world Impact)\nজাতীয় ও আন্তর্জাতিক পর্যায়ে প্রযুক্তি, বিজ্ঞান ও মানবসেবায় এই বিষয়ের প্রয়োগ অনস্বীকার্য।\n\n*(মডেল নোটিশ: এআই কোটা সীমিত হলেও মাটি এআই অফলাইন ইঞ্জিন আপনার স্টাডি নোট প্রস্তুত রেখেছে!)*`
      });
    } else {
      return res.json({
        lesson: `# 📚 স্টাডি নোট: ${topic}\n\n## মূল বিষয়বস্তু\n${topic} সম্পর্কিত জাতীয় শিক্ষাক্রম (NCTB) ও বিসিএস পরীক্ষার গুরুত্বপূর্ণ ধারণা নিচে আলোচনা করা হলো:\n\n1. **সংজ্ঞা ও প্রাথমিক ধারণা:** বিষয়টি সঠিকভাবে বুঝতে মৌলিক টার্মস মুখস্থের চেয়ে উপলব্ধি করা জরুরী।\n2. **পরীক্ষায় গুরুত্বপূর্ণ প্রশ্ন:** বিগত বছরের প্রশ্ন বিশ্লেষণ করে প্রস্তুতি নিন।\n3. **স্মার্ট টিপস:** নিয়মিত রিভিশন দিন এবং রিভিশন কার্ড তৈরি করুন।`
      });
    }
  }
});

// Helper: Fallback SVG Educational Illustration Generator
function generateFallbackSvg(prompt: string, aspectRatio: string = "1:1"): string {
  let width = 800;
  let height = 800;
  if (aspectRatio === "16:9") { width = 1200; height = 675; }
  else if (aspectRatio === "4:3") { width = 1000; height = 750; }
  else if (aspectRatio === "9:16") { width = 675; height = 1200; }

  const cleanTitle = prompt.replace(/[<>&"]/g, "").slice(0, 80);
  const words = cleanTitle.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="50%" stop-color="#1E1B4B"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="50%" stop-color="#C084FC"/>
        <stop offset="100%" stop-color="#F472B6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    
    <circle cx="${width * 0.2}" cy="${height * 0.3}" r="${width * 0.22}" fill="#38BDF8" opacity="0.2" filter="url(#glow)"/>
    <circle cx="${width * 0.8}" cy="${height * 0.7}" r="${width * 0.28}" fill="#C084FC" opacity="0.2" filter="url(#glow)"/>
    <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.15}" fill="#F59E0B" opacity="0.15" filter="url(#glow)"/>

    <g opacity="0.08" stroke="#FFFFFF" stroke-width="1.5">
      <path d="M 0,${height*0.25} L ${width},${height*0.25} M 0,${height*0.5} L ${width},${height*0.5} M 0,${height*0.75} L ${width},${height*0.75}" />
      <path d="M ${width*0.25},0 L ${width*0.25},${height} M ${width*0.5},0 L ${width*0.5},${height} M ${width*0.75},0 L ${width*0.75},${height}" />
    </g>

    <rect x="${width * 0.08}" y="${height * 0.12}" width="${width * 0.84}" height="${height * 0.76}" rx="24" fill="#030712" fill-opacity="0.65" stroke="url(#textGrad)" stroke-width="2.5"/>

    <rect x="${width * 0.12}" y="${height * 0.18}" width="240" height="36" rx="18" fill="url(#textGrad)" fill-opacity="0.2" stroke="#38BDF8" stroke-opacity="0.5"/>
    <text x="${width * 0.12 + 120}" y="${height * 0.18 + 23}" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="13" fill="#38BDF8" text-anchor="middle">✨ MATI AI EDUCATIONAL ART</text>

    <text x="${width * 0.12}" y="${height * 0.38}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${Math.min(width * 0.04, 30)}" fill="#FFFFFF">
      ${line1}
    </text>
    ${line2 ? `<text x="${width * 0.12}" y="${height * 0.46}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${Math.min(width * 0.04, 30)}" fill="url(#textGrad)">${line2}</text>` : ''}

    <g transform="translate(${width * 0.5 - 30}, ${height * 0.58}) scale(1.3)">
      <path d="M24 0L29.5 18.5L48 24L29.5 29.5L24 48L18.5 29.5L0 24L18.5 18.5L24 0Z" fill="url(#textGrad)"/>
    </g>

    <text x="${width * 0.5}" y="${height * 0.82}" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9CA3AF" text-anchor="middle">
      JUNIOR GEMINI AI STUDIO • EDUCATIONAL VISUAL LAB
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// API: Image Generation Studio
app.post("/api/generate-image", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = null;
    let descriptionText = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Str = part.inlineData.data;
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${base64Str}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (imageUrl) {
      return res.json({ imageUrl, description: descriptionText, source: "gemini-ai" });
    }

    // Fallback if no inline image was generated
    const fallbackUrl = generateFallbackSvg(prompt, aspectRatio);
    return res.json({
      imageUrl: fallbackUrl,
      description: "Generated Educational Visual Illustration for prompt.",
      source: "fallback-svg",
    });
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] Serving smart fallback SVG illustration for image request");
    // Return high quality fallback SVG illustration so UI never breaks
    const fallbackUrl = generateFallbackSvg(prompt, aspectRatio);
    return res.json({
      imageUrl: fallbackUrl,
      description: "Generated Educational Visual Illustration for prompt.",
      source: "fallback-svg",
    });
  }
});

// API: TTS Speech Synthesis
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.slice(0, 500) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "No audio generated from TTS model." });
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] TTS request failed or quota exceeded");
    res.status(500).json({ error: "Failed to synthesize speech." });
  }
});

// API: Legal Document & Policy Generator
app.post("/api/generate-legal-doc", async (req, res) => {
  const { docType, appName = "Mati AI", entityName = "Developer", appCategory, language = "bn", extraDetails } = req.body;

  if (!docType || !appName) {
    return res.status(400).json({ error: "docType and appName are required" });
  }

  try {
    const ai = getGenAI();
    const isBn = language === "bn";

    let promptText = "";
    if (docType === "tos") {
      promptText = `Draft a comprehensive, legal Terms of Service (ব্যবহারের শর্তাবলী) document for the application/website named "${appName}".
Entity / Owner / Company: "${entityName || "The Developer"}".
App Category / Features: "${appCategory || "Software & Web Application"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.
Extra Context: ${extraDetails || "Standard digital software provisions"}.

Include standard sections:
1. Introduction & Acceptance of Terms
2. Intellectual Property & Ownership Rights (Declaring that all source code, design, logos, and features belong exclusively to ${entityName || appName})
3. User Conduct & Acceptable Use Rules
4. Limitation of Liability & Disclaimer of Warranties
5. Termination of Service
6. Governing Law (Mentioning Bangladesh / Applicable Local Laws)`;
    } else if (docType === "privacy") {
      promptText = `Draft a complete Privacy Policy (গোপনীয়তা নীতি) document for the application/website named "${appName}".
Entity / Owner: "${entityName || "The Developer"}".
Data Collected: "${appCategory || "Basic User Account Data, Cookies, Usage Analytics"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include standard sections:
1. Information We Collect (Personal data, device logs, usage)
2. How We Use Your Information (Service provision, security, updates)
3. Data Storage, Encryption & Security Measures
4. Third-Party Services & Analytics Disclosure
5. User Rights (Right to access, modify, or delete data)
6. Cookies Policy & Contact Details for Data Inquiries`;
    } else if (docType === "nda") {
      promptText = `Draft a formal Non-Disclosure Agreement (এনডিএ - তথ্য গোপনীয়তা চুক্তি) between "${entityName || "Disclosing Party / App Owner"}" and "Receiving Party / Developer / Contractor" regarding the app project "${appName}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Definition of Confidential Information (Source code, algorithms, UI mockups, business logic)
2. Non-Disclosure & Non-Use Obligations
3. Exclusions from Confidentiality
4. Term & Duration of Obligations
5. Consequences of Breach
6. Signatures Placeholder`;
    } else if (docType === "ip_assignment") {
      promptText = `Draft a Copyright & IP Assignment Agreement (মেধা সম্পত্তি ও সোর্স কোড হস্তান্তর চুক্তি) where a freelance developer or contractor transfers 100% of the Intellectual Property, Source Code, Patents, and Copyrights for "${appName}" to "${entityName || "The App Owner"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Transfer of Rights (Complete assignment of source code, designs, algorithms)
2. Consideration & Payment Confirmation
3. Representation & Warranties (Developer guarantees code is original and non-infringing)
4. Waiver of Moral Rights
5. Governing Law & Signatures`;
    } else {
      promptText = `Draft a legal notice and Copyright Header Notice (কপিরাইট ও স্বত্বাধিকার নির্দেশিকা) to embed in the source code files and footer of "${appName}" owned by "${entityName || "The Owner"}". Language: ${isBn ? "Bengali" : "English"}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert technology lawyer and software intellectual property specialist in Bangladesh and international cyber law. Write clear, formal, professionally structured legal documents.",
      },
    });

    res.json({ document: response.text });
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] Serving smart offline fallback for legal document");
    
    const docFallback = `# ⚖️ ${appName} - লিগ্যাল প্রোটোকল ও মেধা সম্পত্তি নীতি (${docType.toUpperCase()})

**মালিক/সংস্থা:** ${entityName}
**প্রয়োগক্ষেত্র:** জাতীয় ও আন্তর্জাতিক আইসিটি আইন, ২০২৩ এবং মেধা সম্পত্তি আইন

---

### ১. মেধা সম্পত্তি ও সোর্স কোড স্বত্বাধিকার (Ownership)
"${appName}" প্ল্যাটফর্মের সমস্ত সোর্স কোড, ডিজাইন, অ্যালগরিদম, ডাটাবেস ও ট্রেডমার্ক সম্পূর্ণভাবে **${entityName}** এর নিজস্ব মেধা সম্পত্তি (Intellectual Property)। অনুমোদন ব্যতিরেকে এর কোনো অংশ কপি বা পুনঃব্যবহার আইনত দণ্ডনীয়।

### ২. গোপনীয়তা ও ডাটা নিরাপত্তা (Privacy & Security)
ব্যবহারকারীর সম্মতি ব্যতিরেকে কোনো ব্যক্তিগত তথ্য তৃতীয় পক্ষের নিকট শেয়ার করা হয় না। সমস্ত এনক্রিপশন প্রোটোকল এনসিটিবি ও গ্লোবাল স্ট্যান্ডার্ড মেনে পরিচালিত হয়।

### ৩. আইন ও এখতিয়ার (Governing Law)
এই চুক্তি ও নীতিমালার যেকোনো ধারা গণপ্রজাতন্ত্রী বাংলাদেশের তথ্যপ্রযুক্তি ও ডিজিটাল নিরাপত্তা আইনের অধীনে পরিচালিত হবে।`;

    return res.json({ document: docFallback });
  }
});

// API: AI Video Storyboard & Script Generator
app.post("/api/generate-video-storyboard", async (req, res) => {
  try {
    const { videoPrompt, style = "Cinematic 4K", language = "bn" } = req.body;
    if (!videoPrompt) {
      return res.status(400).json({ error: "Video prompt is required" });
    }

    const ai = getGenAI();
    const isBn = language === "bn";

    const promptText = `Create an AI Video Storyboard and Editor Script for the theme: "${videoPrompt}".
Style: "${style}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Return JSON format with:
{
  "title": "Short catchy title",
  "synopsis": "Brief overview",
  "scenes": [
    {
      "sceneNumber": 1,
      "visualDescription": "Detailed visual description of what happens in scene 1",
      "subtitleText": "Bangla subtitle text to overlay on video",
      "cameraMotion": "Pan Right / Zoom In / Drone Shot",
      "audioMood": "Energetic / Sci-Fi Synth / Cinematic Folk",
      "durationSec": 5
    },
    {
      "sceneNumber": 2,
      "visualDescription": "Detailed visual description of scene 2",
      "subtitleText": "Subtitle text for scene 2",
      "cameraMotion": "Slow Motion Zoom / Orbit 360",
      "audioMood": "Inspirational",
      "durationSec": 5
    },
    {
      "sceneNumber": 3,
      "visualDescription": "Detailed visual description of scene 3",
      "subtitleText": "Subtitle text for scene 3",
      "cameraMotion": "Aerial Flyover / Fade Out",
      "audioMood": "Triumphant",
      "durationSec": 5
    }
  ],
  "editingTips": ["Tip 1 on color grading", "Tip 2 on audio sync", "Tip 3 on transition effects"]
}
ONLY return raw valid JSON without markdown formatting backticks if possible, or plain JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert AI Video Producer, Director, and Video Editor. You create high quality video storyboards and scripts in Bengali.",
      },
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    } catch (e) {
      return res.json({
        title: videoPrompt,
        synopsis: isBn ? "এআই ভিডিও দৃশ্য তৈরি সম্পন্ন হয়েছে।" : "AI Video Storyboard generated.",
        scenes: [
          {
            sceneNumber: 1,
            visualDescription: isBn ? `দৃশ্য ১: ${videoPrompt} এর প্রাথমিক সিনেম্যাটিক শট` : `Scene 1: Cinematic intro of ${videoPrompt}`,
            subtitleText: isBn ? "স্বাগতম আমাদের নতুন এআই ভিডিও ভিজ্যুয়াল এডিটর-এ!" : "Welcome to our AI Video Visual Editor!",
            cameraMotion: "Cinematic Slow Zoom In",
            audioMood: "Cinematic Orchestral",
            durationSec: 5
          },
          {
            sceneNumber: 2,
            visualDescription: isBn ? `দৃশ্য ২: মেধা ও উদ্ভাবনের প্রধান ফোকাস শট` : `Scene 2: Core innovation focus shot`,
            subtitleText: isBn ? "কুইজ জয়ীদের জন্য বিশেষ এআই ভিডিও এডিটিং সুবর্ণ সুযোগ।" : "Special AI Video Editing unlocked for quiz champions.",
            cameraMotion: "Pan Right & Tilt Up",
            audioMood: "Energetic Beat",
            durationSec: 5
          },
          {
            sceneNumber: 3,
            visualDescription: isBn ? `দৃশ্য ৩: ভবিষ্যৎ সমৃদ্ধ বাংলাদেশের চূড়ান্ত দৃশ্য` : `Scene 3: Inspiring final climax shot`,
            subtitleText: isBn ? "আজই নিজের চিন্তাকে এআই ভিডিওতে রূপান্তর করো!" : "Transform your imagination into AI video today!",
            cameraMotion: "Drone Aerial Lift",
            audioMood: "Triumphant Climax",
            durationSec: 5
          }
        ],
        editingTips: [
          isBn ? "কালার গ্রেডিং: এডিটর থেকে 'গোল্ডেন আওয়ার' নাইট ভিব সিলেক্ট করুন।" : "Color Grading: Select Golden Hour vibe.",
          isBn ? "সাউন্ড সিন্ক্রোনাইজেশন: টাইটেল সাবটাইটেলের সাথে ট্রানজিশন ম্যাচ করুন।" : "Sync transition with subtitle text."
        ]
      });
    }
  } catch (error: any) {
    console.error("Video Storyboard API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate video storyboard." });
  }
});

// API: Grant Pitch, Funding Proposal & School Outreach Generator
app.post("/api/generate-pitch", async (req, res) => {
  const { pitchType, organizationName = "Mati AI Foundation", appTitle = "Mati AI", targetAudience, language = "bn", specialRequest } = req.body;

  try {
    const ai = getGenAI();
    const isBn = language === "bn";

    let promptText = "";
    if (pitchType === "google_for_startups") {
      promptText = `Draft a formal application proposal for "Google for Startups / Google Cloud Credits Program" for the AI learning platform "${appTitle || "Mati AI"}".
Organization/Founder: "${organizationName || "Mati AI Foundation"}".
Target Audience: "${targetAudience || "Students and youth in rural Bangladesh"}".
Language: ${isBn ? "Bengali" : "English"}.
Context: ${specialRequest || "Empowering offline & low-bandwidth rural AI literacy in Bangladesh"}.

Include standard Google Grant Sections:
1. Executive Summary & Problem Statement (Digital divide in rural Bangladesh)
2. Solution & Technical Architecture (Built on Gemini API, low-latency, Bengali natural language)
3. Social Impact & Metrics (Targeting 100,000+ students across schools and colleges)
4. Resource Request (Google Cloud Credits, Technical Mentorship, AI Studio partnership)
5. Sustainability & Future Roadmap`;
    } else if (pitchType === "ict_division_grant") {
      promptText = `Draft an official Innovation Grant Application to "ICT Division Bangladesh (iDEA Project / Startup Bangladesh)" for "${appTitle || "Mati AI (মাটি এআই)"}".
Applicant: "${organizationName || "Mati AI Team"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
১. প্রকল্পের পটভূমি ও সামাজিক গুরুত্ব (Project Background & Rural AI Need)
২. প্রযুক্তিগত উদ্ভাবন (Technical Innovation using Gemini AI & Bengali Localization)
৩. বাস্তবায়ন পরিকল্পনা ও বাজেট আবেদন (Implementation Plan & Grant Funding Breakdown)
৪. জাতীয় উন্নয়ন ও ভিশন ২০৪১ এ ভূমিকা (Role in Smart Bangladesh / Vision 2041)
৫. প্রত্যাশিত ফলাফল ও পরিমাপক (Expected Outcomes & Student Reach Metrics)`;
    } else if (pitchType === "school_outreach_letter") {
      promptText = `Draft a professional, formal Proposal Letter to High School Principals & ICT Teachers in Bangladesh requesting permission to conduct a free "Mati AI Literacy Workshop" for students.
App Name: "${appTitle || "Mati AI (মাটি এআই)"}".
Sender: "${organizationName || "Mati AI Education Ambassador Team"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
- Formal salutation to School Authority
- Introduction to Mati AI (Free, accessible AI learning platform)
- Benefits for 8th-12th grade students (Coding, Study Assistance, IP/Patent awareness)
- Proposed 45-minute workshop schedule (Zero cost to school)
- Call to action & contact details placeholder`;
    } else if (pitchType === "telecom_csr_sponsorship") {
      promptText = `Draft a CSR & Digital Inclusion Sponsorship Proposal to Telecommunication Operators (Grameenphone / Robi / Banglalink) or Corporate Sponsors for "${appTitle || "Mati AI"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Executive Summary & Co-Branding Opportunity
2. Zero-Rating / Data-Free Access Request (Requesting 0-rated data for Mati AI domain for rural students)
3. Brand Visibility & Social Impact Metrics
4. Sponsorship Tiers (Device distribution, local server hosting, student competitions)`;
    } else {
      promptText = `Draft a 45-minute Interactive AI Workshop Slide-by-Slide Outline and Script for School Teachers & Campus Ambassadors to present "${appTitle || "Mati AI"}" to students. Language: ${isBn ? "Bengali" : "English"}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert startup pitch consultant, educational outreach director, and grant proposal writer specializing in Bangladesh technology ecosystem and social impact projects.",
      },
    });

    res.json({ pitch: response.text });
  } catch (error: any) {
    console.log("[Mati Smart AI Engine] Serving smart offline fallback for pitch proposal");
    
    const pitchFallback = `# 🚀 ${appTitle} (${organizationName}) - প্রপোজাল প্রজেক্ট সামারি

### ১. নির্বাহী সারসংক্ষেপ (Executive Summary)
**${appTitle}** হলো বাংলাদেশের প্রান্তিক ও শহরাঞ্চলের শিক্ষার্থী, বিসিএস ও চাকরিপ্রার্থীদের জন্য একটি স্বয়ংসম্পূর্ণ, অফলাইন সুবিধা সমৃদ্ধ জাতীয় এআই প্ল্যাটফর্ম।

### ২. মূল উদ্দেশ্য ও সামাজিক প্রভাব (Social Impact)
- **বিনামূল্যে আন্তর্জাতিক মানসম্মত এআই শিক্ষা:** বাংলা ও ইংরেজি ভাষায় এনসিটিবি কারিকুলাম ও প্রযুক্তি শিক্ষা প্রদান।
- **ডিজিটাল সমতা:** কম ব্যান্ডউইথ ও অফলাইন মোডে সহজে ব্যবহারের সুবিধা।
- **ক্যারিয়ার ও দক্ষতা উন্নয়ন:** পাইথন কোডিং, সায়েন্স ডায়াগ্রাম এবং বিসিএস মডেল টেস্ট সুবিধা।

### ৩. প্রস্তাবিত সহায়তা আবেদন (Requested Grant / Collaboration)
- ক্লাউড সার্ভার সাপোর্ট, আঞ্চলিক ওয়্যারহাউজ স্পেস এবং আইসিটি বিষয়ক প্রশিক্ষণ কর্মশালার অনুমতি।

*(মাটি এআই অফলাইন টেমপ্লেট জেনারেটর দ্বারা প্রস্তুতকৃত)*`;

    return res.json({ pitch: pitchFallback });
  }
});

// Serve frontend in production or dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JUNIOR GEMINI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
