import { motion } from 'motion/react';
import { BusFront, Target, Users, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-950 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--color-emerald-700),_transparent_70%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Our Journey to <span className="text-emerald-400">Digitize</span> Pakistan's Roadways
            </h1>
            <p className="text-lg leading-8 text-emerald-100/70">
              ChaloBus is Pakistan's first data-driven bus terminal information platform. We bridge the gap between rural terminals and smart commuters by providing high-quality, verified data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-emerald-950 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We believe that travel information should be accessible to everyone, everywhere. Our mission is to categorize, verify, and digitize every bus route and terminal in Pakistan, bringing transparency to an industry that has long been underserved by technology.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Target, title: "Data Transparency", desc: "No more hidden fares or uncertain timings." },
                  { icon: ShieldCheck, title: "Verified Operators", desc: "We only list data from trusted, verified bus operators." },
                  { icon: BusFront, title: "Nationwide Coverage", desc: "From Karachi to Gilgit, we're expanding every day." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-950">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
               <img 
                 src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
                 alt="Bus Terminal"
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-emerald-900/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Cities", value: "50+" },
              { label: "Operators", value: "100+" },
              { label: "Daily Routes", value: "1200+" },
              { label: "Monthly Users", value: "10k+" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-4xl font-black text-emerald-700">{stat.value}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
