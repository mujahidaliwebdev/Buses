import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BLOGS } from '../data/mockBlogs';

export default function Blog() {
  const navigate = useNavigate();

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
              Safar Ki <span className="text-emerald-400">Kahaniyan</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>TRAVEL BLOGS & GUIDES</span> • <span>سفر کی کہانیاں اور تفصیلی رہنمائی</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Expert guides, travel tips, and the latest news about bus travel in Pakistan. Learn how to travel smarter, safer, and more affordably.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 text-start">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {MOCK_BLOGS.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem]">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">New Commuter Stories & Guides Coming Soon!</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                We are currently crafting high-quality travel hacks, terminal guides, and operator profiles. Our first custom blogs will be posted very soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_BLOGS.map((post, i) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {/* Image */}
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-emerald-700 text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-8 flex flex-col">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{post.author}</span>
                      </div>
                      <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                        Read More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Newsletter / CTA Section */}
          <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <Tag className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white mb-4">Stay Updated with Safar Tips</h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Subscribe to our newsletter to get the latest bus timings, fare drops, and travel guides directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
