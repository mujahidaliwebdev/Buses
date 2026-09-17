import React from 'react';
import { motion } from 'motion/react';
import { X, Award, ShieldCheck, QrCode, Sparkles } from 'lucide-react';
import { auth } from '../lib/firebase';

interface VolunteerCardModalProps {
  onClose: () => void;
}

export default function VolunteerCardModal({ onClose }: VolunteerCardModalProps) {
  const currentUser = auth.currentUser;

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
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 p-6 sm:p-8 text-center space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Official Volunteer Card
          </div>
          <h2 className="text-xl font-black text-slate-900">AsaanSafar Volunteer ID</h2>
        </div>

        {/* ID Card Graphic */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white text-left shadow-xl border border-emerald-700/50 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-sm">AS</div>
              <div>
                <h4 className="text-xs font-black tracking-wider uppercase">AsaanSafar Pakistan</h4>
                <p className="text-[9px] text-emerald-200">Verified Volunteer Program</p>
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-white">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.displayName?.[0] || 'V'}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">{currentUser?.displayName || 'Registered Volunteer'}</h3>
              <p className="text-[11px] text-emerald-200 font-mono">{currentUser?.email || 'volunteer@asaansafar.pk'}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 text-[9px] font-black uppercase tracking-widest border border-emerald-400/30">
                Active Member
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-white/10 text-[10px] text-emerald-100">
            <div>
              <p className="opacity-70">VOLUNTEER ID</p>
              <p className="font-mono font-bold">AS-{currentUser?.uid?.substring(0, 8).toUpperCase() || 'VLV-786'}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center text-slate-900">
              <QrCode className="w-full h-full" />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          This digital card verifies your active participation in building Pakistan's smart public transit network.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
        >
          Close Card
        </button>
      </motion.div>
    </div>
  );
}
