import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section>
      {/* Banner Image */}
      <div className="relative h-56 w-full overflow-hidden rounded-xl sm:h-72">
        <img
          src="/images/banner.webp"
          alt="KCD Panama 2026 conference venue with attendees"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-primary text-primary-foreground">In-Person Event</Badge>
        </div>
      </div>

      {/* Event Info */}
      <div className="mt-6">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Kubernetes Community Days Panama 2026
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Apr 21-23, 2026
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            {"Ciudad del Saber, Panama City"}
          </span>
        </div>
      </div>
    </section>
  )
}
