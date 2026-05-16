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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Top Bar with Icon */}
            <div className="bg-emerald-600 p-8 text-white relative">
              <button 
                onClick={closePopup}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Info className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-black tracking-tight mb-2">Important Notice</h2>
              <p className="text-emerald-100 font-medium opacity-80 uppercase text-[10px] tracking-[0.3em]">Software update in progress</p>
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
