import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar } from 'lucide-react';
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

  // Jab search button click ho to filters submit karein
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({ origin, destination, date });
    }
  };

  return (
    <section id="hero" className="relative min-h-[75vh] flex flex-col items-center justify-center pt-20 pb-0 overflow-hidden bg-emerald-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" 
          alt="Bus Background" 
          className="w-full h-full object-cover opacity-70"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-transparent to-emerald-900/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        {/* Topic Badges & Headings */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6 mb-8"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
            Pakistan's #1 Non-AC Bus Platform
          </div>
          <h1 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight uppercase">
            Verified Non-AC Bus Timings & Fares
          </h1>
          <p className="text-sm text-emerald-50/70 max-w-xl mx-auto font-medium">
            We list only verified scheduled non-AC buses with fixed routes and reliable timings.
          </p>
        </motion.div>

        {/* Search Engine Card Form */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-white p-6 rounded-[2.5rem] shadow-2xl max-w-2xl mx-auto border-4 border-white/20 backdrop-blur-sm"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-5 px-1">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              
              {/* Origin Section (Likha bhi jaye ga aur Dropdown list bhi show hogi) */}
              <div className="flex-1 text-left relative">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">From (Origin)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    onFocus={() => setShowOriginSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                    placeholder="Search Origin City"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-extrabold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 text-sm shadow-sm"
                  />
                </div>

                {/* Dynamic Suggestion Dropdown */}
                <AnimatePresence>
                  {showOriginSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
                    >
                      {PAKISTAN_CITIES
                        .filter(c => c.toLowerCase().includes(origin.toLowerCase()))
                        .map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setOrigin(city);
                            setShowOriginSuggestions(false);
                          }}
                          className={`w-full text-left px-4 py-3.5 hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 ${city === origin ? 'bg-emerald-50' : ''}`}
                        >
                          <MapPin className={`w-4 h-4 ${city === origin ? 'text-emerald-600' : 'text-emerald-400'}`} />
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destination Section (Likha bhi jaye ga aur Dropdown list bhi show hogi) */}
              <div className="flex-1 text-left relative">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">To (Destination)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowDestSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                    placeholder="Search Destination"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-extrabold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 text-sm shadow-sm"
                  />
                </div>

                {/* Dynamic Suggestion Dropdown */}
                <AnimatePresence>
                  {showDestSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
                    >
                      {PAKISTAN_CITIES
                        .filter(c => c.toLowerCase().includes(destination.toLowerCase()))
                        .map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setDestination(city);
                            setShowDestSuggestions(false);
                          }}
                          className={`w-full text-left px-4 py-3.5 hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0 ${city === destination ? 'bg-emerald-50' : ''}`}
                        >
                          <MapPin className={`w-4 h-4 ${city === destination ? 'text-emerald-600' : 'text-emerald-400'}`} />
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full">
              {/* Date */}
              <div className="flex-1 text-left">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Travel Date</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-extrabold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm shadow-sm cursor-pointer"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex-1">
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 uppercase text-xs tracking-widest h-full min-h-[58px]"
                >
                  <Search className="w-5 h-5" /> SEARCH BUSES
                </button>
              </div>
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

        {/* Missing Route Button (Do not remove: Important logic flow) */}
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
