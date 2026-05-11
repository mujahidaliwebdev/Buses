export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-7 bg-emerald-600 rounded-full"></span>
          <h2 className="text-xl font-bold text-slate-800">How ChaloBus Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Enter Origin",
              desc: "Select your starting city from our database of 50+ locations."
            },
            {
              step: "02",
              title: "Pick Destination",
              desc: "Tell us where you want to go and choose your travel date."
            },
            {
              step: "03",
              title: "View & Book",
              desc: "Compare real-time timings, fares and get direct terminal contact."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-5 items-start">
              <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-600/20">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
