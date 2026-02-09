const SCHEDULE = [
  { time: "08:30 AM", title: "Registration & Breakfast", speaker: null, type: "break" },
  { time: "09:00 AM", title: "Opening Keynote: The State of Cloud Native in India", speaker: "Priya Sharma", type: "keynote" },
  { time: "09:45 AM", title: "Building Resilient Microservices with Kubernetes", speaker: "Rahul Mehta", type: "talk" },
  { time: "10:30 AM", title: "Coffee Break & Networking", speaker: null, type: "break" },
  { time: "11:00 AM", title: "Securing Your Kubernetes Clusters: Best Practices", speaker: "Ananya Gupta", type: "talk" },
  { time: "11:45 AM", title: "Observability at Scale with OpenTelemetry", speaker: "Vikram Singh", type: "talk" },
  { time: "12:30 PM", title: "Lunch Break", speaker: null, type: "break" },
  { time: "01:30 PM", title: "GitOps and the Future of Continuous Delivery", speaker: "Neha Kapoor", type: "talk" },
  { time: "02:15 PM", title: "Contributing to Kubernetes: A Beginner's Guide", speaker: "Arjun Patel", type: "talk" },
  { time: "03:00 PM", title: "Lightning Talks", speaker: "Community", type: "talk" },
  { time: "03:45 PM", title: "Panel Discussion: Cloud Native Careers", speaker: "All Speakers", type: "keynote" },
  { time: "04:30 PM", title: "Closing Remarks & Swag Giveaway", speaker: null, type: "break" },
]

export function ScheduleSection() {
  return (
    <section id="schedule" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground">Schedule</h2>
      <div className="mt-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" aria-hidden="true" />

        <div className="flex flex-col gap-1">
          {SCHEDULE.map((item, i) => (
            <div key={i} className="relative flex gap-4 py-3 pl-6">
              {/* Dot */}
              <div
                className={`absolute left-0 top-[18px] h-3.5 w-3.5 rounded-full border-2 ${
                  item.type === "keynote"
                    ? "border-primary bg-primary"
                    : item.type === "break"
                    ? "border-border bg-muted"
                    : "border-primary bg-card"
                }`}
                aria-hidden="true"
              />

              {/* Time */}
              <span className="w-20 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                {item.time}
              </span>

              {/* Content */}
              <div className="flex-1 rounded-lg border border-border bg-card p-3">
                <h3 className={`text-sm font-semibold ${item.type === "break" ? "text-muted-foreground" : "text-card-foreground"}`}>
                  {item.title}
                </h3>
                {item.speaker && (
                  <p className="mt-1 text-xs text-primary">{item.speaker}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
