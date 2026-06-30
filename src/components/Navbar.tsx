import { BusFront, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, logout } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  onLoginClick: () => void;
  onAdminClick?: () => void;
  onHomeClick?: () => void;
  onPolicyClick?: () => void;
  onSearchClick?: () => void;
  onRoutesClick?: () => void;
  onFeaturesClick?: () => void;
  isAdmin?: boolean;
  activeTab?: string;
}

// Helper to get the correct path to the logo in any hosting environment
const getLogoPath = () => {
  return 'https://lh3.googleusercontent.com/d/1UPQLOT36JqVoCfmWfj7g9b3THwPvT21R';
};

export default function Navbar({ 
  onLoginClick, 
  onAdminClick, 
  onHomeClick, 
  onPolicyClick,
  onSearchClick,
  onRoutesClick,
  onFeaturesClick,
  isAdmin,
  activeTab
}: NavbarProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  return (
    <nav id="navbar" className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onHomeClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-emerald-700/10 border border-slate-100">
              <img 
                src={getLogoPath()} 
                alt="AsaanSafar Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Asaan<span className="text-emerald-600">Safar</span>
            </span>
          </motion.button>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
            <button 
              onClick={onHomeClick} 
              className={`${activeTab === 'home' ? 'text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl' : 'hover:text-emerald-700'} transition-all cursor-pointer outline-none`}
            >
              Home
            </button>
            <button 
              onClick={onRoutesClick} 
              className={`${activeTab === 'routes' ? 'text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl' : 'hover:text-emerald-600'} transition-all cursor-pointer outline-none`}
            >
              Popular Routes
            </button>
            <button 
              onClick={onAdminClick}
              className={`${activeTab === 'admin' ? 'text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl' : 'hover:text-emerald-600'} transition-all cursor-pointer outline-none`}
            >
              Admin Panel
            </button>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] leading-none mb-1">Welcome</span>
                  <span className="text-sm font-black text-slate-900 leading-none">{user.displayName?.split(' ')[0] || 'Mujahid'}</span>
                </div>
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-lg border-2 border-emerald-50 cursor-pointer shadow-lg shadow-emerald-600/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.displayName?.[0] || 'M'}</span>
                    )}
                  </div>
                  <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-2 overflow-hidden">
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-5 py-3 hover:bg-rose-50 text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-emerald-950 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-800 shadow-xl shadow-emerald-950/20 transition-all active:scale-95 flex items-center gap-3"
              >
                <User className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
