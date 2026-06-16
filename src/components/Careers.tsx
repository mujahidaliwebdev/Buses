import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Upload, CheckCircle2, ShieldAlert, FileText, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const POSITIONS = [
  { id: 'driver', label: 'Heavy Bus Driver / ہیوی ڈرائیور' },
  { id: 'conductor', label: 'Bus Conductor / بس کنڈکٹر' },
  { id: 'terminal', label: 'Terminal / Stand Manager / ٹرمینل مینیجر' },
  { id: 'support', label: 'Customer Support Agent / کسٹمر سپورٹ' },
  { id: 'marketing', label: 'Marketing & Booking Officer / بکنگ آفیسر' },
  { id: 'it', label: 'IT & Software Coordinator / پروگرامر' },
  { id: 'others', label: 'Other Staff / دیگر عملہ' }
];

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    position: '',
    experience: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    const isValidExt = ['.pdf', '.doc', '.docx'].includes(fileExt);

    if (!validTypes.includes(selectedFile.type) && !isValidExt) {
      setSubmitError('Invalid file type! Please upload a PDF or Word document (.doc, .docx). / غلط فارمیٹ! صرف پی ڈی ایف یا ورڈ فائل اپ لوڈ کریں۔');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setSubmitError('File is too large! Maximum allowed size is 5MB. / فائل بہت بڑی ہے! زیادہ سے زیادہ سائز 5MB ہے۔');
      return;
    }

    setSubmitError(null);
    setFile(selectedFile);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('File conversion error: ', error);
      setSubmitError('Failed to process file. Please try again. / فائل کنورٹ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔');
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setFileBase64('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fileBase64) {
      setSubmitError('Please upload your CV / Resume. / برائے مہربانی اپنی سی وی فائل اپ لوڈ کریں۔');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const submissionData = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      position: formData.position,
      experience: formData.experience,
      cvName: file.name,
      cvType: file.type || 'application/octet-stream'
    };

    try {
      // Step A: Save metadata to Firebase Firestore careers collection first
      const collectionPath = 'careers';
      await addDoc(collection(db, collectionPath), {
        ...submissionData,
        createdAt: serverTimestamp()
      });

      // Step B: Send full application with CV data to SMTP email route on our Express Backend
      const apiResponse = await fetch('/api/careers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          cvData: fileBase64
        })
      });

      const result = await apiResponse.json();

      if (result.success) {
        setSubmitSuccess(true);
        setEmailStatus(result.emailSent);
        setFormData({ name: '', mobile: '', email: '', position: '', experience: '' });
        setFile(null);
        setFileBase64('');
      } else {
        // Even if email API fails, if it was stored in Firestore we mark success but warn or show the error
        setSubmitError(result.message || 'Server failed to send CV. Please contact support. / سرور کی طرف سے خرابی۔');
      }
    } catch (err: any) {
      console.error('Job application submission failure: ', err);
      // Catch Firestore permission errors
      try {
        handleFirestoreError(err, OperationType.WRITE, 'careers');
      } catch (authError: any) {
        setSubmitError(`Submission Error: ${authError.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      {/* Banner / Header */}
      <section className="bg-white border-b border-slate-100 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-600/5">
              <Briefcase className="w-8 h-8" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 sm:text-5xl">
            Join Our <span className="text-emerald-600">Team</span>
          </h1>
          <p className="text-slate-500 font-extrabold uppercase tracking-widest text-[11px] mb-4">
            ہمارے ساتھ کام کریں اور پاکستان کی ٹرانسپورٹ کو بہتر بنائیں
          </p>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AsaanSafar is Pakistan's leading data-driven bus schedule network. We are always looking for passionate Heavy Bus Drivers, professional Managers, Terminal Agents, and Engineers to help build our platform nationwide. Apply below to submit your CV.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-slate-105 rounded-[3rem] p-10 md:p-14 shadow-xl text-center space-y-8"
              id="success-card"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shukriya! Application Received</h2>
                <h3 className="text-emerald-700 font-bold text-sm">درخواست موصول ہو گئی ہے! شکریہ</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
                  Your job application alongside your CV file has been securely submitted.
                  {emailStatus ? (
                    <span className="block mt-2 text-emerald-600 font-bold">
                       A direct copy has been dispatched to <strong>mujahidali.webdev@gmail.com</strong>.
                    </span>
                  ) : (
                    <span className="block mt-2 text-slate-400 text-xs">
                      The application is securely archived inside our admin system. Our HR coordinators will assess your file and contact you soon.
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setSubmitSuccess(false)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Apply For Another Position
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-105 rounded-[3rem] p-8 md:p-14 shadow-xl space-y-10"
              id="careers-form-container"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Application Form</h2>
                <p className="text-slate-400 text-xs mt-1">Please fill in your details and upload your latest resume.</p>
              </div>

              {submitError && (
                <div className="flex items-start gap-3 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Error submitting application:</span>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Your Name / پورا نام <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 transition-all outline-none text-slate-800 font-bold text-sm"
                    placeholder="Muhammad Ali"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Mobile Number / فون نمبر <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 transition-all outline-none text-slate-800 font-bold text-sm"
                      placeholder="0300 1234567"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Email Address / ای میل
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 transition-all outline-none text-slate-800 font-bold text-sm"
                      placeholder="ali@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Select Position / اسامی منتخب کریں <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 transition-all outline-none text-slate-800 font-bold text-sm cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="">-- Choose Position --</option>
                    {POSITIONS.map((pos) => (
                      <option key={pos.id} value={pos.label}>{pos.label}</option>
                    ))}
                  </select>
                </div>

                {/* Experience / Description */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Work Experience Description / اپنے تجربے کی تفصیل <span className="text-emerald-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:border-emerald-500 transition-all outline-none text-slate-800 font-bold resize-none text-sm h-36"
                    placeholder="Briefly state your years of experience, current stand/terminal or certifications..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* CV File Upload */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                    Attach Your CV / Resume (PDF, Word) <span className="text-emerald-600">*</span>
                  </span>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-[2.5rem] p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
                      dragActive 
                        ? 'border-emerald-500 bg-emerald-50/20' 
                        : 'border-slate-200 bg-slate-50 hover:border-emerald-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      disabled={isSubmitting}
                    />

                    {file ? (
                      <div className="flex flex-col items-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="max-w-xs text-center">
                          <p className="text-sm font-black text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Word format'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="mt-2 text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-wider"
                        >
                          Remove File / ختم کریں
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            Drag & drop your file here, or <span className="text-emerald-600">click to browse</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">
                            Supports PDF, DOC, DOCX formats (Max 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Trigger */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 text-center font-black bg-slate-950 hover:bg-emerald-600 text-white rounded-[2rem] text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg shadow-slate-950/10 active:scale-[0.98] ${
                    isSubmitting ? 'bg-slate-700 opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting CV File...
                    </>
                  ) : (
                    <>
                      <span>Submit Application / سی وی بھیجیں</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
