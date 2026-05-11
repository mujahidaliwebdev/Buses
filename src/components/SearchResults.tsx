import { Bus } from '../types';
import { Clock, Phone, Snowflake, Sun, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResultsProps {
  buses: Bus[];
  origin: string;
  destination: string;
  onClose: () => void;
}

export default function SearchResults({ buses, origin, destination, onClose }: SearchResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-slate-50 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-emerald-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {origin} <ArrowRight className="w-4 h-4 text-emerald-400" /> {destination}
            </h3>
            <p className="text-emerald-200/70 text-sm mt-1">{buses.length} buses found for this route</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-grow p-6 space-y-4">
          {buses.length > 0 ? (
            buses.map((bus) => (
              <motion.div 
                key={bus.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-lg font-black text-slate-800">{bus.companyName}</h4>
                      {bus.isAC ? (
                        <span className="flex items-center gap-1 text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          <Snowflake className="w-3 h-3" /> AC
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          <Sun className="w-3 h-3" /> Non-AC
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {bus.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</p>
                         <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                           <Clock className="w-4 h-4 text-emerald-500" />
                           {bus.departureTime}
                         </p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Arrival</p>
                         <p className="text-lg font-medium text-slate-700">{bus.arrivalTime}</p>
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bus Number</p>
                         <p className="text-sm font-mono bg-slate-100 rounded px-2 py-1 inline-block text-slate-600 border border-slate-200">
                           {bus.busNumber}
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="shrink-0 lg:w-48 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 text-center lg:text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket Fare</p>
                    <p className="text-3xl font-bold text-emerald-700 mb-4 tracking-tighter">Rs. {bus.fare}</p>
                    
                    <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-11 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/10 transition-all active:scale-95">
                      <Phone className="w-4 h-4" />
                      Book Now
                    </button>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 text-center uppercase tracking-tighter">{bus.contactNumber}</p>
                  </div>
                </div>
              </motion.div>
            )
          )) : (
            <div className="py-20 text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="w-10 h-10 text-slate-300" />
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">No Buses Found</h4>
               <p className="text-slate-500">Try changing your route or checking back later.</p>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400 italic font-medium tracking-tight">Fares and timings are subject to change by operators.</p>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600">PK</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
