import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOCK_BLOGS } from '../data/mockBlogs';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag } from 'lucide-react';
import { useEffect } from 'react';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = MOCK_BLOGS.find(p => p.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <button onClick={() => navigate('/blog')} className="text-emerald-600 font-bold mt-4">Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Article Header */}
      <header className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src={post.image} alt={post.title} className="w-full h-full object-cover blur-sm" />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
           <motion.button 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             onClick={() => navigate('/blog')}
             className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold mb-8 hover:text-white transition-colors"
           >
             <ArrowLeft className="w-4 h-4" /> Back to Blog
           </motion.button>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-6"
           >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/30">
               {post.category}
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight font-display">
               {post.title}
             </h1>
             <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400 font-medium pt-4">
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-emerald-500" /> {post.author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> {post.readTime}</span>
             </div>
           </motion.div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-20">
         <article className="prose prose-emerald prose-lg max-w-none">
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-emerald-500 pl-6 italic">
              {post.excerpt}
            </p>
            
            <p className="text-slate-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-[400px] object-cover rounded-[2.5rem] my-12 shadow-2xl"
            />

            <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6">Why this matters for Pakistani Travelers</h2>
            <p className="text-slate-600 leading-relaxed">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 my-16">
               <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <Tag className="w-6 h-6 text-emerald-600" /> Key Takeaway
               </h3>
               <p className="text-slate-600 m-0 leading-relaxed">
                 Always verify your timings on platforms like AsaanBusSafar before heading to the terminal. In the non-AC sector, physical listings at terminals are the gold standard, and our team works hard to bring those lists to your screens.
               </p>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>
         </article>

         {/* Share & Footer */}
         <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
               Share this Story:
               <div className="flex gap-2">
                  {[1,2,3].map(i => (
                    <button key={i} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                       <Share2 className="w-4 h-4" />
                    </button>
                  ))}
               </div>
            </div>
            
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
            >
              Check Other Stories
            </button>
         </div>
      </main>
    </div>
  );
}
