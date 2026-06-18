import { motion } from 'motion/react';
import { Gavel, ArrowLeft, ShieldAlert, CheckCircle2, ScrollText, Users, Globe, ExternalLink, HelpCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsConditions() {
  const navigate = useNavigate();

  const sections = [
    {
      titleEng: "About AsaanSafar",
      titleUrdu: "آسان سفر کے بارے میں",
      icon: ScrollText,
      paraEng: (
        <p>
          AsaanSafar is an independent travel information platform that provides information about non-AC bus services in Pakistan, including routes, schedules, fares, contact details, and related travel information.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          آسان سفر ایک آزاد سفری معلوماتی پلیٹ فارم ہے جو پاکستان میں نان اے سی بس سروسز سے متعلق معلومات فراہم کرتا ہے، جن میں روٹس، اوقاتِ روانگی و آمد، کرائے، رابطہ نمبرز اور دیگر سفری معلومات شامل ہیں۔
        </p>
      )
    },
    {
      titleEng: "Acceptance of Terms",
      titleUrdu: "شرائط کی قبولیت",
      icon: CheckCircle2,
      paraEng: (
        <p>
          By accessing, browsing, or using AsaanSafar, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          ویب سائٹ تک رسائی، براؤزنگ یا استعمال کے ذریعے آپ اس بات کی تصدیق کرتے ہیں کہ آپ نے ان شرائط و ضوابط کو پڑھ لیا ہے، سمجھ لیا ہے اور ان سے اتفاق کرتے ہیں۔
        </p>
      )
    },
    {
      titleEng: "Information Disclaimer",
      titleUrdu: "معلومات سے متعلق دستبرداری",
      icon: ShieldAlert,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar strives to provide accurate and up-to-date information. However, bus schedules, fares, routes, contact numbers, and other travel-related details may change without prior notice.
          </p>
          <p>
            We do not guarantee the completeness, accuracy, or availability of any information displayed on the website. Users should independently verify important travel information with the relevant transport operator before making travel arrangements.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right">
          <p>
            آسان سفر درست اور تازہ معلومات فراہم کرنے کی بھرپور کوشش کرتا ہے۔ تاہم بسوں کے اوقات، کرائے، روٹس، رابطہ نمبرز اور دیگر معلومات کسی بھی وقت بغیر پیشگی اطلاع تبدیل ہو سکتی ہیں۔
          </p>
          <p>
            ہم ویب سائٹ پر موجود ہر معلومات کی مکمل درستگی، دستیابی یا تکمیل کی ضمانت نہیں دیتے۔ مسافروں کو مشورہ دیا جاتا ہے کہ سفر سے قبل متعلقہ ٹرانسپورٹ آپریٹر سے معلومات کی تصدیق ضرور کریں۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Independent Platform",
      titleUrdu: "آزاد پلیٹ فارم",
      icon: Globe,
      paraEng: (
        <p>
          AsaanSafar is not affiliated with, endorsed by, or operated by any bus company, transport operator, or government authority unless explicitly stated. All information is provided for informational purposes only.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          آسان سفر کسی بس کمپنی، ٹرانسپورٹ آپریٹر یا سرکاری ادارے کی ملکیت نہیں ہے اور نہ ہی ان کی جانب سے چلایا جاتا ہے، الا یہ کہ واضح طور پر بیان کیا گیا ہو۔ ویب سائٹ پر موجود تمام معلومات صرف معلوماتی مقاصد کے لیے فراہم کی جاتی ہیں۔
        </p>
      )
    },
    {
      titleEng: "User Responsibilities",
      titleUrdu: "صاہر کی ذمہ داریاں",
      icon: Users,
      paraEng: (
        <div className="space-y-4">
          <p>By using this website, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600">
            <li>Use the website lawfully and responsibly.</li>
            <li>Verify travel information before traveling.</li>
            <li>Refrain from attempting to disrupt or damage the website.</li>
            <li>Avoid submitting false, misleading, or harmful information.</li>
          </ul>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right">
          <p>ویب سائٹ استعمال کرتے وقت آپ اس بات سے اتفاق کرتے ہیں کہ:</p>
          <ul className="list-disc pr-5 space-y-1.5 text-xs md:text-sm text-slate-800 text-right" dir="rtl">
            <li>ویب سائٹ کو قانونی اور ذمہ دارانہ طریقے سے استعمال کریں گے۔</li>
            <li>سفر سے قبل معلومات کی تصدیق کریں گے۔</li>
            <li>ویب سائٹ کو نقصان پہنچانے یا اس کے نظام میں مداخلت کی کوشش نہیں کریں گے۔</li>
            <li>غلط، گمراہ کن یا نقصان دہ معلومات فراہم نہیں کریں گے۔</li>
          </ul>
        </div>
      )
    },
    {
      titleEng: "Intellectual Property",
      titleUrdu: "دانشورانہ املاک",
      icon: Lock,
      paraEng: (
        <p>
          Unless otherwise stated, all content on AsaanSafar, including text, design, logos, graphics, and website structure, is the property of AsaanSafar and may not be copied, reproduced, or distributed without permission.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          اگر الگ سے ذکر نہ کیا گیا ہو تو آسان سفر پر موجود تمام مواد، بشمول متن، ڈیزائن، لوگو، گرافکس اور ویب سائٹ کی ساخت، آسان سفر کی ملکیت ہے۔ بغیر اجازت اس مواد کی نقل، تقسیم یا تجارتی استعمال کی اجازت نہیں ہے۔
        </p>
      )
    },
    {
      titleEng: "Third-Party Links",
      titleUrdu: "بیرونی روابط",
      icon: ExternalLink,
      paraEng: (
        <p>
          Our website may contain links to third-party websites for user convenience. We are not responsible for the content, policies, services, or practices of any external websites.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          ویب سائٹ پر سہولت کے لیے دیگر ویب سائٹس کے لنکس موجود ہو سکتے ہیں۔ ان ویب سائٹس کے مواد، خدمات یا پالیسیوں کی ذمہ داری آسان سفر پر عائد نہیں ہوگی۔
        </p>
      )
    },
    {
      titleEng: "Limitation of Liability",
      titleUrdu: "ذمہ داری کی حد",
      icon: ShieldAlert,
      paraEng: (
        <div className="space-y-4">
          <p>AsaanSafar shall not be held liable for:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600">
            <li>Delayed or cancelled bus services</li>
            <li>Changes in fares or schedules</li>
            <li>Incorrect information provided by third parties</li>
            <li>Travel disruptions or losses</li>
            <li>Any direct or indirect damages resulting from the use of our website</li>
          </ul>
          <p className="text-xs text-slate-500 font-bold italic mt-2">
            Users use the information provided on AsaanSafar at their own discretion and risk.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right">
          <p>آسان سفر درج ذیل معاملات کا ذمہ دار نہیں ہوگا:</p>
          <ul className="list-disc pr-5 space-y-1.5 text-xs md:text-sm text-slate-800 text-right" dir="rtl">
            <li>بسبوں کی تاخیر یا منسوخی</li>
            <li>کرایوں یا اوقات میں تبدیلی</li>
            <li>تیسرے فریق کی جانب سے فراہم کردہ غلط معلومات</li>
            <li>سفری رکاوٹیں یا نقصانات</li>
            <li>ویب سائٹ کے استعمال کے نتیجے میں ہونے والے کسی بھی براہِ راست یا بالواسطہ نقصان</li>
          </ul>
          <p className="text-xs text-slate-700 font-bold italic mt-2">
            صارفین ویب سائٹ پر موجود معلومات کو اپنی صوابدید اور ذمہ داری پر استعمال کرتے ہیں۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Website Availability",
      titleUrdu: "ویب سائٹ کی دستیابی",
      icon: HelpCircle,
      paraEng: (
        <p>
          We strive to keep the website available and functioning properly. However, we do not guarantee uninterrupted access and may suspend or modify services at any time without prior notice.
        </p>
      ),
      paraUrdu: (
        <p className="text-right">
          ہم ویب سائٹ کو فعال اور دستیاب رکھنے کی کوشش کرتے ہیں، تاہم مسلسل اور بلا تعطل دستیابی کی ضمانت نہیں دی جا سکتی۔ ہم کسی بھی وقت بغیر پیشگی اطلاع خدمات میں تبدیلی یا عارضی معطلی کا حق محفوظ رکھتے ہیں۔
        </p>
      )
    },
    {
      titleEng: "Changes & Governing Principles",
      titleUrdu: "شرائط میں تبدیلی اور قابلِ اطلاق اصول",
      icon: ScrollText,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar reserves the right to update, modify, or replace these Terms & Conditions at any time. Changes will become effective immediately upon publication on this page.
          </p>
          <p>
            These Terms & Conditions shall be interpreted in accordance with applicable laws and general principles of fair use and responsible internet usage.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right" dir="rtl">
          <p>
            آسان سفر کسی بھی وقت ان شرائط و ضوابط میں ترمیم، اضافہ یا تبدیلی کا حق محفوظ رکھتا ہے۔ نئی شرائط اس صفحے پر شائع ہوتے ہی نافذ العمل سمجھی جائیں گی۔
          </p>
          <p>
            یہ شرائط و ضوابط قابلِ اطلاق قوانین، منصفانہ استعمال کے اصولوں اور ذمہ دارانہ انٹرنیٹ استعمال کے مطابق تشریح کیے جائیں گے۔
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
              Terms & <span className="text-emerald-400">Conditions</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>Last Updated: June 2026</span> • <span>آخری اپ ڈیٹ: جون 2026</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Welcome to AsaanSafar. By accessing and using our website, you agree to comply with and be bound by the following Terms & Conditions.
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
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Terms of Use
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                Welcome to AsaanSafar. By accessing and using our website, you agree to comply with and be bound by the following Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
              </p>
            </div>
            
            <div className="bg-emerald-50/50 border border-emerald-100/55 p-8 rounded-3xl" dir="rtl">
              <h2 className="text-2xl font-black text-emerald-950 font-sans text-right mb-4">
                شرائط و ضوابط
              </h2>
              <p className="text-slate-800 font-medium leading-loose text-sm md:text-base text-right">
                آسان سفر میں خوش آمدید۔ ہماری ویب سائٹ تک رسائی حاصل کرنے اور اسے استعمال کرنے کے ذریعے آپ ان شرائط و ضوابط سے اتفاق کرتے ہیں۔ اگر آپ ان شرائط کے کسی حصے سے متفق نہیں ہیں تو براہِ کرم ویب سائٹ استعمال نہ کریں۔
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

          {/* Governing contact statement */}
          <div className="bg-emerald-950 p-8 md:p-12 rounded-[2.5rem] text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-white font-sans">Contact our Legal and Administration Team</h3>
            <p className="text-emerald-100/70 text-xs md:text-sm max-w-xl mx-auto">
              If you have any questions or concern regarding these terms, send an inquiry through our communication desk.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <span>Inquire Legal Desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
