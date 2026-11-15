import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Download, 
  RotateCcw, 
  Check, 
  Search, 
  Sliders, 
  Sparkles, 
  Target, 
  ShieldCheck,
  ArrowUpToLine,
  ArrowDownToLine,
  Save
} from 'lucide-react';
import { downloadChoiceSheet } from '../utils/exportChoiceData.js';

export default function EditChoicesModal({
  isOpen,
  onClose,
  choices = [],
  candidateProfile,
  onSave
}) {
  if (!isOpen) return null;

  // Local working copy of choices for safe editing
  const [localChoices, setLocalChoices] = useState(() => {
    return choices.map((c, i) => ({ ...c, choiceNumber: i + 1 }));
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalChoices(choices.map((c, i) => ({ ...c, choiceNumber: i + 1 })));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  // Re-number choices sequentially
  const reindex = (list) => {
    return list.map((item, idx) => ({ ...item, choiceNumber: idx + 1 }));
  };

  const handleMoveUp = (globalIndex) => {
    if (globalIndex <= 0) return;
    const next = [...localChoices];
    const temp = next[globalIndex - 1];
    next[globalIndex - 1] = next[globalIndex];
    next[globalIndex] = temp;
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handleMoveDown = (globalIndex) => {
    if (globalIndex >= localChoices.length - 1) return;
    const next = [...localChoices];
    const temp = next[globalIndex + 1];
    next[globalIndex + 1] = next[globalIndex];
    next[globalIndex] = temp;
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handleMoveToTop = (globalIndex) => {
    if (globalIndex <= 0) return;
    const next = [...localChoices];
    const [item] = next.splice(globalIndex, 1);
    next.unshift(item);
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handleMoveToBottom = (globalIndex) => {
    if (globalIndex >= localChoices.length - 1) return;
    const next = [...localChoices];
    const [item] = next.splice(globalIndex, 1);
    next.push(item);
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handlePriorityInput = (currentGlobalIndex, targetNumber) => {
    const targetIdx = Number(targetNumber) - 1;
    if (isNaN(targetIdx) || targetIdx < 0 || targetIdx >= localChoices.length) return;
    if (targetIdx === currentGlobalIndex) return;

    const next = [...localChoices];
    const [item] = next.splice(currentGlobalIndex, 1);
    next.splice(targetIdx, 0, item);
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handleRemove = (id) => {
    const next = localChoices.filter(c => c.id !== id);
    setLocalChoices(reindex(next));
    setSavedSuccess(false);
  };

  const handleReset = () => {
    setLocalChoices(choices.map((c, i) => ({ ...c, choiceNumber: i + 1 })));
    setSavedSuccess(false);
  };

  const handleSaveAndApply = () => {
    if (onSave) {
      onSave(localChoices);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDownload = () => {
    // Save first if not already saved
    if (onSave) onSave(localChoices);
    downloadChoiceSheet(localChoices, candidateProfile);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Filtered view inside the modal for ease of editing
  const filteredChoices = useMemo(() => {
    return localChoices.filter(c => {
      // Category filter
      if (categoryFilter === 'DREAM') {
        const isDream = c.section === 'TOP' || c.colorTheme === 'gold' || c.zone === 'AMBITIOUS';
        if (!isDream) return false;
      } else if (categoryFilter === 'PROBABLE') {
        const isProbable = c.section === 'PROBABLE' || c.colorTheme === 'green' || c.zone === 'LIKELY';
        if (!isProbable) return false;
      } else if (categoryFilter === 'SAFE') {
        const isSafe = c.section === 'EASILY' || c.colorTheme === 'light_blue' || c.zone === 'BACKUP';
        if (!isSafe) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = c.instituteName?.toLowerCase().includes(term);
        const matchBranch = c.branchName?.toLowerCase().includes(term) || c.branchCode?.toLowerCase().includes(term);
        const matchState = c.state?.toLowerCase().includes(term);
        if (!matchName && !matchBranch && !matchState) return false;
      }

      return true;
    });
  }, [localChoices, categoryFilter, searchTerm]);

  const isCSAB = candidateProfile?.counselingType === 'CSAB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 text-indigo-300 border border-indigo-400/30 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Edit Choice Preferences
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  {isCSAB ? 'CSAB Special' : 'JoSAA 2026'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({localChoices.length} choices)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Change choice numbers, reorder colleges, remove unwanted options, and download your final choice data.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All ({localChoices.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('DREAM')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                categoryFilter === 'DREAM'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Dream</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PROBABLE')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                categoryFilter === 'PROBABLE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Target className="w-3 h-3 text-emerald-600" />
              <span>Probable</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('SAFE')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                categoryFilter === 'SAFE'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-600" />
              <span>Safe</span>
            </button>
          </div>

          {/* Search Box & Quick Reset */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find in choices..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold transition-colors cursor-pointer"
              title="Reset order to recommended algorithm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

        </div>

        {/* Notification Banner on Save/Download */}
        {savedSuccess && (
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 animate-fade-in flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</span>
              <span>Choice order saved &amp; applied! Download your choice sheet below:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}

        {downloadSuccess && (
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 animate-fade-in flex-shrink-0">
            <Check className="w-4 h-4 text-indigo-600" />
            <span>Choice data file successfully downloaded to your device!</span>
          </div>
        )}

        {/* Choice List Workspace */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-4 space-y-1">
          {filteredChoices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No choices match the search or filter criteria.
            </div>
          ) : (
            filteredChoices.map((choice) => {
              const globalIndex = localChoices.findIndex(c => c.id === choice.id);
              const theme = choice.colorTheme || (
                choice.section === 'TOP' ? 'gold' :
                choice.section === 'PROBABLE' ? 'green' : 'light_blue'
              );

              return (
                <div 
                  key={choice.id}
                  className="p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-200 group"
                >
                  {/* Left: Reorder Controls & Choice Number */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    
                    {/* Up / Down Button Arrows */}
                    <div className="flex flex-col gap-0.5 text-slate-400 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(globalIndex)}
                        disabled={globalIndex === 0}
                        className="p-1 rounded hover:bg-slate-200 hover:text-indigo-600 disabled:opacity-20 transition-all cursor-pointer"
                        title="Move choice up 1 position"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(globalIndex)}
                        disabled={globalIndex === localChoices.length - 1}
                        className="p-1 rounded hover:bg-slate-200 hover:text-indigo-600 disabled:opacity-20 transition-all cursor-pointer"
                        title="Move choice down 1 position"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Quick Move to Top / Bottom */}
                    <div className="hidden sm:flex flex-col gap-0.5 text-slate-400 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveToTop(globalIndex)}
                        disabled={globalIndex === 0}
                        className="p-1 rounded hover:bg-slate-200 hover:text-amber-600 disabled:opacity-20 transition-all cursor-pointer"
                        title="Move to top (#1)"
                      >
                        <ArrowUpToLine className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveToBottom(globalIndex)}
                        disabled={globalIndex === localChoices.length - 1}
                        className="p-1 rounded hover:bg-slate-200 hover:text-slate-600 disabled:opacity-20 transition-all cursor-pointer"
                        title="Move to bottom"
                      >
                        <ArrowDownToLine className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Priority Number Input */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">#</span>
                      <input
                        type="number"
                        min="1"
                        max={localChoices.length}
                        value={globalIndex + 1}
                        onChange={(e) => handlePriorityInput(globalIndex, e.target.value)}
                        className={`w-12 text-center py-1 rounded-lg text-xs font-black font-mono border focus:ring-2 focus:ring-indigo-400 outline-none transition-all ${
                          theme === 'gold'
                            ? 'bg-amber-100 text-amber-950 border-amber-300'
                            : theme === 'green'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-sky-100 text-sky-950 border-sky-300'
                        }`}
                        title="Type a new number to move this choice directly"
                      />
                    </div>

                    {/* College & Program Info */}
                    <div className="min-w-0 flex-1 pl-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          choice.instituteType === 'IIT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          choice.instituteType === 'NIT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          choice.instituteType === 'IIIT' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {choice.instituteType}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {choice.instituteName}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="font-semibold text-slate-700">{choice.branchCode}</span>
                        <span>&bull;</span>
                        <span className="truncate">{choice.programName || choice.branchName}</span>
                        <span>&bull;</span>
                        <span>Cutoff: {Number(choice.effectiveClosingRank).toLocaleString()}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right: Remove Choice Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemove(choice.id)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Remove this choice from your preference list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Save & Download Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          
          <div className="text-slate-500 flex items-center gap-2 self-start sm:self-auto">
            <span>Configured: <strong className="text-slate-800 font-mono">{localChoices.length}</strong> choices</span>
            <span>&bull;</span>
            <span className="text-slate-400">Order changes apply instantly upon saving</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            
            {/* Single Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download official choice sheet matching the website"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download</span>
            </button>

            {/* Save & Apply Changes */}
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Changes</span>
            </button>

            {/* Done / Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
