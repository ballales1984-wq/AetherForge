import { ShowroomClient } from "./showroom/ShowroomClient";

export function Showroom() {
  return (
    <section id="showroom" className="relative border-y border-white/5 bg-[#050505] py-32">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            Interactive Experience
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-white md:text-6xl xl:text-7xl">
            Web-native 3D before the real model exists.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg xl:text-xl">
            Navigate concept hypercars in realtime. Orbit, zoom, switch materials, and explore every curve — all rendered instantly in your browser with Three.js.
          </p>
        </div>

        {/* 3D Viewer */}
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <ShowroomClient />
          {/* Overlay hint */}
          <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs text-white/60 backdrop-blur-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Drag to orbit · Scroll to zoom
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-12 flex flex-wrap gap-3 md:mt-16">
          {["Realtime Rendering", "Orbit Controls", "Material Switcher", "HDR Environment"].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-cyan-500/30 bg-cyan-900/20 px-4 py-1.5 text-xs font-medium text-cyan-200"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
