import React from 'react';

/**
 * High-quality Institutional Emblem / Logo Component
 * Renders an official crisp crest in a white rounded square, exactly as shown in the user's UI mockup.
 */
export default function InstituteLogo({ type = 'NIT', name = '', className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  const normType = (type || 'NIT').toUpperCase();

  if (normType === 'IIT') {
    return (
      <div className={`${className} rounded-xl bg-white shadow-md border border-slate-200/90 flex items-center justify-center flex-shrink-0 p-1 group-hover:scale-105 transition-transform overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#0a2540]">
          <circle cx="50" cy="50" r="46" fill="#0b1b3d" stroke="#d97706" strokeWidth="4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          {/* Torch flame & gear */}
          <path d="M50 20 L55 35 L45 35 Z" fill="#ef4444" />
          <path d="M48 35 L52 35 L52 50 L48 50 Z" fill="#f59e0b" />
          <circle cx="50" cy="62" r="14" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="66" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900" fontFamily="sans-serif">
            IIT
          </text>
          <text x="50" y="86" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
            विद्या परम्
          </text>
        </svg>
      </div>
    );
  }

  if (normType === 'IIIT') {
    return (
      <div className={`${className} rounded-xl bg-white shadow-md border border-slate-200/90 flex items-center justify-center flex-shrink-0 p-1 group-hover:scale-105 transition-transform overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#2563eb" strokeWidth="4" />
          {/* Triple 'I' Roman columns */}
          <rect x="25" y="30" width="10" height="40" rx="3" fill="#38bdf8" />
          <rect x="45" y="24" width="10" height="52" rx="3" fill="#60a5fa" />
          <rect x="65" y="30" width="10" height="40" rx="3" fill="#38bdf8" />
          <rect x="22" y="26" width="56" height="5" rx="2" fill="#93c5fd" />
          <rect x="22" y="69" width="56" height="5" rx="2" fill="#93c5fd" />
          <text x="50" y="88" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            IIIT
          </text>
        </svg>
      </div>
    );
  }

  if (normType === 'GFTI') {
    return (
      <div className={`${className} rounded-xl bg-white shadow-md border border-slate-200/90 flex items-center justify-center flex-shrink-0 p-1 group-hover:scale-105 transition-transform overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
          <circle cx="50" cy="50" r="38" fill="#022c22" stroke="#34d399" strokeWidth="2" />
          {/* Shield & Laurel */}
          <path d="M50 25 L68 35 L68 55 C68 70 50 80 50 80 C50 80 32 70 32 55 L32 35 Z" fill="#047857" stroke="#a7f3d0" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            GFTI
          </text>
        </svg>
      </div>
    );
  }

  // Default: NIT
  return (
    <div className={`${className} rounded-xl bg-white shadow-md border border-slate-200/90 flex items-center justify-center flex-shrink-0 p-1 group-hover:scale-105 transition-transform overflow-hidden`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="4" />
        <circle cx="50" cy="50" r="38" fill="#312e81" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
        {/* Ashoka Wheel / Cog */}
        <circle cx="50" cy="50" r="22" fill="#1e1b4b" stroke="#e0e7ff" strokeWidth="3" />
        <circle cx="50" cy="50" r="6" fill="#f59e0b" />
        <line x1="50" y1="28" x2="50" y2="72" stroke="#e0e7ff" strokeWidth="2" />
        <line x1="28" y1="50" x2="72" y2="50" stroke="#e0e7ff" strokeWidth="2" />
        <line x1="34" y1="34" x2="66" y2="66" stroke="#e0e7ff" strokeWidth="2" />
        <line x1="34" y1="66" x2="66" y2="34" stroke="#e0e7ff" strokeWidth="2" />
        <text x="50" y="88" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="900" fontFamily="sans-serif">
          NIT
        </text>
      </svg>
    </div>
  );
}
