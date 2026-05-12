import React from 'react';
import { Bus } from '../types';
import { 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Bus as BusIcon, 
  Info, 
  ShieldCheck, 
  ChevronLeft,
  AlertTriangle,
  Snowflake,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';

interface BusDetailsProps {
  bus: Bus;
  onClose: () => void;
}

export default function BusDetails({ bus, onClose }: BusDetailsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm pt-4 md:pt-20 pb-4 md:pb-20 px-4"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden"
      >
        {/* Header with Background */}
        <div className="relative h-48 md:h-64 bg-emerald-950 p-8 flex flex-col justify-end">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Verified Route
                </span>
                {bus.isAC ? (
                  <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1">
                    <Snowflake className="w-3 h-3" /> AC
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Sun className="w-3 h-3" /> Non-AC
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {bus.companyName}
              </h2>
              <p className="text-emerald-400 font-bold uppercase tracking-tighter text-sm mt-1 flex items-center gap-2">
                <BusIcon className="w-4 h-4" /> {bus.busNumber}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest mb-1">Ticket Price</p>
              <p className="text-4xl font-black text-white tracking-tighter">
                <span className="text-xl font-bold mr-1">Rs.</span>{bus.fare}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Times & Route Card */}
          <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure City</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <p className="text-xl font-bold text-slate-900">{bus.origin}</p>
                </div>
                <p className="text-3xl font-black text-emerald-700 ml-6">{bus.departureTime}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm mb-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bus.duration}</p>
                </div>
                <div className="w-px h-12 border-l border-dashed border-slate-300 md:w-full md:h-px md:border-t" />
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Direct non-stop</p>
              </div>

              <div className="space-y-1 md:text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival City</p>
                <div className="flex items-center gap-3 md:justify-end">
                  <p className="text-xl font-bold text-slate-900">{bus.destination}</p>
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
                <p className="text-3xl font-black text-slate-700 mr-6 md:mr-0 md:ml-0">{bus.arrivalTime}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Details List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-500" /> Bus Specifications
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Service Type" value={bus.type} />
                  <DetailItem label="Climate Control" value={bus.isAC ? "Air Conditioned" : "Normal Ventilation"} />
                  <DetailItem label="Registration #" value={bus.busNumber} />
                  <DetailItem label="Status" value="On Schedule" status="emerald" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" /> Terminal Contact
                </h3>
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Terminal Booking #</p>
                  <p className="text-2xl font-black text-blue-900">{bus.contactNumber}</p>
                  <a 
                    href={`tel:${bus.contactNumber}`}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    Call for Booking
                  </a>
                </div>
              </div>
            </div>

            {/* Side Card */}
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900 mb-2">Verified Schedule</h4>
                <p className="text-emerald-800/70 text-sm leading-relaxed mb-6">
                  This schedule is verified by our terminal operators. However, arrival times are subject to traffic conditions and motorway authority regulations.
                </p>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest">
                  Last Updated: Today 4:00 AM
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-red-100">
                <AlertTriangle className="w-4 h-4" />
                Report Incorrect Information
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value, status }: { label: string, value: string, status?: 'emerald' | 'slate' }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-black ${status === 'emerald' ? 'text-emerald-600' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}
