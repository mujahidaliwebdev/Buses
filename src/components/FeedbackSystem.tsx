import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, AlertTriangle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function FeedbackSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'complaint'>('feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const collectionPath = activeTab === 'feedback' ? 'feedback' : 'complaints';
      await addDoc(collection(db, collectionPath), {
        ...formData,
        type: activeTab,
        createdAt: serverTimestamp()
      });
      
      setShowSuccess(true);
      setFormData({ name: '', mobile: '', email: '', message: '' });
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, activeTab === 'feedback' ? 'feedback' : 'complaints');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Tab */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-emerald-600 text-white px-2 py-6 rounded-l-2xl shadow-xl hover:bg-emerald-700 transition-all flex flex-col items-center gap-2 group"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="[writing-mode:vertical-lr] font-bold text-xs uppercase tracking-widest rotate-180">
          Feedback
        </span>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">AsaanSafar Services</h2>
                  <p className="text-emerald-100 text-xs">We value your input for better commute.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${
                    activeTab === 'feedback' 
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  FEEDBACK
                </button>
                <button
                  onClick={() => setActiveTab('complaint')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${
                    activeTab === 'complaint' 
                      ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/30' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  COMPLAINT
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                {showSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
                    <p className="text-slate-500 text-sm">
                      Your {activeTab} has been submitted successfully.<br />
                      We appreciate your help in improving Pakistan's transport.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                        placeholder="Majid Khan"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile *</label>
                      <input
                        required
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                        placeholder="0300 1234567"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                        placeholder="majid@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {activeTab === 'feedback' ? 'Feedback:' : 'Complain:'} *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium resize-none"
                        placeholder={activeTab === 'feedback' ? "Share your experience..." : "Report an issue..."}
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                        activeTab === 'feedback' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                      } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          SUBMIT {activeTab.toUpperCase()}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styles for the vertical tab */}
      <style>{`
        .vertical-text {
          writing-mode: vertical-lr;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
}
