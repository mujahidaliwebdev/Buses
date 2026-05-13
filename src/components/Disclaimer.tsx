import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, Info, Clock, ExternalLink } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Header Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <AlertCircle className="w-4 h-4" /> Legal Notice
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Legal <span className="text-rose-600">Disclaimer</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please read this disclaimer carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-slate lg:prose-lg mx-auto">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 mt-0">General Information</h2>
                  <p className="text-slate-500 font-bold leading-relaxed m-0 mb-4 bg-rose-50/50 p-3 rounded-lg border border-rose-100/50">
                    We are an independent transportation information platform and are not officially affiliated with any bus company.
                  </p>
                  <p className="text-slate-500 leading-relaxed m-0">
                    The information provided by AsaanBusSafar ("we," "us," or "our") on our website is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 border border-slate-100 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" /> Accuracy of Data
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Bus schedules, timings, and fares are subject to change by the respective operators without prior notice. We do not guarantee that the information here is 100% accurate at all times.
                </p>
              </div>
              <div className="p-8 border border-slate-100 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-emerald-500" /> External Links
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy by us.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[2rem] text-white">
               <h3 className="text-xl font-bold mb-4 text-emerald-400">Professional Advice</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 The site cannot and does not contain travel consultancy advice. The travel information is provided for general informational and educational purposes only and is not a substitute for professional advice.
               </p>
               <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest pt-6 border-t border-white/10">
                 <Clock className="w-4 h-4" />
                 Published May 2026
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
