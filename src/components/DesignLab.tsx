import { services } from "@/data/projects";

export function DesignLab() {
  return (
    <section id="lab" className="blueprint-grid mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div data-reveal className="max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.24em] text-forge-ember">Design Lab</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
          Sketch, AI finishing, 3D and launch-grade storytelling.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <div key={service} data-reveal className="border border-white/10 bg-forge-black/76 p-6">
            <p className="font-display text-lg font-semibold text-white">{service}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
