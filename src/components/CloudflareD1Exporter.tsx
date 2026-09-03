import React, { useState, useRef } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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
            sqlStatements.push(
              `INSERT OR REPLACE INTO buses (bus_id, company_name, vehicle_plate, contact_number, climate_control, service_type, route_map) VALUES (${escapeSql(bus_id)}, ${escapeSql(company_name || 'New Khan')}, ${escapeSql(vehicle_plate)}, ${escapeSql(contact_number)}, ${escapeSql(climate_control)}, ${escapeSql(service_type)}, ${escapeSql(route_map)});`
            );
            count++;
          }
        });
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Cloudflare D1 SQL Importer</h2>
          <p className="text-xs text-indigo-600 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> گوگل شیٹ امپورٹر یوٹیلیٹی
          </p>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-md mx-auto">
            Upload your Google Sheets CSV/Excel file directly. We will convert it into optimized, 100% matched SQLite SQL queries ready to be executed in Cloudflare!
          </p>
        </div>

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
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    {copied ? 'Copied! / کاپی ہو گیا' : 'Copy SQL / کاپی کریں'}
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
    </div>
  );
}
