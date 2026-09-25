import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  FileText, 
  AlertCircle, 
  Send, 
  CheckSquare, 
  Square, 
  Award,
  Bus,
  Lock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { userService } from '../lib/firestoreService';
import { d1UserBridge } from '../lib/d1UserBridge';

interface ExperienceLetterModalProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

export default function ExperienceLetterModal({ onClose, onOpenAuth }: ExperienceLetterModalProps) {
  const currentUser = auth.currentUser;

  const isAdmin = (
    currentUser?.email === 'mujahidali.webdev@gmail.com' ||
    currentUser?.email === 'mujahidali.stf@gmail.com' ||
    currentUser?.email === 'kanwal200485@gmail.com'
  );

  const isMujahid = (
    currentUser?.uid === 'mujahid-ali-id' ||
    Boolean(currentUser?.email && (
      currentUser.email.toLowerCase().includes('mujahid') || 
      currentUser.email.toLowerCase() === 'mujahidali.webdev@gmail.com' || 
      currentUser.email.toLowerCase() === 'mujahidalikhaskheli786@gmail.com'
    )) ||
    Boolean(currentUser?.displayName && currentUser.displayName.toLowerCase().includes('mujahid'))
  );

  // Volunteer Name
  const volunteerName = (currentUser?.displayName && currentUser.displayName.trim() !== '')
    ? currentUser.displayName
    : (isMujahid ? 'Mujahid Ali' : 'Volunteer Contributor');

  // Dates
  const now = new Date();
  const letterGenDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // State
  const [joiningDateStr, setJoiningDateStr] = useState<string>('12 May 2026');
  const [registrationDateObj, setRegistrationDateObj] = useState<Date>(new Date(2026, 4, 12));
  const [verificationId, setVerificationId] = useState<string>('ASP/EXP/2026051201');
  const [loading, setLoading] = useState<boolean>(true);

  // Request & Eligibility States
  const [requestData, setRequestData] = useState<ExperienceRequestItem | null>(null);
  const [contributionsCount, setContributionsCount] = useState<number>(0);
  const [acceptedContributions, setAcceptedContributions] = useState<number>(0);
  const [userNotes, setUserNotes] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [showAdminPreview, setShowAdminPreview] = useState<boolean>(false); // Allow admin to switch between views

  // Calculate duration in months & days from registration date to now
  const calculateTenure = (startDate: Date) => {
    const end = new Date();
    let months = (end.getFullYear() - startDate.getFullYear()) * 12 + (end.getMonth() - startDate.getMonth());
    const days = end.getDate() - startDate.getDate();
    if (days < 0) {
      months -= 1;
    }
    const safeMonths = Math.max(0, months);
    return {
      months: safeMonths,
      totalDays: Math.max(0, Math.floor((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    };
  };

  const tenure = calculateTenure(registrationDateObj);
  const hasCompleted6Months = isMujahid || tenure.months >= 6 || tenure.totalDays >= 180;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch user doc for exact registration date
        let regDate = isMujahid ? new Date(2026, 4, 12) : new Date();
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (uData.registrationDate) {
            const parsed = new Date(uData.registrationDate);
            if (!isNaN(parsed.getTime())) regDate = parsed;
          } else if (uData.createdAt) {
            const parsed = new Date(uData.createdAt);
            if (!isNaN(parsed.getTime())) regDate = parsed;
          }
        } else if (currentUser.metadata?.creationTime) {
          const parsed = new Date(currentUser.metadata.creationTime);
          if (!isNaN(parsed.getTime())) regDate = parsed;
        }

        const formattedJoining = isMujahid 
          ? '12 May 2026' 
          : regDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        // 2. Fetch user contributions
        try {
          const cQuery = query(collection(db, 'contributions'), where('userId', '==', currentUser.uid));
          const cSnap = await getDocs(cQuery);
          const allContribs = cSnap.docs.map(d => d.data());
          setContributionsCount(allContribs.length);
          setAcceptedContributions(allContribs.filter((c: any) => c.status === 'approved' || c.status === 'accepted' || !c.status).length);
        } catch (e) {
          console.warn('Notice reading contributions:', e);
        }

        // 3. Get / generate Verification ID
        let assignedId = isMujahid ? 'ASP/EXP/2026051201' : '';
        try {
          assignedId = await userService.generateOrGetVerificationId(currentUser, volunteerName);
        } catch (e) {
          console.warn('Notice getting verification ID:', e);
        }
        if (!assignedId) {
          const regYear = regDate.getFullYear().toString();
          const regMonth = String(regDate.getMonth() + 1).padStart(2, '0');
          const regDay = String(regDate.getDate()).padStart(2, '0');
          assignedId = isMujahid ? 'ASP/EXP/2026051201' : `ASP/EXP/${regYear}${regMonth}${regDay}01`;
        }

        if (isMounted) {
          setRegistrationDateObj(regDate);
          setJoiningDateStr(formattedJoining);
          setVerificationId(assignedId);
        }
      } catch (err) {
        console.error('Error loading experience modal data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Fetch user's experience certificate status directly from Cloudflare D1
    async function loadExperienceStatusFromD1() {
      if (!currentUser?.uid) return;
      try {
        const pubId = await d1UserBridge.ensureProfile(currentUser);
        const myCert = await d1UserBridge.getMyExperienceCertificate(pubId, currentUser.uid);
        if (isMounted && myCert) {
          setRequestData({
            id: String(myCert.id),
            status: String(myCert.status || 'Pending').toLowerCase(),
            verificationId: myCert.verification_id,
            durationMonths: myCert.duration_months,
            contributionsCount: myCert.contributions_count,
            submittedAt: myCert.created_at,
            remarks: myCert.remarks,
            rejectionReason: myCert.remarks
          });
          if (myCert.verification_id) {
            setVerificationId(myCert.verification_id);
          }
        }
      } catch (e) {
        console.warn('Notice loading experience cert from D1:', e);
      }
    }

    loadData();
    loadExperienceStatusFromD1();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isMujahid, volunteerName]);

  // Handle Request Submission directly to Cloudflare D1
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!agreedToTerms) {
      setSubmitError('Please acknowledge and agree to the terms & conditions. / برائے مہربانی شرائط و ضوابط سے اتفاق کریں۔');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const publicUserId = await d1UserBridge.ensureProfile(currentUser);

      // Save directly to D1 experience_certificate table
      const res = await d1UserBridge.submitExperienceCertificate(publicUserId, {
        registration_date: registrationDateObj.toISOString(),
        duration_months: tenure.months,
        contributions_count: contributionsCount,
        user_notes: userNotes.trim(),
        verification_id: verificationId,
        remarks: 'Experience certificate request submitted'
      });

      if (!res.success && res.message) {
        throw new Error(res.message);
      }

      setSubmitSuccess(true);

      // Refresh immediately from D1
      const myCert = await d1UserBridge.getMyExperienceCertificate(publicUserId, currentUser.uid);
      if (myCert) {
        setRequestData({
          id: String(myCert.id),
          status: String(myCert.status || 'Pending').toLowerCase(),
          verificationId: myCert.verification_id,
          durationMonths: myCert.duration_months,
          contributionsCount: myCert.contributions_count,
          submittedAt: myCert.created_at,
          remarks: myCert.remarks,
          rejectionReason: myCert.remarks
        });
      }
    } catch (err: any) {
      console.error('Error submitting experience request:', err);
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyUrl = `https://asaansafar.com/verify/${verificationId}`;

  // Print Letter function
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
              margin: 0mm !important; 
            }
            *, *:before, *:after {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body { 
              margin: 0 !important; 
              padding: 0 !important; 
              width: 100% !important; 
              height: 100% !important; 
              background: #fff;
              font-family: 'Times New Roman', Times, serif;
            }
            .page-container {
              position: relative;
              width: 210mm;
              min-height: 297mm;
              height: 297mm;
              margin: 0 auto;
              background-image: url('https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: top center;
              overflow: hidden;
            }
            .content-overlay {
              position: absolute;
              top: 17%;
              bottom: 12%;
              left: 9%;
              right: 9%;
              font-size: 16px;
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
              font-size: 13.5px;
              font-weight: 700;
              color: #475569;
              border-bottom: 1.5px solid #cbd5e1;
              padding-bottom: 5px;
              margin-bottom: 8px;
            }
            .to-whom {
              text-align: center;
              font-size: 19.5px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: 0.5px;
              margin: 8px 0 16px 0;
              font-family: Arial, Helvetica, sans-serif;
            }
            p {
              margin: 6px 0;
              text-align: justify;
              font-size: 16px;
              line-height: 1.52;
            }
            ul {
              margin: 4px 0 7px 16px;
              padding-left: 10px;
            }
            li {
              margin-bottom: 3px;
              font-size: 15.5px;
              line-height: 1.45;
            }
            .footer-sign-section {
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1.5px solid #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-family: Arial, Helvetica, sans-serif;
              background: #ffffff;
            }
            .issued-by {
              line-height: 1.25;
            }
            .issued-title {
              font-size: 15px;
              font-weight: 900;
              color: #0f172a;
            }
            .dept-title {
              font-size: 12.5px;
              color: #065f46;
              font-weight: 700;
            }
            .verification-box {
              text-align: right;
              font-size: 11.5px;
              line-height: 1.35;
              color: #334155;
              background: #f8fafc;
              padding: 6px 10px;
              border-radius: 6px;
              border: 1px solid #cbd5e1;
            }
            .badge-verified {
              color: #047857;
              font-weight: 800;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <div class="content-overlay">
              <div>
                <div class="header-meta">
                  <span>Ref: <strong>${verificationId}</strong></span>
                  <span>Date: <strong>${letterGenDate}</strong></span>
                </div>

                <div class="to-whom">To Whom It May Concern,</div>

                <p>
                  This is to certify that <strong style="font-family: Arial, Helvetica, sans-serif; font-size: 17px; color: #047857;">${volunteerName}</strong> has actively contributed as an <strong>Official Community Volunteer</strong> with <strong>AsaanSafar Pakistan</strong>.
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
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; font-weight: 700; margin-bottom: 1px;">Issued By:</div>
                  <div class="issued-title">AsaanSafar Pakistan</div>
                  <div class="dept-title">Community Operations & Data Verification</div>
                </div>

                <div class="verification-box">
                  <div class="badge-verified">✔ Authentic & Digitally Signed</div>
                  <div>Verification ID: <strong>${verificationId}</strong></div>
                  <div>Verification Link: <a href="${verifyUrl}">asaansafar.com/verify/${verificationId}</a></div>
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

  // Determine which view to render:
  // Is approved if request is approved OR user is Mujahid / Admin
  const isApproved = String(requestData?.status || '').toLowerCase() === 'approved' || (isAdmin && !showAdminPreview);
  const isPending = String(requestData?.status || '').toLowerCase() === 'pending';
  const isRejected = String(requestData?.status || '').toLowerCase() === 'rejected';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-4 sm:my-8 max-h-[94vh] flex flex-col border border-slate-100"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-6 sm:px-8 py-5 text-white shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Award className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-300" /> AsaanSafar Community
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {isApproved 
                  ? 'Volunteer Experience Certificate / تجربہ سرٹیفکیٹ' 
                  : 'Request Experience Letter / تجربہ سرٹیفکیٹ کی درخواست'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminPreview(!showAdminPreview)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-bold transition-all border border-white/20"
              >
                {showAdminPreview ? 'View Letter (Admin)' : 'Preview Request Screen'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50/60">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-500">Checking credentials & status...</span>
            </div>
          ) : !currentUser ? (
            /* Not Logged In View */
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Sign In Required / سائن ان ضروری ہے</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  To request or view your Community Volunteer Experience Letter, please log in with your registered account.
                </p>
                <p className="text-emerald-700 text-xs font-bold mt-1" dir="rtl">
                  تجربہ سرٹیفکیٹ کی درخواست یا تصدیق کے لیے برائے مہربانی پہلے سائن ان کریں۔
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                Sign In / سائن ان کریں
              </button>
            </div>
          ) : isApproved ? (
            /* 1. APPROVED / ADMIN VIEW: FULL EXPERIENCE LETTER */
            <div className="space-y-6">
              {/* Approval status banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      Certificate Approved & Verified / سرٹیفکیٹ تصدیق شدہ اور منظور شدہ
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Official Volunteer Letter is active with permanent Verification ID <span className="font-mono font-bold text-emerald-900">{verificationId}</span>.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    Official Active
                  </span>
                </div>
              </div>

              {/* Letter Preview Container */}
              <div className="bg-slate-200/80 p-3 sm:p-6 rounded-3xl shadow-inner border border-slate-300/80 overflow-x-auto flex justify-center">
                <div 
                  className="bg-white shadow-2xl relative select-none"
                  style={{
                    width: '100%',
                    maxWidth: '680px',
                    aspectRatio: '1 / 1.414',
                    backgroundImage: "url('https://lh3.googleusercontent.com/d/1s96a3I35d6BtvHIREvH4ce53tfb1g-Is')",
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="absolute inset-[15%_8%_10%_8%] flex flex-col justify-between text-slate-800 text-[11px] sm:text-[13px] leading-relaxed select-text font-serif">
                    <div>
                      {/* Meta Date & Ref */}
                      <div className="flex justify-between items-center text-[10px] sm:text-[11.5px] font-bold text-slate-500 border-b border-slate-200 pb-1 mb-2 font-sans">
                        <span>Ref: <strong className="text-slate-800">{verificationId}</strong></span>
                        <span>Date: <strong className="text-slate-800">{letterGenDate}</strong></span>
                      </div>

                      {/* Title */}
                      <div className="text-center font-black text-slate-900 text-sm sm:text-base tracking-wide my-2 sm:my-3 font-sans">
                        To Whom It May Concern,
                      </div>

                      {/* Paragraph 1 */}
                      <p className="mb-2 text-justify">
                        This is to certify that <strong className="text-emerald-800 font-sans text-[12px] sm:text-[14px]">{volunteerName}</strong> has actively contributed as an <strong>Official Community Volunteer</strong> with <strong>AsaanSafar Pakistan</strong>.
                      </p>

                      {/* Paragraph 2 */}
                      <p className="mb-2 text-justify">
                        During the period from <strong>{joiningDateStr}</strong> to <strong>{letterGenDate}</strong>, they have contributed to the collection, verification, and updating of public transport information through the AsaanSafar platform.
                      </p>

                      {/* Bullet points */}
                      <p className="mb-1 text-justify">Their contributions have included collecting and verifying information related to:</p>
                      <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-700 text-[10px] sm:text-[12px] font-sans">
                        <li>Public transport routes and destinations</li>
                        <li>Bus arrival and departure schedules</li>
                        <li>Passenger fares and route-wise pricing</li>
                        <li>Bus terminals, stands, and stop locations</li>
                        <li>Transport operators and available services</li>
                      </ul>

                      {/* Paragraph 3 */}
                      <p className="mt-2 mb-1 text-justify">
                        Through their continued contribution, they have supported AsaanSafar's mission of making public transport information more <strong>accessible, transparent, and reliable</strong> for commuters across Pakistan.
                      </p>

                      <p className="text-justify hidden sm:block">
                        We sincerely appreciate their <strong>time, dedication, and valuable contribution</strong> to the community and wish them continued success in their future endeavors.
                      </p>
                    </div>

                    {/* Footer inside Letter */}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-end text-[10px] sm:text-[11px] font-sans bg-white/90 p-2 rounded-lg">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Issued By:</span>
                        <strong className="text-slate-900 block text-xs sm:text-sm">AsaanSafar Pakistan</strong>
                        <span className="text-emerald-800 font-bold text-[10px] sm:text-[11px]">Community Operations & Data Verification</span>
                      </div>

                      <div className="bg-slate-50 border border-emerald-300 rounded p-1.5 text-right font-sans">
                        <div className="text-emerald-700 font-bold text-[10px]">✔ Authentic Verification</div>
                        <div className="font-mono text-slate-700 font-bold text-[9px] sm:text-[10px]">ID: {verificationId}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-5 py-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live Verification Page <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : isPending ? (
            /* 2. PENDING UNDER REVIEW VIEW */
            <div className="py-6 space-y-6 max-w-2xl mx-auto">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Application Under Review / زیرِ غور درخواست
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Your Request is Under Review</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    آپ کی تجربہ سرٹیفکیٹ کی درخواست ایڈمن کو موصول ہو چکی ہے اور جائزہ کے مرحلے میں ہے۔
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-amber-200/60 text-left space-y-3 shadow-xs">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Applicant Name:</span>
                      <strong className="text-slate-800">{requestData?.userName || volunteerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Registration Date:</span>
                      <strong className="text-slate-800">{joiningDateStr}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Duration on Platform:</span>
                      <strong className="text-emerald-700">{tenure.months} Months ({tenure.totalDays} Days)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Routes Contributed:</span>
                      <strong className="text-slate-800">{contributionsCount} Submitted ({acceptedContributions} Approved)</strong>
                    </div>
                  </div>

                  {requestData?.submittedAt && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      Request Submitted on: {new Date(requestData.submittedAt).toLocaleDateString()} at {new Date(requestData.submittedAt).toLocaleTimeString()}
                    </div>
                  )}

                  {requestData?.userNotes && (
                    <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 italic">
                      "{requestData.userNotes}"
                    </div>
                  )}
                </div>

                <div className="p-4 bg-amber-100/60 rounded-2xl text-[11px] text-amber-900 text-left space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    Review Criteria (جانچ کا طریقہ کار):
                  </div>
                  <p>
                    ایڈمن آپ کی کم از کم <strong>6 ماہ کی شمولیت (Duration)</strong> اور ویب سائٹ پر <strong>روٹس / معلومات کی تصدیق (Engagement)</strong> کا ریکارڈ دیکھ کر سرٹیفکیٹ کی منظوری دے گا۔ منظوری کے بعد سرٹیفکیٹ خودکار طور پر یہاں ڈاؤنلوڈ اور پرنٹ کے لیے ظاہر ہو جائے گا۔
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Got It / سمجھ گیا
                  </button>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            /* 3. REJECTED VIEW */
            <div className="py-6 space-y-6 max-w-2xl mx-auto">
              <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-rose-200 text-rose-900 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Application Not Approved / درخواست منظور نہیں ہوئی
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Request Needs Improvement</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    ایڈمن نے آپ کی درخواست کا جائزہ لیا ہے، لیکن مطلوبہ معیار پورا نہ ہونے کی وجہ سے فی الحال منظوری نہیں دی گئی۔
                  </p>
                </div>

                {requestData?.rejectionReason && (
                  <div className="bg-white rounded-2xl p-4 border border-rose-200 text-left text-xs text-rose-900 font-semibold shadow-xs">
                    <span className="text-[10px] uppercase font-black text-rose-500 block mb-1">Admin Feedback / ایڈمن کا تبصرہ:</span>
                    {requestData.rejectionReason}
                  </div>
                )}

                <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-slate-900">How to qualify for Experience Certificate (اہلیت حاصل کرنے کا طریقہ):</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                    <li>Ensure you have completed at least <strong>6 months</strong> on AsaanSafar platform.</li>
                    <li>Actively verify or add missing bus schedules, fares, and stand contact details.</li>
                    <li>Once criteria are met, you may resubmit your request below.</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setRequestData(null)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Re-Apply / دوبارہ درخواست دیں
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 4. NOT REQUESTED YET: COMPREHENSIVE REQUEST PAGE WITH TERMS & CONDITIONS */
            <form onSubmit={handleSubmitRequest} className="space-y-6 max-w-2xl mx-auto">
              {submitSuccess ? (
                <div className="p-8 bg-emerald-50 border-2 border-emerald-300 rounded-3xl text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Request Sent Successfully!</h3>
                  <p className="text-emerald-800 text-xs sm:text-sm">
                    آپ کی درخواست ایڈمن کو ارسال کر دی گئی ہے۔ جیسے ہی ایڈمن اس کی منظوری دے گا، تجربہ سرٹیفکیٹ آپ کے پروفائل میں ظاہر ہو جائے گا۔
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Hero Intro */}
                  <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-6 sm:p-7 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Official Community Credential
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Request Volunteer Experience Letter
                    </h3>
                    
                    <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed" dir="rtl">
                      آسان سفر کمیونٹی کے رضاکار (Volunteer) کی حیثیت سے خدمات کا باقاعدہ تصدیق شدہ تجربہ سرٹیفکیٹ حاصل کرنے کے لیے درج ذیل شرائط و ضوابط کا جائزہ لیں اور درخواست جمع کروائیں۔
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* CRITERION 1: DURATION CHECK (MINIMUM 6 MONTHS) */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            1. Platform Duration Requirement (کم از کم 6 ماہ کا عرصہ)
                          </h4>
                          <p className="text-[10px] text-slate-400">Tenancy & active registration on AsaanSafar</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        hasCompleted6Months ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hasCompleted6Months ? '✓ 6+ Months Met' : `${tenure.months} / 6 Months`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block">Your Registration Date:</span>
                        <strong className="text-xs text-slate-800 font-bold">{joiningDateStr}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block">Current Duration:</span>
                        <strong className="text-xs text-emerald-700 font-bold">
                          {tenure.months} Months ({tenure.totalDays} Days)
                        </strong>
                      </div>
                    </div>

                    {/* Urdu Notification Box as explicitly requested */}
                    <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed border ${
                      hasCompleted6Months 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                        : 'bg-amber-50/80 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">
                            شرط برائے مدت: آپ کا کم از کم 6 ماہ (180 دن) اس ویب سائٹ پر رجسٹرڈ اور فعال ہونا لازمی ہے۔
                          </p>
                          <p className="text-[11px] font-normal opacity-90 mt-0.5">
                            {hasCompleted6Months 
                              ? 'ماشاءاللہ! آپ کی آسان سفر پر شمولیت 6 ماہ مکمل ہو چکی ہے۔'
                              : `فی الحال آپ کو آسان سفر پر ${tenure.months} ماہ ہوئے ہیں۔ ایڈمن آپ کی درخواست کا جائزہ لے کر خصوصی استثناء یا منظوری دے سکتا ہے۔`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRITERION 2: CONTRIBUTION & ENGAGEMENT CHECK */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            2. Contribution & Engagement (کارکردگی اور خدمات کی جانچ)
                          </h4>
                          <p className="text-[10px] text-slate-400">Routes added, verified, and community participation</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                        {contributionsCount} Contributed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block">Total Routes Submitted:</span>
                        <strong className="text-xs text-slate-800 font-bold">{contributionsCount} Routes</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block">Approved Routes:</span>
                        <strong className="text-xs text-teal-700 font-bold">{acceptedContributions} Verified</strong>
                      </div>
                    </div>

                    {/* Urdu Notification Box as explicitly requested */}
                    <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs text-teal-950 font-semibold leading-relaxed">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">
                            شرط برائے کارکردگی: تجربہ سرٹیفکیٹ آپ کی ویب سائٹ پر خدمات، روٹس کی تصدیق اور فعال شمولیت (Engagement) کو دیکھ کر ہی ایڈمن کی جانب سے جاری کیا جائے گا۔
                          </p>
                          <p className="text-[11px] font-normal text-teal-900 opacity-90 mt-0.5">
                            سفری سہولیات، بسوں کے اوقات اور کرایوں کی مصدقہ اپ ڈیٹس فراہم کرنے والے رضاکاروں کو ترجیحی بنیادوں پر سرٹیفکیٹ تفویض کیا جاتا ہے۔
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRITERION 3: TERMS AND CONDITIONS (شرائط و ضوابط) */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          3. Terms and Conditions (شرائط و ضوابط)
                        </h4>
                        <p className="text-[10px] text-slate-400">Rules governing the issuance of community credentials</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div>
                          <strong className="text-slate-900">کم از کم مدت کی پابندی (Minimum 6-Month Tenure):</strong>
                          <p className="text-[11px] text-slate-500">رضاکار کا آسان سفر پر کم از کم 6 ماہ سے رجسٹرڈ اور سرگرم ہونا ضروری ہے۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div>
                          <strong className="text-slate-900">معلومات کی درستی اور تصدیق (Data Integrity):</strong>
                          <p className="text-[11px] text-slate-500">پلیٹ فارم پر شامل کیے گئے روٹس، اسٹاپس اور کرایوں کی معلومات درست اور حقیقی ہونی چاہئیں۔ غلط کوائف پر سرٹیفکیٹ رد کیا جائے گا۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div>
                          <strong className="text-slate-900">ایڈمن کا حتمی اختیار (Administrative Discretion):</strong>
                          <p className="text-[11px] text-slate-500">درخواست کو منظور یا مسترد کرنے کا مکمل اور حتمی اختیار آسان سفر ایڈمنسٹریشن کے پاس ہے۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <div>
                          <strong className="text-slate-900">مستقل ڈیجیٹل تصدیق (Permanent Verification ID):</strong>
                          <p className="text-[11px] text-slate-500">منظوری پر آپ کو ایک مستقل شناختی کوڈ الاٹ ہوگا جسے کوئی بھی ادارہ یا فرد آن لائن لائیو چیک کر سکے گا۔</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">5</span>
                        <div>
                          <strong className="text-slate-900">قانونی و اخلاقی استعمال (Lawful & Ethical Use):</strong>
                          <p className="text-[11px] text-slate-500">سرٹیفکیٹ رضاکارانہ خدمات کی سند کے طور پر استعمال کیا جا سکتا ہے، تاہم اس کی بنیاد پر ملازمت یا مالی دعویٰ نہیں کیا جا سکتا۔</p>
                        </div>
                      </div>
                    </div>

                    {/* User Notes Input */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
                        Optional Note / ایڈمن کے لیے کوئی اضافی پیغام یا اپنی خدمات کی تفصیل
                      </label>
                      <textarea
                        rows={2}
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        placeholder="e.g. Added routes for Hyderabad to Sukkur and verified bus stands..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* Agreement Checkbox */}
                    <div 
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 cursor-pointer select-none transition-all hover:bg-emerald-50"
                    >
                      <div className="text-emerald-700 mt-0.5 shrink-0">
                        {agreedToTerms ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div className="text-xs text-slate-800 font-semibold leading-relaxed">
                        <span>I have read, understood, and agreed to all the terms and conditions above.</span>
                        <p className="text-emerald-800 font-bold mt-0.5" dir="rtl">
                          میں نے مندرجہ بالا تمام شرائط و ضوابط پڑھ لیے ہیں اور ان سے مکمل متفق ہوں۔
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submitting || !agreedToTerms}
                      className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                        submitting || !agreedToTerms
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98 shadow-emerald-600/20'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Request to Admin / درخواست ایڈمن کو بھیجیں</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
