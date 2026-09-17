import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Target, Users, CheckCircle2, Sparkles, Send, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { volunteerService } from '../lib/firestoreService';
import { signUpWithEmail, db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTEREST_OPTIONS = [
  'Buses Data (Route, Schedule & Fare)',
  'Travel Guide & Blog Content Support',
  'Community Support & Passenger Assistance'
];

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    gender: 'Male',
    motivation: '',
    cnic: ''
  });
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Buses Data (Route, Schedule & Fare)']);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckboxChange = (option: string) => {
    if (selectedInterests.includes(option)) {
      setSelectedInterests(selectedInterests.filter(item => item !== option));
    } else {
      setSelectedInterests([...selectedInterests, option]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInterests([...INTEREST_OPTIONS]);
    } else {
      setSelectedInterests([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms & Conditions and Data Collection policy.');
      return;
    }
    if (selectedInterests.length === 0) {
      setError('Please select at least one Area of Interest / Contribution.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long for login setup.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create Firebase auth account for login
      const newUser = await signUpWithEmail(formData.email, password, formData.fullName);
      const uid = newUser?.uid || auth.currentUser?.uid;

      if (uid) {
        await setDoc(doc(db, 'users', uid), {
          uid,
          email: formData.email,
          displayName: formData.fullName,
          homeCity: formData.city,
          gender: formData.gender,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 2. Submit volunteer application data to Firestore
      await volunteerService.submitVolunteerApplication({
        ...formData,
        interestArea: selectedInterests.join(', ')
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create volunteer account. Please try a different email or check password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 p-6 md:p-8 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Welcome to Asaan Safar Volunteers!</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Your volunteer account application has been submitted successfully. Our team will review your details and welcome you to the community network.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-6 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              Close & Return to Website
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Community Program
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Join our VOLUNTEERS Team
              </h2>
              <p className="text-slate-700 text-sm max-w-xl mx-auto font-medium">
                آسان سفر کے ساتھ جڑ کر پاکستان کے مسافروں کی مدد کریں۔ روٹس کو اپڈیٹ کرنے اور لوکل ٹرانسپورٹ کو آسان بنانے میں اپنا کردار ادا کریں!
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Target className="w-4 h-4" /> Our Mission (ہمارا مقصد)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To provide 100% reliable, verified, and accessible non-AC bus schedule information, terminal fares, and safe travel guidance to every commuter across Pakistan.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Users className="w-4 h-4" /> Our Vision (ہمارا وژن)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connecting every remote city, town, and transport terminal in Pakistan through a transparent, volunteer-driven database of travel routes and community updates.
                </p>
              </div>
            </div>

            {/* Terms and Conditions & Data Collection */}
            <div className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Terms & Conditions / Data Collection Policy
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li><strong>Data Collection:</strong> We collect your name, email, phone number, and city strictly for volunteer coordination, community route verification, and account creation purposes.</li>
                <li><strong>Privacy & Security:</strong> Your personal information is kept strictly confidential and will never be shared with third parties or commercial entities.</li>
                <li><strong>Volunteer Code of Conduct:</strong> Volunteers are expected to provide authentic, verified transport information and maintain respectful community interaction.</li>
              </ul>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Volunteer Account Registration Form</h3>
              
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (پورا نام)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Muhammad Ali" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. ali@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password (لاگ ان پاس ورڈ - کم از کم 6 ہندسے)</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Region (شہر)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lahore / Faisalabad" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender (جنس)</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none bg-white font-medium"
                    >
                      <option value="Male">Male / مرد</option>
                      <option value="Female">Female / عورت</option>
                      <option value="Other">Other / دیگر</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Checkbox Group for Area of Interest / Contribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Area of Interest / Contribution</label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedInterests.length === INTEREST_OPTIONS.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    Select All (سب منتخب کریں)
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                  {INTEREST_OPTIONS.map((option) => (
                    <label key={option} className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors">
                      <input 
                        type="checkbox"
                        checked={selectedInterests.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="font-medium leading-tight">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Why do you want to join Asaan Safar? (Motivation)</label>
                <textarea 
                  rows={3}
                  placeholder="Share a few words about how you wish to help..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="agreeTerms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 cursor-pointer">
                  I agree to the <strong>Terms & Conditions</strong> and give consent for data collection regarding my volunteer application and community participation with Asaan Safar.
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Register Volunteer Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
