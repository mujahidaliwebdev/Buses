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
      aEng: "AsaanSafar is Pakistan's first verified non-AC bus database and timing directory. We focus on cataloging regular bus schedules, fares, and operator details to bring clarity and ease to the travel planning of general passengers.",
      aUrdu: "آسان سفر پاکستان کا پہلا تصدیق شدہ نان اے سی بس ڈیٹا بیس اور ٹائمنگ گائیڈ ہے۔ ہمارا مقصد بسوں کے باقاعدہ نظام الاوقات، کرایوں اور آپریٹرز کی معلومات فراہم کرنا ہے تاکہ عام مسافروں کے لیے سفر کی منصوبہ بندی آسان بنائی جا سکے۔",
      icon: Bus
    },
    {
      qEng: "How is the travel information verified?",
      qUrdu: "سفری معلومات کی تصدیق کیسے کی جاتی ہے؟",
      aEng: "Our dedicated field teams regularly visit general transport terminals (like Lahore's Badami Bagh and other regional hubs) to collect manual schedule entries, current fare guides, and operator hotlines. Every route listed undergoes physical or dynamic verifying.",
      aUrdu: "ہماری فیلڈ ٹیمیں باقاعدگی سے مختلف جنرل ٹرانسپورٹ ٹرمینلز (جیسے لاہور کا بادامی باغ لاری اڈا) کا دورہ کرتی ہیں اور مینوئل شیڈول، موجودہ کرایوں اور آپریٹرز کے فون نمبرز جمع کرتی ہیں۔ ہر روٹ کی معلومات تصدیق کے بعد ہی شائع کی جاتی ہیں۔",
      icon: ClipboardCheck
    },
    {
      qEng: "Can I book seats or purchase bus tickets directly?",
      qUrdu: "کیا میں براہِ راست سیٹیں یا بس ٹکٹ بک کر سکتا ہوں؟",
      aEng: "No. AsaanSafar is an independent travel directory and resource. We do not own bus fleets, operate ticketing setups, or charge booking commissions. We provide accurate contact numbers and schedules so passengers can make their own booking arrangements directly.",
      aUrdu: "جی نہیں، آسان سفر ایک خود مختار معلوماتی گائیڈ ہے۔ ہم بسوں کے مالک نہیں ہیں اور نہ ہی ٹکٹ بکنگ کا کوئی چارج لیتے ہیں۔ ہم صرف تصدیق شدہ اوقات اور رابطہ نمبرز فراہم کرتے ہیں تاکہ مسافر براہِ راست خود اپنی بکنگ کا انتظام کر سکیں۔",
      icon: Coins
    },
    {
      qEng: "How can I report outdated data or suggest a route?",
      qUrdu: "میں غلط معلومات کی رپورٹ یا نیا روٹ کیسے تجویز کروں؟",
      aEng: "We welcome contributions! You can click the 'Submit Route' button in the menu, fill out our prompt interface, or drop us a voice/text update on our official Facebook or email channels. Our field team will review and publish it.",
      aUrdu: "ہم آپ کی شرکت کا خیرمقدم کرتے ہیں! آپ مینو میں 'سفر تجویز کریں' کے بٹن پر کلک کر کے فارم پر کر سکتے ہیں، یا ہمارے آفیشل فیس بک پیج یا ای میل پر پیغام بھیج سکتے ہیں۔ ہماری ٹیم تفصیلات کا جائزہ لے کر اسے اپ ڈیٹ کر دے گی۔",
      icon: MessageSquare
    },
    {
      qEng: "Is this platform free for commuters?",
      qUrdu: "کیا یہ پلیٹ فارم مسافروں کے لیے مفت ہے؟",
      aEng: "Absolutely. AsaanSafar's directory is, and always will be, 100% free of charge for passengers and travelers across Pakistan. Our aim is to democratize basic transport convenience.",
      aUrdu: "جی ہاں، بالکل۔ آسان سفر کی معلوماتی ڈائریکٹری پاکستان بھر کے تمام مسافروں کے لیے ۱۰۰٪ مفت ہے اور ہمیشہ مفت رہے گی۔ ہمارا مقصد سفری معلومات تک آسان اور یکساں رسائی فراہم کرنا ہے۔",
      icon: Compass
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
