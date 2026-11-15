import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadChoiceSheet } from '../utils/exportChoiceData.js';

export default function LockChoicesModal({ 
  isOpen, 
  onClose, 
  choices, 
  candidateProfile 
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const isCSAB = candidateProfile.counselingType === 'CSAB';
  const lockTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const lockHash = (isCSAB ? 'CSAB-2026-LOCK-' : 'JOSAA-2026-LOCK-') + Math.random().toString(36).substring(2, 10).toUpperCase();

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  const handleCopy = () => {
    const textList = choices.map((c, i) => 
      `${i + 1}. [${c.instituteCode}] ${c.instituteName} - ${c.branchCode} (${c.branchName}) [Quota: ${c.quotaUsed}]`
    ).join('\n');

    navigator.clipboard.writeText(
      `--- ${isCSAB ? 'CSAB 2026 SPECIAL' : 'JoSAA 2026'} OFFICIAL LOCKED CHOICE SHEET ---\nPortal: ${isCSAB ? 'CSAB Special Rounds 1 & 2' : 'JoSAA Rounds 1 to 6'}\nCandidate CRL: ${candidateProfile.jeeMainRank}\nState: ${candidateProfile.homeState}\nCategory: ${candidateProfile.category}\nSecurity Hash: ${lockHash}\nDate: ${lockTimestamp}\n\n` + textList
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      portal: isCSAB ? 'CSAB 2026 Special Rounds Studio' : 'JoSAA SeatMatrix 2026 Studio',
      counselingType: isCSAB ? 'CSAB' : 'JOSAA',
      candidate: candidateProfile,
      lockTimestamp,
      securityHash: lockHash,
      totalChoicesLocked: choices.length,
      choices: choices.map((c, i) => ({
        choiceNo: i + 1,
        instituteCode: c.instituteCode,
        instituteName: c.instituteName,
        instituteType: c.instituteType,
        branchCode: c.branchCode,
        branchName: c.branchName,
        quotaUsed: c.quotaUsed,
        effectiveClosingRank: c.effectiveClosingRank,
        medianCTC: c.medianCTC
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isCSAB ? 'CSAB' : 'JoSAA'}_2026_Choices_CRL_${candidateProfile.jeeMainRank}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0b0f19] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Official Choice Locking Slip
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {isCSAB ? 'CSAB Special' : 'JoSAA 2026'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isCSAB 
                  ? 'Central Seat Allocation Board (CSAB 2026 Special Rounds) Choice Submission' 
                  : 'Joint Seat Allocation Authority (JoSAA 2026) Choice Submission'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Candidate Verification Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Portal</span>
              <strong className="text-indigo-300 font-mono text-sm">{isCSAB ? 'CSAB Special' : 'JoSAA 2026'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">JEE Main CRL</span>
              <strong className="text-white font-mono text-sm">#{Number(candidateProfile.jeeMainRank).toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">JEE Advanced</span>
              <strong className="text-violet-300 font-mono text-sm">
                {isCSAB ? 'N/A (CSAB)' : (candidateProfile.isJeeAdvQualified ? `#${Number(candidateProfile.jeeAdvRank).toLocaleString()}` : 'Not Qualified')}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Home State (50% HS)</span>
              <strong className="text-emerald-300 text-sm truncate block">{candidateProfile.homeState || 'All India'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Category / Pool</span>
              <strong className="text-indigo-300 text-sm">{candidateProfile.category} ({candidateProfile.genderPool === 'Female-Only' ? 'Female' : 'Neutral'})</strong>
            </div>
          </div>

          {/* Security Hash Bar */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verification Hash: <strong className="text-indigo-300">{lockHash}</strong></span>
            </span>
            <span className="text-slate-500 text-[10px]">
              {lockTimestamp}
            </span>
          </div>

          {/* Locked Choices Sequence Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Locked Choice Hierarchy ({choices.length} Total Choices)
              </span>
              <span className="text-[11px] text-slate-400">
                Sequential Preference 1 to {choices.length}
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">Pref</th>
                    <th className="py-2.5 px-3">Institute &amp; JoSAA Code</th>
                    <th className="py-2.5 px-3">Academic Program</th>
                    <th className="py-2.5 px-3 w-16 text-center">Quota</th>
                    <th className="py-2.5 px-3 w-20 text-right">R6 Cutoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-[11px]">
                  {choices.map((c, i) => (
                    <tr key={c.id} className="hover:bg-slate-900/60">
                      <td className="py-2 px-3 font-mono font-bold text-center text-indigo-400">
                        #{i + 1}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-200">
                          {c.instituteName}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          [{c.instituteCode}] {c.instituteType} • NIRF #{c.nirf}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 font-medium">
                        {c.branchCode} - {c.branchName}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          c.quotaUsed === 'HS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {c.quotaUsed}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-right text-slate-200">
                        {c.effectiveClosingRank.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadChoiceSheet(choices, candidateProfile)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download Choice Sheet"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied Choices!' : 'Copy Text List'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Choice Slip</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Complete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
