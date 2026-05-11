import { Zap, ShieldCheck, PhoneCall, Map, Search } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Zap,
    title: "Real-time Timings",
    description: "Always updated departure and arrival times for all major bus companies."
  },
  {
    icon: ShieldCheck,
    title: "Verified Fares",
    description: "Official ticket prices sourced directly from terminal operators."
  },
  {
    icon: PhoneCall,
    title: "Instant Contact",
    description: "Get direct phone numbers of bus terminals and help desks."
  },
  {
    icon: Map,
    title: "Route Details",
    description: "In-depth info about stops, duration, and road conditions."
  },
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Filter by AC/Non-AC, luxury type, or specific bus companies."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Why Travelers Choose <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">ChaloBus</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We bridges the gap between passengers and bus terminals by providing verified, real-time information that saves you time and stress.
            </p>
            <div className="flex flex-col gap-8">
              {FEATURES.slice(0, 3).map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
             {/* Mock visual placeholder */}
            <div className="space-y-4 pt-12">
              <div className="aspect-[4/5] bg-emerald-100 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/0 transition-colors" />
                <div className="absolute bottom-4 left-4 text-emerald-800 text-xs font-bold uppercase tracking-widest">Lahore Terminal</div>
              </div>
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-900/5" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square bg-amber-50 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-900/5" />
              </div>
              <div className="aspect-[4/5] bg-emerald-50 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-900/5" />
                <div className="absolute bottom-4 left-4 text-emerald-800 text-xs font-bold uppercase tracking-widest">Express Highway</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
