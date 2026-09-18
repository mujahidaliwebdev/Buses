import React from 'react';
import { motion } from 'motion/react';
import { X, Award, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { auth } from '../lib/firebase';

interface ExperienceLetterModalProps {
  onClose: () => void;
}

export default function ExperienceLetterModal({ onClose }: ExperienceLetterModalProps) {
  const currentUser = auth.currentUser;
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 p-6 sm:p-10 text-left space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Official Certificate
          </div>
          <h2 className="text-2xl font-black text-slate-900">Volunteer Experience Letter</h2>
          <p className="text-xs text-slate-500">AsaanSafar Pakistan Transit Initiative</p>
        </div>

        {/* Certificate Letter Body */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 space-y-4 font-serif text-slate-700 text-sm leading-relaxed">
          <div className="flex justify-between items-center text-xs font-sans text-slate-400 mb-4">
            <span>Date: {currentDate}</span>
            <span>Ref: ASP-EXP-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>

          <p className="font-bold text-slate-900">To Whom It May Concern,</p>

          <p>
            This is to certify that <strong className="text-emerald-800 font-sans">{currentUser?.displayName || 'Valued Volunteer'}</strong> has actively contributed as an official community volunteer with <strong>AsaanSafar Pakistan</strong>.
          </p>

          <p>
            During their tenure, they have demonstrated exceptional dedication in validating public transport routes, schedules, fares, and assisting commuters across Pakistan. Their commitment towards transparent public transit data has significantly benefited thousands of daily travelers.
          </p>

          <p>
            We deeply appreciate their selfless community service and wish them success in all their future endeavors.
          </p>

          <div className="pt-8 flex justify-between items-end font-sans text-xs text-slate-600">
            <div>
              <p className="font-black text-slate-900">AsaanSafar Management Team</p>
              <p className="text-[10px] text-slate-400">Community Operations & Data Verification</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Verified & Signed
              </div>
            </div>
          </div>
        </div>

        {/* Official Letter Head Seal / Graphic */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-4 text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AsaanSafar Official Letterhead & Seal</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white p-2">
            <img
              src="https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is"
              alt="AsaanSafar Letter Head"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-48 object-contain mx-auto"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Print / Save Letter
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
