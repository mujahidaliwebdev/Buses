import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  customUrl?: string;
}

export default function ShareModal({ isOpen, onClose, origin, destination, customUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use customUrl or build path based on current origin/destination slug
      if (customUrl) {
        setShareUrl(customUrl);
      } else {
        // Fallback to current window location
        setShareUrl(window.location.href);
      }
    }
  }, [isOpen, customUrl, origin, destination]);

  const shareTextEnglish = `🚌 *AsaanSafar - Bus Timings & Fares*\nRoute: *${origin} to ${destination}*\n\nCheck out verified bus schedules, ticket prices, and terminal contact numbers here:\n🔗 ${shareUrl}`;
  const shareTextUrdu = `🚌 *آسان سفر - بس اوقات اور کرایہ*\nروٹ: *${origin} سے ${destination}*\n\nتصدیق شدہ بس ٹائمنگز، ٹکٹ کی قیمتیں اور اڈے کے رابطہ نمبرز یہاں دیکھیں:\n🔗 ${shareUrl}`;

  const shareTextCombined = `${shareTextEnglish}\n\n---\n\n${shareTextUrdu}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (copyErr) {
        console.error('Failed to copy', copyErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsApp = () => {
    const encodedText = encodeURIComponent(shareTextCombined);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterX = () => {
    const text = `Verified bus timings & fares for ${origin} to ${destination} on AsaanSafar! @AsaanSafar`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AsaanSafar: ${origin} to ${destination}`,
          text: `Check out verified bus timings & fares for ${origin} to ${destination} on AsaanSafar!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native share failed or dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Share Route Details</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">معلومات شیئر کریں</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6">
              <div className="text-center bg-emerald-50/40 border border-emerald-100/30 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Active Route</p>
                <h4 className="text-xl font-black text-slate-900">
                  {origin} <span className="text-emerald-500 font-bold">to</span> {destination}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-1">Bus Schedules & Ticket Fares</p>
              </div>

              {/* Share grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center justify-center py-5 px-4 bg-[#25D366]/5 hover:bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 rounded-3xl transition-all group"
                >
                  <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6 fill-white stroke-none" />
                  </div>
                  <span className="text-sm font-black text-slate-800 mt-3">WhatsApp</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">واٹس ایپ</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebook}
                  className="flex flex-col items-center justify-center py-5 px-4 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 border border-[#1877F2]/20 hover:border-[#1877F2]/40 rounded-3xl transition-all group"
                >
                  <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1877F2]/20 group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </div>
                  <span className="text-sm font-black text-slate-800 mt-3">Facebook</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">فیس بک</span>
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleTwitterX}
                  className="flex flex-col items-center justify-center py-5 px-4 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-200 hover:border-slate-300 rounded-3xl transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-950/10 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm font-black text-slate-800 mt-3">Twitter (X)</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ٹویٹر</span>
                </button>

                {/* Native Device Share / More */}
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center justify-center py-5 px-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-3xl transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-800 mt-3">More Options</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">مزید آپشنز</span>
                </button>
              </div>

              {/* Link Input field */}
              <div className="border-t border-slate-100 pt-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 ml-1">Copy Link / لنک کاپی کریں</p>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3.5 pl-4 pr-14 text-xs font-semibold text-slate-600 select-all outline-none focus:border-emerald-500/40"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-2 px-3.5 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span className="text-emerald-300 font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
