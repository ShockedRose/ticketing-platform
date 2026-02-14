export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground">About the Event</h2>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Kubernetes Community Days (KCD) Panama 2026 brings together cloud-native enthusiasts,
          developers, DevOps engineers, and IT leaders from across the region for 3 days of learning,
          networking, and collaboration. This community-driven event is part of the global KCD
          initiative supported by the Cloud Native Computing Foundation (CNCF).
        </p>
        <p>
          Whether you are new to cloud-native technologies or a seasoned Kubernetes practitioner,
          KCD Panama offers something for everyone. From hands-on workshops and deep-dive talks to
          lightning sessions and hallway conversations, this is your chance to connect with the
          vibrant cloud-native community.
        </p>
      </div>
    </section>
  )
}
