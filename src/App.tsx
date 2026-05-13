/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Bus as BusIcon, Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularRoutes from './components/PopularRoutes';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import BusDetails from './components/BusDetails';
import CompanyProfile from './components/CompanyProfile';
import AdminDashboard from './components/AdminDashboard';
import SubmitRoute from './components/SubmitRoute';
import AboutUs from './components/AboutUs';
import ServicePolicy from './components/ServicePolicy';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import Disclaimer from './components/Disclaimer';
import AuthModal from './components/AuthModal';
import { Bus, SearchFilters, Company } from './types';
import { MOCK_BUSES } from './data/mockBuses';
import { MOCK_COMPANIES } from './data/mockCompanies';
import { auth } from './lib/firebase';
import { busService } from './lib/firestoreService';
import { User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isSubmitView, setIsSubmitView] = useState(false);
  const [isAboutUsView, setIsAboutUsView] = useState(false);
  const [isServicePolicyView, setIsServicePolicyView] = useState(false);
  const [isContactView, setIsContactView] = useState(false);
  const [isPrivacyPolicyView, setIsPrivacyPolicyView] = useState(false);
  const [isTermsView, setIsTermsView] = useState(false);
  const [isDisclaimerView, setIsDisclaimerView] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [searchParams, setSearchParams] = useState<SearchFilters | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    const unsubscribeBuses = busService.subscribeBuses((fetchedBuses) => {
      if (fetchedBuses.length === 0) {
        setBuses(MOCK_BUSES);
      } else {
        setBuses(fetchedBuses);
      }
      setLoadingBuses(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBuses();
    };
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchParams(filters);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = buses.filter(bus => 
        bus.origin.toLowerCase() === filters.origin.toLowerCase() && 
        bus.destination.toLowerCase() === filters.destination.toLowerCase()
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleSelectCompany = (companyName: string) => {
    const company = MOCK_COMPANIES.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const handleHome = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab('home');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handleAboutClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(true);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab('about');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handlePolicyClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(true);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab(''); // No specific tab in navbar for policy
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handleContactClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(true);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab('contact');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handlePrivacyClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(true);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab('');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handleTermsClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(true);
    setIsDisclaimerView(false);
    setActiveTab('');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handleDisclaimerClick = () => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(true);
    setActiveTab('');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    window.scrollTo(0, 0);
  };

  const handleNavClick = (sectionId: string) => {
    setIsAdminView(false);
    setIsSubmitView(false);
    setIsAboutUsView(false);
    setIsServicePolicyView(false);
    setIsContactView(false);
    setIsPrivacyPolicyView(false);
    setIsTermsView(false);
    setIsDisclaimerView(false);
    setActiveTab(sectionId === 'routes' ? 'routes' : 'home');
    setSearchResults(null);
    setSearchParams(null);
    setSelectedBus(null);
    setSelectedCompany(null);
    
    // Allow React to re-render the home components before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRouteClick = (from: string, to: string) => {
    handleSearch({
      origin: from,
      destination: to,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleContributionClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setIsSubmitView(true);
    }
  };

  const isAdmin = user?.email === 'mujahidali.webdev@gmail.com';

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar 
        onLoginClick={() => setShowAuthModal(true)} 
        onAdminClick={() => {
          setIsAdminView(true);
          setActiveTab('admin');
        }}
        onHomeClick={handleHome}
        onAboutClick={handleAboutClick}
        onPolicyClick={handlePolicyClick}
        onContactClick={handleContactClick}
        onSearchClick={() => handleNavClick('hero')}
        onRoutesClick={() => handleNavClick('routes')}
        onFeaturesClick={() => handleNavClick('features')}
        isAdmin={isAdmin}
        activeTab={activeTab}
      />
      
      <main>
        {isAdminView && isAdmin ? (
          <AdminDashboard 
            buses={buses} 
            onClose={() => setIsAdminView(false)} 
          />
        ) : isAboutUsView ? (
          <AboutUs />
        ) : isServicePolicyView ? (
          <ServicePolicy />
        ) : isContactView ? (
          <ContactUs />
        ) : isPrivacyPolicyView ? (
          <PrivacyPolicy />
        ) : isTermsView ? (
          <TermsConditions />
        ) : isDisclaimerView ? (
          <Disclaimer />
        ) : isSubmitView ? (
          <SubmitRoute onClose={() => setIsSubmitView(false)} />
        ) : searchResults && searchParams ? (
          <SearchResults 
            buses={searchResults}
            origin={searchParams.origin}
            destination={searchParams.destination}
            onClose={() => {
              setSearchResults(null);
              window.scrollTo(0, 0);
            }}
            onSelectBus={(bus) => setSelectedBus(bus)}
            onAddRoute={handleContributionClick}
          />
        ) : (
          <>
            <Hero onSearch={handleSearch} />
            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
               <button 
                 onClick={handleContributionClick}
                 className="w-full md:w-auto bg-emerald-950 text-emerald-400 py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 border border-emerald-800 shadow-xl hover:bg-emerald-900 transition-all active:scale-95 mx-auto"
               >
                 <Plus className="w-5 h-5" /> Missing a route? Add it here
               </button>
            </div>
            <PopularRoutes onRouteClick={handleRouteClick} />
            <Features />
            <HowItWorks />
            
            {/* SEO Content or CTA */}
            <section className="py-20 bg-white">
               <div className="max-w-4xl mx-auto px-4 text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">The Future of Bus Travel in Pakistan</h2>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    We are on a mission to digitize every terminal and bus operator in Pakistan. 
                    From the bustling streets of Karachi to the scenic routes of Northern Pakistan, 
                    our platform ensures you have the most accurate data at your fingertips.
                  </p>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsAdminView(true)}
                      className="mt-8 text-xs font-bold text-slate-300 hover:text-emerald-500 transition-colors uppercase tracking-widest"
                    >
                      Operator Login / Dashboard
                    </button>
                  )}
               </div>
            </section>
          </>
        )}
      </main>

      <Footer 
        onHomeClick={handleHome} 
        onAboutClick={handleAboutClick}
        onPolicyClick={handlePolicyClick} 
        onContactClick={handleContactClick}
        onPrivacyClick={handlePrivacyClick}
        onTermsClick={handleTermsClick}
        onDisclaimerClick={handleDisclaimerClick}
        onFeaturesClick={() => handleNavClick('features')}
        onRoutesClick={() => handleNavClick('routes')}
      />

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>

      {/* Bus Details Modal */}
      <AnimatePresence>
        {selectedBus && (
          <BusDetails 
            bus={selectedBus} 
            onClose={() => setSelectedBus(null)} 
            onSelectCompany={handleSelectCompany}
          />
        )}
      </AnimatePresence>

      {/* Company Profile Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <CompanyProfile 
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSearching && (
          <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <p className="text-emerald-900 font-bold tracking-tight">Finding the best buses for you...</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
