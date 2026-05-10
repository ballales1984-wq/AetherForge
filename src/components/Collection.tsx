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

      <div className="grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.slug} data-reveal className="group overflow-hidden border border-white/10 bg-forge-panel">
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <Image
                src={project.image}
                alt={`${project.title} automotive concept`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-forge-silver">{project.category}</p>
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
