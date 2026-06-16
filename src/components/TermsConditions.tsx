import { motion } from 'motion/react';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Clock } from 'lucide-react';

export default function TermsConditions() {
  const terms = [
    "We only list scheduled non-AC buses with fixed routes and known operators.",
    "Bus timings and fares may change without prior notice.",
    "Users should confirm important travel details directly with bus operators before traveling.",
    "We are not responsible for delays caused by transport operators.",
    "We do not list random local buses with irregular schedules.",
    "Users must not misuse our platform for illegal activities."
  ];

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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Scale className="w-4 h-4" /> Usage Agreement
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Terms & <span className="text-amber-600">Conditions</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              By using AsaanSafar, you agree to the following terms and guidelines for using our platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Introduction Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Our Agreement</h2>
                  <p className="text-slate-500 leading-relaxed">
                    These terms govern your use of the AsaanSafar website and services. We aim to provide transparency in public transit information across Pakistan.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms List */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-emerald-500" /> Key Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terms.map((term, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                    <p className="text-slate-700 font-medium leading-relaxed">{term}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer Section */}
            <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
                <h2 className="text-xl font-bold text-rose-950">Important Notice</h2>
              </div>
              <p className="text-rose-900/70 leading-relaxed">
                AsaanSafar is an information aggregator. While we strive for 100% accuracy, we are not a transport operator. Always arrive at the terminal at least 30 minutes before the scheduled departure and verify details at the counter.
              </p>
            </div>

            {/* Updates Section */}
            <div className="pt-12 border-t border-slate-100 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Policy Updates</h3>
              <p className="text-slate-600 max-w-xl mx-auto">
                We reserve the right to update these terms at any time to reflect changes in our service or transport industry standards. Continued use of the platform constitutes acceptance of revised terms.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
