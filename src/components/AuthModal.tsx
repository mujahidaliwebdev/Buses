import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Mail } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium text-sm mb-10">
            Sign in to contribute routes and manage your personalized travel network.
          </p>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 py-4 rounded-2xl font-bold transition-all active:scale-95 group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
              <span className="text-slate-700">Continue with Google</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4">
                Secured by Firebase
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              By joining, you agree to our terms and help us build Pakistan's most reliable bus network.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
