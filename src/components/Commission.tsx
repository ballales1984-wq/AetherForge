export function Commission() {
  return (
    <section id="commission" className="border-t border-white/10 px-5 py-20 md:px-8">
      <div data-reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-4xl font-semibold text-white md:text-6xl">
            Custom commission pipeline.
          </p>
          <p className="mt-4 max-w-2xl text-forge-silver">
            Fase successiva: form cliente, area privata, upload reference, preventivi, ordini e backend FastAPI.
          </p>
        </div>
        <a className="inline-flex min-h-12 items-center justify-center bg-white px-6 font-semibold text-forge-black transition hover:bg-forge-red hover:text-white" href="mailto:hello@aetherforge.studio">
          hello@aetherforge.studio
        </a>
      </div>
    </section>
  );
}
