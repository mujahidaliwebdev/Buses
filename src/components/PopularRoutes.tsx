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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route, idx) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-5 border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex items-center justify-between cursor-pointer relative"
            >
              <Link 
                to={`/${route.from.toLowerCase()}-to-${route.to.toLowerCase()}-bus-timing`}
                className="absolute inset-0 z-20"
              />
              <div className="flex gap-6 items-center">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">From</span>
                   <span className="font-bold text-slate-800">{route.from}</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-emerald-300" />
                 <div className="flex flex-col text-right">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">To</span>
                   <span className="font-bold text-slate-800">{route.to}</span>
                 </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
