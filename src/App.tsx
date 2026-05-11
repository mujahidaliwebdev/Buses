/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularRoutes from './components/PopularRoutes';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import { Bus, SearchFilters } from './types';
import { MOCK_BUSES } from './data/mockBuses';

export default function App() {
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [searchParams, setSearchParams] = useState<SearchFilters | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchParams(filters);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = MOCK_BUSES.filter(bus => 
        bus.origin.toLowerCase() === filters.origin.toLowerCase() && 
        bus.destination.toLowerCase() === filters.destination.toLowerCase()
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />
      
      <main>
        <Hero onSearch={handleSearch} />
        
        <PopularRoutes />
        
        <Features />
        
        <HowItWorks />
        
        {/* Placeholder for SEO Content or CTA */}
        <section className="py-20 bg-white">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">The Future of Bus Travel in Pakistan</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                We are on a mission to digitize every terminal and bus operator in Pakistan. 
                From the bustling streets of Karachi to the scenic routes of Northern Pakistan, 
                our platform ensures you have the most accurate data at your fingertips.
              </p>
           </div>
        </section>
      </main>

      <Footer />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSearching && (
          <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <p className="text-emerald-900 font-bold tracking-tight">Finding the best buses for you...</p>
          </div>
        )}
      </AnimatePresence>

      {/* Results Overlay */}
      <AnimatePresence>
        {searchResults && searchParams && (
          <SearchResults 
            buses={searchResults}
            origin={searchParams.origin}
            destination={searchParams.destination}
            onClose={() => setSearchResults(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
