import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ArrowLeft, Bus, Compass, MessageSquare, ClipboardCheck, Coins, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FAQs() {
  const navigate = useNavigate();

  const faqList = [
    {
      qEng: "What is AsaanSafar?",
      qUrdu: "آسان سفر کیا ہے؟",
      aEng: "AsaanSafar is a travel information platform that provides verified information about non-AC bus services across Pakistan, including routes, schedules, fares, contact numbers, and bus details.",
      aUrdu: "آسان سفر ایک معلوماتی پلیٹ فارم ہے جو پاکستان میں نان اے سی بس سروسز کے روٹس، اوقات، کرایوں، رابطہ نمبرز اور دیگر سفری معلومات فراہم کرتا ہے۔",
      icon: Bus
    },
    {
      qEng: "Is AsaanSafar a bus company?",
      qUrdu: "کیا آسان سفر کوئی بس کمپنی ہے؟",
      aEng: "No. AsaanSafar is an independent information platform. We do not operate buses, sell tickets, or provide transportation services.",
      aUrdu: "نہیں۔ آسان سفر ایک آزاد معلوماتی پلیٹ فارم ہے۔ ہم نہ بسیں چلاتے ہیں اور نہ ہی ٹکٹ فروخت کرتے ہیں۔",
      icon: Compass
    },
    {
      qEng: "Is the information on AsaanSafar verified?",
      qUrdu: "کیا آسان سفر پر موجود معلومات تصدیق شدہ ہوتی ہیں؟",
      aEng: "Yes. We strive to collect and verify information before publishing it. However, travelers are advised to confirm important details with the respective bus operator before traveling.",
      aUrdu: "ہم معلومات کو شائع کرنے سے پہلے حتی الامکان تصدیق کرنے کی کوشش کرتے ہیں، تاہم سفر سے پہلے متعلقہ بس آپریٹر سے معلومات کی تصدیق ضرور کر لیں۔",
      icon: ClipboardCheck
    },
    {
      qEng: "Does AsaanSafar provide ticket booking services?",
      qUrdu: "کیا آسان سفر ٹکٹ بکنگ کی سہولت فراہم کرتا ہے؟",
      aEng: "No. Currently, AsaanSafar only provides travel information and does not offer ticket booking services.",
      aUrdu: "نہیں۔ فی الحال آسان سفر صرف معلومات فراہم کرتا ہے اور ٹکٹ بکنگ سروس فراہم نہیں کرتا۔",
      icon: Coins
    },
    {
      qEng: "How often is the information updated?",
      qUrdu: "معلومات کتنی بار اپ ڈیٹ کی جاتی ہیں؟",
      aEng: "Our team regularly reviews and updates bus schedules, fares, routes, and contact information to maintain accuracy.",
      aUrdu: "ہماری ٹیم باقاعدگی سے بسوں کے اوقات، کرایوں، روٹس اور دیگر معلومات کا جائزہ لے کر انہیں اپ ڈیٹ کرتی ہے۔",
      icon: RefreshCw
    },
    {
      qEng: "Can bus schedules change?",
      qUrdu: "کیا بسوں کے اوقات تبدیل ہو سکتے ہیں؟",
      aEng: "Yes. Bus operators may change schedules, fares, routes, or contact details without prior notice. Always confirm important information before your journey.",
      aUrdu: "جی ہاں۔ بس آپریٹرز کسی بھی وقت اوقات، کرایوں یا روٹس میں تبدیلی کر سکتے ہیں۔",
      icon: MessageSquare
    },
    {
      qEng: "Is AsaanSafar free to use?",
      qUrdu: "کیا آسان سفر استعمال کرنا مفت ہے؟",
      aEng: "Yes. AsaanSafar is completely free for travelers.",
      aUrdu: "جی ہاں۔ آسان سفر تمام مسافروں کے لیے مفت ہے۔",
      icon: Coins
    },
    {
      qEng: "How can I report incorrect information?",
      qUrdu: "اگر کوئی معلومات غلط ہو تو میں کیا کروں؟",
      aEng: "You can contact us through our Contact Us page or official social media channels to report outdated or incorrect information.",
      aUrdu: "آپ Contact Us صفحے یا ہمارے سوشل میڈیا چینلز کے ذریعے ہمیں آگاہ کر سکتے ہیں۔",
      icon: MessageSquare
    },
    {
      qEng: "Which areas of Pakistan does AsaanSafar cover?",
      qUrdu: "آسان سفر کن علاقوں کی معلومات فراہم کرتا ہے؟",
      aEng: "Our goal is to provide verified bus information from all major cities and routes across Pakistan.",
      aUrdu: "ہمارا مقصد پاکستان کے تمام بڑے شہروں اور اہم بس روٹس کی تصدیق شدہ معلومات فراہم کرنا ہے۔",
      icon: Compass
    },
    {
      qEng: "Why should I use AsaanSafar?",
      qUrdu: "آسان سفر استعمال کرنے کا فائدہ کیا ہے؟",
      aEng: "AsaanSafar helps travelers save time by providing verified bus schedules, fares, routes, and contact information in one convenient platform.",
      aUrdu: "آسان سفر آپ کا وقت بچاتا ہے اور ایک ہی جگہ پر بسوں کے اوقات، کرایوں، روٹس اور رابطہ معلومات فراہم کرتا ہے۔",
      icon: HelpCircle
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
              Frequently <span className="text-emerald-400">Asked Qs</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>ANSWERS & GUIDES</span> • <span>آسان سفر سوالات و جوابات</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Have questions about Schedules, Verification processes, or Bus details? Find fast, direct responses in both English and Urdu below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-10 relative z-10 space-y-8">
        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase">Commuters Help Center</h2>
              <p className="text-xs text-slate-500 font-bold">ہمیشہ آپ کی رہنمائی کے لیے کوشاں</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-650 max-w-sm text-right leading-relaxed" dir="rtl">
            آسان سفر ڈائریکٹری کے متعلق کثرت سے پوچھے گئے سوالات کے جوابات یہاں حاصل کریں۔ اپنے سفر کو مزید آسان بنائیں۔
          </p>
        </motion.div>

        {/* FAQs List */}
        <div className="space-y-6">
          {faqList.map((faq, idx) => {
            const FaqIcon = faq.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm"
              >
                {/* Header Icon Block */}
                <div className="bg-slate-50/55 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <FaqIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
                    Q. 0{idx + 1}
                  </span>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* English FAQ block */}
                  <div className="space-y-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {faq.qEng}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.aEng}
                    </p>
                  </div>

                  {/* Urdu FAQ block */}
                  <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-8 text-right" dir="rtl">
                    <h3 className="text-base font-black text-emerald-950 font-sans">
                      {faq.qUrdu}
                    </h3>
                    <p className="text-sm text-slate-850 leading-loose font-medium">
                      {faq.aUrdu}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
