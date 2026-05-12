import React, { useState } from 'react';
import { 
  Send, 
  MapPin, 
  Clock, 
  Bus as BusIcon, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Smartphone,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubmitRouteProps {
  onClose: () => void;
}

export default function SubmitRoute({ onClose }: SubmitRouteProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    origin: '',
    destination: '',
    departureTime: '',
    fare: '',
    vehicleNumber: '',
    contactNumber: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, we would send this to a database
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[70] bg-white flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Contribution Received!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Thank you for helping the community. Our team will verify this information and update the network shortly.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Submission
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-emerald-950 p-10 md:p-14 text-white">
            <h1 className="text-4xl font-black tracking-tight mb-4">Contribute Info</h1>
            <p className="text-emerald-400 font-medium leading-relaxed">
              Found a route we're missing? Share the details below and help thousands of travelers in Pakistan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10">
            {/* Standard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ContributionInput 
                label="Bus Company" 
                icon={<BusIcon className="w-4 h-4" />}
                placeholder="e.g. Faisal Movers"
                required
                value={formData.companyName}
                onChange={(v) => setFormData({...formData, companyName: v})}
              />
              <ContributionInput 
                label="Vehicle #" 
                icon={<Tag className="w-4 h-4" />}
                placeholder="e.g. MN-422 (Optional)"
                value={formData.vehicleNumber}
                onChange={(v) => setFormData({...formData, vehicleNumber: v})}
              />
              <ContributionInput 
                label="Departure City" 
                icon={<MapPin className="w-4 h-4" />}
                placeholder="e.g. Lahore"
                required
                value={formData.origin}
                onChange={(v) => setFormData({...formData, origin: v})}
              />
              <ContributionInput 
                label="Arrival City" 
                icon={<MapPin className="w-4 h-4" />}
                placeholder="e.g. Multan"
                required
                value={formData.destination}
                onChange={(v) => setFormData({...formData, destination: v})}
              />
              <ContributionInput 
                label="Departure Time" 
                icon={<Clock className="w-4 h-4" />}
                placeholder="e.g. 10:00 PM"
                required
                value={formData.departureTime}
                onChange={(v) => setFormData({...formData, departureTime: v})}
              />
              <ContributionInput 
                label="Ticket Fare (RS)" 
                icon={<Tag className="w-4 h-4" />}
                placeholder="e.g. 1400"
                required
                type="number"
                value={formData.fare}
                onChange={(v) => setFormData({...formData, fare: v})}
              />
               <ContributionInput 
                label="Contact Number" 
                icon={<Smartphone className="w-4 h-4" />}
                placeholder="Terminal booking number"
                required
                value={formData.contactNumber}
                onChange={(v) => setFormData({...formData, contactNumber: v})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" /> Additional Details
              </label>
              <textarea 
                placeholder="Any extra info (e.g. terminal location, AC/Non-AC, etc.)"
                className="w-full bg-slate-50 border-none rounded-2xl p-6 font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none min-h-[120px] transition-all"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" /> Submit Contribution
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContributionInput({ 
  label, 
  icon, 
  placeholder, 
  required = false, 
  type = "text",
  value,
  onChange
}: { 
  label: string, 
  icon: React.ReactNode, 
  placeholder: string, 
  required?: boolean,
  type?: string,
  value: string,
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <input 
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
      />
    </div>
  );
}
