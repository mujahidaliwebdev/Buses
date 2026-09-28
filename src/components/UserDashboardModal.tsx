import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, CheckCircle2, Clock, XCircle, FileText, Bus, MessageSquare, 
  Award, Sparkles, AlertCircle, BarChart3, Tag, Layers, Edit3, Send, Check, 
  RefreshCw, Plus, Trash2, ArrowRight, MapPin, ArrowUp, ArrowDown
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { d1UserBridge } from '../lib/d1UserBridge';
import { PAKISTAN_CITIES } from '../data/mockBuses';

interface UserDashboardModalProps {
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenVolunteerCard: () => void;
  onOpenExperienceLetter: () => void;
  onOpenSubmitRoute?: () => void;
  onOpenUpdateFares?: () => void;
  onOpenFullBusRouteMap?: () => void;
  isPage?: boolean;
}

export default function UserDashboardModal({
  onClose,
  onOpenProfile,
  onOpenVolunteerCard,
  onOpenExperienceLetter,
  onOpenSubmitRoute,
  onOpenUpdateFares,
  onOpenFullBusRouteMap,
  isPage = false
}: UserDashboardModalProps) {
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<any[]>([]);
  const [fareRequests, setFareRequests] = useState<any[]>([]);
  const [volunteerApps, setVolunteerApps] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [routeQueries, setRouteQueries] = useState<any[]>([]);

  // Navigation tab for user contributions
  const [activeTab, setActiveTab] = useState<'routes' | 'fares'>('routes');
  const [routeFilter, setRouteFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [fareFilter, setFareFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Editing state for rejected route
  const [editingRoute, setEditingRoute] = useState<any | null>(null);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editBusNumber, setEditBusNumber] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editType, setEditType] = useState('Standard');
  const [editClimate, setEditClimate] = useState<'AC' | 'Non-AC'>('AC');
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDepTime, setEditDepTime] = useState('');
  const [editArrTime, setEditArrTime] = useState('');
  const [editTerminal, setEditTerminal] = useState('');
  const [editStand, setEditStand] = useState('');
  const [editStops, setEditStops] = useState<any[]>([]);
  const [customCityIndices, setCustomCityIndices] = useState<Record<number, boolean>>({});

  // Editing state for rejected fare
  const [editingFare, setEditingFare] = useState<any | null>(null);
  const [editFareOrigin, setEditFareOrigin] = useState('');
  const [editFareDest, setEditFareDest] = useState('');
  const [editNonAc, setEditNonAc] = useState<number | string>('');
  const [editAc, setEditAc] = useState<number | string>('');
  const [editExec, setEditExec] = useState<number | string>('');
  const [editBiz, setEditBiz] = useState<number | string>('');
  const [editSleep, setEditSleep] = useState<number | string>('');

  // Submitting resubmissions
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitSuccessMsg, setResubmitSuccessMsg] = useState<string | null>(null);
  const [resubmitErrorMsg, setResubmitErrorMsg] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      const uid = currentUser.uid;
      const email = currentUser.email;

      // Ensure profile and obtain Public User ID
      const pubId = await d1UserBridge.ensureProfile(currentUser);

      // 1. Fetch user bus contributions from Cloudflare D1
      const cRes = await fetch(`/api/contributions/mine?public_user_id=${encodeURIComponent(pubId)}&user_id=${encodeURIComponent(uid)}`);
      const cData = await cRes.json();
      setContributions((cData.contributions || []).map((c: any) => ({
        id: `d1-${c.id}`,
        rawId: c.id,
        companyName: c.company_name,
        busNumber: c.vehicle_plate,
        origin: c.stops?.[0]?.city_name || 'Origin',
        destination: c.stops?.[c.stops.length - 1]?.city_name || 'Destination',
        departureTime: c.stops?.[0]?.departure_time || '',
        arrivalTime: c.stops?.[c.stops.length - 1]?.arrival_time || '',
        terminalLocation: c.stops?.[0]?.location || '',
        standNumber: c.stops?.[0]?.stand || '',
        type: c.service_type || 'Standard',
        isAC: c.climate_control === 'AC',
        climateControl: c.climate_control || 'AC',
        contactNumber: c.contact_number || '',
        fare: 0,
        status: c.status || 'Pending',
        remarks: c.remarks || '',
        stops: c.stops || []
      })));

      // 2. Fetch user fare contributions from Cloudflare D1
      const myFares = await d1UserBridge.getMyFareRequests(pubId, uid);
      setFareRequests(Array.isArray(myFares) ? myFares : []);

      // 3. Fetch volunteer applications
      const volSnap = await getDocs(query(collection(db, 'volunteers'), where('userId', '==', uid)));
      let vols = volSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (vols.length === 0 && email) {
        const volEmailSnap = await getDocs(query(collection(db, 'volunteers'), where('email', '==', email)));
        vols = volEmailSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      setVolunteerApps(vols);

      // 4. Fetch feedback
      const fbSnap = await getDocs(query(collection(db, 'feedback'), where('userId', '==', uid)));
      setFeedbacks(fbSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // 5. Fetch route queries
      const rqSnap = await getDocs(query(collection(db, 'route_queries'), where('userId', '==', uid)));
      setRouteQueries(rqSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  // Route stats
  const norm = (s: any) => String(s || 'pending').toLowerCase();
  const totalRoutes = contributions.length;
  const acceptedRoutes = contributions.filter(c => ['approved', 'accepted'].includes(norm(c.status))).length;
  const rejectedRoutes = contributions.filter(c => norm(c.status) === 'rejected').length;
  const pendingRoutes = contributions.filter(c => norm(c.status) === 'pending').length;

  // Fare stats
  const totalFares = fareRequests.length;
  const acceptedFares = fareRequests.filter(f => ['approved', 'accepted'].includes(norm(f.status))).length;
  const rejectedFares = fareRequests.filter(f => norm(f.status) === 'rejected').length;
  const pendingFares = fareRequests.filter(f => norm(f.status) === 'pending').length;

  // Stop manipulation handlers for route edit modal (matches AddFullBusRouteModal)
  const handleAddStop = () => {
    setEditStops(prev => [
      ...prev,
      {
        stop_sequence: prev.length + 1,
        city_name: PAKISTAN_CITIES[0] || 'Lahore',
        arrival_time: '10:00',
        departure_time: '10:15',
        location: 'General Bus Stand',
        stand: 'General Bus Stand'
      }
    ]);
  };

  const handleRemoveStop = (index: number) => {
    if (editStops.length <= 2) {
      setResubmitErrorMsg('A bus route must have at least 2 stops. (کم از کم 2 اسٹاپس ضروری ہیں)');
      return;
    }
    setEditStops(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stop_sequence: idx + 1 })));
    setCustomCityIndices(prev => {
      const nextMap: Record<number, boolean> = {};
      Object.keys(prev).forEach(k => {
        const ki = Number(k);
        if (ki < index) nextMap[ki] = prev[ki];
        else if (ki > index) nextMap[ki - 1] = prev[ki];
      });
      return nextMap;
    });
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    setEditStops(prev => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((s, idx) => ({ ...s, stop_sequence: idx + 1 }));
    });
    setCustomCityIndices(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const nextMap = { ...prev };
      const curVal = !!nextMap[index];
      const targetVal = !!nextMap[targetIndex];
      nextMap[index] = targetVal;
      nextMap[targetIndex] = curVal;
      return nextMap;
    });
  };

  const handleStopChange = (index: number, field: string, value: any) => {
    setEditStops(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
        // Keep terminal location and stand synchronized so database updates accurately
        if (field === 'location') {
          updated[index].stand = value;
        } else if (field === 'stand') {
          updated[index].location = value;
        }
      }
      return updated;
    });
  };

  // Open Edit Route Modal
  const handleOpenEditRoute = (route: any) => {
    setEditingRoute(route);
    setEditCompanyName(route.companyName || '');
    setEditBusNumber(route.busNumber || '');
    setEditContactNumber(route.contactNumber || '');
    setEditType(route.type || 'Standard');
    setEditClimate(route.climateControl || (route.isAC ? 'AC' : 'Non-AC'));
    setEditOrigin(route.origin || '');
    setEditDestination(route.destination || '');
    setEditDepTime(route.departureTime || '');
    setEditArrTime(route.arrivalTime || '');
    setEditTerminal(route.terminalLocation || '');
    setEditStand(route.standNumber || '');
    
    const initialCustomMap: Record<number, boolean> = {};

    if (Array.isArray(route.stops) && route.stops.length >= 2) {
      setEditStops(route.stops.map((s: any, idx: number) => {
        const cityName = s.city_name || '';
        if (cityName && !PAKISTAN_CITIES.includes(cityName)) {
          initialCustomMap[idx] = true;
        }
        const loc = s.location || s.stand || '';
        return {
          stop_sequence: s.stop_sequence || (idx + 1),
          city_name: cityName,
          arrival_time: s.arrival_time || '',
          departure_time: s.departure_time || '',
          location: loc,
          stand: loc || 'General Bus Stand'
        };
      }));
    } else {
      const origLoc = route.terminalLocation || route.standNumber || 'General Bus Stand';
      const origCity = route.origin || 'Lahore';
      const destCity = route.destination || 'Rawalpindi';
      if (origCity && !PAKISTAN_CITIES.includes(origCity)) initialCustomMap[0] = true;
      if (destCity && !PAKISTAN_CITIES.includes(destCity)) initialCustomMap[1] = true;

      setEditStops([
        { 
          stop_sequence: 1, 
          city_name: origCity, 
          arrival_time: route.departureTime || '08:00', 
          departure_time: route.departureTime || '08:30', 
          location: origLoc, 
          stand: origLoc 
        },
        { 
          stop_sequence: 2, 
          city_name: destCity, 
          arrival_time: route.arrivalTime || '13:30', 
          departure_time: route.arrivalTime || '14:00', 
          location: 'Main Terminal', 
          stand: 'Main Terminal' 
        }
      ]);
    }

    setCustomCityIndices(initialCustomMap);
    setResubmitSuccessMsg(null);
    setResubmitErrorMsg(null);
  };

  // Submit Resubmitted Route
  const handleSubmitResubmitRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingRoute) return;

    if (!editCompanyName.trim()) {
      setResubmitErrorMsg('Please enter company name. (کمپنی کا نام درج کریں)');
      return;
    }

    if (editStops.length < 2) {
      setResubmitErrorMsg('Please add at least 2 stops. (کم از کم 2 اسٹاپس ضروری ہیں)');
      return;
    }

    setIsResubmitting(true);
    setResubmitErrorMsg(null);
    try {
      const pubId = await d1UserBridge.ensureProfile(currentUser);
      
      const preparedStops = editStops.map((s, idx) => ({
        stop_sequence: idx + 1,
        city_name: String(s.city_name || '').trim(),
        arrival_time: String(s.arrival_time || '').trim(),
        departure_time: String(s.departure_time || '').trim(),
        location: String(s.location || s.stand || '').trim(),
        stand: String(s.stand || s.location || '').trim()
      }));

      const routeMapStr = preparedStops.map(s => s.city_name).filter(Boolean).join(' -> ');
      const targetId = editingRoute.rawId || String(editingRoute.id || '').replace('d1-', '');

      const res = await d1UserBridge.resubmitBusContribution(
        targetId,
        pubId,
        {
          company_name: editCompanyName.trim(),
          vehicle_plate: editBusNumber.trim(),
          contact_number: editContactNumber.trim(),
          climate_control: editClimate,
          service_type: editType,
          route_map: routeMapStr
        },
        preparedStops
      );

      if (!res.success) {
        throw new Error(res.message || 'Failed to resubmit route');
      }

      setResubmitSuccessMsg('Route updated and resubmitted for admin review! (روٹ کی تصحیح کر کے ایڈمن کو دوبارہ بھیج دیا گیا)');
      
      // Update local state optimistically
      setContributions(prev => prev.map(c => (c.rawId === editingRoute.rawId || c.id === editingRoute.id) ? {
        ...c,
        companyName: editCompanyName.trim(),
        busNumber: editBusNumber.trim(),
        contactNumber: editContactNumber.trim(),
        service_type: editType,
        climateControl: editClimate,
        isAC: editClimate === 'AC',
        origin: preparedStops[0]?.city_name,
        destination: preparedStops[preparedStops.length - 1]?.city_name,
        departureTime: preparedStops[0]?.departure_time,
        arrivalTime: preparedStops[preparedStops.length - 1]?.arrival_time,
        terminalLocation: preparedStops[0]?.location || '',
        standNumber: preparedStops[0]?.stand || '',
        status: 'Pending',
        remarks: null,
        stops: preparedStops
      } : c));

      // Refresh data from server
      fetchUserData();

      setTimeout(() => {
        setEditingRoute(null);
        setResubmitSuccessMsg(null);
      }, 1800);

    } catch (err: any) {
      setResubmitErrorMsg(err.message || 'Error resubmitting route');
    } finally {
      setIsResubmitting(false);
    }
  };

  // Open Edit Fare Modal
  const handleOpenEditFare = (fare: any) => {
    setEditingFare(fare);
    setEditFareOrigin(fare.origin || '');
    setEditFareDest(fare.destination || '');
    setEditNonAc(fare.non_ac || '');
    setEditAc(fare.ac || '');
    setEditExec(fare.executive || '');
    setEditBiz(fare.business || '');
    setEditSleep(fare.sleeper || '');
    setResubmitSuccessMsg(null);
    setResubmitErrorMsg(null);
  };

  // Submit Resubmitted Fare
  const handleSubmitResubmitFare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingFare) return;
    setIsResubmitting(true);
    setResubmitErrorMsg(null);
    try {
      const pubId = await d1UserBridge.ensureProfile(currentUser);

      const res = await d1UserBridge.resubmitFareContribution(
        editingFare.id,
        pubId,
        {
          origin: editFareOrigin,
          destination: editFareDest,
          non_ac: Number(editNonAc) || 0,
          ac: Number(editAc) || 0,
          executive: Number(editExec) || 0,
          business: Number(editBiz) || 0,
          sleeper: Number(editSleep) || 0
        }
      );

      if (!res.success) {
        throw new Error(res.message || 'Failed to resubmit fare');
      }

      setResubmitSuccessMsg('Fare updated and resubmitted for admin review! (کرایہ کی تجاویز ایڈمن کو دوبارہ بھیج دی گئیں)');

      // Update local state optimistically
      setFareRequests(prev => prev.map(f => f.id === editingFare.id ? {
        ...f,
        origin: editFareOrigin,
        destination: editFareDest,
        non_ac: Number(editNonAc) || 0,
        ac: Number(editAc) || 0,
        executive: Number(editExec) || 0,
        business: Number(editBiz) || 0,
        sleeper: Number(editSleep) || 0,
        status: 'Pending',
        remarks: null
      } : f));

      fetchUserData();

      setTimeout(() => {
        setEditingFare(null);
        setResubmitSuccessMsg(null);
      }, 1800);

    } catch (err: any) {
      setResubmitErrorMsg(err.message || 'Error resubmitting fare');
    } finally {
      setIsResubmitting(false);
    }
  };

  const content = (
    <div className={`relative w-full ${isPage ? 'max-w-5xl mx-auto my-8' : 'max-w-4xl my-8'} bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col border border-slate-100 ${isPage ? '' : 'max-h-[92vh]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 sm:px-8 py-6 text-white shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
            <BarChart3 className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-200 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> User Panel / یوزر پینل
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Your Progress & Activity Status</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUserData}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
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
            {/* Progress Stats Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Bus className="w-4 h-4 text-emerald-600" /> Contributions Overview (شراکت داری کی کارکردگی)
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  {totalRoutes} Route(s) • {totalFares} Fare Update(s)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Contributed</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className="text-3xl font-black text-slate-900">{totalRoutes + totalFares}</span>
                    <span className="p-2 bg-slate-50 rounded-xl text-slate-600"><Layers className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Accepted / Approved</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className="text-3xl font-black text-emerald-700">{acceptedRoutes + acceptedFares}</span>
                    <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Pending Review</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className="text-3xl font-black text-amber-700">{pendingRoutes + pendingFares}</span>
                    <span className="p-2 bg-amber-50 rounded-xl text-amber-600"><Clock className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Needs Edit / Rejected</span>
                  <div className="flex items-baseline justify-between mt-3">
                    <span className="text-3xl font-black text-rose-700">{rejectedRoutes + rejectedFares}</span>
                    <span className="p-2 bg-rose-50 rounded-xl text-rose-600"><XCircle className="w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenFullBusRouteMap) onOpenFullBusRouteMap();
                }}
                className="p-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs flex items-center justify-between transition-all shadow-md shadow-teal-700/20 cursor-pointer"
              >
                <span>+ Full Bus Route Map (مکمل روٹ نقشہ)</span>
                <Layers className="w-4 h-4 text-teal-200" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenUpdateFares) onOpenUpdateFares();
                }}
                className="p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-between transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <span>+ Update Fares (کرایہ اپڈیٹ کریں)</span>
                <Tag className="w-4 h-4 text-emerald-200" />
              </button>
            </div>

            {/* Contributed Items Section with Tab Switcher */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('routes')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'routes'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-white/80'
                    }`}
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Bus Routes ({totalRoutes})</span>
                    {rejectedRoutes > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('fares')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'fares'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-white/80'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Fare Updates ({totalFares})</span>
                    {rejectedFares > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </button>
                </div>

                {/* Filter Tabs for active list */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => {
                    const currentFilter = activeTab === 'routes' ? routeFilter : fareFilter;
                    const count = activeTab === 'routes'
                      ? contributions.filter(c => st === 'all' || norm(c.status) === st).length
                      : fareRequests.filter(f => st === 'all' || norm(f.status) === st).length;

                    return (
                      <button
                        key={st}
                        onClick={() => activeTab === 'routes' ? setRouteFilter(st) : setFareFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          currentFilter === st
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {st} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View 1: BUS ROUTES */}
              {activeTab === 'routes' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus / Company</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route (Origin ➔ Dest)</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle & Contact</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Admin Note</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {contributions.filter(c => routeFilter === 'all' || norm(c.status) === routeFilter).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                              {routeFilter === 'all' 
                                ? 'You haven’t contributed any bus routes yet.' 
                                : `No ${routeFilter} bus routes found.`}
                            </td>
                          </tr>
                        ) : (
                          contributions
                            .filter(c => routeFilter === 'all' || norm(c.status) === routeFilter)
                            .map((contrib) => {
                              const isRejected = norm(contrib.status) === 'rejected';
                              const isApproved = ['approved', 'accepted'].includes(norm(contrib.status));
                              return (
                                <tr key={contrib.id} className={`transition-colors ${isRejected ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        isRejected ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-600'
                                      }`}>
                                        <Bus className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="font-black text-slate-900">{contrib.companyName || 'Bus Operator'}</p>
                                        <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                          {contrib.busNumber || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                      <span>{contrib.origin}</span>
                                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                                      <span>{contrib.destination}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Dep: {contrib.departureTime || '-'}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-700">{contrib.type || 'Standard'} • {contrib.isAC ? 'AC' : 'Non-AC'}</p>
                                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{contrib.contactNumber || '-'}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="space-y-1">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        isApproved ? 'bg-emerald-100 text-emerald-800' :
                                        isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        {contrib.status || 'Pending'}
                                      </span>
                                      {isRejected && contrib.remarks && (
                                        <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200/80 max-w-xs">
                                          <strong className="block text-[9px] uppercase tracking-wider text-rose-500">Reason:</strong>
                                          {contrib.remarks}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {isRejected ? (
                                      <button
                                        onClick={() => handleOpenEditRoute(contrib)}
                                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit & Resubmit</span>
                                      </button>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 font-bold">
                                        {isApproved ? 'Live on App' : 'Under Review'}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View 2: FARES CONTRIBUTIONS */}
              {activeTab === 'fares' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route (Origin ➔ Dest)</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fares Submitted</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Admin Note</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {fareRequests.filter(f => fareFilter === 'all' || norm(f.status) === fareFilter).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-semibold">
                              {fareFilter === 'all'
                                ? 'You haven’t submitted any fare updates yet.'
                                : `No ${fareFilter} fare updates found.`}
                            </td>
                          </tr>
                        ) : (
                          fareRequests
                            .filter(f => fareFilter === 'all' || norm(f.status) === fareFilter)
                            .map((fare) => {
                              const isRejected = norm(fare.status) === 'rejected';
                              const isApproved = ['approved', 'accepted'].includes(norm(fare.status));
                              return (
                                <tr key={fare.id} className={`transition-colors ${isRejected ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        isRejected ? 'bg-rose-100 text-rose-700' : 'bg-amber-50 text-amber-700'
                                      }`}>
                                        <Tag className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="font-black text-slate-900 flex items-center gap-1.5">
                                          <span>{fare.origin}</span>
                                          <ArrowRight className="w-3 h-3 text-amber-600" />
                                          <span>{fare.destination}</span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                          {fare.created_at ? new Date(fare.created_at).toLocaleDateString() : 'Recent'}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2 text-[10px]">
                                      {fare.non_ac > 0 && (
                                        <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">Non-AC: Rs. {fare.non_ac}</span>
                                      )}
                                      {fare.ac > 0 && (
                                        <span className="bg-emerald-50 px-2 py-0.5 rounded font-bold text-emerald-700 border border-emerald-200">AC: Rs. {fare.ac}</span>
                                      )}
                                      {fare.executive > 0 && (
                                        <span className="bg-teal-50 px-2 py-0.5 rounded font-bold text-teal-700 border border-teal-200">Exec: Rs. {fare.executive}</span>
                                      )}
                                      {fare.business > 0 && (
                                        <span className="bg-indigo-50 px-2 py-0.5 rounded font-bold text-indigo-700 border border-indigo-200">Biz: Rs. {fare.business}</span>
                                      )}
                                      {fare.sleeper > 0 && (
                                        <span className="bg-purple-50 px-2 py-0.5 rounded font-bold text-purple-700 border border-purple-200">Sleeper: Rs. {fare.sleeper}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="space-y-1">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        isApproved ? 'bg-emerald-100 text-emerald-800' :
                                        isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        {fare.status || 'Pending'}
                                      </span>
                                      {isRejected && fare.remarks && (
                                        <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200/80 max-w-xs">
                                          <strong className="block text-[9px] uppercase tracking-wider text-rose-500">Reason:</strong>
                                          {fare.remarks}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {isRejected ? (
                                      <button
                                        onClick={() => handleOpenEditFare(fare)}
                                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit & Resubmit</span>
                                      </button>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 font-bold">
                                        {isApproved ? 'Live on Website' : 'Under Review'}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

            {/* Quick Actions / Navigation at bottom */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Quick Volunteer Actions</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* EDIT & RESUBMIT BUS ROUTE MODAL */}
      <AnimatePresence>
        {editingRoute && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRoute(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8 flex flex-col border border-slate-100 max-h-[92vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 sm:px-8 py-5 text-white shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                    <Layers className="w-6 h-6 text-emerald-200" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-900/50 px-2.5 py-1 rounded-full">
                      Route Correction & Resubmission
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                      Edit & Resubmit Route (روٹ کی تصحیح و دوبارہ جمع)
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitResubmitRoute} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Admin Rejection Reason Alert */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1 shadow-xs">
                  <div className="flex items-center gap-1.5 font-black uppercase text-[10px] text-rose-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Admin Rejection Reason / مسترد کرنے کی وجہ:</span>
                  </div>
                  <p className="font-semibold text-rose-800 text-sm">
                    {editingRoute.remarks || 'Please verify route timing, stops, or stand location and resubmit.'}
                  </p>
                </div>

                {resubmitErrorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{resubmitErrorMsg}</span>
                  </div>
                )}

                {resubmitSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resubmitSuccessMsg}</span>
                  </div>
                )}

                {/* Section 1: Bus Information & Operator Details (Issue 2 fixed: NO departure/arrival times here!) */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-emerald-600" /> 1. Bus Information & Operator Details (بس کی بنیادی معلومات)
                  </h4>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Company / Operator Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Faisal Movers"
                        value={editCompanyName}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Vehicle Plate / Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LEA-21-9988"
                        value={editBusNumber}
                        onChange={(e) => setEditBusNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0300-1234567"
                        value={editContactNumber}
                        onChange={(e) => setEditContactNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Climate Control
                      </label>
                      <select
                        value={editClimate}
                        onChange={(e) => setEditClimate(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600"
                      >
                        <option value="Non-AC">Non-AC</option>
                        <option value="AC">AC</option>
                        <option value="Executive">Executive</option>
                        <option value="Business">Business</option>
                        <option value="Sleeper">Sleeper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Service Type
                      </label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Express">Express</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Business Class">Business Class</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Sequenced Stops (Issue 3 fixed: Arrival Time AND Departure Time both clearly visible) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        2. Sequenced Route Stops ({editStops.length} Stops) / اسٹاپس کی ترتیب
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add all intermediate stops in exact chronological order with Arrival and Departure times.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Stop / نیا اسٹاپ شامل کریں
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editStops.map((stop, index) => (
                      <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-1 flex items-center justify-center font-black text-xs text-slate-500 bg-slate-100 py-2 rounded-xl">
                          #{stop.stop_sequence || index + 1}
                        </div>

                        <div className="sm:col-span-3">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-slate-500">
                              City Name (شہر)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomCityIndices(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                              className="text-[9px] font-black text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                              title="Toggle between dropdown list and custom typing"
                            >
                              {customCityIndices[index] ? '📋 Select List' : '✍️ Custom City'}
                            </button>
                          </div>

                          {customCityIndices[index] ? (
                            <input
                              type="text"
                              value={stop.city_name ?? ''}
                              onChange={(e) => handleStopChange(index, 'city_name', e.target.value)}
                              placeholder="Type city name..."
                              className="w-full bg-white border border-emerald-400 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                              autoFocus
                            />
                          ) : (
                            <select
                              value={stop.city_name || ''}
                              onChange={(e) => {
                                if (e.target.value === '__CUSTOM__') {
                                  setCustomCityIndices(prev => ({ ...prev, [index]: true }));
                                } else {
                                  handleStopChange(index, 'city_name', e.target.value);
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 cursor-pointer"
                            >
                              {stop.city_name && !PAKISTAN_CITIES.includes(stop.city_name) && (
                                <option value={stop.city_name}>{stop.city_name} (Current)</option>
                              )}
                              {PAKISTAN_CITIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                              <option value="__CUSTOM__">✍️ Other / Type Custom City...</option>
                            </select>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Arrival Time (پہنچنے کا وقت)</label>
                          <input
                            type="text"
                            placeholder="08:00"
                            value={stop.arrival_time ?? ''}
                            onChange={(e) => handleStopChange(index, 'arrival_time', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Departure Time (روانگی کا وقت)</label>
                          <input
                            type="text"
                            placeholder="08:30"
                            value={stop.departure_time ?? ''}
                            onChange={(e) => handleStopChange(index, 'departure_time', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Terminal / Stand (اڈا / ٹرمینل)</label>
                          <input
                            type="text"
                            placeholder="General Bus Stand"
                            value={stop.location ?? ''}
                            onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 outline-none focus:border-emerald-600 font-medium"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveStop(index, 'up')}
                            disabled={index === 0}
                            className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStop(index, 'down')}
                            disabled={index === editStops.length - 1}
                            className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(index)}
                            disabled={editStops.length <= 2}
                            className="p-2 text-rose-500 hover:text-rose-700 disabled:opacity-30 cursor-pointer"
                            title="Remove Stop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingRoute(null)}
                    className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResubmitting}
                    className="w-2/3 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isResubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Correction...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Resubmit Corrected Route / درست روٹ دوبارہ جمع کروائیں</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT & RESUBMIT FARE REQUEST MODAL */}
      <AnimatePresence>
        {editingFare && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFare(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Tag className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Edit & Resubmit Fares (کرایہ کی تصحیح)</h3>
                    <p className="text-amber-100 text-xs">Update your proposed fares and resubmit for verification.</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingFare(null)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitResubmitFare} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Admin Rejection Reason Alert */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1 shadow-xs">
                  <div className="flex items-center gap-1.5 font-black uppercase text-[10px] text-rose-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Admin Rejection Reason / مسترد کرنے کی وجہ:</span>
                  </div>
                  <p className="font-semibold text-rose-800 text-sm">
                    {editingFare.remarks || 'Please verify the ticket price with current terminal rates.'}
                  </p>
                </div>

                {resubmitErrorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    {resubmitErrorMsg}
                  </div>
                )}

                {resubmitSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {resubmitSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-black text-slate-700 block mb-1">Origin City (روانگی)</label>
                    <input
                      type="text"
                      list="user-fare-edit-origin-list"
                      required
                      value={editFareOrigin}
                      onChange={(e) => setEditFareOrigin(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                    />
                    <datalist id="user-fare-edit-origin-list">
                      {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </datalist>
                  </div>

                  <div>
                    <label className="font-black text-slate-700 block mb-1">Destination City (منزل)</label>
                    <input
                      type="text"
                      list="user-fare-edit-dest-list"
                      required
                      value={editFareDest}
                      onChange={(e) => setEditFareDest(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                    />
                    <datalist id="user-fare-edit-dest-list">
                      {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-slate-700 block uppercase tracking-wider">
                    Ticket Prices by Service Class (کرایہ فی مسافر)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1 text-[11px]">Non-AC (سادہ)</label>
                      <input
                        type="number"
                        value={editNonAc}
                        onChange={(e) => setEditNonAc(e.target.value)}
                        placeholder="Rs. 0"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-600 block mb-1 text-[11px]">AC Standard</label>
                      <input
                        type="number"
                        value={editAc}
                        onChange={(e) => setEditAc(e.target.value)}
                        placeholder="Rs. 0"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-600 block mb-1 text-[11px]">Executive</label>
                      <input
                        type="number"
                        value={editExec}
                        onChange={(e) => setEditExec(e.target.value)}
                        placeholder="Rs. 0"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-600 block mb-1 text-[11px]">Business Class</label>
                      <input
                        type="number"
                        value={editBiz}
                        onChange={(e) => setEditBiz(e.target.value)}
                        placeholder="Rs. 0"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-600 block mb-1 text-[11px]">Sleeper Bus</label>
                      <input
                        type="number"
                        value={editSleep}
                        onChange={(e) => setEditSleep(e.target.value)}
                        placeholder="Rs. 0"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isResubmitting}
                    className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isResubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Correction for Review / تصحیح کر کے بھیجیں</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFare(null)}
                    className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isPage) {
    return (
      <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50/50">
        {content}
      </div>
    );
  }

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
        className="relative z-10"
      >
        {content}
      </motion.div>
    </div>
  );
}
