import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bus as BusIcon, Clock, Phone, MapPin, Tag, ArrowLeft, Share2, Info, Navigation, ShieldCheck } from 'lucide-react';
import { Bus, Company } from '../types';
import { MOCK_BUSES } from '../data/mockBuses';
import { MOCK_COMPANIES } from '../data/mockCompanies';
import { busService } from '../lib/firestoreService';
import BusDetails from './BusDetails';
import CompanyProfile from './CompanyProfile';

export default function RouteSpecificPage() {
  const { slug } = useParams();
  const [routeBuses, setRouteBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Parse slug: "lahore-to-faisalabad-bus-timing"
    // Extract "lahore" and "faisalabad"
    const parts = slug.split('-');
    const toIndex = parts.indexOf('to');
    const busIndex = parts.indexOf('bus');
    
    if (toIndex !== -1 && busIndex !== -1) {
      const parsedOrigin = parts.slice(0, toIndex).join(' ');
      const parsedDestination = parts.slice(toIndex + 1, busIndex).join(' ');
      
      const capitalizedOrigin = parsedOrigin.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const capitalizedDestination = parsedDestination.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      setOrigin(capitalizedOrigin);
      setDestination(capitalizedDestination);

      setLoading(true);
      // Try to fetch from Firestore first, then fallback to mock data
      busService.getBusesByRoute(capitalizedOrigin, capitalizedDestination).then((fetched) => {
        if (fetched.length > 0) {
          setRouteBuses(fetched);
        } else {
          // Fallback to mock data for the demo/current state
          const filtered = MOCK_BUSES.filter(b => 
            b.origin.toLowerCase() === capitalizedOrigin.toLowerCase() && 
            b.destination.toLowerCase() === capitalizedDestination.toLowerCase()
          );
          setRouteBuses(filtered);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const handleSelectCompany = (companyName: string) => {
    const company = MOCK_COMPANIES.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold">Loading route information...</p>
        </div>
      </div>
    );
  }

  const cheapestFare = routeBuses.length > 0 ? Math.min(...routeBuses.map(b => b.fare)) : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Home</Link>
          <span>/</span>
          <Link to="/schedules" className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Schedules</Link>
          <span>/</span>
          <span className="text-slate-900 uppercase tracking-widest">{origin} to {destination}</span>
        </nav>

        {/* Hero Section for SEO Page */}
        <div className="bg-emerald-950 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/50 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-700">
               <ShieldCheck className="w-3.5 h-3.5" /> Verified Fixed Schedule
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              {origin} to {destination} <span className="text-emerald-400">Bus Timings & Fares</span>
            </h1>
            
            <p className="text-emerald-100/70 text-lg max-w-2xl mb-8 leading-relaxed">
              Complete guide for buses from {origin} to {destination}. Find updated departure times, ticket prices, and contact numbers for all major bus companies.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-500/80 uppercase font-black tracking-widest leading-none mb-1">Starting From</div>
                  <div className="text-xl font-black text-white">Rs. {cheapestFare}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-400">
                  <BusIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-500/80 uppercase font-black tracking-widest leading-none mb-1">Total Operators</div>
                  <div className="text-xl font-black text-white">{[...new Set(routeBuses.map(b => b.operator))].length} Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Bus Services</h2>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {routeBuses.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                  <Info className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No buses listed yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">We are continuously updating our database. If you know a bus service on this route, please help the community by adding it.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                  Back to Search
                </Link>
              </div>
            ) : (
              routeBuses.map((bus, i) => (
                <motion.div 
                  key={bus.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedBus(bus)}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <BusIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{bus.operator}</h3>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {bus.type} Service
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-12">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Departure
                        </span>
                        <span className="text-lg font-black text-slate-900">{bus.departureTime}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Ticket Price
                        </span>
                        <span className="text-lg font-black text-emerald-600 tracking-tight">Rs. {bus.fare}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-3">
                      <a 
                        href={`tel:${bus.contactNumber}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                      >
                        <Phone className="w-4 h-4" /> Call Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <aside className="space-y-8">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Navigation className="w-5 h-5 text-emerald-600" /> Route Overview
                </h4>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                         <div className="w-0.5 h-12 border-l-2 border-dashed border-slate-200" />
                         <div className="w-3 h-3 border-2 border-slate-300 bg-white rounded-full" />
                      </div>
                      <div className="flex flex-col justify-between py-0.5">
                         <div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Origin</div>
                            <div className="font-bold text-slate-900">{origin}</div>
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Destination</div>
                            <div className="font-bold text-slate-900">{destination}</div>
                         </div>
                      </div>
                   </div>

                   <ul className="space-y-3 pt-4 border-t border-slate-50">
                      <li className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Route Reliability</span>
                        <span className="text-emerald-600">High (Verified)</span>
                      </li>
                      <li className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Last Updated</span>
                        <span className="text-slate-900">Today</span>
                      </li>
                   </ul>
                </div>
             </div>

             <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-black text-emerald-900 mb-4 leading-tight relative z-10">Save Time, Book Early</h4>
                <p className="text-emerald-700/80 text-xs font-bold leading-relaxed mb-6 relative z-10">We recommend calling the bus operator at least 30 minutes before departure to confirm the seat availability.</p>
                <div className="relative z-10">
                   <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                     Learn More <ArrowLeft className="w-3 h-3 rotate-180" />
                   </button>
                </div>
             </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {selectedBus && (
          <BusDetails 
            bus={selectedBus} 
            onClose={() => setSelectedBus(null)} 
            onSelectCompany={handleSelectCompany}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompany && (
          <CompanyProfile 
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
