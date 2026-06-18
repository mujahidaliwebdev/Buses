import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ReportModalProps {
  busId: string;
  busInfo: string;
  isOpen: boolean;
  onClose: () => void;
}

enum OperationType {
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

const ISSUE_OPTIONS = [
  "Incorrect Timing",
  "Incorrect Fare",
  "Wrong Terminal/Location",
  "Incorrect Bus Number",
  "Contact Number Not Working",
  "Other"
];

export default function ReportModal({ busId, busInfo, isOpen, onClose }: ReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      // Prevent parent page scrolling when the modal is active
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssues.length === 0) {
      alert("Please select at least one issue to report.");
      return;
    }
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'reports'), {
        busId,
        busInfo,
        ...formData,
        issues: selectedIssues,
        createdAt: serverTimestamp()
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reports');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-[10000]"
          >
            {/* Header */}
            <div className="bg-rose-600 p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Report Issue
                </h2>
                <p className="text-rose-100 text-xs">Help us keep {busInfo} information accurate.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="p-6 overflow-y-auto">
              {showSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Report Submitted</h3>
                  <p className="text-slate-500 text-sm">
                    Thank you for your report. Our team will verify this information soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Issue Checkboxes */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">What is incorrect? *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ISSUE_OPTIONS.map((issue) => (
                        <button
                          key={issue}
                          type="button"
                          onClick={() => toggleIssue(issue)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            selectedIssues.includes(issue)
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            selectedIssues.includes(issue) 
                              ? 'bg-rose-600 border-rose-600 text-white' 
                              : 'bg-white border-slate-300'
                          }`}>
                            {selectedIssues.includes(issue) && <Send className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-bold leading-tight">{issue}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium"
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
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium"
                        placeholder="0300 1234567"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium"
                      placeholder="majid@example.com"
                    />
                  </div>

                  <button
                    disabled={isSubmitting || selectedIssues.length === 0}
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20 shrink-0"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        SUBMIT REPORT
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
