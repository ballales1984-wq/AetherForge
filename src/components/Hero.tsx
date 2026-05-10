"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | HTMLHeadingElement | HTMLDivElement)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for hero lines
      gsap.fromTo(
        linesRef.current,
        { y: 80, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.18,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      // Cinematic zoom on featured car
      gsap.fromTo(
        ".hero-car-zoom",
        { scale: 1.1, filter: "brightness(0.6)" },
        {
          scale: 1,
          filter: "brightness(1)",
          duration: 2.8,
          ease: "power2.out",
          delay: 0.6,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-hero
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background image with parallax-ready scaling */}
      <div className="hero-car-zoom absolute inset-0">
        <Image
          data-hero-image
          src="/work/real-concepts/red-track-hypercar/red-track-front.jpeg"
          alt="AetherForge red hypercar concept"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-24 pt-32 md:px-8">
        <div className="max-w-5xl">
          <p
            ref={(el) => el && linesRef.current.push(el)}
            data-hero-line
            className="font-display text-sm uppercase tracking-[0.4em] text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          >
            Neo-Italian Hypercar Futurism
          </p>
          <h1
            ref={(el) => el && linesRef.current.push(el)}
            data-hero-line
            className="mt-6 font-display text-5xl/[0.85] font-semibold text-white md:text-7xl lg:text-8xl xl:text-9xl"
          >
            Automotive concepts forged for the future.
          </h1>
          <p
            ref={(el) => el && linesRef.current.push(el)}
            data-hero-line
            className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg xl:text-xl"
          >
            AetherForge blends human sketching, AI finishing, cinematic art direction, and web-native 3D to present hypercar ideas like real luxury launches.
          </p>
          <div
            ref={(el) => el && linesRef.current.push(el)}
            data-hero-line
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#collection"
              className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-cyan-500 px-8 font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_45px_rgba(6,182,212,0.6)]"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 -z-10 bg-cyan-400/20 blur-xl transition-all group-hover:bg-cyan-300/30" />
            </a>
            <a
              href="#showroom"
              className="group inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm transition-all hover:border-cyan-400 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
            >
              Enter Showroom
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-6 w-[1px] bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </div>
    </section>
  );
}
