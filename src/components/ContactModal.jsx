import React from 'react';
import { X, Mail, Phone, ExternalLink, HelpCircle, MessageSquare } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d1e] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Contact &amp; Counseling Support</h2>
              <p className="text-xs text-slate-400">JoSAA / CSAB 2026 Helpdesk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Support Channels */}
        <div className="space-y-3">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Counseling Support Email</div>
                <div className="text-xs font-mono text-blue-400">helpdesk@josaafinder2026.org</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Official JoSAA Portal</div>
                <div className="text-xs font-mono text-indigo-400">josaa.nic.in</div>
              </div>
            </div>
            <a 
              href="https://josaa.nic.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Visit
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Official CSAB Special Rounds</div>
                <div className="text-xs font-mono text-purple-400">csab.nic.in</div>
              </div>
            </div>
            <a 
              href="https://csab.nic.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 underline"
            >
              Visit
            </a>
          </div>

        </div>

        {/* Counseling Tips */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Remember: Choice locking is mandatory before the JoSAA deadline. Unlocked choices will automatically be locked in their last saved order.
          </span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
