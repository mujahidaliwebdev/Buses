import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, ArrowRightLeft, Calendar } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { SearchFilters } from '../types';

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
  onAddRoute: () => void;
}

export default function Hero({ onSearch, onAddRoute }: HeroProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const filteredOrigins = PAKISTAN_CITIES.filter(city => 
    city.toLowerCase().includes(origin.toLowerCase()) && city !== origin
  ).slice(0, 5);

  const filteredDestinations = PAKISTAN_CITIES.filter(city => 
    city.toLowerCase().includes(destination.toLowerCase()) && city !== destination
  ).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({ origin, destination, date });
    }
  };

  const swapCities = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <section id="hero" className="relative min-h-[75vh] flex flex-col items-center justify-center pt-20 pb-0 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" 
          alt="Bus Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6 mb-8"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
            Pakistan's #1 Non-AC Bus Platform
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
            Verified Non-AC Bus Timings & Fares
          </h1>
          <p className="text-sm text-emerald-50/70 max-w-xl mx-auto font-medium">
            We list only verified scheduled non-AC buses with fixed routes and reliable timings.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-white p-5 rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-3 px-1">
            {/* Origin */}
            <div className="flex-1 text-left relative w-full mb-3 md:mb-0">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Origin City</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => setShowOriginSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                  placeholder="Select Origin City"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300 text-xs md:text-sm shadow-sm"
                />
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {showOriginSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden max-h-64 overflow-y-auto"
                  >
                    {PAKISTAN_CITIES
                      .filter(c => c.toLowerCase().includes(origin.toLowerCase()) && c !== origin)
                      .slice(0, 15)
                      .map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setOrigin(city);
                          setShowOriginSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Destination */}
            <div className="flex-1 text-left relative w-full mb-3 md:mb-0">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Destination</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setShowDestSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                  placeholder="Select Destination"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300 text-xs md:text-sm shadow-sm"
                />
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {showDestSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden max-h-64 overflow-y-auto"
                  >
                    {PAKISTAN_CITIES
                      .filter(c => c.toLowerCase().includes(destination.toLowerCase()) && c !== destination)
                      .slice(0, 15)
                      .map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setDestination(city);
                          setShowDestSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Date */}
            <div className="flex-1 text-left w-full mb-3 md:mb-0">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Travel Date</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
                <input 
                  type="date" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs md:text-sm shadow-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto">
              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white font-black px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 uppercase text-[11px] tracking-widest h-[52px] min-w-[160px]"
              >
                <Search className="w-4 h-4" /> SEARCH
              </button>
            </div>
          </form>
        </motion.div>

        {/* Operator Ticker (Marquee) */}
        <div className="mt-20 relative w-full overflow-hidden py-4 border-y border-white/5">
          <div className="flex animate-marquee whitespace-nowrap gap-12 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
             {[...Array(2)].map((_, i) => (
               <React.Fragment key={i}>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> NEW HABIB KHAN
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> BALOCH TRANSPORT
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> NEW KHAN
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> CHEEMA BROTHERS
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> WARAICH EXPRESS
                </span>
               </React.Fragment>
             ))}
          </div>
        </div>

        {/* Missing Route Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button 
            onClick={onAddRoute}
            className="inline-flex items-center gap-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-all group"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform">+</span> Missing a route? Add it here
          </button>
        </motion.div>

      </div>
    </section>
  );
}
