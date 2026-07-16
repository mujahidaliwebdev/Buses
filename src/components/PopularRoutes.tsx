import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { POPULAR_ROUTES } from '../data/mockBuses';

interface PopularRoutesProps {
  onRouteClick?: (from: string, to: string) => void;
  onViewAllClick?: () => void;
}

export default function PopularRoutes({ onRouteClick, onViewAllClick }: PopularRoutesProps) {
  return (
    <section id="routes" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-emerald-600 rounded-full"></span>
              Popular Daily Routes
            </h2>
            <p className="text-slate-500 text-sm mt-1">Reliable connectivity between Pakistan's major transport hubs.</p>
          </div>
          <button 
            onClick={onViewAllClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-emerald-100/50 shadow-sm outline-none"
          >
            View All Schedule
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, idx) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-6 border border-slate-100 rounded-[1.5rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex items-center justify-between cursor-pointer relative shadow-sm"
            >
              <Link 
                to={`/${route.from.toLowerCase()}-to-${route.to.toLowerCase()}-bus-timing`}
                className="absolute inset-0 z-20"
              />
              <div className="flex-1 flex items-center gap-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">FROM</span>
                   <span className="text-base font-black text-slate-900">{route.from}</span>
                 </div>
                 
                 <div className="flex-1 flex justify-center">
                    <ArrowRight className="w-5 h-5 text-emerald-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                 </div>

                 <div className="flex flex-col text-right">
                   <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">TO</span>
                   <span className="text-base font-black text-slate-900">{route.to}</span>
                 </div>
              </div>

              <div className="ml-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
