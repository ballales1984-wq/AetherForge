import Image from "next/image";
import { projects } from "@/data/projects";

export function Collection() {
  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div data-reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.24em] text-forge-ember">Collection</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
            A curated garage for concept machines.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-forge-silver">
          Questa sezione diventa il tuo garage premium: concept, viste multiple, specifiche e storia progettuale.
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((project) => (
          <article key={project.slug} data-reveal className="grid overflow-hidden border border-white/10 bg-forge-panel md:grid-cols-[1.05fr_0.95fr]">
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
                  <p className="font-display text-xs uppercase tracking-[0.22em] text-forge-ember">{project.category}</p>
                  <h3 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">{project.title}</h3>
                </div>
                <span className="text-sm text-forge-ember">{project.year}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.specs.map((spec) => (
                  <span key={spec} className="border border-white/10 px-3 py-1 text-xs text-forge-silver">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {project.gallery.map((image, index) => (
                  <div key={image} className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-black">
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
    </section>
  );
}
