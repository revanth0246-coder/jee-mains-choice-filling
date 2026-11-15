import React from 'react';
import { X, GraduationCap, Award, Compass, Sparkles, Building, CheckCircle2 } from 'lucide-react';
import { INSTITUTES_STATS } from '../data/josaaCutoffs.js';

export default function AboutUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d1e] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">About JEE College Finder</h2>
              <p className="text-xs text-slate-400">Official JoSAA SeatMatrix 2026 Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Mission */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            JEE College Finder is built to remove the anxiety, uncertainty, and misinformation from official JoSAA & CSAB counseling. 
            By mapping real closing cutoffs from JoSAA Round 1 to Round 6 across all 119 participating institutes, 
            aspirants can discover their exact allotment probability with mathematical precision.
          </p>
        </div>

        {/* Coverage Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-2xl font-black text-white font-mono">{INSTITUTES_STATS.iitCount}</div>
            <div className="text-[11px] font-semibold text-blue-400 mt-0.5">IITs (101-123)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-2xl font-black text-white font-mono">{INSTITUTES_STATS.nitCount}</div>
            <div className="text-[11px] font-semibold text-indigo-400 mt-0.5">NITs (201-232)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-2xl font-black text-white font-mono">{INSTITUTES_STATS.iiitCount}</div>
            <div className="text-[11px] font-semibold text-purple-400 mt-0.5">IIITs (301-326)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-2xl font-black text-white font-mono">{INSTITUTES_STATS.gftiCount}</div>
            <div className="text-[11px] font-semibold text-teal-400 mt-0.5">GFTIs (401-438)</div>
          </div>
        </div>

        {/* Why Aspirants Trust Us */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Key Advantages</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Cumulative Slicing Strategy:</strong> Ranks Choice #01 from the very top dream seats down through your Most Likely Zone and +30 safe backups.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>NIT Act 50% Home State Quota:</strong> Automatic domicile state relaxation for NITs and select GFTIs.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Official JoSAA Category Multipliers:</strong> Transparent evaluation for GEN-EWS, OBC-NCL, SC, ST, and Female Supernumerary pools.</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30"
          >
            Got It &bull; Back to Finder
          </button>
        </div>

      </div>
    </div>
  );
}
