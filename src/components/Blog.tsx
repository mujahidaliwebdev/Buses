import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Best non-AC Buses in Pakistan: A Budget Traveler's Guide",
    excerpt: "Discover the most reliable and affordable non-AC bus services connecting major cities in Pakistan. We review seating comfort, punctuality, and pricing.",
    date: "May 12, 2026",
    author: "AsaanBus Team",
    readTime: "6 min read",
    category: "Travel Guide",
    slug: "best-non-ac-buses-pakistan"
  },
  {
    id: 2,
    title: "Lahore to Faisalabad: Best Routes and Timings for 2026",
    excerpt: "Planning a trip from Lahore to Faisalabad? Here is everything you need to know about the fastest routes, latest ticket prices, and bus schedules.",
    date: "May 10, 2026",
    author: "Safar Specialist",
    readTime: "8 min read",
    category: "Route Guide",
    slug: "lahore-to-faisalabad-guide"
  },
  {
    id: 3,
    title: "How to Find Cheap Bus Routes in Pakistan",
    excerpt: "Learn the secrets to finding the lowest fares for inter-city travel. Save money on your next journey without compromising on safety or reliability.",
    date: "May 05, 2026",
    author: "Local Explorer",
    readTime: "5 min read",
    category: "Tips & Tricks",
    slug: "cheap-bus-routes-pakistan"
  }
];

export default function Blog() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen className="w-4 h-4" /> Travel Blog
            </div>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6">
              Safar <span className="text-emerald-600">Ki Kahaniyan</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Expert guides, travel tips, and the latest news about bus travel in Pakistan. Helping you travel smarter and cheaper.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-transparent transition-colors" />
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
                    <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

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
