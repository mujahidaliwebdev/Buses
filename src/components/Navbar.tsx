import { BusFront, Phone, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav id="navbar" className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-700/20">
              <BusFront className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-emerald-950">
              Chalo<span className="text-emerald-600">Bus</span>
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#" className="text-emerald-700 hover:text-emerald-800 transition-colors">Search Buses</a>
            <a href="#routes" className="hover:text-emerald-600 transition-colors">Popular Routes</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Support</span>
              <span className="text-sm font-bold text-slate-700">0800-CHALO-PK</span>
            </div>
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
