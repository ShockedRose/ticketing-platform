export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="relative">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          About the Event
        </h2>
        <div className="absolute -left-4 top-1 h-8 w-1 rounded-full bg-secondary md:-left-8" />
      </div>

      <div className="mt-6 flex flex-col gap-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">
            Kubernetes Community Days (KCD) Panama 2026
          </strong>{" "}
          brings together cloud-native enthusiasts, developers, DevOps
          engineers, and IT leaders from across the region for 3 days of
          learning, networking, and collaboration. This community-driven event
          is part of the global KCD initiative supported by the{" "}
          <span className="text-primary font-medium">
            Cloud Native Computing Foundation (CNCF)
          </span>
          .
        </p>
        <p>
          Whether you are new to cloud-native technologies or a seasoned
          Kubernetes practitioner, KCD Panama offers something for everyone.
          From hands-on workshops and deep-dive talks to lightning sessions and
          hallway conversations, this is your chance to connect with the vibrant
          cloud-native community.
        </p>
      </div>
    </section>
  );
}
