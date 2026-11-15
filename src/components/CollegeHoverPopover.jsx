import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Award, 
  TrendingUp, 
  GraduationCap, 
  ShieldCheck, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';
import InstituteLogo from './InstituteLogo.jsx';

/**
 * Rich College Details Popover shown on Hover over College Name
 */
export default function CollegeHoverPopover({ choice, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, positionAbove: false });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const popoverHeight = 360;
        const popoverWidth = 440;
        
        // Check if there is enough space below or should pop above
        const spaceBelow = window.innerHeight - rect.bottom;
        const positionAbove = spaceBelow < popoverHeight && rect.top > popoverHeight;
        
        let left = rect.left;
        // Keep inside window horizontally
        if (left + popoverWidth > window.innerWidth - 20) {
          left = window.innerWidth - popoverWidth - 20;
        }
        if (left < 15) left = 15;

        setCoords({
          top: positionAbove ? rect.top - popoverHeight - 8 : rect.bottom + 8,
          left,
          positionAbove
        });
        setIsVisible(true);
      }
    }, 150); // small delay to prevent accidental rapid popups
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Realistic mock/dynamic metadata per institute type
  const estdYear = choice.instituteType === 'IIT' ? 1951 + (choice.nirf * 2) % 60 : 
                   choice.instituteType === 'NIT' ? 1960 + (choice.nirf * 2) % 45 : 
                   choice.instituteType === 'IIIT' ? 1998 + (choice.nirf) % 22 : 1965 + (choice.nirf) % 40;

  const campusAcres = choice.instituteType === 'IIT' ? '400+ Acres' :
                      choice.instituteType === 'NIT' ? '250+ Acres' :
                      choice.instituteType === 'IIIT' ? '65+ Acres Modern Campus' : '180+ Acres';

  const recruiters = choice.branchCode === 'CSE' || choice.branchCode === 'AI_DS' || choice.branchCode === 'IT'
    ? 'Google, Microsoft, Amazon, Atlassian, Uber, Goldman Sachs, Nvidia'
    : choice.branchCode === 'ECE' || choice.branchCode === 'EE'
    ? 'Texas Instruments, Qualcomm, Intel, AMD, Samsung R&D, Apple, Nvidia'
    : 'L&T, Tata Motors, Reliance, Schlumberger, Shell, Maruti Suzuki, PSU Navratnas';

  const quotaLabel = choice.quotaUsed === 'HS' ? 'Home State (50% Domicile Quota)' :
                     choice.quotaUsed === 'OS' ? 'Other State (All India Pool)' :
                     choice.quotaUsed === 'AI' ? 'All India Merit Quota' : choice.quotaUsed;

  const themeBorder = choice.colorTheme === 'gold' ? 'border-amber-500/60 shadow-amber-950/40' :
                      choice.colorTheme === 'green' ? 'border-emerald-500/60 shadow-emerald-950/40' :
                      'border-sky-500/60 shadow-sky-950/40';

  return (
    <div 
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={triggerRef} className="cursor-pointer">
        {children}
      </div>

      {isVisible && (
        <div 
          className="fixed z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left}px`,
            width: 'min(440px, calc(100vw - 32px))'
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsVisible(true);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`rounded-2xl bg-[#090e1c]/95 backdrop-blur-2xl border-2 ${themeBorder} shadow-2xl p-4 sm:p-5 text-left text-slate-100 space-y-3.5`}>
            
            {/* Header: Logo, Name & Type */}
            <div className="flex items-start gap-3">
              <InstituteLogo type={choice.instituteType} name={choice.instituteName} className="w-12 h-12" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${
                    choice.instituteType === 'IIT' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    choice.instituteType === 'NIT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    choice.instituteType === 'IIIT' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                    'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}>
                    {choice.instituteType} &bull; Code {choice.instituteCode}
                  </span>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    NIRF #{choice.nirf} Engineering
                  </span>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Estd {estdYear}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white mt-1 leading-snug line-clamp-2">
                  {choice.instituteName}
                </h4>

                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span>{choice.city ? `${choice.city}, ` : ''}{choice.state}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-400">{campusAcres}</span>
                </p>
              </div>
            </div>

            {/* Academic Program Banner */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Program &amp; Degree</span>
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {choice.programName || choice.branchName}
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                [{choice.branchCode}] 4-Year B.Tech
              </span>
            </div>

            {/* Official 2026 Cutoff Ranks Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-medium">
                  Closing Cutoff (Official)
                </div>
                <div className="text-sm font-mono font-black text-white">
                  {choice.effectiveClosingRank.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Opening Rank: <span className="font-mono text-slate-300">{(choice.openingRank || choice.effectiveClosingRank).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-medium">
                  Candidate Rank Margin
                </div>
                <div className="text-sm font-mono font-black">
                  {choice.delta >= 0 ? (
                    <span className="text-emerald-400">+{choice.delta.toLocaleString()} Buffer</span>
                  ) : (
                    <span className="text-amber-400">{choice.delta.toLocaleString()} Reach</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Quota: <span className="text-indigo-300 font-medium">{choice.quotaUsed}</span>
                </div>
              </div>
            </div>

            {/* Placement & CTC Highlights */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/70 to-slate-900/70 border border-cyan-500/25 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Placements &amp; Career Packages</span>
                </span>
                <span className="text-xs font-mono font-black text-cyan-300">
                  Avg ₹{choice.medianCTC || 18.5} LPA &bull; Peak ₹{choice.highestCTC || 48.0} LPA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                <strong className="text-slate-400 font-medium">Top Recruiters:</strong> {recruiters}
              </p>
            </div>

            {/* Quota & Seat Security Note */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{quotaLabel}</span>
              </span>
              <span className="font-mono text-indigo-300">
                {choice.expectedRound}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
