import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="group relative aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/10 shadow-xl transition-all hover:border-primary/30 sm:aspect-[2/1]">
        <img
          src="/images/banner.webp"
          alt="KCD Panama 2026 conference venue with attendees"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

      <div className="flex flex-col gap-4">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.1]">
          Kubernetes Community Days{" "}
          <span className="text-primary">Panama 2026</span>
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-base font-medium text-muted-foreground">
          <div className="flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1.5 text-secondary-foreground ">
            <Calendar className="h-5 w-5 text-secondary" />
            <span className="text-foreground">Apr 21-23, 2026</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-primary-foreground ">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-foreground">
              Ciudad del Saber, Panama City
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
