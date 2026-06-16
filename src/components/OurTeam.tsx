import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Mail, Phone, Award, Building, Briefcase, Heart, CheckCircle2 } from 'lucide-react';

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
    email: 'ceo@Asaansafar.com',
    phone: '+92 300 8155443',
    specialization: 'Product Strategy & Technology Architecture',
    bio: `Mujahid Ali is the Founder & CEO of AsaanSafar, a platform created with the goal of making bus travel across Pakistan easier, faster, and more convenient. With more than 12 years of experience in transportation, logistics, operations management, administration, and customer service, he has gained valuable insight into the challenges faced by both passengers and transport operators.

Driven by a passion for improving the travel experience, Mujahid founded AsaanSafar to help travelers find reliable bus services, access accurate route information, and enjoy a smoother journey planning process. His vision is to use technology to simplify intercity travel and build a trusted platform that connects people with the transport services they need. Under his leadership, AsaanSafar is working towards becoming Pakistan's most reliable and customer-focused bus travel platform.`,
    urduBio: `مجاہد علی آسان بس سفر (AsaanSafar) کے بانی اور چیف ایگزیکٹو آفیسر (CEO) ہیں۔ انہوں نے اس پلیٹ فارم کی بنیاد پاکستان بھر میں بس کے ذریعے سفر کو زیادہ آسان، تیز اور سہل بنانے کے مقصد سے رکھی۔ ٹرانسپورٹیشن، لاجسٹکس، آپریشنز مینجمنٹ، انتظامی امور اور کسٹمر سروس کے شعبوں میں 12 سال سے زائد تجربے کے باعث انہیں مسافروں اور ٹرانسپورٹ آپریٹرز دونوں کو درپیش مسائل اور ضروریات کی گہری سمجھ حاصل ہے۔

سفر کے تجربے کو بہتر بنانے کے جذبے سے سرشار، مجاہد علی نے آسان بس سفر کا آغاز کیا تاکہ مسافروں کو قابلِ اعتماد بس سروسز تلاش کرنے، درست روٹ معلومات حاصل کرنے اور اپنے سفر کی منصوبہ بندی کو مزید آسان بنانے میں مدد مل سکے۔ ان کا وژن جدید ٹیکنالوجی کے ذریعے بین الاضلاعی سفر کو سادہ اور مؤثر بنانا ہے، اور ایک ایسا قابلِ اعتماد پلیٹ فارم فراہم کرنا ہے جو مسافروں کو بہترین ٹرانسپورٹ سہولیات سے جوڑے۔ ان کی قیادت میں آسان بس سفر پاکستان کا سب سے معتبر اور مسافر دوست بس ٹریول پلیٹ فارم بننے کی جانب گامزن ہے۔`
  },
  {
    name: 'Noman Ejaz',
    urduName: 'نعمان اعجاز',
    role: 'General Manager (GM) of Operations',
    urduRole: 'جنرل مینیجر آپریشنز',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    email: 'operations@Asaansafar.com',
    specialization: 'Liaison & Field Quality Management',
    bio: 'Muhammad Arsalan leads the operational heartbeat of AsaanSafar. He coordinates directly with terminal stand managers, regional transport authorities, and field verification teams to ensure the database stays 100% accurate. He holds substantial experience in Logistics and Fleet Operations.',
    urduBio: 'محمد ارسلان آسان بس سفر کے آپریشنز کے نگران ہیں۔ وہ اڈہ مینیجرز، علاقائی ٹرانسپورٹ حکام اور فیلڈ ٹیموں کے ساتھ براہِ راست تال میل رکھتے ہیں تاکہ ڈیٹا بیس سو فیصد درست رہے۔ وہ لاجسٹکس اور فلیٹ آپریشنز کے شعبے میں وسیع تجربہ رکھتے ہیں۔'
  },
  {
    name: 'Aisha Malik',
    urduName: 'عائشہ ملک',
    role: 'Head of Finance & Corporate Partnerships',
    urduRole: 'سربراہ برائے فنانس اور کارپوریٹ پارٹنرشپ',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    email: 'partnerships@Asaansafar.com',
    specialization: 'Operator Tie-ups & Asset Allocation',
    bio: 'Aisha coordinates strategic integrations with major private bus companies and government authorities. She acts as the vital bridge to facilitate advertiser alignment on the platform, fostering win-win growth models for verified bus standard owners.',
    urduBio: 'عائشہ ملک نجی بس کمپنیوں اور حکومتی اداروں کے ساتھ اسٹریٹجک پارٹنرشپ کی نگران ہیں۔ وہ تصدیق شدہ بس اڈوں کے مالکان کے لیے ون-ون ترقی کے ماڈلز کو ڈیزائن اور فروغ دیتی ہیں۔'
  },
  {
    name: 'Sajid Mahmood',
    urduName: 'ساجد محمود',
    role: 'Drivers Liaison Officer',
    urduRole: 'مسؤل برائے ڈرائیور تعلقات',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    email: 'driver-support@Asaansafar.com',
    specialization: 'Union Management & Ground Coordination',
    bio: 'Sajid has spent over 15 years within major transport unions across Punjab and Sindh. He leads ground support, teaching regional heavy-bus operators, drivers, and conductors how to broadcast dynamic time alterations directly to the digital board.',
    urduBio: 'ساجد محمود پنجاب اور سندھ کی بڑی ٹرانسپورٹ یونینز میں 15 سال سے زائد کا تجربہ رکھتے ہیں۔ وہ ڈرائیورز، کنڈکٹرز اور ہیوی بس آپریٹرز کو براہِ راست ڈیجیٹل سسٹم سے جوڑنے کی زمینی فیلڈ کی قیادت کرتے ہیں۔'
  }
];

export default function OurTeam() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      {/* Hero Banner Header */}
      <section className="bg-white border-b border-slate-100 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-600/5">
              <Users className="w-8 h-8" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 sm:text-5xl">
            Meet Our <span className="text-emerald-600">Management Team</span>
          </h1>
          <p className="text-slate-400 font-extrabold uppercase tracking-widest text-xs mb-4">
            انتظامیہ اور بانی عملے سے ملیں
          </p>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Behind the seamless digital timetables and accurate fair calculations is a team of passionate transport professionals, operators, and developers committed to modernizing commuting across Pakistan.
          </p>
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
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-md shrink-0 border border-slate-100">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
                  </div>
                  
                  <div className="text-center sm:text-left space-y-1.5 flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{member.name}</h3>
                      <span className="text-xs text-emerald-700 font-black tracking-widest mt-0.5">{member.urduRole} • {member.urduName}</span>
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 font-bold">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.specialization}</span>
                    </div>
                  </div>
                </div>

                {/* English Bio */}
                <div className="space-y-2">
                  <p className="text-slate-650 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Urdu Bio */}
                <div className="bg-emerald-50/20 border border-emerald-100/20 rounded-2xl p-5" dir="rtl">
                  <p className="text-slate-800 text-xs font-bold leading-relaxed text-right font-sans">
                    {member.urduBio}
                  </p>
                </div>
              </div>

              {/* Contact / Footer details inside card */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${member.email}`} className="hover:text-emerald-600 transition-colors">{member.email}</a>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-emerald-600 transition-all">{member.phone}</a>
                  </div>
                )}
              </div>
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
