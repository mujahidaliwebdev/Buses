import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, AlertCircle } from 'lucide-react';

export default function NoticePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after a small delay for better entrance
    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <div key="notice-popup" className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-7 text-white relative">
              <button 
                onClick={closePopup}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Info className="w-7 h-7 text-white" />
              </div>
              
              <h2 className="text-2xl font-black tracking-tight mb-1 uppercase tracking-[0.05em]">Important Notice</h2>
              <p className="text-emerald-100 font-bold opacity-70 uppercase text-[9px] tracking-[0.2em]">Latest Platform Update</p>
            </div>

            {/* Content Area */}
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* English Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verification Status</span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Our team is currently collecting verified bus data from the field.
                  <br />
                  <br />
                  New routes and timings will be published soon.
                  <br />
                  For now, feel free to explore our website features.
                </p>
                <p className="text-slate-400 font-black text-[11px] uppercase">Thank you for your support.</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 w-full" />

              {/* Urdu Section */}
              <div className="space-y-4 text-right" dir="rtl">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">اہم اطلاع</h3>
                <p className="text-slate-600 font-bold leading-[2] text-lg">
                  ہماری ٹیم فیلڈ میں جا کر ویریفائیڈ بس ڈیٹا جمع کر رہی ہے۔
                  <br />
                  نئے روٹس اور ٹائمنگز جلد ہماری ویب سائٹ پر اپڈیٹ کر دی جائیں گی۔
                  <br />
                  فی حال آپ ہماری ویب سائٹ کے فیچرز دیکھ سکتے ہیں۔
                </p>
                <p className="text-emerald-600 font-black text-sm">آپ کے تعاون کا شکریہ۔</p>
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={closePopup}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                Close Notice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
