import React from 'react';
import { MapPin, Calendar, Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { SearchFilters } from '../types';
import SearchableDropdown from './SearchableDropdown';

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
  onAddRoute?: () => void;
}

export default function Hero({ onSearch, onAddRoute }: HeroProps) {
  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSearch({
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      date: formData.get('date') as string,
    });
  };

  return (
    <div className="relative">
      <section id="hero" className="relative h-[650px] sm:h-[600px] flex items-center overflow-hidden bg-emerald-950">
        {/* Background with Pakistani Bus Image */}
        <div className="absolute inset-0 z-0 bg-emerald-900">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069"
            alt="Travel Across Pakistan"
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-transparent to-emerald-900/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="px-3 py-1 bg-emerald-800/50 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-emerald-700">
              Pakistan's #1 Non-AC Bus Platform
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
          >
            Verified Non-AC Bus Timings & Fares
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-emerald-100/70 max-w-2xl mb-12"
          >
            We list only verified scheduled non-AC buses with fixed routes and reliable timings.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearchClick}
            className="w-full bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10 flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest text-left">Origin City</label>
              <SearchableDropdown
                name="origin"
                placeholder="Select Origin City"
                options={PAKISTAN_CITIES}
                required
              />
            </div>

            <div className="flex-1 w-full text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest text-left">Destination</label>
              <SearchableDropdown
                name="destination"
                placeholder="Select Destination"
                options={PAKISTAN_CITIES}
                required
              />
            </div>

            <div className="w-full md:w-52 text-left">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest text-left">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input 
                  type="date" 
                  name="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-14 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>SEARCH</span>
            </button>
          </motion.form>
        </div>

        {/* Company Marquee - Moved outside max-w-5xl and adjusted */}
        <div className="absolute bottom-14 left-0 w-full bg-black/60 backdrop-blur-lg border-y border-white/5 py-5 overflow-hidden z-20">
          <div className="flex whitespace-nowrap">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="flex gap-20 items-center px-10"
            >
              {[
                'BALOCH TRANSPORT', 'CHEEMA BROTHERS', 'MIAN SONS', 'NEW KHAN', 'WAHLA BROS', 'AL-REHMAN', 'WARAICH EXPRESS', 'NEW HABIB KHAN',
                'BALOCH TRANSPORT', 'CHEEMA BROTHERS', 'MIAN SONS', 'NEW KHAN', 'WAHLA BROS', 'AL-REHMAN', 'WARAICH EXPRESS', 'NEW HABIB KHAN',
                'BALOCH TRANSPORT', 'CHEEMA BROTHERS', 'MIAN SONS', 'NEW KHAN', 'WAHLA BROS', 'AL-REHMAN', 'WARAICH EXPRESS', 'NEW HABIB KHAN',
                'BALOCH TRANSPORT', 'CHEEMA BROTHERS', 'MIAN SONS', 'NEW KHAN', 'WAHLA BROS', 'AL-REHMAN', 'WARAICH EXPRESS', 'NEW HABIB KHAN'
              ].map((name, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]" />
                  <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em]">{name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating contribution pill, overlapping perfectly at the bottom */}
      {onAddRoute && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: "-50%" }}
          animate={{ opacity: 1, y: 12, x: "-50%" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute left-1/2 bottom-0 z-30"
        >
          <button
            onClick={onAddRoute}
            className="flex items-center gap-2 px-6 py-3 bg-[#022c22] hover:bg-[#064e3b] text-[#34d399] hover:text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-[0_4px_20px_rgba(4,120,87,0.4)] border border-emerald-500/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Missing a route? Add it here</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
