import { ShowroomClient } from "./showroom/ShowroomClient";

export function Showroom() {
  return (
    <section id="showroom" className="border-y border-white/10 bg-forge-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-24 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-32">
        <div data-reveal className="flex flex-col justify-center">
          <p className="font-display text-sm uppercase tracking-[0.24em] text-forge-ember">Immersive Showroom</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
            Web-native 3D before the real model exists.
          </h2>
          <p className="mt-6 text-base leading-8 text-forge-mist/80">
            Questo è il punto di partenza per GLB/GLTF da Blender: configuratore, materiali metallici, showroom virtuale e viste aerodinamiche.
          </p>
        </div>
        <div data-reveal className="h-[520px] overflow-hidden border border-white/10 bg-black">
          <ShowroomClient />
        </div>
      </div>
    </section>
  );
}
