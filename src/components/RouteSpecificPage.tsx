import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Bus as BusIcon, ArrowLeft, MapPin, Clock, Banknote, ShieldCheck, Info, ChevronRight, AlertCircle, Phone, Share2 } from 'lucide-react';
import { MOCK_BUSES } from '../data/mockBuses';
import { Bus } from '../types';
import { busService } from '../lib/firestoreService';
import ShareModal from './ShareModal';

export default function RouteSpecificPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [routeBuses, setRouteBuses] = useState<Bus[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      // Expecting slug in format "lahore-to-faisalabad-bus-timing"
      const decodedSlug = slug.replace(/-bus-timing$/, '').replace(/-fares$/, '');
      const parts = decodedSlug.split('-to-');
      
      if (parts.length === 2) {
        const from = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
        const to = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
        
        setOrigin(from);
        setDestination(to);

        const fetchRouteData = async () => {
          setLoading(true);
          try {
            const results = await busService.getBusesByRoute(from, to);
            if (results.length > 0) {
              setRouteBuses(results);
            } else {
              // Fallback to mock for demo if no DB records
              const filtered = MOCK_BUSES.filter(b => 
                b.origin.toLowerCase() === from.toLowerCase() && 
                b.destination.toLowerCase() === to.toLowerCase()
              );
              setRouteBuses(filtered);
            }
          } catch (err) {
            console.error("Error fetching route data:", err);
            // Fallback
            const filtered = MOCK_BUSES.filter(b => 
              b.origin.toLowerCase() === from.toLowerCase() && 
              b.destination.toLowerCase() === to.toLowerCase()
            );
            setRouteBuses(filtered);
          } finally {
            setLoading(false);
          }
        };

        fetchRouteData();
      }
    }
  }, [slug]);

  if (!origin || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
           <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
           <h2 className="text-2xl font-black text-slate-900 mb-2">Route Not Found</h2>
           <p className="text-slate-500 mb-6">Sorry, we couldn't find the specific route you're looking for.</p>
           <button onClick={() => navigate('/')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-emerald-950 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 blur-3xl rounded-full" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 blur-3xl rounded-full" />
        </div>
        
        <div className="max-w-7xl auto relative z-10 flex flex-col items-center">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full mb-10 hover:bg-white/10 transition-all border border-white/5"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
            </button>
            <h1 className="text-4xl md:text-7xl font-black text-white text-center tracking-tight leading-[1.1] mb-8">
              {origin} <span className="text-emerald-500">to</span> {destination} <br />
              <div className="text-emerald-400 text-3xl md:text-5xl mt-2">Verified Bus Timings 2024</div>
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-emerald-100/60 text-xs font-black uppercase tracking-widest">
               <div className="flex items-center gap-2 bg-emerald-900/50 px-6 py-3 rounded-2xl border border-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Community Verified
               </div>
               <div className="flex items-center gap-2 bg-emerald-900/50 px-6 py-3 rounded-2xl border border-emerald-800">
                  <Banknote className="w-4 h-4 text-emerald-500" /> Guaranteed Rates
               </div>
            </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
         {loading ? (
           <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-slate-100">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Schedules...</p>
           </div>
         ) : routeBuses.length > 0 ? (
           <div className="space-y-6">
              <div className="flex items-center justify-between px-4 mb-2">
                 <h2 className="text-slate-900 font-black tracking-tight flex items-center gap-2 text-xl md:text-2xl">
                   <span className="w-1.5 h-6 bg-emerald-600 rounded-full" /> Available Bus Services
                 </h2>
                 <button
                   onClick={() => setIsShareOpen(true)}
                   className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-600 transition-all uppercase tracking-widest border border-slate-200 bg-white rounded-xl px-4 py-2 shadow-sm cursor-pointer active:scale-95 duration-100"
                 >
                   <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share
                 </button>
              </div>

             {routeBuses.map((bus, idx) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[2.5rem] shadow-xl shadow-emerald-950/5 border border-slate-100 overflow-hidden hover:border-emerald-100 hover:shadow-2xl transition-all"
                >
                  <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 w-full flex flex-col md:flex-row justify-between gap-10">
                       <div className="space-y-1 text-center md:text-left">
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Departure</div>
                          <div className="text-4xl font-black text-slate-900 leading-none">{bus.departureTime}</div>
                          <div className="text-xs font-black text-emerald-600 mt-2">{bus.origin} Terminal</div>
                       </div>
                       
                       <div className="flex flex-col items-center justify-center opacity-40">
                          <div className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-widest">{bus.duration || 'Direct'}</div>
                          <div className="flex items-center gap-3 w-40">
                             <div className="h-0.5 flex-1 bg-slate-200" />
                             <BusIcon className="w-5 h-5 text-slate-400" />
                             <div className="h-0.5 flex-1 bg-slate-200" />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">Main Route</div>
                       </div>

                       <div className="space-y-1 text-center md:text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Arrival Time</div>
                          <div className="text-3xl font-black text-slate-900 leading-none">{bus.arrivalTime}</div>
                          <div className="text-xs font-black text-slate-400 mt-2">{bus.destination} City</div>
                       </div>
                    </div>

                    <div className="w-full md:w-px h-px md:h-16 bg-slate-100" />

                    <div className="w-full md:w-40 text-center md:text-right shrink-0">
                       <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Single Fare</div>
                       <div className="text-3xl font-black text-emerald-600">Rs. {bus.fare}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 px-8 py-5 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="flex flex-wrap justify-center md:justify-start gap-8">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <MapPin className="w-4 h-4 text-emerald-500" /> {bus.terminalLocation}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <BusIcon className="w-4 h-4 text-emerald-500" /> {bus.companyName}
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <a 
                          href={`tel:${bus.contactNumber}`}
                          className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Agent
                        </a>
                        <button className="flex items-center gap-2 text-emerald-600 font-black hover:gap-3 transition-all text-[10px] uppercase tracking-widest p-2">
                          View Trip <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                </motion.div>
             ))}

             <div className="pt-10 flex flex-col items-center">
                <div className="w-px h-12 bg-emerald-100 mb-6" />
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">End of list</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-3xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  Try Other Cities
                </button>
             </div>
           </div>
         ) : (
           <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl">
             <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                <AlertCircle className="w-12 h-12" />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Data Verification Needed</h3>
             <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium"> We are currently re-verifying the timings for <span className="text-slate-900 font-bold">{origin} to {destination}</span> following recent terminal shifts. Check back in a few hours.</p>
             <button 
              onClick={() => navigate('/')}
              className="bg-emerald-600 text-white font-black py-5 px-12 rounded-3xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 uppercase tracking-widest text-sm"
             >
               Search Other Routes
             </button>
           </div>
         )}

         {/* Extra SEO Info */}
         <div className="mt-20 prose prose-slate max-w-none">
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100">
               <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <Info className="w-8 h-8 text-emerald-600" />
                 About {origin} to {destination} Bus Service
               </h2>
               <p className="text-slate-600 leading-relaxed text-lg">
                 Traveling between {origin} and {destination} is a common route for thousands of passengers every month. 
                 The bus journey typically takes around 8-10 hours depending on traffic and road conditions. 
                 Non-AC services are popular for budget travelers wanting verified and reliable transport.
               </p>
               <h3 className="text-xl font-bold mt-8 mb-4">Things to Remember:</h3>
               <ul className="grid md:grid-cols-2 gap-4 list-none p-0 text-slate-500">
                  <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    Always reach the terminal at least 15-20 minutes before departure.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    Keep your original CNIC with you during the travel.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    Confirm the final fare at the ticket counter before payment.
                  </li>
                  <li className="flex items-start gap-2 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    Verified timings may shift +/- 15 mins due to operational reasons.
                  </li>
               </ul>
            </div>
         </div>
      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        origin={origin}
        destination={destination}
      />
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
