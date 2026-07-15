import { motion } from 'motion/react';
import { Zap, CheckCircle2, Phone, MessageSquare, ExternalLink, Search } from 'lucide-react';

interface FeaturesProps {
  onRouteClick?: (origin: string, destination: string) => void;
}

export default function Features({ onRouteClick }: FeaturesProps) {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Grid layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Roadways and Hashtags */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#f0fdf4] rounded-[2.5rem] p-12 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-12 opacity-[0.03] pointer-events-none">
                <Zap className="w-64 h-64 text-emerald-600" />
              </div>
              
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Digitizing Pakistan’s Roadways</h2>
                <p className="text-emerald-700/60 text-lg font-medium mb-12 leading-relaxed">
                  AsaanSafar is on a mission to bring full transparency to Non-AC bus travel. We bridge the gap between rural terminals and smart commuters by providing high-quality, verified data.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-12">
                   <div>
                     <span className="text-6xl font-black text-emerald-600 leading-none">50+</span>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">Cities Covered</p>
                   </div>
                   <div>
                     <span className="text-6xl font-black text-emerald-600 leading-none">1200+</span>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">Buses Daily</p>
                   </div>
                </div>
              </div>
            </motion.div>

             <div className="grid sm:grid-cols-2 gap-6">
               <motion.div
                 onClick={() => onRouteClick?.('Lahore', 'Faisalabad')}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 whileHover={{ y: -4 }}
                 className="h-64 bg-slate-900 rounded-[2rem] relative overflow-hidden group shadow-md flex flex-col justify-between cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all duration-300"
               >
                 <img 
                   src="https://lh3.googleusercontent.com/d/1-BrzJ33nF1RGGd1TqVidrwz8sV7S3mPU"
                   alt="Lahore to Faisalabad" 
                   className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent pointer-events-none" />
                 
                 <div className="absolute inset-0 p-8 flex flex-col justify-between">
                   <div className="flex justify-between items-center w-full z-10">
                     <span className="text-emerald-300 text-[10px] font-black bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/20 tracking-widest">#lahore_to_faisalabad</span>
                     <div className="w-8 h-8 rounded-full bg-emerald-600/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                       <Search className="w-4 h-4" />
                     </div>
                   </div>
                   <div className="z-10 mt-auto text-left">
                     <span className="text-white font-bold text-sm tracking-wide block mb-1">Lahore to Faisalabad details and timings card</span>
                     <div className="flex items-center gap-3">
                       <span className="text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1">
                         <Search className="w-3 h-3 animate-pulse" /> Search Route
                       </span>
                       <span className="text-slate-400 text-xs">|</span>
                       <a 
                         href="https://drive.google.com/file/d/1-BrzJ33nF1RGGd1TqVidrwz8sV7S3mPU/view?usp=sharing"
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className="text-emerald-300 text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:text-white transition-colors"
                       >
                         Original photo <ExternalLink className="w-3 h-3 inline" />
                       </a>
                     </div>
                   </div>
                 </div>
               </motion.div>

               <motion.div
                 onClick={() => onRouteClick?.('Lahore', 'Karachi')}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 whileHover={{ y: -4 }}
                 className="h-64 bg-emerald-950 rounded-[2rem] relative overflow-hidden group shadow-md flex flex-col justify-between cursor-pointer border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
               >
                 <img 
                   src="https://lh3.googleusercontent.com/d/1r2ggKGaAw2AmN4YTxenw2PWe3odWHAo0"
                   alt="Lahore to Karachi" 
                   className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent pointer-events-none" />
                 
                 <div className="absolute inset-0 p-8 flex flex-col justify-between">
                   <div className="flex justify-between items-center w-full z-10">
                     <span className="text-emerald-300 text-[10px] font-black bg-emerald-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/20 tracking-widest">#lahore_to_karachi</span>
                     <div className="w-8 h-8 rounded-full bg-emerald-600/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                       <Search className="w-4 h-4" />
                     </div>
                   </div>
                   <div className="z-10 mt-auto text-left">
                     <span className="text-white font-bold text-sm tracking-wide block mb-1">Lahore to Karachi details and timings card</span>
                     <div className="flex items-center gap-3">
                       <span className="text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1">
                         <Search className="w-3 h-3 animate-pulse" /> Search Route
                       </span>
                       <span className="text-slate-400 text-xs">|</span>
                       <a 
                         href="https://drive.google.com/file/d/1r2ggKGaAw2AmN4YTxenw2PWe3odWHAo0/view?usp=sharing"
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className="text-emerald-300 text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:text-white transition-colors"
                       >
                         Original photo <ExternalLink className="w-3 h-3 inline" />
                       </a>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
          </div>

          {/* Right Column: Why and Support */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 border border-slate-100 rounded-[2.5rem] shadow-sm"
            >
              <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">WHY ASAANSAFAR?</h2>
              <div className="space-y-8">
                {[
                  { title: 'Verified Fares', desc: 'Latest rates for local Non-AC and economy bus operators.' },
                  { title: 'Real-time Timings', desc: 'Accurate departure and arrival schedules for 50+ cities.' },
                  { title: 'Direct Contact', desc: 'Instant access to terminal help desk phone numbers.' },
                  { title: 'Non-AC Platform', desc: 'Specifically built for affordable and local bus travel.' }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="mt-1 bg-emerald-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                       <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#022c22] rounded-[2.5rem] p-8 text-white relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent pointer-events-none" />
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                        <Phone className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-emerald-400/50 uppercase tracking-[0.2em] mb-1">CUSTOMER SUPPORT</p>
                        <p className="text-xl font-black tracking-tight">0301-432-1122</p>
                     </div>
                  </div>

                  <div className="grid gap-3">
                     <a 
                        href="tel:+923014321122"
                        className="w-full py-4 bg-white text-[#022c22] rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl shadow-white/5 text-center"
                     >
                        <Phone className="w-4 h-4" /> CALL NOW
                     </a>
                     <a 
                        href="https://wa.me/923014321122"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 text-center"
                     >
                        <MessageSquare className="w-4 h-4" /> WHATSAPP
                     </a>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
