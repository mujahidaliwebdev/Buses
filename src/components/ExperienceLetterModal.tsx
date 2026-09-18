import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { auth } from '../lib/firebase';

interface ExperienceLetterModalProps {
  onClose: () => void;
}

export default function ExperienceLetterModal({ onClose }: ExperienceLetterModalProps) {
  const currentUser = auth.currentUser;
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const refNumber = `ASP-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const letterHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AsaanSafar Experience Letter</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; background: #fff; -webkit-print-color-adjust: exact; }
            .letter-container {
              position: relative;
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
            }
            .letterhead-img {
              width: 100%;
              height: auto;
              display: block;
            }
            .content {
              position: absolute;
              top: 28%;
              bottom: 16%;
              left: 12%;
              right: 12%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #111;
              font-size: 14px;
              line-height: 1.6;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: bold;
              color: #555;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 8px;
            }
            .to-whom {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              padding-top: 16px;
              padding-bottom: 8px;
              color: #0f172a;
            }
            p {
              margin: 10px 0;
            }
            .footer-sign {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-family: Arial, sans-serif;
              font-size: 12px;
              padding-top: 16px;
            }
            .verified {
              background: #ecfdf5;
              color: #065f46;
              padding: 6px 12px;
              border-radius: 6px;
              font-weight: bold;
              border: 1px solid #a7f3d0;
            }
          </style>
        </head>
        <body>
          <div class="letter-container">
            <img src="https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is" class="letterhead-img" />
            <div class="content">
              <div>
                <div class="header-info">
                  <span>Date: ${currentDate}</span>
                  <span>Ref: ${refNumber}</span>
                </div>
                <div class="to-whom">To Whom It May Concern,</div>
                <p>This is to certify that <strong style="color: #065f46;">${currentUser?.displayName || 'Valued Volunteer'}</strong> has actively contributed as an official community volunteer with <strong>AsaanSafar Pakistan</strong>.</p>
                <p>During their tenure, they have demonstrated exceptional dedication in validating public transport routes, schedules, fares, and assisting commuters across Pakistan. Their commitment towards transparent public transit data has significantly benefited thousands of daily travelers.</p>
                <p>We deeply appreciate their selfless community service and wish them success in all their future endeavors.</p>
              </div>
              <div class="footer-sign">
                <div>
                  <strong style="font-size: 13px; color: #0f172a;">AsaanSafar Management Team</strong><br/>
                  <span style="font-size: 10px; color: #065f46; font-weight: bold;">Community Operations & Data Verification</span>
                </div>
                <div>
                  <span class="verified">✔ Verified & Signed</span>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(letterHtml);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 border border-slate-100 p-6 sm:p-8 text-left space-y-6 max-h-[95vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer z-30 bg-white/80 backdrop-blur-sm shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Official Certificate
          </div>
          <h2 className="text-2xl font-black text-slate-900">Volunteer Experience Letter</h2>
          <p className="text-xs text-slate-500">AsaanSafar Pakistan Transit Initiative</p>
        </div>

        {/* Letterhead Paper Container preview on screen */}
        <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-300">
          {/* Letterhead Image as full background */}
          <img
            src="https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is"
            alt="AsaanSafar Letter Head"
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none pointer-events-none"
          />

          {/* Overlay Content positioned over the letterhead middle whitespace area */}
          <div className="absolute inset-0 pt-[28%] pb-[16%] px-[12%] flex flex-col justify-between font-serif text-slate-900 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px] font-sans text-slate-500 font-bold border-b border-slate-200/60 pb-2">
                <span>Date: {currentDate}</span>
                <span>Ref: {refNumber}</span>
              </div>

              {/* To Whom It May Concern centered with generous space below */}
              <div className="text-center pt-3 pb-2">
                <p className="font-bold text-slate-900 text-base sm:text-lg tracking-wide">To Whom It May Concern,</p>
              </div>

              <p className="pt-2">
                This is to certify that <strong className="text-emerald-900 font-sans">{currentUser?.displayName || 'Valued Volunteer'}</strong> has actively contributed as an official community volunteer with <strong>AsaanSafar Pakistan</strong>.
              </p>

              <p>
                During their tenure, they have demonstrated exceptional dedication in validating public transport routes, schedules, fares, and assisting commuters across Pakistan. Their commitment towards transparent public transit data has significantly benefited thousands of daily travelers.
              </p>

              <p>
                We deeply appreciate their selfless community service and wish them success in all their future endeavors.
              </p>
            </div>

            {/* Signatures at the bottom */}
            <div className="pt-4 flex justify-between items-end font-sans text-xs text-slate-700">
              <div>
                <div className="space-y-0.5">
                  <p className="font-black text-slate-900">AsaanSafar Management Team</p>
                  <p className="text-[10px] text-emerald-800 font-bold">Community Operations & Data Verification</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-sm text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified & Signed
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Print / Save Letter
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
