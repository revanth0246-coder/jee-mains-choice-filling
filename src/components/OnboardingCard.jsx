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

  const handleStep1Next = () => {
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Next = () => {
    const mainRank = Number(formData.jeeMainRank);
    if (!formData.jeeMainRank || isNaN(mainRank) || mainRank <= 0) {
      setErrorMsg('Please enter a valid positive JEE Main CRL rank.');
      return;
    }
    if (formData.counselingType === 'JOSAA' && formData.isJeeAdvQualified) {
      const advRank = Number(formData.jeeAdvRank);
      if (!formData.jeeAdvRank || isNaN(advRank) || advRank <= 0) {
        setErrorMsg('You indicated JEE (Adv) qualification. Please enter a valid JEE Advanced rank or uncheck the toggle.');
        return;
      }
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleStep3Next = () => {
    if (!formData.homeState) {
      setErrorMsg('Please select your 12th board Home State for NIT 50% quota calculation.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleGenerate = () => {
    const mainRank = Number(formData.jeeMainRank);
    if (!formData.jeeMainRank || isNaN(mainRank) || mainRank <= 0) {
      setErrorMsg('Please enter a valid positive JEE Main CRL rank.');
      setStep(2);
      return;
    }
    if (!formData.homeState) {
      setErrorMsg('Please select your Home State.');
      setStep(3);
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
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300">
      
      {/* Top Banner Header: Deep Royal Navy Gradient */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-gradient-to-r from-[#0c1439] via-[#16245f] to-[#25338d] text-white border-b border-indigo-900/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shadow-md border border-white/20 flex-shrink-0">
            <SlidersHorizontal className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                Candidate Setup Wizard
              </span>
              <span className="text-xs text-slate-300">Step {step} of 4</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white font-bold border border-white/20">
                {formData.counselingType === 'CSAB' ? 'CSAB Special' : 'JoSAA 2026'}
              </span>
              {!hasGenerated && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Ready to Start
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {step === 1 && 'Step 1: Counseling Authority Selection (JoSAA vs CSAB)'}
              {step === 2 && 'Step 2: Exam Ranks & Qualification'}
              {step === 3 && 'Step 3: Domicile State, Category & Gender Quota'}
              {step === 4 && 'Step 4: Preferred Engineering Disciplines / Branches'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress 4-Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-300' : 'bg-white/30'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 2 ? 'bg-indigo-300' : 'bg-white/20'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-300' : 'bg-white/30'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 3 ? 'bg-indigo-300' : 'bg-white/20'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-300' : 'bg-white/30'}`} />
            <span className={`w-3.5 h-0.5 ${step >= 4 ? 'bg-indigo-300' : 'bg-white/20'}`} />
            <span className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-indigo-300' : 'bg-white/30'}`} />
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Wizard Body in White and Blue theme */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 animate-fade-in bg-white text-slate-800">
          
          {/* Quick Presets Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Quick Presets (1-Click Sample Candidates):
              </span>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
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
                  className="p-2.5 text-left rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs group shadow-sm"
                >
                  <div className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: COUNSELING AUTHORITY (JOSAA VS CSAB) */}
          {step === 1 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Step 1: Choose Your Counseling Authority
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select whether you want to simulate standard JoSAA Rounds (with IITs) or CSAB Special Rounds (for vacant seats in NITs, IIITs &amp; GFTIs).
                  </p>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 self-start sm:self-auto font-mono font-semibold shadow-sm">
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
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group flex flex-col justify-between ${
                    formData.counselingType === 'JOSAA'
                      ? 'bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${
                          formData.counselingType === 'JOSAA'
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-indigo-500/20'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">JoSAA 2026 Counseling</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                              Official Rounds 1–6
                            </span>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium mt-0.5">
                            Joint Seat Allocation Authority &bull; Primary National Counseling
                          </p>
                        </div>
                      </div>

                      <div className="mt-1">
                        {formData.counselingType === 'JOSAA' ? (
                          <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      The centralized 6-round admission portal for all <strong>119 premier institutes</strong> across India. Covers both JEE Advanced (for IITs) and JEE Main (for NITs, IIITs, GFTIs).
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">Participating Institutes:</span>
                        <strong className="text-slate-800 font-mono">119 Institutes (23 IITs, 32 NITs, 26 IIITs, 38 GFTIs)</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">Exams Considered:</span>
                        <strong className="text-emerald-700 font-mono">JEE Main &amp; JEE Advanced</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Unlocks 23 IITs if qualified
                    </span>
                    <span className="font-mono text-slate-400">716 Total Choices</span>
                  </div>
                </div>

                {/* 2. CSAB Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      counselingType: 'CSAB',
                      isJeeAdvQualified: false
                    }));
                    setErrorMsg('');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group flex flex-col justify-between ${
                    formData.counselingType === 'CSAB'
                      ? 'bg-gradient-to-br from-purple-50/80 via-indigo-50/50 to-white border-purple-600 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${
                          formData.counselingType === 'CSAB'
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/20'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <Compass className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">CSAB 2026 Special Rounds</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                              Special Rounds 1 &amp; 2
                            </span>
                          </div>
                          <p className="text-xs text-purple-600 font-medium mt-0.5">
                            Central Seat Allocation Board &bull; Vacancy Spot Rounds
                          </p>
                        </div>
                      </div>

                      <div className="mt-1">
                        {formData.counselingType === 'CSAB' ? (
                          <CheckCircle2 className="w-6 h-6 text-purple-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Conducted <em>after</em> JoSAA Round 6 to fill leftover vacant seats across <strong>96 NITs, IIITs, and GFTIs</strong>. Evaluated strictly on <strong>JEE Main CRL Rank</strong> with relaxed cutoff margins (+15% rank buffer).
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">Participating Institutes:</span>
                        <strong className="text-slate-800 font-mono">96 Institutes (32 NITs, 26 IIITs, 38 GFTIs)</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">Exams Considered:</span>
                        <strong className="text-purple-700 font-mono">JEE Main CRL Only (Excludes IITs)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-purple-600 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      +15% Vacancy Cutoff Buffer
                    </span>
                    <span className="font-mono text-slate-400">578 Total Choices</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: EXAM RANKS */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1 animate-fade-in">
              
              {/* JEE Main CRL Rank */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>
                    JEE Main CRL Rank (Common Merit List) <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-indigo-600 font-mono">For NITs, IIITs, GFTIs</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter your CRL Rank (e.g. 14500)"
                    value={formData.jeeMainRank}
                    onChange={(e) => setFormData({ ...formData, jeeMainRank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors shadow-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">MAIN CRL</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Enter your All India Common Rank List (CRL) rank. Category multipliers automatically apply for GEN-EWS, OBC, SC, and ST.
                </p>
              </div>

              {/* JEE Advanced Qualification & Rank */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                {formData.counselingType === 'CSAB' ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                      <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>IITs Excluded in CSAB Special Rounds</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All 23 IITs conclude their admissions strictly in JoSAA Round 6. CSAB Special Rounds 1 &amp; 2 are conducted exclusively for vacant seats in <strong>32 NITs, 26 IIITs, and 38 GFTIs</strong> using your <strong>JEE Main CRL Rank</strong>.
                    </p>
                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-[11px] text-purple-800 font-mono">
                      No JEE Advanced rank required for CSAB.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          Qualified in JEE (Advanced) 2026?
                        </label>
                        <p className="text-[11px] text-slate-500">
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
                          formData.isJeeAdvQualified ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.isJeeAdvQualified ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {formData.isJeeAdvQualified ? (
                      <div className="space-y-1.5 pt-2 border-t border-slate-200 animate-fade-in">
                        <label className="text-xs font-semibold text-amber-700 flex items-center justify-between">
                          <span>JEE Advanced CRL Rank (Strictly for IITs) <span className="text-rose-500">*</span></span>
                          <span className="text-[10px] text-amber-600 font-mono">23 IITs Unlocked</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter JEE Adv Rank (e.g. 4800)"
                            value={formData.jeeAdvRank}
                            onChange={(e) => setFormData({ ...formData, jeeAdvRank: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 font-mono text-sm placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-colors shadow-sm"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-amber-600 font-mono">ADV CRL</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
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
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Student Home State <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-indigo-600 font-mono font-medium">50% HS Quota</span>
                </label>
                <select
                  value={formData.homeState}
                  onChange={(e) => setFormData({ ...formData, homeState: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-sm"
                >
                  <option value="" disabled>-- Select Your 12th Board State --</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Under the NIT Act, this triggers the 50% Home State quota cutoff relaxation for the NIT located in your state.
                </p>
              </div>

              {/* Reservation Category */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Reservation Category
                  </span>
                  <span className="text-[11px] text-slate-500">Multiplier</span>
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
                            ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs">{cat.id}</div>
                        <div className="text-[9px] text-slate-500">
                          {cat.multiplier === 1.0 ? '1.0x' : `~${cat.multiplier}x`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gender Pool */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-600" />
                    Gender Pool
                  </span>
                  <span className="text-[11px] text-pink-600 font-medium">+20% Supernumerary</span>
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
                            ? 'bg-pink-50 border-2 border-pink-500 text-pink-950 font-semibold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs">{pool.label}</div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: PREFERRED BRANCHES */}
          {step === 4 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              
              {/* Quick Stream Filters & Controls */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Multiple Branch Selection
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Select which engineering branches to include in your choice sheet, or choose "All Branches" for the full seat matrix.
                    </p>
                  </div>
                  
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 self-start sm:self-auto shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {isAllBranches 
                        ? 'All 12 Disciplines Selected (Full Seat Matrix)' 
                        : `${activeBranchList.length} of ${ALL_BRANCH_CODES.length} Branches Selected`}
                    </span>
                  </div>
                </div>

                {/* Quick Stream Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Select:</span>
                  
                  <button
                    type="button"
                    onClick={() => selectBranchGroup('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isAllBranches
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-400'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>All Branches (Full Matrix)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CS_IT')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    💻 CS &amp; IT (4)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CIRCUIT')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    ⚡ Circuit (6)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CORE')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    ⚙️ Core (4)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('DESIGN')}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    📐 Architecture &amp; Planning (2)
                  </button>

                  <button
                    type="button"
                    onClick={() => selectBranchGroup('CLEAR')}
                    className="px-2.5 py-1 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Master "All Branches" Toggle Card */}
              <div 
                onClick={() => toggleBranch('ALL')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isAllBranches
                    ? 'bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-white border-indigo-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isAllBranches ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isAllBranches ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">All Branches &amp; Specializations</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Include all participating program combinations across all eligible institutes without branch exclusions.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-700">
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
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-sm text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 flex-shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-800 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                              {branch.code}
                            </span>
                            <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-50 border border-slate-100">
                              {branch.group}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 mt-1 truncate">
                            {branch.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            {branch.desc}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] font-mono text-slate-500">{branch.count}</span>
                        <div className="text-[9px] text-slate-400">colleges</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Action Step Bar */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
            {step === 1 && <div />}
            
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1 (Portal Selection)</span>
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2 (Exam Ranks)</span>
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 3 (State &amp; Quota)</span>
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleStep1Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all ml-auto"
              >
                <span>Continue to Step 2: Exam Ranks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleStep2Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all ml-auto"
              >
                <span>Continue to Step 3: Domicile &amp; Quota</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleStep3Next}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all ml-auto"
              >
                <span>Continue to Step 4: Preferred Branches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all ml-auto"
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
