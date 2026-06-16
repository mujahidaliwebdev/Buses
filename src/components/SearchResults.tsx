import React, { useState, useMemo } from 'react';
import { Bus } from '../types';
import { Clock, Phone, Snowflake, Sun, ShieldCheck, ArrowRight, X, Filter, SlidersHorizontal, ChevronDown, ArrowUpDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';


interface SearchResultsProps {
  buses: Bus[];
  origin: string;
  destination: string;
  onClose: () => void;
  onSelectBus: (bus: Bus) => void;
  onAddRoute: () => void;
}

type SortOption = 'cheapest' | 'earliest';

export default function SearchResults({ buses, origin, destination, onClose, onSelectBus, onAddRoute }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('cheapest');
  const [maxFare, setMaxFare] = useState<number>(2000);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  // کمپونینٹ کے اندر سٹیٹ شامل کی گئی:
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Get unique companies for filtering
  const companies = useMemo(() => {
    const unique = new Set(buses.map(b => b.companyName));
    return Array.from(unique).sort();
  }, [buses]);

  // Helper to convert AM/PM time to minutes for sorting
  const timeToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return hours * 60 + minutes;
  };

  const filteredAndSortedBuses = useMemo(() => {
    let result = [...buses];

    // Filter by fare
    result = result.filter(bus => bus.fare <= maxFare);

    // Filter by company
    if (selectedCompanies.length > 0) {
      result = result.filter(bus => selectedCompanies.includes(bus.companyName));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.fare - b.fare;
      } else {
        return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
      }
    });

    return result;
  }, [buses, sortBy, maxFare, selectedCompanies]);

  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company) 
        : [...prev, company]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={onClose}
                  className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                  {origin} 
                  <ArrowRight className="w-5 h-5 text-emerald-500" /> 
                  {destination}
                </h1>
              </div>
              <p className="text-slate-500 font-medium">
                We found <span className="text-emerald-600 font-bold">{filteredAndSortedBuses.length}</span> available buses for your journey
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
  {/* یہ بٹن فلٹرز کے بغل میں امپلیمنٹ کیا گیا */}
  <button 
    onClick={() => setIsShareOpen(true)}
    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 hover:text-emerald-600 border border-slate-200 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer duration-75"
  >
    <Share2 className="w-4 h-4 text-emerald-600" />
    Share Route
  </button>


              
              {/* Sort Dropdown */}
              <div className="relative group flex-grow md:flex-grow-0">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort by: {sortBy === 'cheapest' ? 'Cheapest' : 'Earliest'}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button 
                    onClick={() => setSortBy('cheapest')}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium ${sortBy === 'cheapest' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'}`}
                  >
                    Cheapest
                  </button>
                  <button 
                    onClick={() => setSortBy('earliest')}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium ${sortBy === 'earliest' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'}`}
                  >
                    Earliest Departure
                  </button>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar / Mobile Filters */}
          <div className={`${showFiltersMobile ? 'block' : 'hidden'} md:block lg:col-span-1 space-y-6`}>
            {/* Fare Filter */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-800">Refine Search</h3>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Max Fare</span>
                  <span className="text-emerald-600 font-bold">Rs. {maxFare}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="50"
                  value={maxFare}
                  onChange={(e) => setMaxFare(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                  <span>RS. 500</span>
                  <span>RS. 5000+</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-4">Bus Companies</span>
                <div className="space-y-3">
                  {companies.map(company => (
                    <label key={company} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCompanies.includes(company)}
                        onChange={() => toggleCompany(company)}
                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        {company}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setMaxFare(5000);
                  setSelectedCompanies([]);
                }}
                className="w-full mt-8 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors underline uppercase tracking-widest"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Results Column */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedBuses.length > 0 ? (
                filteredAndSortedBuses.map((bus, idx) => (
                  <motion.div 
                    layout
                    key={bus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onSelectBus(bus)}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Block: Bus Info & Times */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <h4 className="text-xl font-bold text-slate-900">{bus.companyName}</h4>
                          <div className="flex gap-2">
                             {bus.isAC ? (
                               <span className="flex items-center gap-1 text-[10px] bg-sky-50 text-sky-600 px-2 py-1 rounded-lg font-bold uppercase tracking-wider border border-sky-100">
                                 <Snowflake className="w-3 h-3" /> AC
                               </span>
                             ) : (
                               <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-bold uppercase tracking-wider border border-amber-100">
                                 <Sun className="w-3 h-3" /> Non-AC
                               </span>
                             )}
                             <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                               {bus.type}
                             </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Departure</p>
                            <p className="text-2xl font-black text-slate-800">{bus.departureTime}</p>
                            <p className="text-xs font-medium text-slate-500">{origin}</p>
                          </div>

                          <div className="flex flex-col items-center">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{bus.duration}</p>
                            <div className="w-full flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-slate-200" />
                              <div className="flex-grow h-px bg-slate-100 border-t-2 border-dashed border-slate-200" />
                              <ArrowRight className="w-4 h-4 text-slate-300" />
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Direct Trip</p>
                          </div>

                          <div className="sm:text-right space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival</p>
                            <p className="text-2xl font-bold text-slate-700">{bus.arrivalTime}</p>
                            <p className="text-xs font-medium text-slate-500">{destination}</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Vehicle: <span className="text-slate-600">{bus.busNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                            Contact: <span className="text-slate-600">{bus.contactNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Fare & Action */}
                      <div className="shrink-0 lg:w-56 bg-slate-50/50 p-6 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fare</p>
                        <div className="flex items-baseline justify-center gap-1 mb-6">
                          <span className="text-sm font-bold text-slate-400">Rs.</span>
                          <span className="text-4xl font-black text-emerald-700 tracking-tight">{bus.fare}</span>
                        </div>
                        
                        <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all active:scale-95 group-hover:-translate-y-1">
                          <Phone className="w-4 h-4" />
                          Book Ticket
                        </button>
                        <p className="text-[8px] text-slate-400 mt-3 font-medium">Verified by Operator</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-20 text-center border border-slate-200"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <ShieldCheck className="w-12 h-12 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No results matching your filters</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Try adjusting your fare range or clearing the company filters to find more options.
                  </p>
                  <button 
                    onClick={onAddRoute}
                    className="mt-8 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
                  >
                    Reset Filters Or Suggest Route
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredAndSortedBuses.length > 0 && (
              <div className="mt-12 text-center p-8 bg-slate-100 rounded-[2rem] border border-dashed border-slate-300">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Can't find your bus?</p>
                <button 
                  onClick={onAddRoute}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-black text-sm uppercase tracking-widest transition-colors"
                >
                  <Plus className="w-4 h-4" /> Suggest a missing route
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
        {/* سرچ رزلٹس کمپونینٹ کے بالکل آخر میں */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        origin={origin}
        destination={destination}
      />
    </div>
  );
}

