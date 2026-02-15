import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { TicketWidget } from "@/components/ticket-widget";
import { AboutSection } from "@/components/about-section";
import { SpeakersSection } from "@/components/speakers-section";
import { ScheduleSection } from "@/components/schedule-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="relative isolate">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-16 lg:col-span-8">
              <HeroSection />

              <div className="space-y-16">
                <AboutSection />
                <SpeakersSection />
                <ScheduleSection />
                <SponsorsSection />
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                <TicketWidget />

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold text-foreground">Need help?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contact us at{" "}
                    <a
                      href="mailto:organizers@kcdpanama.com"
                      className="font-medium text-primary hover:underline"
                    >
                      organizers@kcdpanama.com
                    </a>{" "}
                    for any questions about tickets or sponsorship.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
