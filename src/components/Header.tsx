const navItems = [
  { href: "#collection", label: "Collection" },
  { href: "#showroom", label: "Showroom" },
  { href: "#lab", label: "Design Lab" },
  { href: "#commission", label: "Commission" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-forge-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#" className="font-display text-lg font-semibold tracking-[0.18em] text-white">
          AETHERFORGE
        </a>
        <div className="hidden items-center gap-7 text-sm text-forge-silver md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="mailto:hello@aetherforge.studio"
          className="hidden border border-forge-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-forge-red md:inline-flex"
        >
          Start Project
        </a>
      </nav>
    </header>
  );
}
