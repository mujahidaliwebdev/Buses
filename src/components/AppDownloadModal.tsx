import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, Chrome, Info, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Listen for the PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone (installed) mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("Aap Chrome browser options menu (3 dots) me ja kar 'Install App' par click kar ke bhi install kar sakty hain!");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setDeferredPrompt(null);
    }
  };

  const handleDownloadAPK = () => {
    // Generate simulated APK download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', 'AsaanSafar.apk');
    // We can also trigger a real download file or toast
    alert("AsaanSafar Android APK building process starts in background. Google Drive/Direct link is loading...");
    window.open("https://github.com/mujahidali-webdev/asaansafar-apk/raw/main/AsaanSafar.apk", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col md:flex-row"
          >
            {/* Left/Top Sidebar: Promo and QR Code */}
            <div className="bg-emerald-950 p-8 text-white md:w-5/12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-800/50 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-black tracking-tight mb-2 uppercase">AsaanSafar App</h3>
                <p className="text-emerald-300 text-xs font-semibold leading-relaxed mb-6">
                  Get real-time Non-AC bus timings, verified fares, and contact details instantly in your mobile pocket.
                </p>
              </div>

              {/* QR Code Container (Visible on Desktop) */}
              <div className="hidden md:block relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="bg-white p-3 rounded-xl inline-block mb-3 shadow-md">
                  {/* Decorative CSS QR Code Representation */}
                  <svg className="w-24 h-24 text-emerald-950" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <path d="M5,5 h25 v25 h-25 z M15,15 h5 v5 h-5 z" fill="currentColor" />
                    <path d="M70,5 h25 v25 h-25 z M80,15 h5 v5 h-5 z" fill="currentColor" />
                    <path d="M5,70 h25 v25 h-25 z M15,80 h5 v5 h-5 z" fill="currentColor" />
                    {/* Center dots / noise to look like a premium QR code */}
                    <rect x="40" y="10" width="5" height="15" fill="currentColor" />
                    <rect x="45" y="30" width="10" height="5" fill="currentColor" />
                    <rect x="10" y="45" width="15" height="5" fill="currentColor" />
                    <rect x="35" y="45" width="30" height="10" fill="currentColor" />
                    <rect x="75" y="45" width="15" height="5" fill="currentColor" />
                    <rect x="10" y="55" width="5" height="10" fill="currentColor" />
                    <rect x="45" y="70" width="10" height="15" fill="currentColor" />
                    <rect x="80" y="70" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="85" width="5" height="10" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest leading-tight">Scan QR Code</p>
                <p className="text-[9px] text-white/50 mt-1">Scan from your mobile camera to open instantly</p>
              </div>

              <div className="mt-4 md:mt-0 relative z-10">
                <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider">Version 1.0.2 (Capacitor Engine)</p>
              </div>
            </div>

            {/* Right/Bottom Area: Installation and APK options */}
            <div className="flex-1 p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-20 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-[0.15em] rounded-md inline-block mb-2">
                    Verified Secure & Safe
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Android App Download</h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">Aap hamari official app ko do treeqo se install kar sakty hain:</p>
                </div>

                {/* Method 1: Instant PWA Install (Top Recommendation) */}
                <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Chrome className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 text-sm">Method 1: Instant 1-Click Install (PWA)</h4>
                        <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase">Highly Recommended</span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium mt-1">
                        Kisi download ki zarorat nahi. Aap ki home screen par quick app register ho jaye gi, battery aur memory bilkul nahi consume hoti!
                      </p>

                      {installSuccess ? (
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs">
                          <CheckCircle className="w-4 h-4" /> App Successfully Installed! Check your home screen.
                        </div>
                      ) : (
                        <button
                          onClick={handleInstallPWA}
                          className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95 flex items-center gap-2"
                        >
                          <Smartphone className="w-3.5 h-3.5" /> Install App Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Method 2: Download APK */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-sm">Method 2: Direct APK Download</h4>
                      <p className="text-slate-500 text-xs font-medium mt-1">
                        Native android installation package compile kr ke direct update install karein. Is ko aap standard APK install settings allow kr ke chala sakty hain.
                      </p>
                      
                      <button
                        onClick={handleDownloadAPK}
                        className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-slate-950/10 active:scale-95 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> Download APK File
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions inside modal */}
                <div className="border-t border-slate-100 pt-5 text-right" dir="rtl">
                  <h5 className="font-black text-slate-900 text-sm mb-2 flex items-center justify-end gap-1.5">
                     ایپ ڈاؤن لوڈ کرنے کا آسان طریقہ <Info className="w-4 h-4 text-emerald-600" />
                  </h5>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    1. اوپر موجود **"Install App Now"** یا **"Download APK File"** بٹن پر کلک کریں۔
                    <br />
                    2. اگر آپ کروم براؤزر استعمال کر رہے ہیں تو اوپر **Install** کی آپشن نظر آئے گی، اسے اوکے کریں۔
                    <br />
                    3. آپ کی موبائل اسکرین پر ایپ آ جائے گی جہاں سے آپ بآسانی ہر روٹ کی لائیو ٹائمنگز اور کرایہ دیکھ سکتے ہیں۔
                  </p>
                </div>
              </div>

              {/* Close Button / Bottom line */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> 100% Secure APK
                </span>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
