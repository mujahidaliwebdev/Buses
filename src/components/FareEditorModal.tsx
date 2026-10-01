import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Tag, 
  Save, 
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
  Coins,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PAKISTAN_CITIES } from '../data/mockBuses';

export interface FareData {
  origin: string;
  destination: string;
  non_ac: number;
  ac: number;
  executive: number;
  business: number;
  sleeper: number;
  last_updated?: string;
}

interface FareEditorModalProps {
  isOpen: boolean;
  fareData: FareData | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function FareEditorModal({
  isOpen,
  fareData,
  onClose,
  onSaveSuccess
}: FareEditorModalProps) {
  const isEditing = Boolean(fareData && fareData.origin && fareData.destination);

  const [formData, setFormData] = useState<FareData>({
    origin: '',
    destination: '',
    non_ac: 0,
    ac: 0,
    executive: 0,
    business: 0,
    sleeper: 0
  });

  const [applyReverse, setApplyReverse] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      return;
    }

    if (fareData) {
      setFormData({
        origin: fareData.origin || '',
        destination: fareData.destination || '',
        non_ac: Number(fareData.non_ac) || 0,
        ac: Number(fareData.ac) || 0,
        executive: Number(fareData.executive) || 0,
        business: Number(fareData.business) || 0,
        sleeper: Number(fareData.sleeper) || 0,
        last_updated: fareData.last_updated
      });
    } else {
      setFormData({
        origin: '',
        destination: '',
        non_ac: 0,
        ac: 0,
        executive: 0,
        business: 0,
        sleeper: 0
      });
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isOpen, fareData]);

  if (!isOpen) return null;

  const handleSwapCities = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const orig = formData.origin.trim();
    const dest = formData.destination.trim();

    if (!orig || !dest) {
      setErrorMessage('Both Origin and Destination cities are required / روانگی اور منزل درج کرنا ضروری ہے۔');
      return;
    }

    if (orig.toLowerCase() === dest.toLowerCase()) {
      setErrorMessage('Origin and Destination cannot be the same city / روانگی اور منزل ایک ہی شہر نہیں ہو سکتے۔');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Save primary route
      const payload = {
        origin: orig,
        destination: dest,
        old_origin: fareData?.origin,
        old_destination: fareData?.destination,
        non_ac: Number(formData.non_ac) || 0,
        ac: Number(formData.ac) || 0,
        executive: Number(formData.executive) || 0,
        business: Number(formData.business) || 0,
        sleeper: Number(formData.sleeper) || 0
      };

      const res = await fetch('/api/d1/fare/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save fare to Cloudflare D1.');
      }

      // 2. Also save reverse route if requested
      if (applyReverse) {
        try {
          await fetch('/api/d1/fare/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin: dest,
              destination: orig,
              non_ac: Number(formData.non_ac) || 0,
              ac: Number(formData.ac) || 0,
              executive: Number(formData.executive) || 0,
              business: Number(formData.business) || 0,
              sleeper: Number(formData.sleeper) || 0
            })
          });
        } catch (revErr) {
          console.warn('Reverse route fare save note:', revErr);
        }
      }

      setSuccessMessage(`Fare successfully saved in Cloudflare D1 (${orig} ⇄ ${dest})!`);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving fare.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 overflow-y-auto py-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">
                  Cloudflare D1 Live Registry
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {isEditing ? 'Edit Route Fare / کرایہ میں ترمیم' : 'Add New Route Fare / نیا کرایہ شامل کریں'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Configure bus service passenger fares between cities
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              type="button"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Messages */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Route Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Route Information / روٹ کی معلومات</span>
              </h3>
              <button
                type="button"
                onClick={handleSwapCities}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-100 transition-colors"
                title="Swap Origin and Destination"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap / تبدیل کریں</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Origin City (روانگی کا شہر) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  list="fare-cities-list"
                  placeholder="e.g. Lahore"
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Destination City (منزل کا شہر) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  list="fare-cities-list"
                  placeholder="e.g. Rawalpindi"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <datalist id="fare-cities-list">
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 select-none">
                <input 
                  type="checkbox"
                  checked={applyReverse}
                  onChange={(e) => setApplyReverse(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Also save identical fare for reverse direction ({formData.destination || 'Destination'} → {formData.origin || 'Origin'})</span>
              </label>
            </div>
          </div>

          {/* Category Fares Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Category Fares (کرایہ فی کیٹیگری)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Non-AC */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Non-AC Bus
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">نان اے سی</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={formData.non_ac || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, non_ac: Number(e.target.value) }))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-3 py-2.5 text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* AC Standard */}
              <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
                    AC Standard
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">اے سی اسٹینڈرڈ</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-blue-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={formData.ac || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ac: Number(e.target.value) }))}
                    className="w-full bg-white border border-blue-200 rounded-xl pl-11 pr-3 py-2.5 text-xs font-black text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Executive */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                    Executive Class
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">ایگزیکٹو</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={formData.executive || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, executive: Number(e.target.value) }))}
                    className="w-full bg-white border border-emerald-200 rounded-xl pl-11 pr-3 py-2.5 text-xs font-black text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Business Class */}
              <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                    Business Class
                  </span>
                  <span className="text-[10px] font-bold text-purple-600">بزنس کلاس</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-purple-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={formData.business || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, business: Number(e.target.value) }))}
                    className="w-full bg-white border border-purple-200 rounded-xl pl-11 pr-3 py-2.5 text-xs font-black text-purple-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Sleeper Class */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                    Sleeper Class
                  </span>
                  <span className="text-[10px] font-bold text-amber-600">سلیپر بس</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={formData.sleeper || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, sleeper: Number(e.target.value) }))}
                    className="w-full bg-white border border-amber-200 rounded-xl pl-11 pr-3 py-2.5 text-xs font-black text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors"
            >
              Cancel / منسوخ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving to D1...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to Cloudflare D1 / محفوظ کریں</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
