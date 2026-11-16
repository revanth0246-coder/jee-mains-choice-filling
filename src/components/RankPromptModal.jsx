import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Building2, 
  Award, 
  MapPin, 
  Users2,
  Zap
} from 'lucide-react';
import { 
  INDIAN_STATES, 
  RESERVATION_CATEGORIES, 
  GENDER_POOLS, 
  COUNSELING_TYPES 
} from '../data/josaaCutoffs.js';

export default function RankPromptModal({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSaveProfile 
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    counselingType: currentProfile?.counselingType || 'CSAB',
    jeeMainRank: currentProfile?.jeeMainRank || 38291,
    homeState: currentProfile?.homeState || 'Telangana',
    category: currentProfile?.category || 'OBC-NCL',
    genderPool: currentProfile?.genderPool || 'Gender-Neutral',
    preferredBranches: currentProfile?.preferredBranches || ['ALL']
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        counselingType: currentProfile.counselingType || 'CSAB',
        jeeMainRank: currentProfile.jeeMainRank || 38291,
        homeState: currentProfile.homeState || 'Telangana',
        category: currentProfile.category || 'OBC-NCL',
        genderPool: currentProfile.genderPool || 'Gender-Neutral',
        preferredBranches: currentProfile.preferredBranches || ['ALL']
      });
    }
  }, [currentProfile, isOpen]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const rankNum = Number(formData.jeeMainRank);
    if (!rankNum || rankNum <= 0) {
      setErrorMsg('Please enter a valid JEE Main CRL Rank (e.g. 38,291)');
      return;
    }
    setErrorMsg('');
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Header matching user's result page */}
        <div className="bg-gradient-to-r from-[#0c1439] via-[#16245f] to-[#25338d] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close dialog and view current choices"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15">
              Official 2026 Slicing Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Enter Your Rank &amp; Details
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Personalize your choice-filling sheet across 119 premier institutes. Your choices are already loaded behind this prompter.
          </p>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-slate-800">
          
          {/* 1. Counseling Authority Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Counseling Authority
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, counselingType: 'CSAB' }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.counselingType === 'CSAB'
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">CSAB Special 2026</span>
                  {formData.counselingType === 'CSAB' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-1">96 NITs, IIITs &amp; GFTIs</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, counselingType: 'JOSAA' }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  formData.counselingType === 'JOSAA'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">JoSAA 2026</span>
                  {formData.counselingType === 'JOSAA' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-1">119 Institutes (incl. IITs)</span>
              </button>
            </div>
          </div>

          {/* 2. JEE Main CRL Rank */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>JEE Main 2026 CRL Rank</span>
              <span className="text-[11px] font-normal text-indigo-600">All India CRL</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                #
              </span>
              <input
                type="number"
                min="1"
                max="1200000"
                value={formData.jeeMainRank}
                onChange={(e) => setFormData(prev => ({ ...prev, jeeMainRank: e.target.value }))}
                placeholder="e.g. 38291"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}
          </div>

          {/* 3. Category & Home State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Reservation Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
              >
                {RESERVATION_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Home State (Domicile)
              </label>
              <select
                value={formData.homeState}
                onChange={(e) => setFormData(prev => ({ ...prev, homeState: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Gender Pool */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Gender Pool
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_POOLS.map(pool => (
                <button
                  key={pool.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, genderPool: pool.id }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    formData.genderPool === pool.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {pool.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Update &amp; Show My Choices</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              View 321 Colleges Directly (CSAB #{Number(formData.jeeMainRank || 38291).toLocaleString()})
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
