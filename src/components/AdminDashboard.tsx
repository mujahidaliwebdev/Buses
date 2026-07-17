import React, { useState, useRef } from 'react';
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
  Tag,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  MessageSquare,
  Briefcase,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { busService, reportService, contributionService } from '../lib/firestoreService';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { PAKISTAN_CITIES } from '../data/mockBuses';
import { calculateDuration } from '../lib/timeUtils';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface AdminDashboardProps {
  buses: Bus[];
  onClose: () => void;
}

export default function AdminDashboard({ buses, onClose }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isBulkUpdatingFare, setIsBulkUpdatingFare] = useState(false);
  const [isViewingReports, setIsViewingReports] = useState(false);
  const [isViewingProposals, setIsViewingProposals] = useState(false);
  const [isViewingFeedbacks, setIsViewingFeedbacks] = useState(false);
  const [isViewingCareers, setIsViewingCareers] = useState(false);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState<'feedback' | 'complaint'>('feedback');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isJsonUploading, setIsJsonUploading] = useState(false);
  const [selectedPartitionFile, setSelectedPartitionFile] = useState('B1-B500.json');
  const [customPartitionFile, setCustomPartitionFile] = useState('');
  const [uploadMode, setUploadMode] = useState<'merge' | 'overwrite'>('merge');
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Careers real-time subscription
  const [careersList, setCareersList] = useState<any[]>([]);
  const [loadingCareersList, setLoadingCareersList] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'careers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(docSnap => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort in-memory by createdAt descending
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setCareersList(fetched);
      setLoadingCareersList(false);
    }, (error) => {
      console.error("Error subscribing to careers in admin: ", error);
      setLoadingCareersList(false);
    });
    return unsubscribe;
  }, []);

  // Feedbacks and Complaints real-time subscription
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'feedback'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(docSnap => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort desc
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setFeedbacks(fetched);
      setLoadingFeedbacks(false);
    }, (error) => {
      console.error("Error subscribing to feedback: ", error);
      setLoadingFeedbacks(false);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, 'complaints'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(docSnap => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort desc
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setComplaints(fetched);
      setLoadingComplaints(false);
    }, (error) => {
      console.error("Error subscribing to complaints: ", error);
      setLoadingComplaints(false);
    });
    return unsubscribe;
  }, []);

  // Reports collection real-time subscription
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'reports'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports: any[] = [];
      snapshot.forEach(docSnap => {
        fetchedReports.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort in-memory by createdAt descending
      fetchedReports.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setReports(fetchedReports);
      setLoadingReports(false);
    }, (error) => {
      console.error("Error subscribing to reports: ", error);
      setLoadingReports(false);
    });
    return unsubscribe;
  }, []);

  // User contributions collection real-time subscription
  const [contributions, setContributions] = useState<any[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'contributions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedContribs: any[] = [];
      snapshot.forEach(docSnap => {
        fetchedContribs.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by submittedAt descending
      fetchedContribs.sort((a, b) => {
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return timeB - timeA;
      });
      setContributions(fetchedContribs);
      setLoadingContributions(false);
    }, (error) => {
      console.error("Error subscribing to contributions: ", error);
      setLoadingContributions(false);
    });
    return unsubscribe;
  }, []);

  // Bulk fare update state
  const [bulkFareData, setBulkFareData] = useState({
    origin: '',
    destination: '',
    fare: 0
  });

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

  // Auto-calculate duration
  React.useEffect(() => {
    if (formData.departureTime && formData.arrivalTime) {
      const duration = calculateDuration(formData.departureTime, formData.arrivalTime);
      if (duration && duration !== formData.duration) {
        setFormData(prev => ({ ...prev, duration }));
      }
    }
  }, [formData.departureTime, formData.arrivalTime, formData.duration]);

  const filteredBuses = buses.filter(bus => 
    bus.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const entriesPerPage = 20;
  const totalPages = Math.ceil(filteredBuses.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredBuses.slice(indexOfFirstEntry, indexOfLastEntry);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxNeighbours = 1; // Number of pages to show before and after current
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      const start = Math.max(2, currentPage - maxNeighbours);
      const end = Math.min(totalPages - 1, currentPage + maxNeighbours);
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  const renderPagination = (isTop: boolean) => {
    if (totalPages <= 1) return null;
    const pageNumbers = getPageNumbers();
    
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-4 bg-slate-50/75 ${isTop ? 'border-b' : 'border-t'} border-slate-100`}>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Showing <span className="text-slate-800 font-extrabold">{indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, filteredBuses.length)}</span> of <span className="text-slate-800 font-extrabold">{filteredBuses.length}</span> routes
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all duration-150 shrink-0"
          >
            Prev / پیچھے
          </button>
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`dots-${isTop ? 'top' : 'bottom'}-${idx}`} className="px-2 text-slate-400 font-bold col-span-1 text-center select-none">
                  ...
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${isTop ? 'top' : 'bottom'}-${page}`}
                onClick={() => {
                  setCurrentPage(page as number);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-9 h-9 text-xs font-black rounded-xl transition-all duration-150 flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all duration-150 shrink-0"
          >
            Next / آگے
          </button>
        </div>
      </div>
    );
  };

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
    setBulkFareData({
      origin: '',
      destination: '',
      fare: 0
    });
    setEditingId(null);
    setIsAdding(false);
    setIsBulkUploading(false);
    setIsBulkUpdatingFare(false);
    setIsViewingReports(false);
    setIsViewingProposals(false);
    setIsViewingFeedbacks(false);
    setIsSaving(false);
    setUploadProgress(null);
    setIsJsonUploading(false);
    setSelectedPartitionFile('B1-B500.json');
    setCustomPartitionFile('');
    setUploadMode('merge');
  };

  const handleBulkFareUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFareData.origin || !bulkFareData.destination || bulkFareData.fare <= 0) {
      alert('Please select both Origin and Destination, and enter a valid fare (greater than 0). / Baraye meharbani Origin, Destination aur durust Fare enter karain.');
      return;
    }

    if (!confirm(`Are you sure you want to update the fare of ALL routes from ${bulkFareData.origin} to ${bulkFareData.destination} to Rs. ${bulkFareData.fare}? \n\nKya aap waqai ${bulkFareData.origin} se ${bulkFareData.destination} k tamam buses ka fare Rs. ${bulkFareData.fare} karna chahte hain?`)) {
      return;
    }

    setIsSaving(true);
    try {
      const count = await busService.bulkUpdateFares(
        bulkFareData.origin,
        bulkFareData.destination,
        bulkFareData.fare
      );
      
      alert(`Success! Updated ${count} routes from ${bulkFareData.origin} to ${bulkFareData.destination} to Rs. ${bulkFareData.fare}. / Kamiyabi! Block k under majood ${count} routes ka fare tabdeel kar diya gya ha.`);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to update fares. Check console for details. / Fare tabdeel karne me masla pesh aya.');
    } finally {
      setIsSaving(false);
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        const validBuses: Omit<Bus, 'id'>[] = rawData.map(row => ({
          companyName: row.companyName || '',
          origin: row.origin || '',
          destination: row.destination || '',
          departureTime: row.departureTime || '',
          arrivalTime: row.arrivalTime || '',
          duration: row.duration || '',
          fare: parseInt(row.fare) || 0,
          busNumber: row.busNumber || '',
          contactNumber: row.contactNumber || row.phone || '',
          terminalLocation: row.terminalLocation || '',
          standNumber: row.standNumber || '',
          type: row.type || 'Standard',
          isAC: String(row.isAC).toLowerCase() === 'true' || row.isAC === '1' || row.isAC === true
        })).filter(b => b.companyName && b.origin && b.destination);

        if (validBuses.length === 0) {
          alert('No valid records found in the file. Please check the template.');
          return;
        }

        if (confirm(`Found ${validBuses.length} valid routes. Start upload?`)) {
          setIsSaving(true);
          try {
            await busService.bulkAddBuses(validBuses);
            alert(`Successfully uploaded ${validBuses.length} routes!`);
            resetForm();
          } catch (error) {
            console.error(error);
            alert('Bulk upload failed. Check the console for details.');
          } finally {
            setIsSaving(false);
          }
        }
      },
      error: (error) => {
        console.error(error);
        alert('Failed to parse CSV file.');
      }
    });
  };

  const mapRowToBus = (row: any) => {
    const findVal = (keys: string[]) => {
      for (const key of keys) {
        const foundKey = Object.keys(row).find(k => {
          const kNorm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          const targetNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
          return kNorm === targetNorm;
        });
        if (foundKey !== undefined) {
          return row[foundKey];
        }
      }
      return '';
    };

    const busId = String(findVal(['busId', 'bus_id', 'id']) || '').trim();
    const company = String(findVal(['company', 'company_name', 'companyName']) || '').trim();
    const number = String(findVal(['number', 'bus_number', 'busNumber', 'registration_number', 'registrationNumber']) || '').trim();
    const contact = String(findVal(['contact', 'contact_number', 'contactNumber', 'phone', 'phone_number', 'phoneNumber']) || '').trim();
    const serviceType = String(findVal(['serviceType', 'service_type', 'service']) || '').trim();
    const climateControl = String(findVal(['climateControl', 'climate_control', 'climate']) || '').trim();
    const stops = String(findVal(['stops', 'stop_ids', 'stopIds']) || '').trim();
    const terminal = String(findVal(['terminal', 'terminals', 'terminal_names', 'terminalNames']) || '').trim();
    const stand = String(findVal(['stand', 'stands', 'stand_numbers', 'standNumbers']) || '').trim();
    const arrivalTime = String(findVal(['arrivalTime', 'arrival_time', 'arrivalTimes', 'arrival']) || '').trim();
    const departureTime = String(findVal(['departureTime', 'departure_time', 'departureTimes', 'departure']) || '').trim();

    return {
      busId,
      company,
      number,
      contact,
      serviceType,
      climateControl,
      stops,
      terminal,
      stand,
      arrivalTime,
      departureTime
    };
  };

  const downloadPartitionTemplate = (format: 'json' | 'csv' | 'xlsx') => {
    const templateData = [
      {
        "busId": "B1",
        "company": "New Khan (Wahla Bros)",
        "number": "BSE-011",
        "contact": "0345-6816188",
        "serviceType": "Standard",
        "climateControl": "Normal Ventilation",
        "stops": "S1, S2, S5, S7, S9, S10, S11, S13, S14, S50, S22, S18, S19, S20",
        "terminal": "Badami Bagh, Bypass, Main Stop, Main Stop, Main Stop, Main Stop, General Bus Stand, Interchange, Interchange, Main Stop, Main Stop, Main Stop, Main Stop, Bus Stand",
        "stand": "9, 0, 0, 0, 0, 0, ?, 0, 0, 0, 0, 0, 0, ?",
        "arrivalTime": "10:15, 14:30, 15:00, 15:10, 15:30, 15:45, 16:15, 19:00, 19:15, 20:00, 20:30, 21:30, 22:00, 22:30",
        "departureTime": "13:30, 14:30, 15:00, 15:10, 15:30, 15:45, 17:25, 19:00, 19:15, 20:00, 20:30, 21:30, 22:00, 02:30"
      },
      {
        "busId": "B2",
        "company": "New Khan (Wahla Bros)",
        "number": "BSE-011",
        "contact": "0345-6816188",
        "serviceType": "Standard",
        "climateControl": "Normal Ventilation",
        "stops": "S20, S19, S18, S22, S50, S14, S13, S11, S10, S9, S7, S5, S2, S1",
        "terminal": "Bus Stand, Main Stop, Main Stop, Main Stop, Main Stop, Interchange, Interchange, General Bus Stand, Main Stop, Main Stop, Main Stop, Main Stop, Bypass, Badami Bagh",
        "stand": "?, 0, 0, 0, 0, 0, 0, ?, 0, 0, 0, 0, 0, 9",
        "arrivalTime": "22:30, 03:00, 03:30, 04:30, 05:00, 05:50, 06:00, 06:45, 07:30, 08:00, 08:15, 08:30, 09:00, 10:15",
        "departureTime": "02:30, 03:00, 03:30, 04:30, 05:00, 05:50, 06:00, 06:45, 07:30, 08:00, 08:15, 08:30, 09:00, 13:30"
      }
    ];

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "B1-B500_template.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv') {
      const csvContent = Papa.unparse(templateData);
      const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "B1-B500_template.csv");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Buses");
      XLSX.writeFile(workbook, "B1-B500_template.xlsx");
    }
  };

  const handlePartitionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let parsedData: any[] = [];

        if (fileExtension === 'json') {
          const text = event.target?.result as string;
          const rawJson = JSON.parse(text);
          if (Array.isArray(rawJson)) {
            parsedData = rawJson.map(mapRowToBus);
          } else {
            alert('Error: JSON file must be an array of bus sequences. / Array of buses hona chahiye.');
            return;
          }
        } else if (fileExtension === 'csv') {
          const text = event.target?.result as string;
          const csvResult = Papa.parse(text, { header: true, skipEmptyLines: true });
          if (Array.isArray(csvResult.data)) {
            parsedData = csvResult.data.map(mapRowToBus);
          }
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const sheetJson = XLSX.utils.sheet_to_json(worksheet);
          parsedData = sheetJson.map(mapRowToBus);
        } else {
          alert('Error: Unsupported file format. Please upload .csv, .xlsx, .xls or .json files.');
          return;
        }

        // Validate basic structure
        if (parsedData.length === 0) {
          alert('Error: No records found in the uploaded file.');
          return;
        }

        const invalidItems = parsedData.filter(item => !item.busId || !item.company || !item.stops || !item.arrivalTime || !item.departureTime);
        if (invalidItems.length > 0) {
          if (!confirm(`Warning: ${invalidItems.length} records are missing important fields like busId, company, stops, arrivalTime, departureTime. \n\nDo you still want to proceed?\n\n(Kuch records main zaroori fields missing hain. Kya aap phir bhi continue karna chahte hain?)`)) {
            return;
          }
        }

        const fileNameToSave = selectedPartitionFile === 'custom' 
          ? (customPartitionFile.trim() || 'custom_partition.json')
          : selectedPartitionFile;

        // Ensure the filename ends with .json
        const finalFileName = fileNameToSave.toLowerCase().endsWith('.json') 
          ? fileNameToSave 
          : `${fileNameToSave}.json`;

        let actionMessage = '';
        if (uploadMode === 'merge') {
          actionMessage = `Merge ${parsedData.length} uploaded records with the existing static file "${finalFileName}"? \n\nExisting sequences with matching busId will be updated, and new ones will be added.`;
        } else {
          actionMessage = `Create/Overwrite "${finalFileName}" completely with only the ${parsedData.length} uploaded records?`;
        }

        if (confirm(`${actionMessage} \n\nKya aap is file ko update kar k direct download karna chahte hain?`)) {
          setIsSaving(true);
          try {
            let finalDataToDownload = [];

            if (uploadMode === 'merge') {
              try {
                // Try to load existing static file data from the server
                const response = await fetch(`/data/buses/${finalFileName}`);
                if (response.ok) {
                  const existingData = await response.json();
                  if (Array.isArray(existingData)) {
                    // Match and merge by busId
                    const busMap = new Map();
                    existingData.forEach((item: any) => {
                      if (item && item.busId) busMap.set(item.busId, item);
                    });
                    parsedData.forEach((item: any) => {
                      if (item && item.busId) busMap.set(item.busId, item);
                    });
                    finalDataToDownload = Array.from(busMap.values());
                  } else {
                    finalDataToDownload = parsedData;
                  }
                } else {
                  // File does not exist yet on server, just use uploaded data
                  finalDataToDownload = parsedData;
                }
              } catch (fetchErr) {
                console.warn('Could not fetch existing static file, using uploaded data only:', fetchErr);
                finalDataToDownload = parsedData;
              }
            } else {
              // Overwrite mode
              finalDataToDownload = parsedData;
            }

            // Generate and trigger download of the newly compiled JSON file
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalDataToDownload, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", finalFileName);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            alert(`Success! Generated and downloaded updated JSON file "${finalFileName}" containing ${finalDataToDownload.length} sequences.\n\nAb aap is file ko apni local directory ya GitHub repository me save/replace kar sakty hain.`);
            setIsJsonUploading(false);
            resetForm();
          } catch (error) {
            console.error(error);
            alert('Processing failed. Check the console for details.');
          } finally {
            setIsSaving(false);
          }
        }
      } catch (error) {
        console.error(error);
        alert('Failed to parse file. Ensure the format is valid.');
      }
    };

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        companyName: 'Example Travels',
        origin: 'Lahore',
        destination: 'Islamabad',
        departureTime: '08:00 AM',
        arrivalTime: '12:00 PM',
        duration: '4h 0m',
        fare: 1500,
        busNumber: 'LX-123',
        contactNumber: '0300-1234567',
        terminalLocation: 'General Bus Stand',
        standNumber: '5',
        type: 'Executive',
        isAC: 'TRUE'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bus_routes_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsViewingProposals(true)}
              className="relative bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <BusIcon className="w-5 h-5 text-emerald-500" /> 
              <span>Proposed Routes</span>
              {contributions.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full px-1.5 flex items-center justify-center border border-white">
                  {contributions.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsViewingReports(true)}
              className="relative bg-white hover:bg-slate-50 text-rose-700 border border-rose-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500" /> 
              <span>Passenger Reports</span>
              {reports.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-600 text-white text-[10px] font-black rounded-full px-1.5 flex items-center justify-center border border-white">
                  {reports.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsViewingFeedbacks(true)}
              className="relative bg-white hover:bg-slate-50 text-sky-700 border border-sky-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5 text-sky-500" /> 
              <span>Feedback & Complaints</span>
              {(feedbacks.length + complaints.length) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-sky-600 text-white text-[10px] font-black rounded-full px-1.5 flex items-center justify-center border border-white">
                  {feedbacks.length + complaints.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsViewingCareers(true)}
              className="relative bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Briefcase className="w-5 h-5 text-emerald-500" /> 
              <span>Job Applications / CVs</span>
              {careersList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full px-1.5 flex items-center justify-center border border-white">
                  {careersList.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsBulkUpdatingFare(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Tag className="w-5 h-5 text-amber-500" /> bulk fare update
            </button>
            <button 
              onClick={() => setIsBulkUploading(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Upload className="w-5 h-5 text-blue-500" /> Bulk Upload
            </button>
            <button 
              onClick={() => setIsJsonUploading(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <FileText className="w-5 h-5 text-indigo-500" /> JSON Partition Upload
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Add New Route
            </button>
          </div>
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
          {renderPagination(true)}
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
                {currentEntries.map((bus) => (
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
          {renderPagination(false)}
        </div>
      </div>

      {/* JSON Partition Bulk Upload Modal */}
      <AnimatePresence>
        {isJsonUploading && (
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
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-6">
                  <FileText className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Static JSON Partition</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Update static JSON partition files offline. Your uploaded records will be parsed, merged/overwritten, and downloaded directly as a clean file.
                  <br />
                  <span className="text-xs text-slate-400">یہ ڈیٹا فائر اسٹور میں سیو نہیں ہوگا، یہ صرف لوکل فائل کو اپ ڈیٹ اور ڈاؤن لوڈ کرے گا۔</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* Download Template File */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Download Sample Template / سیمپل ٹیمپلیٹ فائل ڈاؤن لوڈ کریں
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => downloadPartitionTemplate('xlsx')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 border border-emerald-100 transition-all active:scale-95 shadow-sm"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadPartitionTemplate('csv')}
                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 border border-sky-100 transition-all active:scale-95 shadow-sm"
                    >
                      <FileText className="w-5 h-5 text-sky-600" />
                      <span>CSV (.csv)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadPartitionTemplate('json')}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 px-2 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 border border-indigo-100 transition-all active:scale-95 shadow-sm"
                    >
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span>JSON (.json)</span>
                    </button>
                  </div>
                </div>

                {/* Partition File Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Target Partition File Name / کس فائل میں سیو کرنا ہے؟
                  </label>
                  <select
                    value={selectedPartitionFile}
                    onChange={(e) => setSelectedPartitionFile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800"
                  >
                    <option value="B1-B500.json">B1-B500.json</option>
                    <option value="B501-B1000.json">B501-B1000.json</option>
                    <option value="B1001-B1500.json">B1001-B1500.json</option>
                    <option value="custom">Custom File Name... (Apni Marzi ka Name)</option>
                  </select>
                </div>

                {selectedPartitionFile === 'custom' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Custom File Name (e.g. B1501-B2000.json)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B1501-B2000.json"
                      value={customPartitionFile}
                      onChange={(e) => setCustomPartitionFile(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800"
                    />
                  </motion.div>
                )}

                {/* Processing Mode Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Processing Mode / فائل کو اپ ڈیٹ کرنے کا طریقہ
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUploadMode('merge')}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-black text-center transition-all ${
                        uploadMode === 'merge'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Merge with existing file / ڈیٹا شامل کریں
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('overwrite')}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-black text-center transition-all ${
                        uploadMode === 'overwrite'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Replace completely / پورا تبدیل کریں
                    </button>
                  </div>
                </div>

                {/* File Upload Zone */}
                <div 
                  className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center group hover:border-emerald-500 hover:bg-emerald-50/10 transition-all cursor-pointer"
                  onClick={() => jsonFileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-sm font-bold text-slate-600 mb-1">Click to select Excel, CSV or JSON file</p>
                  <p className="text-xs text-slate-400 font-medium">Supports .xlsx, .xls, .csv, .json • Max 10MB</p>
                  <input 
                    type="file"
                    ref={jsonFileInputRef}
                    onChange={handlePartitionFileUpload}
                    accept=".xlsx,.xls,.csv,.json"
                    className="hidden"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-2">Structure & File Storage</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Make sure your uploaded file columns match the sample template. After downloading, place the updated file inside your project's <code className="font-mono bg-amber-100/50 px-1 py-0.5 rounded text-amber-800">/public/data/buses/</code> directory to replace the older partition file.
                    </p>
                  </div>
                </div>
              </div>

              {isSaving && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-900">Processing & Downloading...</p>
                  <p className="text-xs text-slate-500 mt-1">Please do not close this window</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkUploading && (
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
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <FileSpreadsheet className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Bulk Route Upload</h2>
                <p className="text-slate-500 leading-relaxed">
                  Upload a CSV file containing your bus routes. You can export your Google Sheet as a CSV and upload it here.
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-center group hover:border-emerald-500 hover:bg-emerald-50/10 transition-all cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-sm font-bold text-slate-600 mb-1">Click to select CSV file</p>
                  <p className="text-xs text-slate-400">Max file size 5MB • CSV Only</p>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 mb-2">Instructions</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Make sure your CSV columns match the template exactly. Using the template ensures 100% successful upload.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={downloadTemplate}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  <Download className="w-4 h-4" /> Download CSV Template
                </button>
              </div>

              {isSaving && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-900">Uploading Routes...</p>
                  <p className="text-xs text-slate-500 mt-1">Please do not close this window</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Fare Update Modal */}
      <AnimatePresence>
        {isBulkUpdatingFare && (
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
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 mx-auto mb-6">
                  <Tag className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bulk Fare Update</h2>
                <p className="text-xs text-amber-600 font-extrabold uppercase tracking-widest">یک کلک سے کرایہ تبدیل کریں</p>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  Select key cities and enter the new fare. This will update the ticket price for <span className="font-bold text-slate-900">all buses matching this route</span> simultaneously.
                </p>
              </div>

              <form onSubmit={handleBulkFareUpdateSubmit} className="space-y-6">
                <InputGroup label="Origin City" icon={<MapPin className="w-4 h-4" />}>
                  <select 
                    required
                    value={bulkFareData.origin}
                    onChange={(e) => setBulkFareData({ ...bulkFareData, origin: e.target.value })}
                    className="admin-input bg-slate-50 px-2"
                  >
                    <option value="">Select Origin</option>
                    {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="Destination City" icon={<MapPin className="w-4 h-4" />}>
                  <select 
                    required
                    value={bulkFareData.destination}
                    onChange={(e) => setBulkFareData({ ...bulkFareData, destination: e.target.value })}
                    className="admin-input bg-slate-50 px-2"
                  >
                    <option value="">Select Destination</option>
                    {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="New Ticket Fare (RS)" icon={<ArrowLeft className="w-4 h-4 rotate-90" />}>
                  <input 
                    required
                    type="number"
                    min="1"
                    placeholder="e.g. 1500"
                    value={bulkFareData.fare || ''}
                    onChange={(e) => setBulkFareData({ ...bulkFareData, fare: parseInt(e.target.value) || 0 })}
                    className="admin-input" 
                  />
                </InputGroup>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest"
                  >
                    Cancel / منسوخ
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20 text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" /> 
                    )}
                    {isSaving ? 'Processing...' : 'Update All / تبدیل کریں'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Passenger Reports Modal */}
      <AnimatePresence>
        {isViewingReports && (
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
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] p-10 md:p-14"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Passenger Reports</h2>
                    <p className="text-xs text-rose-600 font-extrabold uppercase tracking-widest">غلط معلومات کی شکایات ({reports.length})</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  These issues were reported directly by passengers clicking the <span className="font-bold text-slate-900">"Report Incorrect Information"</span> option. Use this to contact bus operators, verify timetables, and keep data accurate.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {loadingReports ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
                    <p className="text-xs text-slate-500 font-medium">Checking complaints list...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold text-sm mb-1">Excellent! No active issues have been reported.</p>
                    <p className="text-slate-300 text-xs">مسافروں کی طرف سے کوئی شکایت وصول نہیں ہوئی ہے۔</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div 
                      key={report.id} 
                      className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider rounded-xl">
                            Reported Bus
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {report.createdAt?.seconds 
                              ? new Date(report.createdAt.seconds * 1000).toLocaleString() 
                              : 'Just Now'}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-black text-slate-900 text-lg leading-snug">{report.busName}</h4>
                          <p className="text-xs text-slate-400 font-bold">Bus Identifiers/Route ID: <span className="font-mono text-[10.5px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-600">{report.busId}</span></p>
                        </div>

                        {/* Reported Issues Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(report.issues) && report.issues.map((i: string) => (
                            <span key={i} className="bg-rose-50 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-lg">
                              ⚠ {i}
                            </span>
                          ))}
                        </div>

                        {report.description ? (
                          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
                            <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">Passenger Feedback Description:</p>
                            <p className="text-slate-700 font-medium text-xs leading-relaxed italic">"{report.description}"</p>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-[10px] font-extrabold italic">No additional details written by reporter.</p>
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          if (confirm('Mark this report as resolved? This will permanently delete the report. \n\nKya aap is report ko hal shuda mark kar k delete karna chahte hain?')) {
                            try {
                              await reportService.deleteReport(report.id);
                            } catch (error) {
                              alert('Error deleting report');
                            }
                          }
                        }}
                        className="w-full md:w-auto px-6 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black rounded-2xl text-xs uppercase tracking-widest transition-all shrink-0 text-center"
                      >
                        ✓ Mark Resolved
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Careers CV Modal */}
      <AnimatePresence>
        {isViewingCareers && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewingCareers(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] p-10 md:p-14"
            >
              <button 
                onClick={() => setIsViewingCareers(false)} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Job Applications & CVs</h2>
                    <p className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest">ملازمت کے لیے درخواستیں اور سی وی فائلیں</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  These candidate files were submitted directly using the <span className="font-bold text-emerald-600">Careers</span> footer link. You can view applicant details, work experience, and download their CV files directly to your device.
                </p>
              </div>

              {/* Candidates List Container */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {loadingCareersList ? (
                  <div className="text-center py-20 text-slate-400 font-semibold flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                    <span>Loading candidates...</span>
                  </div>
                ) : careersList.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-slate-105 p-8">
                    <Briefcase className="w-10 h-10 text-slate-350 mx-auto mb-4" />
                    <p className="text-slate-500 font-black text-lg">No Applications Yet</p>
                    <p className="text-slate-400 text-xs mt-1">Pending job applications/CVs will appear here.</p>
                  </div>
                ) : (
                  careersList.map((app) => {
                    // Function to handle raw base64 download of the CV
                    const triggerCvDownload = () => {
                      if (!app.cvData) {
                        try {
                          // Check if we saved the CV string locally in database
                          alert("CV file binary data not loaded because document size exceeded limits. Please review the registered email inbox! / سی وی فائل ڈیٹا دستیاب نہیں ہے۔");
                        } catch (e) {}
                        return;
                      }
                      
                      try {
                        const base64Data = app.cvData.includes('base64,') 
                          ? app.cvData.split('base64,')[1] 
                          : app.cvData;
                          
                        const byteCharacters = atob(base64Data);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: app.cvType || 'application/octet-stream' });
                        
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = app.cvName || 'CV_Application';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } catch (err) {
                        console.error("Failed to download file base64: ", err);
                        alert("Could not process and download download file. / فائل ڈاؤن لوڈ کرنے میں ناکامی۔");
                      }
                    };

                    return (
                      <div key={app.id} className="p-6 md:p-8 bg-slate-50 hover:bg-slate-50/80 border border-slate-105 rounded-[2rem] transition-all space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block">
                              {app.position || 'General Position'}
                            </span>
                            <h4 className="text-xl font-extrabold text-slate-800">{app.name}</h4>
                            <p className="text-xs text-slate-400 font-semibold">
                              Submitted: {app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <a 
                              href={`tel:${app.mobile}`}
                              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all"
                            >
                              📞 Call
                            </a>
                            {app.email && (
                              <a 
                                href={`mailto:${app.email}`}
                                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all"
                              >
                                ✉ Email
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Experience info */}
                        <div className="bg-white border border-slate-100/50 p-5 rounded-2xl">
                          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-bold text-slate-400 font-black">Work Experience Description / تجربہ</h5>
                          <p className="text-sm text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">{app.experience}</p>
                        </div>

                        {/* Attached CV actions */}
                        <div className="flex items-center justify-between p-4 bg-emerald-50/40 border border-emerald-100/30 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-xs">{app.cvName}</span>
                          </div>

                          <button
                            type="button"
                            onClick={triggerCvDownload}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                          >
                            <Download className="w-3.5 h-3.5" /> Download CV File
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Passenger Feedback & Complaints Modal */}
      <AnimatePresence>
        {isViewingFeedbacks && (
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
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] p-10 md:p-14"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Passenger Feedbacks & Complaints</h2>
                    <p className="text-xs text-sky-600 font-extrabold uppercase tracking-widest">مسافروں کی آراء اور شکایات</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  These inputs were submitted directly by passengers using the floating <span className="font-bold text-sky-600">Feedback</span> tab. Use this to review user satisfaction or resolve service issues.
                </p>
              </div>

              {/* Sub tabs in Modal */}
              <div className="flex border-b border-slate-100 mb-6 shrink-0">
                <button
                  onClick={() => setActiveFeedbackTab('feedback')}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                    activeFeedbackTab === 'feedback' 
                      ? 'text-emerald-700 border-emerald-500 bg-emerald-50/20' 
                      : 'text-slate-400 border-transparent hover:text-slate-650 hover:bg-slate-50/50'
                  }`}
                >
                  Feedback / رائے ({feedbacks.length})
                </button>
                <button
                  onClick={() => setActiveFeedbackTab('complaint')}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                    activeFeedbackTab === 'complaint' 
                      ? 'text-rose-700 border-rose-500 bg-rose-50/20' 
                      : 'text-slate-400 border-transparent hover:text-slate-650 hover:bg-slate-50/50'
                  }`}
                >
                  Complaints / شکایات ({complaints.length})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {activeFeedbackTab === 'feedback' ? (
                  loadingFeedbacks ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                      <p className="text-xs text-slate-500 font-medium">Loading feedbacks...</p>
                    </div>
                  ) : feedbacks.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold text-sm mb-1">No feedback received yet.</p>
                      <p className="text-slate-300 text-xs">مسافروں کی طرف سے اب تک کوئی رائے نہیں ملی۔</p>
                    </div>
                  ) : (
                    feedbacks.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white border border-slate-105 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg">
                              Feedback
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {item.createdAt?.seconds 
                                ? new Date(item.createdAt.seconds * 1000).toLocaleString() 
                                : 'Recent'}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-black text-slate-900 text-lg leading-none">
                              {item.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-semibold">
                              <span>Mobile: <strong className="text-slate-700">{item.mobile}</strong></span>
                              {item.email && (
                                <span>Email: <strong className="text-slate-700">{item.email}</strong></span>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                            <p className="text-slate-700 font-medium text-xs leading-relaxed italic">
                              "{item.message}"
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this feedback entry? \n\nKya aap is feedback ko delete karna chahte hain?')) {
                              try {
                                const { deleteDoc, doc } = await import('firebase/firestore');
                                await deleteDoc(doc(db, 'feedback', item.id));
                              } catch (error) {
                                console.error(error);
                                alert('Failed to delete feedback.');
                              }
                            }
                          }}
                          className="w-full md:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-700 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all text-center shrink-0"
                        >
                          Delete / ختم کریں
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  loadingComplaints ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
                      <p className="text-xs text-slate-500 font-medium">Loading complaints...</p>
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold text-sm mb-1">Excellent! No complaints received.</p>
                      <p className="text-slate-300 text-xs">سب خیریت ہے! کوئی شکایت موصول نہیں ہوئی۔</p>
                    </div>
                  ) : (
                    complaints.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white border border-slate-105 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-black uppercase tracking-wider rounded-lg">
                              Complaint
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {item.createdAt?.seconds 
                                ? new Date(item.createdAt.seconds * 1000).toLocaleString() 
                                : 'Recent'}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-black text-slate-900 text-lg leading-none">
                              {item.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-semibold">
                              <span>Mobile: <strong className="text-rose-700">{item.mobile}</strong></span>
                              {item.email && (
                                <span>Email: <strong className="text-slate-705">{item.email}</strong></span>
                              )}
                            </div>
                          </div>

                          <div className="bg-rose-50/20 border border-rose-100/30 rounded-2xl p-4 animate-pulse-subtle">
                            <p className="text-slate-800 font-medium text-xs leading-relaxed italic">
                              "{item.message}"
                            </p>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0">
                          <button
                            onClick={async () => {
                              if (confirm('Mark this complaint as resolved and delete it? \n\nKya aap is shikayat ko resolved mark kar k delete karna chahte hain?')) {
                                try {
                                  const { deleteDoc, doc } = await import('firebase/firestore');
                                  await deleteDoc(doc(db, 'complaints', item.id));
                                } catch (error) {
                                    console.error(error);
                                    alert('Failed to resolve complaint.');
                                }
                              }
                            }}
                            className="flex-1 px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all text-center whitespace-nowrap shadow-md shadow-rose-500/10 active:scale-95"
                          >
                            ✓ Mark Resolved
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proposed Routes Modal */}
      <AnimatePresence>
        {isViewingProposals && (
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
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] p-10 md:p-14"
            >
              <button 
                onClick={resetForm} 
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <BusIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Proposed Schedules</h2>
                    <p className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest">مسافروں کی طرف سے تجویز کردہ روٹس ({contributions.length})</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  These routes were suggested by users through the website contribution system. Review, edit if needed, and click <span className="font-bold text-emerald-600">"Approve to Database"</span> to make them live on the app.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {loadingContributions ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                    <p className="text-xs text-slate-500 font-medium">Checking suggested routes...</p>
                  </div>
                ) : contributions.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold text-sm mb-1">No user-contributed routes right now.</p>
                    <p className="text-slate-300 text-xs">مسافروں کی طرف سے تجویز کردہ کوئی روٹ نہیں ہے۔</p>
                  </div>
                ) : (
                  contributions.map((contrib) => (
                    <div 
                      key={contrib.id} 
                      className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg">
                            User Proposal
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-lg">
                            {contrib.type || 'Non-AC'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold ml-auto md:ml-0">
                            {contrib.submittedAt 
                              ? new Date(contrib.submittedAt).toLocaleString() 
                              : 'Recent'}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-black text-slate-900 text-xl tracking-tight leading-snug">
                            {contrib.companyName}
                          </h4>
                          <p className="text-emerald-600 font-extrabold text-sm flex items-center gap-2.5 mt-1">
                            <span>{contrib.origin}</span>
                            <span className="text-slate-350 font-normal">➔</span>
                            <span>{contrib.destination}</span>
                          </p>
                        </div>

                        {/* Detailed information row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl text-[11px] font-bold text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Departure</span>
                            <span className="text-slate-800">{contrib.departureTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Arrival</span>
                            <span className="text-slate-800">{contrib.arrivalTime || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Duration</span>
                            <span className="text-slate-800">{contrib.duration || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Price</span>
                            <span className="text-emerald-700 font-black">Rs. {contrib.fare}</span>
                          </div>
                        </div>

                        {/* Additional identifiers */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium">
                          {contrib.busNumber && (
                            <div>
                              <span>Reg/Bus #: </span>
                              <span className="font-bold text-slate-700">{contrib.busNumber}</span>
                            </div>
                          )}
                          {contrib.contactNumber && (
                            <div>
                              <span>Contact Operator: </span>
                              <span className="font-bold text-slate-700">{contrib.contactNumber}</span>
                            </div>
                          )}
                          {contrib.terminalLocation && (
                            <div className="w-full">
                              <span>Terminal: </span>
                              <span className="font-bold text-slate-700">{contrib.terminalLocation} {contrib.standNumber ? `(Stand ${contrib.standNumber})` : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={async () => {
                            if (confirm('Approve this suggested route? This will make it LIVE on the database. \n\nKya aap is route ko approve kar k database me shamil karna chahte hain?')) {
                              try {
                                const { id, submittedAt, userId, ...busData } = contrib;
                                // Force accurate dynamic defaults
                                const verifiedBusData = {
                                  ...busData,
                                  status: 'On Schedule',
                                  isAC: busData.isAC ?? (busData.type !== 'Non-AC')
                                };
                                await busService.addBus(verifiedBusData);
                                await contributionService.deleteContribution(id);
                                alert('Route has been approved and is now live!');
                              } catch (error) {
                                console.error(error);
                                alert('Failed to approve route.');
                              }
                            }
                          }}
                          className="flex-1 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all text-center whitespace-nowrap shadow-md shadow-emerald-500/10 active:scale-95"
                        >
                          ✓ Approve Route
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Reject and delete this route suggestion? This action is permanent.')) {
                              try {
                                await contributionService.deleteContribution(contrib.id);
                              } catch (error) {
                                alert('Failed to reject route.');
                              }
                            }
                          }}
                          className="px-4 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all text-center active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <form onSubmit={handleSubmit} className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between items-center mb-10 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
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
                      <select 
                        required
                        value={formData.origin}
                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                        className="admin-input bg-slate-50 px-2"
                      >
                        <option value="">Select Origin</option>
                        {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </InputGroup>

                    <InputGroup label="Destination City" icon={<MapPin className="w-4 h-4" />}>
                      <select 
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                        className="admin-input bg-slate-50 px-2"
                      >
                        <option value="">Select Destination</option>
                        {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
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

                    <InputGroup label="Arrival Time" icon={<Clock className="w-4 h-4" />}>
                      <input 
                        required
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                        className="admin-input" 
                        placeholder="e.g. 12:30 PM"
                      />
                    </InputGroup>

                    <InputGroup label="Auto-Duration" icon={<Clock className="w-4 h-4 text-emerald-500" />}>
                      <input 
                        readOnly
                        value={formData.duration}
                        className="admin-input bg-emerald-50/30 text-emerald-600 border-none px-2 rounded-lg" 
                        placeholder="Automatic Calculation"
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
