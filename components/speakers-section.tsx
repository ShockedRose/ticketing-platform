import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const SPEAKERS = [
  { name: "Priya Sharma", title: "Sr. Platform Engineer", company: "Google Cloud", initials: "PS" },
  { name: "Rahul Mehta", title: "DevOps Lead", company: "Razorpay", initials: "RM" },
  { name: "Ananya Gupta", title: "Cloud Architect", company: "Microsoft", initials: "AG" },
  { name: "Vikram Singh", title: "SRE Manager", company: "Flipkart", initials: "VS" },
  { name: "Neha Kapoor", title: "CNCF Ambassador", company: "Red Hat", initials: "NK" },
  { name: "Arjun Patel", title: "K8s Contributor", company: "VMware", initials: "AP" },
]

export function SpeakersSection() {
  return (
    <section id="speakers" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground">Speakers</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPEAKERS.map((speaker) => (
          <Card key={speaker.name} className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar className="h-14 w-14 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                  {speaker.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground truncate">{speaker.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{speaker.title}</p>
                <p className="text-xs font-medium text-primary truncate">{speaker.company}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
