export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it Works</h2>
          <p className="text-emerald-100/70">Three simple steps to find your next ride.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Vertical/Horizontal lines */}
          <div className="hidden md:block absolute top-[44px] left-1/4 right-1/4 h-px bg-emerald-700 select-none z-0" />
          
          {[
            {
              step: "01",
              title: "Enter Origin",
              desc: "Select the city where you want to start your journey."
            },
            {
              step: "02",
              title: "Enter Destination",
              desc: "Tell us where you want to go. We cover all major routes."
            },
            {
              step: "03",
              title: "View Buses",
              desc: "Compare timings, fares, and types to pick the best bus."
            }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-800 border-4 border-emerald-700 flex items-center justify-center text-2xl font-black text-emerald-400 mb-6 shadow-xl">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-emerald-100/60 text-sm max-w-[200px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
