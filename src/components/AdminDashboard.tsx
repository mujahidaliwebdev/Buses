import React, { useState } from 'react';
import { Bus } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ArrowLeft, 
  Save, 
  X, 
  Bus as BusIcon, 
  Clock, 
  MapPin, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { busService } from '../lib/firestoreService';

interface AdminDashboardProps {
  buses: Bus[];
  onClose: () => void;
}

export default function AdminDashboard({ buses, onClose }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Bus>>({
    companyName: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    fare: 0,
    busNumber: '',
    contactNumber: '',
    terminalLocation: '',
    standNumber: '',
    type: 'Standard',
    isAC: true
  });

  const filteredBuses = buses.filter(bus => 
    bus.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      companyName: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      fare: 0,
      busNumber: '',
      contactNumber: '',
      terminalLocation: '',
      standNumber: '',
      type: 'Standard',
      isAC: true
    });
    setEditingId(null);
    setIsAdding(false);
    setIsSaving(false);
  };

  const handleEdit = (bus: Bus) => {
    setFormData(bus);
    setEditingId(bus.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      try {
        await busService.deleteBus(id);
      } catch (error) {
        console.error(error);
        alert('Failed to delete route. Check console for details.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingId) {
        await busService.updateBus(editingId, formData);
      } else {
        await busService.addBus(formData as Omit<Bus, 'id'>);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save route. Check console for details.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Management Console
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                Admin
              </span>
            </h1>
          </div>

          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add New Route
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by company, origin or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium shadow-sm"
          />
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company & Bus</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fare</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBuses.map((bus) => (
                  <tr key={bus.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <BusIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{bus.companyName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{bus.busNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        {bus.origin} 
                        <div className="w-4 h-px bg-slate-200" />
                        {bus.destination}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {bus.departureTime}
                        </p>
                        <p className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded inline-block font-bold">
                          {bus.type} • {bus.isAC ? 'AC' : 'Non-AC'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-lg font-black text-emerald-700 tracking-tighter">Rs. {bus.fare}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(bus)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(bus.id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 md:p-14">
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {editingId ? 'Edit Route' : 'Add New Route'}
                    </h2>
                    <button onClick={resetForm} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                      <X className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <InputGroup label="Company Name" icon={<BusIcon className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. Daewoo Express"
                      />
                    </InputGroup>

                    <InputGroup label="Vehicle Plate #" icon={<CheckCircle2 className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.busNumber}
                        onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. LEC-552"
                      />
                    </InputGroup>

                    <InputGroup label="Origin City" icon={<MapPin className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.origin}
                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. Lahore"
                      />
                    </InputGroup>

                    <InputGroup label="Destination City" icon={<MapPin className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. Islamabad"
                      />
                    </InputGroup>

                    <InputGroup label="Departure Time" icon={<Clock className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.departureTime}
                        onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. 08:30 AM"
                      />
                    </InputGroup>

                    <InputGroup label="Terminal Location" icon={<MapPin className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.terminalLocation}
                        onChange={(e) => setFormData({...formData, terminalLocation: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. Band Road Terminal"
                      />
                    </InputGroup>

                    <InputGroup label="Stand #" icon={<Tag className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.standNumber}
                        onChange={(e) => setFormData({...formData, standNumber: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. Stand 12"
                      />
                    </InputGroup>

                    <InputGroup label="Arrival Time" icon={<Clock className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. 12:30 PM"
                      />
                    </InputGroup>

                    <InputGroup label="Ticket Fare (RS)" icon={<ArrowLeft className="w-4 h-4 rotate-90" />}>
                      <input 
                        required
                        type="number"
                        value={formData.fare}
                        onChange={(e) => setFormData({...formData, fare: parseInt(e.target.value)})}
                        className="admin-input" 
                      />
                    </InputGroup>

                    <InputGroup label="Contact Number" icon={<Smartphone className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. 03xx-xxxxxxx"
                      />
                    </InputGroup>

                    <div className="col-span-full grid grid-cols-2 gap-8">
                       <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all">
                          <input 
                            type="checkbox"
                            checked={formData.isAC}
                            onChange={(e) => setFormData({...formData, isAC: e.target.checked})}
                            className="w-6 h-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-bold text-slate-700">Air Conditioned</span>
                       </label>

                       <select 
                         value={formData.type}
                         onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                         className="admin-input bg-slate-50"
                       >
                         <option value="Standard">Standard</option>
                         <option value="Executive">Executive</option>
                         <option value="Luxury">Luxury</option>
                         <option value="Non-AC">Non-AC</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-5 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" /> 
                      )}
                      {isSaving ? 'Processing...' : (editingId ? 'Update Record' : 'Save New Route')}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 1rem 0;
          background: transparent;
          border: none;
          border-bottom: 2px solid #f1f5f9;
          font-weight: 700;
          font-size: 1.125rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .admin-input:focus {
          border-bottom-color: #10b981;
        }
        .admin-input::placeholder {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

function InputGroup({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
