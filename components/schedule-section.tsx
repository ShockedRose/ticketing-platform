const SCHEDULE = [
  {
    time: "08:30 AM",
    title: "Registration & Breakfast",
    speaker: null,
    type: "break",
  },
  {
    time: "09:00 AM",
    title: "Opening Keynote: The State of Cloud Native in Panama",
    speaker: "Priya Sharma",
    type: "keynote",
  },
  {
    time: "09:45 AM",
    title: "Building Resilient Microservices with Kubernetes",
    speaker: "Rahul Mehta",
    type: "talk",
  },
  {
    time: "10:30 AM",
    title: "Coffee Break & Networking",
    speaker: null,
    type: "break",
  },
  {
    time: "11:00 AM",
    title: "Securing Your Kubernetes Clusters: Best Practices",
    speaker: "Ananya Gupta",
    type: "talk",
  },
  {
    time: "11:45 AM",
    title: "Observability at Scale with OpenTelemetry",
    speaker: "Vikram Singh",
    type: "talk",
  },
  { time: "12:30 PM", title: "Lunch Break", speaker: null, type: "break" },
  {
    time: "01:30 PM",
    title: "GitOps and the Future of Continuous Delivery",
    speaker: "Neha Kapoor",
    type: "talk",
  },
  {
    time: "02:15 PM",
    title: "Contributing to Kubernetes: A Beginner's Guide",
    speaker: "Arjun Patel",
    type: "talk",
  },
  {
    time: "03:00 PM",
    title: "Lightning Talks",
    speaker: "Community",
    type: "talk",
  },
  {
    time: "03:45 PM",
    title: "Panel Discussion: Cloud Native Careers",
    speaker: "All Speakers",
    type: "keynote",
  },
  {
    time: "04:30 PM",
    title: "Closing Remarks & Swag Giveaway",
    speaker: null,
    type: "break",
  },
];

export function ScheduleSection() {
  return (
    <section id="schedule" className="scroll-mt-20">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Schedule
      </h2>
      <div className="mt-8 relative">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-4">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="relative flex gap-6 pl-6 group">
              {/* Dot */}
              <div
                className={`absolute left-0 top-[18px] h-4 w-4 rounded-full border-4 shadow-sm transition-colors ${
                  item.type === "keynote"
                    ? "border-primary bg-background ring-2 ring-primary/20"
                    : item.type === "break"
                      ? "border-muted-foreground/30 bg-background"
                      : "border-secondary bg-background ring-2 ring-secondary/20"
                }`}
                aria-hidden="true"
              />

              <span className="w-20 shrink-0 pt-3 text-sm font-bold tabular-nums text-muted-foreground/80 group-hover:text-primary transition-colors">
                {item.time}
              </span>

              <div
                className={`flex-1 rounded-xl border p-4 transition-all hover:shadow-md ${
                  item.type === "break"
                    ? "bg-muted/30 border-transparent"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <h3
                  className={`text-base font-semibold ${item.type === "break" ? "text-muted-foreground" : "text-foreground"}`}
                >
                  {item.title}
                </h3>
                {item.speaker && (
                  <p className="mt-1 text-sm font-medium text-primary">
                    {item.speaker}
                  </p>
                )}
                {item.type === "keynote" && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Keynote
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
