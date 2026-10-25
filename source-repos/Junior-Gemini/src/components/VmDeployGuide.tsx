import React, { useState } from 'react';
import { Server, Terminal, Copy, Check, ShieldCheck, Cpu, HardDrive, Globe, ExternalLink, Zap } from 'lucide-react';
import { DEPLOYMENT_STEPS } from '../data/deploymentSteps';

interface VmDeployGuideProps {
  lang: 'bn' | 'en';
}

export const VmDeployGuide: React.FC<VmDeployGuideProps> = ({ lang }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const testServerHealth = async () => {
    setPinging(true);
    setPingStatus(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setPingStatus(`✅ Server Online! Engine: ${data.engine}, Version: ${data.version}`);
    } catch (e: any) {
      setPingStatus(`❌ Error connecting to backend server: ${e.message}`);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-2 p-4 sm:p-6 bg-[#0F1117] border border-[#1F2937] rounded-2xl shadow-2xl text-[#E6E8EB]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-white/10">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {lang === 'bn' ? 'গুগল ক্লাউড (GCP) ভিএম ডেপ্লয়মেন্ট গাইড' : 'GCP VM Deployment Assistant'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'bn'
                ? 'আপনার গুগল ক্লাউড ভিএম সার্ভারে এই JUNIOR GEMINI অ্যাপটি নিরবচ্ছিন্নভাবে চালুর নির্দেশিকা'
                : 'Complete guide to host and run JUNIOR GEMINI 24/7 on your Google Cloud VM instance'}
            </p>
          </div>
        </div>

        <button
          onClick={testServerHealth}
          disabled={pinging}
          className="px-4 py-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow"
        >
          <Zap className="w-4 h-4 text-green-400" />
          <span>{pinging ? (lang === 'bn' ? 'চেক করা হচ্ছে...' : 'Testing...') : (lang === 'bn' ? 'সার্ভার স্টেটাস টেস্ট' : 'Test Health Status')}</span>
        </button>
      </div>

      {pingStatus && (
        <div className="mt-3 p-3 rounded-xl bg-[#050608] border border-green-500/40 text-xs text-green-300 font-mono shadow-inner">
          {pingStatus}
        </div>
      )}

      {/* Deployment Specs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center space-x-3">
          <Cpu className="w-8 h-8 text-blue-400 p-1.5 bg-blue-500/10 rounded-xl shrink-0 border border-blue-500/20" />
          <div>
            <div className="text-xs font-bold text-[#E6E8EB]">Recommended Instance</div>
            <div className="text-[11px] text-gray-400 font-mono">e2-medium (2 vCPU, 4GB RAM)</div>
          </div>
        </div>

        <div className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center space-x-3">
          <HardDrive className="w-8 h-8 text-purple-400 p-1.5 bg-purple-500/10 rounded-xl shrink-0 border border-purple-500/20" />
          <div>
            <div className="text-xs font-bold text-[#E6E8EB]">Runtime Engine</div>
            <div className="text-[11px] text-gray-400 font-mono">Node.js 20 LTS + Express CJS</div>
          </div>
        </div>

        <div className="p-4 bg-[#0A0C10] rounded-xl border border-[#1F2937] flex items-center space-x-3">
          <Globe className="w-8 h-8 text-pink-400 p-1.5 bg-pink-500/10 rounded-xl shrink-0 border border-pink-500/20" />
          <div>
            <div className="text-xs font-bold text-[#E6E8EB]">Process Manager</div>
            <div className="text-[11px] text-gray-400 font-mono">PM2 Continuous Daemon / Docker</div>
          </div>
        </div>
      </div>

      {/* Deployment Steps List */}
      <div className="mt-6 space-y-4">
        {DEPLOYMENT_STEPS.map((step, idx) => {
          const title = lang === 'bn' ? step.titleBn : step.title;
          const desc = lang === 'bn' ? step.descriptionBn : step.description;

          return (
            <div key={idx} className="p-4 sm:p-5 bg-[#0A0C10] rounded-xl border border-[#1F2937]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-blue-400">{title}</h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#13161C] text-gray-400 border border-[#2D3139]">
                  Step {idx + 1}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{desc}</p>

              {/* Terminal Box */}
              <div className="relative bg-[#050608] p-3.5 rounded-xl border border-[#1F2937] font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
                <button
                  onClick={() => copyCommand(step.command, idx)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#1A1D24] hover:bg-[#252A34] text-gray-300 border border-[#2D3139] transition-colors"
                  title="Copy command"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <pre className="pr-10 whitespace-pre-wrap font-mono">{step.command}</pre>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
