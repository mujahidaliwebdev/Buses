/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
import { Bus, SearchFilters, Company } from './types';
import { MOCK_BUSES } from './data/mockBuses';
import { MOCK_COMPANIES } from './data/mockCompanies';

export default function App() {
  const [buses, setBuses] = useState<Bus[]>(MOCK_BUSES);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isSubmitView, setIsSubmitView] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [searchParams, setSearchParams] = useState<SearchFilters | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleUpdateBuses = (newBuses: Bus[]) => {
    setBuses(newBuses);
  };

  const handleSelectCompany = (companyName: string) => {
    const company = MOCK_COMPANIES.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />
      
      <main>
        {isAdminView ? (
          <AdminDashboard 
            buses={buses} 
            onUpdate={handleUpdateBuses} 
            onClose={() => setIsAdminView(false)} 
          />
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
          />
        ) : (
          <>
            <Hero onSearch={handleSearch} />
            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
               <button 
                 onClick={() => setIsSubmitView(true)}
                 className="w-full md:w-auto bg-emerald-950 text-emerald-400 py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 border border-emerald-800 shadow-xl hover:bg-emerald-900 transition-all active:scale-95 mx-auto"
               >
                 <Plus className="w-5 h-5" /> Missing a route? Add it here
               </button>
            </div>
            <PopularRoutes />
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
                  <button 
                    onClick={() => setIsAdminView(true)}
                    className="mt-8 text-xs font-bold text-slate-300 hover:text-emerald-500 transition-colors uppercase tracking-widest"
                  >
                    Operator Login / Dashboard
                  </button>
               </div>
            </section>
          </>
        )}
      </main>

      <Footer />

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
