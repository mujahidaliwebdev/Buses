import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Calendar, 
  User, 
  Building2, 
  ArrowLeft, 
  Search, 
  Award,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CertificateRecord {
  id: string;
  fullName: string;
  role: string;
  organization: string;
  department: string;
  issueDate: string;
  joiningDate?: string;
  status: string;
  isVerified: boolean;
}

// Officially recorded baseline certificates for immediate verification
const REGISTERED_CERTIFICATES: Record<string, Omit<CertificateRecord, 'id' | 'isVerified'>> = {
  'ASP/EXP/2026092202': {
    fullName: 'Mujahid Ali',
    role: 'Official Community Volunteer',
    organization: 'AsaanSafar Pakistan',
    department: 'Community Operations & Data Verification',
    issueDate: '22 Sep 2026',
    joiningDate: '12 May 2025',
    status: 'Letter Verified & Active'
  },
  'ASP/EXP/2026092201': {
    fullName: 'Mujahid Ali',
    role: 'Official Community Volunteer',
    organization: 'AsaanSafar Pakistan',
    department: 'Community Operations & Data Verification',
    issueDate: '22 Sep 2026',
    joiningDate: '12 May 2025',
    status: 'Letter Verified & Active'
  },
  'ASP/EXP/2026051201': {
    fullName: 'Mujahid Ali',
    role: 'Official Community Volunteer',
    organization: 'AsaanSafar Pakistan',
    department: 'Community Operations & Data Verification',
    issueDate: '12 May 2026',
    joiningDate: '12 May 2025',
    status: 'Letter Verified & Active'
  }
};

export default function CertificateVerification() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract ID from wildcard parameter, path, or query string
  // Handles /verify/ASP/EXP/2026092202, /verify/ASP_EXP_..., /verify?id=...
  const rawPath = params['*'] || location.pathname.replace(/^\/verify\/?/i, '');
  const searchId = new URLSearchParams(location.search).get('id') || '';
  const initialRawId = searchId || rawPath || '';

  // Normalize: trim, decode, replace underscores or multiple slashes
  const cleanId = decodeURIComponent(initialRawId)
    .trim()
    .replace(/^verify\//i, '')
    .replace(/\s+/g, '');

  const [searchQuery, setSearchQuery] = useState(cleanId);
  const [certData, setCertData] = useState<CertificateRecord | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyCertificate(targetId: string) {
      if (!targetId) {
        if (isMounted) {
          setLoading(false);
          setIsVerified(null);
          setCertData(null);
        }
        return;
      }

      setLoading(true);
      const normalizedId = targetId.trim();
      const safeKey = normalizedId.replace(/\//g, '_');

      try {
        // 1. Check known registered certificates list first
        if (REGISTERED_CERTIFICATES[normalizedId]) {
          const registered = REGISTERED_CERTIFICATES[normalizedId];
          const record: CertificateRecord = {
            id: normalizedId,
            fullName: registered.fullName,
            role: registered.role,
            organization: registered.organization,
            department: registered.department,
            issueDate: registered.issueDate,
            joiningDate: registered.joiningDate,
            status: registered.status,
            isVerified: true
          };

          if (isMounted) {
            setCertData(record);
            setIsVerified(true);
            setLoading(false);
          }

          // Sync to Firestore in background
          try {
            const certDocRef = doc(db, 'experience_certificates', safeKey);
            await setDoc(certDocRef, { ...record, safeKey, lastVerified: new Date().toISOString() }, { merge: true });
          } catch (e) {
            // Ignore offline/permission sync
          }
          return;
        }

        // 2. Check localStorage for certificates generated in this browser
        try {
          const localItem = localStorage.getItem(`asp_cert_${safeKey}`);
          if (localItem) {
            const parsed = JSON.parse(localItem);
            if (parsed && (parsed.id === normalizedId || parsed.safeKey === safeKey)) {
              if (isMounted) {
                setCertData({
                  id: normalizedId,
                  fullName: parsed.fullName || 'Official Volunteer',
                  role: parsed.role || 'Official Community Volunteer',
                  organization: parsed.organization || 'AsaanSafar Pakistan',
                  department: parsed.department || 'Community Operations & Data Verification',
                  issueDate: parsed.issueDate || 'Verified',
                  joiningDate: parsed.joiningDate,
                  status: 'Letter Verified & Active',
                  isVerified: true
                });
                setIsVerified(true);
                setLoading(false);
              }
              return;
            }
          }
        } catch (e) {
          // Ignore local storage error
        }

        // 3. Query Firestore experience_certificates collection
        try {
          const certDocRef = doc(db, 'experience_certificates', safeKey);
          const snap = await getDoc(certDocRef);

          if (snap.exists() && snap.data()) {
            const data = snap.data();
            if (isMounted) {
              setCertData({
                id: data.id || normalizedId,
                fullName: data.fullName || 'Verified Volunteer',
                role: data.role || 'Official Community Volunteer',
                organization: data.organization || 'AsaanSafar Pakistan',
                department: data.department || 'Community Operations & Data Verification',
                issueDate: data.issueDate || data.issuedDate || 'Verified',
                joiningDate: data.joiningDate,
                status: data.status || 'Letter Verified & Active',
                isVerified: true
              });
              setIsVerified(true);
              setLoading(false);
            }
            return;
          }
        } catch (dbErr) {
          console.warn('Firestore verification lookup notice:', dbErr);
        }

        // 4. If ID does not match any authentic record, it is NOT verified
        if (isMounted) {
          setCertData(null);
          setIsVerified(false);
          setLoading(false);
        }
      } catch (err) {
        console.error('Verification process error:', err);
        if (isMounted) {
          setCertData(null);
          setIsVerified(false);
          setLoading(false);
        }
      }
    }

    verifyCertificate(cleanId);

    return () => {
      isMounted = false;
    };
  }, [cleanId]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const target = searchQuery.trim().replace(/^verify\//i, '');
    navigate(`/verify/${encodeURIComponent(target)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to AsaanSafar Home
          </Link>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Credential Verification System
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100 flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <h3 className="text-base font-black text-slate-800">Checking Verification Registry...</h3>
            <p className="text-xs text-slate-500 mt-1">Connecting to AsaanSafar Official Verification Database</p>
          </div>
        ) : cleanId && isVerified && certData ? (
          /* VERIFIED STATE: LETTER VERIFIED */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Verified Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 p-8 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-widest shadow-sm mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    Letter Verified
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Volunteer Experience Letter Verified
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                    Authentic credential recognized and confirmed by AsaanSafar Pakistan
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-9 h-9 text-emerald-300" />
                </div>
              </div>
            </div>

            {/* Credential Data Fields */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Prominent Volunteer Name & Status */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block mb-0.5">
                    Volunteer Name
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{certData.fullName}</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block mb-0.5">
                    Verification Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Letter Verified
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Verification ID
                  </span>
                  <span className="text-base font-mono font-black text-slate-900">
                    {certData.id}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Designation / Role
                  </span>
                  <span className="text-base font-black text-emerald-700">
                    {certData.role}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Issuing Organization
                  </span>
                  <span className="text-sm font-black text-slate-800 block">
                    {certData.organization}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {certData.department}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Issue Date
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{certData.issueDate}</span>
                  </div>
                  {certData.joiningDate && (
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Service Start Date: {certData.joiningDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Authenticated Scope of Contributions */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Authenticated Contribution Scope
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Public transport routes, stops, and destinations verification</li>
                  <li>Bus arrival and departure timetables review</li>
                  <li>Passenger fares and route-wise pricing validation</li>
                  <li>Bus terminals, stands, and stop location data mapping</li>
                  <li>Transport operators and service quality assessments</li>
                </ul>
              </div>

              {/* Security Seal & Notice */}
              <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Officially Authenticated Digital Credential</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Verification contact: <a href="mailto:info@asaansafar.com" className="text-emerald-600 font-bold hover:underline">info@asaansafar.com</a>
                </p>
              </div>
            </div>
          </div>
        ) : cleanId && isVerified === false ? (
          /* NOT VERIFIED STATE */
          <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
            {/* Not Verified Header Banner */}
            <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-800 p-8 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 text-rose-100 text-xs font-black uppercase tracking-widest border border-rose-300/30 mb-3">
                    <XCircle className="w-4 h-4 text-rose-300" />
                    Not Verified
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Letter Not Verified
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
                    No active or authentic volunteer experience letter found for this ID
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-9 h-9 text-rose-200" />
                </div>
              </div>
            </div>

            {/* Not Verified Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-rose-900">
                      Record Not Found in Official Registry
                    </h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      Verification ID <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-900">{cleanId}</span> does not exist in the AsaanSafar verified certificates database.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Entered ID
                  </span>
                  <span className="text-sm font-mono font-black text-slate-700">
                    {cleanId}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Current Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black">
                    <XCircle className="w-3.5 h-3.5" /> Not Verified
                  </span>
                </div>
              </div>

              {/* Search Another ID */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
                  Verify Another Certificate ID
                </h4>
                <form onSubmit={handleManualSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ASP/EXP/2026092202"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" /> Check
                  </button>
                </form>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400 font-medium">
                  If you believe this is an error, please contact the AsaanSafar volunteer administration team at <a href="mailto:info@asaansafar.com" className="text-emerald-600 font-bold hover:underline">info@asaansafar.com</a>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE: ENTER ID TO VERIFY */
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official Credential Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
                Enter a volunteer experience letter verification ID to check its validity and authenticity.
              </p>
            </div>

            <form onSubmit={handleManualSearch} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Verification ID (e.g. ASP/EXP/2026092202)"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-emerald-600/20"
              >
                <Search className="w-4 h-4" /> Verify
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
