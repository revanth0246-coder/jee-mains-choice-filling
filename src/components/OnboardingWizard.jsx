import React, { useState, useEffect } from 'react';
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
    counselingType: currentProfile.counselingType || 'CSAB',
    jeeMainRank: currentProfile.jeeMainRank || 38291,
    isJeeAdvQualified: currentProfile.isJeeAdvQualified ?? false,
    jeeAdvRank: currentProfile.jeeAdvRank || '',
    homeState: currentProfile.homeState || 'Telangana',
    category: currentProfile.category || 'OBC-NCL',
    genderPool: currentProfile.genderPool || 'Gender-Neutral',
    preferredBranches: currentProfile.preferredBranches || ['ALL']
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        counselingType: currentProfile.counselingType || 'CSAB',
        jeeMainRank: currentProfile.jeeMainRank || 38291,
        isJeeAdvQualified: currentProfile.isJeeAdvQualified ?? false,
        jeeAdvRank: currentProfile.jeeAdvRank || '',
        homeState: currentProfile.homeState || 'Telangana',
        category: currentProfile.category || 'OBC-NCL',
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
        setErrorMsg('You indicated JEE (Adv) qualification. Please enter a valid JEE Advanced rank or turn off the toggle.');
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

  const handleSaveAndGenerate = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800">
        
        {/* Header in Royal Navy Gradient */}
        <div className="p-4 sm:p-5 border-b border-indigo-900/30 flex items-center justify-between bg-gradient-to-r from-[#0c1439] via-[#16245f] to-[#25338d] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold shadow-md border border-white/20">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Candidate Details &amp; Rank Setup</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-200 font-mono border border-white/20">
                  Step {step} of 4
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/25">
                  {formData.counselingType === 'CSAB' ? 'CSAB Special' : 'JoSAA 2026'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configure your rank, quota, and target authority to recalculate choice-filling sheet.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Step Progress Ribbon */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 text-xs">
          <button 
            type="button"
            onClick={() => setStep(1)}
            className={`p-2.5 sm:p-3 text-center border-r border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              step === 1 ? 'bg-indigo-50 text-indigo-700 font-bold border-b-2 border-b-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Authority</span>
            <span className="sm:hidden">1. Portal</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setStep(2)}
            className={`p-2.5 sm:p-3 text-center border-r border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              step === 2 ? 'bg-indigo-50 text-indigo-700 font-bold border-b-2 border-b-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Exam Ranks</span>
            <span className="sm:hidden">2. Ranks</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (formData.jeeMainRank) setStep(3);
            }}
            className={`p-2.5 sm:p-3 text-center border-r border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              step === 3 ? 'bg-indigo-50 text-indigo-700 font-bold border-b-2 border-b-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. Domicile &amp; Quota</span>
            <span className="sm:hidden">3. State</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (formData.jeeMainRank && formData.homeState) setStep(4);
            }}
            className={`p-2.5 sm:p-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              step === 4 ? 'bg-indigo-50 text-indigo-700 font-bold border-b-2 border-b-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Branches</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-white">
          
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Candidate Presets (1-Click Sample):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2.5 text-left rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs cursor-pointer shadow-sm group"
                >
                  <div className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: COUNSELING AUTHORITY (JOSAA VS CSAB) */}
          {step === 1 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Select your target counseling system. JoSAA conducts primary Rounds 1–6 (all 119 institutes including IITs). CSAB conducts Special Rounds 1 &amp; 2 for vacant seats in 96 NITs, IIITs, and GFTIs (strictly excludes IITs).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* JoSAA Card */}
                <div 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, counselingType: 'JOSAA' }));
                    setErrorMsg('');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.counselingType === 'JOSAA'
                      ? 'bg-gradient-to-br from-indigo-50/80 to-white border-indigo-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">JoSAA 2026 Counseling</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200">
                            Rounds 1 to 6
                          </span>
                        </div>
                      </div>
                      {formData.counselingType === 'JOSAA' ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All 119 premier institutes: 23 IITs, 32 NITs, 26 IIITs, and 38 GFTIs. Unlocks IITs if qualified in JEE Advanced.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-indigo-700 font-mono font-medium">
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.counselingType === 'CSAB'
                      ? 'bg-gradient-to-br from-purple-50/80 to-white border-purple-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">CSAB 2026 Special</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold border border-purple-200">
                            Special Rounds 1 &amp; 2
                          </span>
                        </div>
                      </div>
                      {formData.counselingType === 'CSAB' ? (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Conducted for vacant seats in 96 NITs, IIITs, and GFTIs. Strictly evaluated on JEE Main CRL Rank with relaxed cutoffs. Excludes IITs.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-purple-700 font-mono font-medium">
                    578 Total Seat Combinations (+15% Buffer)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EXAM RANKS */}
          {step === 2 && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>JEE Main CRL Rank (Common Merit List) <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-indigo-600 font-mono">Used for NITs, IIITs, GFTIs</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter CRL Rank (e.g. 14500)"
                  value={formData.jeeMainRank}
                  onChange={(e) => setFormData({ ...formData, jeeMainRank: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors shadow-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Required. All India Common Rank List rank.
                </p>
              </div>

              {formData.counselingType === 'CSAB' ? (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                  <div className="flex items-center gap-2 text-purple-800 text-xs font-bold">
                    <Info className="w-4 h-4 text-purple-600" />
                    <span>IITs Excluded from CSAB Special Rounds</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    CSAB rounds are conducted solely for NITs, IIITs, and GFTIs based on JEE Main CRL Rank. IIT cutoffs are not evaluated.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-slate-800">
                        Qualified in JEE Advanced 2026?
                      </label>
                      <p className="text-[11px] text-slate-500">
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
                        formData.isJeeAdvQualified ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                          formData.isJeeAdvQualified ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.isJeeAdvQualified && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <label className="text-xs font-semibold text-amber-700">
                        JEE Advanced CRL Rank (Strictly for IITs) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter JEE Advanced Rank (e.g. 4800)"
                        value={formData.jeeAdvRank}
                        onChange={(e) => setFormData({ ...formData, jeeAdvRank: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 font-mono text-sm outline-none focus:border-amber-500 shadow-sm"
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
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Student Home State (12th Board State) <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-indigo-600 font-mono font-medium">50% HS Quota in NITs</span>
                </label>
                <select
                  value={formData.homeState}
                  onChange={(e) => setFormData({ ...formData, homeState: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
                >
                  <option value="" disabled>-- Select Your Home State --</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Triggers 50% Home State quota cutoff relaxation for the NIT located in that state.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-800">
                    Reservation Category
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {RESERVATION_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          formData.category === cat.id
                            ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs">{cat.id}</div>
                        <div className="text-[9px] text-slate-500">~{cat.multiplier}x</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-semibold text-slate-800">
                    Gender Pool (+20% Supernumerary)
                  </label>
                  <div className="space-y-1.5">
                    {GENDER_POOLS.map((pool) => (
                      <button
                        key={pool.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, genderPool: pool.id })}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                          formData.genderPool === pool.id
                            ? 'bg-pink-50 border-2 border-pink-500 text-pink-950 font-semibold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{pool.label}</span>
                        {formData.genderPool === pool.id && (
                          <CheckCircle2 className="w-4 h-4 text-pink-600" />
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
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Branch Preferences
                  </h4>
                  <p className="text-xs text-slate-600">
                    Filter choices by discipline, or select "All Branches" for unrestricted list.
                  </p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {isAllBranches ? 'All Disciplines Selected' : `${activeBranchList.length} of ${ALL_BRANCH_CODES.length} Selected`}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => selectBranchGroup('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isAllBranches ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-300 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  All Branches
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CS_IT')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 cursor-pointer shadow-sm"
                >
                  CS &amp; IT
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CIRCUIT')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 cursor-pointer shadow-sm"
                >
                  Circuit
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CORE')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 cursor-pointer shadow-sm"
                >
                  Core
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('DESIGN')}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 cursor-pointer shadow-sm"
                >
                  Arch &amp; Plan
                </button>
                <button
                  type="button"
                  onClick={() => selectBranchGroup('CLEAR')}
                  className="px-2.5 py-1 rounded-lg text-xs text-rose-600 hover:text-rose-700 ml-auto cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Master "All Branches" card */}
              <div 
                onClick={() => toggleBranch('ALL')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isAllBranches
                    ? 'bg-gradient-to-r from-indigo-50/80 to-white border-indigo-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                    isAllBranches ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isAllBranches ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">All Branches (Recommended)</span>
                    <p className="text-[11px] text-slate-500">Include all available seat combinations.</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-indigo-700 font-bold">
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
                          ? 'bg-indigo-50/70 border-indigo-500 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step === 1 && <div />}
          
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1 (Authority)</span>
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2 (Ranks)</span>
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 3 (Quota)</span>
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleStep1Next}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 ml-auto cursor-pointer"
            >
              <span>Continue to Step 2: Exam Ranks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleStep2Next}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 ml-auto cursor-pointer"
            >
              <span>Continue to Step 3: Domicile &amp; Quota</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleStep3Next}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 ml-auto cursor-pointer"
            >
              <span>Continue to Step 4: Preferred Branches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 ml-auto cursor-pointer"
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
