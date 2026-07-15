import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, AlertCircle, Mail, Lock, User, CheckCircle, KeyRound } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } from '../lib/firebase';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignUp = mode === 'signup';
  const isForgotPassword = mode === 'forgot';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Sign in was cancelled.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. Please add it to "Authorized domains" in Firebase Console.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead. / یہ ای میل پہلے سے رجسٹرڈ ہے۔');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address. / براہ کرم درست ای میل درج کریں۔');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters. / پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again. / غلط ای میل یا پاس ورڈ۔');
          break;
        default:
          setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address. / براہ کرم اپنا ای میل ایڈریس درج کریں۔');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await sendPasswordReset(email);
      setSuccessMessage('Password reset email sent! Please check your inbox or spam folder. / پاس ورڈ ری سیٹ لنک آپ کے ای میل پر بھیج دیا گیا ہے۔ برائے مہربانی اپنا ان باکس یا اسپیم فولڈر چیک کریں۔');
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address. / براہ کرم درست ای میل درج کریں۔');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email. / اس ای میل کے ساتھ کوئی اکاؤنٹ نہیں ملا۔');
          break;
        default:
          setError(err.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      setLoading(false);
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
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in duration-300"
      >
        <div className="p-8 sm:p-10 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isForgotPassword ? (
              <KeyRound className="w-7 h-7 text-emerald-600 animate-pulse" />
            ) : (
              <LogIn className="w-7 h-7 text-emerald-600" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 font-medium text-xs mb-6">
            {isForgotPassword 
              ? 'Enter your registered email below to receive a secure password reset link.' 
              : isSignUp 
                ? "Join Pakistan's most reliable bus timings & routes community." 
                : "Sign in to contribute routes and manage your personalized travel network."}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-bold flex flex-col gap-2 text-left"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-[11px] font-bold flex flex-col gap-2 text-left"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {successMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-left mb-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Email Address / ای میل</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-98 flex items-center justify-center text-sm shadow-md shadow-emerald-600/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Reset Link / ری سیٹ لنک بھیجیں'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-3.5 text-left mb-5">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Full Name / پورا نام</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Mujahid Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Email Address / ای میل</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Password / پاس ورڈ</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Forgot Password? / پاس ورڈ بھول گئے؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-98 flex items-center justify-center text-sm shadow-md shadow-emerald-600/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isSignUp ? 'Sign Up / اکاؤنٹ بنائیں' : 'Sign In / لاگ ان کریں'
                )}
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <>
              <div className="relative py-2 mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4">
                  OR / یا
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 h-12 rounded-xl font-bold transition-all active:scale-95 group text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                  ) : (
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" />
                  )}
                  <span className="text-slate-700">Continue with Google</span>
                </button>
              </div>
            </>
          )}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                if (isForgotPassword) {
                  setMode('signin');
                } else {
                  setMode(isSignUp ? 'signin' : 'signup');
                }
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {isForgotPassword 
                ? 'Back to Sign In / لاگ ان پر واپس جائیں' 
                : isSignUp 
                  ? 'Already have an account? Sign In / لاگ ان کریں' 
                  : "Don't have an account? Sign Up / اکاؤنٹ بنائیں"}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto mt-4">
            By joining, you agree to our terms and help us build Pakistan's most reliable bus network.
          </p>

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
