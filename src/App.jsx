import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import RankPromptModal from './components/RankPromptModal.jsx';
import AboutUsModal from './components/AboutUsModal.jsx';
import HowItWorksModal from './components/HowItWorksModal.jsx';
import ContactModal from './components/ContactModal.jsx';
import OnboardingWizard from './components/OnboardingWizard.jsx';
import StatsBar from './components/StatsBar.jsx';
import ChoiceTable from './components/ChoiceTable.jsx';
import LikelySidebar from './components/LikelySidebar.jsx';
import LockChoicesModal from './components/LockChoicesModal.jsx';
import RulesGuideModal from './components/RulesGuideModal.jsx';
import { ALL_JOSAA_PROGRAMS, INDIAN_STATES, RESERVATION_CATEGORIES } from './data/josaaCutoffs.js';
import { generateSmartChoiceList, filterChoices } from './utils/choiceEngine.js';
import { 
  Sparkles, 
  Compass, 
  Target, 
  ShieldCheck, 
  RotateCcw,
  BookOpen,
  Zap,
  Sliders
} from 'lucide-react';

// Default candidate profile matching the user's reference mockup (CSAB, CRL 38291, OBC-NCL, Telangana)
const INITIAL_PROFILE = {
  counselingType: 'CSAB',
  jeeMainRank: 38291,
  isJeeAdvQualified: false,
  jeeAdvRank: '',
  homeState: 'Telangana',
  category: 'OBC-NCL',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};

export default function App() {
  // Splash screen: displays the Hero visual for 1 to 3 seconds (2.2s) on initial load and every browser refresh
  const [showSplash, setShowSplash] = useState(true);

  // Prompt modal: asks candidate for rank and preferences on initial load & every refresh once splash ends
  const [isRankPromptOpen, setIsRankPromptOpen] = useState(true);

  // Website is always open and ready with verified choices
  const [hasGenerated, setHasGenerated] = useState(true);

  const [candidateProfile, setCandidateProfile] = useState(() => {
    const saved = localStorage.getItem('josaa_candidate_profile_2026');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.jeeMainRank && Number(parsed.jeeMainRank) > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PROFILE;
  });

  // Local state for the quick rank input in the top header
  const [quickRankInput, setQuickRankInput] = useState(String(candidateProfile.jeeMainRank || 38291));

  useEffect(() => {
    if (candidateProfile.jeeMainRank) {
      setQuickRankInput(String(candidateProfile.jeeMainRank));
      localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify(candidateProfile));
    }
  }, [candidateProfile]);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [isSmartWindow, setIsSmartWindow] = useState(true);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [branchStream, setBranchStream] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [customChoices, setCustomChoices] = useState(null);

  const generatedData = useMemo(() => {
    const rank = Number(candidateProfile.jeeMainRank || 38291);
    const validProfile = {
      ...candidateProfile,
      jeeMainRank: rank > 0 ? rank : 38291
    };
    return generateSmartChoiceList(ALL_JOSAA_PROGRAMS, validProfile);
  }, [candidateProfile]);

  const activeChoices = useMemo(() => {
    if (customChoices) return customChoices;
    return isSmartWindow ? generatedData.smartWindowChoices : generatedData.fullRoundChoices;
  }, [customChoices, isSmartWindow, generatedData]);

  const displayedChoices = useMemo(() => {
    return filterChoices(activeChoices, {
      filterType: activeFilter,
      branchStream,
      searchQuery
    });
  }, [activeChoices, activeFilter, branchStream, searchQuery]);

  const summaryStats = useMemo(() => {
    const list = activeChoices;
    if (!list || list.length === 0) {
      return {
        totalChoices: 0,
        topCount: 0,
        probableCount: 0,
        easilyCount: 0,
        dreamCount: 0,
        likelyCount: 0,
        backupCount: 0,
        avgCTC: 0,
        highestCTC: 0
      };
    }
    const ctcValues = list.map(c => c.medianCTC).filter(Boolean);
    const avgCTC = ctcValues.length > 0 ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1) : 0;
    const peakValues = list.map(c => c.highestCTC).filter(Boolean);
    const highestCTC = peakValues.length > 0 ? Math.max(...peakValues).toFixed(1) : 0;

    const topCount = list.filter(c => c.section === 'TOP' || c.colorTheme === 'gold' || c.zone === 'AMBITIOUS').length;
    const probableCount = list.filter(c => c.section === 'PROBABLE' || c.colorTheme === 'green' || c.zone === 'LIKELY').length;
    const easilyCount = list.filter(c => c.section === 'EASILY' || c.colorTheme === 'light_blue' || (!['TOP', 'PROBABLE'].includes(c.section) && c.colorTheme !== 'gold' && c.colorTheme !== 'green')).length;

    return {
      totalChoices: list.length,
      topCount,
      probableCount,
      easilyCount,
      dreamCount: topCount,
      likelyCount: probableCount,
      backupCount: easilyCount,
      avgCTC,
      highestCTC
    };
  }, [activeChoices]);

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const nextChoices = [...activeChoices];
    const temp = nextChoices[index - 1];
    nextChoices[index - 1] = nextChoices[index];
    nextChoices[index] = temp;
    nextChoices.forEach((c, i) => { c.choiceNumber = i + 1; });
    setCustomChoices(nextChoices);
  };

  const handleMoveDown = (index) => {
    if (index >= activeChoices.length - 1) return;
    const nextChoices = [...activeChoices];
    const temp = nextChoices[index + 1];
    nextChoices[index + 1] = nextChoices[index];
    nextChoices[index] = temp;
    nextChoices.forEach((c, i) => { c.choiceNumber = i + 1; });
    setCustomChoices(nextChoices);
  };

  const handleRemove = (id) => {
    const nextChoices = activeChoices.filter(c => c.id !== id);
    nextChoices.forEach((c, i) => { c.choiceNumber = i + 1; });
    setCustomChoices(nextChoices);
  };

  const handleResetOrder = () => {
    setCustomChoices(null);
  };

  const handleClearAllChoices = () => {
    setCustomChoices([]);
  };

  const handleLocateRow = (programId) => {
    setActiveFilter('ALL');
    setBranchStream('ALL');
    setSearchQuery('');

    setTimeout(() => {
      const rowElement = document.getElementById(`choice-row-${programId}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedRowId(programId);
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      }
    }, 100);
  };

  const handleScrollToLikelyZone = () => {
    const divider = document.getElementById('likely-zone-divider');
    if (divider) {
      divider.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToFinder = () => {
    const el = document.getElementById('choice-sheet-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToBeginning = () => {
    setCandidateProfile(INITIAL_PROFILE);
    setQuickRankInput(String(INITIAL_PROFILE.jeeMainRank));
    setCustomChoices(null);
    setIsRankPromptOpen(true);
    scrollToTop();
  };

  const handleApplyQuickRank = () => {
    const rankNum = Number(quickRankInput);
    if (rankNum > 0) {
      setCandidateProfile(prev => ({
        ...prev,
        jeeMainRank: rankNum
      }));
      setCustomChoices(null);
    }
  };

  const handleUpdateQuickProfile = (partial) => {
    setCandidateProfile(prev => ({
      ...prev,
      ...partial
    }));
    setCustomChoices(null);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-800 bg-[#eef2fe] text-slate-900">
      
      {/* ========================================================================= */}
      {/* INTRO HERO SPLASH SCREEN (Shown for 1 to 3 seconds on load & refresh)      */}
      {/* ========================================================================= */}
      {showSplash && (
        <SplashScreen
          onFinish={handleSplashFinish}
          onOpenRules={() => {
            setShowSplash(false);
            setIsRulesModalOpen(true);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN WEBSITE: WHITE & BLUE THEME MATCHING USER REFERENCE IMAGE            */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col animate-fade-in">
        
        {/* Top Section: Deep Royal Navy/Indigo Gradient Background (#0c1439 -> #25338d) */}
        <div className="bg-gradient-to-r from-[#0c1439] via-[#16245f] to-[#25338d] text-white pb-8 shadow-md">
          <Navbar
            candidateProfile={candidateProfile}
            hasGenerated={hasGenerated}
            onOpenWizard={() => setIsRankPromptOpen(true)}
            onOpenLockModal={() => setIsLockModalOpen(true)}
            onOpenRulesModal={() => setIsRulesModalOpen(true)}
            onOpenAbout={() => setIsAboutModalOpen(true)}
            onOpenHowItWorks={() => setIsHowItWorksModalOpen(true)}
            onOpenContact={() => setIsContactModalOpen(true)}
            onScrollToTop={scrollToTop}
            onStartFinder={scrollToFinder}
            onResetToBeginning={handleResetToBeginning}
            choicesCount={activeChoices.length}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
            
            {/* Title Block matching user mockup */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Your {candidateProfile.counselingType === 'CSAB' ? 'CSAB Special' : 'JoSAA'} choice list
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {activeChoices.length} colleges ranked for CRL #{Number(candidateProfile.jeeMainRank || 38291).toLocaleString()} &bull; {candidateProfile.category} &bull; {candidateProfile.homeState || 'All India'}
              </p>
            </div>

            {/* Quick Rank & Preferences Customizer Bar (Interactive at all times) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Quick Rank &amp; Quota Customizer
                  </span>
                  <span className="text-[11px] text-slate-300 hidden sm:inline">
                    &bull; Change your rank, category or authority to instantly recalculate all {activeChoices.length} choices
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRankPromptOpen(true)}
                    className="px-3 py-1 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 border border-blue-400/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Rank Prompter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(true)}
                    className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Full Wizard</span>
                    <span>↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToBeginning}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to default CSAB 38,291"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* Interactive Controls Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
                
                {/* 1. Authority Toggle */}
                <div className="flex items-center bg-black/25 rounded-xl p-1 border border-white/15">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuickProfile({ counselingType: 'CSAB' })}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      candidateProfile.counselingType === 'CSAB'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    CSAB (96)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuickProfile({ counselingType: 'JOSAA' })}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      candidateProfile.counselingType === 'JOSAA'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    JoSAA (119)
                  </button>
                </div>

                {/* 2. CRL Rank Input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-300">
                    CRL #
                  </span>
                  <input
                    type="number"
                    value={quickRankInput}
                    onChange={(e) => setQuickRankInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleApplyQuickRank();
                    }}
                    placeholder="Rank e.g. 38291"
                    className="w-full pl-14 pr-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 focus:bg-white text-white focus:text-slate-900 border border-white/20 focus:border-blue-400 font-mono font-bold text-xs focus:outline-none transition-colors"
                  />
                </div>

                {/* 3. Category Select */}
                <div>
                  <select
                    value={candidateProfile.category}
                    onChange={(e) => handleUpdateQuickProfile({ category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#131d45] text-white border border-white/20 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                  >
                    {RESERVATION_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0e173a] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Home State Select */}
                <div>
                  <select
                    value={candidateProfile.homeState || 'Telangana'}
                    onChange={(e) => handleUpdateQuickProfile({ homeState: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#131d45] text-white border border-white/20 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st} className="bg-[#0e173a] text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Update Choices Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleApplyQuickRank}
                    className="w-full py-1.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Update Choices</span>
                  </button>
                </div>

              </div>
            </div>

            {/* 4 White Stats Cards sitting on the Gradient */}
            <StatsBar
              stats={summaryStats}
              isSmartWindow={isSmartWindow}
              setIsSmartWindow={setIsSmartWindow}
              smartWindowCount={generatedData.smartWindowChoices?.length || summaryStats.totalChoices}
              fullPoolCount={generatedData.fullRoundChoices?.length || generatedData.totalEligibleCount}
              candidateProfile={candidateProfile}
              onScrollToLikely={handleScrollToLikelyZone}
            />

          </div>
        </div>

        {/* Main Content Area: Clean Modern Canvas (#eef2fe) where White Cards Shine */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-slate-800">
          
          {/* Side-by-Side Dashboard Layout (65% Left Choice Table / 35% Right Likely Sidebar) */}
          <div id="choice-sheet-section" className="flex flex-col lg:flex-row items-start gap-6">
            
            {/* Left Column: Official JoSAA / CSAB Choice-Filling Sheet (65% width) */}
            <div className="w-full lg:w-[65%] flex-shrink-0">
              <ChoiceTable
                choices={displayedChoices}
                counselingType={candidateProfile.counselingType || 'CSAB'}
                candidateProfile={candidateProfile}
                onUpdateChoices={(updated) => setCustomChoices(updated)}
                isSmartWindow={isSmartWindow}
                setIsSmartWindow={setIsSmartWindow}
                onToggleSmartWindow={() => setIsSmartWindow(!isSmartWindow)}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onFilterChange={setActiveFilter}
                branchStream={branchStream}
                setBranchStream={setBranchStream}
                onStreamChange={setBranchStream}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchChange={setSearchQuery}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onRemove={handleRemove}
                onResetOrder={handleResetOrder}
                onClearAll={handleClearAllChoices}
                onOpenLockModal={() => setIsLockModalOpen(true)}
                highlightedRowId={highlightedRowId}
                instituteCounts={{
                  IIT: activeChoices.filter(c => c.instituteType === 'IIT').length,
                  NIT: activeChoices.filter(c => c.instituteType === 'NIT').length,
                  IIIT: activeChoices.filter(c => c.instituteType === 'IIIT').length,
                  GFTI: activeChoices.filter(c => c.instituteType === 'GFTI').length
                }}
                totalEligibleCount={generatedData.totalEligibleCount}
              />
            </div>

            {/* Right Column: Sticky Most Likely Colleges Sidebar (35% width) */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24">
              <LikelySidebar
                likelyChoices={generatedData.mostLikelyChoices}
                candidateProfile={candidateProfile}
                onLocateInTable={handleLocateRow}
              />
            </div>

          </div>

        </main>

        {/* Bottom Floating Comparison / Lock Bar matching user mockup */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0c1633]/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium text-slate-300">
                <strong className="text-white font-bold">{Math.min(activeChoices.length, 321)} colleges</strong> ranked for your verified CRL
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLockModalOpen(true)}
              className="font-bold text-white hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Compare side by side &amp; Lock choices &rarr;</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer in White and Blue theme */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">JEE College Finder &bull; JoSAA SeatMatrix 2026 Studio</span>
            <span>&bull;</span>
            <span>All 119 Institutes (23 IITs, 32 NITs, 26 IIITs, 38 GFTIs)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button type="button" onClick={() => setIsRulesModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer">
              Counseling Guidelines
            </button>
            <button type="button" onClick={handleResetToBeginning} className="hover:text-blue-600 transition-colors cursor-pointer">
              Reset to Beginning
            </button>
            <button type="button" onClick={() => setIsLockModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer">
              Choice Locking
            </button>
          </div>
        </div>
      </footer>

      {/* Rank Prompt Dialog: Asks for details on initial load / refresh once splash ends */}
      <RankPromptModal
        isOpen={isRankPromptOpen && !showSplash}
        onClose={() => setIsRankPromptOpen(false)}
        currentProfile={candidateProfile}
        onSaveProfile={(profile) => {
          setCandidateProfile(profile);
          setQuickRankInput(String(profile.jeeMainRank || 38291));
          setCustomChoices(null);
        }}
      />

      {/* Full 4-Step Setup Wizard */}
      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currentProfile={candidateProfile}
        onSaveProfile={(profile) => {
          setCandidateProfile(profile);
          setQuickRankInput(String(profile.jeeMainRank || 38291));
          setCustomChoices(null);
        }}
      />

      <LockChoicesModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        choices={activeChoices}
        candidateProfile={candidateProfile}
      />

      <RulesGuideModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksModalOpen}
        onClose={() => setIsHowItWorksModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

    </div>
  );
}
