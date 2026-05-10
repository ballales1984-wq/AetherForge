const navItems = [
  { href: "#showroom", label: "Showroom" },
  { href: "#collection", label: "Collection" },
  { href: "#design-lab", label: "Design Lab" },
  { href: "#commission", label: "Commission" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050505]/40">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#" className="font-display text-lg font-semibold tracking-[0.25em] text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          AETHERFORGE
        </a>
        <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#commission"
          className="relative overflow-hidden rounded-full border border-cyan-500/50 bg-cyan-500/10 px-6 py-2 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] md:inline-flex"
        >
          <span className="relative z-10">Start Project</span>
          <div className="absolute inset-0 -z-10 bg-cyan-500/20 blur-xl" />
        </a>
      </nav>
    </header>
  );
}
