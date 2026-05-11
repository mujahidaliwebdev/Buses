import { BusFront, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <BusFront className="w-7 h-7 text-emerald-500" />
              <span className="text-xl font-bold tracking-tight text-white">
                ChaloBus
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Making bus travel in Pakistan information-rich and accessible. Find, compare, and travel better.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Find Buses</a></li>
              <li><a href="#routes" className="hover:text-white transition-colors">Popular Routes</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Help & Support</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>support@chalobus.pk</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+92 (300) 1234567</span>
              </div>
              <div className="pt-4">
                <p className="text-xs italic">Available 24/7 for traveling emergencies across Pakistan.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 ChaloBus Pakistan. All rights reserved.</p>
          <div className="flex gap-6">
             <span>Proudly Pakistani 🇵🇰</span>
             <span>Verified Information</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
