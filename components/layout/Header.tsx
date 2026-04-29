export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
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
