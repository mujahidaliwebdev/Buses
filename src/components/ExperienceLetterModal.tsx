import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, CheckCircle2, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

interface ExperienceLetterModalProps {
  onClose: () => void;
}

export default function ExperienceLetterModal({ onClose }: ExperienceLetterModalProps) {
  const currentUser = auth.currentUser;

  // Volunteer Name: priority to Mujahid Ali if matching admin/user account or user's displayName
  const volunteerName = (currentUser?.displayName && currentUser.displayName.trim() !== '')
    ? currentUser.displayName
    : (currentUser?.email?.includes('mujahid') ? 'Mujahid Ali' : 'Mujahid Ali');

  // Dates handling
  const now = new Date();
  const letterGenDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // e.g. "22 Sep 2026"

  // Capture joining date & sequential verification ID
  const [joiningDateStr, setJoiningDateStr] = useState<string>('12 May 2026');
  const [verificationId, setVerificationId] = useState<string>('ASP/EXP/2026051201');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function computeVolunteerLetterData() {
      let registrationDateObj = new Date(2026, 4, 12); // Fallback: 12 May 2026

      // 1. Try to fetch user registration date from Firestore users collection
      if (currentUser?.uid) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.registrationDate) {
              const parsed = new Date(userData.registrationDate);
              if (!isNaN(parsed.getTime())) {
                registrationDateObj = parsed;
              }
            } else if (userData.createdAt) {
              const parsed = new Date(userData.createdAt);
              if (!isNaN(parsed.getTime())) {
                registrationDateObj = parsed;
              }
            }
          } else if (currentUser.metadata?.creationTime) {
            const parsed = new Date(currentUser.metadata.creationTime);
            if (!isNaN(parsed.getTime())) {
              registrationDateObj = parsed;
            }
          }
        } catch (readUserErr) {
          console.warn('Could not read user registration date from Firestore, using fallback:', readUserErr);
        }
      }

      // Format joining date string (e.g., "12 May 2026")
      const formattedJoiningDate = registrationDateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // 2. Compute date key for verification ID: YYYYMMDD based on REGISTRATION DATE
      const regYear = registrationDateObj.getFullYear().toString();
      const regMonth = String(registrationDateObj.getMonth() + 1).padStart(2, '0');
      const regDay = String(registrationDateObj.getDate()).padStart(2, '0');
      const dateKey = `${regYear}${regMonth}${regDay}`; // e.g. "20260512"

      // 3. Check if user already has an assigned verification ID
      let assignedId = '';
      const userUid = currentUser?.uid || 'mujahid-ali-id';
      const localKey = `asp_volunteer_cert_${userUid}`;
      const cachedId = localStorage.getItem(localKey);
      if (cachedId) {
        assignedId = cachedId;
      }

      try {
        const userMappingRef = doc(db, 'user_certificates', userUid);
        const userMappingSnap = await getDoc(userMappingRef);

        if (userMappingSnap.exists() && userMappingSnap.data()?.verificationId) {
          assignedId = userMappingSnap.data().verificationId;
        } else if (!assignedId) {
          // If not assigned yet, use Firestore transaction on daily counter:
          const counterDocRef = doc(db, 'certificate_daily_counters', dateKey);
          try {
            await runTransaction(db, async (transaction) => {
              const counterSnap = await transaction.get(counterDocRef);
              let nextSeq = 1;
              if (counterSnap.exists()) {
                const currentCount = counterSnap.data().count || 0;
                nextSeq = currentCount + 1;
              }
              const seqStr = String(nextSeq).padStart(2, '0');
              assignedId = `ASP/EXP/${dateKey}${seqStr}`;

              // Update counter in transaction
              transaction.set(counterDocRef, { count: nextSeq, date: dateKey }, { merge: true });

              // Persist mapping to user so their ID never changes once issued
              transaction.set(userMappingRef, {
                userId: userUid,
                verificationId: assignedId,
                dateKey: dateKey,
                sequenceNumber: nextSeq,
                issuedAt: new Date().toISOString()
              }, { merge: true });
            });
          } catch (txErr) {
            console.warn('Transaction on counter failed or offline, fallback sequence: 01', txErr);
            assignedId = `ASP/EXP/${dateKey}01`;
          }
        }
      } catch (mappingErr) {
        console.warn('Could not read user_certificates mapping from Firestore:', mappingErr);
      }

      if (!assignedId) {
        assignedId = `ASP/EXP/${dateKey}01`;
      }
      try {
        localStorage.setItem(localKey, assignedId);
      } catch (e) {
        // ignore
      }

      // 4. Save/update certificate record for public verify link (/verify/ASP/EXP/...)
      if (currentUser) {
        try {
          const certDocRef = doc(db, 'experience_certificates', assignedId);
          await setDoc(certDocRef, {
            id: assignedId,
            fullName: volunteerName,
            email: currentUser?.email || 'mujahidali.webdev@gmail.com',
            role: 'Official Community Volunteer',
            organization: 'AsaanSafar Pakistan',
            department: 'Community Operations & Data Verification',
            joiningDate: formattedJoiningDate,
            registrationDateKey: dateKey,
            issueDate: letterGenDate,
            status: 'Verified & Active',
            lastUpdated: new Date().toISOString()
          }, { merge: true });
        } catch (saveCertErr) {
          console.warn('Could not save certificate record to Firestore (safe to ignore offline):', saveCertErr);
        }
      }

      if (isMounted) {
        setJoiningDateStr(formattedJoiningDate);
        setVerificationId(assignedId);
        setLoading(false);
      }
    }

    computeVolunteerLetterData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, volunteerName, letterGenDate]);

  const verifyUrl = `https://www.asaansafar.com/verify/${verificationId}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const letterHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AsaanSafar Experience Letter - ${volunteerName}</title>
          <style>
            @page { 
              size: A4 portrait; 
              margin: 0; 
            }
            * {
              box-sizing: border-box;
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Times New Roman', Times, serif; 
              background: #fff; 
              -webkit-print-color-adjust: exact; 
              color: #1a1a1a;
            }
            .letter-container {
              position: relative;
              width: 100%;
              max-width: 820px;
              margin: 0 auto;
              height: 1150px;
            }
            .letterhead-img {
              width: 100%;
              height: 100%;
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
            /* Content is strictly bounded between letterhead header (22%) and letterhead footer (16% margin from bottom) */
            .content {
              position: absolute;
              top: 18%;
              bottom: 12%;
              left: 10%;
              right: 10%;
              font-size: 15px;
              line-height: 1.5;
              color: #1e293b;
              z-index: 2;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 13px;
              font-weight: 700;
              color: #475569;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 5px;
              margin-bottom: 8px;
            }
            .to-whom {
              text-align: center;
              font-size: 18px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: 0.5px;
              margin: 8px 0 20px 0;
              font-family: Arial, Helvetica, sans-serif;
            }
            p {
              margin: 6px 0;
              text-align: justify;
            }
            ul {
              margin: 4px 0 6px 14px;
              padding-left: 10px;
            }
            li {
              margin-bottom: 3px;
            }
            /* Clean separation from pre-printed letterhead bottom bar */
            .footer-sign-section {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1.5px solid #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-family: Arial, Helvetica, sans-serif;
              background: #ffffff;
            }
            .issued-by {
              font-size: 13px;
              color: #334155;
            }
            .issued-title {
              font-weight: 900;
              font-size: 15px;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .dept-title {
              font-size: 13px;
              font-weight: 700;
              color: #059669;
            }
            .verification-box {
              background: #f8fafc;
              border: 1px dashed #059669;
              border-radius: 6px;
              padding: 6px 10px;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11.5px;
              color: #334155;
              text-align: right;
            }
            .verification-box strong {
              color: #0f172a;
            }
            .verification-box a {
              color: #059669;
              text-decoration: none;
              font-weight: 700;
              word-break: break-all;
            }
            .badge-verified {
              display: inline-block;
              background: #ecfdf5;
              color: #065f46;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 800;
              font-size: 11px;
              border: 1px solid #a7f3d0;
              margin-bottom: 3px;
            }
          </style>
        </head>
        <body>
          <div class="letter-container">
            <img src="https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is" class="letterhead-img" />
            <div class="content">
              <div>
                <div class="header-meta">
                  <span>Date: ${letterGenDate}</span>
                  <span>Verification ID: ${verificationId}</span>
                </div>

                <div class="to-whom">To Whom It May Concern,</div>

                <p>
                  This is to certify that <strong style="font-family: Arial, Helvetica, sans-serif; font-size: 15.5px; color: #047857;">${volunteerName}</strong> has actively contributed as an <strong>Official Community Volunteer</strong> with <strong>AsaanSafar Pakistan</strong>.
                </p>

                <p>
                  During the period from <strong>${joiningDateStr}</strong> to <strong>${letterGenDate}</strong>, they have contributed to the collection, verification, and updating of public transport information through the AsaanSafar platform.
                </p>

                <p>Their contributions have included collecting and verifying information related to:</p>
                <ul>
                  <li>Public transport routes and destinations</li>
                  <li>Bus arrival and departure schedules</li>
                  <li>Passenger fares and route-wise pricing</li>
                  <li>Bus terminals, stands, and stop locations</li>
                  <li>Transport operators and available services</li>
                  <li>Other relevant public transport information</li>
                </ul>

                <p>
                  Through their continued contribution, they have supported AsaanSafar's mission of making public transport information more <strong>accessible, transparent, and reliable</strong> for commuters across Pakistan.
                </p>

                <p>
                  Their efforts in collecting and maintaining transport data have contributed to helping travelers better understand available routes, schedules, fares, and other essential travel information before starting their journey.
                </p>

                <p>
                  We sincerely appreciate their <strong>time, dedication, and valuable contribution to the AsaanSafar community</strong> and wish them continued success in their future endeavors.
                </p>
              </div>

              <div class="footer-sign-section">
                <div class="issued-by">
                  <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; font-weight: 700; margin-bottom: 2px;">Issued By:</div>
                  <div class="issued-title">AsaanSafar Pakistan</div>
                  <div class="dept-title">Community Operations & Data Verification</div>
                </div>

                <div class="verification-box">
                  <div class="badge-verified">✔ Authentic & Digitally Signed</div>
                  <div>Verification ID: <strong>${verificationId}</strong></div>
                  <div>Verification Link: <a href="${verifyUrl}">${verifyUrl}</a></div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
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
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 p-6 sm:p-8 text-left space-y-6 max-h-[96vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer z-30 bg-white/80 backdrop-blur-sm shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> Official Volunteer Credentials
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Volunteer Experience Letter</h2>
            <p className="text-xs text-slate-500">AsaanSafar Pakistan Public Transit Initiative</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200">
              ID: {verificationId}
            </span>
          </div>
        </div>

        {/* Letterhead Container View */}
        <div className="relative w-full max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-300">
          {/* Background Official Letterhead Graphic */}
          <img
            src="https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is"
            alt="AsaanSafar Letter Head"
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none pointer-events-none"
          />

          {/* Letter text content positioned strictly above the bottom pre-printed footer */}
          <div className="absolute top-[18%] bottom-[12%] left-[8%] right-[8%] sm:left-[10%] sm:right-[10%] flex flex-col justify-between font-serif text-slate-900 text-[13px] sm:text-[14.5px] leading-relaxed select-text overflow-y-auto custom-scrollbar">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[12px] sm:text-[13px] font-sans text-slate-500 font-bold border-b border-slate-200 pb-1.5">
                <span>Date: {letterGenDate}</span>
                <span>Verification ID: {verificationId}</span>
              </div>

              {/* To Whom It May Concern */}
              <div className="text-center pt-1 pb-3.5 sm:pb-5">
                <p className="font-bold text-slate-900 text-base sm:text-lg tracking-wide font-sans">To Whom It May Concern,</p>
              </div>

              <p>
                This is to certify that <strong className="text-emerald-800 font-sans">{volunteerName}</strong> has actively contributed as an <strong>Official Community Volunteer</strong> with <strong>AsaanSafar Pakistan</strong>.
              </p>

              <p>
                During the period from <strong>{joiningDateStr}</strong> to <strong>{letterGenDate}</strong>, they have contributed to the collection, verification, and updating of public transport information through the AsaanSafar platform.
              </p>

              <p>Their contributions have included collecting and verifying information related to:</p>
              <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-800 text-[12.5px] sm:text-[14px]">
                <li>Public transport routes and destinations</li>
                <li>Bus arrival and departure schedules</li>
                <li>Passenger fares and route-wise pricing</li>
                <li>Bus terminals, stands, and stop locations</li>
                <li>Transport operators and available services</li>
                <li>Other relevant public transport information</li>
              </ul>

              <p>
                Through their continued contribution, they have supported AsaanSafar's mission of making public transport information more <strong>accessible, transparent, and reliable</strong> for commuters across Pakistan.
              </p>

              <p>
                Their efforts in collecting and maintaining transport data have contributed to helping travelers better understand available routes, schedules, fares, and other essential travel information before starting their journey.
              </p>

              <p>
                We sincerely appreciate their <strong>time, dedication, and valuable contribution to the AsaanSafar community</strong> and wish them continued success in their future endeavors.
              </p>
            </div>

            {/* Issued By & Verification Footer - Perfectly padded with clear bottom margin from pre-printed footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 font-sans text-xs text-slate-700 bg-white/95 backdrop-blur-sm rounded-lg p-2">
              <div>
                <p className="text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">Issued By:</p>
                <p className="font-black text-slate-900 text-sm sm:text-base">AsaanSafar Pakistan</p>
                <p className="text-[12px] text-emerald-800 font-bold">Community Operations & Data Verification</p>
              </div>

              <div className="bg-slate-50 border border-emerald-300 rounded-lg p-2 text-right space-y-0.5 text-[11.5px] sm:text-[12px] shrink-0">
                <div className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authentic Verification
                </div>
                <div className="font-mono text-slate-700 font-bold">ID: {verificationId}</div>
                <div className="text-slate-500 text-[11px] sm:text-[11.5px]">
                  Link: <span className="text-emerald-700 font-semibold underline">{verifyUrl}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Print / Download Experience Letter
          </button>

          <a
            href={`/verify/${verificationId}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Live Verification Page <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
