import { Bus, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
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
}

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
  onFAQsClick
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Directory',
      links: [
        { label: 'Search Route', onClick: onHomeClick },
        { label: 'Bus Schedules', onClick: onSchedulesClick },
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
              <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-600/20">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Asaan<span className="text-emerald-600">Safar</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              Verified non-AC bus schedules, fares, routes and travel information across Pakistan. Helping travelers save time with accurate and reliable transport data.
            </p>

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
