import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Phone, Bus, Send, CheckCircle2, AlertCircle, Info, ChevronRight, User } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { contributionService } from '../lib/firestoreService';
import { calculateDuration } from '../lib/timeUtils';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface SubmitRouteProps {
  onClose: () => void;
}

export default function SubmitRoute({ onClose }: SubmitRouteProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    fare: '',
    companyName: '',
    busNumber: '',
    contactNumber: '',
    terminalLocation: '',
    standNumber: '',
    isAC: false,
    duration: '',
    type: 'Non-AC'
  });

  // Auto-calculate duration
  useEffect(() => {
    if (formData.departureTime && formData.arrivalTime) {
      const duration = calculateDuration(formData.departureTime, formData.arrivalTime);
      if (duration && duration !== formData.duration) {
        setFormData(prev => ({ ...prev, duration }));
      }
    }
  }, [formData.departureTime, formData.arrivalTime, formData.duration]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setError('Please login to contribute to the community.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await contributionService.submitContribution({
        companyName: formData.companyName,
        origin: formData.origin,
        destination: formData.destination,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        fare: parseInt(formData.fare) || 0,
        busNumber: formData.busNumber,
        contactNumber: formData.contactNumber,
        terminalLocation: formData.terminalLocation,
        standNumber: formData.standNumber || 'N/A',
        duration: formData.duration,
        isAC: formData.isAC,
        type: formData.type,
        userId: currentUser.uid
      });
      
      setIsSuccess(true);
      setTimeout(onClose, 3000);
    } catch (err: any) {
      setError('Could not submit route. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-emerald-600 p-8 text-white sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
               <Bus className="w-6 h-6" /> Contribute a Route
            </h3>
            <p className="text-emerald-50/70 text-sm mt-1 font-bold">Help others by providing verified bus information.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!currentUser ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Login Required</h4>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Please login to help build Pakistan's first community-driven bus verified database.</p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Close and Login
            </button>
          </div>
        ) : isSuccess ? (
          <div className="p-16 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-3xl font-black text-slate-900">Submission Received!</h4>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
              Shukriya! Our team will verify this data within 24 hours. After verification, it will be listed and helped thousands of travelers.
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 3 }}
                 className="h-full bg-emerald-600"
               />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
               <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {error}
               </div>
            )}

            <div className="space-y-6">
               <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-2">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Route Details
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Origin City</label>
                    <select 
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-slate-700"
                      required
                    >
                      <option value="">Select City</option>
                      {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Destination City</label>
                    <select 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-slate-700"
                      required
                    >
                      <option value="">Select City</option>
                      {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-2">
                  <Clock className="w-5 h-5 text-emerald-600" /> Timings & Fare
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Departure</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 08:30 AM"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Arrival Approx</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 02:00 PM"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Calculated Duration</label>
                    <input 
                      type="text" 
                      readOnly
                      placeholder="Auto"
                      value={formData.duration}
                      className="w-full px-4 py-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl focus:outline-none font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Ticket Price</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1500"
                      value={formData.fare}
                      onChange={(e) => setFormData({...formData, fare: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-emerald-600"
                      required
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-2">
                  <Info className="w-5 h-5 text-emerald-600" /> Service Details
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Bus Operator</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Niazi Express"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Class Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    >
                      <option value="Non-AC">Non-AC (Daily)</option>
                      <option value="Standard">Standard AC</option>
                      <option value="Executive">Executive</option>
                      <option value="Luxury">Luxury Business</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Terminal/Stand Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. General Bus Stand, Faisalabad (Badda No. 5)"
                      value={formData.terminalLocation}
                      onChange={(e) => setFormData({...formData, terminalLocation: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Operator Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 041-2623456"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                      required
                    />
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting for Review...
                </>
              ) : (
                <>
                  Contribute Schedule <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
