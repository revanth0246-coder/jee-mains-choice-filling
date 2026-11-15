import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  Check, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import CollegeHoverPopover from './CollegeHoverPopover.jsx';

/**
 * LikelySidebar matching the clean white theme from user mockup:
 * - Title: Most likely allotments
 * - Subtitle: Based on CRL #... · Category · State (50% HS)
 * - Clean cards with:
 *   - [IIIT/NIT] NIRF #XX badges
 *   - Bold college name & branch
 *   - Emerald green progress line
 *   - Cutoff | +Buffer & Median CTC
 *   - "Locate in choice list →"
 */
export default function LikelySidebar({
  likelyChoices = [],
  candidateProfile,
  onLocateChoice,
  onLocateInTable,
  highlightedRowId,
  onOpenRulesModal
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const choicesList = Array.isArray(likelyChoices) && likelyChoices.length > 0 
    ? likelyChoices 
    : [];

  const displayedChoices = showAll ? choicesList : choicesList.slice(0, 4);

  const handleLocate = (choice) => {
    if (!choice) return;
    const fn = onLocateChoice || onLocateInTable;
    if (fn) fn(choice.id);
    setCopiedId(choice.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <aside className="space-y-4">
      
      {/* Sticky White Container Card */}
      <div className="sticky top-24 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-slate-800">
        
        {/* Header */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center justify-between">
            <span>Most likely allotments</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Based on CRL #{Number(candidateProfile.jeeMainRank || 38291).toLocaleString()} &bull; {candidateProfile.category} &bull; {candidateProfile.homeState || 'All India'} {candidateProfile.counselingType !== 'CSAB' ? '(50% HS)' : ''}
          </p>
        </div>

        {/* List of Likely Cards matching mockup */}
        <div className="space-y-3.5">
          {displayedChoices.map((choice) => {
            const isSelected = highlightedRowId === choice.id;
            const isLocated = copiedId === choice.id;

            return (
              <div
                key={choice.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                  isSelected || isLocated
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Top badges: [IIIT] NIRF #85 */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    choice.instituteType === 'IIT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    choice.instituteType === 'NIT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    choice.instituteType === 'IIIT' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {choice.instituteType}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    NIRF #{choice.nirf}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {choice.quotaUsed === 'HS' ? '50% HS' : choice.quotaUsed}
                  </span>
                </div>

                {/* College & Branch */}
                <CollegeHoverPopover choice={choice}>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-tight line-clamp-1">
                    {choice.instituteName}
                  </h4>
                </CollegeHoverPopover>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {choice.branchCode} &bull; {choice.programName || choice.branchName}
                </p>

                {/* Emerald Green Progress line */}
                <div className="w-full h-1 bg-slate-100 rounded-full my-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(40, choice.probability || 86))}%` }}
                  />
                </div>

                {/* Cutoff & Median CTC Details */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 mr-1.5">Cutoff:</span>
                    <strong className="font-mono text-slate-900">{choice.effectiveClosingRank.toLocaleString()}</strong>
                    <span className="text-emerald-600 font-bold ml-1.5 font-mono text-[11px]">
                      +{choice.delta >= 0 ? choice.delta.toLocaleString() : 0} buffer
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">CTC:</span>
                    <strong className="font-mono text-slate-900 font-bold">₹{choice.medianCTC || 19.8} LPA</strong>
                  </div>
                </div>

                {/* Locate in choice list Link */}
                <button
                  type="button"
                  onClick={() => handleLocate(choice)}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isLocated ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Located in Choice List!</span>
                    </>
                  ) : (
                    <>
                      <span>Locate in choice list</span>
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>

        {/* View all toggle */}
        {choicesList.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 text-center flex items-center justify-center gap-1 transition-colors pt-2 border-t border-slate-100"
          >
            <span>{showAll ? 'Show less' : `View all ${choicesList.length} →`}</span>
          </button>
        )}

      </div>

    </aside>
  );
}
