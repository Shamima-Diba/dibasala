export interface OfflineMaterialItem {
  id: string;
  category: 'ict' | 'python' | 'math_science' | 'english' | 'quiz_bank';
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  summaryBn: string;
  summaryEn: string;
  readTimeMins: number;
  contentMarkdownBn: string;
  contentMarkdownEn: string;
  quizQuestions?: {
    questionBn: string;
    questionEn: string;
    optionsBn: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationBn: string;
    explanationEn: string;
  }[];
}

export const OFFLINE_LEARNING_MATERIALS: OfflineMaterialItem[] = [
  {
    id: 'hsc-ict-ch1',
    category: 'ict',
    titleBn: 'এইচএসসি আইসিটি: অধ্যায় ১ - বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
    titleEn: 'HSC ICT Chapter 1: Global & Bangladesh Perspective',
    badgeBn: 'এইচএসসি আইসিটি',
    badgeEn: 'HSC ICT',
    summaryBn: 'ভার্চুয়াল রিয়েলিটি, কৃত্রিম বুদ্ধিমত্তা (AI), বায়োমেট্রিক্স, রোবোটিক্স ও ন্যানোটেকনোলজি।',
    summaryEn: 'Virtual Reality, Artificial Intelligence, Biometrics, Robotics, and Nanotechnology.',
    readTimeMins: 15,
    contentMarkdownBn: `
# অধ্যায় ১: বিশ্ব ও বাংলাদেশ প্রেক্ষিত (HSC ICT Chapter 1)

## ১.১ বিশ্বগ্রামের ধারণা (Global Village)
বিশ্বগ্রাম (Global Village) হলো এমন একটি সামাজিক বা সাংস্কৃতিক যোগাযোগ ব্যবস্থা যেখানে পৃথিবীর সকল মানুষই একক কমিউনিটির বা পরিবারের অংশ হিসেবে বাস করে এবং আইসিটি (ICT) ব্যবহারের মাধ্যমে পরস্পরের সাথে সহজে যোগাযোগ রাখতে পারে।

- **প্রতিষ্ঠাতা:** মার্শাল ম্যাকলুহান (Marshall McLuhan)।
- **প্রধান উপাদানসমূহ:** হার্ডওয়্যার, সফটওয়্যার, নেটওয়ার্ক কনেক্টিভিটি, ডেটা এবং মানুষের সক্ষমতা।

## ১.২ কৃত্রিম বুদ্ধিমত্তা (Artificial Intelligence - AI)
মানুষের বুদ্ধিমত্তা ও চিন্তাশক্তিকে কম্পিউটারের মতো যন্ত্রের মাধ্যমে অনুকরণ করার প্রযুক্তিই হলো কৃত্রিম বুদ্ধিমত্তা।
- **ব্যবহার:** জেমিনি (Gemini) টিউটর, চ্যাটবট, রোগ নির্ণয়, অটোমেটেড ড্রাইভিংসহ কৃত্রিম নিউরাল নেটওয়ার্ক।
- **প্রধান ভাষা:** Python, LISP, Prolog।

## ১.৩ বায়োমেট্রিক্স (Biometrics)
মানুষের বায়োলজিক্যাল (দৈহিক বা আচরণগত) বৈশিষ্ট্য মেপে অনন্যভাবে ব্যক্তি শনাক্ত করার প্রযুক্তি।
- **দৈহিক বৈশিষ্ট্য:** আঙুলের ছাপ (Fingerprint), ফেস রিকগনিশন, আইরিশ ও রেটিনা স্ক্যান, হাতের ডিএনএ।
- **আচরণগত বৈশিষ্ট্য:** কণ্ঠস্বর (Voice), টাইপিং কি-স্ট্রোক, স্বাক্ষর যাচাই।

## ১.৪ রোবোটিক্স (Robotics)
রোবোটিক্স হলো প্রযুক্তির এমন একটি শাখা যা কম্পিউটার নিয়ন্ত্রিত রোবটের ডিজাইন, নির্মাণ ও পরিচালনা নিয়ে কাজ করে।
- **মূল উপাদান:** অ্যাকচুয়েটর (Actuator), সেন্সর (Sensor), কন্ট্রোলার ও পাওয়ার সিস্টেম।
- **প্রয়োগ:** ভারী কারখানা, ঝুঁকিপূর্ণ খনি, মহাকাশ অভিযান ও সূক্ষ্ম সার্জারি।

---
### 💡 পরীক্ষার জন্য টিপস:
১. বিশ্বগ্রামের জনক কে? উত্তর: **মার্শাল ম্যাকলুহান**।
২. আঙুলের ছাপ কিসের উদাহরণ? উত্তর: **বায়োমেট্রিক্স (দৈহিক বৈশিষ্ট্য)**।
`,
    contentMarkdownEn: `
# Chapter 1: Global & Bangladesh Perspective (HSC ICT)

## 1.1 Concept of Global Village
Global Village is an interconnected social or cultural infrastructure where people around the world communicate as if living in a single close-knit community using ICT.

- **Pioneer:** Marshall McLuhan.
- **Key Pillars:** Hardware, Software, Network Connectivity, Data, and Human Literacy.

## 1.2 Artificial Intelligence (AI)
Simulating human cognitive functions and logic inside machines and software systems.
- **Applications:** AI Tutors like Junior Gemini, autonomous robotics, medical diagnostics, natural language processing.
- **Languages:** Python, LISP, C++.

## 1.3 Biometrics
Technology that identifies individuals uniquely based on physical or behavioral biological traits.
- **Physical:** Fingerprint scanning, Facial recognition, Iris/Retina scans, DNA.
- **Behavioral:** Voice recognition, Keystroke dynamics, Signature verification.

## 1.4 Robotics
The interdisciplinary branch of engineering and computer science involving design, construction, and operation of robots.
- **Core Parts:** Actuators, Sensors, Microcontrollers, and Power Units.
`
  },
  {
    id: 'hsc-ict-ch3',
    category: 'ict',
    titleBn: 'এইচএসসি আইসিটি: অধ্যায় ৩ - সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
    titleEn: 'HSC ICT Chapter 3: Number Systems & Digital Logic',
    badgeBn: 'ডিজিটাল লজিক',
    badgeEn: 'Digital Logic',
    summaryBn: 'বাইনারি, অক্টাল, হেক্সাডেসিমেল রূপান্তর, বুলিয়ান অ্যালজেব্রা ও লজিক গেট (AND, OR, NOT, NAND, NOR)।',
    summaryEn: 'Binary, Octal, Hex conversions, Boolean algebra, and Logic Gates (AND, OR, NOT, NAND, NOR).',
    readTimeMins: 20,
    contentMarkdownBn: `
# অধ্যায় ৩: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস (Number Systems)

## ৩.১ বেস বা ভিত্তিভিত্তিক সংখ্যা পদ্ধতি
১. **ডেসিমেল (Decimal):** বেস ১০ (০ থেকে ৯)
২. **বাইনারি (Binary):** বেস ২ (০ এবং ১)
৩. **অক্টাল (Octal):** বেস ৮ (০ থেকে ৭)
৪. **হেক্সাডেসিমেল (Hexadecimal):** বেস ১৬ (০-৯ এবং A-F)

### সংক্ষেপে রূপান্তর রুল:
- **ডেসিমেল থেকে অন্য যেকোনো পদ্ধতি:** সংখ্যাকে কাঙ্ক্ষিত বেস দিয়ে ক্রমাগত ভাগ করতে হবে।
- **অন্য পদ্ধতি থেকে ডেসিমেল:** অঙ্কের পজিশনাল পাওয়ার (Base^Power) দিয়ে গুণ করে যোগ।

## ৩.২ মৌলিক ও যৌগিক লজিক গেট (Logic Gates)
- **মৌলিক গেট (Basic Gates):**
  - **OR Gate:** যেকোনো একটি ইনপুট ১ হলেই আউটপুট ১ (যোগের মতো)
  - **AND Gate:** সব ইনপুট ১ হলেই কেবল আউটপুট ১ (গুণের মতো)
  - **NOT Gate:** ইনপুট উল্টে দেয় (১ কে ০, ০ কে ১)

- **সর্বজনীন গেট (Universal Gates):**
  - **NAND Gate:** AND এর বিপরীত (NOT + AND)
  - **NOR Gate:** OR এর বিপরীত (NOT + OR)
  *(NAND এবং NOR দিয়ে সকল মৌলিক গেট তৈরি করা যায় বলে এদের সর্বজনীন গেট বলা হয়।)*

---
### 🧪 উদাহরণ:
- (1011)₂ ডেসিমেল মান = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = **11**
`,
    contentMarkdownEn: `
# Chapter 3: Number Systems & Logic Gates (HSC ICT)

## 3.1 Base Number Systems
1. **Decimal:** Base 10 (Digits 0-9)
2. **Binary:** Base 2 (Digits 0, 1)
3. **Octal:** Base 8 (Digits 0-7)
4. **Hexadecimal:** Base 16 (Digits 0-9, A-F)

## 3.2 Basic & Universal Logic Gates
- **Basic Gates:** OR (Addition logic), AND (Multiplication logic), NOT (Inverter logic).
- **Universal Gates:** NAND and NOR (Can construct any logical circuit alone).
`
  },
  {
    id: 'hsc-ict-ch5',
    category: 'ict',
    titleBn: 'এইচএসসি আইসিটি: অধ্যায় ৫ - সি (C) প্রোগ্রামিং ভাষা',
    titleEn: 'HSC ICT Chapter 5: C Programming Fundamentals',
    badgeBn: 'কোডিং পাঠ',
    badgeEn: 'C Coding',
    summaryBn: 'ভ্যারিয়েবল, ডেটা টাইপ, printf, scanf, if-else, for loop এবং Function সি প্রোগ্রামিং উদাহরণ সহ।',
    summaryEn: 'Variables, Data Types, printf, scanf, if-else, loops, and C programming structure with code.',
    readTimeMins: 25,
    contentMarkdownBn: `
# অধ্যায় ৫: প্রোগ্রামিং ভাষা (C Language)

## ৫.১ একটি মৌলিক C প্রোগ্রামের গঠন
\`\`\`c
#include <stdio.stdio.h> // হেডার ফাইল

int main() {
    int a = 10, b = 20;
    int sum = a + b;
    
    printf("দুটি সংখ্যার যোগফল = %d\\n", sum);
    return 0;
}
\`\`\`

## ৫.২ প্রধান ডেটা টাইপসমূহ (Data Types)
- \`int\`: পূর্ণসংখ্যা (যেমন: 5, 42, -10) -> স্পেসিফায়ার \`%d\`
- \`float\`: ভগ্নাংশ (যেমন: 3.1416, 9.8) -> স্পেসিফায়ার \`%f\`
- \`char\`: একক বর্ণ (যেমন: 'A', 'Z') -> স্পেসিফায়ার \`%c\`

## ৫.৩ লুপ (For Loop & While Loop)
\`\`\`c
// ১ থেকে ১০ পর্যন্ত প্রিন্ট করার ফর-লুপ
for (int i = 1; i <= 10; i++) {
    printf("%d ", i);
}
\`\`\`
`,
    contentMarkdownEn: `
# Chapter 5: C Programming Fundamentals (HSC ICT)

## Basic C Program Structure
\`\`\`c
#include <stdio.h>

int main() {
    int num1 = 15, num2 = 25;
    int result = num1 + num2;
    printf("Sum of numbers: %d\\n", result);
    return 0;
}
\`\`\`
`
  },
  {
    id: 'python-starter-pack',
    category: 'python',
    titleBn: 'পাইথন ও প্রোগ্রামিং স্টার্টার প্যাক (অফলাইন গাইড)',
    titleEn: 'Python & Programming Complete Offline Guide',
    badgeBn: 'পাইথন কোডিং',
    badgeEn: 'Python Code',
    summaryBn: 'পাইথনের মূল ভিত্তি: প্রিন্ট, ইনপুট, ভ্যারিয়েবল, শর্ত (If-Else), লুপ, লিস্ট ও সহজ ফাংশন।',
    summaryEn: 'Core Python foundation: print, input, variables, logic, loops, lists, and functions.',
    readTimeMins: 20,
    contentMarkdownBn: `
# পাইথন প্রোগ্রামিং সহজ বাংলা নির্দেশিকা (Python Starter Pack)

## ১. প্রথম পাইথন কোড
\`\`\`python
# স্ক্রিনে মেসেজ প্রিন্ট করা
print("শুভকামনা! আমি পাইথন শিখছি জুনিয়র জেমিনির সাথে।")

# ইনপুট নেওয়া ও ভ্যারিয়েবল
name = input("আপনার নাম লিখুন: ")
age = int(input("আপনার বয়স কত? "))

print(f"হ্যালো {name}, আগামী বছর আপনার বয়স হবে {age + 1} বছর!")
\`\`\`

## ২. শর্তযুক্ত লজিক (If-Else)
\`\`\`python
marks = 85

if marks >= 80:
    print("অভিনন্দন! আপনি A+ পেয়েছেন।")
elif marks >= 60:
    print("আপনি পাস করেছেন!")
else:
    print("আরও মনোযোগ দিয়ে পড়তে হবে।")
\`\`\`

## ৩. তালিকা ও ফর-লুপ (List & For Loop)
\`\`\`python
subjects = ["ICT", "Math", "Physics", "Python"]

for sub in subjects:
    print(f"বইয়ের নাম: {sub}")
\`\`\`
`,
    contentMarkdownEn: `
# Python Programming Quickstart Guide

## 1. Print & Input
\`\`\`python
print("Hello World!")
name = input("Enter your name: ")
print(f"Welcome to Python, {name}!")
\`\`\`

## 2. Loops & Lists
\`\`\`python
numbers = [10, 20, 30, 40]
for num in numbers:
    print("Double value:", num * 2)
\`\`\`
`
  },
  {
    id: 'math-science-formulas',
    category: 'math_science',
    titleBn: 'মাধ্যমিক ও উচ্চ মাধ্যমিক গণিত ও বিজ্ঞান সূত্র ব্যাংক',
    titleEn: 'Math & Science Formula Reference Bank',
    badgeBn: 'গণিত ও বিজ্ঞান',
    badgeEn: 'Math & Science',
    summaryBn: 'বীজগণিত, ত্রিকোণমিতি, পরিমিতি, পদার্থবিদ্যার গতির সমীকরণ ও ওহমের সূত্রের রিভিশন নোট।',
    summaryEn: 'Algebra, Trigonometry, Motion equations, Newton laws, and Ohm law review sheet.',
    readTimeMins: 12,
    contentMarkdownBn: `
# গণিত ও বিজ্ঞান আবশ্যকীয় সূত্রাবলী (Formula Sheet)

## ১. বীজগণিত (Algebra)
- $(a + b)^2 = a^2 + 2ab + b^2$
- $(a - b)^2 = a^2 - 2ab + b^2$
- $a^2 - b^2 = (a + b)(a - b)$
- দ্বিপদী সমাধান (Quadratic Formula): $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

## ২. ত্রিকোণমিতি (Trigonometry)
- $\\sin^2\\theta + \\cos^2\\theta = 1$
- $1 + \\tan^2\\theta = \\sec^2\\theta$
- $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$

## ৩. পদার্থবিজ্ঞান গতির সমীকরণ (Physics Motion Equations)
- $v = u + at$ (শেষ বেগ)
- $s = ut + \\frac{1}{2}at^2$ (দূরত্ব)
- $v^2 = u^2 + 2as$
- ওহমের সূত্র (Ohm's Law): $V = IR$ (ভোল্টেজ = কারেন্ট × রোধ)
- শক্তি রূপান্তর: $E = mc^2$, $P = \\frac{W}{t}$
`,
    contentMarkdownEn: `
# Essential Math & Science Formulas

## 1. Algebra
- $(a + b)^2 = a^2 + 2ab + b^2$
- $a^2 - b^2 = (a + b)(a - b)$

## 2. Physics Mechanics
- $v = u + at$
- $s = ut + 0.5at^2$
- $V = IR$ (Ohm's Law)
`
  },
  {
    id: 'offline-quiz-bank',
    category: 'quiz_bank',
    titleBn: 'আইসিটি ও বিজ্ঞান ২০০+ অফলাইন প্রস্তুতি কুইজ ব্যাংক',
    titleEn: 'ICT & Science Offline Quiz Practice Bank',
    badgeBn: 'কুইজ ব্যাংক',
    badgeEn: 'Quiz Bank',
    summaryBn: 'ইন্টারনেট ছাড়াই কুইজ অনুশীলন করুন। প্রশ্ন, সঠিক উত্তর ও পূর্ণাঙ্গ ব্যাখ্যা সহ।',
    summaryEn: 'Practice quizzes completely offline with instant answers and explanations.',
    readTimeMins: 10,
    contentMarkdownBn: `
# অফলাইন কুইজ মাস্টার ব্যাংক (Offline Quiz Collection)

আপনার জ্ঞান যাচাই করতে নিচে থাকা কুইজ কার্ডগুলো অনুশীলন করুন। কোনো ইন্টারনেটের প্রয়োজন নেই!
`,
    contentMarkdownEn: `
# Offline Quiz Master Collection

Test your ICT and Science mastery completely offline!
`,
    quizQuestions: [
      {
        questionBn: 'বিশ্বগ্রাম (Global Village) ধারণার প্রবর্তক কে?',
        questionEn: 'Who introduced the concept of Global Village?',
        optionsBn: ['মার্শাল ম্যাকলুহান', 'বিল গেটস', 'চার্লস ব্যাবেজ', 'অ্যালান টিউরিং'],
        optionsEn: ['Marshall McLuhan', 'Bill Gates', 'Charles Babbage', 'Alan Turing'],
        correctIndex: 0,
        explanationBn: 'কানাডিয়ান দার্শনিক মার্শাল ম্যাকলুহান ১৯৬০-এর দশকে প্রথম "Global Village" শব্দটি ব্যবহার করেন।',
        explanationEn: 'Canadian philosopher Marshall McLuhan coined the term Global Village in the 1960s.'
      },
      {
        questionBn: 'কোনটি একটি সর্বজনীন (Universal) লজিক গেট?',
        questionEn: 'Which of the following is a Universal Logic Gate?',
        optionsBn: ['AND Gate', 'OR Gate', 'NAND Gate', 'NOT Gate'],
        optionsEn: ['AND Gate', 'OR Gate', 'NAND Gate', 'NOT Gate'],
        correctIndex: 2,
        explanationBn: 'NAND এবং NOR গেট দিয়ে অন্য যেকোনো মৌলিক গেট (AND, OR, NOT) তৈরি করা যায় বলে এদের সর্বজনীন গেট বলা হয়।',
        explanationEn: 'NAND and NOR gates can implement any Boolean function without using other gate types.'
      },
      {
        questionBn: 'অক্টাল সংখ্যা পদ্ধতির বেস বা ভিত্তি কত?',
        questionEn: 'What is the base of the Octal number system?',
        optionsBn: ['২', '৮', '১০', '১৬'],
        optionsEn: ['2', '8', '10', '16'],
        correctIndex: 1,
        explanationBn: 'অক্টাল সংখ্যা পদ্ধতিতে ০ থেকে ৭ পর্যন্ত মোট ৮টি প্রতীক ব্যবহার করা হয়, তাই এর বেস ৮।',
        explanationEn: 'The octal number system consists of 8 unique digits (0 to 7), so its base is 8.'
      },
      {
        questionBn: 'পাইথনে কোনো টেক্সট বা ফল স্ক্রিনে দেখাতে কোন ফাংশন ব্যবহৃত হয়?',
        questionEn: 'Which function displays text on screen in Python?',
        optionsBn: ['scanf()', 'print()', 'write()', 'display()'],
        optionsEn: ['scanf()', 'print()', 'write()', 'display()'],
        correctIndex: 1,
        explanationBn: 'পাইথনে আউটপুট দেখানোর জন্য আদর্শ স্ট্যান্ডার্ড ফাংশন হলো print()।',
        explanationEn: 'In Python, the built-in print() function outputs strings and variables to console.'
      }
    ]
  }
];
