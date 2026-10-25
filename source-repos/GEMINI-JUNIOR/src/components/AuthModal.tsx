import React, { useState } from 'react';
import { User, Smartphone, Mail, Lock, ShieldCheck, CheckCircle2, X, ArrowRight, Sparkles, KeyRound, GraduationCap, Building2, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export interface UserProfile {
  name: string;
  phoneOrEmail: string;
  role: 'student' | 'bcs_applicant' | 'teacher' | 'guardian';
  nctbClass: string;
  isVerified: boolean;
  points: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
  currentUser,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  
  // Form fields
  const [fullName, setFullName] = useState<string>('আব্দুল্লাহ আল মামুন');
  const [phoneOrEmailInput, setPhoneOrEmailInput] = useState<string>('01700000000');
  const [userRole, setUserRole] = useState<'student' | 'bcs_applicant' | 'teacher' | 'guardian'>('student');
  const [nctbClass, setNctbClass] = useState<string>('১০ম শ্রেণী (SSC 2026)');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSent(true);
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const user: UserProfile = {
        name: authMode === 'signup' ? fullName : (phoneOrEmailInput.includes('@') ? 'User ' + phoneOrEmailInput.split('@')[0] : 'শিক্ষার্থী ' + phoneOrEmailInput.slice(-4)),
        phoneOrEmail: phoneOrEmailInput,
        role: userRole,
        nctbClass: nctbClass,
        isVerified: true,
        points: 450,
      };
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F121A] border border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-[#E6E8EB] card-3d">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#252C3E] pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {currentUser
                  ? (isBn ? '👤 আপনার প্রোফাইল ও অ্যাকাউন্ট' : '👤 User Profile & Account')
                  : (isBn ? '🔐 সাইন ইন / অ্যাকাউন্ট তৈরি' : '🔐 Sign In / Create Account')}
              </h3>
              <p className="text-xs text-gray-400">
                {isBn ? 'বিসিএস, এনসিটিবি ও অফলাইন ক্লাসের অগ্রগতি সেভ রাখতে লগইন করুন' : 'Login to save study progress, test scores & downloads'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#181C26] text-gray-400 hover:text-white hover:bg-[#252A36] border border-[#2D3342] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is ALREADY logged in */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-950/50 via-indigo-950/40 to-[#121622] p-5 rounded-2xl border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-extrabold text-white">{currentUser.name}</h4>
                  <p className="text-xs text-blue-300 font-mono mt-0.5">{currentUser.phoneOrEmail}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isBn ? 'ভেরিফাইড আইডি' : 'Verified ID'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#222B3D]">
                <div className="bg-[#0B0D14] p-3 rounded-xl border border-[#1E2536]">
                  <span className="text-gray-400 block">{isBn ? 'ক্যাটাগরি / শ্রেণী:' : 'Class / Track:'}</span>
                  <span className="font-bold text-amber-300">{currentUser.nctbClass}</span>
                </div>
                <div className="bg-[#0B0D14] p-3 rounded-xl border border-[#1E2536]">
                  <span className="text-gray-400 block">{isBn ? 'রিওয়ার্ড পয়েন্ট:' : 'Reward Points:'}</span>
                  <span className="font-mono font-bold text-emerald-400">⭐ {currentUser.points} Pts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
              >
                {isBn ? 'লগআউট করুন' : 'Sign Out'}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
              >
                {isBn ? 'ঠিক আছে' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="space-y-4">
            
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-[#131722] p-1 border border-[#232B3E] text-xs font-bold">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isBn ? 'লগইন করুন' : 'Sign In'}
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isBn ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Register'}
              </button>
            </div>

            {/* Login Method Toggle */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-400">{isBn ? 'লগইন মাধ্যম:' : 'Method:'}</span>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  loginMethod === 'phone' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-[#161B28] text-gray-400 border-[#283248]'
                }`}
              >
                📱 {isBn ? 'মোবাইল নম্বর (OTP)' : 'Mobile OTP'}
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  loginMethod === 'email' ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#161B28] text-gray-400 border-[#283248]'
                }`}
              >
                ✉️ {isBn ? 'ইমেইল ও পাসওয়ার্ড' : 'Email & Pass'}
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={isOtpSent ? handleVerifyAndLogin : handleSendOtp} className="space-y-3">
              
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    {isBn ? 'পূর্ণ নাম:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#273044] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  {loginMethod === 'phone' ? (isBn ? 'মোবাইল নম্বর (১১ ডিজিট):' : 'Mobile Number:') : (isBn ? 'ইমেইল অ্যাড্রেস:' : 'Email Address:')}
                </label>
                <input
                  type={loginMethod === 'phone' ? 'tel' : 'email'}
                  value={phoneOrEmailInput}
                  onChange={(e) => setPhoneOrEmailInput(e.target.value)}
                  placeholder={loginMethod === 'phone' ? '01700000000' : 'student@example.com'}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#273044] text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Class or Track Selector */}
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {isBn ? 'আপনার ভূমিকা:' : 'Role:'}
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#273044] text-white focus:outline-none"
                    >
                      <option value="student">{isBn ? 'শিক্ষার্থী (Student)' : 'Student'}</option>
                      <option value="bcs_applicant">{isBn ? 'বিসিএস / চাকরিপ্রার্থী' : 'Job Seeker'}</option>
                      <option value="teacher">{isBn ? 'শিক্ষক / মেন্টর' : 'Teacher'}</option>
                      <option value="guardian">{isBn ? 'অভিভাবক (Guardian)' : 'Guardian'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {isBn ? 'এনসিটিবি শ্রেণী / সিলেবাস:' : 'Class / Track:'}
                    </label>
                    <select
                      value={nctbClass}
                      onChange={(e) => setNctbClass(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0B0D14] border border-[#273044] text-white focus:outline-none"
                    >
                      <option value="১০ম শ্রেণী (SSC 2026)">১০ম শ্রেণী (SSC)</option>
                      <option value="১২ম শ্রেণী (HSC 2026)">১২ম শ্রেণী (HSC)</option>
                      <option value="বিসিএস ও ক্যাডার চাকরি">বিসিএস ও ব্যাংক চাকরি</option>
                      <option value="ভার্সিটি ক/খ/গ ইউনিট ভর্তি">ভার্সিটি ভর্তি</option>
                    </select>
                  </div>
                </div>
              )}

              {/* OTP Code Step if OTP Sent */}
              {isOtpSent && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2 animate-fadeIn">
                  <span className="text-xs font-bold text-emerald-300 block">
                    ⚡ {isBn ? 'মোবাইলে পাঠানো ৪ সংখ্যার ওটিপি (OTP) দিন:' : 'Enter 4-digit OTP sent to mobile:'}
                  </span>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full p-2.5 text-center text-lg font-mono tracking-widest font-extrabold rounded-xl bg-[#080A10] border border-emerald-500 text-emerald-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400 text-center">
                    {isBn ? 'ডেমো ওটিপি মোড: যেকোনো ৪ ডিজিট টাইপ করে ভেরিফাই বাটনে প্রেস করুন' : 'Demo Mode: Type any 4 digits to verify'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                {isVerifying ? (
                  <span>{isBn ? 'ভেরিফাই করা হচ্ছে...' : 'Verifying...'}</span>
                ) : isOtpSent ? (
                  <span>{isBn ? 'ওটিপি ভেরিফাই ও প্রবেশ করুন' : 'Verify OTP & Enter'}</span>
                ) : (
                  <span>{loginMethod === 'phone' ? (isBn ? 'ওটিপি (OTP) পাঠান' : 'Send OTP') : (isBn ? 'লগইন করুন' : 'Sign In')}</span>
                )}
              </button>

            </form>

            <div className="pt-2 border-t border-[#1F2638] text-[11px] text-gray-400 text-center flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'জাতীয় ডিজিটাল শিক্ষা সুরক্ষা আইন অনুযায়ী সম্পূর্ণ নিরাপদ' : 'Secured according to National EdTech Policy'}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
