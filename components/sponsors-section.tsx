const SPONSORS = {
  platinum: [
    { name: "Google Cloud", abbr: "GC" },
    { name: "Microsoft Azure", abbr: "MA" },
  ],
  gold: [
    { name: "Red Hat", abbr: "RH" },
    { name: "VMware", abbr: "VM" },
    { name: "AWS", abbr: "AW" },
  ],
  silver: [
    { name: "DigitalOcean", abbr: "DO" },
    { name: "Civo", abbr: "CI" },
    { name: "Datadog", abbr: "DD" },
    { name: "Sysdig", abbr: "SY" },
  ],
}

function SponsorLogo({ name, abbr, size }: { name: string; abbr: string; size: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "h-20 w-40",
    md: "h-16 w-32",
    sm: "h-12 w-24",
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border border-border bg-card transition-shadow hover:shadow-md`}
      title={name}
    >
      <span className={`font-bold text-muted-foreground ${size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-sm"}`}>
        {abbr}
      </span>
    </div>
  )
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground">Sponsors</h2>

      {/* Platinum */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Platinum</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {SPONSORS.platinum.map((s) => (
            <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="lg" />
          ))}
        </div>
      </div>

      {/* Gold */}
      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gold</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {SPONSORS.gold.map((s) => (
            <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="md" />
          ))}
        </div>
      </div>

      {/* Silver */}
      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Silver</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {SPONSORS.silver.map((s) => (
            <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="sm" />
          ))}
        </div>
      </div>
    </section>
  )
}
