import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, CheckCircle2, Bookmark, Flame, Scale, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServicePolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      titleEng: "Information Accuracy",
      titleUrdu: "معلومات کی درستگی",
      paraEng: "We make every effort to verify bus schedules, fares, routes, contact numbers, and other travel-related information before publishing it on our platform. However, transport operators may change schedules, fares, routes, or contact details without prior notice. Users are encouraged to confirm important travel details directly with the respective bus operator before traveling.",
      paraUrdu: "ہم بسوں کے اوقاتِ روانگی و آمد، کرایوں، روٹس، رابطہ نمبرز اور دیگر سفری معلومات کو شائع کرنے سے پہلے حتی الامکان تصدیق کرنے کی کوشش کرتے ہیں۔ تاہم، ٹرانسپورٹ آپریٹرز کسی بھی وقت اپنے اوقات، کرایوں، روٹس یا رابطہ معلومات میں تبدیلی کر سکتے ہیں۔ اس لیے مسافروں کو مشورہ دیا جاتا ہے کہ سفر سے قبل متعلقہ بس آپریٹر سے معلومات کی تصدیق ضرور کر لیں۔"
    },
    {
      titleEng: "Verified Listings",
      titleUrdu: "تصدیق شدہ معلومات",
      paraEng: "AsaanSafar focuses on publishing information about verified bus services that operate on regular schedules and maintain reasonable punctuality standards. We strive to ensure that the information provided is as accurate and trustworthy as possible.",
      paraUrdu: "آسان سفر پر صرف انہی بس سروسز کی معلومات شامل کرنے کی کوشش کی جاتی ہے جن کا ڈیٹا تصدیق شدہ ہو اور جو اپنے شیڈول کے مطابق خدمات فراہم کرتی ہوں۔ ہمارا مقصد مسافروں تک قابلِ اعتماد معلومات پہنچانا ہے۔"
    },
    {
      titleEng: "Independent Information Platform",
      titleUrdu: "آزاد معلوماتی پلیٹ فارم",
      paraEng: "AsaanSafar is an independent travel information platform and is not owned, operated, or controlled by any bus company, transport operator, or government authority. We provide information solely to help travelers make informed travel decisions.",
      paraUrdu: "آسان سفر ایک آزاد سفری معلوماتی پلیٹ فارم ہے۔ ہمارا کسی بس کمپنی، ٹرانسپورٹ آپریٹر یا سرکاری ادارے سے براہِ راست تعلق نہیں ہے۔ ہم صرف معلوماتی مقاصد کے لیے ڈیٹا فراہم کرتے ہیں تاکہ مسافر بہتر سفری فیصلے کر سکیں۔"
    },
    {
      titleEng: "User Responsibility",
      titleUrdu: "صارف کی ذمہ داری",
      paraEng: "Users are responsible for verifying travel arrangements, departure times, fares, and other important details before commencing their journey. AsaanSafar shall not be held responsible for schedule changes, delays, cancellations, fare changes, or any inconvenience caused by third-party transport operators.",
      paraUrdu: "سفر سے پہلے بس کے اوقات، کرایوں، روٹس اور دیگر اہم معلومات کی تصدیق کرنا صارف کی ذمہ داری ہے۔ آسان سفر کسی بھی تاخیر، منسوخی، کرایوں میں تبدیلی یا ٹرانسپورٹ آپریٹر کی جانب سے ہونے والی کسی بھی تبدیلی کا ذمہ دار نہیں ہوگا۔"
    },
    {
      titleEng: "Continuous Updates",
      titleUrdu: "مسلسل بہتری",
      paraEng: "Our team continuously collects, reviews, and updates information to improve the quality and accuracy of our database. We welcome user feedback regarding incorrect or outdated information.",
      paraUrdu: "ہمارا مقصد مسافروں کے لیے ڈیٹا کی مسلسل جانچ پڑتال اور اپ ڈیٹ کو یقینی بنانا ہے۔ ہماری ٹیم مسلسل معلومات جمع کرنے، جانچنے اور اپ ڈیٹ کرنے کی کوشش کرتی ہے تاکہ مسافروں کو بہتر اور زیادہ درست معلومات فراہم کی جا سکیں۔ اگر کسی معلومات میں غلطی یا کمی ہو تو صارفین ہمیں آگاہ کر سکتے ہیں۔"
    },
    {
      titleEng: "Our Commitment",
      titleUrdu: "ہمارا عزم",
      paraEng: "Our mission is to save travelers time by providing a trusted source of verified bus information and helping passengers find reliable transportation options across Pakistan.",
      paraUrdu: "ہمارا مقصد مسافروں کا قیمتی وقت بچانا اور پاکستان میں قابلِ اعتماد بس معلومات کا ایک ایسا پلیٹ فارم فراہم کرنا ہے جس پر لوگ اعتماد کر سکیں۔"
    }
  ];

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
              Service <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>SERVICE TRANSPARENCY</span> • <span>آسان سفر سروس پالیسی</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              At AsaanSafar, we are committed to providing reliable, accurate, and up-to-date information about non-AC bus services across Pakistan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid gap-10">
          {/* Introductory Core Statement Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                AsaanSafar Service Policy
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                At AsaanSafar, we are committed to providing reliable, accurate, and up-to-date information about non-AC bus services across Pakistan.
              </p>
            </div>
            
            <div className="bg-emerald-50/50 border border-emerald-100/55 p-8 rounded-3xl" dir="rtl">
              <h2 className="text-2xl font-black text-emerald-950 font-sans text-right mb-4">
                آسان سفر سروس پالیسی
              </h2>
              <p className="text-slate-800 font-medium leading-loose text-sm md:text-base text-right">
                آسان سفر پاکستان بھر میں نان اے سی بس سروسز کے بارے میں درست، قابلِ اعتماد اور تازہ معلومات فراہم کرنے کے لیے پرعزم ہے۔
              </p>
            </div>
          </motion.div>

          {/* Section List (Staggered Dual Language Cards) */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white hover:shadow-md transition-shadow border border-slate-100 rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* English Column */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                    <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">
                      {section.titleEng}
                    </h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base text-justify">
                    {section.paraEng}
                  </p>
                </div>

                {/* Urdu Column */}
                <div className="lg:col-span-6 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10" dir="rtl">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                    <h3 className="text-lg md:text-xl font-black text-slate-950 tracking-wide font-sans text-right">
                      {section.titleUrdu}
                    </h3>
                  </div>
                  <p className="text-slate-850 font-medium text-right leading-loose text-sm md:text-base">
                    {section.paraUrdu}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
