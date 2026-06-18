import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, Lock, Eye, Server, Cookie, HelpCircle, ExternalLink, RefreshCw, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      titleEng: "Information We Collect",
      titleUrdu: "معلومات جو ہم جمع کرتے ہیں",
      icon: Eye,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar may collect certain non-personal information automatically when you visit our website, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600">
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>IP address</li>
            <li>Pages visited</li>
            <li>Date and time of visits</li>
            <li>Referring websites</li>
          </ul>
          <p>
            If you contact us through email, forms, or social media, we may collect information that you voluntarily provide, such as your name, email address, and message content.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4">
          <p dir="rtl" className="text-right">
            جب آپ ہماری ویب سائٹ وزٹ کرتے ہیں تو ہم کچھ غیر ذاتی معلومات خودکار طور پر جمع کر سکتے ہیں، جن میں شامل ہیں:
          </p>
          <ul dir="rtl" className="list-disc pr-5 space-y-1.5 text-xs md:text-sm text-slate-800 text-right">
            <li>براؤزر کی قسم اور ورژن</li>
            <li>ڈیوائس سے متعلق معلومات</li>
            <li>آئی پی ایڈریس</li>
            <li>وزٹ کیے گئے صفحات</li>
            <li>وزٹ کی تاریخ اور وقت</li>
            <li>ریفرنگ ویب سائٹس</li>
          </ul>
          <p dir="rtl" className="text-right">
            اگر آپ ہم سے ای میل، رابطہ فارم یا سوشل میڈیا کے ذریعے رابطہ کرتے ہیں تو ہم وہ معلومات محفوظ کر سکتے ہیں جو آپ رضاکارانہ طور پر فراہم کرتے ہیں، جیسے آپ کا نام، ای میل ایڈریس، اور پیغام کا متن۔
          </p>
        </div>
      )
    },
    {
      titleEng: "How We Use Information",
      titleUrdu: "معلومات کا استعمال",
      icon: Server,
      paraEng: (
        <div className="space-y-4">
          <p>The information we collect may be used to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600">
            <li>Improve website performance and user experience</li>
            <li>Respond to inquiries and feedback</li>
            <li>Maintain and update travel information</li>
            <li>Monitor website traffic and usage trends</li>
            <li>Ensure website security and reliability</li>
          </ul>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4">
          <p dir="rtl" className="text-right">ہم جمع کی گئی معلومات کو درج ذیل مقاصد کے لیے استعمال کر سکتے ہیں:</p>
          <ul dir="rtl" className="list-disc pr-5 space-y-1.5 text-xs md:text-sm text-slate-800 text-right">
            <li>ویب سائٹ کی کارکردگی بہتر بنانے کے لیے</li>
            <li>صارفین کے سوالات اور آراء کا جواب دینے کے لیے</li>
            <li>سفری معلومات کو اپ ڈیٹ اور بہتر بنانے کے لیے</li>
            <li>ویب سائٹ ٹریفک اور استعمال کے رجحانات کا تجزیہ کرنے کے لیے</li>
            <li>ویب سائٹ کی سیکیورٹی اور استحکام کو برقرار رکھنے کے لیے</li>
          </ul>
        </div>
      )
    },
    {
      titleEng: "Cookies & Third-Party Services",
      titleUrdu: "کوکیز اور تھرڈ پارٹی سروسز",
      icon: Cookie,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar may use cookies and similar technologies to enhance user experience and analyze website performance. Users may choose to disable cookies through their browser settings.
          </p>
          <p>
            Our website may use third-party services, including analytics and advertising providers, which may collect information in accordance with their own privacy policies. These services may include Google Analytics, Google AdSense, and social media platforms. We do not control how third-party services collect or use data.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4" dir="rtl">
          <p className="text-right">
            آسان سفر صارف کے تجربے کو بہتر بنانے اور ویب سائٹ کی کارکردگی کا تجزیہ کرنے کے لیے کوکیز اور اسی نوعیت کی ٹیکنالوجیز استعمال کر سکتا ہے۔ آپ اپنے براؤزر کی سیٹنگز کے ذریعے کوکیز کو محدود یا غیر فعال کر سکتے ہیں۔
          </p>
          <p className="text-right">
            ہماری ویب سائٹ بعض تھرڈ پارٹی سروسز استعمال کر سکتی ہے، جن کی اپنی رازداری کی پالیسیاں ہوتی ہیں۔ ان میں Google Analytics، Google AdSense اور سوشل میڈیا نیٹ ورکس شامل ہیں۔ ہم ان سروسز کے ذریعے جمع کیے جانے والے ڈیٹا پر مکمل کنٹرول نہیں رکھتے۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Google AdSense",
      titleUrdu: "گوگل ایڈسینس",
      icon: HelpCircle,
      paraEng: (
        <p>
          In the future, AsaanSafar may display advertisements provided by Google AdSense and other advertising partners. These services may use cookies to serve personalized or non-personalized advertisements based on user activity and interests. Users can learn more about Google's advertising practices through Google's Privacy Policy.
        </p>
      ),
      paraUrdu: (
        <p dir="rtl" className="text-right">
          مستقبل میں آسان سفر پر Google AdSense یا دیگر اشتہاری نیٹ ورکس کے اشتہارات دکھائے جا سکتے ہیں۔ یہ سروسز صارفین کی دلچسپیوں اور سرگرمیوں کی بنیاد پر ذاتی یا غیر ذاتی اشتہارات دکھانے کے لیے کوکیز استعمال کر سکتی ہیں۔ صارفین گوگل اشتہارات کے متعلق مزید تفصیلات گوگل کی آفیشل پالیسی سے حاصل کر سکتے ہیں۔
        </p>
      )
    },
    {
      titleEng: "Data Accuracy & External Links",
      titleUrdu: "معلومات کی درستگی اور بیرونی روابط",
      icon: ExternalLink,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar provides travel-related information for informational purposes only. While we strive to keep information accurate and up-to-date, we cannot guarantee the completeness or accuracy of all schedules, fares, routes, or contact details.
          </p>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices, content, or policies of external websites.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4" dir="rtl">
          <p className="text-right">
            آسان سفر سفری معلومات صرف معلوماتی مقاصد کے لیے فراہم کرتا ہے۔ اگرچہ ہم معلومات کو درست اور تازہ رکھنے کی بھرپور کوشش کرتے ہیں، تاہم ہم بسوں کے اوقات، کرایوں، روٹس یا رابطہ معلومات کی مکمل درستگی کی ضمانت نہیں دے سکتے۔ مسافروں کو مشورہ دیا جاتا ہے کہ سفر سے قبل بس آپریٹر سے معلومات کی تصدیق ضرور کر لیں۔
          </p>
          <p className="text-right">
            ہماری ویب سائٹ پر دیگر ویب سائٹس کے لنکس موجود ہو سکتے ہیں۔ ان ویب سائٹس کی رازداری کی پالیسیوں اور مواد کی ذمہ داری ہماری نہیں ہوگی۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Data Security & Children's Privacy",
      titleUrdu: "معلومات کی حفاظت اور بچوں کی رازداری",
      icon: ShieldCheck,
      paraEng: (
        <div className="space-y-4">
          <p>
            We take reasonable measures to protect information from unauthorized access, misuse, or disclosure. However, no internet-based service can guarantee absolute security.
          </p>
          <p>
            AsaanSafar is not specifically directed toward children under the age of 13. We do not knowingly collect personal information from children.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4" dir="rtl">
          <p className="text-right">
            ہم معلومات کو غیر مجاز رسائی، غلط استعمال یا افشاء سے محفوظ رکھنے کے لیے مناسب حفاظتی اقدامات اختیار کرتے ہیں۔ تاہم، انٹرنیٹ پر موجود کوئی بھی نظام سو فیصد سیکیورٹی کی ضمانت نہیں دے سکتا۔
          </p>
          <p className="text-right">
            آسان سفر خاص طور پر 13 سال سے کم عمر بچوں کے لیے تیار نہیں کیا گیا، اور ہم جان بوجھ کر بچوں کی ذاتی معلومات جمع نہیں کرتے۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Changes & Contact Us",
      titleUrdu: "پالیسی میں تبدیلیاں اور رابطہ کریں",
      icon: RefreshCw,
      paraEng: (
        <div className="space-y-4">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
          <p>
            If you have any questions regarding this Privacy Policy, please contact us through our official website, Facebook page, or available contact channels.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4" dir="rtl">
          <p className="text-right">
            ہم وقتاً فوقتاً اس رازداری کی پالیسی میں تبدیلی کر سکتے ہیں۔ کسی بھی تبدیلی کو اس صفحے پر نئی تاریخ کے ساتھ شائع کیا جائے گا۔
          </p>
          <p className="text-right">
            اگر آپ کو اس رازداری کی پالیسی کے بارے میں کوئی سوال یا تشویش ہو تو آپ ہماری ویب سائٹ، فیس بک پیج یا دستیاب رابطہ ذرائع کے ذریعے ہم سے رابطہ کر سکتے ہیں۔
          </p>
        </div>
      )
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
              Privacy <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>Last Updated: June 2026</span> • <span>آخری اپ ڈیٹ: جون 2026</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Welcome to AsaanSafar. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you visit and use our website.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Info Card */}
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
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Privacy is Paramount
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                Welcome to AsaanSafar. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you visit and use our website.
              </p>
            </div>
            
            <div className="bg-emerald-50/50 border border-emerald-100/55 p-8 rounded-3xl" dir="rtl">
              <h2 className="text-2xl font-black text-emerald-950 font-sans text-right mb-4">
                رازداری کی پالیسی
              </h2>
              <p className="text-slate-800 font-medium leading-loose text-sm md:text-base text-right">
                آسان سفر میں آپ کی رازداری ہمارے لیے اہم ہے۔ یہ رازداری کی پالیسی وضاحت کرتی ہے کہ جب آپ ہماری ویب سائٹ استعمال کرتے ہیں تو ہم کس قسم کی معلومات جمع کرتے ہیں، انہیں کس طرح استعمال کرتے ہیں، اور ان کی حفاظت کیسے کرتے ہیں۔
              </p>
            </div>
          </motion.div>

          {/* Detailed Sections List */}
          <div className="space-y-8">
            {sections.map((section, idx) => {
              const SectionIcon = section.icon;
              return (
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
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <SectionIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                        {section.titleEng}
                      </h3>
                    </div>
                    <div className="text-slate-600 font-medium leading-relaxed text-sm md:text-base text-justify">
                      {section.paraEng}
                    </div>
                  </div>

                  {/* Urdu Column */}
                  <div className="lg:col-span-6 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10" dir="rtl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <SectionIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-950 tracking-wide font-sans text-right">
                        {section.titleUrdu}
                      </h3>
                    </div>
                    <div className="text-slate-850 font-medium text-right leading-loose text-sm md:text-base">
                      {section.paraUrdu}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Contact Footer Teaser */}
          <div className="bg-emerald-950 p-8 md:p-12 rounded-[2.5rem] text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-white">Have Questions?</h3>
            <p className="text-emerald-100/70 text-xs md:text-sm max-w-xl mx-auto">
              If you have any doubts about our privacy policies, feel free to reach out to our team. Your trust means everything to AsaanSafar.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
