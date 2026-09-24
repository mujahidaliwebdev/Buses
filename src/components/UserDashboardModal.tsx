import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CheckCircle2, Clock, XCircle, FileText, Bus, MessageSquare, Award, Sparkles, AlertCircle, BarChart3, Tag, Layers } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface UserDashboardModalProps {
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenVolunteerCard: () => void;
  onOpenExperienceLetter: () => void;
  onOpenSubmitRoute?: () => void;
  onOpenUpdateFares?: () => void;
  onOpenFullBusRouteMap?: () => void;
}

export default function UserDashboardModal({
  onClose,
  onOpenProfile,
  onOpenVolunteerCard,
  onOpenExperienceLetter,
  onOpenSubmitRoute,
  onOpenUpdateFares,
  onOpenFullBusRouteMap
}: UserDashboardModalProps) {
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<any[]>([]);
  const [volunteerApps, setVolunteerApps] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [routeQueries, setRouteQueries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const uid = currentUser.uid;
        const email = currentUser.email;

        // Fetch contributions / routes added
        const contribSnap = await getDocs(query(collection(db, 'contributions'), where('userId', '==', uid)));
        setContributions(contribSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch volunteer applications
        const volSnap = await getDocs(query(collection(db, 'volunteers'), where('userId', '==', uid)));
        let vols = volSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (vols.length === 0 && email) {
          const volEmailSnap = await getDocs(query(collection(db, 'volunteers'), where('email', '==', email)));
          vols = volEmailSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
        setVolunteerApps(vols);

        // Fetch feedback
        const fbSnap = await getDocs(query(collection(db, 'feedback'), where('userId', '==', uid)));
        setFeedbacks(fbSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch route queries
        const rqSnap = await getDocs(query(collection(db, 'route_queries'), where('userId', '==', uid)));
        setRouteQueries(rqSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser]);

  // Route stats
  const totalRoutes = contributions.length;
  const acceptedRoutes = contributions.filter(c => c.status === 'approved' || c.status === 'accepted' || !c.status).length;
  const rejectedRoutes = contributions.filter(c => c.status === 'rejected').length;
  const pendingRoutes = contributions.filter(c => c.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col border border-slate-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 sm:px-8 py-6 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <BarChart3 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-200 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Volunteer Dashboard
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Your Progress & Activity Status</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/50">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-500">Loading your progress stats...</span>
            </div>
          ) : (
            <>
              {/* Route Progress Stats Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Bus className="w-4 h-4 text-emerald-600" /> Bus Routes Contribution Progress (روٹس کی کارکردگی)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Added</span>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-3xl font-black text-slate-900">{totalRoutes}</span>
                      <span className="p-2 bg-slate-50 rounded-xl text-slate-600"><Bus className="w-4 h-4" /></span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Accepted / Approved</span>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-3xl font-black text-emerald-700">{acceptedRoutes}</span>
                      <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Pending Review</span>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-3xl font-black text-amber-700">{pendingRoutes}</span>
                      <span className="p-2 bg-amber-50 rounded-xl text-amber-600"><Clock className="w-4 h-4" /></span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Rejected</span>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-3xl font-black text-rose-700">{rejectedRoutes}</span>
                      <span className="p-2 bg-rose-50 rounded-xl text-rose-600"><XCircle className="w-4 h-4" /></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributed Buses Table Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Bus className="w-4 h-4 text-emerald-600" /> Your Contributed Buses & Routes (آپ کی شامل کردہ بسیں)
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{contributions.length} Route(s) Added</span>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus / Company</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route (Origin ➔ Dest)</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle & Fare</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {contributions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                              You haven't contributed any bus routes yet. Click "+ Add Bus & Stops" below to add one!
                            </td>
                          </tr>
                        ) : (
                          contributions.map((contrib) => (
                            <tr key={contrib.id} className="hover:bg-emerald-50/20 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Bus className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-900">{contrib.companyName || 'Bus Operator'}</p>
                                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      {contrib.busNumber || 'B-01'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-slate-800">{contrib.origin} ➔ {contrib.destination}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">Dep: {contrib.departureTime}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-slate-700">{contrib.type || 'Standard'} • {contrib.isAC ? 'AC' : 'Non-AC'}</p>
                                <p className="font-bold text-emerald-600 mt-0.5">Rs. {contrib.fare?.toLocaleString() || 0}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-mono text-slate-600">{contrib.contactNumber || '-'}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  contrib.status === 'approved' || contrib.status === 'accepted' || !contrib.status ? 'bg-emerald-100 text-emerald-800' :
                                  contrib.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {contrib.status || 'Accepted'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Other Services Status Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Volunteer Application Status */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" /> Volunteer Application Status
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">{volunteerApps.length} Application(s)</span>
                  </div>

                  {volunteerApps.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs font-medium">
                      No volunteer application submitted yet. Click "Join Us" on top to register.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {volunteerApps.map((app, index) => (
                        <div key={app.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{app.fullName || currentUser?.displayName}</p>
                            <p className="text-[10px] text-slate-500">{app.interestArea || 'Volunteer Member'}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            app.status === 'approved' || app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {app.status || 'Approved'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback & Complaints Status */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" /> Feedback / Complaints Status
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">{feedbacks.length} Ticket(s)</span>
                  </div>

                  {feedbacks.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs font-medium">
                      No feedback or complaints submitted.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {feedbacks.map((fb, index) => (
                        <div key={fb.id || index} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800 capitalize">{fb.type || 'Feedback'}: {fb.subject || 'General'}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{fb.message}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {fb.status || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions / Navigation matching the menu request */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Quick Volunteer Actions</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* + Full Bus Route Map Button */}
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenFullBusRouteMap) onOpenFullBusRouteMap();
                    }}
                    className="p-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs flex items-center justify-between transition-all shadow-md shadow-teal-700/20 cursor-pointer"
                  >
                    <span>+ Full Bus Route Map</span>
                    <Layers className="w-4 h-4 text-teal-200" />
                  </button>

                  {/* + Update Fares Button */}
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenUpdateFares) onOpenUpdateFares();
                    }}
                    className="p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-between transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
                  >
                    <span>+ Update Fares</span>
                    <Tag className="w-4 h-4 text-emerald-200" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenProfile();
                    }}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Edit Profile</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVolunteerCard();
                    }}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Volunteer Card</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenExperienceLetter();
                    }}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Experience Letter</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
