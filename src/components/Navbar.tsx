import { BusFront, Phone, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav id="navbar" className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <BusFront className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Chalo<span className="text-emerald-600">Bus</span>
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-emerald-600 transition-colors">Home</a>
            <a href="#routes" className="hover:text-emerald-600 transition-colors">Popular Routes</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>Need Help? 042-111-CHALO</span>
            </div>
            <button className="md:hidden p-2 text-slate-600 hover:text-emerald-600">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
