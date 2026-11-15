import React from 'react';
import { X, Settings, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Layers, Sparkles } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d1e] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">How It Works</h2>
              <p className="text-xs text-slate-400">Step-by-Step JoSAA Counseling Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Steps Timeline */}
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              1
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Input Exam Ranks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your JEE Main CRL Rank. If you qualified in JEE Advanced, unlock the IIT evaluation module to include all 23 IITs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
              2
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Confirm Domicile State &amp; Reservation Quota</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your 12th Board Home State for the 50% NIT Home State Quota. Choose your category (OPEN, GEN-EWS, OBC-NCL, SC, ST) and Gender Pool.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-purple-500/30">
              3
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Select Preferred Branches (Multi-Selection)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by specific engineering disciplines (e.g. CSE, AI &amp; DS, ECE) or select "All Branches" to evaluate the entire 716-seat matrix.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
              4
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Cumulative Choice Sheet &amp; Likely Allotment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The engine generates your sorted sequence from Choice #01 down through your 6 Most Likely colleges (Round 5/6) plus 30 Safe Backups.
              </p>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30"
          >
            Start Finding Colleges Now
          </button>
        </div>

      </div>
    </div>
  );
}
