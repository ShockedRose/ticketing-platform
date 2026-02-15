import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const SPEAKERS = [
  {
    name: "Miguel Gonzalez",
    title: "Sr. Platform Engineer",
    company: "Google Cloud",
    initials: "PS",
  },
  {
    name: "Jesús Rodriguez",
    title: "DevOps Lead",
    company: "Razorpay",
    initials: "RM",
  },
  {
    name: "Gabriel Dabila",
    title: "Cloud Architect",
    company: "Microsoft",
    initials: "AG",
  },
  {
    name: "José Marín",
    title: "SRE Manager",
    company: "Flipkart",
    initials: "VS",
  },
];

export function SpeakersSection() {
  return (
    <section id="speakers" className="scroll-mt-20">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Speakers
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SPEAKERS.map((speaker) => (
          <Card
            key={speaker.name}
            className="group overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-md"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <Avatar className="h-16 w-16 border-2 border-background ring-2 ring-muted transition-all group-hover:ring-primary">
                <AvatarFallback className="bg-secondary/10 text-secondary font-bold text-lg">
                  {speaker.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {speaker.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {speaker.title}
                </p>
                <p className="text-xs font-semibold text-primary mt-1 truncate">
                  {speaker.company}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
