import { Bus, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, Youtube, Smartphone, Linkedin, Tiktok, Threads } from 'lucide-react';
import { motion } from 'motion/react';

// Custom high-quality Threads logo icon that perfectly matches the styling of other icons
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5c0 .35-.12.67-.32.92.5.34.82.91.82 1.58 0 1.1-.9 2-2 2-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5" />
  </svg>
);

// Custom high-quality TikTok logo icon that perfectly matches the styling of other icons
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface FooterProps {
  onHomeClick: () => void;
  onAboutClick: (tab?: string) => void;
  onPolicyClick: () => void;
  onContactClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onDisclaimerClick: () => void;
  onBlogClick: () => void;
  onSchedulesClick: () => void;
  onFeaturesClick: () => void;
  onRoutesClick: () => void;
  onCareersClick: () => void;
  onTeamClick: () => void;
  onFAQsClick: () => void;
  onSitemapClick: () => void;
  onDownloadAppClick?: () => void;
  isAdmin?: boolean;
}

// Helper to get the correct path to the logo in any hosting environment
const getLogoPath = () => {
  return 'https://lh3.googleusercontent.com/d/1BLe_EDy4yCALfwQpgnUDQPoKSyKdECrq';
};

export default function Footer({
  onHomeClick,
  onAboutClick,
  onPolicyClick,
  onContactClick,
  onPrivacyClick,
  onTermsClick,
  onDisclaimerClick,
  onBlogClick,
  onSchedulesClick,
  onFeaturesClick,
  onRoutesClick,
  onCareersClick,
  onTeamClick,
  onFAQsClick,
  onSitemapClick,
  onDownloadAppClick,
  isAdmin = false
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Directory',
      links: [
        { label: 'Search Route', onClick: onHomeClick },
        { label: 'Bus Schedules', onClick: onSchedulesClick },
        { label: 'Sitemap (سائٹ میپ)', onClick: onSitemapClick },
        ...(isAdmin ? [{ label: 'Android App 📱', onClick: onDownloadAppClick || (() => {}) }] : []),
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', onClick: () => onAboutClick('about') },
        { label: 'Our Mission', onClick: () => onAboutClick('mission') },
        { label: 'Our Vision', onClick: () => onAboutClick('vision') },
        { label: 'Our Team', onClick: onTeamClick },
        { label: 'Careers', onClick: onCareersClick },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Travel Blog', onClick: onBlogClick },
        { label: 'FAQs', onClick: onFAQsClick },
      ]
    },
    {
      title: 'Support & Legal',
      links: [
        { label: 'Contact Us', onClick: onContactClick },
        { label: 'Service Policy', onClick: onPolicyClick },
        { label: 'Privacy Policy', onClick: onPrivacyClick },
        { label: 'Terms & Conditions', onClick: onTermsClick },
        { label: 'Disclaimer', onClick: onDisclaimerClick },
      ]
    }
  ];
  const serviceArea = ['LAHORE', 'FAISALABAD', 'KARACHI', 'RAWALPINDI', 'MULTAN', 'LAYYAH', 'PESHAWAR', 'QUETTA'];

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-500 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-3 space-y-8">
            <div 
              onClick={onHomeClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-600/10 group-hover:rotate-6 transition-transform border border-slate-100 flex items-center justify-center">
                <img 
                  src={getLogoPath()} 
                  alt="AsaanSafar Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Asaan<span className="text-emerald-600">Safar</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              Verified non-AC bus schedules, fares, routes and travel information across Pakistan. Helping travelers save time with accurate and reliable transport data.
            </p>

            <div className="flex flex-col gap-3">
              {/* Row 1: Existing Social Media Icons */}
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, url: "https://www.facebook.com/AsaanSafar/" },
                  { Icon: Instagram, url: "https://instagram.com/Asaan.Safar" },
                  { Icon: Twitter, url: "https://twitter.com/AsaanSafar" },
                  { Icon: Youtube, url: "https://youtube.com/@AsaanSafar" }
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer"
                  >
                    <item.Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Row 2: Additional Requested Icons */}
              <div className="flex gap-4">
                {[
                  { Icon: Linkedin, url: "https://linkedin.com/company/asaansafar" },
                  { Icon: ThreadsIcon, url: "https://threads.net/@Asaan.Safar" },
                  { Icon: TiktokIcon, url: "https://tiktok.com/@Asaan.Safar" }
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer"
                  >
                    <item.Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {onDownloadAppClick && isAdmin && (
              <button
                onClick={onDownloadAppClick}
                className="w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2.5 mt-6 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-300" />
                <span>Android App (.APK)</span>
              </button>
            )}
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={link.onClick}
                        className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors text-left cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">SERVICE AREA</h3>
              <div className="flex flex-wrap gap-2">
                {serviceArea.map(city => (
                  <span key={city} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 tracking-wider">
                    {city}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                 </div>
                 <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Available Nationwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            © {currentYear} AsaanSAFAR • All Rights Reserved Built for Pakistan 🇵🇰
          </p>
          <div className="flex gap-8">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-600 transition-colors">
              VERIFIED SCHEDULES
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
