import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, Info, BusFront, AlertTriangle, HelpCircle, Network, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Disclaimer() {
  const navigate = useNavigate();

  const sections = [
    {
      titleEng: "Information Accuracy",
      titleUrdu: "معلومات کی نوعیت",
      icon: Info,
      paraEng: (
        <div className="space-y-4">
          <p>
            AsaanSafar provides information related to non-AC bus services in Pakistan, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-slate-600">
            <li>Bus schedules</li>
            <li>Departure and arrival times</li>
            <li>Fares</li>
            <li>Routes</li>
            <li>Bus company information</li>
            <li>Contact numbers</li>
            <li>Vehicle details</li>
          </ul>
          <p>
            Transport operators may change schedules, fares, routes, contact information, or operational details without prior notice. Therefore, users are strongly advised to verify important travel information directly with the relevant bus operator before making travel plans.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4" dir="rtl">
          <p className="text-right">
            آسان سفر پاکستان میں نان اے سی بس سروسز سے متعلق معلومات فراہم کرتا ہے، جن میں شامل ہیں:
          </p>
          <ul className="list-disc pr-5 space-y-1 text-xs md:text-sm text-slate-800 text-right">
            <li>بسوں کے اوقاتِ روانگی و آمد</li>
            <li>کرائے</li>
            <li>روٹس</li>
            <li>بس کمپنیوں کی معلومات</li>
            <li>رابطہ نمبرز</li>
            <li>گاڑیوں سے متعلق معلومات</li>
          </ul>
          <p className="text-right">
            ٹرانسپورٹ آپریٹرز کسی بھی وقت اپنے اوقات، کرایوں، روٹس، رابطہ معلومات یا دیگر تفصیلات میں تبدیلی کر سکتے ہیں۔ لہٰذا مسافروں کو مشورہ دیا جاتا ہے کہ سفر سے قبل متعلقہ بس آپریٹر سے معلومات کی تصدیق ضرور کر لیں۔
          </p>
        </div>
      )
    },
    {
      titleEng: "No Transportation Services",
      titleUrdu: "ہم ٹرانسپورٹ سروس فراہم نہیں کرتے",
      icon: BusFront,
      paraEng: (
        <p>
          AsaanSafar is an independent travel information platform and does not own, operate, manage, or control any bus service, transport company, ticketing service, or transportation network. We do not provide transportation services, ticket booking services, or travel guarantees.
        </p>
      ),
      paraUrdu: (
        <div className="space-y-3" dir="rtl">
          <p className="text-right">آسان سفر ایک آزاد معلوماتی پلیٹ فارم ہے۔ ہم:</p>
          <ul className="list-disc pr-5 space-y-1 text-xs md:text-sm text-slate-800 text-right">
            <li>کسی بس کمپنی کے مالک نہیں ہیں۔</li>
            <li>کسی ٹرانسپورٹ سروس کو آپریٹ نہیں کرتے۔</li>
            <li>ٹکٹ بکنگ سروس فراہم نہیں کرتے۔</li>
            <li>کسی سفر یا سروس کی ضمانت نہیں دیتے۔</li>
          </ul>
          <p className="text-right text-xs text-slate-500 font-bold">
            ہم صرف معلومات فراہم کرتے ہیں تاکہ مسافر بہتر سفری فیصلے کر سکیں۔
          </p>
        </div>
      )
    },
    {
      titleEng: "No Liability",
      titleUrdu: "ذمہ داری کی نفی",
      icon: AlertTriangle,
      paraEng: (
        <div className="space-y-4">
          <p>AsaanSafar shall not be held responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-slate-600">
            <li>Delayed departures or arrivals</li>
            <li>Schedule changes</li>
            <li>Fare changes</li>
            <li>Service cancellations</li>
            <li>Incorrect information supplied by third parties</li>
            <li>Travel disruptions</li>
            <li>Financial losses or inconveniences arising from travel decisions</li>
          </ul>
          <p className="text-xs text-slate-500 font-bold italic">
            Any reliance you place on information found on this website is strictly at your own risk.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right" dir="rtl">
          <p>آسان سفر درج ذیل معاملات کا ذمہ دار نہیں ہوگا:</p>
          <ul className="list-disc pr-5 space-y-1 text-xs md:text-sm text-slate-800 text-right">
            <li>بسوں کی تاخیر</li>
            <li>بس سروس کی منسوخی</li>
            <li>کرایوں میں تبدیلی</li>
            <li>شیڈول میں تبدیلی</li>
            <li>تیسرے فریق کی جانب سے فراہم کردہ غلط معلومات</li>
            <li>سفری رکاوٹیں یا مسائل</li>
            <li>مالی نقصان، وقت کا ضیاع یا کسی بھی قسم کی تکلیف</li>
          </ul>
          <p className="text-xs text-slate-750 font-bold italic">
            ویب سائٹ پر موجود معلومات کا استعمال صارف اپنی ذمہ داری اور صوابدید پر کرتا ہے۔
          </p>
        </div>
      )
    },
    {
      titleEng: "Third-Party Information & External Links",
      titleUrdu: "تیسرے فریق کی معلومات اور بیرونی روابط",
      icon: Network,
      paraEng: (
        <div className="space-y-4">
          <p>
            Some information published on AsaanSafar may be collected from transport operators, public sources, field surveys, or third-party providers. While we strive to verify all information, we cannot guarantee that all data will remain accurate at all times.
          </p>
          <p>
            This website may contain links to external websites for additional information or convenience. AsaanSafar has no control over the content, policies, or practices of third-party websites and accepts no responsibility for them.
          </p>
        </div>
      ),
      paraUrdu: (
        <div className="space-y-4 text-right" dir="rtl">
          <p>
            ویب سائٹ پر موجود بعض معلومات ٹرانسپورٹ آپریٹرز، فیلڈ سرویز، عوامی ذرائع یا دیگر تیسرے فریق سے حاصل کی جا سکتی ہے۔ اگرچہ ہم معلومات کی تصدیق کی کوشش کرتے ہیں، تاہم ہر وقت تمام معلومات کی مکمل درستگی کی ضمانت نہیں دی جا سکتی۔
          </p>
          <p>
            آسان سفر پر دیگر ویب سائٹس کے لنکس موجود ہو سکتے ہیں۔ ان ویب سائٹس کے مواد، خدمات، رازداری کی پالیسیوں یا کاروباری سرگرمیوں کی ذمہ داری آسان سفر پر عائد نہیں ہوگی۔
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
          We strive to keep the website operational and up to date. However, we do not guarantee uninterrupted access and reserve the right to modify, suspend, or discontinue any part of the website without prior notice.
        </p>
      ),
      paraUrdu: (
        <p dir="rtl" className="text-right">
          ہم ویب سائٹ کو فعال اور تازہ رکھنے کی کوشش کرتے ہیں، تاہم مسلسل اور بلا تعطل دستیابی کی ضمانت نہیں دی جا سکتی۔ ہم کسی بھی وقت بغیر پیشگی اطلاع ویب سائٹ کے کسی بھی حصے میں تبدیلی، معطلی یا بندش کا حق محفوظ رکھتے ہیں۔
        </p>
      )
    },
    {
      titleEng: "Changes to This Disclaimer",
      titleUrdu: "ڈسکلیمر میں تبدیلیاں",
      icon: RefreshCw,
      paraEng: (
        <p>
          AsaanSafar reserves the right to update or modify this Disclaimer at any time. Any changes will be effective immediately upon publication on this page.
        </p>
      ),
      paraUrdu: (
        <p dir="rtl" className="text-right">
          آسان سفر اس ڈسکلیمر میں کسی بھی وقت ترمیم یا تبدیلی کرنے کا حق محفوظ رکھتا ہے۔ نئی تبدیلیاں اس صفحے پر شائع ہوتے ہی نافذ العمل تصور کی جائیں گی۔
        </p>
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
              AsaanSafar <span className="text-emerald-400">Disclaimer</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>Last Updated: June 2026</span> • <span>آخری اپ ڈیٹ: جون 2026</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Please read this Disclaimer carefully before planning your journey. We are and remain an independent verified bus transit hub in Pakistan.
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
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-2">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Important Disclaimer
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                The information provided on this website is for general informational purposes only. While we make every reasonable effort to ensure that the information published on AsaanSafar is accurate, verified, and up to date, we make no guarantees regarding the completeness, reliability, accuracy, or availability of any information displayed on the website.
              </p>
            </div>
            
            <div className="bg-amber-50/20 border border-amber-100/30 p-8 rounded-3xl" dir="rtl">
              <h2 className="text-2xl font-black text-emerald-950 font-sans text-right mb-4">
                دستبرداری (Disclaimer)
              </h2>
              <p className="text-slate-800 font-medium leading-loose text-sm md:text-base text-right">
                اس ویب سائٹ پر فراہم کی جانے والی تمام معلومات صرف عمومی معلوماتی مقاصد کے لیے ہیں۔ اگرچہ ہم معلومات کو درست، تصدیق شدہ اور تازہ رکھنے کی بھرپور کوشش کرتے ہیں، تاہم ہم ویب سائٹ پر موجود معلومات کی مکمل درستگی، دستیابی، قابلِ اعتماد ہونے یا مکمل ہونے کی کوئی ضمانت نہیں دیتے۔
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
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
                        <SectionIcon className="w-5 h-5 text-emerald-600" />
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
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
                        <SectionIcon className="w-5 h-5 text-emerald-600" />
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

          {/* Core Support / Contact Info */}
          <div className="bg-emerald-950 p-8 md:p-12 rounded-[2.5rem] text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-white">Verification Assistance</h3>
            <p className="text-emerald-100/70 text-xs md:text-sm max-w-xl mx-auto">
              If you have any feedback or notice any outdated timing schedules or fares, please inform us on our official support channels immediately.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <span>Report Outdated Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
