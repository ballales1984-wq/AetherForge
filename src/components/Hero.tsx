import Image from "next/image";

export function Hero() {
  return (
    <section data-hero className="relative min-h-screen overflow-hidden">
      <Image
        data-hero-image
        src="/work/real-concepts/red-track-hypercar/red-track-front.jpeg"
        alt="AetherForge red hypercar concept"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forge-black via-forge-black/72 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forge-black to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-28 md:px-8">
        <div className="max-w-4xl">
          <p data-hero-line className="font-display text-sm uppercase tracking-[0.32em] text-forge-ember">
            Neo-Italian Hypercar Futurism
          </p>
          <h1
            data-hero-line
            className="mt-5 font-display text-6xl font-semibold leading-[0.9] text-white md:text-8xl lg:text-9xl"
          >
            Automotive concepts forged for the future.
          </h1>
          <p data-hero-line className="mt-7 max-w-2xl text-lg leading-8 text-forge-mist/86 md:text-xl">
            AetherForge blends human sketching, AI finishing, cinematic art direction, and web-native 3D to present hypercar ideas like real luxury launches.
          </p>
          <div data-hero-line className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center bg-forge-red px-6 font-semibold text-white transition hover:bg-white hover:text-forge-black" href="#collection">
              Explore Collection
            </a>
            <a className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 font-semibold text-white transition hover:border-white hover:bg-white/10" href="#showroom">
              Enter Showroom
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
