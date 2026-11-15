import React from 'react';
import { 
  GraduationCap, 
  Home, 
  Info, 
  Settings, 
  Mail, 
  Lock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  candidateProfile,
  hasGenerated,
  onOpenWizard,
  onOpenLockModal,
  onOpenRulesModal,
  onOpenAbout,
  onOpenHowItWorks,
  onOpenContact,
  onScrollToTop,
  onStartFinder,
  onResetToBeginning,
  choicesCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#081126]/95 backdrop-blur-xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo matching user mockup */}
          <div 
            onClick={onScrollToTop}
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 shadow-md shadow-blue-500/25 border border-white/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                JEE College Finder
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            <button 
              type="button"
              onClick={onScrollToTop}
              className="text-white relative py-1.5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-400 after:rounded-full"
            >
              Home
            </button>
            
            <button 
              type="button"
              onClick={onOpenAbout}
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </button>

            <button 
              type="button"
              onClick={onOpenHowItWorks}
              className="text-slate-300 hover:text-white transition-colors"
            >
              How it works
            </button>

            <button 
              type="button"
              onClick={onOpenContact}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right: Candidate Profile Pill & White Lock Choices Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Candidate summary pill (matches mockup: CRL #38,291 · OBC-NCL · Telangana) */}
            {hasGenerated && candidateProfile.jeeMainRank ? (
              <button
                type="button"
                onClick={onOpenWizard}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition-all text-xs font-medium"
                title="Click to edit candidate ranks and quota profile"
              >
                <span className="font-mono font-bold text-white">
                  CRL #{Number(candidateProfile.jeeMainRank).toLocaleString()}
                </span>
                <span className="text-white/40">&middot;</span>
                <span className="text-indigo-200 font-semibold">
                  {candidateProfile.category}
                </span>
                <span className="text-white/40 hidden sm:inline">&middot;</span>
                <span className="text-slate-300 hidden sm:inline">
                  {candidateProfile.homeState || 'All India'}
                </span>
              </button>
            ) : null}

            {/* Lock Choices Button (Mockup 3) vs Dream Bigger Button (Mockup 1) */}
            {hasGenerated ? (
              <button
                type="button"
                onClick={onOpenLockModal}
                className="px-4 sm:px-5 py-2 rounded-full text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lock choices ({choicesCount || 321})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartFinder}
                className="px-4 sm:px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 flex-shrink-0 border border-white/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Dream Bigger ✦</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
