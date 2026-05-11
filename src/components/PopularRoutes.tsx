import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_ROUTES } from '../data/mockBuses';

export default function PopularRoutes() {
  return (
    <section id="routes" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Popular Routes</h2>
          <p className="text-slate-500 mt-2">Connecting major transport hubs with frequent services.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, idx) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-800">{route.to}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="text-sm text-slate-500 font-medium">{route.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
