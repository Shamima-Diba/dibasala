import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  FileText,
  KeyRound,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Users,
  Search,
  BookMarked,
  Layers,
  Award,
  RefreshCw,
  ExternalLink,
  Rocket,
  GraduationCap,
  Building2,
  Send,
  Globe2
} from 'lucide-react';
import { LegalRule } from '../types';

interface LegalOwnershipSuiteProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

export const LegalOwnershipSuite: React.FC<LegalOwnershipSuiteProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [activeSubTab, setActiveSubTab] = useState<'foundations' | 'rules' | 'generator' | 'evaluator' | 'checklist' | 'pitch' | 'ambassador'>('foundations');

  // Generator State
  const [docType, setDocType] = useState<string>('tos');
  const [appName, setAppName] = useState<string>('Mati AI (মাটি এআই)');
  const [entityName, setEntityName] = useState<string>('Mati AI Foundation');
  const [appCategory, setAppCategory] = useState<string>('Educational Tech & AI Literacy');
  const [extraDetails, setExtraDetails] = useState<string>('');
  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [isGeneratingDoc, setIsGeneratingDoc] = useState<boolean>(false);

  // Grant & Pitch Generator State
  const [pitchType, setPitchType] = useState<string>('google_for_startups');
  const [pitchOrgName, setPitchOrgName] = useState<string>('Mati AI Foundation');
  const [pitchAppTitle, setPitchAppTitle] = useState<string>('Mati AI (মাটি এআই)');
  const [pitchAudience, setPitchAudience] = useState<string>('Rural students, teachers & youth across Bangladesh');
  const [pitchExtra, setPitchExtra] = useState<string>('');
  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<boolean>(false);

  // Evaluator State
  const [appIdeaText, setAppIdeaText] = useState<string>('');
  const [evalResult, setEvalResult] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Expanded Rule Cards
  const [expandedRule, setExpandedRule] = useState<string | null>('rule-1');

  // Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: false,
    item4: true,
    item5: false,
    item6: true,
    item7: true,
    item8: false,
    item9: true,
    item10: false,
  });

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 10) * 100);

  // Rules Data
  const rulesList: LegalRule[] = [
    {
      id: 'rule-1',
      titleBn: '১. লিখিত চুক্তি ও স্বত্বাধিকার বণ্টন নিয়ম',
      titleEn: '1. Written Equity & Ownership Agreement Rule',
      categoryBn: 'টিম ও মালিকানা',
      categoryEn: 'Team & Ownership',
      summaryBn: 'প্রজেক্ট শুরু করার পূর্বেই অংশীদার বা টিমের মধ্যে লিখিত চুক্তির মাধ্যমে সোর্স কোড ও ইকুইটির শতাংশ নির্ধারণ করা বাধ্যতামূলক।',
      summaryEn: 'Define explicit ownership percentage and code rights in a written contract before project commencement.',
      detailsBn: [
        'মৌখিক চুক্তি আইনিভাবে দুর্বল। দলগত কাজের ক্ষেত্রে কো-ফাউন্ডারদের ভূমিকা ও ওনারশিপ লিখিত রাখুন।',
        'টিম ছেড়ে যাওয়া সদস্যের কোডের অধিকার যাতে প্রজেক্টকে আটকে না দেয় সে জন্য "Vesting Schedule" নীতি ব্যবহার করুন।',
        'কোনো সদস্য কোড বানালেও যদি চুক্তিপত্রে প্রজেক্টকে মালিকানা হস্তান্তর করা থাকে, তবে প্রজেক্টই আসল স্বত্বাধিকারী হবে।'
      ],
      detailsEn: [
        'Oral promises are legally risky. Define equity, vesting, and code ownership in writing.',
        'Use standard vesting schedules (e.g. 4-year vesting with 1-year cliff) for co-founders.',
        'Ensure explicit intellectual property assignment clauses for all team members.'
      ],
      actionItemBn: 'টিমের সব সদস্যকে নিয়ে একটি Founder Agreement / Partnership Agreement ডক সাইন করে রাখুন।',
      actionItemEn: 'Sign a formal Founder/Partnership Agreement with all team members.',
      iconName: 'Users'
    },
    {
      id: 'rule-2',
      titleBn: '২. ফ্রিল্যান্সার ও থার্ড-পার্টি কোড হস্তান্তর নিয়ম',
      titleEn: '2. Freelancer Copyright Assignment Agreement Rule',
      categoryBn: 'ফ্রিল্যান্সিং চুক্তি',
      categoryEn: 'Freelance & Outsource',
      summaryBn: 'ফ্রিল্যান্সারকে টাকা পরিশোধ করলেই স্বত্ব আপনার হয়ে যায় না; লিখিত "IP Assignment Agreement" ছাড়া মূল কোডের কপিরাইট ফ্রিল্যান্সারেই থেকে যায়।',
      summaryEn: 'Paying a freelancer does not automatically grant code copyright; a signed IP Assignment Agreement is strictly required.',
      detailsBn: [
        'কপিরাইট আইন অনুযায়ী কাজের প্রথম স্রষ্টাই সোর্স কোডের প্রকৃত কপিরাইট মালিক (অন্যথায় যদি চুক্তি থাকে)।',
        'পেমেন্টের পাশাপাশি চুক্তিপত্রে উল্লেখ করতে হবে: "All rights, title, and interest in the code are hereby transferred to the buyer."',
        'কোড ডেলিভারি নেওয়ার আগে ডেভেলপার নিশ্চিত করবেন যে কোডে কোনো অবৈধ বা চুরি করা কোড নেই।'
      ],
      detailsEn: [
        'Under copyright law, creator holds initial ownership unless explicitly assigned in writing.',
        'Ensure contract states complete assignment of all copyright, patent, and trade secret rights.',
        'Include developer warranties that code is original and does not infringe third-party rights.'
      ],
      actionItemBn: 'ফ্রিল্যান্সারকে নিয়োগের পূর্বে ও পরে "Copyright & IP Assignment" চুক্তি সাইন করান।',
      actionItemEn: 'Require a signed Copyright & IP Assignment Agreement prior to final payout.',
      iconName: 'KeyRound'
    },
    {
      id: 'rule-3',
      titleBn: '৩. সোর্স কোড ও লাইসেন্স হেডারের নিয়ম',
      titleEn: '3. Source Code Copyright & License Header Rule',
      categoryBn: 'কপিরাইট প্রকাশ',
      categoryEn: 'Copyright Declaration',
      summaryBn: 'সকল সোর্স কোড ফাইল এবং ওয়েবসাইটের ফুটারে স্পষ্ট কপিরাইট নোটিশ ও লাইসেন্স তথ্য যুক্ত রাখতে হবে।',
      summaryEn: 'Embed clear copyright notice and license metadata in source files and web footers.',
      detailsBn: [
        'ফাইল হেডারে উদাহরণ: "/* Copyright (c) 2026 [Owner Name]. All Rights Reserved. */"',
        'প্রজেক্টের রুট ডিরেক্টরিতে একটি LICENSE ফাইল রাখুন (যেমন: Proprietary/All Rights Reserved অথবা MIT)।',
        'এটি অননুমোদিত কোড চুরি রোধে এবং আদালতে প্রাথমিক প্রমাণ (Prima Facie Evidence) হিসেবে কাজ করে।'
      ],
      detailsEn: [
        'Example header: "/* Copyright (c) 2026 [Owner Name]. All Rights Reserved. */"',
        'Include a LICENSE file in the project root directory defining precise usage terms.',
        'Serves as notice of claim and prima facie evidence in copyright disputes.'
      ],
      actionItemBn: 'প্রজেক্টের রুট ডিরেক্টরিতে LICENSE.txt এবং প্রতি ফাইলের উপরে কপিরাইট কমেন্ট যোগ করুন।',
      actionItemEn: 'Add a LICENSE file in your repository and copyright notice headers to core files.',
      iconName: 'FileCode2'
    },
    {
      id: 'rule-4',
      titleBn: '৪. ওপেন-সোর্স লাইসেন্স কমপ্লায়েন্স নিয়ম',
      titleEn: '4. Open Source License Compliance & Risk Prevention Rule',
      categoryBn: 'কোড সুরক্ষা',
      categoryEn: 'Code Security',
      summaryBn: 'থার্ড-পার্টি ওপেন সোর্স লাইব্রেরি ব্যবহারের সময় তাদের লাইসেন্স (MIT, GPL, Apache) মেনে চলতে হবে।',
      summaryEn: 'Audit third-party libraries for license terms (MIT, GPL, Apache) to prevent copyleft viral traps.',
      detailsBn: [
        'GPL / AGPL লাইসেন্সযুক্ত কোড ব্যবহার করলে আপনার কমার্শিয়াল অ্যাপের সম্পূর্ণ কোড ওপেন সোর্স করতে বাধ্য হতে পারেন (Copyleft Risk)।',
        'MIT, Apache 2.0, BSD লাইসেন্সযুক্ত প্যাকেজগুলো কমার্শিয়াল অ্যাপের জন্য নিরাপদ।',
        'প্যাকেজ ডিরেক্টরি বা `package.json` নিয়মিত অডিট করে লাইসেন্স ফাইল রক্ষা করুন।'
      ],
      detailsEn: [
        'Copyleft licenses like GPL/AGPL may legally force you to make your entire codebase public.',
        'Permissive licenses like MIT, Apache 2.0, and BSD are safe for proprietary commercial software.',
        'Perform dependency license audits using tools like `license-checker` or automated scanners.'
      ],
      actionItemBn: 'প্রজেক্টের কোনো প্যাকেজে GPL বা AGPL আছে কিনা তা `package.json` চেক করে নিশ্চিত হোন।',
      actionItemEn: 'Audit package.json dependencies to ensure no restrictive GPL/AGPL viral code is included.',
      iconName: 'Layers'
    },
    {
      id: 'rule-5',
      titleBn: '৫. প্যাটেন্ট ফাইল ও ১-বছরের সময়সীমা (Grace Period) নিয়ম',
      titleEn: '5. Patent Filing & 1-Year Novelty Grace Period Rule',
      categoryBn: 'প্যাটেন্ট ও ইনোভেশন',
      categoryEn: 'Patent & Innovation',
      summaryBn: 'অ্যাপের নতুন কোনো অ্যালগরিদম বা মেকানিজম থাকলে তা জনসমক্ষে প্রকাশের ১ বছরের মধ্যে প্যাটেন্ট ফাইল করতে হয়।',
      summaryEn: 'File software patent applications before public disclosure, or within 1-year grace period.',
      detailsBn: [
        'প্যাটেন্টের মূল শর্ত হলো "Novelty" বা নতুনত্ব। আগে থেকে বাজারে বিদ্যমান কোনো সাধারণ ফিচারের প্যাটেন্ট হয় না।',
        'অ্যাপটি মার্কেটে রিলিজ বা আর্টিকেলে প্রকাশের পূর্বে প্যাটেন্ট আবেদন (Provisional Patent) করাই সবচেয়ে নিরাপদ।',
        '১ বছর পার হয়ে গেলে প্রযুক্তিটি Public Domain এর আওতায় চলে যায় এবং প্যাটেন্ট অধিকার নষ্ট হয়।'
      ],
      detailsEn: [
        'Patentability requires non-obvious technical novelty and process innovation.',
        'Filing a Provisional Patent before public release secures your priority date globally.',
        'In many jurisdictions, public disclosure starts a strict 12-month grace period clock.'
      ],
      actionItemBn: 'উদ্ভাবনী ফিচারের ফ্লোচার্ট ও অ্যালগরিদম টেক্সট প্রস্তুত করে প্যাটেন্ট অ্যাটর্নির পরামর্শ নিন।',
      actionItemEn: 'Document your novel system architecture and file a provisional patent prior to public launch.',
      iconName: 'Award'
    },
    {
      id: 'rule-6',
      titleBn: '৬. গোপনীয়তা চুক্তি (NDA) ও সিক্রেসি নিয়ম',
      titleEn: '6. Non-Disclosure Agreement (NDA) & Secrecy Rule',
      categoryBn: 'আইডিয়া সিকিউরিটি',
      categoryEn: 'Idea Protection',
      summaryBn: 'কোনো ডেভেলপার, ইনভেস্টর বা থার্ড-পার্টি এজেন্সির কাছে অ্যাপের সোর্স কোড বা লজিক শেয়ারের আগে NDA সাইন করান।',
      summaryEn: 'Always execute a Non-Disclosure Agreement (NDA) prior to sharing confidential source code or designs.',
      detailsBn: [
        'এনডিএ তে স্পষ্টভাবে উল্লেখ থাকতে হবে কোনটা গোপনীয় তথ্য (Source Code, Business Logic, API Keys)।',
        'চুক্তির মেয়াদ (সাধারণত ১ থেকে ৩ বছর) এবং গোপনীয়তা ভঙ্গ করলে আর্থিক ক্ষতিপূরণের শর্ত যুক্ত রাখতে হয়।',
        'প্যাটেন্ট ফাইল করার আগে NDA ছাড়া ফিচার প্রকাশ্যে শেয়ার করা ক্ষতিকর।'
      ],
      detailsEn: [
        'Explicitly define confidential assets: codebase, database schemas, proprietary algorithms, design assets.',
        'Specify duration of obligations (typically 2-5 years) and remedy clauses for breach.',
        'Protects trade secret status before formal patent filings are completed.'
      ],
      actionItemBn: 'যেকোনো ডেভলপারকে প্রজেক্টের অ্যাক্সেস দেওয়ার আগে এনডিএ সাইন করিয়ে নিন।',
      actionItemEn: 'Execute a unilateral or mutual NDA before granting repo access or sharing technical specs.',
      iconName: 'ShieldCheck'
    },
    {
      id: 'rule-7',
      titleBn: '৭. ব্র্যান্ড ও ট্রেডমার্ক ক্লাস নির্বাচন করার নিয়ম',
      titleEn: '7. Trademark Registration & Class Selection Rule',
      categoryBn: 'ট্রেডমার্ক ও ব্র্যান্ড',
      categoryEn: 'Brand & Trademark',
      summaryBn: 'অ্যাপের নাম, লোগো এবং আইকন সুরক্ষায় Class 9 (সফটওয়্যার) এবং Class 42 (SaaS/ওয়েব সার্ভিস)-এ রেজিস্ট্রেশন করুন।',
      summaryEn: 'Register app brand name & logo under Class 9 (Software) and Class 42 (SaaS/Web Services).',
      detailsBn: [
        'ট্রেডমার্ক আন্তর্জাতিক শ্রেণি (Nice Classification) অনুযায়ী বিভক্ত।',
        'Class 9: ডাউনলোডযোগ্য মোবাইল অ্যাপ ও ক্লায়েন্ট সফটওয়্যার।',
        'Class 42: ওয়েবসাইট, ক্লাউড সার্ভিস, সাশ (SaaS) এবং অনলাইন প্ল্যাটফর্ম।',
        'নাম নির্বাচনের আগে ট্রেডমার্ক রেজিস্ট্রি ডেটাবেসে অনুসন্ধান চালিয়ে নিশ্চিত হোন নামটি ফাঁকা আছে।'
      ],
      detailsEn: [
        'Software products belong to International Trademark Class 9 (Downloadable Software/Apps).',
        'SaaS and web-hosted platforms belong to Class 42 (Technology & Cloud Services).',
        'Conduct a thorough trademark search to verify availability before spending on marketing.'
      ],
      actionItemBn: 'আপনার অ্যাপের নামটি ট্রেডমার্ক ডেটাবেসে ফাঁকা আছে কিনা তা অনুসন্ধান করুন।',
      actionItemEn: 'Perform a trademark search in Class 9 and Class 42 for your brand name and logo.',
      iconName: 'Search'
    },
    {
      id: 'rule-8',
      titleBn: '৮. ব্যবহারকারীর শর্তাবলী (ToS) ও গোপনীয়তা নীতি (Privacy) নিয়ম',
      titleEn: '8. Terms of Service & Privacy Policy Legal Requirement Rule',
      categoryBn: 'অনলাইন আইনি লিফলেট',
      categoryEn: 'Compliance & Policy',
      summaryBn: 'ওয়েবসাইট ও প্লে স্টোরে অ্যাপ প্রকাশের জন্য প্রফেশনাল ToS এবং Privacy Policy থাকা বাধ্যতামূলক।',
      summaryEn: 'Mandatory publication of Terms of Service and Privacy Policy for App Stores & Web Compliance.',
      detailsBn: [
        'Terms of Service এ উল্লেখ থাকবে: সাইটের সমস্ত কোড ও ডিজাইন আপনার স্বত্বাধিকারী এবং ইউজার তা কপি করতে পারবে না।',
        'Privacy Policy তে উল্লেখ থাকবে: ব্যবহারকারীর ইমেইল, কুকিজ বা মোবাইল ডেটা কীভাবে সংগ্রহ ও সংরক্ষণ করা হয়।',
        'গুগল প্লে স্টোর ও অ্যাপল অ্যাপ স্টোরে পাবলিশের সময় Privacy Policy URL দেওয়া বাধ্যতামূলক।'
      ],
      detailsEn: [
        'Terms of Service declares IP ownership, liability disclaimers, and prohibited reverse engineering.',
        'Privacy Policy mandates disclosures on data collection, analytics, cookie usage, and user rights.',
        'Strict requirement for Google Play Store, Apple App Store, and Stripe/payment gateway approvals.'
      ],
      actionItemBn: 'আমাদের এআই জেনারেটর ব্যবহার করে ৫ মিনিটে প্রফেশনাল ToS ও Privacy Policy তৈরি করে ওয়েবসাইটে যোগ করুন।',
      actionItemEn: 'Generate and host a tailored Privacy Policy and ToS page on your web domain.',
      iconName: 'BookMarked'
    },
    {
      id: 'rule-9',
      titleBn: '৯. ইউজার জেনারেটেড কনটেন্ট (UGC) ও DMCA Takedown নিয়ম',
      titleEn: '9. User Generated Content & DMCA Takedown Rule',
      categoryBn: 'কপিরাইট ভীতি দূরীকরণ',
      categoryEn: 'Copyright Enforcement',
      summaryBn: 'ব্যবহারকারীরা সাইটে কিছু আপলোড করলে যাতে আপনার উপর আইনি দায় না আসে, তার জন্য DMCA Takedown পলিসি রাখুন।',
      summaryEn: 'Protect platform from third-party user copyright infringement via DMCA Safe Harbor policy.',
      detailsBn: [
        'ইউজারদের পোস্ট বা ফাইল আপলোড করার সুযোগ থাকলে তৃতীয় পক্ষের কপিরাইটযুক্ত জিনিস পোস্ট হতে পারে।',
        'DMCA Safe Harbor নিয়ম অনুযায়ী আপনার সাইটে একটি "Designated Copyright Agent" এর ইমেইল দিন।',
        'কপিরাইট লঙ্ঘনের অভিযোগ আসলে দ্রুত বিতর্কিত ফাইল সরিয়ে ফেললে প্ল্যাটফর্ম আইনি মামলা থেকে রেহাই পায়।'
      ],
      detailsEn: [
        'Safe harbor provisions protect multi-user platforms if users upload unauthorized copyright material.',
        'Maintain a published DMCA Takedown contact address (e.g. copyright@yourapp.com).',
        'Promptly remove or disable access to alleged infringing material upon valid notice.'
      ],
      actionItemBn: 'আপনার ওয়েবসাইটের ফুটার বা টার্মস পেজে copyright@yourdomain.com ইমেইলসহ টেকডাউন পলিসি যুক্ত করুন।',
      actionItemEn: 'Add a standard DMCA copyright infringement notice and email in your Terms of Service.',
      iconName: 'AlertTriangle'
    },
    {
      id: 'rule-10',
      titleBn: '১০. টাইমস্ট্যাম্পযুক্ত প্রমাণ ও রিপোজিট্রি সিকিউরিটি নিয়ম',
      titleEn: '10. Timestamped Git Proof & Digital Repository Signature Rule',
      categoryBn: 'ডিজিটাল প্রমাণীকরণ',
      categoryEn: 'Digital Proof',
      summaryBn: 'আদালতে মালিকানা প্রমাণের জন্য গিট কমিট টাইমস্ট্যাম্প (GitHub/GitLab) এবং ডিজিটাল হ্যাশ সংসংরক্ষণ করুন।',
      summaryEn: 'Maintain cryptographically timestamped git commit history as legal proof of authorship.',
      detailsBn: [
        'কোপিরেট বা ওনারশিপ নিয়ে মামলা হলে সবচেয়ে বড় প্রমাণ হলো: "কে প্রথম কোডটি লিখেছে?"',
        'GitHub বা GitLab এ নিয়মিত কমিট ও প্রাইভেট রিপোজিট্রি রাখা আইনি বিতর্কে সময়ভিত্তিক ডিজিটাল প্রমাণ (Digital Proof) দেয়।',
        'গিট কমিটে GPG Key দিয়ে ডিজিটাল সাইন করা থাকলে প্রমাণ আরো মজবুত হয়।'
      ],
      detailsEn: [
        'In copyright disputes, clean chronological commit history proves exact date and sequence of creation.',
        'Use signed Git commits (GPG signatures) to verify author identity beyond doubt.',
        'Maintain secure cloud repository backups with timestamp logs.'
      ],
      actionItemBn: 'আপনার সমস্ত কোড GitHub বা GitLab প্রাইভেট রিপোজিটরিতে টাইমস্ট্যাম্পসহ সংরক্ষণ করুন।',
      actionItemEn: 'Ensure all development code is backed up on GitHub/GitLab with verified signed commits.',
      iconName: 'CheckCircle2'
    }
  ];

  // Handle Legal Doc Generator Submit
  const handleGenerateLegalDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    setIsGeneratingDoc(true);
    setGeneratedDoc('');

    try {
      const response = await fetch('/api/generate-legal-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          appName,
          entityName,
          appCategory,
          language: lang,
          extraDetails,
        }),
      });

      const data = await response.json();
      if (data.document) {
        setGeneratedDoc(data.document);
      } else {
        setGeneratedDoc(isBn ? 'দলিল তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to generate document.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedDoc(isBn ? 'সার্ভার কানেকশন ত্রুটি।' : 'Server connection error.');
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  // Handle Patent & IP Evaluator Submit
  const handleEvaluateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIdeaText.trim()) return;

    setIsEvaluating(true);
    setEvalResult('');

    try {
      const promptMessage = isBn
        ? `আমার নিম্নের অ্যাপ/ওয়েবসাইট প্রজেক্টটির প্যাটেন্ট (Patent), কপিরাইট (Copyright), ট্রেডমার্ক (Trademark) এবং ওপেন-সোর্স লাইসেন্স ঝুঁকির আইনি মূল্যায়ন করে দাও:
প্রজেক্ট নাম/বিবরণ: ${appIdeaText}

অনুগ্রহ করে সুস্পষ্ট বাংলা শিরোনামসহ বিশ্লেষণ করো:
১. প্যাটেন্ট যোগ্যতা ও নতুনত্ব স্কোর (Patentability & Novelty Score out of 10)
২. কপিরাইট সুরক্ষার আওতা (Copyright Scope)
৩. ট্রেডমার্ক সুপারিশ ও ক্লাসিফিকেশন (Trademark Recommendations)
৪. ওপেন-সোর্স ও থার্ড-পার্টি রিস্ক চেক (Open Source & Licensing Risks)
৫. পরবর্তী ৫টি প্রয়োজনীয় আইনি পদক্ষেপ (Action Steps)`
        : `Analyze the Intellectual Property, Patentability, Copyright Scope, Trademark Class, and Open-Source Licensing risks for this app idea/code:
App Description: ${appIdeaText}

Provide structured feedback with headings:
1. Patentability & Technical Novelty Score (/10)
2. Copyright Protection Scope
3. Trademark Class & Brand Protection
4. Open Source Licensing & Risk Analysis
5. Next 5 Actionable Legal Steps`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptMessage }],
          modelPreference: 'gemini-3.6-flash',
          mode: 'legal-advisor',
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setEvalResult(data.reply);
      } else {
        setEvalResult(isBn ? 'মূল্যায়ন সম্পন্ন করা যায়নি।' : 'Failed to evaluate.');
      }
    } catch (err) {
      console.error(err);
      setEvalResult(isBn ? 'সার্ভার ত্রুটি।' : 'Server error.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(generatedDoc);
    alert(isBn ? 'দলিলটি ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Document copied to clipboard!');
  };

  const handleDownloadDoc = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDoc], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${appName.toLowerCase().replace(/\s+/g, '_')}_${docType}_doc.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle Pitch & Grant Proposal Generator
  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPitch(true);
    setGeneratedPitch('');

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchType,
          organizationName: pitchOrgName,
          appTitle: pitchAppTitle,
          targetAudience: pitchAudience,
          language: lang,
          specialRequest: pitchExtra,
        }),
      });

      const data = await response.json();
      if (data.pitch) {
        setGeneratedPitch(data.pitch);
      } else {
        setGeneratedPitch(isBn ? 'পিচ ডকুমেন্ট তৈরি করা সম্ভব হয়নি।' : 'Failed to generate pitch.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedPitch(isBn ? 'সার্ভার কানেকশন ত্রুটি।' : 'Server connection error.');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  return (
    <div id="legal-suite-container" className="max-w-7xl mx-auto py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isBn ? 'সফটওয়্যার মেধা সম্পত্তি ও প্যাটেন্ট গাইড' : 'Software IP & Patent Compliance Suite'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isBn ? 'অ্যাপ ও ওয়েবসাইট প্যাটেন্ট ও স্বত্বাধিকার (Ownership) হাব' : 'App Patent & Ownership Determination Suite'}
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              {isBn
                ? 'আপনার নির্মিত অ্যাপ বা ওয়েবসাইটের স্বত্বাধিকারী নির্ধারণ, প্যাটেন্ট আবেদন, ট্রেডমার্ক এবং প্রয়োজনীয় আইনি চুক্তিপত্র তৈরির জন্য সুনির্দিষ্ট গাইডলাইন ও এআই টুলস।'
                : 'Complete framework and AI tools to determine code ownership, file patents, register trademarks, and generate legal documents for apps & websites.'}
            </p>
          </div>

          {/* Quick Readiness Card */}
          <div className="bg-[#0B0F17]/80 backdrop-blur-md p-4 rounded-xl border border-indigo-500/20 w-full md:w-auto min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">{isBn ? 'আইনি সক্ষমার স্কোর' : 'Legal Readiness'}</span>
              <span className="text-xs font-bold text-indigo-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-gray-400">
              {completedCount} / 10 {isBn ? 'টি আইনি নিয়ম সম্পন্ন' : 'rules completed'}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1F2937] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('foundations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'foundations'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>{isBn ? '১. ওনারশিপ মূলনীতি' : '1. Ownership Basics'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'rules'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isBn ? '২. ১০টি আবশ্যিক নিয়ম' : '2. 10 Essential Rules'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('generator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'generator'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? '৩. এআই পলিসি জেনারেটর' : '3. Legal Doc Generator'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evaluator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'evaluator'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{isBn ? '৪. প্যাটেন্ট অ্যাসেসর' : '4. AI Patent Evaluator'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'checklist'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{isBn ? '৫. আইনি রেডি চেকলিস্ট' : '5. Legal Checklist'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pitch')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'pitch'
              ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-amber-400 hover:text-amber-200 hover:bg-[#1A1D24]'
          }`}
        >
          <Rocket className="w-4 h-4 text-amber-300" />
          <span>{isBn ? '৬. ফান্ডিং ও গ্র্যান্ট পিচ ডেক' : '6. Grant & Pitch Studio'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ambassador')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'ambassador'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-emerald-400 hover:text-emerald-200 hover:bg-[#1A1D24]'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-300" />
          <span>{isBn ? '৭. স্কুল ও শিক্ষক প্রচারণা কিট' : '7. School & Ambassador Kit'}</span>
        </button>
      </div>

      {/* SECTION 1: FOUNDATIONS */}
      {activeSubTab === 'foundations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Ownership Types */}
            <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center space-x-3 text-blue-400">
                <Users className="w-6 h-6" />
                <h2 className="text-lg font-bold text-white">
                  {isBn ? '১. স্বত্বাধিকারী বা ওনারশিপ (Ownership) নির্ধারণ' : '1. Ownership Determination Categories'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isBn
                  ? 'অ্যাপ বা ওয়েবসাইটের আইনি মালিকানা কে পাবে তা মূলত কাজের অর্থায়ন, কাজের চুক্তিপত্র এবং ডেভেলপার সম্পর্কের ওপর নির্ধারিত হয়:'
                  : 'Legal ownership depends strictly on who authored the code and under what contractual terms it was produced:'}
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <h3 className="font-bold text-blue-300">
                    {isBn ? 'ব্যক্তিগত প্রজেক্ট (Sole Ownership)' : 'Individual Project'}
                  </h3>
                  <p className="text-gray-300">
                    {isBn
                      ? 'আপনি নিজে কোড লিখে, ডিজাইন করে এবং নিজের খরচে বানালে ১০০% সম্পূর্ণ মালিকানা একমাত্র আপনার।'
                      : 'If you code, design, and fund the project independently, you hold 100% exclusive copyright.'}
                  </p>
                </div>

                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <h3 className="font-bold text-indigo-300">
                    {isBn ? 'দলগত বা পার্টনারশিপ (Partnership/Team)' : 'Partnership & Co-founders'}
                  </h3>
                  <p className="text-gray-300">
                    {isBn
                      ? 'একাধিক ব্যক্তি মিলে প্রজেক্ট বানালে তাদের মধ্যে লিখিত চুক্তির মাধ্যমে শেয়ার / ইকুইটি নির্ধারণ করতে হবে।'
                      : 'Multiple contributors must execute a written Founders Agreement defining equity and voting shares.'}
                  </p>
                </div>

                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <h3 className="font-bold text-purple-300">
                    {isBn ? 'কোম্পানি বা প্রাতিষ্ঠানিক কাজ (Work-for-Hire)' : 'Company Work-for-Hire'}
                  </h3>
                  <p className="text-gray-300">
                    {isBn
                      ? 'কোনো প্রতিষ্ঠানে চাকরি করার সময় কোম্পানির রিসোর্স বা বেতনে অ্যাপ বানালে মালিকানা হবে উক্ত কোম্পানির।'
                      : 'Software created by employees during employment automatically belongs to the employer.'}
                  </p>
                </div>

                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <h3 className="font-bold text-pink-300">
                    {isBn ? 'ফ্রিল্যান্সার দিয়ে করানো কাজ (Freelance Outsource)' : 'Freelancer Outsource Contract'}
                  </h3>
                  <p className="text-gray-300">
                    {isBn
                      ? 'ফ্রিল্যান্সার দিয়ে কাজ করালে পেমেন্টের পর অবশ্যই "Copyright Assignment Agreement" স্বাক্ষর করে নিতে হবে।'
                      : 'Must execute a Copyright Assignment Agreement transferring all IP from contractor to buyer.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Intellectual Property Types */}
            <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center space-x-3 text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="text-lg font-bold text-white">
                  {isBn ? '২. প্যাটেন্ট (Patent) ও বুদ্ধিবৃত্তিক সম্পত্তি রক্ষা' : '2. Intellectual Property Protection Types'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isBn
                  ? 'সব অ্যাপের জন্য প্যাটেন্ট প্রযোজ্য নয়। আপনার টেকসই প্রজেক্টের সুরক্ষার জন্য এই ৩টি আইনি উপাদান অত্যন্ত গুরুত্বপূর্ণ:'
                  : 'Software protection relies on three distinct legal mechanisms depending on the asset type:'}
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-blue-300">{isBn ? 'কপিরাইট (Copyright)' : 'Copyright'}</h3>
                    <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded font-mono">
                      {isBn ? 'স্বয়ংক্রিয় সুরক্ষা' : 'Automatic'}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {isBn
                      ? 'অ্যাপের সোর্স কোড, ডিজাইন, লোগো, গ্রাফিক্স, আর্টিকেল এবং ভিডিও কনটেন্ট আপনাআপনি কপিরাইটের আওতায় থাকে।'
                      : 'Protects source code, database structures, UI graphics, text content, and multimedia assets.'}
                  </p>
                </div>

                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300">{isBn ? 'ট্রেডমার্ক (Trademark)' : 'Trademark'}</h3>
                    <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono">
                      {isBn ? 'ব্র্যান্ড নাম সুরক্ষা' : 'Brand Name'}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {isBn
                      ? 'অ্যাপ বা ওয়েবসাইটের নাম, লোগো এবং স্লোগান রেজিস্ট্রেশন করার মাধ্যমে ট্রেডমার্ক পাওয়া যায়।'
                      : 'Protects app name, logo, slogan, and icon design against impersonation in Class 9 & Class 42.'}
                  </p>
                </div>

                <div className="p-3 bg-[#131722] rounded-xl border border-[#252C3B] space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-pink-300">{isBn ? 'প্যাটেন্ট (Patent)' : 'Patent'}</h3>
                    <span className="px-2 py-0.5 text-[10px] bg-pink-500/20 text-pink-300 rounded font-mono">
                      {isBn ? 'উদ্ভাবনী প্রযুক্তি' : 'Invention'}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {isBn
                      ? 'সম্পূর্ণ নতুন কোনো টেকনিক্যাল প্রসেস, অ্যালগরিদম বা মেকানিজম উদ্ভাবন করলে প্যাটেন্ট অফিসে আবেদন করতে হয়।'
                      : 'Grants exclusive rights over unique, non-obvious technical processes, mechanisms, or algorithms.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Essential Documents Overview Banner */}
          <div className="bg-[#0B0E14] border border-[#1F2937] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>{isBn ? '৩. মালিকানা নিশ্চিত করার আবশ্যকীয় ৩টি দলিলপত্র' : '3. Essential Legal Documents Checklist'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#11151E] rounded-xl border border-[#1F2937] space-y-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                  Doc #1
                </span>
                <h4 className="font-bold text-white text-sm">Terms of Service (ToS)</h4>
                <p className="text-gray-400">
                  {isBn
                    ? 'ওয়েবসাইটের শর্তাবলী যেখানে স্পষ্ট লেখা থাকে যে অ্যাপটির কোড, লোগো ও কনটেন্টের স্বত্বাধিকারী কে।'
                    : 'Governs user code conduct, explicitly asserts software copyright, and limits financial liability.'}
                </p>
              </div>

              <div className="p-4 bg-[#11151E] rounded-xl border border-[#1F2937] space-y-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">
                  Doc #2
                </span>
                <h4 className="font-bold text-white text-sm">Privacy Policy</h4>
                <p className="text-gray-400">
                  {isBn
                    ? 'ব্যবহারকারীর ইমেইল, ফোন নম্বর, কুকিজ ও ডেটা সুরক্ষা এবং গোপনীয়তা রক্ষার আইনি বিবরণ।'
                    : 'Mandatory policy describing what data is collected, stored, and protected.'}
                </p>
              </div>

              <div className="p-4 bg-[#11151E] rounded-xl border border-[#1F2937] space-y-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded">
                  Doc #3
                </span>
                <h4 className="font-bold text-white text-sm">Non-Disclosure Agreement (NDA)</h4>
                <p className="text-gray-400">
                  {isBn
                    ? 'ডেভেলপার বা টিমের সাথে কাজ করার সময় আইডিয়া ও সোর্স কোড সুরক্ষিত রাখতে এনডিএ স্বাক্ষরিত রাখা।'
                    : 'Binds contractors and employees to absolute confidentiality regarding source code & specs.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 10 ESSENTIAL RULES */}
      {activeSubTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isBn ? 'সফটওয়্যার ও ওয়েবসাইট স্বত্বাধিকারের ১০টি স্বর্ণালী নিয়ম' : '10 Essential Rules for Software Ownership & Patenting'}
              </h2>
              <p className="text-xs text-gray-400">
                {isBn
                  ? 'আইনি জটিলতা ও কপিরাইট চুরির হাত থেকে আপনার অ্যাপ রক্ষা করার জন্য এই ১০টি নিয়ম অনুসরণ করুন:'
                  : 'Follow these golden software development rules to secure your IP against theft and claims:'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {rulesList.map((rule) => {
              const isExpanded = expandedRule === rule.id;
              return (
                <div
                  key={rule.id}
                  className="bg-[#0D1017] border border-[#1F2937] rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all"
                >
                  <div
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-white">{isBn ? rule.titleBn : rule.titleEn}</h3>
                          <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-medium">
                            {isBn ? rule.categoryBn : rule.categoryEn}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{isBn ? rule.summaryBn : rule.summaryEn}</p>
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#1F2937] bg-[#0A0C10] space-y-3 text-xs">
                      <div className="space-y-1.5 text-gray-300 pt-2">
                        <span className="font-bold text-indigo-400">{isBn ? 'বিস্তারিত নিয়মাবলী:' : 'Detailed Rule Provisions:'}</span>
                        <ul className="list-disc list-inside space-y-1 pl-1 text-gray-300">
                          {(isBn ? rule.detailsBn : rule.detailsEn).map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center space-x-2 text-indigo-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          <strong>{isBn ? 'করণীয়:' : 'Action Item:'}</strong> {isBn ? rule.actionItemBn : rule.actionItemEn}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: LEGAL DOC GENERATOR */}
      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Generator Form */}
          <div className="lg:col-span-5 bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>{isBn ? 'এআই আইনি দলিল জেনারেটর' : 'AI Legal Document Generator'}</span>
              </h2>
              <p className="text-xs text-gray-400">
                {isBn
                  ? 'আপনার অ্যাপের তথ্য দিন, জেমিনি এআই তাৎক্ষণিক কাস্টমাইজড প্রফেশনাল চুক্তি ও পলিসি প্রস্তুত করবে:'
                  : 'Enter your app details to generate customized ToS, Privacy Policy, or NDAs instantly:'}
              </p>
            </div>

            <form onSubmit={handleGenerateLegalDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {isBn ? 'দলিলের ধরন (Select Document Type)' : 'Document Type'}
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="tos">{isBn ? 'Terms of Service (ব্যবহারের শর্তাবলী)' : 'Terms of Service'}</option>
                  <option value="privacy">{isBn ? 'Privacy Policy (গোপনীয়তা নীতি)' : 'Privacy Policy'}</option>
                  <option value="nda">{isBn ? 'Non-Disclosure Agreement (NDA - গোপনীয়তা চুক্তি)' : 'Non-Disclosure Agreement (NDA)'}</option>
                  <option value="ip_assignment">{isBn ? 'Freelance Copyright & IP Assignment (কপিরাইট হস্তান্তর চুক্তি)' : 'Freelance Copyright & IP Assignment'}</option>
                  <option value="copyright_header">{isBn ? 'Source Code Copyright Header Notice (কোড ফাইল ফুটার/হেডার)' : 'Source Code Copyright Header'}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {isBn ? 'অ্যাপ / ওয়েবসাইটের নাম (App/Website Name)' : 'App or Website Name'}
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Junior Gemini"
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {isBn ? 'মালিক / কোম্পানির নাম (Entity / Company Name)' : 'Owner / Company Name'}
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Tech Innovators BD / Dulal Sarder"
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {isBn ? 'অ্যাপ ক্যাটাগরি / ধরন (Category)' : 'App Category'}
                </label>
                <input
                  type="text"
                  value={appCategory}
                  onChange={(e) => setAppCategory(e.target.value)}
                  placeholder="e.g. Educational SaaS / E-commerce App"
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {isBn ? 'অতিরিক্ত কোনো শর্ত (Extra Provisions - Optional)' : 'Extra Context'}
                </label>
                <textarea
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  rows={2}
                  placeholder={isBn ? 'যেমন: পেমেন্ট রিফান্ড পলিসি ৭ দিন, বয়স সীমা ১৩ বছর+' : 'e.g. Refund terms, age restriction'}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingDoc}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isGeneratingDoc ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isBn ? 'দলিল তৈরি হচ্ছে...' : 'Generating Legal Doc...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isBn ? 'এআই দলিল তৈরি করুন' : 'Generate Document'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Document Preview Result */}
          <div className="lg:col-span-7 bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl flex flex-col justify-between min-h-[400px]">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  <span>{isBn ? 'প্রস্তুতকৃত আইনি দলিল প্রিভিউ' : 'Generated Document Preview'}</span>
                </h3>

                {generatedDoc && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyDoc}
                      className="px-2.5 py-1 text-xs bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 rounded-lg border border-[#2D3139] flex items-center space-x-1"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কপি' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadDoc}
                      className="px-2.5 py-1 text-xs bg-[#1A1D24] hover:bg-[#252A34] text-gray-200 rounded-lg border border-[#2D3139] flex items-center space-x-1"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
                    </button>
                  </div>
                )}
              </div>

              {isGeneratingDoc ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs text-gray-400">
                    {isBn ? 'জেমীন এআই আপনার অ্যাপের আইনি দলিল ও ধারা খসড়া করছে...' : 'Drafting legal clauses with Gemini AI...'}
                  </p>
                </div>
              ) : generatedDoc ? (
                <div className="flex-1 bg-[#080A0E] p-4 rounded-xl border border-[#1F2937] text-xs font-mono text-gray-200 overflow-y-auto max-h-[450px] whitespace-pre-wrap leading-relaxed">
                  {generatedDoc}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 text-center border border-dashed border-[#252C3B] rounded-xl">
                  <FileText className="w-10 h-10 text-gray-600" />
                  <p className="text-xs text-gray-400 max-w-sm">
                    {isBn
                      ? 'বাম পাশের ফর্ম পূরণ করে "এআই দলিল তৈরি করুন" এ ক্লিক করুন। আপনার প্রজেক্টের জন্য উপযুক্ত ToS, Privacy Policy বা NDA খসড়া পাবেন।'
                      : 'Fill in the form on the left and click "Generate Document" to view your tailored legal agreement.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: AI PATENT & IP EVALUATOR */}
      {activeSubTab === 'evaluator' && (
        <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span>{isBn ? 'এআই প্যাটেন্ট ও স্বত্বাধিকার সম্ভাব্যতা অ্যাসেসর' : 'AI Patentability & IP Readiness Assessor'}</span>
            </h2>
            <p className="text-xs text-gray-400">
              {isBn
                ? 'আপনার অ্যাপের টেকনিক্যাল আইডিয়া, আর্কিটেকচার বা অ্যালগরিদম টাইপ করুন। জেমিনি এআই প্যাটেন্ট সম্ভাবনা, কপিরাইট পরিধি ও লাইসেন্স রিস্ক বিশ্লেষণ করবে:'
                : 'Describe your app idea, architecture, or algorithm. Gemini AI will evaluate patentability score, copyright scope, and trademark class:'}
            </p>
          </div>

          <form onSubmit={handleEvaluateIdea} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {isBn ? 'আপনার প্রজেক্ট / ফিচার বিবরণ (App Feature or Architecture Description)' : 'App Description'}
              </label>
              <textarea
                value={appIdeaText}
                onChange={(e) => setAppIdeaText(e.target.value)}
                rows={4}
                placeholder={
                  isBn
                    ? 'যেমন: একটি এআই চালিত এগ্রিকালচারাল অ্যাপ যা ক্যাটেরিয়া দিয়ে মাটির পিএইচ এবং ক্যামেরার ছবি বিশ্লেষণ করে রিয়েল-টাইমে সার ব্যবহারের পরিমাণ হিসাব করে...'
                    : 'e.g. An AI-powered agricultural app that analyzes soil pH and crop camera images to calculate real-time fertilizer dosage...'
                }
                className="w-full bg-[#131722] border border-[#252C3B] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isEvaluating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isBn ? 'আইনি বিশ্লেষণ চলছে...' : 'Evaluating Patentability...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{isBn ? 'প্যাটেন্ট ও আইপি মূল্যায়ন করুন' : 'Evaluate Patentability & IP'}</span>
                </>
              )}
            </button>
          </form>

          {/* Eval Result */}
          {evalResult && (
            <div className="bg-[#080A0E] p-5 rounded-xl border border-[#1F2937] text-xs text-gray-200 whitespace-pre-wrap leading-relaxed space-y-2">
              <div className="flex items-center space-x-2 text-pink-400 font-bold border-b border-[#1F2937] pb-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{isBn ? 'জেমিনি আইনি বিশ্লেষণ রিপোর্ট:' : 'Gemini IP & Patentability Assessment Report:'}</span>
              </div>
              {evalResult}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: INTERACTIVE CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>{isBn ? 'ডেভেলপার ও স্টার্টআপ আইনি ড্যাশবোর্ড চেকলিস্ট' : 'Developer & Startup Legal Readiness Checklist'}</span>
              </h2>
              <p className="text-xs text-gray-400">
                {isBn
                  ? 'আপনার অ্যাপ বা ওয়েবসাইটকে পূর্ণাঙ্গ আইনি সুরক্ষা দিতে নিচের ১০টি কাজ সম্পন্ন হয়েছে কিনা টিক দিন:'
                  : 'Check off these 10 legal items to ensure complete software protection:'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-green-400">{completionPercentage}%</span>
              <p className="text-[10px] text-gray-400">{completedCount} / 10 {isBn ? 'সম্পন্ন' : 'Completed'}</p>
            </div>
          </div>

          {/* Interactive Checkbox Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'item1', labelBn: 'সোর্স কোডের সকল ফাইল হেডারে Copyright Notice যুক্ত করা হয়েছে', labelEn: 'Copyright notice headers added to all core source code files' },
              { id: 'item2', labelBn: 'পার্টনার/টিম মেম্বারদের সঙ্গে লিখিত Founders Agreement স্বাক্ষর করা হয়েছে', labelEn: 'Written Founders Agreement signed among team co-founders' },
              { id: 'item3', labelBn: 'ফ্রিল্যান্সারের কাছ থেকে Copyright & IP Assignment নথি সংগ্রহ করা হয়েছে', labelEn: 'Signed Copyright & IP Assignment Agreement collected from freelancers' },
              { id: 'item4', labelBn: 'package.json এর ওপেন-সোর্স লাইসেন্স (GPL risk) অডিট করা হয়েছে', labelEn: 'Open-source package dependency license audit performed' },
              { id: 'item5', labelBn: 'অ্যাপের নাম ও লোগোর ট্রেডমার্ক সার্চ (Class 9 / 42) সম্পন্ন করা হয়েছে', labelEn: 'Trademark availability searched for Class 9 and Class 42' },
              { id: 'item6', labelBn: 'ওয়েবসাইটে প্রফেশনাল Terms of Service (ToS) যুক্ত করা হয়েছে', labelEn: 'Professional Terms of Service published on website domain' },
              { id: 'item7', labelBn: 'ওয়েবসাইটে প্রফেশনাল Privacy Policy যুক্ত করা হয়েছে', labelEn: 'Compliant Privacy Policy published on website domain' },
              { id: 'item8', labelBn: 'বহিরাগত ডেভেলপারদের সাথে কাজের পূর্বে NDA স্বাক্ষর করানো হয়েছে', labelEn: 'Signed NDA executed before sharing repository access with external devs' },
              { id: 'item9', labelBn: 'GitHub / GitLab এ টাইমস্ট্যাম্পযুক্ত জিট কমিট প্রমাণ হিসেবে রাখা হয়েছে', labelEn: 'Timestamped git commit history backed up on GitHub/GitLab' },
              { id: 'item10', labelBn: 'উদ্ভাবনী অ্যালগরিদম থাকলে প্যাটেন্ট আবেদনের খসড়া প্রস্তুত করা হয়েছে', labelEn: 'Provisional patent draft prepared for novel technical algorithms' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                  checkedItems[item.id]
                    ? 'bg-green-500/10 border-green-500/30 text-white'
                    : 'bg-[#131722] border-[#252C3B] text-gray-400 hover:text-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => {}}
                  className="mt-0.5 rounded border-gray-700 text-green-500 focus:ring-green-500"
                />
                <span className={`text-xs ${checkedItems[item.id] ? 'font-semibold text-green-200' : ''}`}>
                  {isBn ? item.labelBn : item.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: PITCH & GRANT STUDIO */}
      {activeSubTab === 'pitch' && (
        <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="border-b border-[#1F2937] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-amber-400" />
              <span>{isBn ? 'গুগল গ্র্যান্ট, ফান্ডিং ও সিএসআর পিচ জেনারেটর' : 'Google Grant, Funding & CSR Pitch Generator'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isBn
                ? 'Mati AI (মাটি এআই) দেশের প্রতিটি শিক্ষার্থীর কাছে বিনামূল্যে পৌঁছানোর জন্য প্রয়োজনীয় অফিসিয়াল আবেদনপত্র প্রস্তুত করুন:'
                : 'Generate tailored official funding, grant, and corporate CSR applications to take Mati AI nationwide:'}
            </p>
          </div>

          <form onSubmit={handleGeneratePitch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {isBn ? 'আবেদনের ধরন (Pitch Category):' : 'Pitch Category:'}
                </label>
                <select
                  value={pitchType}
                  onChange={(e) => setPitchType(e.target.value)}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="google_for_startups">{isBn ? '১. গুগল ফর স্টার্টআপস / ক্লাউড ক্রেডিট আবেদন (Google Cloud Grants)' : '1. Google Cloud / Startups Grant Application'}</option>
                  <option value="ict_division_grant">{isBn ? '২. তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ (iDEA / Startup BD Grant)' : '2. ICT Division Bangladesh Innovation Grant'}</option>
                  <option value="school_outreach_letter">{isBn ? '৩. স্কুলে ওয়ার্কশপ আয়োজনের অনুমতিপত্র (Principal Proposal Letter)' : '3. School Workshop Permission Proposal Letter'}</option>
                  <option value="telecom_csr_sponsorship">{isBn ? '৪. টেলিকম ও ডোমেইন স্পন্সরশিপ (Zero-Rating / CSR Sponsorship)' : '4. Telecom Zero-Rating / CSR Sponsorship'}</option>
                  <option value="workshop_outline">{isBn ? '৫. ৪৫ মিনিটের অনলাইন/অফলাইন এআই ওয়ার্কশপ স্লাইড প্ল্যান' : '5. 45-Min AI Workshop Slide Plan & Script'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {isBn ? 'প্রজেক্ট/সংস্থার নাম (Org / App Name):' : 'Org / App Name:'}
                </label>
                <input
                  type="text"
                  value={pitchAppTitle}
                  onChange={(e) => setPitchAppTitle(e.target.value)}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Mati AI (মাটি এআই)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {isBn ? 'আবেদনকারী বা প্রতিষ্ঠানের নাম:' : 'Applicant / Team Name:'}
                </label>
                <input
                  type="text"
                  value={pitchOrgName}
                  onChange={(e) => setPitchOrgName(e.target.value)}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Mati AI Educational Foundation"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {isBn ? 'টার্গেট অডিয়েন্স / বেনিফিশিয়ারি:' : 'Target Beneficiaries:'}
                </label>
                <input
                  type="text"
                  value={pitchAudience}
                  onChange={(e) => setPitchAudience(e.target.value)}
                  className="w-full bg-[#131722] border border-[#252C3B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Students & youth across Bangladesh"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                {isBn ? 'অতিরিক্ত বিবরণ বা বিশেষ চাওয়া (Special Requirements):' : 'Special Requirements:'}
              </label>
              <textarea
                value={pitchExtra}
                onChange={(e) => setPitchExtra(e.target.value)}
                rows={2}
                className="w-full bg-[#131722] border border-[#252C3B] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder={isBn ? 'যেমন: গ্রামে ইন্টারনেটের কম স্পিডে চালানো এবং ফ্রিতে বাংলা এআই শেখানোর গুরুত্ব নির্দেশ করুন।' : 'e.g., Focus on low-bandwidth access and Bengali natural language learning.'}
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingPitch}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              {isGeneratingPitch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isBn ? 'পিচ ডকুমেন্ট জেনারেট হচ্ছে...' : 'Generating Pitch Document...'}</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>{isBn ? 'অফিসিয়াল আবেদন/পিচ ডকুমেন্ট তৈরি করুন' : 'Generate Formal Pitch Document'}</span>
                </>
              )}
            </button>
          </form>

          {/* Render Generated Pitch */}
          {generatedPitch && (
            <div className="space-y-3 pt-4 border-t border-[#1F2937]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? 'প্রস্তুতকৃত অফিসিয়াল আবেদনপত্র:' : 'Generated Official Proposal:'}</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPitch);
                    alert(isBn ? 'পিচ ডকুমেন্টটি কপি হয়েছে!' : 'Pitch copied!');
                  }}
                  className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs rounded-lg flex items-center space-x-1 border border-amber-500/30"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কপি করুন' : 'Copy Pitch'}</span>
                </button>
              </div>

              <div className="bg-[#080A0E] p-5 rounded-xl border border-[#1F2937] text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {generatedPitch}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: SCHOOL OUTREACH & AMBASSADOR KIT */}
      {activeSubTab === 'ambassador' && (
        <div className="bg-[#0D1017] border border-[#1F2937] p-6 rounded-2xl space-y-6">
          <div className="border-b border-[#1F2937] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>{isBn ? 'স্কুল, কলেজ ও ক্যাম্পাস অ্যাম্বাসেডর অ্যাকশন কিট' : 'School, College & Campus Ambassador Action Kit'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isBn
                ? 'দেশব্যাপী শিক্ষার্থীদের কাছে মাটি এআই পৌঁছে দিতে ক্যাম্পাস প্রতিনিধি ও শিক্ষকদের জন্য ধাপে ধাপে গাইড:'
                : 'Step-by-step roadmap for campus ambassadors and teachers to distribute Mati AI across Bangladesh:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step 1 */}
            <div className="bg-[#131722] p-4 rounded-xl border border-[#252C3B] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Building2 className="w-4 h-4" />
                <span>{isBn ? '১. প্রধান শিক্ষক / আইসিটি টিচারের অনুমতি' : '1. School Permission'}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {isBn
                  ? 'আমাদের "ফান্ডিং ও পিচ জেনারেটর" থেকে স্কুলে ওয়ার্কশপের আবেদনপত্র প্রিন্ট নিয়ে স্কুলের প্রধান শিক্ষক বা কম্পিউটার ল্যাবের শিক্ষকের কাছে জমা দিন।'
                  : 'Print the School Workshop Proposal Letter from our Pitch Generator and submit it to school authorities.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#131722] p-4 rounded-xl border border-[#252C3B] space-y-2">
              <div className="flex items-center space-x-2 text-teal-400 font-bold">
                <Globe2 className="w-4 h-4" />
                <span>{isBn ? '২. ৪৫ মিনিটের ফ্রি এআই সেমিনার' : '2. 45-Min Free Workshop'}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {isBn
                  ? 'শিক্ষার্থীদের কাছে সরাসরি Mati AI (মাটি এআই) খুলে কোডিং, পড়ালেখায় এআই অ্যাসিস্ট্যান্ট এবং নতুন আইডিয়া সুরক্ষার কৌশলগুলো লাইভ দেখান।'
                  : 'Demonstrate live Mati AI features: coding tutor, study assistant, and app patent protection to students.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#131722] p-4 rounded-xl border border-[#252C3B] space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Send className="w-4 h-4" />
                <span>{isBn ? '৩. ক্যাম্পাস ক্লাসিক ও অ্যাম্বাসেডর ক্লাব' : '3. Campus Ambassadors'}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {isBn
                  ? 'প্রতিটি স্কুল বা কলেজে ২ জন উদ্যমী শিক্ষার্থীকে "Mati AI Ambassador" বানিয়ে ক্লাব চালু করুন, যাতে তারা অন্য বন্ধুদের শিখতে সাহায্য করতে পারে।'
                  : 'Appoint 2 student ambassadors per institution to maintain a local tech club and mentor peers.'}
              </p>
            </div>
          </div>

          {/* Quick Action Button to generate outreach letter */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-300">
                {isBn ? 'আপনার এলাকার স্কুলের জন্য আবেদনপত্র দরকার?' : 'Need a tailored proposal letter for your local school?'}
              </p>
              <p className="text-[11px] text-gray-400">
                {isBn ? 'এক ক্লিকে স্কুলের প্রধান শিক্ষকের বরাবরে আবেদন তৈরি করুন' : 'Generate a formal letter addressed to the school principal in seconds'}
              </p>
            </div>
            <button
              onClick={() => {
                setPitchType('school_outreach_letter');
                setActiveSubTab('pitch');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-2 whitespace-nowrap"
            >
              <Rocket className="w-4 h-4" />
              <span>{isBn ? 'আবেদনপত্র তৈরি করুন' : 'Draft Letter Now'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
