import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Image, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

interface UserProfileModalProps {
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const PRESET_AVATARS = [
  {
    name: 'Teal Business',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Elegant Portrait',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Modern Accent',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Warm Portrait',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export default function UserProfileModal({ onClose, onProfileUpdated }: UserProfileModalProps) {
  const currentUser = auth.currentUser;
  
  const [name, setName] = useState(currentUser?.displayName || '');
  const [mobile, setMobile] = useState('');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.mobile) setMobile(data.mobile);
          if (data.displayName) setName(data.displayName);
          if (data.photoURL) setPhotoURL(data.photoURL);
        }
      } catch (err) {
        console.error('Error fetching user document:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to update your profile.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full name. / برائے مہربانی اپنا نام درج کریں۔');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Update Firebase Auth Profile
      await updateProfile(currentUser, {
        displayName: name.trim(),
        photoURL: photoURL.trim() || null,
      });

      // 2. Save/Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userDocRef,
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: name.trim(),
          photoURL: photoURL.trim(),
          mobile: mobile.trim(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setSuccess('Profile updated successfully! / آپ کی پروفائل کامیابی سے تبدیل ہو گئی ہے۔');
      if (onProfileUpdated) {
        onProfileUpdated();
      }
      
      // Close modal after a brief duration to let user see success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return null;
  }

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
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
      >
        <div className="p-8 sm:p-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4 group">
            <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-3xl border-4 border-emerald-50 shadow-lg overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{name?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Edit Profile / پروفائل ایڈٹ کریں</h2>
          <p className="text-slate-500 font-medium text-xs mb-6">
            Update your personal profile information for safe travels and contributions.
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-bold flex items-start gap-2 text-left"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-[11px] font-bold flex items-start gap-2 text-left"
              >
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading user profile details...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Full Name / پورا نام</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Mobile Number / موبائل نمبر</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="e.g. 03001234567"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Choose an Avatar / اوتار منتخب کریں</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoURL(avatar.url)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all mx-auto ${photoURL === avatar.url ? 'border-emerald-500 scale-110 shadow-md shadow-emerald-500/10' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Or Custom Photo URL / یا کسٹم تصویر کا لنک</label>
                <div className="relative">
                  <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="url" 
                    placeholder="https://example.com/avatar.jpg"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-98 flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/10"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes / محفوظ کریں</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

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
