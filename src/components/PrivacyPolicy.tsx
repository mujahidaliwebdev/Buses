import { motion } from 'motion/react';
import { Shield, Lock, Eye, Cookie, Mail, CheckCircle } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-4 h-4" /> Data Protection
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Privacy <span className="text-indigo-600">Policy</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              At AsaanBusSafar, we respect your privacy and are committed to protecting any information we collect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Collection Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We may collect limited information to provide and improve our services, such as:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Search queries",
                  "Website analytics data",
                  "Contact form submissions"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Section */}
            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-indigo-950">How We Use Information</h2>
              </div>
              <p className="text-indigo-900/70 leading-relaxed">
                This information helps us improve our services and provide a better user experience for transit planning. We do not sell personal information to third parties.
              </p>
            </div>

            {/* Third Party Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Cookie className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Cookies & Third-Party Services</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Third-party services such as Google Analytics and Google AdSense may use cookies for analytics and advertising purposes. These cookies help analyze traffic and serve relevant ads based on your visit to our site and other sites on the internet.
              </p>
            </div>

            {/* Consent & Contact */}
            <div className="pt-12 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Agreement</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                By using our website, you agree to this privacy policy. We may update this policy from time to time, so we encourage you to review it periodically.
              </p>
              
              <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col items-center text-center">
                <Mail className="w-8 h-8 text-indigo-400 mb-4" />
                <h4 className="text-lg font-bold mb-2">Privacy Concerns?</h4>
                <p className="text-slate-400 mb-6 font-medium">For any questions regarding your data, contact us at:</p>
                <a href="mailto:support@asaanbussafar.com" className="text-xl font-bold hover:text-indigo-400 transition-colors">
                  support@asaanbussafar.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
