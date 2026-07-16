export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-16">
          <span className="w-1.5 h-7 bg-emerald-600 rounded-full"></span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">How AsaanSafar Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
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
            <div key={idx} className="flex gap-6 items-start">
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm shadow-xl shadow-emerald-600/30">
                {item.step}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Future of Bus Travel Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            The Future of Bus Travel in Pakistan
          </h2>
          <p className="text-slate-400 text-base leading-relaxed font-medium">
            We are on a mission to digitize every terminal and bus operator in Pakistan. From the bustling streets of Karachi to the scenic routes of Northern Pakistan, our platform ensures you have the most accurate data at your fingertips.
          </p>
        </div>
      </div>
    </section>
  );
}
