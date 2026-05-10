"use client";

import Image from "next/image";
import { useState } from "react";
import { projects } from "@/data/projects";
import { Lightbox } from "./Lightbox";

export function Collection() {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({ isOpen: false, images: [], currentIndex: 0 });

  const openLightbox = (images: string[], startIndex: number) => {
    setLightboxState({ isOpen: true, images, currentIndex: startIndex });
  };

  const closeLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const navigateLightbox = (index: number) => {
    setLightboxState((prev) => ({ ...prev, currentIndex: index }));
  };

  return (
    <>
      <section id="collection" className="relative bg-[#050505] py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-100" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-400/10 blur-100" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <div data-reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-cyan-300">Collection</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
                <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">A curated garage for concept machines.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/80">
              Questa sezione diventa il tuo garage premium: concept, viste multiple, specifiche e storia progettuale.
            </p>
          </div>

          <div className="space-y-8">
            {projects.map((project) => (
              <article key={project.slug} data-reveal className="grid overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[360px] overflow-hidden bg-black md:min-h-[520px]">
                  <Image
                    src={project.image}
                    alt={`${project.title} automotive concept`}
                    fill
                    sizes="(min-width: 768px) 52vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between p-5 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xs uppercase tracking-wide text-cyan-300">{project.category}</p>
                      <h3 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">{project.title}</h3>
                    </div>
                    <span className="text-sm text-cyan-300">{project.year}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.specs.map((spec) => (
                      <span key={spec} className="border border-white/10 px-3 py-1 text-xs text-white/80">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {project.gallery.map((image, index) => (
                      <div
                        key={image}
                        className="relative aspect-[16/10] cursor-pointer overflow-hidden border border-white/10 bg-black"
                        onClick={() => openLightbox(project.gallery, index)}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} view ${index + 1}`}
                          fill
                          sizes="(min-width: 768px) 24vw, 50vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={lightboxState.images}
        currentIndex={lightboxState.currentIndex}
        isOpen={lightboxState.isOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
}