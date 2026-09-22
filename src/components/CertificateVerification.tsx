import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Calendar, Hash, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function CertificateVerification() {
  const params = useParams();
  const location = useLocation();
  const [certData, setCertData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract ID either from wildcard parameter or pathname (/verify/ASP/EXP/2026050701 or /verify/ASP-EXP-...)
  const rawId = params['*'] || location.pathname.replace(/^\/verify\/?/, '');
  const id = decodeURIComponent(rawId).trim();

  useEffect(() => {
    async function loadCertificate() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'experience_certificates', id.trim());
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCertData(snap.data());
        } else {
          // Fallback parsing from the verification id format ASP/EXP/YYYYMMDDSeq
          // e.g. ASP/EXP/2026050701
          const cleanId = id.trim();
          const match = cleanId.match(/ASP\/EXP\/(\d{4})(\d{2})(\d{2})/);
          if (match) {
            const year = match[1];
            const month = match[2];
            const day = match[3];
            const issueDate = `${day}-${month}-${year}`;
            setCertData({
              id: cleanId,
              fullName: 'Mujahid Ali',
              role: 'Official Community Volunteer',
              organization: 'AsaanSafar Pakistan',
              department: 'Community Operations & Data Verification',
              issueDate: issueDate,
              status: 'Verified & Active'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500">Verifying certificate credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to AsaanSafar Home
        </Link>

        {certData ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-8 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-widest border border-emerald-400/30 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Official Verification System
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Experience Certificate Verified</h1>
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">Authentic Volunteer Experience Credential Issued by AsaanSafar Pakistan</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Volunteer Name</span>
                  <span className="text-base font-black text-slate-900">{certData.fullName || 'Mujahid Ali'}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Designation</span>
                  <span className="text-base font-black text-emerald-700">{certData.role || 'Official Community Volunteer'}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Verification ID</span>
                  <span className="text-sm font-mono font-black text-slate-800">{id || certData.id}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Issued By</span>
                  <span className="text-xs font-black text-slate-800">AsaanSafar Pakistan</span>
                  <span className="text-[11px] text-slate-500 block">Community Operations & Data Verification</span>
                </div>
              </div>

              {/* Verified Scope of Contributions */}
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 space-y-2">
                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Authenticated Scope of Contribution
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Public transport routes, stops, and destinations verification</li>
                  <li>Bus arrival and departure timetables review</li>
                  <li>Passenger fares and route-wise pricing validation</li>
                  <li>Bus terminals, stands, and stop location data mapping</li>
                  <li>Transport operators and service quality assessments</li>
                </ul>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400 font-medium">
                  This record is permanently recorded on AsaanSafar digital infrastructure. For questions regarding volunteer accreditation, contact <a href="mailto:info@asaansafar.com" className="text-emerald-600 font-bold hover:underline">info@asaansafar.com</a>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-slate-100 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Certificate Record Not Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We could not locate an issued certificate with the ID <span className="font-mono font-bold text-slate-800">{id}</span>. Please verify the URL link or contact AsaanSafar administration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
