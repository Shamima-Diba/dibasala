import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Truck,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  ShoppingBag,
  CreditCard,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BarChart3,
  Users,
  ShieldCheck,
  Zap,
  Calculator,
  RefreshCw,
  Send,
  Boxes,
  Award
} from 'lucide-react';

interface BusinessEntrepreneurLabProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

export const BusinessEntrepreneurLab: React.FC<BusinessEntrepreneurLabProps> = ({ lang }) => {
  const isBn = lang === 'bn';

  const [activeModule, setActiveModule] = useState<'banking' | 'distribution' | 'marketing'>('banking');

  // ================= BANKING BUSINESS STATE =================
  const [bankDeposit, setBankDeposit] = useState<number>(1000000); // 10 Lakh BDT Total Deposit
  const [depositInterestRate, setDepositInterestRate] = useState<number>(6); // 6% Deposit Rate paid to depositors
  const [loanInterestRate, setLoanInterestRate] = useState<number>(12); // 12% Loan Rate charged to borrowers
  const [reserveRatio, setReserveRatio] = useState<number>(10); // 10% Cash Reserve Ratio (CRR)
  const [badLoanPercent, setBadLoanPercent] = useState<number>(3); // 3% Non-Performing Loans (NPL)

  // Calculated Banking Values
  const requiredReserve = (bankDeposit * reserveRatio) / 100;
  const lendableCapital = bankDeposit - requiredReserve;
  const goodLendable = lendableCapital * (1 - badLoanPercent / 100);
  const badLendable = lendableCapital * (badLoanPercent / 100);

  const totalInterestIncome = (goodLendable * loanInterestRate) / 100;
  const totalDepositExpense = (bankDeposit * depositInterestRate) / 100;
  const netBankingProfit = totalInterestIncome - totalDepositExpense - badLendable;

  // ================= DISTRIBUTION MANAGEMENT STATE =================
  const [factoryUnitPrice, setFactoryUnitPrice] = useState<number>(100); // Factory Cost BDT 100
  const [distributorMarginPercent, setDistributorMarginPercent] = useState<number>(15); // 15% Margin
  const [retailerMarginPercent, setRetailerMarginPercent] = useState<number>(20); // 20% Margin
  const [monthlyOrderQuantity, setMonthlyOrderQuantity] = useState<number>(5000); // 5000 units
  const [transportLossPercent, setTransportLossPercent] = useState<number>(2); // 2% Damage/Loss
  const [salesCommissionPercent, setSalesCommissionPercent] = useState<number>(3); // 3% Rep Commission

  // Calculated Distribution Values
  const distributorBuyPrice = factoryUnitPrice;
  const distributorSellPrice = distributorBuyPrice * (1 + distributorMarginPercent / 100);
  const retailerSellPrice = distributorSellPrice * (1 + retailerMarginPercent / 100);

  const totalUnitsShipped = monthlyOrderQuantity;
  const effectiveUnitsSold = totalUnitsShipped * (1 - transportLossPercent / 100);
  const grossDistributorRevenue = effectiveUnitsSold * distributorSellPrice;
  const distributorProductCost = totalUnitsShipped * distributorBuyPrice;
  const salesCommissionExpense = (grossDistributorRevenue * salesCommissionPercent) / 100;
  const distributorNetProfit = grossDistributorRevenue - distributorProductCost - salesCommissionExpense;

  // ================= MARKETING & AI CAMPAIGN STATE =================
  const [adBudget, setAdBudget] = useState<number>(50000); // BDT 50,000 Campaign Budget
  const [targetAudience, setTargetAudience] = useState<string>('তরুণ শিক্ষার্থী ও যুব সমাজ (১৮-২৮ বছর)');
  const [marketingChannel, setMarketingChannel] = useState<'facebook' | 'youtube' | 'tiktok' | 'campus_event'>('facebook');
  
  const [aiMarketingPlan, setAiMarketingPlan] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // AI Marketing Generator
  const generateMarketingStrategy = async () => {
    setIsGeneratingPlan(true);
    setAiMarketingPlan('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `[Business & Marketing Strategy Prompt]: 
              Create a practical, high-converting digital marketing campaign plan in Bengali for a Bangladeshi startup/brand.
              Budget: BDT ${adBudget.toLocaleString('bn-BD')} Taka.
              Target Audience: ${targetAudience}.
              Selected Channel: ${marketingChannel.toUpperCase()}.
              Provide 4 actionable steps: Target Customer Persona, Ad Content/Hook Idea, Expected CAC & ROI, and AI Optimization Trick.`
            }
          ],
          mode: 'chat'
        })
      });
      const data = await response.json();
      if (data.reply) {
        setAiMarketingPlan(data.reply);
      } else {
        setAiMarketingPlan('ক্যাম্পেইন প্ল্যান তৈরি করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setAiMarketingPlan('এআই সার্ভারে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950 via-[#131622] to-emerald-950 border border-amber-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black tracking-wide uppercase flex items-center space-x-1.5 shadow-sm">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>ব্যবসায়িক অভিজ্ঞতা ও ফিনটেক ল্যাব (Practical Business & FinTech)</span>
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold">
                GenZ উমেদার ও তরুণ উদ্যোক্তা
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              বাস্তবমুখী ব্যাংক বিজনেস, ডিসট্রিবিউশন ও মার্কেটিং সিমুলেটর
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
              শুধুমাত্র বইয়ের মুখস্থ বিদ্যা নয়—শিক্ষার্থীরা স্কুলে/কলেজে পড়ার পাশাপাশি ব্যাংকিং সুদের মার্জিন, ডিসট্রিবিউটর সাপ্লাই চেইন এবং এআই মার্কেটিং ক্যাম্পেইন নিজেই পরিচালনা করে একজন দূরদর্শী উদ্যোক্তা হিসেবে গড়ে উঠবে।
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="p-3 bg-[#0F1117] border border-amber-500/30 rounded-2xl text-center space-y-0.5">
              <div className="text-[10px] text-gray-400 uppercase font-bold">শিখন দক্ষতা</div>
              <div className="text-sm font-black text-amber-300">ব্যাংকিং + সাপ্লাই চেইন</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'banking', label: '১. ব্যাংকিং বিজনেস ম্যানেজমেন্ট', icon: Building2, desc: 'আমানত, ঋণ, সুদ ও এনপিএল রিস্ক সিমুলেশন' },
          { id: 'distribution', label: '২. ডিসট্রিবিউটর ও সাপ্লাই চেইন', icon: Truck, desc: 'কারখানা, ডিলার মার্জিন ও ড্যামেজ লস' },
          { id: 'marketing', label: '৩. এআই গ্রোথ ও মার্কেটিং ল্যাব', icon: Target, desc: 'বাজেট, সিএসি (CAC), জেমিনি ক্যাম্পেইন' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={`p-4 rounded-2xl text-left transition-all border shadow-lg flex items-start space-x-3 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/10 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-[#131620] border-[#252A36] text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-amber-500 text-black' : 'bg-[#1A1E2C] text-gray-300'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">{tab.label}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= MODULE 1: BANKING BUSINESS MANAGEMENT ================= */}
      {activeModule === 'banking' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-[#131620] border border-[#252A36] rounded-3xl space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-[#252A36] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">বাণিজ্যিক ব্যাংক কীভাবে লাভ করে? (Banking Cashflow Engine)</h2>
                  <p className="text-xs text-gray-400">ব্যাংক আমানতকারীর টাকা নিয়ে ঋণগ্রহীতাকে দেয় এবং সুদের পার্থক্যে (Spread) ব্যাংক মুনাফা করে।</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
                প্র্যাকটিক্যাল ফিন্যান্স
              </span>
            </div>

            {/* Banking Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Total Deposit Input */}
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>১. মোট গ্রাহক আমানত (Deposit):</span>
                  <span className="text-emerald-400">৳ {bankDeposit.toLocaleString('bn-BD')}</span>
                </label>
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={100000}
                  value={bankDeposit}
                  onChange={(e) => setBankDeposit(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">গ্রাহকরা ব্যাংকে জমা রাখা মোট সঞ্চয় টাকা।</span>
              </div>

              {/* Deposit Interest Rate */}
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>২. সঞ্চয়ী সুদের হার (Deposit Rate):</span>
                  <span className="text-amber-400">{depositInterestRate}%</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={0.5}
                  value={depositInterestRate}
                  onChange={(e) => setDepositInterestRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">ব্যাংক আমানতকারীকে বাৎসরিক যে মুনাফা দেয়।</span>
              </div>

              {/* Loan Interest Rate */}
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>৩. ঋণের সুদের হার (Loan Rate):</span>
                  <span className="text-indigo-400">{loanInterestRate}%</span>
                </label>
                <input
                  type="range"
                  min={7}
                  max={18}
                  step={0.5}
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">ব্যবসায়ী বা উদ্যোক্তাকে ঋণ দিয়ে ব্যাংক যে সুদ নেয়।</span>
              </div>

              {/* Reserve Ratio & NPL Risk */}
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>৪. খেলাপী ঋণ ঝুঁকি (NPL Rate):</span>
                  <span className="text-red-400">{badLoanPercent}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={badLoanPercent}
                  onChange={(e) => setBadLoanPercent(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">যে ঋণের টাকা ফেরত আসে না (Bad Loss).</span>
              </div>

            </div>

            {/* Real-time Banking Dashboard Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 bg-gradient-to-br from-[#090B10] to-[#131622] border border-[#252A36] rounded-2xl space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">কেন্দ্রীয় ব্যাংক রিজার্ভ (CRR)</div>
                <div className="text-2xl font-black text-amber-400">৳ {requiredReserve.toLocaleString('bn-BD')}</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  বাংলাদেশ ব্যাংকের নিয়ম অনুযায়ী আমানতের {reserveRatio}% ভল্টে গ্যারান্টি হিসেবে জমা রাখা বাধ্যতামূলক।
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#090B10] to-[#131622] border border-[#252A36] rounded-2xl space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">ঋণ প্রদানযোগ্য মূলধন</div>
                <div className="text-2xl font-black text-indigo-400">৳ {lendableCapital.toLocaleString('bn-BD')}</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  রিজার্ভের পর অবশিষ্ট টাকা ব্যাংক বিভিন্ন নতুন উদ্যোক্তা ও শিল্পকারখানায় ঋণ হিসেবে খাটায়।
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-emerald-950/40 to-[#090B10] border border-emerald-500/40 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">বাৎসরিক নিট ব্যাংক মুনাফা</div>
                <div className={`text-2xl font-black ${netBankingProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ৳ {netBankingProfit.toLocaleString('bn-BD')}
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {netBankingProfit >= 0
                    ? `সুদের স্প্রেড (${loanInterestRate - depositInterestRate}%) এবং খেলাপী ঋণ বাদ দিয়ে ব্যাংক মোট লাভ করেছে!`
                    : 'খেলাপী ঋণের পরিমাণ বেশি হওয়ায় ব্যাংক লোকসানে পড়েছে! খেলাপী ঋণ নিয়ন্ত্রণ করুন।'}
                </p>
              </div>

            </div>

            {/* Key Concept Education Note */}
            <div className="p-4 bg-[#090B10] border border-indigo-500/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>শিক্ষার্থীদের জন্য ব্যাংকিং মূলনীতি শিখন:</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 list-disc list-inside">
                <li><strong className="text-white">স্প্রেড (Spread):</strong> ঋণ সুদ ({loanInterestRate}%) বিয়োগ আমানত সুদ ({depositInterestRate}%) = {loanInterestRate - depositInterestRate}% ব্যাংকের লাভ।</li>
                <li><strong className="text-white">ফিসকাল পলিসি:</strong> খেলাপী ঋণ বাড়লে ব্যাংকের লাভ কমে যায় এবং অর্থনৈতিক মন্দা সৃষ্টি হয়।</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODULE 2: DISTRIBUTION & SUPPLY CHAIN ================= */}
      {activeModule === 'distribution' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-[#131620] border border-[#252A36] rounded-3xl space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-[#252A36] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">ডিসট্রিবিউশন ও FMCG সাপ্লাই চেইন ল্যাব</h2>
                  <p className="text-xs text-gray-400">পণ্য কারখানা থেকে উৎপাদন হয়ে কীভাবে ডিলার, পাইকারি ও খুচরা দোকান হয়ে কাস্টমারের হাতে পৌঁছে।</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                সাপ্লাই চেইন সিমুলেটর
              </span>
            </div>

            {/* Value Chain Visual Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-1">
                <div className="text-[11px] text-gray-400 font-bold uppercase">১. কারখানা (Factory Cost)</div>
                <div className="text-xl font-black text-amber-400">৳ {factoryUnitPrice}</div>
                <div className="text-[10px] text-gray-500">উৎপাদন খরচ ও কাঁচামাল</div>
              </div>

              <div className="p-4 bg-[#090B10] border border-amber-500/30 rounded-2xl space-y-1">
                <div className="text-[11px] text-amber-300 font-bold uppercase">২. ডিলার মূল্য (+{distributorMarginPercent}%)</div>
                <div className="text-xl font-black text-indigo-400">৳ {distributorSellPrice.toFixed(1)}</div>
                <div className="text-[10px] text-gray-400">গুদামজাতকরণ ও পরিবহন খরচসহ</div>
              </div>

              <div className="p-4 bg-[#090B10] border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="text-[11px] text-emerald-300 font-bold uppercase">৩. খুচরা মূল্য (MSRP +{retailerMarginPercent}%)</div>
                <div className="text-xl font-black text-emerald-400">৳ {retailerSellPrice.toFixed(1)}</div>
                <div className="text-[10px] text-gray-400">কাস্টমার যে দামে কেনেন</div>
              </div>

            </div>

            {/* Distribution Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>মাসিক পণ্য চালান (Monthly Volume):</span>
                  <span className="text-amber-400">{monthlyOrderQuantity.toLocaleString('bn-BD')} টি</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={monthlyOrderQuantity}
                  onChange={(e) => setMonthlyOrderQuantity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>ডিস্ট্রিবিউটর কমিশন মার্জিন:</span>
                  <span className="text-indigo-400">{distributorMarginPercent}%</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={distributorMarginPercent}
                  onChange={(e) => setDistributorMarginPercent(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block flex justify-between">
                  <span>পরিবহন ক্ষতি ও ড্যামেজ রেট:</span>
                  <span className="text-red-400">{transportLossPercent}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={transportLossPercent}
                  onChange={(e) => setTransportLossPercent(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

            </div>

            {/* Distribution Financial Result */}
            <div className="p-5 bg-gradient-to-r from-[#090B10] via-[#131622] to-amber-950/30 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">মাসিক নিট ডিস্ট্রিবিউশন প্রফিট:</span>
                <div className="text-3xl font-black text-white">৳ {distributorNetProfit.toLocaleString('bn-BD')}</div>
                <p className="text-xs text-gray-300">
                  মোট চালান {monthlyOrderQuantity} টি পণ্যের মধ্যে ড্যামেজ বাদ দিয়ে অর্জিত নিট মুনাফা।
                </p>
              </div>
              <div className="p-3 bg-amber-500 text-black font-extrabold rounded-2xl text-xs flex items-center space-x-2 shrink-0">
                <Boxes className="w-5 h-5" />
                <span>সাপ্লাই চেইন দক্ষতা: ৯৮%</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODULE 3: MARKETING & AI GROWTH ================= */}
      {activeModule === 'marketing' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-[#131620] border border-[#252A36] rounded-3xl space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-[#252A36] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">মার্কেটিং, ব্র্যান্ডিং ও এআই গ্রোথ ল্যাব</h2>
                  <p className="text-xs text-gray-400">কাস্টমার আকর্ষণের কৌশল, ডিজিটাল বিজ্ঞাপন এবং জেমিনি এআই দিয়ে রিয়েল-টাইম ক্যাম্পেইন স্ট্র্যাটেজি।</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                ক্যাম্পেইন জেনারেটর
              </span>
            </div>

            {/* Campaign Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block">বিজ্ঞাপন বাজেট (Ad Budget BDT):</label>
                <input
                  type="number"
                  value={adBudget}
                  onChange={(e) => setAdBudget(Number(e.target.value))}
                  className="w-full bg-[#131620] border border-[#252A36] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block">টার্গেট অডিয়েন্স (Target Persona):</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#131620] border border-[#252A36] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 bg-[#090B10] border border-[#252A36] rounded-2xl space-y-2">
                <label className="text-gray-300 font-bold block">পছন্দের চ্যানেল:</label>
                <select
                  value={marketingChannel}
                  onChange={(e) => setMarketingChannel(e.target.value as any)}
                  className="w-full bg-[#131620] border border-[#252A36] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="facebook">ফেসবুক ও ইনস্টাগ্রাম ভিডিও এডস</option>
                  <option value="youtube">ইউটিউব টিউটোরিয়াল এডস</option>
                  <option value="tiktok">টিকটক ও শর্টস ভাইরাল কনটেন্ট</option>
                  <option value="campus_event">ক্যাম্পাস ইভেন্ট ও স্পনসরশিপ</option>
                </select>
              </div>

            </div>

            {/* Action Generator Button */}
            <div className="flex justify-end">
              <button
                onClick={generateMarketingStrategy}
                disabled={isGeneratingPlan}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black rounded-2xl text-xs transition-all shadow-xl flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{isGeneratingPlan ? 'এআই প্ল্যান তৈরি হচ্ছে...' : 'জেমিনি এআই মার্কেটিং ক্যাম্পেইন তৈরি করো'}</span>
              </button>
            </div>

            {/* Generated Output Display */}
            {aiMarketingPlan && (
              <div className="p-5 bg-[#090B10] border border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-[#252A36] pb-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>জেমিনি এআই প্রস্তুতকৃত বিজিড্রাইভ মার্কেটিং ক্যাম্পেইন প্ল্যান:</span>
                </div>
                <div className="text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {aiMarketingPlan}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
