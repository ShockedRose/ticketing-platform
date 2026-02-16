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
};

function SponsorLogo({
  name,
  abbr,
  size,
}: {
  name: string;
  abbr: string;
  size: "lg" | "md" | "sm";
}) {
  const sizeClasses = {
    lg: "h-24 w-48 text-2xl",
    md: "h-20 w-40 text-xl",
    sm: "h-16 w-32 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-xl border-2 border-border bg-card font-bold text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-lg hover:-translate-y-1`}
      title={name}
    >
      {abbr}
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="scroll-mt-20">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Sponsors
      </h2>

      <div className="mt-10 space-y-12">
        <div>
          <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Platinum Sponsors
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {SPONSORS.platinum.map((s) => (
              <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="lg" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Gold Sponsors
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {SPONSORS.gold.map((s) => (
              <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="md" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
            Silver Sponsors
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {SPONSORS.silver.map((s) => (
              <SponsorLogo key={s.name} name={s.name} abbr={s.abbr} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-muted/30 p-8 text-center border border-dashed border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Interested in sponsoring?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Reach out to us at{" "}
          <a
            href="mailto:sponsors@kcdpanama.com"
            className="font-medium text-primary hover:underline"
          >
            sponsors@kcdpanama.com
          </a>{" "}
          to learn about our packages.
        </p>
      </div>
    </section>
  );
}
