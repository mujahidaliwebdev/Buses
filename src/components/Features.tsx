import { Zap, ShieldCheck, PhoneCall, Map, Search, Check } from 'lucide-react';

const WHY_US = [
  {
    title: "Verified Fares",
    desc: "Latest rates for Daewoo, Faisal Movers, and local operators."
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
    title: "AC/Non-AC Options",
    desc: "Compare luxury and economy services side-by-side."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-emerald-950 mb-4">Digitizing Pakistan's Roadways</h2>
                  <p className="text-emerald-700/80 leading-relaxed max-w-2xl mb-8">
                    ChaloBus is on a mission to bring full transparency to bus travel. We bridge the gap between rural terminals and smart commuters by providing high-quality, verified data.
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
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-3">Why ChaloBus?</h3>
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
            
            <div className="bg-emerald-950 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1">Customer Support</span>
                  <span className="text-lg font-bold">0800-CHALO-PK</span>
               </div>
               <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-emerald-400 text-lg">
                  📞
               </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
