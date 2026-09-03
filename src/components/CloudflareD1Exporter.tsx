import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Copy, 
  Download, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  Zap,
  Settings,
  RefreshCw,
  Key,
  Globe
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { staticDataService } from '../lib/staticDataService';

interface CloudflareD1ExporterProps {
  onClose: () => void;
}

type TableType = 'buses' | 'bus_stops' | 'fares';

export default function CloudflareD1Exporter({ onClose }: CloudflareD1ExporterProps) {
  const [selectedTable, setSelectedTable] = useState<TableType>('buses');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('');
  const [recordCount, setRecordCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudflare D1 Live State
  const [d1Status, setD1Status] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    accountId: '',
    databaseId: '',
    apiToken: '',
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchD1Status();
  }, []);

  const fetchD1Status = async () => {
    const status = await staticDataService.getD1Status();
    setD1Status(status);
  };

  const handleDirectSync = async () => {
    if (!generatedSql) return;

    if (!d1Status?.configured) {
      setShowConfigModal(true);
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    setError(null);

    try {
      const result = await staticDataService.executeD1Sql(generatedSql);
      if (result.success) {
        setSyncResult({
          success: true,
          message: `Live Update Successful! Executed ${result.executedCount || recordCount} statements directly on Cloudflare D1. All changes are immediately live on the website.`
        });
        fetchD1Status();
      } else {
        throw new Error(result.message || 'Direct sync failed.');
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Failed to sync with Cloudflare D1. Please check credentials or run in console.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configForm.accountId || !configForm.databaseId || !configForm.apiToken) {
      alert('Please provide Account ID, Database ID, and API Token.');
      return;
    }

    setIsSavingConfig(true);
    try {
      const res = await staticDataService.saveD1Config(configForm);
      if (res.success) {
        await fetchD1Status();
        setShowConfigModal(false);
        alert('Cloudflare D1 credentials connected and saved successfully!');
      } else {
        alert(`Error: ${res.message || 'Failed to save credentials'}`);
      }
    } catch (err: any) {
      alert(`Error saving credentials: ${err.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await staticDataService.testD1Connection();
      alert(res.message || (res.connected ? 'Connected successfully!' : 'Connection failed.'));
      fetchD1Status();
    } catch (err: any) {
      alert(`Test connection error: ${err.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSeedSchema = async () => {
    if (!confirm('This will create the tables (buses, bus_stops, fares) and insert initial seed routes directly on Cloudflare D1. Continue?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const res = await staticDataService.seedD1Schema();
      if (res.success) {
        alert('Database schema and seed data created successfully on Cloudflare D1!');
        fetchD1Status();
      } else {
        alert(`Error initializing schema: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Normalization helper to map CSV headers to standard DB columns
  const normalizeHeader = (header: string): string => {
    return header.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
  };

  const escapeSql = (val: any): string => {
    if (val === undefined || val === null) return 'NULL';
    const str = String(val).trim();
    if (str === '') return "''";
    // SQLite escapes single quotes with two single quotes
    return `'${str.replace(/'/g, "''")}'`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setGeneratedSql('');
    setIsProcessing(true);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        let rawRows: any[] = [];

        if (fileExtension === 'csv') {
          const text = event.target?.result as string;
          const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
          rawRows = parsed.data;
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rawRows = XLSX.utils.sheet_to_json(worksheet);
        } else {
          setError('Unsupported file format. Please upload .csv, .xlsx, or .xls file.');
          setIsProcessing(false);
          return;
        }

        if (rawRows.length === 0) {
          setError('The uploaded spreadsheet is empty.');
          setIsProcessing(false);
          return;
        }

        generateSqlForTable(rawRows);
      } catch (err: any) {
        console.error(err);
        setError(`Failed to read file: ${err.message || err}`);
        setIsProcessing(false);
      }
    };

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const generateSqlForTable = (rows: any[]) => {
    try {
      let sqlStatements: string[] = [];
      let count = 0;

      if (selectedTable === 'buses') {
        // Buses Info Columns: bus_id, company_name, vehicle_plate, contact_number, climate_control, service_type, route_map
        const seenBusIds = new Set<string>();
        let duplicateCount = 0;

        rows.forEach(row => {
          let bus_id = '';
          let company_name = '';
          let vehicle_plate = '';
          let contact_number = '';
          let climate_control = '';
          let service_type = '';
          let route_map = '';

          Object.keys(row).forEach(key => {
            const norm = normalizeHeader(key);
            if (norm === 'busid' || norm === 'id' || norm === 'bus_id') bus_id = row[key];
            else if (norm === 'companyname' || norm === 'company' || norm === 'company_name') company_name = row[key];
            else if (norm === 'vehicleplate' || norm === 'vehicle_plate' || norm === 'vehiclenumber' || norm === 'plate') vehicle_plate = row[key];
            else if (norm === 'contactnumber' || norm === 'contact_number' || norm === 'contact' || norm === 'phone') contact_number = row[key];
            else if (norm === 'climatecontrol' || norm === 'climate_control' || norm === 'climate' || norm === 'ac_non_ac') climate_control = row[key];
            else if (norm === 'servicetype' || norm === 'service_type' || norm === 'service') service_type = row[key];
            else if (norm === 'routemap' || norm === 'route_map' || norm === 'route') route_map = row[key];
          });

          // Ensure we have at least a Bus ID
          if (bus_id && String(bus_id).trim()) {
            const cleanId = String(bus_id).trim();
            if (seenBusIds.has(cleanId)) {
              duplicateCount++;
              return; // Skip duplicate rows with the same Bus ID
            }
            seenBusIds.add(cleanId);

            sqlStatements.push(
              `INSERT OR REPLACE INTO buses (bus_id, company_name, vehicle_plate, contact_number, climate_control, service_type, route_map) VALUES (${escapeSql(cleanId)}, ${escapeSql(company_name || 'New Khan')}, ${escapeSql(vehicle_plate)}, ${escapeSql(contact_number)}, ${escapeSql(climate_control)}, ${escapeSql(service_type)}, ${escapeSql(route_map)});`
            );
            count++;
          }
        });

        if (duplicateCount > 0) {
          setError(`Warning: ${duplicateCount} duplicate Bus ID(s) found in the spreadsheet and were skipped automatically.`);
        }
      } else if (selectedTable === 'bus_stops') {
        // Bus Stops Columns: bus_id, city_name, stop_sequence, arrival_time, departure_time, location, stand
        rows.forEach(row => {
          let bus_id = '';
          let city_name = '';
          let stop_sequence: any = '';
          let arrival_time = '';
          let departure_time = '';
          let location = '';
          let stand = '';

          Object.keys(row).forEach(key => {
            const norm = normalizeHeader(key);
            if (norm === 'busid' || norm === 'id' || norm === 'bus_id') bus_id = row[key];
            else if (norm === 'cityname' || norm === 'city' || norm === 'city_name') city_name = row[key];
            else if (norm === 'stopsequence' || norm === 'stop_sequence' || norm === 'sequence' || norm === 'stop') stop_sequence = row[key];
            else if (norm === 'arrivaltime' || norm === 'arrival_time' || norm === 'arrival') arrival_time = row[key];
            else if (norm === 'departuretime' || norm === 'departure_time' || norm === 'departure') departure_time = row[key];
            else if (norm === 'location' || norm === 'terminal' || norm === 'terminal_location') location = row[key];
            else if (norm === 'stand' || norm === 'standnumber' || norm === 'stand_number') stand = row[key];
          });

          const parsedSeq = parseInt(stop_sequence);

          if (bus_id && city_name && !isNaN(parsedSeq)) {
            sqlStatements.push(
              `INSERT OR REPLACE INTO bus_stops (bus_id, city_name, stop_sequence, arrival_time, departure_time, location, stand) VALUES (${escapeSql(bus_id)}, ${escapeSql(city_name)}, ${parsedSeq}, ${escapeSql(arrival_time)}, ${escapeSql(departure_time)}, ${escapeSql(location)}, ${escapeSql(stand)});`
            );
            count++;
          }
        });
      } else if (selectedTable === 'fares') {
        // Fares Columns: origin, destination, non_ac, ac, executive, business, sleeper
        rows.forEach(row => {
          let origin = '';
          let destination = '';
          let non_ac = 0;
          let ac = 0;
          let executive = 0;
          let business = 0;
          let sleeper = 0;

          Object.keys(row).forEach(key => {
            const norm = normalizeHeader(key);
            const val = parseInt(row[key]) || 0;
            if (norm === 'origin' || norm === 'origincity' || norm === 'origin_city') origin = row[key];
            else if (norm === 'destination' || norm === 'destinationcity' || norm === 'destination_city') destination = row[key];
            else if (norm === 'nonac' || norm === 'fare_non_ac' || norm === 'non_ac') non_ac = val;
            else if (norm === 'ac' || norm === 'fare_ac') ac = val;
            else if (norm === 'executive' || norm === 'fare_executive') executive = val;
            else if (norm === 'business' || norm === 'fare_business') business = val;
            else if (norm === 'sleeper' || norm === 'fare_sleeper') sleeper = val;
          });

          if (origin && destination) {
            sqlStatements.push(
              `INSERT OR REPLACE INTO fares (origin, destination, non_ac, ac, executive, business, sleeper) VALUES (${escapeSql(origin)}, ${escapeSql(destination)}, ${non_ac}, ${ac}, ${executive}, ${business}, ${sleeper});`
            );
            count++;
          }
        });
      }

      if (count === 0) {
        setError(`No valid records matched the expected columns for the "${selectedTable}" table. Please check your spreadsheet headers.`);
        setGeneratedSql('');
      } else {
        const headerComment = `-- ========================================== \n-- GENERATED BY ASAANSAFAR CLOUDFLARE CONVERTER\n-- Table: ${selectedTable}\n-- Records: ${count}\n-- Date: ${new Date().toLocaleDateString()}\n-- ========================================== \n\n`;
        setGeneratedSql(headerComment + sqlStatements.join('\n'));
        setRecordCount(count);
      }
    } catch (err: any) {
      setError(`Failed to generate SQL: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSql], { type: 'text/sql;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `asaansafar_${selectedTable}_import.sql`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Database className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Cloudflare D1 Live Manager & Importer</h2>
          <p className="text-xs text-indigo-600 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> گوگل شیٹ امپورٹر و لائیو کلاؤڈ فلیر ڈیٹا بیس
          </p>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-md mx-auto">
            Upload your Google Sheets spreadsheet to convert it to SQL or directly sync it to your live Cloudflare D1 database with one click!
          </p>

          {/* Cloudflare D1 Live Status Bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${d1Status?.connected ? 'bg-emerald-500 animate-pulse' : d1Status?.configured ? 'bg-amber-500' : 'bg-slate-400'}`} />
              <span className="font-bold text-slate-700">
                {d1Status?.connected 
                  ? `Live Edge Connected (${d1Status?.busCount || 0} buses in D1)` 
                  : d1Status?.configured 
                    ? 'Configured (Testing connection...)' 
                    : 'Local Mode (Cloudflare D1 Not Linked)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-600" />
                <span>{d1Status?.configured ? 'Edit Credentials' : 'Connect Cloudflare D1'}</span>
              </button>

              {d1Status?.configured && (
                <button
                  type="button"
                  onClick={handleSeedSchema}
                  disabled={isSeeding}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Creating...' : 'Initialize Tables'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sync Result Banner */}
        {syncResult && (
          <div className={`mb-6 p-5 rounded-2xl border flex items-start gap-3.5 ${
            syncResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {syncResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-sm">
                {syncResult.success ? '⚡ Live Database Updated!' : 'Direct Sync Failed'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{syncResult.message}</p>
            </div>
            <button
              onClick={() => setSyncResult(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Steps and Form */}
        <div className="space-y-8">
          
          {/* Step 1: Select Table */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              1. Select Target Table / ٹیبل کا انتخاب کریں
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setSelectedTable('buses'); setGeneratedSql(''); setFileName(''); }}
                className={`py-4 px-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 border transition-all ${
                  selectedTable === 'buses'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-500" />
                <span>Buses Info</span>
                <span className="text-[10px] text-slate-400 font-normal">Sheet 1: Vehicles & General Info</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedTable('bus_stops'); setGeneratedSql(''); setFileName(''); }}
                className={`py-4 px-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 border transition-all ${
                  selectedTable === 'bus_stops'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-500" />
                <span>Bus Stops</span>
                <span className="text-[10px] text-slate-400 font-normal">Sheet 2: Schedules & Timings</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedTable('fares'); setGeneratedSql(''); setFileName(''); }}
                className={`py-4 px-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 border transition-all ${
                  selectedTable === 'fares'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-500" />
                <span>Ticket Fares</span>
                <span className="text-[10px] text-slate-400 font-normal">Sheet 3: Route Fare Pricing</span>
              </button>
            </div>
          </div>

          {/* Step 2: Upload File */}
          {!generatedSql && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                2. Upload CSV or Excel Spreadsheet / فائل اپ لوڈ کریں
              </label>
              <div 
                className="p-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30 text-center group hover:border-indigo-500 hover:bg-indigo-50/10 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-indigo-500 transition-all" />
                <p className="text-base font-bold text-slate-700 mb-1">Click to upload spreadsheet</p>
                <p className="text-xs text-slate-400">Supports Google Sheet exported CSV (.csv) or Excel (.xlsx, .xls)</p>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Feedback and Output */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-1 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-900 mb-1">Processing Error</h4>
                <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {generatedSql && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">SQL Generated Successfully!</h4>
                    <p className="text-xs text-indigo-700 font-medium">
                      Matched <span className="font-bold">{recordCount} records</span> from file "{fileName}" for the table <span className="font-mono font-bold">{selectedTable}</span>.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDirectSync}
                    disabled={isSyncing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Zap className={`w-4 h-4 ${isSyncing ? 'animate-bounce text-amber-300' : 'text-amber-300'}`} />
                    <span>{isSyncing ? 'Syncing...' : '⚡ Sync to Live Database'}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    {copied ? 'Copied! / کاپی ہو گیا' : 'Copy SQL'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download .sql
                  </button>
                </div>
              </div>

              {/* Guide/Instructions */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-amber-200 text-amber-800 text-[10px] rounded-full font-bold">!</span>
                  How to Execute in Cloudflare (طریقہ کار):
                </h4>
                <ul className="space-y-2.5 text-xs text-amber-800 font-medium pl-1">
                  <li className="flex gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>کلاؤڈ فلیر کونسول کھولیں اور بائیں طرف سے <strong>Query</strong> والے آپشن پر کلک کریں۔</span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>اوپر موجود <strong>Copy SQL</strong> بٹن پر کلک کر کے اس جنریٹڈ کوڈ کو کونسول کے ان پٹ باکس میں پیسٹ کریں۔</span>
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>نیلے رنگ کے بٹن <strong>Execute</strong> پر کلک کر دیں۔ سارا ڈیٹا سیکنڈوں میں لائیو اپ لوڈ ہو جائے گا!</span>
                  </li>
                </ul>
              </div>

              {/* Code Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    SQL Preview
                  </label>
                  <button 
                    onClick={() => { setGeneratedSql(''); setFileName(''); }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear / نئی فائل اپ لوڈ کریں
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    value={generatedSql}
                    className="w-full h-48 bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-900">Processing Spreadsheet...</p>
            <p className="text-xs text-slate-500 mt-1">Please do not close this window</p>
          </div>
        )}

      </div>

      {/* Cloudflare D1 Credentials Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Cloudflare D1 Connection</h3>
                <p className="text-xs text-slate-500 font-medium">کلاؤڈ فلیر لائیو کنکشن کی ترتیبات</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1. Cloudflare Account ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9b8c7d6e5f4a3b2c1..."
                  value={configForm.accountId}
                  onChange={(e) => setConfigForm({ ...configForm, accountId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-400">Found in your Cloudflare dashboard overview URL.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  2. D1 Database ID (UUID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12345678-abcd-1234-abcd-1234567890ab"
                  value={configForm.databaseId}
                  onChange={(e) => setConfigForm({ ...configForm, databaseId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-400">Found in Workers & Pages &gt; D1 &gt; Your Database settings.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  3. Cloudflare API Token (with D1 Edit permissions)
                </label>
                <input
                  type="password"
                  placeholder="Bearer Token..."
                  value={configForm.apiToken}
                  onChange={(e) => setConfigForm({ ...configForm, apiToken: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-400">Created in Cloudflare Profile &gt; API Tokens &gt; Create Token with D1 Edit access.</span>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all"
                  >
                    {isSavingConfig ? 'Connecting...' : 'Save & Connect'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
