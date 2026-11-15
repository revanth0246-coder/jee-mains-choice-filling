import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  GripVertical, 
  Sparkles, 
  Target, 
  ShieldCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';
import CollegeHoverPopover from './CollegeHoverPopover.jsx';

/**
 * ChoiceRow matching the clean modern light theme from user mockup:
 * - Reorder dots handle: ⋮⋮
 * - Category-tinted choice number square:
 *   - Gold for Dream
 *   - Emerald green for Most Probable
 *   - Sky blue for Safe
 * - Bold college name (hoverable for full details popover)
 * - Badges: [NIT/IIT/IIIT/GFTI] Branch · State · NIRF #XX
 * - Closing Rank (bold dark)
 * - Your Chance pill (e.g. "13,317 ranks short" in rose, or "+151 buffer" in emerald)
 * - Median CTC (₹24.3 LPA)
 * - Expand chevron / actions
 */
export default function ChoiceRow({
  choice,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onRemove,
  isHighlighted
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;
  
  // Section theme determination: gold, green, or light_blue
  const theme = choice.colorTheme || (
    choice.section === 'TOP' ? 'gold' : 
    choice.section === 'PROBABLE' ? 'green' : 'light_blue'
  );

  const delta = choice.delta;
  const isShort = delta < 0;

  return (
    <div
      id={`choice-row-${choice.id}`}
      className={`group transition-all duration-200 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 ${
        isHighlighted
          ? 'bg-indigo-50/80 ring-2 ring-indigo-400'
          : ''
      }`}
    >
      <div className="py-3 px-3 sm:px-4 flex items-center justify-between gap-3 text-sm">
        
        {/* Left: Handle, Choice Number, College Name & Tags */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          
          {/* Drag / Reorder Handle ⋮⋮ */}
          <div className="flex items-center gap-0.5 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0">
            <GripVertical className="w-4 h-4 cursor-grab" />
            
            {/* Quick up/down mini arrows on hover */}
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onMoveUp(index)}
                disabled={isFirst}
                className="hover:text-indigo-600 disabled:opacity-20 transition-colors"
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onMoveDown(index)}
                disabled={isLast}
                className="hover:text-indigo-600 disabled:opacity-20 transition-colors"
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Square Choice Number with category color */}
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
            theme === 'gold'
              ? 'bg-amber-100/90 text-amber-900 border-amber-300'
              : theme === 'green'
              ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
              : 'bg-sky-100/90 text-sky-900 border-sky-300'
          }`}>
            {choice.choiceNumber || index + 1}
          </div>

          {/* College Name & Branch Tags */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CollegeHoverPopover choice={choice}>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm tracking-tight truncate cursor-pointer">
                  {choice.instituteName}
                </h4>
              </CollegeHoverPopover>
            </div>

            {/* Subtitle Tags: [NIT] CSE · Bihar · NIRF #55 */}
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-medium">
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                choice.instituteType === 'IIT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                choice.instituteType === 'NIT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                choice.instituteType === 'IIIT' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {choice.instituteType}
              </span>

              <span className="font-semibold text-slate-700">
                {choice.branchCode}
              </span>
              <span>&middot;</span>

              <span className="truncate max-w-[130px] sm:max-w-none">
                {choice.state || choice.city}
              </span>
              <span>&middot;</span>

              <span>NIRF #{choice.nirf}</span>
            </div>
          </div>

        </div>

        {/* Right Columns: Closing Rank, Your Chance, Median CTC, Expand */}
        <div className="flex items-center gap-4 sm:gap-7 flex-shrink-0">
          
          {/* Closing Rank Column */}
          <div className="text-right min-w-[70px] sm:min-w-[85px]">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 font-mono">
              {choice.effectiveClosingRank.toLocaleString()}
            </span>
          </div>

          {/* Your Chance Column */}
          <div className="text-right min-w-[110px] sm:min-w-[130px] hidden xs:block">
            {isShort ? (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                {Math.abs(delta).toLocaleString()} ranks short
              </span>
            ) : theme === 'green' ? (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +{delta.toLocaleString()} buffer
              </span>
            ) : (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                +{delta.toLocaleString()} safe
              </span>
            )}
          </div>

          {/* Median CTC Column */}
          <div className="text-right min-w-[75px] sm:min-w-[90px] hidden sm:block">
            <span className="font-bold text-xs sm:text-sm text-slate-900 font-mono">
              ₹{choice.medianCTC || 18.5} LPA
            </span>
          </div>

          {/* Expand Details Arrow */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Toggle details"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </div>

      </div>

      {/* Accordion Expanded Details */}
      {isExpanded && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              <strong>Program:</strong> {choice.programName || choice.branchName}
            </span>
            <span>&bull;</span>
            <span>
              <strong>Quota:</strong> {choice.quotaUsed} ({choice.quotaUsed === 'HS' ? '50% Home State' : 'All India / OS'})
            </span>
            <span>&bull;</span>
            <span>
              <strong>Round:</strong> {choice.expectedRound}
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Opening Cutoff: {(choice.openingRank || choice.effectiveClosingRank).toLocaleString()}
          </div>
        </div>
      )}

    </div>
  );
}
