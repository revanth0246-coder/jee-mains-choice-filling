import React from 'react';
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

export default function HeroLanding({
  onStartFinder,
  onOpenRules,
  onSelectCategory
}) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#040714] border border-slate-800/80 shadow-2xl shadow-indigo-950/40 text-slate-100">
      
      {/* 1. Main Hero Content Area */}
      <div className="relative min-h-[440px] lg:min-h-[500px] flex items-center overflow-hidden">
        
        {/* Background Visual Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* Right Artwork Container: precisely clipped to student + IIT building + math doodles */}
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

          {/* Left Solid Dark Shield ensuring 100% pristine contrast for headline and CTA */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[52%] bg-gradient-to-r from-[#040714] via-[#040714] to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-transparent z-[1]" />
        </div>

        {/* Left Hero Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 sm:py-14 space-y-6">
          
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18140c]/90 border border-amber-500/35 text-amber-300 text-xs font-medium shadow-lg shadow-amber-950/20 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-amber-200">JEE Main 2026</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Smart College Choice, Made Easy!</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12] text-white">
              Your JEE Rank.
            </h1>
            <div className="relative inline-block">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12] text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc]">
                Your Dream College.
              </h1>
              {/* Hand-drawn curved underline swoosh */}
              <svg 
                className="absolute -bottom-2.5 left-0 w-full h-4 text-purple-500/80 overflow-visible" 
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
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            Find the perfect colleges for your JEE Main rank with accurate cutoffs, smart predictions and expert guidance.
          </p>

          {/* Call to Action Button & Trust Badge */}
          <div className="pt-2 space-y-3.5">
            <button
              type="button"
              onClick={onStartFinder}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#0284c7] via-[#4f46e5] to-[#9333ea] hover:from-[#0369a1] hover:to-[#7e22ce] shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              <Search className="w-5 h-5 text-sky-200" />
              <span>Find My College</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 font-medium">Trusted by Lakhs of JEE Aspirants</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Bottom 4 Feature Cards (exact replica from image) */}
      <div className="relative z-20 px-4 sm:px-8 pb-8 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Smart College Prediction */}
          <div 
            onClick={onStartFinder}
            className="p-4 sm:p-5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-blue-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Smart College Prediction
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Get the best college options based on your rank.
              </p>
            </div>
          </div>

          {/* Card 2: Previous Year Cutoffs */}
          <div 
            onClick={onOpenRules}
            className="p-4 sm:p-5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-purple-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                Previous Year Cutoffs
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Check accurate cutoff trends for better decisions.
              </p>
            </div>
          </div>

          {/* Card 3: Category-wise College Selection */}
          <div 
            onClick={onSelectCategory}
            className="p-4 sm:p-5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-teal-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Category-wise College Selection
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Find options for your category (GEN, OBC, SC, ST etc.).
              </p>
            </div>
          </div>

          {/* Card 4: JoSAA & CSAB Guidance */}
          <div 
            onClick={onOpenRules}
            className="p-4 sm:p-5 rounded-2xl bg-[#090e21]/90 hover:bg-[#0f1738] border border-slate-800/80 hover:border-amber-500/50 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                JoSAA &amp; CSAB Guidance
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Get complete admission counselling support.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Horizon Ribbon (exact text from image) */}
      <div className="relative border-t border-slate-800/70 bg-[#030510] py-3.5 px-4 flex items-center justify-center overflow-hidden">
        {/* Glowing cyan horizon line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        
        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-slate-400">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Right Choice</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">Bright Future</span>
        </div>
      </div>

    </div>
  );
}
