import { motion } from 'motion/react';
import { ShieldCheck, Clock, BusFront, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ServicePolicy() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Header */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> Transit Transparency
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Our <span className="text-emerald-600">Service Policy</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              How we ensure the reliability and accuracy of bus information on AsaanBusSafar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-slate lg:prose-lg">
            <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
              AsaanBusSafar focuses only on verified non-AC bus services operating on fixed schedules across Pakistan.
            </p>

            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 mb-12">
              <h3 className="text-emerald-950 font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> We strictly list buses that:
              </h3>
              <ul className="space-y-4">
                {[
                  "Operate on regular routes",
                  "Follow fixed departure schedules",
                  "Provide predictable arrival timings",
                  "Have identifiable operators or companies",
                  "Offer reliable transportation information"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-emerald-900/80"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mb-4">
                     <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Non-Listed Vehicles</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We currently do not list random local buses, irregular transport vehicles, or unscheduled operators because their timings often vary and may cause inconvenience for passengers.
                  </p>
               </div>
               <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
                     <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Our Mission</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Our mission is to help travelers save time by providing reliable transportation information for scheduled non-AC buses.
                  </p>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-12 text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <BusFront className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Verification Process</h3>
               <p className="text-slate-600 max-w-lg mx-auto">
                 Every route and timing listed on AsaanBusSafar undergoes a verification check through our field data contributors and terminal operators to ensure you don't miss your ride.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
