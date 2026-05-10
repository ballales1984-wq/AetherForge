import { services } from "@/data/projects";

export function DesignLab() {
  return (
    <section id="lab" className="relative bg-[#050505] py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-100" />
        <div className="absolute bottom-1/3 left-1/3 h-72 w-72 rounded-full bg-purple-400/10 blur-100" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div data-reveal className="max-w-3xl">
          <p className="font-display text-sm uppercase tracking-wide text-cyan-300">Design Lab</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">Sketch, AI finishing, 3D and launch-grade storytelling.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <div key={service} data-reveal className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300 font-display text-sm">
                  {index + 1}
                </span>
                <p className="font-display text-lg font-semibold text-white">{service}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <button className="rounded-lg bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
            Start a Project
          </button>
          <button className="rounded-lg border border-cyan-300/50 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-300/10 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            View Process
          </button>
        </div>
      </div>
    </section>
  );
}