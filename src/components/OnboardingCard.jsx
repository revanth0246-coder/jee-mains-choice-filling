import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  MapPin, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Circle,
  Zap, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal, 
  RotateCcw,
  Info,
  Layers,
  Check,
  Building2,
  Compass
} from 'lucide-react';
import { 
  INDIAN_STATES, 
  RESERVATION_CATEGORIES, 
  GENDER_POOLS, 
  BRANCH_OPTIONS, 
  ALL_BRANCH_CODES,
  COUNSELING_TYPES 
} from '../data/josaaCutoffs.js';

export default function OnboardingCard({ 
  candidateProfile, 
  hasGenerated,
  onSaveProfile, 
  onGenerate,
  onReset
}) {
  const [isExpanded, setIsExpanded] = useState(!hasGenerated);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    counselingType: candidateProfile.counselingType || 'JOSAA',
    jeeMainRank: candidateProfile.jeeMainRank || '',
    isJeeAdvQualified: candidateProfile.isJeeAdvQualified ?? false,
    jeeAdvRank: candidateProfile.jeeAdvRank || '',
    homeState: candidateProfile.homeState || '',
    category: candidateProfile.category || 'OPEN',
    genderPool: candidateProfile.genderPool || 'Gender-Neutral',
    preferredBranches: candidateProfile.preferredBranches || ['ALL']
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData({
      counselingType: candidateProfile.counselingType || 'JOSAA',
      jeeMainRank: candidateProfile.jeeMainRank || '',
      isJeeAdvQualified: candidateProfile.isJeeAdvQualified ?? false,
      jeeAdvRank: candidateProfile.jeeAdvRank || '',
      homeState: candidateProfile.homeState || '',
      category: candidateProfile.category || 'OPEN',
      genderPool: candidateProfile.genderPool || 'Gender-Neutral',
      preferredBranches: candidateProfile.preferredBranches || ['ALL']
    });
    if (!hasGenerated) {
      setIsExpanded(true);
    }
  }, [candidateProfile, hasGenerated]);

  const PRESETS = [
    {
      title: '🏆 Top IIT Ranker',
      desc: 'JoSAA • Adv #280, Main #110, MH',
      data: {
        counselingType: 'JOSAA',
        jeeMainRank: 110,
        isJeeAdvQualified: true,
        jeeAdvRank: 280,
        homeState: 'Maharashtra',
        category: 'OPEN',
        genderPool: 'Gender-Neutral',
        preferredBranches: ['ALL']
      }
    },
    {
      title: '⚡ Elite IIT + NIT Calicut',
      desc: 'JoSAA • Adv #3,400, Main #4,200, Kerala',
      data: {
        counselingType: 'JOSAA',
        jeeMainRank: 4200,
        isJeeAdvQualified: true,
        jeeAdvRank: 3400,
        homeState: 'Kerala',
        category: 'OPEN',
        genderPool: 'Gender-Neutral',
        preferredBranches: ['ALL']
      }
    },
    {
      title: '🎯 Top NIT/IIIT Aspirant',
      desc: 'JoSAA • Main #12,800, TN HS',
      data: {
        counselingType: 'JOSAA',
        jeeMainRank: 12800,
        isJeeAdvQualified: false,
        jeeAdvRank: '',
        homeState: 'Tamil Nadu',
        category: 'OPEN',
        genderPool: 'Gender-Neutral',
        preferredBranches: ['ALL']
      }
    },
    {
      title: '🚀 CSAB Special Round 1/2',
      desc: 'CSAB • Main #38,500, Telangana HS',
      data: {
        counselingType: 'CSAB',
        jeeMainRank: 38500,
        isJeeAdvQualified: false,
        jeeAdvRank: '',
        homeState: 'Telangana',
        category: 'OPEN',
        genderPool: 'Gender-Neutral',
        preferredBranches: ['ALL']
      }
    },
    {
      title: '🛡️ Safe CSAB Vacancy',
      desc: 'CSAB • Main #64,000, GEN-EWS, RJ',
      data: {
        counselingType: 'CSAB',
        jeeMainRank: 64000,
        isJeeAdvQualified: false,
        jeeAdvRank: '',
        homeState: 'Rajasthan',
        category: 'GEN-EWS',
        genderPool: 'Gender-Neutral',
        preferredBranches: ['ALL']
      }
    }
  ];

  const applyPreset = (preset, autoGenerate = true) => {
    setFormData(preset.data);
    setErrorMsg('');
    if (autoGenerate) {
      onSaveProfile(preset.data);
      onGenerate(preset.data);
      setIsExpanded(false);
    }
  };

  // Step 1: Counseling Selection -> Step 2
  const handleStep1Next = () => {
    if (!formData.counselingType) {
      setErrorMsg('Please select either JoSAA or CSAB counseling.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // Step 2: Exam Ranks Validation -> Step 3
  const handleStep2Next = () => {
    if (!formData.jeeMainRank || Number(formData.jeeMainRank) <= 0) {
      setErrorMsg('Please enter your JEE Main CRL Rank to evaluate institute cutoffs.');
      return;
    }
    if (formData.counselingType === 'JOSAA' && formData.isJeeAdvQualified && (!formData.jeeAdvRank || Number(formData.jeeAdvRank) <= 0)) {
      setErrorMsg('Please enter your JEE Advanced CRL Rank to unlock and evaluate IIT cutoffs.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // Step 3: Domicile & Quota Validation -> Step 4
  const handleStep3Next = () => {
    if (!formData.homeState) {
      setErrorMsg('Please select your Home State to calculate the 50% NIT Domicile quota.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  // Step 4: Branch Preferences Validation -> Generate Choice Sheet
  const handleGenerate = () => {
    if (!formData.jeeMainRank || Number(formData.jeeMainRank) <= 0) {
      setStep(2);
      setErrorMsg('Please enter your JEE Main CRL Rank.');
      return;
    }
    if (!formData.homeState) {
      setStep(3);
      setErrorMsg('Please select your Home State.');
      return;
    }
    const currentBranches = formData.preferredBranches || [];
    if (currentBranches.length === 0) {
      setErrorMsg('Please select at least one preferred branch or select "All Branches".');
      return;
    }
    setErrorMsg('');
    onSaveProfile(formData);
    onGenerate(formData);
    setIsExpanded(false);
  };

  // Branch multi-selection helpers
  const isAllBranches = !formData.preferredBranches || 
                        formData.preferredBranches.length === 0 || 
                        formData.preferredBranches.includes('ALL') ||
                        formData.preferredBranches.length >= ALL_BRANCH_CODES.length;

  const activeBranchList = isAllBranches ? ALL_BRANCH_CODES : formData.preferredBranches;

  const toggleBranch = (branchCode) => {
    setErrorMsg('');
    if (branchCode === 'ALL') {
      if (isAllBranches) {
        setFormData(prev => ({ ...prev, preferredBranches: [] }));
      } else {
        setFormData(prev => ({ ...prev, preferredBranches: ['ALL'] }));
      }
      return;
    }

    let nextBranches = isAllBranches ? [...ALL_BRANCH_CODES] : [...(formData.preferredBranches || [])].filter(b => b !== 'ALL');
    
    if (nextBranches.includes(branchCode)) {
      nextBranches = nextBranches.filter(b => b !== branchCode);
    } else {
      nextBranches.push(branchCode);
    }

    if (nextBranches.length >= ALL_BRANCH_CODES.length) {
      setFormData(prev => ({ ...prev, preferredBranches: ['ALL'] }));
    } else {
      setFormData(prev => ({ ...prev, preferredBranches: nextBranches }));
    }
  };

  const selectBranchGroup = (groupType) => {
    setErrorMsg('');
    if (groupType === 'ALL') {
      setFormData(prev => ({ ...prev, preferredBranches: ['ALL'] }));
    } else if (groupType === 'CS_IT') {
      setFormData(prev => ({ ...prev, preferredBranches: ['CSE', 'AI_DS', 'IT', 'MNC'] }));
    } else if (groupType === 'CIRCUIT') {
      setFormData(prev => ({ ...prev, preferredBranches: ['CSE', 'AI_DS', 'IT', 'MNC', 'ECE', 'EE'] }));
    } else if (groupType === 'CORE') {
      setFormData(prev => ({ ...prev, preferredBranches: ['ME', 'CHE', 'CE', 'AERO'] }));
    } else if (groupType === 'DESIGN') {
      setFormData(prev => ({ ...prev, preferredBranches: ['ARCH', 'PLAN'] }));
    } else if (groupType === 'CLEAR') {
      setFormData(prev => ({ ...prev, preferredBranches: [] }));
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#0f1627] to-[#0a0f1c] border border-indigo-500/30 shadow-2xl shadow-indigo-950/40 overflow-hidden transition-all duration-300">
      
      {/* Top Banner Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex-shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Candidate Setup Wizard
              </span>
              <span className="text-xs text-slate-400">Step {step} of 4</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {formData.counselingType === 'CSAB' ? 'CSAB Special' : 'JoSAA 2026'}
              </span>
              {!hasGenerated && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  Ready to Start
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {step === 1 && 'Step 1: Counseling Authority Selection (JoSAA vs CSAB)'}
              {step === 2 && 'Step 2: Exam Ranks & Qualification'}
              {step === 3 && 'Step 3: Domicile State, Category & Gender Quota'}
              {step === 4 && 'Step 4: Preferred Engineering Disciplines / Branches'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress 4-Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-400' : 'bg-slate-700'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-400' : 'bg-slate-700'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-400' : 'bg-slate-700'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 4 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-indigo-400' : 'bg-slate-700'}`} />
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Wizard Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
          
          {/* Quick Presets Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Quick Presets (1-Click Sample Candidates):
              </span>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                title="Clear all fields"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All Fields</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p, true)}
                  className="p-2.5 text-left rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all text-xs group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: COUNSELING AUTHORITY (JOSAA VS CSAB) */}
          {step === 1 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Step 1: Choose Your Counseling Authority
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select whether you want to simulate standard JoSAA Rounds (with IITs) or CSAB Special Rounds (for vacant seats in NITs, IIITs &amp; GFTIs).
                  </p>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto font-mono">
                  {formData.counselingType === 'JOSAA' ? 'JoSAA 2026 Selected' : 'CSAB 2026 Special Selected'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. JoSAA Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, counselingType: 'JOSAA' }));
                    setErrorMsg('');
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group flex flex-col justify-between ${
                    formData.counselingType === 'JOSAA'
                      ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-blue-950/60 border-indigo-500 shadow-xl shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/40 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-md ${
                          formData.counselingType === 'JOSAA'
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-indigo-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-white">JoSAA 2026 Counseling</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                              Official Rounds 1–6
                            </span>
                          </div>
                          <p className="text-xs text-indigo-300/80 font-medium mt-0.5">
                            Joint Seat Allocation Authority &bull; Primary National Counseling
                          </p>
                        </div>
                      </div>

                      <div className="mt-1">
                        {formData.counselingType === 'JOSAA' ? (
                          <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      The centralized 6-round admission portal for all <strong>119 premier institutes</strong> across India. Covers both JEE Advanced (for IITs) and JEE Main (for NITs, IIITs, GFTIs).
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block">Participating Institutes:</span>
                        <strong className="text-white font-mono">119 Institutes (23 IITs, 32 NITs, 26 IIITs, 38 GFTIs)</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block">Exams Considered:</span>
                        <strong className="text-emerald-300 font-mono">JEE Main &amp; JEE Advanced</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Unlocks 23 IITs if qualified
                    </span>
                    <span className="font-mono text-slate-500">716 Total Choices</span>
                  </div>
                </div>

                {/* 2. CSAB Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      counselingType: 'CSAB',
                      isJeeAdvQualified: false // CSAB strictly excludes IITs
                    }));
                    setErrorMsg('');
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group flex flex-col justify-between ${
                    formData.counselingType === 'CSAB'
                      ? 'bg-gradient-to-br from-violet-950/70 via-slate-900/90 to-purple-950/60 border-violet-500 shadow-xl shadow-violet-950/50 ring-1 ring-violet-500/50'
                      : 'bg-slate-900/40 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-md ${
                          formData.counselingType === 'CSAB'
                            ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-violet-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Compass className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-white">CSAB 2026 Special Rounds</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                              Special Rounds 1 &amp; 2
                            </span>
                          </div>
                          <p className="text-xs text-violet-300/80 font-medium mt-0.5">
                            Central Seat Allocation Board &bull; Vacancy Spot Rounds
                          </p>
                        </div>
                      </div>

                      <div className="mt-1">
                        {formData.counselingType === 'CSAB' ? (
                          <CheckCircle2 className="w-6 h-6 text-violet-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Conducted <em>after</em> JoSAA Round 6 to fill leftover vacant seats across <strong>96 NITs, IIITs, and GFTIs</strong>. Evaluated strictly on <strong>JEE Main CRL Rank</strong> with relaxed cutoff margins (+15% rank buffer).
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block">Participating Institutes:</span>
                        <strong className="text-white font-mono">96 Institutes (32 NITs, 26 IIITs, 38 GFTIs)</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block">Exams Considered:</span>
                        <strong className="text-amber-300 font-mono">JEE Main CRL Only (Excludes IITs)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-violet-400 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      +15% Vacancy Cutoff Buffer
                    </span>
                    <span className="font-mono text-slate-500">578 Total Choices</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: EXAM RANKS */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1 animate-fade-in">
              
              {/* JEE Main CRL Rank */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>
                    JEE Main CRL Rank (Common Merit List) <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono">For NITs, IIITs, GFTIs</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter your CRL Rank (e.g. 14500)"
                    value={formData.jeeMainRank}
                    onChange={(e) => setFormData({ ...formData, jeeMainRank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">MAIN CRL</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your All India Common Rank List (CRL) rank. Category multipliers automatically apply for GEN-EWS, OBC, SC, and ST.
                </p>
              </div>

              {/* JEE Advanced Qualification & Rank (Only for JoSAA; for CSAB, shows informative notice) */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                {formData.counselingType === 'CSAB' ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-violet-300 font-bold text-xs">
                      <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      <span>IITs Excluded in CSAB Special Rounds</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All 23 IITs conclude their admissions strictly in JoSAA Round 6. CSAB Special Rounds 1 &amp; 2 are conducted exclusively for vacant seats in <strong>32 NITs, 26 IIITs, and 38 GFTIs</strong> using your <strong>JEE Main CRL Rank</strong>.
                    </p>
                    <div className="p-2.5 rounded-lg bg-violet-950/30 border border-violet-500/20 text-[11px] text-violet-300 font-mono">
                      No JEE Advanced rank required for CSAB.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Qualified in JEE (Advanced) 2026?
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Unlocks choice options for all 23 IITs in JoSAA.
                        </p>
                      </div>
                      
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !formData.isJeeAdvQualified;
                          setFormData({ 
                            ...formData, 
                            isJeeAdvQualified: nextVal,
                            jeeAdvRank: nextVal ? formData.jeeAdvRank : ''
                          });
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          formData.isJeeAdvQualified ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isJeeAdvQualified ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {formData.isJeeAdvQualified ? (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800 animate-fade-in">
                        <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                          <span>JEE Advanced CRL Rank (Strictly for IITs) <span className="text-rose-400">*</span></span>
                          <span className="text-[10px] text-amber-400 font-mono">23 IITs Unlocked</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter JEE Adv Rank (e.g. 4800)"
                            value={formData.jeeAdvRank}
                            onChange={(e) => setFormData({ ...formData, jeeAdvRank: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 font-mono text-sm placeholder:text-slate-600 outline-none focus:border-amber-400 transition-colors"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-amber-500/80 font-mono">ADV CRL</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/80 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>IITs excluded. The engine focuses choices on 32 NITs, 26 IIITs, and 38 GFTIs.</span>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          )}

          {/* STEP 3: DOMICILE STATE & RESERVATION QUOTA */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-1 animate-fade-in">
              
              {/* Home State Domicile */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    Student Home State <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono">50% HS Quota</span>
                </label>
                <select
                  value={formData.homeState}
                  onChange={(e) => setFormData({ ...formData, homeState: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="" disabled>-- Select Your 12th Board State --</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Under the NIT Act, this triggers the 50% Home State quota cutoff relaxation for the NIT located in your state.
                </p>
              </div>

              {/* Reservation Category */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Reservation Category
                  </span>
                  <span className="text-[11px] text-slate-400">Multiplier</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {RESERVATION_CATEGORIES.map((cat) => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{cat.id}</div>
                        <div className="text-[9px] text-slate-400">
                          {cat.multiplier === 1.0 ? '1.0x' : `~${cat.multiplier}x`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gender Pool */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    Gender Pool
                  </span>
                  <span className="text-[11px] text-pink-400">+20% Supernumerary</span>
                </label>
                <div className="space-y-1.5">
                  {GENDER_POOLS.map((pool) => {
                    const isSelected = formData.genderPool === pool.id;
                    return (
                      <button
                        key={pool.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, genderPool: pool.id })}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-pink-600/20 border-pink-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{pool.label}</div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: PREFERRED BRANCHES (MULTIPLE SELECTION OPTION INCLUDING ALL BRANCHES) */}
          {step === 4 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              
              {/* Quick Stream Filters & Controls */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Multiple Branch Selection
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select which engineering branches to include in your choice sheet, or choose "All Branches" for the full seat matrix.
                    </p>
                  </div>
                  
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {isAllBranches 
                        ? 'All 12 Disciplines Selected (Full Seat Matrix)' 
                        : `${activeBranchList.length} of ${ALL_BRANCH_CODES.length} Branches Selected`}
                    </span>
                  </div>
                </div>

                {/* Quick Stream Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Select:</span>
                  
                  <button
                    type="button"
                    onClick={() => selectBranchGroup('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isAllBranches
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>All Branches (Full Matrix)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CS_IT')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
                  >
                    💻 CS &amp; IT (4)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CIRCUIT')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
                  >
                    ⚡ Circuit (6)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CORE')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
                  >
                    ⚙️ Core (4)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('DESIGN')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
                  >
                    📐 Architecture &amp; Planning (2)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CLEAR')}
                    className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Master "All Branches" Toggle Card */}
              <div 
                onClick={() => toggleBranch('ALL')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isAllBranches
                    ? 'bg-gradient-to-r from-indigo-950/60 via-violet-950/50 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isAllBranches ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isAllBranches ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">All Branches &amp; Specializations</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Include all participating program combinations across all eligible institutes without branch exclusions.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    {formData.counselingType === 'CSAB' ? '578 Choices' : '716 Choices'}
                  </span>
                  <div className="text-[10px] text-slate-500">100% Institute Coverage</div>
                </div>
              </div>

              {/* Grid of 12 Specific Engineering Disciplines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {BRANCH_OPTIONS.filter(b => b.code !== 'ALL').map((branch) => {
                  const isSelected = isAllBranches || (formData.preferredBranches && formData.preferredBranches.includes(branch.code));
                  
                  return (
                    <div
                      key={branch.code}
                      onClick={() => toggleBranch(branch.code)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-950/30 border-indigo-500/60 shadow-sm shadow-indigo-900/20'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 flex-shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                              {branch.code}
                            </span>
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-950">
                              {branch.group}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                            {branch.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {branch.desc}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">{branch.count}</span>
                        <div className="text-[9px] text-slate-500">colleges</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Action Step Bar */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
            {step === 1 && <div />}
            
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1 (Portal Selection)</span>
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2 (Exam Ranks)</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 3 (State &amp; Quota)</span>
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleStep1Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all ml-auto"
              >
                <span>Continue to Step 2: Exam Ranks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleStep2Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all ml-auto"
              >
                <span>Continue to Step 3: Domicile &amp; Quota</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleStep3Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all ml-auto"
              >
                <span>Continue to Step 4: Preferred Branches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xl shadow-indigo-600/40 transition-all ml-auto animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {formData.counselingType === 'CSAB' 
                    ? `Generate CSAB Special Choice Sheet (${isAllBranches ? 'All Branches' : `${activeBranchList.length} Branches`})` 
                    : `Generate Official JoSAA Choice Sheet (${isAllBranches ? 'All Branches' : `${activeBranchList.length} Branches`})`}
                </span>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
