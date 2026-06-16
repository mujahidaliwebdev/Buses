import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Search } from 'lucide-react';

const ALL_SCHEDULE_ROUTES = [
  { from: "Lahore", to: "Faisalabad" },
  { from: "Faisalabad", to: "Lahore" },
  { from: "Lahore", to: "Karachi" },
  { from: "Karachi", to: "Lahore" },
  { from: "Faisalabad", to: "Karachi" },
  { from: "Karachi", to: "Faisalabad" },
  { from: "Lahore", to: "Multan" },
  { from: "Multan", to: "Lahore" },
  { from: "Lahore", to: "Islamabad" },
  { from: "Islamabad", to: "Lahore" },
  { from: "Lahore", to: "Layyah" },
  { from: "Layyah", to: "Lahore" },
  { from: "Lahore", to: "Kot Addu" },
  { from: "Kot Addu", to: "Lahore" },
  { from: "Lahore", to: "Karor" },
  { from: "Karor", to: "Lahore" },
  { from: "Faisalabad", to: "Layyah" },
  { from: "Layyah", to: "Faisalabad" },
  { from: "Faisalabad", to: "Kot Addu" },
  { from: "Kot Addu", to: "Faisalabad" },
  { from: "Faisalabad", to: "Karor" },
  { from: "Karor", to: "Faisalabad" },
  { from: "Lahore", to: "Taunsa" },
  { from: "Taunsa", to: "Lahore" },
];

interface SchedulesProps {
  onRouteClick: (from: string, to: string) => void;
}

export default function Schedules({ onRouteClick }: SchedulesProps) {
  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Clock className="w-4 h-4" /> Full Timetable
          </div>
          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl mb-6 tracking-tight">
            Bus <span className="text-emerald-600">Schedules</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find complete bus timings and schedules for major routes across Pakistan. Select a route to see all available buses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_SCHEDULE_ROUTES.map((route, i) => (
            <motion.div 
              key={`${route.from}-${route.to}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-white p-6 border border-slate-200 rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer relative overflow-hidden"
            >
              <Link 
                to={`/${route.from.toLowerCase().replace(/ /g, '-')}-to-${route.to.toLowerCase().replace(/ /g, '-')}-bus-timing`}
                className="absolute inset-0 z-20"
              />
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Popular Connection</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">From</span>
                      <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{route.from}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-emerald-300 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">To</span>
                      <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{route.to}</span>
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Search className="w-3.5 h-3.5" />
                  View All Buses
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <MapPin className="w-3.5 h-3.5" />
                  Daily Service
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Help Tip */}
        <div className="mt-20 p-8 bg-white border border-slate-100 rounded-3xl text-center shadow-lg shadow-slate-200/50">
          <p className="text-slate-500 font-medium">
            Don't see your route? Try searching directly from the <Link to="/" className="text-emerald-600 font-bold hover:underline">homepage</Link>.

          </p>
        </div>
      </div>
    </div>
  );
}
