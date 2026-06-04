/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pakistan's #1 Data-Driven Non-AC Bus Information Platform
import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Bus as BusIcon, Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularRoutes from './components/PopularRoutes';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BlogSection from './components/BlogSection';
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
import Blog from './components/Blog';
import BlogPostDetail from './components/BlogPostDetail';
import Schedules from './components/Schedules';
import RouteSpecificPage from './components/RouteSpecificPage';
import AuthModal from './components/AuthModal';
import Careers from './components/Careers';
import FeedbackSystem from './components/FeedbackSystem';
import NoticePopup from './components/NoticePopup';
import { Bus, SearchFilters, Company } from './types';
import { MOCK_BUSES } from './data/mockBuses';
import { MOCK_COMPANIES } from './data/mockCompanies';
import { auth } from './lib/firebase';
import { busService } from './lib/firestoreService';
import { User as FirebaseUser } from 'firebase/auth';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [searchParams, setSearchParams] = useState<SearchFilters | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitView, setIsSubmitView] = useState(false);

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

  // Sync scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      navigate('/'); // Go back to top level to show search results if they were on another page
    }, 800);
  };

  const handleSelectCompany = (companyName: string) => {
    const company = MOCK_COMPANIES.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const handleContributionClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setIsSubmitView(true);
    }
  };

  const isAdmin = user?.email === 'mujahidali.webdev@gmail.com';

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar 
        onLoginClick={() => setShowAuthModal(true)} 
        onAdminClick={() => navigate('/admin')}
        onHomeClick={() => {
          if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSearchResults(null);
          } else {
            navigate('/');
          }
        }}
        onPolicyClick={() => navigate('/policy')}
        onSearchClick={() => handleNavClick('hero')}
        onRoutesClick={() => handleNavClick('routes')}
        onFeaturesClick={() => handleNavClick('features')}
        isAdmin={isAdmin}
        activeTab={location.pathname === '/' ? 'home' : ''}
      />
      
      <main>
        <Routes>
          <Route path="/" element={
            searchResults && searchParams ? (
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
                <Hero 
                  onSearch={handleSearch} 
                  onAddRoute={handleContributionClick} 
                />
                <PopularRoutes onRouteClick={(f, t) => handleSearch({origin: f, destination: t, date: ''})} onViewAllClick={() => navigate('/schedules')} />
                <BlogSection />
                <Features />
                <HowItWorks />
              </>
            )
          } />

          <Route path="/admin" element={isAdmin ? <AdminDashboard buses={buses} onClose={() => navigate('/')} /> : <div className="p-20 text-center">Unauthorized</div>} />
          <Route path="/schedules" element={<Schedules onRouteClick={(f, t) => handleSearch({origin: f, destination: t, date: ''})} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/policy" element={<ServicePolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/careers" element={<Careers />} />
          
          {/* SEO Routes */}
          <Route path="/:slug" element={<RouteSpecificPage />} />
        </Routes>
      </main>

      <Footer 
        onHomeClick={() => {
          if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSearchResults(null);
          } else {
            navigate('/');
          }
        }} 
        onAboutClick={() => navigate('/about')}
        onPolicyClick={() => navigate('/policy')} 
        onContactClick={() => navigate('/contact')}
        onPrivacyClick={() => navigate('/privacy')}
        onTermsClick={() => navigate('/terms')}
        onDisclaimerClick={() => navigate('/disclaimer')}
        onBlogClick={() => navigate('/blog')}
        onSchedulesClick={() => navigate('/schedules')}
        onFeaturesClick={() => handleNavClick('features')}
        onRoutesClick={() => handleNavClick('routes')}
        onCareersClick={() => navigate('/careers')}
      />

      <AnimatePresence>
        {isSubmitView && <SubmitRoute onClose={() => setIsSubmitView(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBus && (
          <BusDetails 
            bus={selectedBus} 
            onClose={() => setSelectedBus(null)} 
            onSelectCompany={handleSelectCompany}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompany && (
          <CompanyProfile 
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearching && (
          <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <p className="text-emerald-900 font-bold tracking-tight">Finding the best buses for you...</p>
          </div>
        )}
      </AnimatePresence>

      <FeedbackSystem />
      <NoticePopup />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
