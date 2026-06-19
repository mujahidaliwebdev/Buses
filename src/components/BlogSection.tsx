import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BLOGS } from '../data/mockBlogs';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-start">
          <div>
            <h2 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight">
              Travel Smarter with Our Blogs
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl">
              Learn how to save more, travel smarter, and enjoy seamless journeys with our blogs.
            </p>
          </div>
          <button 
            onClick={() => navigate('/blog')}
            className="text-[#104a91] font-semibold text-sm hover:underline flex items-center gap-1 group cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Grid */}
        {MOCK_BLOGS.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">New Blogs & Guides Arriving Soon!</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              We are curating high-quality travel guides, route breakdowns, and smart commuting tips just for you.
            </p>
            <button 
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
            >
              Go to Blog Page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-start">
            {MOCK_BLOGS.slice(-3).map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
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
      </div>
    </section>
  );
}
