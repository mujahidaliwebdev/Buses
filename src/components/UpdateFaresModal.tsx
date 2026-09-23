import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { busService, contributionService } from '../lib/firestoreService';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface UpdateFaresModalProps {
  onClose: () => void;
}

export default function UpdateFaresModal({ onClose }: UpdateFaresModalProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [fareOrigin, setFareOrigin] = useState('');
  const [fareDestination, setFareDestination] = useState('');
  const [fareNonAc, setFareNonAc] = useState('');
  const [fareAc, setFareAc] = useState('');
  const [fareExec, setFareExec] = useState('');
  const [fareBiz, setFareBiz] = useState('');
  const [fareSleep, setFareSleep] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please login to update fares.');
      return;
    }
    if (!fareOrigin || !fareDestination) {
      setError('Please select both Origin and Destination cities.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const non_ac = Number(fareNonAc) || 0;
      const ac = Number(fareAc) || 0;
      const executive = Number(fareExec) || 0;
      const business = Number(fareBiz) || 0;
      const sleeper = Number(fareSleep) || 0;

      await busService.bulkUpdateFares(fareOrigin, fareDestination, {
        non_ac,
        ac,
        executive,
        business,
        sleeper
      }, 'all');

      await contributionService.submitContribution({
        companyName: `Fare Update: ${fareOrigin} to ${fareDestination}`,
        origin: fareOrigin,
        destination: fareDestination,
        departureTime: 'N/A',
        busNumber: 'FARES',
        contactNumber: currentUser.phoneNumber || 'N/A',
        fare: non_ac || ac || executive || business || sleeper,
        isAC: ac > 0,
        type: 'Fare Update',
        non_ac,
        ac,
        executive,
        business,
        sleeper,
        userId: currentUser.uid,
        status: 'approved'
      });

      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (err: any) {
      setError(err.message || 'Could not update fares. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8 flex flex-col border border-slate-100 max-h-[90vh]"
      >
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 sm:px-8 py-6 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Tag className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-900/50 px-2.5 py-1 rounded-full">Community Update</span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Update Route Fares (کرایہ اپ ڈیٹ کریں)</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {success ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Fares Updated Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for contributing! Route fares for all matching buses have been updated and verified on AsaanSafar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Origin City (مقام روانگی)</label>
                  <select
                    required
                    value={fareOrigin}
                    onChange={(e) => setFareOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  >
                    <option value="">Select Origin City</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Destination City (مقام منزل)</label>
                  <select
                    required
                    value={fareDestination}
                    onChange={(e) => setFareDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  >
                    <option value="">Select Destination City</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  Category-wise Fares (Rs.) / کیٹیگری کے لحاظ سے کرایہ
                </h4>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">🚌 Non-AC (بغیر اے سی)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 850"
                      value={fareNonAc}
                      onChange={(e) => setFareNonAc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">❄️ AC (اے سی)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 1200"
                      value={fareAc}
                      onChange={(e) => setFareAc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">✨ Executive (ایگزیکٹو)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 1600"
                      value={fareExec}
                      onChange={(e) => setFareExec(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">💼 Business (بزنس)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2000"
                      value={fareBiz}
                      onChange={(e) => setFareBiz(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">🛏️ Sleeper (سلیپر)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2500"
                      value={fareSleep}
                      onChange={(e) => setFareSleep(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Fares...</span>
                    </>
                  ) : (
                    <span>Update Route Fares / کرایہ اپ ڈیٹ کریں</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
