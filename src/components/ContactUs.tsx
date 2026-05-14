import { motion } from 'motion/react';
import { Mail, Globe, Phone, MessageSquare, Send, MapPin, AlertCircle, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      value: "support@asaanbussafar.com",
      link: "mailto:support@asaanbussafar.com",
      type: "link"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Official Website",
      value: "www.asaanbussafar.com",
      link: "https://www.asaanbussafar.com",
      type: "link"
    }
  ];

  const phoneNumbers = [
    { label: "0300-8155443", value: "03008155443" },
    { label: "0301-4321122", value: "03014321122" }
  ];

  const topics = [
    "Incorrect bus timing reports",
    "Incorrect fare reports",
    "Missing route suggestions",
    "Business inquiries",
    "General feedback"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <MessageSquare className="w-4 h-4" /> Get In Touch
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Contact <span className="text-blue-600">Us</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              If you find incorrect information or want to suggest new routes, feel free to contact us. We aim to improve our platform by keeping transport information accurate and updated.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Side: Info & Topics */}
            <div>
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Reach Out?</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Your feedback helps us maintain the most reliable bus schedule network in Pakistan. You can contact us for:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topics.map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-semibold text-slate-700">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, i) => (
                  <a 
                    key={i} 
                    href={method.link}
                    target={method.type === 'link' && !method.link.startsWith('mailto') ? "_blank" : undefined}
                    rel={method.type === 'link' && !method.link.startsWith('mailto') ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{method.title}</h4>
                      <p className="text-lg font-bold text-slate-800">{method.value}</p>
                    </div>
                  </a>
                ))}

                {/* Phone Numbers with Call/WhatsApp toggle */}
                <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Support</h4>
                      <p className="text-lg font-bold text-slate-800">Direct Assistance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {phoneNumbers.map((phone, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/50">
                        <span className="font-bold text-slate-700">{phone.label}</span>
                        <div className="flex gap-2">
                          <a 
                            href={`tel:${phone.value}`}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs font-bold transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            CALL
                          </a>
                          <a 
                            href={`https://wa.me/92${phone.value.substring(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WHATSAPP
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Simple Contact Form Decoration or Additional Text */}
            <div className="lg:pl-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden h-full flex flex-col justify-center">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6">Help Us Improve</h2>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    AsaanBusSafar is built for the community. If you are a terminal manager or a frequent traveler, your insights are invaluable. 
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
                      <div>
                        <h4 className="font-bold mb-1">Verify Data</h4>
                        <p className="text-sm text-slate-400">We cross-check all reports before updating the platform.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <MapPin className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-bold mb-1">Expand Network</h4>
                        <p className="text-sm text-slate-400">Suggest new cities and terminals you want to see here.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
