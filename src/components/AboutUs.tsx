import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BusFront, Target, Eye, Info, Users, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const tabs = [
    {
      id: 'about',
      label: 'About Us',
      urduLabel: 'ہمارے بارے میں',
      icon: Info,
    },
    {
      id: 'mission',
      label: 'Our Mission',
      urduLabel: 'ہمارا مشن',
      icon: Target,
    },
    {
      id: 'vision',
      label: 'Our Vision',
      urduLabel: 'ہمارا وژن',
      icon: Eye,
    },
  ];

  const content = {
    about: {
      titleEng: 'About Asaan Safar',
      titleUrdu: 'آسان سفر کے بارے میں',
      paragraphsEng: [
        "Asaan Safar is Pakistan's first dedicated platform focused on providing verified information about non-AC bus services across the country. Our goal is to make intercity travel easier, more reliable, and more transparent for passengers by offering accurate and up-to-date bus information in one place.",
        "We provide essential travel details including departure and arrival times, fares, bus company information, contact numbers, vehicle details, and route information. Every listing is carefully collected and verified to help travelers make informed decisions before starting their journey.",
        "Unlike traditional local transport information that is often difficult to find or unreliable, Asaan Safar focuses on buses that follow regular schedules and maintain operational consistency. Our platform is designed to save passengers valuable time by helping them find dependable transport options quickly and easily.",
        "Whether you are traveling for work, education, business, or personal reasons, Asaan Safar aims to become your trusted source for verified non-AC bus information throughout Pakistan."
      ],
      paragraphsUrdu: [
        "آسان سفر پاکستان کا ایک منفرد پلیٹ فارم ہے جس کا مقصد ملک بھر میں چلنے والی نان اے سی بس سروسز کے بارے میں مستند اور قابلِ اعتماد معلومات ایک جگہ فراہم کرنا ہے۔",
        "ہم مسافروں کو بسوں کے روانگی اور آمد کے اوقات، کرایوں، بس کمپنیوں کے نام، رابطہ نمبرز، بس نمبرز اور روٹس سے متعلق اہم معلومات فراہم کرتے ہیں تاکہ سفر کی منصوبہ بندی آسان اور مؤثر بنائی جا سکے۔",
        "آسان سفر پر صرف انہی بس سروسز کی معلومات شامل کی جاتی ہیں جن کا ڈیٹا تصدیق شدہ ہو اور جو اپنے مقررہ اوقات کی پابندی کرتی ہوں۔ ہمارا مقصد مسافروں کو قابلِ اعتماد معلومات فراہم کر کے ان کا قیمتی وقت بچانا اور سفر کو مزید آسان بنانا ہے۔",
        "ہم مسلسل فیلڈ میں جا کر معلومات اکٹھی کرتے ہیں اور کوشش کرتے ہیں کہ فراہم کردہ ڈیٹا زیادہ سے زیادہ درست، تازہ اور قابلِ اعتماد ہو۔ آسان سفر مستقبل میں پاکستان میں بس سفر سے متعلق معلومات کا سب سے معتبر ذریعہ بننے کے لیے پرعزم ہے۔"
      ],
      bgImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
    },
    mission: {
      titleEng: 'Our Mission',
      titleUrdu: 'ہمارا مشن',
      paragraphsEng: [
        "Our mission is to improve public transportation accessibility by creating Pakistan's most reliable database of verified non-AC bus services.",
        "We are committed to collecting and publishing accurate information about buses that operate on regular schedules and value punctuality. By connecting travelers with trustworthy transport information, we aim to reduce uncertainty, save time, and make journey planning simpler for everyone.",
        "Asaan Safar believes that passengers deserve easy access to transparent transport information. Through continuous field verification, data accuracy, and ongoing updates, we strive to build a platform that helps millions of travelers find dependable bus services across Pakistan.",
        "Our long-term vision is to become the leading source of verified bus route information in Pakistan, empowering passengers with accurate travel data and promoting more organized, efficient, and accessible public transportation."
      ],
      paragraphsUrdu: [
        "ہمارا مشن پاکستان میں نان اے سی بس سروسز کی مستند، منظم اور آسانی سے قابلِ رسائی معلومات فراہم کرنا ہے تاکہ مسافر بہتر اور باخبر سفری فیصلے کر سکیں۔",
        "ہم ایسے بس آپریٹرز اور سروسز کی معلومات جمع اور شائع کرتے ہیں جو وقت کی پابندی کرتے ہیں اور مسافروں کو قابلِ اعتماد سفری سہولت فراہم کرتے ہیں۔ ہمارا یقین ہے کہ درست معلومات تک آسان رسائی مسافروں کا وقت بچاتی ہے، غیر یقینی صورتحال کو کم کرتی ہے اور سفر کے تجربے کو بہتر بناتی ہے۔",
        "آسان سفر کا مقصد پاکستان کا سب سے بڑا اور قابلِ اعتماد بس انفارمیشن پلیٹ فارم بننا ہے، جہاں مسافر ملک بھر میں دستیاب بس روٹس، اوقات، کرایوں اور دیگر ضروری معلومات تک آسانی سے رسائی حاصل کر سکیں۔",
        "ہم شفافیت، درستگی اور مسلسل بہتری کے اصولوں پر کاربند ہیں اور ایک ایسے پلیٹ فارم کی تعمیر کے لیے کوشاں ہیں جو لاکھوں مسافروں کے لیے سفر کو آسان، منظم اور مؤثر بنائے۔"
      ],
      bgImage: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070&auto=format&fit=crop"
    },
    vision: {
      titleEng: 'Our Vision',
      titleUrdu: 'ہمارا وژن',
      paragraphsEng: [
        "At AsaanSafar, our vision is to become Pakistan's most trusted and comprehensive travel information platform, providing reliable, verified, and easily accessible information about bus transportation across the country.",
        "We envision a future where every traveler can confidently plan their journey using accurate information about routes, schedules, fares, and transport services. By improving access to trustworthy travel data, we aim to save passengers valuable time, reduce uncertainty, and make travel planning more convenient for everyone.",
        "Our long-term goal is to build a nationwide platform that connects travelers with verified transportation information, covering cities, towns, and major travel routes throughout Pakistan. Through continuous improvement, data accuracy, and innovation, AsaanSafar strives to make travel simpler, more transparent, and more efficient for millions of people."
      ],
      paragraphsUrdu: [
        "ہمارا وژن پاکستان کا سب سے قابلِ اعتماد اور جامع سفری معلوماتی پلیٹ فارم بننا ہے، جہاں مسافر ملک بھر میں بس روٹس، اوقاتِ روانگی و آمد، کرایوں اور دیگر ضروری سفری معلومات تک آسانی سے رسائی حاصل کر سکیں۔",
        "ہم ایک ایسے مستقبل کا تصور رکھتے ہیں جہاں ہر مسافر سفر شروع کرنے سے پہلے درست، تازہ اور تصدیق شدہ معلومات حاصل کر سکے، جس سے اس کا وقت بچے، غیر یقینی صورتحال کم ہو اور سفر زیادہ منظم اور آسان بن سکے۔",
        "آسان سفر کا طویل مدتی مقصد پاکستان کے تمام شہروں اور قصبوں کو ایک ہی پلیٹ فارم پر جوڑنا اور عوام کو قابلِ اعتماد سفری معلومات فراہم کرنا ہے، تاکہ ہر شخص اعتماد کے ساتھ اپنے سفر کی منصوبہ بندی کر سکے۔"
      ],
      bgImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2025&auto=format&fit=crop"
    }
  };

  const currentContent = content[activeTab as keyof typeof content] || content.about;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-emerald-950 py-28 sm:py-36">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--color-emerald-700),_transparent_70%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-4"
          >
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </button>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              About & <span className="text-emerald-400">Mission</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>DESIGNED FOR TRANSPARENCY</span> • <span>پاکستان کا پہلا معلومات یافتہ پلیٹ فارم</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Learn about our journey, mission, and long-term vision to digitize Pakistan's non-AC waterways and build the country's most verified transit info grid.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Elegant Tab Switcher Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white p-3 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-4 md:py-5 px-6 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-[10px] font-bold ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {tab.urduLabel}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <motion.div layoutId="activeDot" className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Dual-Language Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 md:p-14 border border-slate-100 rounded-[2.5rem] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Left Column (English Side) */}
              <div className="lg:col-span-6 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">
                    {currentContent.titleEng}
                  </h2>
                </div>

                <div className="space-y-6">
                  {currentContent.paragraphsEng.map((para, i) => (
                    <p key={i} className="text-slate-600 font-medium leading-relaxed text-sm md:text-base text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Column (Urdu Side) */}
              <div className="lg:col-span-6 space-y-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-12" dir="rtl">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-wide font-sans text-right">
                    {currentContent.titleUrdu}
                  </h2>
                </div>

                <div className="space-y-6">
                  {currentContent.paragraphsUrdu.map((para, i) => (
                    <p key={i} className="text-slate-850 font-medium text-right leading-loose text-sm md:text-base">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Leadership Team Teaser Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-white p-8 md:p-14 border border-slate-100 rounded-[2.5rem] shadow-sm max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our <span className="text-emerald-600">Leadership</span>
            </h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">
              ہمارے انتظامیہ اور بانی ارکان
            </p>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
              AsaanSafar is directed by an exceptional group of transit experts, developers, and field leaders under the guidance of our CEO & Founder <strong>Mujahid Ali</strong> and General Manager <strong>Muhammad Arsalan</strong>.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/team')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 hover:bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-slate-950/10 active:scale-95"
              >
                <Users className="w-5 h-5" />
                <span>View Full Team & Bios / پورا عملہ دیکھیں</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Grid */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-emerald-950 p-8 md:p-12 rounded-[2.5rem] text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Cities Included", value: "50+" },
                { label: "Verified Operators", value: "100+" },
                { label: "Daily Route Schedules", value: "1200+" },
                { label: "Monthly Commuters", value: "10k+" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-3xl md:text-4xl font-black text-emerald-400">{stat.value}</span>
                  <span className="text-[10px] md:text-xs font-black text-emerald-100/60 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
