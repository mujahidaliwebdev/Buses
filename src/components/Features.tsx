import { Zap, ShieldCheck, PhoneCall, Map, Search, Check, MessageCircle, Phone } from 'lucide-react';

const WHY_US = [
  {
    title: "Verified Fares",
    desc: "Latest rates for local Non-AC and economy bus operators."
  },
  {
    title: "Real-time Timings",
    desc: "Accurate departure and arrival schedules for 50+ cities."
  },
  {
    title: "Direct Contact",
    desc: "Instant access to terminal help desk phone numbers."
  },
  {
    title: "Non-AC Platform",
    desc: "Specifically built for affordable and local bus travel."
  }
];

export default function Features() {
  const supportNumber = "03014321122";
  const displayMobile = "0301-432-1122";

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-emerald-950 mb-4">Digitizing Pakistan's Roadways</h2>
                  <p className="text-emerald-700/80 leading-relaxed max-w-2xl mb-8">
                    AsaanBusSafar is on a mission to bring full transparency to Non-AC bus travel. We bridge the gap between rural terminals and smart commuters by providing high-quality, verified data.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-4xl font-black text-emerald-700">50+</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cities Covered</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-4xl font-black text-emerald-700">1200+</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Buses Daily</span>
                     </div>
                  </div>
                </div>
                <Zap className="absolute top-8 right-8 w-12 h-12 text-emerald-400/20 group-hover:scale-125 transition-transform" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden relative group">
                   <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-emerald-900/0 transition-colors" />
                   <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 lowercase tracking-widest">#modern_travel</div>
                </div>
                <div className="h-64 bg-emerald-100 rounded-2xl overflow-hidden relative group">
                   <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/0 transition-colors" />
                   <div className="absolute top-4 left-4 text-xs font-bold text-emerald-700/60 lowercase tracking-widest">#lahore_to_karachi</div>
                </div>
             </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-3">Why AsaanBusSafar?</h3>
                <ul className="space-y-6">
                   {WHY_US.map((item, idx) => (
                     <li key={idx} className="flex gap-4">
                        <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center shrink-0 mt-0.5">
                           <Check className="w-4 h-4 stroke-[3px]" />
                        </div>
                        <div>
                           <span className="block font-bold text-sm text-slate-800">{item.title}</span>
                           <span className="text-xs text-slate-400 mt-1 block leading-relaxed">{item.desc}</span>
                        </div>
                     </li>
                   ))}
                </ul>
            </div>
            
            <div className="bg-emerald-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl rounded-full -mr-16 -mt-16" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center border border-emerald-800/50">
                      <PhoneCall className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest leading-none block mb-1">Customer Support</span>
                      <span className="text-lg font-black text-white">{displayMobile}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={`tel:${supportNumber}`}
                      className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-emerald-50 text-emerald-950 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-black/20"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      CALL NOW
                    </a>
                    <a 
                      href={`https://wa.me/92${supportNumber.substring(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-[#25D366]/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WHATSAPP
                    </a>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

