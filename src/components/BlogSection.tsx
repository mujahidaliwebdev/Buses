import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BLOGS } from '../data/mockBlogs';
import { ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
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
            className="text-[#104a91] font-semibold text-sm hover:underline flex items-center gap-1 group"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_BLOGS.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group cursor-pointer flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all h-full"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight uppercase">
                      {post.imageOverlayText}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col h-full bg-white">
                  <span className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                    {post.date}
                  </span>
                  <h4 className="text-[#1e293b] font-bold leading-snug group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
