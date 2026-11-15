import React from 'react';
import { 
  X, 
  BookOpen, 
  MapPin, 
  Users, 
  Sparkles, 
  GitBranch
} from 'lucide-react';

export default function RulesGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0d121f] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Official JoSAA Counseling Rules &amp; Quotas
              </h3>
              <p className="text-xs text-slate-400">
                Key insights for intelligent choice sequence optimization
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>1. The "Zero Penalty" Choice Hierarchy Rule</span>
            </div>
            <p className="text-slate-300">
              In JoSAA counseling, you are NEVER penalized for listing an ambitious or dream branch above your rank. The central allotment software evaluates your preferences strictly in ascending sequential order (Choice #1, then #2, then #3...).
            </p>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
              <strong>Golden JoSAA Rule:</strong> If your rank is 15,000, always list top aspirational colleges at Choice #1. If you don't clear the cutoff, the algorithm simply falls through to your next choice without hurting your chances for safe colleges.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>2. 50% Home State Quota (NITs &amp; Select GFTIs)</span>
            </div>
            <p className="text-slate-300">
              Under the National Institutes of Technology Act, exactly 50% of the total seats in every NIT are reserved for students whose <strong>Class 12 board examination exam center</strong> is located in that state.
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
              <li>For Home State candidates, closing ranks are significantly relaxed compared to All India / Other State candidates.</li>
              <li>IITs and IIITs operate strictly on a 100% All India Quota without state domicile reservations.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>3. Female Supernumerary Quota (20% Reservation)</span>
            </div>
            <p className="text-slate-300">
              To balance gender diversity across technical institutes, JoSAA institutes create up to 20% supernumerary seats specifically for female candidates. This provides female candidates with a ~20-30% cutoff rank relaxation compared to the Gender-Neutral pool.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <GitBranch className="w-4 h-4" />
              <span>4. Seat Allotment Actions: Freeze vs Float vs Slide</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">FREEZE</span>
                <p className="text-[11px] text-slate-400">
                  Accept the allotted seat and exit further counseling rounds. No further upgrades.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">FLOAT</span>
                <p className="text-[11px] text-slate-400">
                  Accept the allotted seat but remain open for higher preference choices across ANY institute in later rounds.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">SLIDE</span>
                <p className="text-[11px] text-slate-400">
                  Accept the seat but seek higher academic programs within the SAME allotted institute only.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
}
