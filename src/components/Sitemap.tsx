import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { staticDataService } from '../lib/staticDataService';
import { 
  Map, 
  Compass, 
  FileText, 
  Bus, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Phone, 
  HelpCircle, 
  ShieldCheck, 
  Globe, 
  FileSignature, 
  Scale, 
  Briefcase,
  AlertTriangle,
  Building,
  Award
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockBuses';

export default function Sitemap() {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadDynamicCompanies() {
      try {
        // 1. Fetch index of stops to find all Bus IDs in the system
        const indexData = await staticDataService.getStopsIndex();

        if (!indexData || !indexData.stops) return;

        // Collect all unique Bus IDs served by these stops
        const busIdsSet = new Set<string>();
        Object.values(indexData.stops).forEach((stop: any) => {
          if (Array.isArray(stop.buses)) {
            stop.buses.forEach((bId: string) => {
              if (bId) busIdsSet.add(bId.trim());
            });
          }
        });

        if (busIdsSet.size === 0) return;

        // 2. Map Bus IDs to partition filenames
        const partitions = new Set<string>();
        busIdsSet.forEach((busId) => {
          const match = busId.match(/^B(\d+)$/i);
          let partitionFile = 'B1-B500.json';
          if (match) {
            const idNum = parseInt(match[1], 10);
            const quotient = Math.floor((idNum - 1) / 500);
            const start = quotient * 500 + 1;
            const end = (quotient + 1) * 500;
            partitionFile = `B${start}-B${end}.json`;
          }
          partitions.add(partitionFile);
        });

        // 3. Fetch each partition and extract unique company names
        const dynamicCompanies = new Set<string>();
        for (const partition of partitions) {
          try {
            const buses = await staticDataService.getBusesFromPartition(partition);
            buses.forEach((bus: any) => {
              if (bus && bus.company && bus.company.trim()) {
                dynamicCompanies.add(bus.company.trim());
              }
            });
          } catch (err) {
            console.error(`Error loading partition ${partition} in sitemap:`, err);
          }
        }

        if (dynamicCompanies.size > 0 && active) {
          setCompanies(Array.from(dynamicCompanies).sort());
        }
      } catch (error) {
        console.error('Failed to load dynamic companies in sitemap:', error);
      }
    }

    loadDynamicCompanies();
    return () => {
      active = false;
    };
  }, []);

  const mainPages = [
    { name: 'Search Route (بس تلاش کریں)', path: '/', desc: 'Find verified non-AC buses, timing, terminals, and ticket price.', icon: Compass },
    { name: 'Bus Schedules (ٹائم ٹیبل)', path: '/schedules', desc: 'Complete daily schedules for all routes in Pakistan.', icon: Clock },
    { name: 'Travel Blog (سفری بلاگ)', path: '/blog', desc: 'Travel guides, news, and valuable transport tips.', icon: BookOpen },
    { name: 'About Us (ہمارے بارے میں)', path: '/about?tab=about', desc: 'Learn about Asaan Safar and our platform.', icon: Users },
    { name: 'Our Mission (ہمارا مشن)', path: '/about?tab=mission', desc: 'Connecting Pakistan with transparent transport information.', icon: Compass },
    { name: 'Our Vision (ہمارا وژن)', path: '/about?tab=vision', desc: 'Promoting organized and reliable travel for everyone.', icon: Globe },
    { name: 'Our Team (ہماری ٹیم)', path: '/team', desc: 'Meet the hard-working developers and researchers behind the app.', icon: Users },
    { name: 'Careers (ملازمت کے مواقع)', path: '/careers', desc: 'Join us and build the future of travel information.', icon: Briefcase },
    { name: 'FAQs (سوالات و جوابات)', path: '/faqs', desc: 'Frequently asked questions about transport schedules.', icon: HelpCircle },
    { name: 'Contact Us (رابطہ کریں)', path: '/contact', desc: 'Get in touch for feedback, queries, and cooperation.', icon: Phone },
  ];

  const policyPages = [
    { name: 'Service Policy (سروس پالیسی)', path: '/policy', desc: 'Guidelines about data updates and verification.', icon: ShieldCheck },
    { name: 'Privacy Policy (پرائیویسی پالیسی)', path: '/privacy', desc: 'How we protect your personal information.', icon: FileText },
    { name: 'Terms & Conditions (شرائط و ضوابط)', path: '/terms', desc: 'The terms of using the Asaan Safar platform.', icon: FileSignature },
    { name: 'Disclaimer (دستبرداری)', path: '/disclaimer', desc: 'Limitation of liability and source of transport data.', icon: Scale },
  ];

  const serviceCities = [
    'Lahore', 'Karachi', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar', 
    'Quetta', 'Gujranwala', 'Sargodha', 'Sialkot', 'Bahawalpur', 'Layyah'
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Visual Header */}
      <section id="sitemap-hero" className="relative overflow-hidden bg-emerald-950 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-800/40 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase mb-6"
          >
            <Map className="w-4 h-4" />
            Website Directory
          </motion.div>
          <motion.h1 
            id="sitemap-main-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4"
          >
            Sitemap <span className="text-emerald-400 font-medium">(سائٹ میپ)</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-200/80 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Explore our platform structure easily. Find all schedules, guides, and pages designed to provide quick access and search-engine index friendliness.
            <br />
            <span className="text-emerald-400 text-xs mt-2 block font-medium">ہماری ویب سائٹ کی تمام اہم معلومات اور لنکس تک آسان رسائی۔</span>
          </motion.p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Website Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Core Pages Card */}
            <div id="sitemap-core-card" className="bg-white p-8 border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-900/5">
              <h2 id="core-pages-heading" className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 uppercase tracking-wider">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                Primary Sections (اہم صفحات)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainPages.map((page, idx) => {
                  const PageIcon = page.icon;
                  return (
                    <Link 
                      key={idx}
                      to={page.path}
                      className="group flex gap-4 p-4 border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 rounded-2xl transition-all"
                      id={`sitemap-link-main-${idx}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-600 border border-slate-100 group-hover:border-emerald-600 transition-all shrink-0">
                        <PageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                          {page.name}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-normal">{page.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Popular Bus Schedules Grid */}
            <div id="sitemap-routes-card" className="bg-white p-8 border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-900/5">
              <h2 id="popular-routes-heading" className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 uppercase tracking-wider">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                Popular Routes Timing (مشہور روٹس ٹائمز)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPULAR_ROUTES.map((route, idx) => (
                  <Link 
                    key={idx}
                    to={`/${route.from.toLowerCase()}-to-${route.to.toLowerCase()}-bus-timing`}
                    className="group flex items-center justify-between p-4 border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 rounded-xl transition-all"
                    id={`sitemap-link-route-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/30">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800">{route.from}</span>
                        <span className="mx-2 text-slate-300 text-xs font-bold">→</span>
                        <span className="text-xs font-black text-slate-800">{route.to}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors bg-slate-50 px-2 py-1 rounded border border-slate-100 group-hover:bg-white group-hover:border-emerald-100">
                      View Timetable
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Side Column (Bus Operators, Policies, Technical) */}
          <div className="space-y-8">
            {/* Platform Highlights / Statistics Card */}
            <div id="sitemap-highlights-card" className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 rounded-[1.5rem] text-white border border-emerald-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <h2 id="highlights-card-heading" className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-5 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Platform Highlights
              </h2>
              <p className="text-emerald-100/80 text-xs font-medium leading-relaxed mb-6">
                Asaan Safar provides the largest verified repository of bus transport information in Pakistan. Our database is updated regularly through passenger feedback and physical terminal visits.
              </p>
              <div className="space-y-4 border-t border-emerald-800/60 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200/70 font-medium">Verified Services</span>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-800/40 px-2.5 py-1 rounded-md border border-emerald-700/30">1,000+ Daily Buses</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200/70 font-medium">Primary Hubs</span>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-800/40 px-2.5 py-1 rounded-md border border-emerald-700/30">12+ Major Cities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200/70 font-medium">Public Status</span>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-800/40 px-2.5 py-1 rounded-md border border-emerald-700/30">100% Free & Open</span>
                </div>
              </div>
            </div>

            {/* Support & Compliance */}
            <div id="sitemap-legal-card" className="bg-white p-8 border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-900/5">
              <h2 id="legal-heading" className="text-base font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 uppercase tracking-wider">
                <span className="w-1.5 h-5 bg-emerald-600 rounded-full"></span>
                Support & Legal
              </h2>
              <ul className="space-y-4">
                {policyPages.map((page, idx) => {
                  const PageIcon = page.icon;
                  return (
                    <li key={idx}>
                      <Link 
                        to={page.path}
                        className="group flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                        id={`sitemap-link-legal-${idx}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-emerald-100 transition-colors shrink-0">
                          <PageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors block leading-none">{page.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">{page.desc}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Verified Bus Companies */}
            <div id="sitemap-companies-card" className="bg-white p-8 border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-900/5">
              <h2 id="companies-heading" className="text-base font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 uppercase tracking-wider">
                <span className="w-1.5 h-5 bg-emerald-600 rounded-full"></span>
                Bus Companies (بس کمپنیاں)
              </h2>
              <div className="flex flex-wrap gap-2">
                {companies.map((companyName, idx) => (
                  <Link
                    key={idx}
                    to="/"
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                    id={`sitemap-link-company-${idx}`}
                  >
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {companyName}
                  </Link>
                ))}
              </div>
            </div>

            {/* Service Coverage Cities */}
            <div id="sitemap-cities-card" className="bg-white p-8 border border-slate-100 rounded-[1.5rem] shadow-xl shadow-slate-900/5">
              <h2 id="cities-heading" className="text-base font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 uppercase tracking-wider">
                <span className="w-1.5 h-5 bg-emerald-600 rounded-full"></span>
                Coverage Cities (کور کیے گئے شہر)
              </h2>
              <div className="flex flex-wrap gap-2">
                {serviceCities.map((city, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-lg"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Disclaimer Note (SEO & AdSense requirement for clear source identification) */}
        <div id="sitemap-disclaimer-note" className="mt-12 bg-amber-50 border border-amber-200/50 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">AdSense & Verification Guidelines Notice</h4>
            <p className="text-xs text-amber-800/80 leading-relaxed font-medium mt-1">
              Asaan Safar provides educational and informatory transport directories. All schedules and fares are cross-verified by field researchers and passenger feedback regularly. However, exact arrival and departure timings may fluctuate due to traffic density, national highway conditions, and vehicle management. We advise visitors to call the respective terminal phone numbers provided in the directory before planning final travel.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
