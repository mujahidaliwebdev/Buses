import { BusFront, User, LogOut, Menu, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, logout } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import UserProfileModal from './UserProfileModal';

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
  onDownloadAppClick?: () => void;
}

// Helper to get the correct path to the logo in any hosting environment
const getLogoPath = () => {
  return 'https://lh3.googleusercontent.com/d/1BLe_EDy4yCALfwQpgnUDQPoKSyKdECrq';
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
  activeTab,
  onDownloadAppClick
}: NavbarProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  // Sync state if user logs out or changes
  const handleProfileUpdated = () => {
    if (auth.currentUser) {
      setUser({ ...auth.currentUser });
    }
  };

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
            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className={`${activeTab === 'admin' ? 'text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl' : 'hover:text-emerald-600'} transition-all cursor-pointer outline-none`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Download App Action Button */}
            {onDownloadAppClick && (
              <button
                onClick={onDownloadAppClick}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 border border-emerald-200/60 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">App Download</span>
                <span className="sm:hidden">App</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="hidden sm:flex flex-col items-end cursor-pointer"
                >
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] leading-none mb-1 select-none">Welcome</span>
                  <span className="text-sm font-black text-slate-900 leading-none">{user.displayName?.split(' ')[0] || 'User'}</span>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-lg border-2 border-emerald-50 cursor-pointer shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all outline-none overflow-hidden"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>{user.displayName?.[0] || 'M'}</span>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      {/* Invisible full screen overlay to close menu on outside click */}
                      <div 
                        className="fixed inset-0 z-30 bg-transparent cursor-default" 
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      
                      <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 py-2 overflow-hidden text-left animate-in slide-in-from-top-2 duration-150">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                          <p className="text-xs font-black text-slate-800 truncate">{user.displayName || 'AsaanSafar User'}</p>
                          <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setShowProfileModal(true);
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-2 transition-all"
                        >
                          <User className="w-4 h-4 text-emerald-600" /> My Profile
                        </button>
                        
                        <button 
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-rose-50 border-t border-slate-50 text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-2 transition-all"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-emerald-950 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-emerald-800 shadow-xl shadow-emerald-950/20 transition-all active:scale-95 flex items-center gap-2 sm:gap-3 animate-in fade-in duration-250"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Sign In
              </button>
            )}

            {/* Mobile Menu Button / Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2.5 text-xs font-black uppercase tracking-widest text-slate-500">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onHomeClick?.();
                }} 
                className={`w-full text-left py-3 px-4 rounded-xl transition-all ${activeTab === 'home' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'}`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRoutesClick?.();
                }} 
                className={`w-full text-left py-3 px-4 rounded-xl transition-all ${activeTab === 'routes' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'}`}
              >
                Popular Routes
              </button>
              {onDownloadAppClick && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onDownloadAppClick();
                  }} 
                  className="w-full text-left py-3 px-4 rounded-xl transition-all text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Android App (.APK)</span>
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAdminClick?.();
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl transition-all ${activeTab === 'admin' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'}`}
                >
                  Admin Panel
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <UserProfileModal 
            onClose={() => setShowProfileModal(false)} 
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
