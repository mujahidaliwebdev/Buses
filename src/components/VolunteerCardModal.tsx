import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ShieldCheck, Sparkles, Download, CheckCircle2, AlertCircle, Send, Globe, Facebook, Youtube, Instagram, Twitter } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { d1UserBridge } from '../lib/d1UserBridge';

interface VolunteerCardModalProps {
  onClose: () => void;
}

const getLogoPath = () => {
  return 'https://lh3.googleusercontent.com/d/1BLe_EDy4yCALfwQpgnUDQPoKSyKdECrq';
};

export default function VolunteerCardModal({ onClose }: VolunteerCardModalProps) {
  const currentUser = auth.currentUser;
  const cardRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState<any>({
    displayName: currentUser?.displayName || 'Registered Volunteer',
    email: currentUser?.email || '',
    cnic: '43201-7860123-5',
    gender: 'Not specified',
    district: 'Karachi',
    registrationDate: '2026-05-12T00:00:00.000Z',
    photoURL: currentUser?.photoURL || ''
  });

  const [requestItem, setRequestItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchUserDataAndCard() {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        let data: any = {};
        if (userDoc.exists()) {
          data = userDoc.data();
        }

        const regDate = data.registrationDate || currentUser.metadata?.creationTime || '2026-05-12T00:00:00.000Z';

        if (isMounted) {
          setUserData({
            displayName: data.displayName || currentUser.displayName || 'Registered Volunteer',
            email: currentUser.email || '',
            cnic: data.cnic || '43201-7860123-5',
            gender: data.gender || 'Not specified',
            district: data.homeCity || 'Karachi',
            registrationDate: regDate,
            photoURL: data.photoURL || currentUser.photoURL || '',
            volunteerCardApproved: data.volunteerCardApproved || false,
            volunteerCardId: data.volunteerCardId || ''
          });
        }

        // Fetch Volunteer Card status directly from Cloudflare D1
        const pubId = await d1UserBridge.ensureProfile(currentUser);
        const myCard = await d1UserBridge.getMyVolunteerCard(pubId, currentUser.uid);
        if (isMounted && myCard) {
          setRequestItem({
            id: String(myCard.id),
            status: String(myCard.status || 'Pending').toLowerCase(),
            volunteerCardId: myCard.volunteer_card_id,
            cnic: myCard.cnic,
            homeCity: myCard.home_city,
            registrationDate: myCard.registration_date,
            remarks: myCard.remarks,
            rejectionReason: myCard.remarks,
            submittedAt: myCard.created_at
          });
          if (myCard.volunteer_card_id) {
            setUserData((prev: any) => ({ ...prev, volunteerCardId: myCard.volunteer_card_id }));
          }
        }
      } catch (err) {
        console.error('Error fetching volunteer user data from D1:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserDataAndCard();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    setError(null);

    try {
      const publicUserId = await d1UserBridge.ensureProfile(currentUser);

      // Save directly to D1 volunteer_card table
      const res = await d1UserBridge.submitVolunteerCard(publicUserId, {
        cnic: userData.cnic,
        home_city: userData.district,
        registration_date: userData.registrationDate,
        volunteer_card_id: formatVolunteerCardId(),
        remarks: 'Submitted from Volunteer Card Modal'
      });

      if (!res.success && res.message) {
        throw new Error(res.message);
      }

      setSuccessMsg('Volunteer card request submitted successfully to Cloudflare D1!');

      // Reload card directly from D1
      const myCard = await d1UserBridge.getMyVolunteerCard(publicUserId, currentUser.uid);
      if (myCard) {
        setRequestItem({
          id: String(myCard.id),
          status: String(myCard.status || 'Pending').toLowerCase(),
          volunteerCardId: myCard.volunteer_card_id,
          cnic: myCard.cnic,
          homeCity: myCard.home_city,
          registrationDate: myCard.registration_date,
          remarks: myCard.remarks,
          rejectionReason: myCard.remarks,
          submittedAt: myCard.created_at
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AsaanSafar Volunteer Card - ${userData.displayName}</title>
          <style>
            @page { size: 85.6mm 54mm landscape; margin: 0; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: Arial, Helvetica, sans-serif; background: #fff; }
            .card {
              position: relative;
              width: 85.6mm;
              height: 54mm;
              padding: 4mm 5mm;
              border: 1.2mm solid #047857;
              border-radius: 3mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
            }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 0.4mm solid #d1fae5; padding-bottom: 1.5mm; }
            .brand { display: flex; align-items: center; gap: 1.5mm; }
            .brand img { width: 6mm; height: 6mm; border-radius: 1mm; object-fit: cover; }
            .brand-text h1 { margin: 0; font-size: 3.2mm; font-weight: 900; color: #0f172a; }
            .brand-text span { font-size: 1.6mm; font-weight: 700; color: #047857; text-transform: uppercase; }
            .qr { display: flex; align-items: center; gap: 1mm; background: #ecfdf5; padding: 0.8mm 1.5mm; border-radius: 1.5mm; border: 0.2mm solid #047857; }
            .qr img { width: 6mm; height: 6mm; }
            .body { display: flex; gap: 2mm; align-items: center; }
            .details { flex: 1; font-size: 2.1mm; font-weight: 700; line-height: 1.6; }
            .details .label { color: #047857; font-weight: 900; text-transform: uppercase; font-size: 1.7mm; display: inline-block; width: 15mm; }
            .photo-block { text-align: center; }
            .photo-block .photo { width: 13mm; height: 13mm; border-radius: 2mm; border: 0.3mm solid #047857; object-fit: cover; background: #f1f5f9; }
            .photo-block .name { font-size: 2.2mm; font-weight: 900; margin-top: 1mm; max-width: 20mm; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .photo-block .role { font-size: 1.7mm; font-weight: 800; color: #047857; text-transform: uppercase; }
            .footer { display: flex; justify-content: space-between; font-size: 1.5mm; color: #047857; font-weight: 700; text-transform: uppercase; border-top: 0.3mm solid #d1fae5; padding-top: 1mm; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="brand">
                <img src="${getLogoPath()}" alt="Logo" />
                <div class="brand-text">
                  <h1>AsaanSafar <span style="color:#0f172a;">Pakistan</span></h1>
                  <span>Official Volunteer Identity Card</span>
                </div>
              </div>
              <div class="qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formatVolunteerCardId())}" alt="QR" />
              </div>
            </div>
            <div class="body">
              <div class="details">
                <div><span class="label">ID:</span> ${formatVolunteerCardId()}</div>
                <div><span class="label">CNIC:</span> ${userData.cnic}</div>
                <div><span class="label">Gender:</span> ${userData.gender}</div>
                <div><span class="label">District:</span> ${userData.district}</div>
                <div><span class="label">Expiry:</span> ${getExpiryDate()}</div>
              </div>
              <div class="photo-block">
                ${userData.photoURL ? `<img class="photo" src="${userData.photoURL}" />` : `<div class="photo" style="display:flex;align-items:center;justify-content:center;font-weight:900;font-size:5mm;color:#334155;">${(userData.displayName || 'V').charAt(0).toUpperCase()}</div>`}
                <div class="name">${userData.displayName}</div>
                <div class="role">Volunteer</div>
              </div>
            </div>
            <div class="footer">
              <span>www.asaansafar.com</span>
              <span>Official ID Card</span>
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

    printWindow.document.write(cardHtml);
    printWindow.document.close();
  };

  // Format ID from registration date (e.g. 2026-05-12 -> 2026051201)
  const formatVolunteerCardId = () => {
    if (requestItem?.volunteerCardId) return requestItem.volunteerCardId;
    if (userData.volunteerCardId) return userData.volunteerCardId;
    
    const dateObj = new Date(userData.registrationDate || '2026-05-12');
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const suffix = currentUser?.uid ? currentUser.uid.replace(/[^0-9]/g, '').slice(-2) || '01' : '01';
    return `${yyyy}${mm}${dd}${suffix}`;
  };

  // Expiry date = 1 year after registration date or current year + 1
  const getExpiryDate = () => {
    const dateObj = new Date(userData.registrationDate || '2026-05-12');
    dateObj.setFullYear(dateObj.getFullYear() + 1);
    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isApproved = String(requestItem?.status || '').toLowerCase() === 'approved';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md print:hidden"
      />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 p-6 sm:p-8 text-center space-y-6 print:shadow-none print:p-0 print:border-none print:max-w-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 print:hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Official Volunteer ID Card
          </div>
          <h2 className="text-xl font-black text-slate-900">AsaanSafar Volunteer Identity</h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-bold">Loading volunteer verification status...</div>
        ) : !isApproved ? (
          /* Request / Pending State */
          <div className="space-y-6 text-left bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Request Official Volunteer Card</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {requestItem?.status === 'pending' ? 'Your request is currently under review by Admin.' :
                   requestItem?.status === 'rejected' ? 'Your previous request was declined. Please review and re-apply.' :
                   'Unlock your official AsaanSafar digital CNIC volunteer card.'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Volunteer Card Guidelines & Terms:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 font-medium">
                <li>Active volunteers must provide accurate CNIC and engagement details.</li>
                <li>Cards are issued upon Admin verification of community contribution.</li>
                <li>Ensure your profile CNIC and Home City are up to date before submitting.</li>
              </ul>
            </div>

            {requestItem?.status === 'pending' ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center text-amber-800 font-bold text-xs">
                ⏳ Request Pending Review / درخواست زیر غور ہے
              </div>
            ) : (
              <form onSubmit={handleRequestCard} className="space-y-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  Request Volunteer Card / کارڈ کی درخواست دیں
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Approved Card View */
          <div className="space-y-6">
            {/* CNIC Card Size Graphic */}
            <div 
              ref={cardRef}
              className="relative w-full aspect-[1.58/1] max-w-[440px] mx-auto bg-white rounded-2xl p-5 text-slate-900 text-left shadow-2xl border-2 border-emerald-700/30 overflow-hidden flex flex-col justify-between print:m-0 print:shadow-none print:border-2 print:border-emerald-800 z-10"
            >
              {/* Background Logo Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none z-0">
                <img src={getLogoPath()} alt="Watermark" className="w-56 h-56 object-contain" />
              </div>

              {/* Background subtle green tint (15%) */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50/80 rounded-full blur-2xl pointer-events-none z-0" />
              
              {/* Top Header: Logo, AsaanSafar Pakistan, and QR Code at top right */}
              <div className="relative z-10 flex items-center justify-between border-b-2 border-emerald-700/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 overflow-hidden flex items-center justify-center shadow-md shrink-0 p-0.5">
                    <img src={getLogoPath()} alt="AsaanSafar" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-900">AsaanSafar</h4>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pakistan</span>
                    </div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Official Volunteer Identity Card</p>
                  </div>
                </div>

                {/* QR Code at Top Right (replacing Verified Badge) */}
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-700/30 shadow-xs">
                  <div className="w-9 h-9 bg-white p-0.5 rounded-lg border border-emerald-700/30 flex items-center justify-center shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formatVolunteerCardId())}`}
                      alt="QR Code"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-[7px] font-black uppercase tracking-wider text-emerald-800 block">Scan QR</span>
                    <span className="text-[6px] font-bold text-slate-500 uppercase">Verify ID</span>
                  </div>
                </div>
              </div>

              {/* Middle Body: Left details, Right picture */}
              <div className="relative z-10 grid grid-cols-12 gap-3 items-center my-auto py-1">
                {/* Left Side Details */}
                <div className="col-span-7 space-y-1.5 text-[11px] font-bold font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-black uppercase text-[9px] w-14 shrink-0">ID:</span>
                    <span className="text-slate-900 font-black tracking-wider text-xs">{formatVolunteerCardId()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-black uppercase text-[9px] w-14 shrink-0">CNIC:</span>
                    <span className="text-slate-800">{userData.cnic}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-black uppercase text-[9px] w-14 shrink-0">Gender:</span>
                    <span className="text-slate-800">{userData.gender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-black uppercase text-[9px] w-14 shrink-0">District:</span>
                    <span className="text-slate-800">{userData.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-black uppercase text-[9px] w-14 shrink-0">Expiry:</span>
                    <span className="text-emerald-800 font-black">{getExpiryDate()}</span>
                  </div>
                </div>

                {/* Right Side: User Picture, Name, Designation */}
                <div className="col-span-5 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border-2 border-emerald-700/55 overflow-hidden shadow-md flex items-center justify-center font-black text-2xl text-slate-800 mb-1">
                    {userData.photoURL ? (
                      <img src={userData.photoURL} alt="Volunteer" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(userData.displayName || 'V').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight max-w-[125px] truncate">
                    {userData.displayName}
                  </h3>
                  <p className="text-[9px] text-emerald-700 font-black uppercase tracking-wider mt-0.5 max-w-[125px] truncate">
                    Volunteer
                  </p>
                </div>
              </div>

              {/* Footer Bar with Website & Socials */}
              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[8px] text-emerald-200 uppercase tracking-wider font-bold">
                <span className="font-mono">www.asaansafar.com</span>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Globe className="w-2.5 h-2.5" />
                  <Facebook className="w-2.5 h-2.5" />
                  <Youtube className="w-2.5 h-2.5" />
                  <Instagram className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>

            {/* Actions: Download PDF & Close */}
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download as PDF / Save Card
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
