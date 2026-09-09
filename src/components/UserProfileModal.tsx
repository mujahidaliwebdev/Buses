import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Image, AlertCircle, CheckCircle, Save, Mail, MapPin, Users, FileText, Calendar, ShieldAlert } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { PAKISTAN_CITIES } from '../data/mockBuses';

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
  const [homeCity, setHomeCity] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

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
          if (data.homeCity) setHomeCity(data.homeCity);
          if (data.gender) setGender(data.gender);
          if (data.bio) setBio(data.bio);
          if (data.emergencyContactName) setEmergencyName(data.emergencyContactName);
          if (data.emergencyContactNumber) setEmergencyNumber(data.emergencyContactNumber);
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
          homeCity: homeCity.trim(),
          gender: gender.trim(),
          bio: bio.trim(),
          emergencyContactName: emergencyName.trim(),
          emergencyContactNumber: emergencyNumber.trim(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setSuccess('Profile updated successfully! / آپ کی پروفائل کامیابی سے تبدیل ہو گئی ہے۔');
      if (onProfileUpdated) {
        onProfileUpdated();
      }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
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
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col"
      >
        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 px-6 sm:px-8 pt-6 pb-6 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-16 h-16 mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-emerald-800 flex items-center justify-center text-white font-black text-2xl border-2 border-white/80 shadow-xl overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{name?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>

          <h2 className="text-xl font-black text-white mb-0.5 tracking-tight">Edit Profile / پروفائل ایڈٹ کریں</h2>
          <p className="text-emerald-50/90 font-medium text-[11px]">
            Update your personal profile information for safe travels.
          </p>
          {memberSince && (
            <p className="text-emerald-100/70 font-bold text-[9px] uppercase tracking-widest mt-2">
              Member since {memberSince}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8">
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
              <form onSubmit={handleSave} className="space-y-8 text-left">

                {/* Section 1: Basic Info */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> Basic Information / بنیادی معلومات
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
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
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Email Address / ای میل</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={currentUser.email || ''}
                          readOnly
                          disabled
                          className="w-full h-11 pl-10 pr-4 bg-slate-100 border border-slate-200/80 rounded-xl text-slate-500 font-semibold text-sm cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 ml-1">Linked to your sign-in account, cannot be changed here.</p>
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
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Home City / آبائی شہر</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <select
                          value={homeCity}
                          onChange={(e) => setHomeCity(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none"
                        >
                          <option value="">Select City</option>
                          {PAKISTAN_CITIES.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Gender / صنف</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none"
                        >
                          <option value="">Prefer not to say</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: About */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> About / تعارف
                  </h3>
                  <div className="relative">
                    <textarea
                      placeholder="Tell us a little about yourself or your travel preferences..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={200}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none"
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-1 ml-1 text-right">{bio.length}/200</p>
                  </div>
                </div>

                {/* Section 3: Emergency Contact */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Emergency Contact / ہنگامی رابطہ
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mb-3 -mt-2">Shared only with your travel record, used in case of emergencies.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Contact Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Ahmed Ali (Brother)"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 ml-1">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="e.g. 03001234567"
                          value={emergencyNumber}
                          onChange={(e) => setEmergencyNumber(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Avatar */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Image className="w-3.5 h-3.5 text-emerald-600" /> Profile Picture / پروفائل تصویر
                  </h3>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Choose an Avatar / اوتار منتخب کریں</label>
                  <div className="grid grid-cols-4 gap-2 mb-4 max-w-xs">
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
