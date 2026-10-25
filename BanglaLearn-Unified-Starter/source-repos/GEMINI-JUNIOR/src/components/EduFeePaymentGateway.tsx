import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle2, Search, Building2, GraduationCap, FileText, Download, ShieldCheck, Zap, ArrowRight, Lock, Receipt, QrCode, Sparkles } from 'lucide-react';

interface EduFeePaymentGatewayProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

interface EducationalBill {
  studentId: string;
  studentNameBn: string;
  studentNameEn: string;
  institutionBn: string;
  institutionEn: string;
  billTypeBn: string;
  billTypeEn: string;
  billMonth: string;
  amountBdt: number;
  dueDate: string;
  status: 'Unpaid' | 'Paid';
}

export const EduFeePaymentGateway: React.FC<EduFeePaymentGatewayProps> = ({ lang }) => {
  const isBn = lang === 'bn';

  const [activeTab, setActiveTab] = useState<'courses' | 'edu_bills'>('edu_bills');
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay' | 'card'>('bkash');
  
  // Bill Lookup State
  const [inputStudentId, setInputStudentId] = useState<string>('STUDENT-2026-894');
  const [fetchedBill, setFetchedBill] = useState<EducationalBill | null>({
    studentId: 'STUDENT-2026-894',
    studentNameBn: 'আব্দুল্লাহ আল মামুন',
    studentNameEn: 'Abdullah Al Mamun',
    institutionBn: 'ঢাকা কলেজ (Dhaka College)',
    institutionEn: 'Dhaka College',
    billTypeBn: 'এইচএসসি ২০২৬ বোর্ড পরীক্ষার ফি ও টিউশন ফি',
    billTypeEn: 'HSC 2026 Board Exam & Tuition Fee',
    billMonth: 'জুলাই ২০২৬',
    amountBdt: 1850,
    dueDate: '৩০ জুলাই ২০২৬',
    status: 'Unpaid',
  });
  const [isSearchingBill, setIsSearchingBill] = useState<boolean>(false);

  // Course Subscription Options
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; nameBn: string; nameEn: string; priceBdt: number; duration: string }>({
    id: 'c_1',
    nameBn: 'মাটি এআই অল-এক্সেস গোল্ড মেম্বারশিপ (১ বছর)',
    nameEn: 'MATI AI All-Access Gold Pass (1 Year)',
    priceBdt: 990,
    duration: '১ বছর (12 Months)',
  });

  // Payment Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('01700000000');
  const [transactionPin, setTransactionPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{
    trxId: string;
    paidAmount: number;
    payerNumber: string;
    recipient: string;
    date: string;
  } | null>(null);

  const handleSearchBill = () => {
    if (!inputStudentId.trim()) return;
    setIsSearchingBill(true);
    setTimeout(() => {
      setIsSearchingBill(false);
      setFetchedBill({
        studentId: inputStudentId,
        studentNameBn: 'তামিম ইকবাল',
        studentNameEn: 'Tamim Iqbal',
        institutionBn: 'ভিকারুন্নিসা নূন স্কুল ও কলেজ',
        institutionEn: 'Viqarunnisa Noon School & College',
        billTypeBn: 'মাসিক টিউশন ফি ও আইসিটি ল্যাব ফি',
        billTypeEn: 'Monthly Tuition & ICT Lab Fee',
        billMonth: 'জুলাই ২০২৬',
        amountBdt: 1450,
        dueDate: '৩১ জুলাই ২০২৬',
        status: 'Unpaid',
      });
    }, 600);
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const trx = 'TRX' + Math.floor(10000000 + Math.random() * 90000000);
      const paidAmt = activeTab === 'edu_bills' ? fetchedBill?.amountBdt || 1850 : selectedCourse.priceBdt;
      const targetName = activeTab === 'edu_bills' ? fetchedBill?.institutionBn : selectedCourse.nameBn;

      setPaymentReceipt({
        trxId: trx,
        paidAmount: paidAmt,
        payerNumber: mobileNumber,
        recipient: targetName || 'MATI AI Education Portal',
        date: new Date().toLocaleString(),
      });

      if (activeTab === 'edu_bills' && fetchedBill) {
        setFetchedBill({ ...fetchedBill, status: 'Paid' });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#E6E8EB] max-w-7xl mx-auto pb-10">
      
      {/* Header Banner */}
      <div className="card-3d bg-gradient-to-r from-blue-950/70 via-indigo-900/50 to-[#0F121A] p-6 rounded-3xl border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-pink-500/20 border border-white/20 shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isBn ? '💳 ডিজিটাল পেমেন্ট গেটওয়ে ও শিক্ষা বিল পে' : '💳 Local Payment & Educational Fee Gateway'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full">
                bKash • Nagad • Rocket
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              {isBn
                ? 'বাংলাদেশের জনপ্রিয় মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট, উপায়) ও যেকোনো ব্যাংকের কার্ড দিয়ে সরাসরি কোর্স সাবস্ক্রিপশন এবং স্কুল, কলেজ, বিশ্ববিদ্যালয়ের যাবতীয় সরকারি-বেসরকারি টিউশন ফি ও পরীক্ষার ফি পরিশোধ করুন।'
                : 'Pay for courses and all school, college, university tuition & board exam fees instantly via bKash, Nagad, Rocket, Upay or Visa/Mastercard.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#141824] px-4 py-2 rounded-2xl border border-[#252E44]">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-300 font-mono">
            {isBn ? '১০০% নিরাপদ ও এনক্রিপ্টেড' : '100% Encrypted & Safe'}
          </span>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex space-x-2 border-b border-[#22283A] pb-3">
        <button
          onClick={() => {
            setActiveTab('edu_bills');
            setPaymentReceipt(null);
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition-all border ${
            activeTab === 'edu_bills'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/25'
              : 'bg-[#141824] text-gray-400 border-[#22283A] hover:text-white hover:bg-[#1C2234]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isBn ? '🏛️ শিক্ষাপ্রতিষ্ঠান ও বোর্ড ফি পরিশোধ' : '🏛️ School / College / Gov Fees'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('courses');
            setPaymentReceipt(null);
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 transition-all border ${
            activeTab === 'courses'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-lg shadow-pink-500/25'
              : 'bg-[#141824] text-gray-400 border-[#22283A] hover:text-white hover:bg-[#1C2234]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isBn ? '🎓 প্রিমিয়াম কোর্স সাবস্ক্রিপশন' : '🎓 Course Pass & Subscriptions'}</span>
        </button>
      </div>

      {/* Mode 1: Educational Bill Lookup & Payment */}
      {activeTab === 'edu_bills' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bill Search & Fetch Form */}
          <div className="lg:col-span-6 card-3d bg-[#121622] p-6 rounded-3xl border border-[#232B3E] space-y-5">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>{isBn ? 'স্টুডেন্ট আইডি বা রোল নম্বর দিয়ে বিল খুঁজুন' : 'Search Bill by Student Roll / ID'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isBn ? 'বাংলাদেশের সকল সরকারি-বেসরকারি স্কুল, কলেজ, বোর্ড পরীক্ষা ও বিশ্ববিদ্যালয় বিল অটো-ফেচ করুন' : 'Auto-fetch tuition, board exam, and hall fees for any institution'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300 block">
                {isBn ? 'শিক্ষার্থী আইডি / রোল / বিল নম্বর:' : 'Student ID / Roll Number:'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputStudentId}
                  onChange={(e) => setInputStudentId(e.target.value)}
                  placeholder="e.g. STUDENT-2026-894"
                  className="w-full pl-4 pr-28 py-3 rounded-2xl bg-[#0B0D14] border border-[#2A3144] focus:border-blue-500 text-sm font-mono text-white focus:outline-none"
                />
                <button
                  onClick={handleSearchBill}
                  className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {isSearchingBill ? (isBn ? 'খোঁজা হচ্ছে...' : 'Searching...') : (isBn ? 'বিল আনুন' : 'Fetch Bill')}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-[#1F2638] space-y-2 text-xs">
              <span className="text-gray-400 font-semibold">{isBn ? 'উদাহরণ প্রতিষ্ঠান:' : 'Preset Institutions:'}</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'ঢাকা কলেজ', id: 'STUDENT-2026-894' },
                  { name: 'ভিকারুন্নিসা', id: 'VIQAR-2026-302' },
                  { name: 'বুয়েট ভর্তি ফর্ম', id: 'BUET-ADM-1029' },
                  { name: 'বিসিএস আবেদন ফি', id: 'BCS-FEE-45' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setInputStudentId(p.id);
                      handleSearchBill();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#181E2C] hover:bg-[#232C40] text-gray-300 border border-[#2B354C] transition-all font-medium"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fetched Bill Detail Card */}
          <div className="lg:col-span-6">
            {fetchedBill ? (
              <div className="card-3d bg-[#121622] p-6 rounded-3xl border border-blue-500/40 space-y-5">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center space-x-2">
                    <Receipt className="w-5 h-5 text-blue-400" />
                    <span className="font-extrabold text-sm text-white">{isBn ? 'বিল স্টেটমেন্ট বিবরণ' : 'Bill Details Statement'}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    fetchedBill.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {fetchedBill.status === 'Paid' ? (isBn ? '✅ পরিশোধিত (Paid)' : 'Paid') : (isBn ? '⏳ অপরিশোধিত (Unpaid)' : 'Unpaid')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#0B0D14] p-4 rounded-2xl border border-[#1E2536] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isBn ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}</span>
                      <span className="font-bold text-white">{isBn ? fetchedBill.studentNameBn : fetchedBill.studentNameEn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isBn ? 'শিক্ষাপ্রতিষ্ঠান:' : 'Institution:'}</span>
                      <span className="font-bold text-blue-300">{isBn ? fetchedBill.institutionBn : fetchedBill.institutionEn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isBn ? 'বিল বিবরণ:' : 'Fee Description:'}</span>
                      <span className="font-bold text-amber-300">{isBn ? fetchedBill.billTypeBn : fetchedBill.billTypeEn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isBn ? 'শেষ তারিখ:' : 'Due Date:'}</span>
                      <span className="font-mono text-gray-300">{fetchedBill.dueDate}</span>
                    </div>
                  </div>

                  {/* Total Payable Amount */}
                  <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-4 rounded-2xl border border-blue-500/40 flex items-center justify-between">
                    <span className="font-bold text-gray-200">{isBn ? 'মোট প্রদেয় ফি (Total Amount):' : 'Total Amount:'}</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ৳ {fetchedBill.amountBdt} BDT
                    </span>
                  </div>
                </div>

                {fetchedBill.status === 'Unpaid' ? (
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <span>{isBn ? 'এখনই ফি পরিশোধ করুন' : 'Pay Fee Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center text-xs text-emerald-300 font-bold">
                    🎉 {isBn ? 'বিল পরিশোধ সফল হয়েছে! ট্রানজেকশন রিসিভ ডাউনলোড করুন।' : 'Bill paid successfully! Receipt generated.'}
                  </div>
                )}
              </div>
            ) : (
              <div className="card-3d bg-[#121622] p-8 rounded-3xl border border-[#232B3E] text-center space-y-3">
                <Search className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400 font-medium">
                  {isBn ? 'উপরে স্টুডেন্ট আইডি বা রোল দিয়ে বিল সার্চ করুন' : 'Enter student roll/ID above to search bill.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Mode 2: Course Subscription */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'c_1',
              nameBn: 'মাটি এআই অল-এক্সেস গোল্ড পাস',
              nameEn: 'MATI AI All-Access Gold Pass',
              priceBdt: 990,
              duration: '১ বছর (12 Months)',
              featuresBn: ['সকল ১ম-১২ম শ্রেণী টিউটোরিয়াল', 'বিসিএস ও ভার্সিটি কুইজ সিমুলেটর', 'অফলাইন সীমাহীন ডাউনলোড'],
              color: 'from-amber-600 to-yellow-600',
            },
            {
              id: 'c_2',
              nameBn: 'বিসিএস ও সরকারি চাকরি মেগা ব্যাচ',
              nameEn: 'BCS & Gov Job Mega Pass',
              priceBdt: 1490,
              duration: 'লাইফটাইম (Lifetime)',
              featuresBn: ['২০০+ মক টেস্ট ও লাইভ প্র্যাকটিস', 'আন্তর্জাতিক ও গণিত মাস্টার ক্লাস', 'পিডিএফ নোট ও সাজেশন'],
              color: 'from-purple-600 to-indigo-600',
            },
            {
              id: 'c_3',
              nameBn: 'এসএসসি/এইচএসসি ১০০% স্পেশাল ফাইনাল পাস',
              nameEn: 'SSC/HSC Special Final Exam Pass',
              priceBdt: 650,
              duration: '৬ মাস (6 Months)',
              featuresBn: ['সকল বিষয়ে সৃজনশীল সাজেশন', 'শিক্ষক-ছাত্র লাইভ টিউটরিয়াল', 'এআই ডায়াগ্রাম জেনারেটর'],
              color: 'from-blue-600 to-teal-600',
            },
          ].map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className={`card-3d bg-[#121622] p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 cursor-pointer ${
                selectedCourse.id === c.id ? 'border-pink-500 shadow-xl shadow-pink-500/20' : 'border-[#232B3E]'
              }`}
            >
              <div className="space-y-3">
                <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold bg-gradient-to-r ${c.color} text-white shadow-md inline-block`}>
                  {c.duration}
                </span>

                <h3 className="font-extrabold text-base text-white">
                  {isBn ? c.nameBn : c.nameEn}
                </h3>

                <div className="text-3xl font-black text-emerald-400 font-mono">
                  ৳ {c.priceBdt} <span className="text-xs text-gray-400 font-sans">BDT</span>
                </div>

                <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-[#1F2638]">
                  {c.featuresBn.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedCourse(c);
                  setShowCheckoutModal(true);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
              >
                {isBn ? 'পাসটি সাবস্ক্রাইব করুন' : 'Enroll Now'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment Checkout Modal (bKash/Nagad/Rocket/Upay/Card) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0F121A] border border-pink-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white card-3d">
            
            <div className="flex items-center justify-between border-b border-[#252C3E] pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-pink-400" />
                <span className="font-extrabold text-sm text-pink-400 uppercase tracking-wider">
                  {isBn ? 'সুরক্ষিত মোবাইল ব্যাংকিং গেটওয়ে' : 'Secure Payment Checkout'}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setPaymentReceipt(null);
                }}
                className="px-3 py-1 rounded-xl bg-[#1E2434] hover:bg-[#2A3248] text-xs font-bold text-gray-300"
              >
                ✕ {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>

            {/* Receipt display if payment finished */}
            {paymentReceipt ? (
              <div className="space-y-4 bg-emerald-950/30 border border-emerald-500/50 p-5 rounded-2xl">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto font-bold text-xl shadow-lg shadow-emerald-500/30">
                    ✓
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-300">
                    {isBn ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {isBn ? 'অফিশিয়াল ডিজিটাল মানি রিসিভ জেনারেট হয়েছে' : 'Official Money Receipt Generated'}
                  </p>
                </div>

                <div className="bg-[#090C12] p-4 rounded-xl border border-[#1E2536] text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TrxID:</span>
                    <span className="font-bold text-amber-300">{paymentReceipt.trxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isBn ? 'পরিমাণ:' : 'Amount:'}</span>
                    <span className="font-bold text-emerald-400">৳ {paymentReceipt.paidAmount} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isBn ? 'প্রদানকারী নাম্বার:' : 'Payer:'}</span>
                    <span>{paymentReceipt.payerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isBn ? 'তারিখ:' : 'Date:'}</span>
                    <span>{paymentReceipt.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  {isBn ? 'ড্যাশবোর্ডে ফিরে যান' : 'Return to Dashboard'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">
                    {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Method:'}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'bkash', name: 'bKash', color: 'bg-pink-600' },
                      { name: 'Nagad', id: 'nagad', color: 'bg-orange-600' },
                      { name: 'Rocket', id: 'rocket', color: 'bg-purple-600' },
                      { name: 'Upay', id: 'upay', color: 'bg-yellow-600' },
                      { name: 'Card', id: 'card', color: 'bg-blue-600' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id as any)}
                        className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all border ${
                          selectedMethod === m.id
                            ? `${m.color} text-white border-white shadow-md scale-105`
                            : 'bg-[#181D2A] text-gray-400 border-[#2B3346] hover:bg-[#232A3E]'
                        }`}
                      >
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Input */}
                <div className="space-y-3 bg-[#131722] p-4 rounded-2xl border border-[#252C3E] text-xs">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {isBn ? `${selectedMethod.toUpperCase()} অ্যাকাউন্ট মোবাইল নম্বর:` : `Enter ${selectedMethod.toUpperCase()} Number:`}
                    </label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#2A3144] text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {isBn ? 'অ্যাকাউন্ট পিন (PIN/OTP সিমুলেশন):' : 'Enter PIN / OTP:'}
                    </label>
                    <input
                      type="password"
                      value={transactionPin}
                      onChange={(e) => setTransactionPin(e.target.value)}
                      placeholder="••••"
                      className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#2A3144] text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400">{isBn ? 'প্রদেয় মূল্য:' : 'Payable:'}</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ৳ {activeTab === 'edu_bills' ? fetchedBill?.amountBdt : selectedCourse.priceBdt} BDT
                  </span>
                </div>

                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <span>{isBn ? 'পেমেন্ট প্রসেস করা হচ্ছে...' : 'Processing Payment...'}</span>
                  ) : (
                    <span>{isBn ? 'পেমেন্ট কনফার্ম করুন' : 'Confirm Payment'}</span>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
