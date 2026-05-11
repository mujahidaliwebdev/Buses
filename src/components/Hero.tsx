import React from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { SearchFilters } from '../types';

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function Hero({ onSearch }: HeroProps) {
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
    <section id="hero" className="relative bg-emerald-900 overflow-hidden py-24 sm:py-32">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
        >
          Travel Across <span className="text-emerald-400">Pakistan</span> <br className="hidden sm:block" /> with Ease
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-emerald-100/80 max-w-2xl mb-12"
        >
          Discover real-time bus timings, verified fares, and book your journey across 50+ cities in Pakistan. No more waiting at terminals.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearchClick}
          className="w-full max-w-5xl bg-white p-2 sm:p-4 rounded-2xl shadow-2xl shadow-emerald-950/20 grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4 items-center"
        >
          <div className="relative">
            <label className="absolute left-4 top-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Origin</label>
            <div className="flex items-center pl-4 pr-3 pt-6 pb-2">
              <MapPin className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
              <select name="origin" required className="w-full bg-transparent text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer">
                <option value="">Select City</option>
                {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-100" />

          <div className="relative">
            <label className="absolute left-4 top-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination</label>
            <div className="flex items-center pl-4 pr-3 pt-6 pb-2">
              <MapPin className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
              <select name="destination" required className="w-full bg-transparent text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer">
                <option value="">Select City</option>
                {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-100" />

          <div className="relative">
            <label className="absolute left-4 top-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travel Date</label>
            <div className="flex items-center pl-4 pr-3 pt-6 pb-2">
              <Calendar className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
              <input 
                type="date" 
                name="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Search Buses</span>
          </button>
        </motion.form>
      </div>
    </section>
  );
}
