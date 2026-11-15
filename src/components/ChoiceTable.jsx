import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Search, 
  Layers, 
  RefreshCw, 
  ListOrdered,
  Sliders,
  Download,
  Check,
  ChevronDown
} from 'lucide-react';
import ChoiceRow from './ChoiceRow.jsx';
import EditChoicesModal from './EditChoicesModal.jsx';
import { downloadChoiceSheet } from '../utils/exportChoiceData.js';

export default function ChoiceTable({
  choices,
  counselingType = 'JOSAA',
  candidateProfile = {},
  onUpdateChoices,
  activeFilter,
  setActiveFilter,
  branchStream,
  setBranchStream,
  searchQuery,
  setSearchQuery,
  isSmartWindow,
  setIsSmartWindow,
  onMoveUp,
  onMoveDown,
  onRemove,
  onClearAll,
  onResetOrder,
  highlightedRowId,
  instituteCounts = {},
  totalEligibleCount,
  onOpenRulesModal
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null);

  // Partition current choices into the 3 categories
  const topChoices = choices.filter(c => c.section === 'TOP' || c.colorTheme === 'gold' || c.zone === 'AMBITIOUS');
  const probableChoices = choices.filter(c => c.section === 'PROBABLE' || c.colorTheme === 'green' || c.zone === 'LIKELY');
  const easilyChoices = choices.filter(c => 
    c.section === 'EASILY' || 
    c.colorTheme === 'light_blue' || 
    c.zone === 'BACKUP' || 
    c.zone === 'EXTENDED' ||
    (!['TOP', 'PROBABLE'].includes(c.section) && c.colorTheme !== 'gold' && c.colorTheme !== 'green')
  );

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isCSAB = counselingType === 'CSAB';

  return (
    <div className="space-y-5">
      
      {/* Top Filter Bar Card matching user mockup */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: 3 Category Filter Pills (Dream / Target / Safe) */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            type="button"
            onClick={() => scrollToSection('section-top-colleges')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Dream {topChoices.length}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('section-most-probable')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-900 border border-emerald-300 transition-all shadow-sm cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Target {probableChoices.length}</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('section-easily-coming')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-100/90 hover:bg-sky-200/90 text-sky-900 border border-sky-300 transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Safe {easilyChoices.length}</span>
          </button>

        </div>

        {/* Right: Branch Filter Dropdown & Search Input */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          
          {/* Branch Filter Dropdown */}
          <div className="relative">
            <select
              value={branchStream}
              onChange={(e) => setBranchStream(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold outline-none hover:border-slate-300 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All branches ▾</option>
              <option value="CS_IT">Computer Science &amp; IT</option>
              <option value="ELECTRONICS">Electronics &amp; Electrical</option>
              <option value="CORE_ENG">Core Engineering</option>
              <option value="ARCHITECTURE">Architecture &amp; Planning</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder-slate-400 outline-none hover:border-slate-300 focus:border-indigo-500 transition-all"
            />
          </div>

        </div>

      </div>

      {/* Table Column Headers */}
      <div className="px-5 py-2.5 bg-slate-100/80 rounded-xl text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between gap-3 border border-slate-200/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono">COLLEGE &amp; BRANCH</span>
          <span className="text-[10px] text-slate-400 normal-case font-normal hidden sm:inline">
            (hover college name for full cutoff &amp; placement card)
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-7 flex-shrink-0 text-right">
          <span className="min-w-[70px] sm:min-w-[85px]">CLOSING RANK</span>
          <span className="min-w-[110px] sm:min-w-[130px] hidden xs:inline">YOUR CHANCE</span>
          <span className="min-w-[75px] sm:min-w-[90px] hidden sm:inline">MEDIAN CTC</span>
        </div>
      </div>

      {/* 3 Categories with Color Shade Top Borders */}
      <div className="space-y-6">
        
        {/* ============================================================== */}
        {/* SECTION 1: TOP COLLEGES (DREAM) - GOLD TOP BORDER SHADE        */}
        {/* ============================================================== */}
        {topChoices.length > 0 && (
          <div 
            id="section-top-colleges" 
            className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden border-t-4 border-t-amber-500 scroll-mt-24 transition-all"
          >
            {/* Gold Shade Top Banner */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-50/90 via-amber-100/40 to-white border-b border-amber-200/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-400/40">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                    Top Colleges (Dream)
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                      Gold
                    </span>
                  </h3>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Aspirational top institutes from Rank #1 cutoffs. Zero penalty in choice filling.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-sm flex-shrink-0">
                {topChoices.length} Dream
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {topChoices.map((choice) => {
                const globalIdx = choices.findIndex(c => c.id === choice.id);
                return (
                  <ChoiceRow
                    key={choice.id}
                    choice={choice}
                    index={globalIdx >= 0 ? globalIdx : 0}
                    totalCount={choices.length}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onRemove={onRemove}
                    isHighlighted={highlightedRowId === choice.id}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: MOST PROBABLE - EMERALD GREEN TOP BORDER SHADE       */}
        {/* ============================================================== */}
        {probableChoices.length > 0 && (
          <div 
            id="section-most-probable" 
            className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden border-t-4 border-t-emerald-500 scroll-mt-24 transition-all"
          >
            {/* Emerald Green Shade Top Banner */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-white border-b border-emerald-200/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-400/40">
                  <Target className="w-4 h-4 text-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                    Most Probable Colleges
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      Emerald Green
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Target allotment zone where your CRL rank directly matches official closing cutoffs.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm flex-shrink-0">
                {probableChoices.length} Probable
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {probableChoices.map((choice) => {
                const globalIdx = choices.findIndex(c => c.id === choice.id);
                return (
                  <ChoiceRow
                    key={choice.id}
                    choice={choice}
                    index={globalIdx >= 0 ? globalIdx : 0}
                    totalCount={choices.length}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onRemove={onRemove}
                    isHighlighted={highlightedRowId === choice.id}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: EASILY COMING (SAFE) - SKY BLUE TOP BORDER SHADE    */}
        {/* ============================================================== */}
        {easilyChoices.length > 0 && (
          <div 
            id="section-easily-coming" 
            className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden border-t-4 border-t-sky-400 scroll-mt-24 transition-all"
          >
            {/* Sky Blue Shade Top Banner */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-sky-50/90 via-sky-100/40 to-white border-b border-sky-200/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-400/40">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-sky-950 uppercase tracking-wider flex items-center gap-2">
                    Easily Coming (Safe)
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-300">
                      Sky Blue
                    </span>
                  </h3>
                  <p className="text-[11px] text-sky-800/80 mt-0.5">
                    Safe backup choices comfortably clearing your rank, guaranteeing confirmed admission cushion.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300 shadow-sm flex-shrink-0">
                {easilyChoices.length} Safe
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {easilyChoices.map((choice) => {
                const globalIdx = choices.findIndex(c => c.id === choice.id);
                return (
                  <ChoiceRow
                    key={choice.id}
                    choice={choice}
                    index={globalIdx >= 0 ? globalIdx : 0}
                    totalCount={choices.length}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onRemove={onRemove}
                    isHighlighted={highlightedRowId === choice.id}
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* AT THE END OF COLLEGES: EDIT CHOICES & DOWNLOAD DATA CARD     */}
      {/* ============================================================== */}
      <div id="edit-choices-section" className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center font-bold flex-shrink-0">
              <Sliders className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Edit Choice Preferences &amp; Finalize List
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {choices.length} colleges
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust priority order numbers, reorganize preferences, remove unwanted options, and download your finalized official choice list.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Edit Choices Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit Choices</span>
            </button>

            {/* Single Download Button */}
            <button
              type="button"
              onClick={() => {
                downloadChoiceSheet(choices, candidateProfile);
                setDownloadToast('Choice sheet downloaded successfully!');
                setTimeout(() => setDownloadToast(null), 3500);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download official choice sheet matching the website"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download</span>
            </button>

          </div>

        </div>

        {/* Download / Edit Success Toast */}
        {downloadToast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{downloadToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadToast(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>

      {/* Edit Choices Interactive Modal */}
      <EditChoicesModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        choices={choices}
        candidateProfile={candidateProfile}
        onSave={(updatedList) => {
          if (onUpdateChoices) {
            onUpdateChoices(updatedList);
          }
          setDownloadToast('✓ Choice order updated successfully! You can now download your finalized choice sheet.');
          setTimeout(() => setDownloadToast(null), 6000);
        }}
      />

    </div>
  );
}
