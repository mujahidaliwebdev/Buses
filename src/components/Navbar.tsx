import { BusFront, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, logout } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  onLoginClick: () => void;
  onAdminClick?: () => void;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
  onSearchClick?: () => void;
  onRoutesClick?: () => void;
  onFeaturesClick?: () => void;
  isAdmin?: boolean;
}

export default function Navbar({ 
  onLoginClick, 
  onAdminClick, 
  onHomeClick, 
  onAboutClick,
  onSearchClick,
  onRoutesClick,
  onFeaturesClick,
  isAdmin 
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
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-700/20">
              <BusFront className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-emerald-950">
              AsaanBus<span className="text-emerald-600">Safar</span>
            </span>
          </motion.button>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <button onClick={onSearchClick} className="text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer outline-none">Search Buses</button>
            <button onClick={onRoutesClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">Popular Routes</button>
            <button onClick={onAboutClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">About Us</button>
            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className="text-emerald-600 hover:text-emerald-800 transition-colors font-bold flex items-center gap-1 outline-none"
              >
                Admin Panel
              </button>
            )}
            <button onClick={onFeaturesClick} className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">Features</button>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mb-1">Welcome</span>
                  <span className="text-sm font-bold text-slate-700 leading-none">{user.displayName?.split(' ')[0]}</span>
                </div>
                <div className="relative group">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-100 cursor-pointer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-100 cursor-pointer">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-2">
                    {isAdmin && (
                      <button 
                        onClick={onAdminClick}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-bold text-emerald-600 flex items-center gap-2 border-b border-slate-50 mb-1"
                      >
                        <BusFront className="w-4 h-4" /> Admin Console
                      </button>
                    )}
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-700/20 transition-all active:scale-95 flex items-center gap-2"
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
