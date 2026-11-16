import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  FileText, 
  Users2, 
  Compass, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { HERO_IMAGE_DATA } from '../assets/heroImageBase64.js';

export default function SplashScreen({ onFinish, onOpenRules }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(2);

  useEffect(() => {
    // 1-second countdown display
    const countdown = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    // 2.2 seconds timer to trigger fade-out then finish
    const timer = setTimeout(() => {
      handleComplete();
    }, 2200);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, []);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[#040714] flex flex-col justify-center items-center overflow-y-auto p-3 sm:p-6 transition-opacity duration-300 ${
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Centered Main Hero Card */}
      <div className="max-w-5xl w-full mx-auto relative my-auto animate-fade-in">
        
        {/* Main Hero Container */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#040714] border border-slate-800/80 shadow-2xl shadow-indigo-950/50 text-slate-100">
          
          {/* 1. Main Hero Content Area */}
          <div className="relative min-h-[400px] lg:min-h-[460px] flex items-center overflow-hidden">
            
            {/* Background Visual Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Right Artwork Container */}
              <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[54%] overflow-hidden">
                <div 
                  className="w-full h-full bg-no-repeat bg-right-top bg-cover opacity-95"
                  style={{
                    backgroundImage: `url(${HERO_IMAGE_DATA})`,
                    backgroundPosition: 'right 0% top -35px',
                    clipPath: 'polygon(37% 10%, 100% 10%, 100% 68%, 37% 68%)',
                    maskImage: 'linear-gradient(to right, transparent 33%, rgba(0,0,0,0.95) 45%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 33%, rgba(0,0,0,0.95) 45%, black 100%)'
                  }}
                />
              </div>

              {/* Left Solid Dark Shield ensuring high contrast */}
              <div className="absolute inset-y-0 left-0 w-full sm:w-[52%] bg-gradient-to-r from-[#040714] via-[#040714] to-transparent z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-transparent z-[1]" />
            </div>

            {/* Left Hero Content */}
            <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-8 sm:py-12 space-y-5">
              
              {/* Top Announcement Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18140c]/90 border border-amber-500/35 text-amber-300 text-xs font-medium shadow-lg shadow-amber-950/20 backdrop-blur-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="font-semibold text-amber-200">JEE Main 2026</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">Smart College Choice, Made Easy!</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black tracking-tight leading-[1.12] text-white">
                  Your JEE Rank.
                </h1>
                <div className="relative inline-block">
                  <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black tracking-tight leading-[1.12] text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc]">
                    Your Dream College.
                  </h1>
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3.5 text-purple-500/80 overflow-visible" 
                    viewBox="0 0 320 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M4 14C80 4 220 3 316 14" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
              </div>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
                Find the perfect colleges for your JEE Main rank with accurate cutoffs, smart predictions and expert guidance.
              </p>

              {/* Call to Action Button & Trust Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0284c7] via-[#4f46e5] to-[#9333ea] hover:from-[#0369a1] hover:to-[#7e22ce] shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group cursor-pointer"
                >
                  <Search className="w-4 h-4 text-sky-200" />
                  <span>Find My College</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-300">Trusted by Lakhs of JEE Aspirants</span>
                </div>
              </div>

            </div>

          </div>

          {/* 2. Bottom 4 Feature Cards */}
          <div className="relative z-20 px-4 sm:px-8 pb-6 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              <div 
                onClick={handleComplete}
                className="p-3.5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-blue-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    Smart College Prediction
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Get best college options based on your rank.
                  </p>
                </div>
              </div>

              <div 
                onClick={handleComplete}
                className="p-3.5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-purple-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Previous Year Cutoffs
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Check accurate cutoff trends for better decisions.
                  </p>
                </div>
              </div>

              <div 
                onClick={handleComplete}
                className="p-3.5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-teal-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                    Category Selection
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Find options for GEN, OBC, SC, ST &amp; EWS.
                  </p>
                </div>
              </div>

              <div 
                onClick={handleComplete}
                className="p-3.5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-amber-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    JoSAA &amp; CSAB Guidance
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Complete admission counselling support.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Bottom Horizon Ribbon */}
          <div className="relative border-t border-slate-800/70 bg-[#030510] py-2.5 px-4 flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-widest uppercase text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Right Choice</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-300">Bright Future</span>
            </div>
          </div>

        </div>

        {/* 2.2s Timer Bar & Skip Button */}
        <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-medium text-slate-200">
              Opening JEE College Finder in <strong className="text-white font-mono">{secondsRemaining}s</strong>...
            </span>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div className="flex-1 max-w-xs h-2 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/80 mx-2 hidden sm:block">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full animate-splash-bar" />
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
          >
            <span>Enter Studio</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
