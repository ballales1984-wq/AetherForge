"use client";

import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Showroom } from "@/components/Showroom";
import { Collection } from "@/components/Collection";
import { DesignLab } from "@/components/DesignLab";
import { Commission } from "@/components/Commission";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Smooth scroll-triggered animations for sections
    const sections = mainRef.current?.querySelectorAll("section");
    sections?.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    });

    // Parallax background on scroll
    gsap.to(".ambient-glow", {
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      scale: 1.5,
      opacity: 0.3,
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient shader background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-[#050505] to-[#050505]" />
        <div className="ambient-glow absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.4),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <Header />
      <main ref={mainRef} className="relative">
        {/* Hero Section - Fullscreen cinematic */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px]" />
          </div>
          <Hero />
        </section>

        {/* Showroom - Interactive 3D */}
        <section id="showroom" className="relative min-h-[120vh] py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent mb-6">
                Hypercar Showroom
              </h2>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                Interact with concept hypercars in realtime 3D. Orbit, zoom, pan, and switch materials live.
              </p>
            </div>
          </div>
          <Showroom />
        </section>

        {/* Collection Grid */}
        <section id="collection" className="relative py-32">
          <Collection />
        </section>

        {/* Design Lab */}
        <section id="design-lab" className="relative py-32">
          <DesignLab />
        </section>

        {/* Commission */}
        <section id="commission" className="relative py-32">
          <Commission />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} AetherForge — Digital studio car design.
          </p>
          <p className="text-white/30 text-xs mt-2">
            Crafted with Three.js, FastAPI, and Unreal Engine 5.
          </p>
        </div>
      </footer>
    </div>
  );
}
