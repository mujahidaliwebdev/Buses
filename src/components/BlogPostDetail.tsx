import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_BLOGS } from '../data/mockBlogs';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = MOCK_BLOGS.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyErr) {
        console.error('Failed to copy', copyErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsApp = () => {
    if (!post) return;
    const shareText = `📚 *AsaanSafar Blog*\n\n*${post.title}*\n\nCheck out this amazing and helpful travel story on AsaanSafar:\n🔗 ${shareUrl}`;
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer');
  };

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
            
            {post.sections && post.sections.length > 0 ? (
              post.sections.map((section, idx) => {
                if (section.type === 'paragraph') {
                  return (
                    <p key={idx} className="text-slate-600 leading-relaxed mb-6">
                      {section.text}
                    </p>
                  );
                } else if (section.type === 'heading') {
                  return (
                    <h2 key={idx} className="text-3xl font-black text-slate-900 mt-12 mb-6 font-display">
                      {section.text}
                    </h2>
                  );
                } else if (section.type === 'quote') {
                  return (
                    <blockquote key={idx} className="border-l-4 border-emerald-500 pl-6 italic text-slate-600 my-8">
                      {section.text}
                    </blockquote>
                  );
                } else if (section.type === 'list' && section.items) {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-2 my-6 text-slate-600">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  );
                } else if (section.type === 'image' && section.src) {
                  return (
                    <img
                      key={idx}
                      src={section.src}
                      alt={section.alt || ''}
                      className="w-full h-[400px] object-cover rounded-[2.5rem] my-12 shadow-2xl"
                    />
                  );
                }
                return null;
              })
            ) : (
              <>
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
              </>
            )}

            {post.keyTakeaway ? (
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 my-16">
                 <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Tag className="w-6 h-6 text-emerald-600" /> Key Takeaway
                 </h3>
                 <p className="text-slate-600 m-0 leading-relaxed">
                   {post.keyTakeaway}
                 </p>
              </div>
            ) : !post.sections && (
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 my-16">
                 <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Tag className="w-6 h-6 text-emerald-600" /> Key Takeaway
                 </h3>
                 <p className="text-slate-600 m-0 leading-relaxed">
                   Always verify your timings on platforms like AsaanSafar before heading to the terminal. In the non-AC sector, physical listings at terminals are the gold standard, and our team works hard to bring those lists to your screens.
                 </p>
              </div>
            )}
         </article>

         {/* Share & Footer */}
         <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-slate-500 text-sm font-black tracking-wide">
               Share this Story / شیئر کریں:
               <div className="flex gap-2.5 relative">
                  {/* WhatsApp Button */}
                  <button 
                    onClick={handleWhatsApp}
                    title="Share on WhatsApp"
                    className="w-11 h-11 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/20 transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                     <MessageCircle className="w-5 h-5 fill-current stroke-none" />
                  </button>

                  {/* Facebook Button */}
                  <button 
                    onClick={handleFacebook}
                    title="Share on Facebook"
                    className="w-11 h-11 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:shadow-lg hover:shadow-[#1877F2]/20 transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                     <Facebook className="w-5 h-5 fill-current" />
                  </button>

                  {/* Copy Link Button */}
                  <div className="relative">
                    <button 
                      onClick={handleCopyLink}
                      title="Copy Link"
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
                        copied 
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white hover:shadow-lg hover:shadow-slate-900/10'
                      }`}
                    >
                       {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>

                    <AnimatePresence>
                      {copied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl shadow-xl border border-slate-800 flex flex-col items-center gap-0.5 whitespace-nowrap z-50"
                        >
                          <span>Link Copied!</span>
                          <span className="text-[9px] text-slate-400 font-medium">لنک کاپی ہو گیا ہے</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all cursor-pointer font-display"
            >
              Check Other Stories
            </button>
         </div>
      </main>
    </div>
  );
}
