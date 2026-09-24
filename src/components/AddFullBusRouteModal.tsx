import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Bus as BusIcon, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { contributionService } from '../lib/firestoreService';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AddFullBusRouteModalProps {
  onClose: () => void;
}

export interface BusStopItem {
  stop_sequence: number;
  city_name: string;
  arrival_time: string;
  departure_time: string;
  location: string;
  stand: string;
}

export default function AddFullBusRouteModal({ onClose }: AddFullBusRouteModalProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  const [basicInfo, setBasicInfo] = useState({
    bus_id: `B-${Math.floor(10000 + Math.random() * 90000)}`,
    company_name: '',
    vehicle_plate: '',
    contact_number: '',
    climate_control: 'Non-AC',
    service_type: 'Standard'
  });

  const [stops, setStops] = useState<BusStopItem[]>([
    { stop_sequence: 1, city_name: 'Lahore', arrival_time: '08:00', departure_time: '08:30', location: 'Badami Bagh', stand: '1' },
    { stop_sequence: 2, city_name: 'Rawalpindi', arrival_time: '13:30', departure_time: '14:00', location: 'Pirwadhai Terminal', stand: '1' }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAddStop = () => {
    setStops(prev => [
      ...prev,
      {
        stop_sequence: prev.length + 1,
        city_name: PAKISTAN_CITIES[0],
        arrival_time: '10:00',
        departure_time: '10:15',
        location: 'General Bus Stand',
        stand: '1'
      }
    ]);
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) {
      setError('A bus route map must have at least 2 stops.');
      return;
    }
    const updated = stops.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stop_sequence: idx + 1 }));
    setStops(updated);
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stops.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setStops(updated.map((s, idx) => ({ ...s, stop_sequence: idx + 1 })));
  };

  const handleStopChange = (index: number, field: keyof BusStopItem, value: any) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], [field]: value };
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please login to contribute a full bus route map.');
      return;
    }
    if (!basicInfo.company_name) {
      setError('Please enter the Bus Company Name.');
      return;
    }
    if (stops.length < 2) {
      setError('Please add at least 2 stops for the route map.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const routeMapStr = stops.map(s => s.city_name.trim()).filter(Boolean).join(' -> ');

      const payload = {
        bus: {
          bus_id: basicInfo.bus_id,
          company_name: basicInfo.company_name,
          vehicle_plate: basicInfo.vehicle_plate,
          contact_number: basicInfo.contact_number,
          climate_control: basicInfo.climate_control,
          service_type: basicInfo.service_type,
          route_map: routeMapStr,
        },
        stops: stops.map((s, idx) => ({
          stop_sequence: idx + 1,
          city_name: s.city_name,
          arrival_time: s.arrival_time,
          departure_time: s.departure_time,
          location: s.location,
          stand: s.stand,
        }))
      };

      const res = await fetch('/api/d1/bus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : { success: false, message: "Empty response from server" };
      } catch (parseErr) {
        throw new Error(`Server returned invalid JSON (${res.status}): ${responseText.substring(0, 100) || "Empty response"}`);
      }

      if (res.ok && result.success) {
        setSuccess(true);
        setTimeout(onClose, 3000);
      } else {
        throw new Error(result.message || 'Failed to save full bus route map to database.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit full bus route map. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8 flex flex-col border border-slate-100 max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 sm:px-8 py-6 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Layers className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-900/50 px-2.5 py-1 rounded-full">Complete Bus Data & Route Map</span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Full Bus Route Map Builder (پوری بس کا روٹ میپ)</h3>
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
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {success ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Full Bus Route Map Submitted Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for contributing complete bus schedule and stop sequences! Your route map has been saved and published to AsaanSafar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Bus Basic Info */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <BusIcon className="w-4 h-4 text-emerald-600" /> 1. Bus Information & Operator Details
                </h4>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Company / Operator Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faisal Movers"
                      value={basicInfo.company_name}
                      onChange={(e) => setBasicInfo({...basicInfo, company_name: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Vehicle Plate / Number</label>
                    <input
                      type="text"
                      placeholder="e.g. LEA-21-9988"
                      value={basicInfo.vehicle_plate}
                      onChange={(e) => setBasicInfo({...basicInfo, vehicle_plate: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Contact Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 0300-1234567"
                      value={basicInfo.contact_number}
                      onChange={(e) => setBasicInfo({...basicInfo, contact_number: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Climate Control</label>
                    <select
                      value={basicInfo.climate_control}
                      onChange={(e) => setBasicInfo({...basicInfo, climate_control: e.target.value})}
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
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Service Type</label>
                    <select
                      value={basicInfo.service_type}
                      onChange={(e) => setBasicInfo({...basicInfo, service_type: e.target.value})}
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

              {/* Section 2: Sequenced Stops */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      2. Sequenced Route Stops ({stops.length} Stops)
                    </h4>
                    <p className="text-[11px] text-slate-500">Add all intermediate stops in exact chronological order from start to end.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Stop
                  </button>
                </div>

                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-1 flex items-center justify-center font-black text-xs text-slate-400 bg-slate-100 py-2 rounded-xl">
                        #{stop.stop_sequence}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">City Name</label>
                        <select
                          value={stop.city_name}
                          onChange={(e) => handleStopChange(index, 'city_name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600"
                        >
                          {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Arrival</label>
                        <input
                          type="text"
                          placeholder="08:00"
                          value={stop.arrival_time}
                          onChange={(e) => handleStopChange(index, 'arrival_time', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Departure</label>
                        <input
                          type="text"
                          placeholder="08:30"
                          value={stop.departure_time}
                          onChange={(e) => handleStopChange(index, 'departure_time', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Terminal / Stand</label>
                        <input
                          type="text"
                          placeholder="General Stand"
                          value={stop.location}
                          onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStop(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStop(index, 'down')}
                          disabled={index === stops.length - 1}
                          className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(index)}
                          className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
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
                  onClick={onClose}
                  className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Route Map...</span>
                    </>
                  ) : (
                    <span>Submit Full Bus Route Map / روٹ میپ جمع کروائیں</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
