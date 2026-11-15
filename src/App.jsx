import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroLanding from './components/HeroLanding.jsx';
import AboutUsModal from './components/AboutUsModal.jsx';
import HowItWorksModal from './components/HowItWorksModal.jsx';
import ContactModal from './components/ContactModal.jsx';
import OnboardingCard from './components/OnboardingCard.jsx';
import OnboardingWizard from './components/OnboardingWizard.jsx';
import StatsBar from './components/StatsBar.jsx';
import ChoiceTable from './components/ChoiceTable.jsx';
import LikelySidebar from './components/LikelySidebar.jsx';
import LockChoicesModal from './components/LockChoicesModal.jsx';
import RulesGuideModal from './components/RulesGuideModal.jsx';
import { ALL_JOSAA_PROGRAMS } from './data/josaaCutoffs.js';
import { generateSmartChoiceList, filterChoices } from './utils/choiceEngine.js';
import { 
  Sparkles, 
  Compass, 
  Target, 
  ShieldCheck, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

const INITIAL_PROFILE = {
  counselingType: 'JOSAA',
  jeeMainRank: '',
  isJeeAdvQualified: false,
  jeeAdvRank: '',
  homeState: '',
  category: 'OPEN',
  genderPool: 'Gender-Neutral',
  preferredBranches: ['ALL']
};

export default function App() {
  const [hasGenerated, setHasGenerated] = useState(() => {
    return localStorage.getItem('josaa_has_generated_2026') === 'true';
  });

  const [candidateProfile, setCandidateProfile] = useState(() => {
    const saved = localStorage.getItem('josaa_candidate_profile_2026');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.jeeMainRank) return parsed;
      } catch (e) {}
    }
    return INITIAL_PROFILE;
  });

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

  useEffect(() => {
    if (hasGenerated && candidateProfile.jeeMainRank) {
      localStorage.setItem('josaa_candidate_profile_2026', JSON.stringify(candidateProfile));
      localStorage.setItem('josaa_has_generated_2026', 'true');
    }
  }, [candidateProfile, hasGenerated]);

  const generatedData = useMemo(() => {
    if (!candidateProfile.jeeMainRank || Number(candidateProfile.jeeMainRank) <= 0) {
      return {
        smartWindowChoices: [],
        fullRoundChoices: [],
        mostLikelyChoices: [],
        ambitiousCount: 0,
        likelyCount: 0,
        backupCount: 0,
        totalEligibleCount: 0,
        extendedCount: 0
      };
    }
    return generateSmartChoiceList(ALL_JOSAA_PROGRAMS, candidateProfile);
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
    const el = document.getElementById('candidate-wizard-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToBeginning = () => {
    localStorage.removeItem('josaa_has_generated_2026');
    localStorage.removeItem('josaa_candidate_profile_2026');
    setHasGenerated(false);
    setCandidateProfile(INITIAL_PROFILE);
    setCustomChoices(null);
    scrollToTop();
  };

  const handleGenerateComplete = (profile) => {
    setCandidateProfile(profile);
    setHasGenerated(true);
    setCustomChoices(null);
    setTimeout(() => {
      const el = document.getElementById('stats-summary-bar') || document.getElementById('choice-sheet-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 ${
      hasGenerated 
        ? 'bg-[#eef2fe] text-slate-900' 
        : 'bg-gradient-to-b from-[#0c1439] via-[#122252] to-[#0a122e] text-slate-100'
    }`}>
      
      {/* ========================================================================= */}
      {/* CASE A: WHEN CHOICES HAVE NOT BEEN GENERATED YET (LANDING & SETUP WIZARD) */}
      {/* ========================================================================= */}
      {!hasGenerated && (
        <>
          <Navbar
            candidateProfile={candidateProfile}
            hasGenerated={hasGenerated}
            onOpenWizard={() => setIsWizardOpen(true)}
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

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            <HeroLanding
              onStartFinder={scrollToFinder}
              onOpenRules={() => setIsRulesModalOpen(true)}
              onSelectCategory={scrollToFinder}
            />

            <div id="candidate-wizard-section" className="scroll-mt-24">
              <OnboardingCard
                candidateProfile={candidateProfile}
                hasGenerated={hasGenerated}
                onSaveProfile={(profile) => {
                  setCandidateProfile(profile);
                }}
                onGenerate={handleGenerateComplete}
                onReset={handleResetToBeginning}
              />
            </div>

            <div className="space-y-6 animate-fade-in pt-2">
              <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  Official JoSAA 2026 Engine
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  JoSAA Counseling &amp; Choice Slicing Studio
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Enter your exam ranks in the wizard above, or select a sample candidate preset to simulate the complete JoSAA counseling choice hierarchy and Round 5/6 allotment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Cumulative Slicing Strategy
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lists Choice #01 from the very beginning of the cutoff pool (dream choices) with zero penalty, leading down to your exact rank.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Most Likely Allotment Zone
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Detects the 5 to 6 programs where closing cutoffs directly match your rank with the tightest margin for Round 5/6 allotment.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    +30 Safe Backup Cushion
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Appends exactly 30 high-margin safety choices immediately after the likely zone, guaranteeing 99%+ admission security.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Complete Counseling Database (138 JoSAA Institutes &amp; 118 CSAB Institutes)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Evaluated strictly against official 2026 cutoff sheets from your uploaded data.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRulesModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Read Counseling Rules</span>
                </button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* ========================================================================= */}
      {/* CASE B: WHEN CHOICES HAVE BEEN GENERATED (EXACT MATCH TO USER'S MOCKUP)   */}
      {/* ========================================================================= */}
      {hasGenerated && (
        <div className="flex-1 flex flex-col animate-fade-in">
          
          {/* Top Section: Deep Royal Navy/Indigo Gradient Background (#0c1439 -> #25338d) */}
          <div className="bg-gradient-to-r from-[#0c1439] via-[#16245f] to-[#25338d] text-white pb-8 shadow-md">
            <Navbar
              candidateProfile={candidateProfile}
              hasGenerated={hasGenerated}
              onOpenWizard={() => setIsWizardOpen(true)}
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

              {/* Home State & Portal Notice Banner */}
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-mono font-bold border border-white/30">
                    {candidateProfile.counselingType === 'CSAB' ? 'CSAB 2026 Special' : 'JoSAA 2026'}
                  </span>
                  <span>
                    Candidate: <strong className="text-white font-mono">{candidateProfile.category}</strong> &bull; Domicile: <strong className="text-emerald-300">{candidateProfile.homeState || 'All India'}</strong>
                  </span>
                  <span className="text-white/40 hidden sm:inline">|</span>
                  <span className="text-slate-300 hidden sm:inline">
                    {candidateProfile.counselingType === 'CSAB'
                      ? 'Official CSAB vacancy cutoffs • Excludes IITs'
                      : `119 Institutes • 50% HS Quota Cutoff relaxation applied for NIT in ${candidateProfile.homeState || 'Home State'}`}
                  </span>
                  <span className="text-white/40 hidden md:inline">|</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/15 text-indigo-200 font-mono text-[11px] border border-white/20">
                    Branches: {!candidateProfile.preferredBranches || candidateProfile.preferredBranches.includes('ALL') ? 'All Branches (12/12)' : `${candidateProfile.preferredBranches.join(', ')} (${candidateProfile.preferredBranches.length})`}
                  </span>
                </div>

                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  <button
                    type="button"
                    onClick={handleResetToBeginning}
                    className="text-slate-300 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    title="Clear everything and start over"
                  >
                    <RotateCcw className="w-3 h-3 text-rose-400" />
                    <span>Start Over</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(true)}
                    className="text-white hover:text-indigo-200 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Edit in Modal</span>
                    <span>↗</span>
                  </button>
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
                  counselingType={candidateProfile.counselingType || 'JOSAA'}
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
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#040714] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-400">JEE College Finder &bull; JoSAA SeatMatrix 2026 Studio</span>
            <span>&bull;</span>
            <span>All 119 Institutes (23 IITs, 32 NITs, 26 IIITs, 38 GFTIs)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button type="button" onClick={() => setIsRulesModalOpen(true)} className="hover:text-blue-400 transition-colors">
              Counseling Guidelines
            </button>
            <button type="button" onClick={handleResetToBeginning} className="hover:text-blue-400 transition-colors">
              Reset to Beginning
            </button>
            {hasGenerated && (
              <button type="button" onClick={() => setIsLockModalOpen(true)} className="hover:text-blue-400 transition-colors">
                Choice Locking
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currentProfile={candidateProfile}
        onSaveProfile={(profile) => {
          setCandidateProfile(profile);
          setHasGenerated(true);
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
