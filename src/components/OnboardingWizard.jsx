import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Award, 
  MapPin, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  X,
  AlertCircle,
  Zap,
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

export default function OnboardingWizard({ isOpen, onClose, currentProfile, onSaveProfile }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    counselingType: currentProfile.counselingType || 'JOSAA',
    jeeMainRank: currentProfile.jeeMainRank || 14500,
    isJeeAdvQualified: currentProfile.isJeeAdvQualified ?? false,
    jeeAdvRank: currentProfile.jeeAdvRank || 4800,
    homeState: currentProfile.homeState || 'Maharashtra',
    category: currentProfile.category || 'OPEN',
    genderPool: currentProfile.genderPool || 'Gender-Neutral',
    preferredBranches: currentProfile.preferredBranches || ['ALL']
  });

  React.useEffect(() => {
    if (currentProfile) {
      setFormData({
        counselingType: currentProfile.counselingType || 'JOSAA',
        jeeMainRank: currentProfile.jeeMainRank || 14500,
        isJeeAdvQualified: currentProfile.isJeeAdvQualified ?? false,
        jeeAdvRank: currentProfile.jeeAdvRank || 4800,
        homeState: currentProfile.homeState || 'Maharashtra',
        category: currentProfile.category || 'OPEN',
        genderPool: currentProfile.genderPool || 'Gender-Neutral',
        preferredBranches: currentProfile.preferredBranches || ['ALL']
      });
    }
  }, [currentProfile, isOpen]);

  const [errorMsg, setErrorMsg] = useState('');

  const PRESETS = [
    {
      title: '🏆 Top IIT Aspirant',
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

  const applyPreset = (preset) => {
    setFormData(preset.data);
    setErrorMsg('');
  };

  const handleStep1Next = () => {
    if (!formData.counselingType) {
      setErrorMsg('Please select either JoSAA or CSAB counseling.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.jeeMainRank || Number(formData.jeeMainRank) <= 0) {
      setErrorMsg('Please enter your JEE Main CRL Rank.');
      return;
    }
    if (formData.counselingType === 'JOSAA' && formData.isJeeAdvQualified && (!formData.jeeAdvRank || Number(formData.jeeAdvRank) <= 0)) {
      setErrorMsg('Please enter your JEE Advanced CRL Rank to evaluate IIT cutoffs.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleStep3Next = () => {
    if (!formData.homeState) {
      setErrorMsg('Please select your Home State.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleSaveAndGenerate = () => {
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
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-gradient-to-b from-[#0f1627] via-[#090d18] to-[#060913] border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Candidate Onboarding Wizard</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  Step {step} of 4
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                  {formData.counselingType === 'CSAB' ? 'CSAB Special' : 'JoSAA 2026'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure candidate parameters to simulate the complete counseling choice hierarchy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Step Progress Ribbon */}
        <div className="grid grid-cols-4 bg-slate-950/80 border-b border-slate-800 text-xs">
          <button 
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 text-center border-r border-slate-800 flex items-center justify-center gap-1.5 transition-colors ${
              step === 1 ? 'bg-indigo-600/20 text-indigo-300 font-bold border-b-2 border-b-indigo-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Authority</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setStep(2)}
            className={`p-3 text-center border-r border-slate-800 flex items-center justify-center gap-1.5 transition-colors ${
              step === 2 ? 'bg-indigo-600/20 text-indigo-300 font-bold border-b-2 border-b-indigo-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>2. Exam Ranks</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (formData.jeeMainRank) setStep(3);
            }}
            className={`p-3 text-center border-r border-slate-800 flex items-center justify-center gap-1.5 transition-colors ${
              step === 3 ? 'bg-indigo-600/20 text-indigo-300 font-bold border-b-2 border-b-indigo-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>3. Domicile &amp; Quota</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (formData.jeeMainRank && formData.homeState) setStep(4);
            }}
            className={`p-3 text-center flex items-center justify-center gap-1.5 transition-colors ${
              step === 4 ? 'bg-indigo-600/20 text-indigo-300 font-bold border-b-2 border-b-indigo-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Branches</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Quick Candidate Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2 text-left rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all text-xs"
                >
                  <div className="font-semibold text-slate-200 truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: COUNSELING AUTHORITY (JOSAA VS CSAB) */}
          {step === 1 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                Select your target counseling system. JoSAA conducts primary Rounds 1–6 (all 119 institutes including IITs). CSAB conducts Special Rounds 1 &amp; 2 for vacant seats in 96 NITs, IIITs, and GFTIs (strictly excludes IITs).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* JoSAA Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, counselingType: 'JOSAA' }));
                    setErrorMsg('');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.counselingType === 'JOSAA'
                      ? 'bg-gradient-to-br from-indigo-950/70 to-blue-950/60 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">JoSAA 2026 Counseling</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            Rounds 1 to 6
                          </span>
                        </div>
                      </div>
                      {formData.counselingType === 'JOSAA' ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All 119 premier institutes: 23 IITs, 32 NITs, 26 IIITs, and 38 GFTIs. Unlocks IITs if qualified in JEE Advanced.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-indigo-300 font-mono">
                    716 Total Seat Combinations
                  </div>
                </div>

                {/* CSAB Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      counselingType: 'CSAB',
                      isJeeAdvQualified: false 
                    }));
                    setErrorMsg('');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.counselingType === 'CSAB'
                      ? 'bg-gradient-to-br from-violet-950/70 to-purple-950/60 border-violet-500 shadow-lg shadow-violet-950/40 ring-1 ring-violet-500/50'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">CSAB 2026 Special</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                            Special Rounds 1 &amp; 2
                          </span>
                        </div>
                      </div>
                      {formData.counselingType === 'CSAB' ? (
                        <CheckCircle2 className="w-5 h-5 text-violet-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Conducted for vacant seats in 96 NITs, IIITs, and GFTIs. Strictly evaluated on JEE Main CRL Rank with relaxed cutoffs. Excludes IITs.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-violet-300 font-mono">
                    578 Total Seat Combinations (+15% Buffer)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EXAM RANKS */}
          {step === 2 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>JEE Main CRL Rank (Common Merit List) <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-indigo-400 font-mono">Used for NITs, IIITs, GFTIs</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter CRL Rank (e.g. 14500)"
                  value={formData.jeeMainRank}
                  onChange={(e) => setFormData({ ...formData, jeeMainRank: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-[11px] text-slate-400">
                  Required. All India Common Rank List rank.
                </p>
              </div>

              {formData.counselingType === 'CSAB' ? (
                <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-violet-300 text-xs font-bold">
                    <Info className="w-4 h-4 text-violet-400" />
                    <span>IITs Excluded from CSAB Special Rounds</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    CSAB rounds are conducted solely for NITs, IIITs, and GFTIs based on JEE Main CRL Rank. IIT cutoffs are not evaluated.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-slate-200">
                        Qualified in JEE Advanced 2026?
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Toggle to evaluate choices across all 23 IITs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        isJeeAdvQualified: !formData.isJeeAdvQualified,
                        jeeAdvRank: !formData.isJeeAdvQualified ? formData.jeeAdvRank : ''
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

                  {formData.isJeeAdvQualified && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <label className="text-xs font-semibold text-amber-300">
                        JEE Advanced CRL Rank (Strictly for IITs) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter JEE Advanced Rank (e.g. 4800)"
                        value={formData.jeeAdvRank}
                        onChange={(e) => setFormData({ ...formData, jeeAdvRank: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 font-mono text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DOMICILE STATE & RESERVATION QUOTA */}
          {step === 3 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Student Home State (12th Board State) <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-indigo-400 font-mono">50% HS Quota in NITs</span>
                </label>
                <select
                  value={formData.homeState}
                  onChange={(e) => setFormData({ ...formData, homeState: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="" disabled>-- Select Your Home State --</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Triggers 50% Home State quota cutoff relaxation for the NIT located in that state.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Reservation Category
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {RESERVATION_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          formData.category === cat.id
                            ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{cat.id}</div>
                        <div className="text-[9px] text-slate-500">~{cat.multiplier}x</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Gender Pool (+20% Supernumerary)
                  </label>
                  <div className="space-y-1.5">
                    {GENDER_POOLS.map((pool) => (
                      <button
                        key={pool.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, genderPool: pool.id })}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                          formData.genderPool === pool.id
                            ? 'bg-pink-600/20 border-pink-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs">{pool.label}</span>
                        {formData.genderPool === pool.id && (
                          <CheckCircle2 className="w-4 h-4 text-pink-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERRED BRANCHES */}
          {step === 4 && (
            <div className="space-y-3 pt-1 animate-fade-in">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Branch Preferences
                  </h4>
                  <p className="text-xs text-slate-400">
                    Filter choices by discipline, or select "All Branches" for unrestricted list.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {isAllBranches ? 'All Disciplines Selected' : `${activeBranchList.length} of ${ALL_BRANCH_CODES.length} Selected`}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => selectBranchGroup('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isAllBranches ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'
                  }`}
                >
                  All Branches
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CS_IT')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  CS &amp; IT
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CIRCUIT')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Circuit
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CORE')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Core
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('DESIGN')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Arch &amp; Plan
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CLEAR')}
                  className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 ml-auto"
                >
                  Clear
                </button>
              </div>

              {/* Master "All Branches" card */}
              <div 
                onClick={() => toggleBranch('ALL')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isAllBranches
                    ? 'bg-gradient-to-r from-indigo-950/60 to-violet-950/50 border-indigo-500/60'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                    isAllBranches ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isAllBranches ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">All Branches (Recommended)</span>
                    <p className="text-[11px] text-slate-400">Include all available seat combinations.</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {formData.counselingType === 'CSAB' ? '578 Choices' : '716 Choices'}
                </span>
              </div>

              {/* 12 Individual Branch Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRANCH_OPTIONS.filter(b => b.code !== 'ALL').map((branch) => {
                  const isSelected = isAllBranches || (formData.preferredBranches && formData.preferredBranches.includes(branch.code));
                  return (
                    <div
                      key={branch.code}
                      onClick={() => toggleBranch(branch.code)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold truncate">{branch.code}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{branch.count}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          {step === 1 && <div />}
          
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1 (Authority)</span>
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2 (Ranks)</span>
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 3 (Quota)</span>
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleStep1Next}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 ml-auto"
            >
              <span>Continue to Step 2: Exam Ranks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleStep2Next}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 ml-auto"
            >
              <span>Continue to Step 3: Domicile &amp; Quota</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleStep3Next}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 ml-auto"
            >
              <span>Continue to Step 4: Preferred Branches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 ml-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save &amp; Generate Choice Sheet</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
