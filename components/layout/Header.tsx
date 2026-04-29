export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <img
            src="/lb-icon.svg"
            alt="Lil-Badu logo"
            className="h-8 w-8"
          />
          <span
            className="text-xl font-bold tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            Lil-Badu
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
          Free &amp; Private
        </div>
      </div>
    </header>
  );
}
