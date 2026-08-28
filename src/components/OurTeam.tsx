import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Mail, Phone, Award, Building, Briefcase, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  name: string;
  urduName: string;
  role: string;
  urduRole: string;
  image: string;
  email: string;
  phone?: string;
  bio: string;
  urduBio: string;
  specialization: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Mujahid Ali',
    urduName: 'مجاہد علی',
    role: 'CEO & Founder',
    urduRole: 'چیف ایگزیکٹو آفیسر اور بانی',
    image: 'https://lh3.googleusercontent.com/d/1zfizXkN-L_9Y4xzuLaJ_jyXL7MNXNmL5',
    email: 'ceo@asaansafar.com',
    phone: '0300-8155443',
    specialization: 'Product Strategy & Technology Architecture',
    bio: `Mujahid Ali is the Founder & CEO of AsaanSafar, a platform created with the goal of making bus travel across Pakistan easier, faster, and more convenient. With more than 12 years of experience in transportation, logistics, operations management, administration, and customer service, he has gained valuable insight into the challenges faced by both passengers and transport operators.

Driven by a passion for improving the travel experience, Mujahid founded AsaanSafar to help travelers find reliable bus services, access accurate route information, and enjoy a smoother journey planning process. His vision is to use technology to simplify intercity travel and build a trusted platform that connects people with the transport services they need. Under his leadership, AsaanSafar is working towards becoming Pakistan's most reliable and customer-focused bus travel platform.`,
    urduBio: `مجاہد علی آسان سفر (AsaanSafar) کے بانی اور چیف ایگزیکٹو آفیسر (CEO) ہیں۔ انہوں نے اس پلیٹ فارم کی بنیاد پاکستان بھر میں بس کے ذریعے سفر کو زیادہ آسان، تیز اور سہل بنانے کے مقصد سے رکھی۔ ٹرانسپورٹیشن، لاجسٹکس، آپریشنز مینجمنٹ، انتظامی امور اور کسٹمر سروس کے شعبوں میں 12 سال سے زائد تجربے کے باعث انہیں مسافروں اور ٹرانسپورٹ آپریٹرز دونوں کو درپیش مسائل اور ضروریات کی گہری سمجھ حاصل ہے۔

سفر کے تجربے کو بہتر بنانے کے جذبے سے سرشار، مجاہد علی نے آسان سفر کا آغاز کیا تاکہ مسافروں کو قابلِ اعتماد بس سروسز تلاش کرنے، درست روٹ معلومات حاصل کرنے اور اپنے سفر کی منصوبہ بندی کو مزید آسان بنانے میں مدد مل سکے۔ ان کا وژن جدید ٹیکنالوجی کے ذریعے بین الاضلاعی سفر کو سادہ اور مؤثر بنانا ہے، اور ایک ایسا قابلِ اعتماد پلیٹ فارم فراہم کرنا ہے جو مسافروں کو بہترین ٹرانسپورٹ سہولیات سے جوڑے۔ ان کی قیادت میں آسان سفر پاکستان کا سب سے معتبر اور مسافر دوست بس ٹریول پلیٹ فارم بننے کی جانب گامزن ہے۔`
  },
  {
    name: '',
    urduName: '',
    role: 'General Manager (GM) of Operations',
    urduRole: 'جنرل مینیجر آپریشنز',
    image: '',
    email: '',
    specialization: '',
    bio: '',
    urduBio: ''
  },
  {
    name: '',
    urduName: '',
    role: 'Head of Operations',
    urduRole: 'ہیڈ آف آپریشنز',
    image: '',
    email: 'operations@asaansafar.com',
    specialization: '',
    bio: '',
    urduBio: ''
  },
  {
    name: '',
    urduName: '',
    role: 'Data & Verification Manager',
    urduRole: 'ڈیٹا اور ویریفیکیشن مینیجر',
    image: '',
    email: '',
    specialization: '',
    bio: '',
    urduBio: ''
  },
  {
    name: '',
    urduName: '',
    role: 'Technology & Product Manager',
    urduRole: 'ٹیکنالوجی اور پروڈکٹ مینیجر',
    image: '',
    email: '',
    specialization: '',
    bio: '',
    urduBio: ''
  },
  {
    name: '',
    urduName: '',
    role: 'Customer Support Manager',
    urduRole: 'کسٹمر سپورٹ مینیجر',
    image: '',
    email: 'support@asaansafar.com',
    specialization: '',
    bio: '',
    urduBio: ''
  }
];

export default function OurTeam() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-emerald-950 py-28 sm:py-36 mb-16 animate-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--color-emerald-700),_transparent_70%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-4"
          >
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </button>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Meet Our <span className="text-emerald-400">Management Team</span>
            </h1>
            <p className="text-emerald-100/70 font-semibold tracking-wide uppercase text-[11px] flex gap-2 items-center">
              <span>MANAGEMENT & FOUNDERS</span> • <span>انتظامیہ اور بانی عملے سے ملیں</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-emerald-100/80 max-w-2xl">
              Behind the seamless digital timetables and accurate fare calculations is a team of passionate transport professionals, operators, and developers committed to modernizing commuting across Pakistan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-105 rounded-[3rem] p-8 md:p-10 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Image and Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-md shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name || member.role} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
                  </div>
                  
                  <div className="text-center sm:text-left space-y-1.5 flex-1 w-full">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`text-2xl font-black text-slate-900 tracking-tight leading-none ${!member.name ? 'text-slate-400 italic font-medium' : ''}`}>
                        {member.name || 'To Be Appointed'}
                      </h3>
                      <span className="text-xs text-emerald-700 font-black tracking-widest mt-0.5">
                        {member.urduRole}
                        {member.urduName ? ` • ${member.urduName}` : ` • خالی آسامی`}
                      </span>
                    </div>
                    
                    {member.specialization && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 font-bold">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{member.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* English Bio */}
                {member.bio && (
                  <div className="space-y-2">
                    <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line">
                      {member.bio}
                    </p>
                  </div>
                )}

                {/* Urdu Bio */}
                {member.urduBio && (
                  <div className="bg-emerald-50/20 border border-emerald-100/20 rounded-2xl p-5" dir="rtl">
                    <p className="text-slate-800 text-xs font-bold leading-relaxed text-right font-sans whitespace-pre-line">
                      {member.urduBio}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact / Footer details inside card */}
              {(member.email || member.phone) && (
                <div className="pt-6 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  {member.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-emerald-600 transition-colors">{member.email}</a>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`tel:${member.phone}`} className="hover:text-emerald-600 transition-all">{member.phone}</a>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Corporate Trust Statement */}
         <div className="mt-16 bg-white border border-slate-105 p-8 md:p-10 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-lg leading-tight">Guaranteed Verification Protocol</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Every data point published on AsaanSafar goes through our strictly audited GM oversight team.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
               <CheckCircle2 className="w-4 h-4 text-emerald-600" />
               <span>100% Direct Ground Verification</span>
            </div>
         </div>
      </div>
    </div>
  );
}
