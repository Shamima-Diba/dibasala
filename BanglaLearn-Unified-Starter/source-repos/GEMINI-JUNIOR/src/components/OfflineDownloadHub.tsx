import React, { useState } from 'react';
import { Download, HardDrive, CheckCircle2, Play, FileText, Wifi, WifiOff, Trash2, Sparkles, FolderDown, Smartphone, ShieldCheck, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface OfflineDownloadHubProps {
  lang: 'bn' | 'en';
  onClose?: () => void;
}

interface DownloadedItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  type: 'video' | 'pdf' | 'quiz';
  fileSize: string;
  downloadDate: string;
  quality: string;
  nctbLevelBn: string;
  nctbLevelEn: string;
  downloaded: boolean;
  downloadProgress: number; // 0 to 100
  isDownloading: boolean;
}

export const OfflineDownloadHub: React.FC<OfflineDownloadHubProps> = ({ lang, onClose }) => {
  const isBn = lang === 'bn';

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'video' | 'pdf' | 'quiz'>('all');
  const [playingItem, setPlayingItem] = useState<DownloadedItem | null>(null);

  const [items, setItems] = useState<DownloadedItem[]>([
    {
      id: 'dl_1',
      titleBn: 'এসএসসি রসায়ন: পর্যায় সারণি ও রাসায়নিক বন্ধন (সম্পূর্ণ লেকচার)',
      titleEn: 'SSC Chemistry: Periodic Table & Chemical Bonding (Full Lecture)',
      categoryBn: 'ভিডিও লেকচার',
      categoryEn: 'Video Lecture',
      type: 'video',
      fileSize: '45.2 MB',
      downloadDate: '২০২৬-০৭-২৫',
      quality: '360p (Data Saver)',
      nctbLevelBn: '৯ম-১০ম শ্রেণী (SSC)',
      nctbLevelEn: 'Class 9-10 (SSC)',
      downloaded: true,
      downloadProgress: 100,
      isDownloading: false,
    },
    {
      id: 'dl_2',
      titleBn: 'এইচএসসি উচ্চতর গণিত: ক্যালকুলাস ও অন্তরীকরণ মাস্টার হ্যান্ডনোট',
      titleEn: 'HSC Higher Math: Calculus & Differentiation Master Handnote',
      categoryBn: 'লেকচার শিট (PDF)',
      categoryEn: 'Lecture Sheet (PDF)',
      type: 'pdf',
      fileSize: '8.4 MB',
      downloadDate: '২০২৬-০৭-২৪',
      quality: 'PDF Document',
      nctbLevelBn: '১১শ-১২শ শ্রেণী (HSC)',
      nctbLevelEn: 'Class 11-12 (HSC)',
      downloaded: true,
      downloadProgress: 100,
      isDownloading: false,
    },
    {
      id: 'dl_3',
      titleBn: 'বিসিএস প্রিলিমিনারি: আন্তর্জাতিক বিষয়াবলী ও কম্পিউটার বিজ্ঞান ২০০ প্রশ্ন',
      titleEn: 'BCS Preliminary: International Affairs & CS 200 MCQ Bank',
      categoryBn: 'অফলাইন কুইজ ব্যাংক',
      categoryEn: 'Offline Quiz Bank',
      type: 'quiz',
      fileSize: '3.1 MB',
      downloadDate: '২০২৬-০৭-২৩',
      quality: 'Interactive Test',
      nctbLevelBn: 'বিসিএস ও ক্যাডার চাকরি',
      nctbLevelEn: 'BCS & Job Prep',
      downloaded: true,
      downloadProgress: 100,
      isDownloading: false,
    },
    {
      id: 'dl_4',
      titleBn: '৮ম শ্রেণী বিজ্ঞান: পরমাণুর গঠন ও রাসায়নিক বিক্রিয়া এইচডি লেকচার',
      titleEn: 'Class 8 Science: Structure of Atom HD Lecture',
      categoryBn: 'ভিডিও লেকচার',
      categoryEn: 'Video Lecture',
      type: 'video',
      fileSize: '68.0 MB',
      downloadDate: 'পেন্ডিং',
      quality: '720p HD',
      nctbLevelBn: '৮ম শ্রেণী (JSC)',
      nctbLevelEn: 'Class 8',
      downloaded: false,
      downloadProgress: 0,
      isDownloading: false,
    },
    {
      id: 'dl_5',
      titleBn: 'ঢাকা বিশ্ববিদ্যালয় ক-ইউনিট পদার্থবিজ্ঞান বিগত ১০ বছরের প্রশ্ন ব্যাংক সমাধান',
      titleEn: 'DU A-Unit Physics Last 10 Years Solved Question Bank',
      categoryBn: 'ভর্তি নোট (PDF)',
      categoryEn: 'Admission Sheet',
      type: 'pdf',
      fileSize: '12.6 MB',
      downloadDate: 'পেন্ডিং',
      quality: 'HD PDF Sheet',
      nctbLevelBn: 'ভার্সিটি ক-ইউনিট ভর্তি',
      nctbLevelEn: 'Varsity Admission',
      downloaded: false,
      downloadProgress: 0,
      isDownloading: false,
    },
  ]);

  const handleStartDownload = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isDownloading: true, downloadProgress: 15 };
        }
        return item;
      })
    );

    // Simulate progress timer
    let current = 15;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        clearInterval(interval);
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                downloaded: true,
                isDownloading: false,
                downloadProgress: 100,
                downloadDate: 'আজ (Just Now)',
              };
            }
            return item;
          })
        );
      } else {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return { ...item, downloadProgress: current };
            }
            return item;
          })
        );
      }
    }, 500);
  };

  const handleDeleteDownloaded = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, downloaded: false, downloadProgress: 0, downloadDate: 'পেন্ডিং' };
        }
        return item;
      })
    );
    if (playingItem?.id === id) setPlayingItem(null);
  };

  const filteredItems = items.filter((item) => {
    if (selectedTypeFilter === 'all') return true;
    return item.type === selectedTypeFilter;
  });

  const downloadedCount = items.filter((i) => i.downloaded).length;

  return (
    <div className="space-y-6 animate-fadeIn text-[#E6E8EB] max-w-7xl mx-auto pb-10">
      
      {/* Offline Banner Header */}
      <div className="card-3d bg-gradient-to-r from-emerald-950/60 via-teal-900/40 to-[#0F121A] p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 border border-white/20 shrink-0">
            <FolderDown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isBn ? '📱 স্মার্ট অফলাইন ডাউনলোড সেন্টার' : '📱 Smart Offline Download Hub'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                Rural Data Saver
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              {isBn
                ? 'বাংলাদেশের যেসব এলাকায় ইন্টারনেট দুর্বল বা স্পিড কম, সেখানে একবার লেকচার বা নোট ডাউনলোড করে সম্পূর্ণ অফলাইনে ইন্টারনেট ছাড়াই পড়াশোনা চালিয়ে যান।'
                : 'Download lectures, PDFs, and model tests once to study anytime without internet connection in rural areas.'}
            </p>
          </div>
        </div>

        {/* Network Simulator Toggle & Storage Indicator */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#272E40] space-y-3">
            <div className="flex items-center justify-between text-xs space-x-4 gap-2">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                {isBn ? 'ফোন মেমোরি স্টোরেজ:' : 'Phone Storage:'}
              </span>
              <span className="font-mono font-bold text-emerald-400">124.7 MB / 32 GB</span>
            </div>

            <div className="w-full bg-[#090B10] h-2.5 rounded-full overflow-hidden border border-[#1F2536]">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[12%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-[#232A3B] text-xs gap-3">
              <span className="text-gray-400 font-medium">
                {isBn ? 'অফলাইন ট্রায়াল মোড:' : 'Simulate Offline:'}
              </span>
              <button
                onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  isSimulatedOffline
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-[#222838] text-gray-300 hover:bg-[#2C344A]'
                }`}
              >
                {isSimulatedOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ইন্টারনেট অফ (Offline Active)' : 'Offline Active'}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isBn ? 'ইন্টারনেট অন (Online)' : 'Online'}</span>
                  </>
                )}
              </button>
            </div>
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

      {/* Simulated Offline Active Notification */}
      {isSimulatedOffline && (
        <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-amber-200 text-xs sm:text-sm animate-pulse">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              {isBn
                ? '⚡ অফলাইন মোড সক্রিয় আছে! আপনার সংরক্ষিত ভিডিও লেকচার ও পিডিএফ ইন্টারনেট ছাড়াই মসৃণভাবে প্লে করা যাবে।'
                : '⚡ Offline Mode Active! All downloaded videos and PDFs can be played seamlessly without internet connection.'}
            </span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 shrink-0">
            {downloadedCount} {isBn ? 'টি ফাইল সংগৃহীত' : 'Files Saved'}
          </span>
        </div>
      )}

      {/* Filter Tabs & Content Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#222838] pb-3">
          <div className="flex items-center space-x-2">
            {[
              { id: 'all', labelBn: 'সকল কনটেন্ট', labelEn: 'All Files' },
              { id: 'video', labelBn: '🎥 ভিডিও লেকচার', labelEn: 'Videos' },
              { id: 'pdf', labelBn: '📄 শিট (PDF)', labelEn: 'PDF Sheets' },
              { id: 'quiz', labelBn: '📝 অফলাইন কুইজ', labelEn: 'Quizzes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedTypeFilter === tab.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-[#141824] text-gray-400 border-[#222838] hover:text-white hover:bg-[#1A2030]'
                }`}
              >
                {isBn ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          <div className="text-xs text-emerald-400 font-mono font-bold bg-[#131826] px-3 py-1.5 rounded-xl border border-[#252E44]">
            {isBn ? `মোট সেভকৃত ফাইল: ${downloadedCount} টি` : `Total Offline Files: ${downloadedCount}`}
          </div>
        </div>

        {/* List of Downloadable items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`card-3d bg-[#121622] p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                item.downloaded ? 'border-emerald-500/40' : 'border-[#242C3E]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    {isBn ? item.nctbLevelBn : item.nctbLevelEn}
                  </span>
                  <span className="font-mono text-gray-400">{item.fileSize}</span>
                </div>

                <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>

                <div className="flex items-center space-x-2 text-xs text-gray-400 pt-1">
                  <span className="bg-[#1A2030] px-2 py-0.5 rounded text-[11px] border border-[#28324A] font-medium text-teal-300">
                    {isBn ? item.categoryBn : item.categoryEn}
                  </span>
                  <span>•</span>
                  <span>{item.quality}</span>
                </div>
              </div>

              {/* Download Action & Status */}
              <div className="pt-2 border-t border-[#1F2638] space-y-2">
                {item.isDownloading ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-emerald-400">
                      <span>{isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...'}</span>
                      <span>{item.downloadProgress}% (4.2 MB/s)</span>
                    </div>
                    <div className="w-full bg-[#0B0E16] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${item.downloadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : item.downloaded ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? 'অফলাইনে প্রস্তুত' : 'Offline Ready'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPlayingItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isBn ? 'প্লে / ভিউ' : 'Play / View'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteDownloaded(item.id)}
                        className="p-1.5 rounded-xl bg-[#1C2230] text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-[#2B354D] transition-all"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartDownload(item.id)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? 'অফলাইনে সেভ করুন' : 'Download for Offline'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Player Modal / View Drawer */}
      {playingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#0F121A] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-white card-3d">
            
            <div className="flex items-center justify-between border-b border-[#252C3E] pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">
                  {isBn ? 'OFFLINE PLAYER (ইন্টারনেট ছাড়া প্লে হচ্ছে)' : 'OFFLINE PLAYER (Playing without internet)'}
                </span>
              </div>
              <button
                onClick={() => setPlayingItem(null)}
                className="px-3 py-1 rounded-xl bg-[#1D2434] hover:bg-[#283248] text-xs font-bold text-gray-300"
              >
                ✕ {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

            <h3 className="font-extrabold text-lg sm:text-xl text-white">
              {isBn ? playingItem.titleBn : playingItem.titleEn}
            </h3>

            {/* Content Display according to type */}
            {playingItem.type === 'video' && (
              <div className="relative aspect-video rounded-2xl bg-black border border-[#2B354C] overflow-hidden flex flex-col items-center justify-center space-y-3 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
                  <Play className="w-8 h-8 text-emerald-400 fill-emerald-400 ml-1" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">
                    {isBn ? 'অফলাইন এইচডি ভিডিও স্ট্রিম সফলভাবে শুরু হয়েছে' : 'Offline HD Video Stream Active'}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {isBn ? 'লোকাল ডিভাইস এনক্রিপ্টেড মেমোরি থেকে ০% ডেটা খরচে রানিং' : 'Streaming from encrypted device memory at 0% data cost'}
                  </p>
                </div>
                <div className="w-full bg-[#182030] p-3 rounded-xl flex items-center justify-between text-xs font-mono text-gray-300">
                  <span>02:15 / 18:40</span>
                  <span>360p Data Saver</span>
                  <span className="text-emerald-400">0 KB/s</span>
                </div>
              </div>
            )}

            {playingItem.type === 'pdf' && (
              <div className="bg-[#141926] border border-[#28324A] p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <FileText className="w-6 h-6" />
                  <span className="font-bold text-sm">
                    {isBn ? 'অফলাইন হ্যান্ডনোট ও লেকচার শিট ভিউয়ার' : 'Offline Lecture Sheet Viewer'}
                  </span>
                </div>
                <div className="bg-[#0A0D14] p-4 rounded-xl font-mono text-xs text-gray-200 leading-relaxed border border-[#1E2638] max-h-60 overflow-y-auto space-y-2">
                  <p className="text-amber-300 font-bold">
                    [১] ক্যালকুলাস ও অন্তরীাকরণের গুরুত্বপূর্ণ সুত্রাবলী (NCTB Approved):
                  </p>
                  <p>• d/dx (x^n) = n * x^(n-1)</p>
                  <p>• d/dx (sin x) = cos x</p>
                  <p>• d/dx (cos x) = -sin x</p>
                  <p className="text-gray-400 pt-2 border-t border-[#1B2232]">
                    {isBn ? 'এই শিটটি সম্পূর্ণ ডাউনলোড করে রাখা হয়েছে। অফলাইনে প্রিন্ট বা রিড করা যাবে।' : 'Fully downloaded sheet. Ready for offline reading.'}
                  </p>
                </div>
              </div>
            )}

            {playingItem.type === 'quiz' && (
              <div className="bg-[#141926] border border-[#28324A] p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>{isBn ? 'অফলাইন বিসিএস ২০০ প্রশ্ন মক টেস্ট' : 'Offline BCS 200 Question Mock Test'}</span>
                  <span>Question 1 of 200</span>
                </div>
                <div className="bg-[#0D111A] p-4 rounded-xl border border-[#232B3E]">
                  <p className="font-bold text-sm text-white">
                    প্রশ্ন ১: বাংলাদেশের জাতীয় সংসদ ভবনের স্থপতি কে?
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <button className="p-2.5 rounded-xl bg-[#1B2232] hover:bg-[#28324A] text-left text-gray-200 font-semibold border border-[#2A344A]">
                      ক) লুই আই কান
                    </button>
                    <button className="p-2.5 rounded-xl bg-[#1B2232] hover:bg-[#28324A] text-left text-gray-200 font-semibold border border-[#2A344A]">
                      খ) মেঝারুল ইসলাম
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
