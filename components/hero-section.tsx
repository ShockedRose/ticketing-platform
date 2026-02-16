import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="group relative aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/10 shadow-xl transition-all hover:border-primary/30 sm:aspect-[2/1]">
        <img
          src="/images/banner.webp"
          alt="KCD Panama 2026 conference venue with attendees"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge className="text-sm font-medium px-3 py-1">
            In-Person Event
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/90 text-foreground border-none text-sm font-medium px-3 py-1"
          >
            Cloud Native
          </Badge>
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
  );
}
