import React from 'react';
import { Company } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  Bus as BusIcon, 
  ChevronLeft,
  Info,
  Globe,
  Building2,
  Route
} from 'lucide-react';
import { motion } from 'motion/react';

interface CompanyProfileProps {
  company: Company;
  onClose: () => void;
}

export default function CompanyProfile({ company, onClose }: CompanyProfileProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/40 backdrop-blur-sm pt-4 md:pt-20 pb-4 md:pb-20 px-4"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="relative h-40 bg-gradient-to-br from-emerald-800 to-slate-900 p-8 flex flex-col justify-end">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-black text-white tracking-tight">{company.name}</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Partner</span>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info className="w-3 h-3 text-emerald-500" /> About Company
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {company.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <BusIcon className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fleet Size</p>
                  <p className="text-xl font-black text-slate-900">{company.totalBuses}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  < Globe className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network</p>
                  <p className="text-xl font-black text-slate-900">National</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Route className="w-3 h-3 text-emerald-500" /> Major Routes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.routes.map(route => (
                    <span key={route} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100/50">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Building2 className="w-3 h-3 text-blue-500" /> Head Office
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-slate-700 text-xs font-bold leading-relaxed">
                    {company.officeAddress}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-blue-500" /> Contact Info
                </h3>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">24/7 Helpline</p>
                  <p className="text-2xl font-black text-blue-900 mb-6">{company.contactInfo}</p>
                  
                  <a 
                    href={`tel:${company.contactInfo}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    Call Hotline
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
