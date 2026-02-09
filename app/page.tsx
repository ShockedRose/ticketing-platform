import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TicketWidget } from "@/components/ticket-widget"
import { AboutSection } from "@/components/about-section"
import { SpeakersSection } from "@/components/speakers-section"
import { ScheduleSection } from "@/components/schedule-section"
import { SponsorsSection } from "@/components/sponsors-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Left Column - Content (65%) */}
          <div className="flex flex-col gap-12 lg:w-[65%]">
            <HeroSection />
            <AboutSection />
            <SpeakersSection />
            <ScheduleSection />
            <SponsorsSection />
          </div>

          {/* Right Column - Sticky Ticket Widget (35%) */}
          <aside className="lg:w-[35%]">
            <div className="lg:sticky lg:top-20">
              <TicketWidget />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
