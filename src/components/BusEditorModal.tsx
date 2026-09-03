import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bus as BusIcon, 
  MapPin, 
  Clock, 
  Tag, 
  Smartphone, 
  Shield, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PAKISTAN_CITIES } from '../data/mockBuses';

export interface MasterBusData {
  bus_id: string;
  company_name: string;
  vehicle_plate: string;
  contact_number: string;
  climate_control: string;
  service_type: string;
  route_map: string;
  total_stops?: number;
}

export interface BusStopData {
  stop_sequence: number;
  city_name: string;
  arrival_time: string;
  departure_time: string;
  location: string;
  stand: string;
}

interface BusEditorModalProps {
  isOpen: boolean;
  busData: MasterBusData | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function BusEditorModal({
  isOpen,
  busData,
  onClose,
  onSaveSuccess
}: BusEditorModalProps) {
  const isEditing = Boolean(busData && busData.bus_id);

  // Top Section: Basic Bus Information State
  const [basicInfo, setBasicInfo] = useState<MasterBusData>({
    bus_id: '',
    company_name: '',
    vehicle_plate: '',
    contact_number: '',
    climate_control: 'Non-AC',
    service_type: 'Standard',
    route_map: '',
  });

  // Bottom Section: Sequenced Stops State
  const [stops, setStops] = useState<BusStopData[]>([]);
  const [isLoadingStops, setIsLoadingStops] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form when opened or busData changes
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      return;
    }

    if (busData) {
      setBasicInfo({
        bus_id: busData.bus_id || '',
        company_name: busData.company_name || '',
        vehicle_plate: busData.vehicle_plate || '',
        contact_number: busData.contact_number || '',
        climate_control: busData.climate_control || 'Non-AC',
        service_type: busData.service_type || 'Standard',
        route_map: busData.route_map || '',
      });

      // Load stops for this bus from backend D1
      loadStopsForBus(busData.bus_id);
    } else {
      // New Bus Mode
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setBasicInfo({
        bus_id: `B-${randomSuffix}`,
        company_name: 'New Khan',
        vehicle_plate: '',
        contact_number: '',
        climate_control: 'Non-AC',
        service_type: 'Standard',
        route_map: 'Lahore -> Faisalabad -> Multan',
      });

      setStops([
        { stop_sequence: 1, city_name: 'Lahore', arrival_time: '08:00', departure_time: '08:30', location: 'Badami Bagh', stand: '1' },
        { stop_sequence: 2, city_name: 'Faisalabad', arrival_time: '11:00', departure_time: '11:20', location: 'General Bus Stand', stand: '2' },
        { stop_sequence: 3, city_name: 'Multan', arrival_time: '15:00', departure_time: '15:30', location: 'Chowk Kumharanwala', stand: '1' },
      ]);
    }
  }, [isOpen, busData]);

  const loadStopsForBus = async (busId: string) => {
    setIsLoadingStops(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/d1/bus-stops?bus_id=${encodeURIComponent(busId)}`);
      const data = await res.json();

      if (data.live && Array.isArray(data.stops) && data.stops.length > 0) {
        const sorted = [...data.stops].sort((a, b) => (a.stop_sequence || 0) - (b.stop_sequence || 0));
        setStops(sorted.map((s, idx) => ({
          stop_sequence: s.stop_sequence || (idx + 1),
          city_name: s.city_name || '',
          arrival_time: s.arrival_time || '',
          departure_time: s.departure_time || '',
          location: s.location || '',
          stand: s.stand || '',
        })));
      } else {
        // Fallback default stops if none yet recorded
        setStops([
          { stop_sequence: 1, city_name: 'Lahore', arrival_time: '08:00', departure_time: '08:30', location: 'Main Terminal', stand: '1' },
          { stop_sequence: 2, city_name: 'Rawalpindi', arrival_time: '13:30', departure_time: '14:00', location: 'Pirwadhai Terminal', stand: '1' },
        ]);
      }
    } catch (err: any) {
      console.error("Error loading bus stops:", err);
      setErrorMessage("Could not load stops from database. Using default list.");
    } finally {
      setIsLoadingStops(false);
    }
  };

  // Stop sequence manipulation handlers
  const handleAddStop = () => {
    setStops(prev => [
      ...prev,
      {
        stop_sequence: prev.length + 1,
        city_name: '',
        arrival_time: '',
        departure_time: '',
        location: '',
        stand: '',
      }
    ]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 1) {
      alert("A bus route must have at least one stop.");
      return;
    }
    const updated = stops.filter((_, idx) => idx !== index);
    const resequenced = updated.map((st, idx) => ({
      ...st,
      stop_sequence: idx + 1
    }));
    setStops(resequenced);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    const resequenced = updated.map((st, idx) => ({
      ...st,
      stop_sequence: idx + 1
    }));
    setStops(resequenced);
  };

  const handleMoveDown = (index: number) => {
    if (index >= stops.length - 1) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    const resequenced = updated.map((st, idx) => ({
      ...st,
      stop_sequence: idx + 1
    }));
    setStops(resequenced);
  };

  const handleStopChange = (index: number, field: keyof BusStopData, value: any) => {
    const updated = [...stops];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setStops(updated);
  };

  // Auto-generate route string from current stops list
  const handleAutoGenerateRoute = () => {
    const validCities = stops
      .map(s => s.city_name.trim())
      .filter(Boolean);

    if (validCities.length === 0) {
      alert("Please enter city names for the stops first.");
      return;
    }

    const generated = validCities.join(' -> ');
    setBasicInfo(prev => ({ ...prev, route_map: generated }));
  };

  // Unified Save Handler: Updates Bus AND Stops in a single database transaction
  const handleUnifiedSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic validation
    if (!basicInfo.bus_id.trim()) {
      setErrorMessage("Bus ID is required.");
      return;
    }
    if (!basicInfo.company_name.trim()) {
      setErrorMessage("Company name is required.");
      return;
    }
    if (stops.length === 0) {
      setErrorMessage("Please add at least one stop for this bus.");
      return;
    }

    // Check if at least the first and last stops have city names
    if (!stops[0].city_name.trim()) {
      setErrorMessage("The first stop (Origin) must have a city name.");
      return;
    }

    setIsSaving(true);
    try {
      // Ensure route_map is populated
      let finalRouteMap = basicInfo.route_map.trim();
      if (!finalRouteMap) {
        finalRouteMap = stops.map(s => s.city_name.trim()).filter(Boolean).join(' -> ');
      }

      const payload = {
        bus: {
          ...basicInfo,
          route_map: finalRouteMap,
        },
        stops: stops.map((s, idx) => ({
          ...s,
          stop_sequence: idx + 1,
        }))
      };

      const response = await fetch('/api/d1/bus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(`Success: Bus ${basicInfo.bus_id} and all ${stops.length} stops updated in Cloudflare D1!`);
        setTimeout(() => {
          onSaveSuccess();
          onClose();
        }, 800);
      } else {
        throw new Error(result.message || "Failed to update bus in database");
      }
    } catch (err: any) {
      console.error("Failed to save bus and stops:", err);
      setErrorMessage(err.message || "Failed to save. Please verify your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight text-white">
                  {isEditing ? 'Edit Bus & Sequenced Stops' : 'Add New Bus & Sequenced Stops'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
                  {basicInfo.bus_id || 'NEW'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                بس کی بنیادی معلومات اور نیچے سفر کے تمام اسٹاپس ایک ہی وقت میں محفوظ کریں
              </p>
            </div>
          </div>

          <button 
            id="close-bus-editor-modal"
            type="button"
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleUnifiedSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* Notification Alerts */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. TOP SECTION: BASIC BUS ENTRIES (Uper Basic Entries) */}
          {/* ========================================================================= */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  1
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Basic Bus Entries / بنیادی بس معلومات
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Primary registration, operator, and category configuration
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Table: <code className="text-slate-600">buses</code>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Bus ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bus ID (Primary Key)</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-bus-id"
                  type="text"
                  required
                  value={basicInfo.bus_id}
                  onChange={(e) => setBasicInfo({ ...basicInfo, bus_id: e.target.value })}
                  placeholder="e.g. B-10001"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <BusIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company Name / کمپنی</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-bus-company"
                  type="text"
                  required
                  value={basicInfo.company_name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, company_name: e.target.value })}
                  placeholder="e.g. New Khan (Wahla Bros)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Vehicle Registration Plate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Vehicle Plate # / گاڑی نمبر</span>
                </label>
                <input
                  id="input-bus-plate"
                  type="text"
                  value={basicInfo.vehicle_plate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, vehicle_plate: e.target.value })}
                  placeholder="e.g. BSE-011"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Number / رابطہ نمبر</span>
                </label>
                <input
                  id="input-bus-contact"
                  type="text"
                  value={basicInfo.contact_number}
                  onChange={(e) => setBasicInfo({ ...basicInfo, contact_number: e.target.value })}
                  placeholder="e.g. 0345-6816188"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono"
                />
              </div>

              {/* Climate Control (AC / Non-AC) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Climate Control / ایئر کنڈیشن
                </label>
                <select
                  id="input-bus-climate"
                  value={basicInfo.climate_control}
                  onChange={(e) => setBasicInfo({ ...basicInfo, climate_control: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="Non-AC">Non-AC (نان اے سی)</option>
                  <option value="AC">AC (ایئر کنڈیشنڈ)</option>
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Service Category / قسم
                </label>
                <select
                  id="input-bus-service-type"
                  value={basicInfo.service_type}
                  onChange={(e) => setBasicInfo({ ...basicInfo, service_type: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="Standard">Standard</option>
                  <option value="Executive">Executive</option>
                  <option value="Business">Business</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Route Map Overview (with Auto-Generate Button) */}
              <div className="col-span-full">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complete Route Map / مکمل روٹ تفصیل</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateRoute}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate from Stops below / اسٹاپس سے خودکار بنائیں</span>
                  </button>
                </div>
                <input
                  id="input-bus-route-map"
                  type="text"
                  value={basicInfo.route_map}
                  onChange={(e) => setBasicInfo({ ...basicInfo, route_map: e.target.value })}
                  placeholder="e.g. Lahore -> Sheikhupura -> Faisalabad -> Shorkot -> Karor"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. BOTTOM SECTION: SEQUENCED STOPS ENTRIES (Us k bad sequance main Stops) */}
          {/* ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  2
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Stops in Sequence / سفر کے اسٹاپس کی ترتیب</span>
                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {stops.length} Stops
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Arranged sequentially from start (Origin #1) to finish. All saved in <code className="text-slate-700">bus_stops</code> table.
                  </p>
                </div>
              </div>

              <button
                id="btn-add-stop-top"
                type="button"
                onClick={handleAddStop}
                className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-black transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Stop / نیا اسٹاپ</span>
              </button>
            </div>

            {/* Stops list loading state */}
            {isLoadingStops ? (
              <div className="py-12 text-center text-slate-400">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold">Loading sequenced stops from Cloudflare D1...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === stops.length - 1;

                  return (
                    <div 
                      key={`stop-row-${index}`}
                      className="group relative flex flex-col md:flex-row items-start md:items-center gap-3 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all"
                    >
                      {/* Sequence Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`w-8 h-8 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
                          isFirst 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : isLast 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'bg-slate-200 text-slate-700'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 md:hidden">
                          {isFirst ? 'Origin / روانگی' : isLast ? 'Destination / منزل' : 'Via Stop'}
                        </span>
                      </div>

                      {/* Stop City Name */}
                      <div className="flex-1 w-full md:w-auto">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          City / شہر
                        </label>
                        <input
                          type="text"
                          required
                          list="pakistan-cities-list"
                          value={stop.city_name}
                          onChange={(e) => handleStopChange(index, 'city_name', e.target.value)}
                          placeholder="e.g. Lahore, Faisalabad..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      {/* Arrival Time */}
                      <div className="w-full sm:w-28 md:w-28">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Arrival / آمد
                        </label>
                        <input
                          type="text"
                          value={stop.arrival_time}
                          onChange={(e) => handleStopChange(index, 'arrival_time', e.target.value)}
                          placeholder="10:15"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      {/* Departure Time */}
                      <div className="w-full sm:w-28 md:w-28">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Departure / روانگی
                        </label>
                        <input
                          type="text"
                          value={stop.departure_time}
                          onChange={(e) => handleStopChange(index, 'departure_time', e.target.value)}
                          placeholder="13:30"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      {/* Terminal Location */}
                      <div className="flex-1 w-full md:w-auto">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Terminal / اڈہ مقام
                        </label>
                        <input
                          type="text"
                          value={stop.location}
                          onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                          placeholder="e.g. Badami Bagh Terminal"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                      </div>

                      {/* Stand Number */}
                      <div className="w-full sm:w-20 md:w-20">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Stand #
                        </label>
                        <input
                          type="text"
                          value={stop.stand}
                          onChange={(e) => handleStopChange(index, 'stand', e.target.value)}
                          placeholder="9"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-center"
                        />
                      </div>

                      {/* Sequence Order & Delete Actions */}
                      <div className="flex items-center gap-1 shrink-0 self-end md:self-center mt-2 md:mt-4">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveUp(index)}
                          title="Move Stop Up in sequence"
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveDown(index)}
                          title="Move Stop Down in sequence"
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(index)}
                          title="Remove Stop"
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Add Stop Trigger */}
                <button
                  id="btn-add-stop-bottom"
                  type="button"
                  onClick={handleAddStop}
                  className="w-full py-3.5 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl text-xs font-black text-slate-500 hover:text-emerald-700 bg-slate-50/50 hover:bg-emerald-50/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>+ Add Next Sequential Stop / اگلا اسٹاپ شامل کریں</span>
                </button>
              </div>
            )}
          </div>

          {/* Datalist for Pakistan cities */}
          <datalist id="pakistan-cities-list">
            {PAKISTAN_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          {/* ========================================================================= */}
          {/* FOOTER ACTIONS: UNIFIED SAVE IN A SINGLE ENTRY */}
          {/* ========================================================================= */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              <span className="font-bold text-slate-800">Atomic Update:</span> Saves Bus details & all {stops.length} stops together in Cloudflare D1.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Cancel / منسوخ
              </button>

              <button
                id="btn-save-bus-and-stops"
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to D1...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Bus & All Stops / ایک کلک میں تمام محفوظ کریں</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
