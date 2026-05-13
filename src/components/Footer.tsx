import { BusFront, Facebook, Twitter, Instagram, Mail, Phone, Globe } from 'lucide-react';

interface FooterProps {
  onHomeClick?: () => void;
  onPolicyClick?: () => void;
  onContactClick?: () => void;
  onPrivacyClick?: () => void;
}

export default function Footer({ onHomeClick, onPolicyClick, onContactClick, onPrivacyClick }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <button 
              onClick={onHomeClick}
              className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity outline-none"
            >
              <BusFront className="w-7 h-7 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight text-emerald-950">
                AsaanBusSafar
              </span>
            </button>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 max-w-xs">
              Pakistan's first data-driven bus terminal information platform. Bringing transparency to your digital travel journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100 hover:border-emerald-100"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100 hover:border-emerald-100"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100 hover:border-emerald-100"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
             <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-6">Discovery</h4>
            <ul className="space-y-4 text-xs font-bold text-slate-600">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Search Route</a></li>
              <li><a href="#routes" className="hover:text-emerald-600 transition-colors">Route Maps</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terminal Locations</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Bus Operators</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-6">Legal</h4>
            <ul className="space-y-4 text-xs font-bold text-slate-600">
              <li><button onClick={onPolicyClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">Service Policy</button></li>
              <li><button onClick={onContactClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">Contact Us</button></li>
              <li><button onClick={onPrivacyClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">Privacy Policy</button></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-6">Service Area</h4>
            <div className="flex flex-wrap gap-2">
               {['Lahore', 'Karachi', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta'].map(c => (
                 <span key={c} className="px-2 py-1 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase tracking-wider">{c}</span>
               ))}
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-700">
               <Globe className="w-4 h-4 text-emerald-600" />
               <span>Available Nationwide</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 AsaanBusSafar PK • Built for Pakistan 🇵🇰</p>
          <div className="flex gap-4">
             <span className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-widest leading-none">Verified Schedules</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
