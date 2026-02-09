"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ArrowLeft,
  ShoppingCart,
  Ticket,
  Users,
  CreditCard,
  Check,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PAGUELO_FACIL_URL = "https://checkout-demo.paguelofacil.com/kcd-test/123456"

const TICKET_TIERS = [
  {
    id: "alpha",
    name: "Alpha",
    tagline: "Republic Day Special",
    discount: "26% OFF",
    couponCode: "REPUBLIC26",
    description:
      'This is the <strong>alpha release</strong> of KCD Delhi tickets, limited, cheapest, and first to land. You get full access to the event, just at the lowest price, because you showed up early.',
    price: 2000,
    status: "sold-out" as const,
  },
  {
    id: "beta",
    name: "Beta",
    tagline: null,
    discount: null,
    couponCode: null,
    description:
      'This is the <strong>beta release</strong>, the "I waited just enough" tier. The smart money tier: not first, not last, no regrets.',
    price: 2500,
    status: "available" as const,
  },
  {
    id: "ga",
    name: "GA",
    tagline: null,
    discount: null,
    couponCode: null,
    description:
      'This is the <strong>GA release</strong> of the ticket - The price and time reach maturity. Grab it or lose it!',
    price: 3000,
    status: "coming-soon" as const,
  },
]

const TICKET_FEATURES = [
  "Access to all talks and tracks (context switching encouraged)",
  "Sponsor booths (demos, swag, and jobs)",
  "Event goodies you'll benchmark against previous conferences",
  "Meals and cafe access so your brain doesn't hit OOM",
  "Networking with speakers and attendees (real-time, low-latency conversations)",
  "Access to job openings, in case your current role is due for a rolling update",
]

const STEPS = [
  { id: "tickets", label: "Pick Tickets", icon: Ticket },
  { id: "attendee", label: "Attendee\nDetails", icon: Users },
  { id: "payment", label: "Payment", icon: CreditCard },
]

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Singapore",
  "Japan",
  "France",
  "Netherlands",
  "Brazil",
  "South Korea",
  "Sweden",
  "Israel",
  "UAE",
  "Other",
]

const INDUSTRIES = [
  "Information Technology",
  "Finance / Banking",
  "Healthcare",
  "E-Commerce / Retail",
  "Education",
  "Telecommunications",
  "Government",
  "Media / Entertainment",
  "Manufacturing",
  "Consulting",
  "Startup",
  "Other",
]

const ORG_TYPES = [
  "Uses open source software",
  "Contributes to open source projects",
  "Sponsors open source projects",
  "Is an open source project",
  "Does not use open source",
  "Other",
]

type SelectedTickets = Record<string, number>

interface AttendeeData {
  name: string
  email: string
  country: string
  jobTitle: string
  company: string
  industry: string
  orgType: string
  cncfConsent: boolean
  whatsappUpdates: boolean
}

/* ------------------------------------------------------------------ */
/*  Session countdown (10 min)                                         */
/* ------------------------------------------------------------------ */

function useSessionTimer(startOnStep: number, currentStep: number) {
  const [secondsLeft, setSecondsLeft] = useState(600) // 10 minutes
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (currentStep >= startOnStep && !started) {
      setStarted(true)
    }
  }, [currentStep, startOnStep, started])

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [started])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  return { minutes, seconds, expired: secondsLeft <= 0, started }
}

/* ------------------------------------------------------------------ */
/*  Step Sidebar                                                       */
/* ------------------------------------------------------------------ */

function StepSidebar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center gap-0">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep
        const isPast = index < currentStep
        const Icon = step.icon

        return (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isPast
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              {isPast ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <span
              className={`mt-1.5 max-w-[60px] text-center text-xs font-medium leading-tight ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`mb-2 mt-2 h-16 w-0.5 ${
                  isPast ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Ticket Card                                                        */
/* ------------------------------------------------------------------ */

function TicketCard({
  tier,
  onAdd,
  isAdded,
}: {
  tier: (typeof TICKET_TIERS)[number]
  onAdd: () => void
  isAdded: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
        {tier.tagline && (
          <p className="mt-0.5 text-sm font-semibold text-foreground">{tier.tagline}</p>
        )}
        {tier.discount && (
          <p className="text-sm font-semibold text-primary">{tier.discount}</p>
        )}
        {tier.couponCode && (
          <p className="text-sm text-muted-foreground">
            {"USE Coupon Code: "}
            <span className="font-medium text-foreground">{tier.couponCode}</span>
          </p>
        )}
      </div>

      <p
        className="text-sm leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: tier.description }}
      />

      <div className="mt-4">
        <p className="text-sm font-medium text-foreground">{"Your ticket includes:"}</p>
        <ul className="mt-2 flex flex-col gap-1.5 pl-5">
          {TICKET_FEATURES.map((feature) => (
            <li key={feature} className="list-disc text-sm text-muted-foreground">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-sm italic text-muted-foreground">
        {"Check the website for the latest updates; the roadmap may change, as always."}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">
          {"₹ "}
          {tier.price.toLocaleString("en-IN")}
        </span>

        {tier.status === "sold-out" && (
          <Button variant="secondary" disabled className="min-w-[100px]">
            Sold Out
          </Button>
        )}
        {tier.status === "available" && (
          <Button
            variant={isAdded ? "secondary" : "outline"}
            onClick={onAdd}
            className="min-w-[100px]"
          >
            {isAdded ? "Added" : "Add"}
          </Button>
        )}
        {tier.status === "coming-soon" && (
          <Button variant="secondary" disabled className="min-w-[100px]">
            Coming Soon
          </Button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Cart / Summary Sidebar                                             */
/* ------------------------------------------------------------------ */

function CartSidebar({
  selectedTickets,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  onProceed,
  proceedLabel,
  showSummary,
}: {
  selectedTickets: SelectedTickets
  discountCode: string
  onDiscountCodeChange: (code: string) => void
  onApplyDiscount: () => void
  onProceed: () => void
  proceedLabel: string
  showSummary: boolean
}) {
  const hasSelection = Object.values(selectedTickets).some((qty) => qty > 0)
  const subTotal = TICKET_TIERS.reduce(
    (sum, tier) => sum + tier.price * (selectedTickets[tier.id] || 0),
    0
  )

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {showSummary && hasSelection ? (
        <div className="w-full">
          <p className="text-base font-bold text-foreground">{"Ticket Summary"}</p>
          <div className="mt-3 flex flex-col gap-2">
            {TICKET_TIERS.filter((t) => (selectedTickets[t.id] || 0) > 0).map(
              (tier) => (
                <div key={tier.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {tier.name}
                    <span className="ml-2 text-xs text-muted-foreground/70">
                      {"x "}
                      {selectedTickets[tier.id]}
                    </span>
                  </span>
                  <span className="font-medium text-foreground">
                    {"₹ "}
                    {(tier.price * (selectedTickets[tier.id] || 0)).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              )
            )}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{"Sub Total"}</span>
              <span>
                {"₹ "}
                {subTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-foreground">{"Total"}</span>
                <span className="text-foreground">
                  {"₹ "}
                  {subTotal.toLocaleString("en-IN")}
                  {"*"}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-destructive">
              {"Processing Fee will be added on selecting payment method*"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {"You haven't selected any ticket. Select a ticket to see the ticket summary."}
          </p>
        </div>
      )}

      {/* Discount Code */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-foreground">{"Apply Discount Code"}</p>
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Enter Code"
            value={discountCode}
            onChange={(e) => onDiscountCodeChange(e.target.value)}
            className="bg-card"
          />
          <Button
            variant="outline"
            onClick={onApplyDiscount}
            className="shrink-0 bg-transparent"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Proceed / Checkout Button */}
      <Button
        className="mt-4 w-full"
        size="lg"
        onClick={onProceed}
        disabled={!hasSelection}
      >
        {proceedLabel}
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Attendee Details Step                                               */
/* ------------------------------------------------------------------ */

function AttendeeDetailsStep({
  attendee,
  onChange,
  ticketName,
}: {
  attendee: AttendeeData
  onChange: (data: AttendeeData) => void
  ticketName: string
}) {
  function update(field: keyof AttendeeData, value: string | boolean) {
    onChange({ ...attendee, [field]: value })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          {ticketName}
          {" (1 of 1)"}
        </h3>
      </div>

      {/* Form */}
      <div className="mt-6 flex flex-col gap-5">
        {/* Name */}
        <div>
          <label htmlFor="att-name" className="mb-1.5 block text-sm font-medium text-foreground">
            {"Name*"}
          </label>
          <Input
            id="att-name"
            value={attendee.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="att-email" className="mb-1.5 block text-sm font-medium text-foreground">
            {"Email Address*"}
          </label>
          <Input
            id="att-email"
            type="email"
            value={attendee.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{"Country*"}</label>
          <Select value={attendee.country} onValueChange={(v) => update("country", v)}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="att-job" className="mb-1.5 block text-sm font-medium text-foreground">
            {"Job Title*"}
          </label>
          <Input
            id="att-job"
            value={attendee.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="att-company" className="mb-1.5 block text-sm font-medium text-foreground">
            {"Current Company/Organization/University*"}
          </label>
          <Input
            id="att-company"
            value={attendee.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        {/* Industry */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{"Industry*"}</label>
          <Select value={attendee.industry} onValueChange={(v) => update("industry", v)}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organization Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {"I represent an organization that:*"}
          </label>
          <Select value={attendee.orgType} onValueChange={(v) => update("orgType", v)}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {ORG_TYPES.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* CNCF Communications */}
        <div className="flex gap-3">
          <Checkbox
            id="cncf-consent"
            checked={attendee.cncfConsent}
            onCheckedChange={(c) => update("cncfConsent", !!c)}
            className="mt-0.5 shrink-0"
          />
          <label htmlFor="cncf-consent" className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{"CNCF Communications"}</span>
            <br />
            {
              "In addition, if you check the check box to the left of this text, you further authorize KCD NAME and the Cloud Native Computing Foundation to contact you via email regarding other events and open source projects from time to time. You can unsubscribe from these additional email communications at any time by following the 'unsubscribe' instructions included within such communications or by sending an unsubscribe request to privacy@linuxfoundation.org."
            }
            <br />
            {
              "By submitting this registration you consent to The Cloud Native Computing Foundation's communication with you with respect to the event or services to which this registration pertains.*"
            }
          </label>
        </div>

        {/* WhatsApp updates */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="whatsapp-updates"
            checked={attendee.whatsappUpdates}
            onCheckedChange={(c) => update("whatsappUpdates", !!c)}
          />
          <label htmlFor="whatsapp-updates" className="text-sm text-muted-foreground">
            {"I would like to receive ticket and event updates over WhatsApp"}
          </label>
        </div>

        {/* Buyer Details toggle */}
        <div className="rounded-md border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{"Buyer Details"}</span>
            {" (Invoice/Receipt will be sent to the below details)"}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Payment Step                                                       */
/* ------------------------------------------------------------------ */

function PaymentStep({
  onBack,
  selectedTickets,
}: {
  onBack: () => void
  selectedTickets: SelectedTickets
}) {
  const total = TICKET_TIERS.reduce(
    (sum, tier) => sum + tier.price * (selectedTickets[tier.id] || 0),
    0
  )

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <CreditCard className="mx-auto h-14 w-14 text-primary" />
      <h3 className="mt-4 text-xl font-bold text-foreground">{"Complete Your Payment"}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {"You will be redirected to PagueloFacil's secure checkout to complete your payment of "}
        <span className="font-semibold text-foreground">
          {"₹ "}
          {total.toLocaleString("en-IN")}
        </span>
        {"."}
      </p>

      <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
        <Button asChild size="lg" className="gap-2">
          <a href={PAGUELO_FACIL_URL} target="_blank" rel="noopener noreferrer">
            {"Pay with PagueloFacil"}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Registration Flow                                             */
/* ------------------------------------------------------------------ */

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({})
  const [discountCode, setDiscountCode] = useState("")
  const [attendee, setAttendee] = useState<AttendeeData>({
    name: "",
    email: "",
    country: "",
    jobTitle: "",
    company: "",
    industry: "",
    orgType: "",
    cncfConsent: false,
    whatsappUpdates: false,
  })

  const timer = useSessionTimer(1, currentStep)

  function toggleTicket(id: string) {
    setSelectedTickets((prev) => ({
      ...prev,
      [id]: prev[id] ? 0 : 1,
    }))
  }

  const hasSelection = Object.values(selectedTickets).some((q) => q > 0)

  const selectedTierName =
    TICKET_TIERS.find((t) => (selectedTickets[t.id] || 0) > 0)?.name ?? ""

  const isAttendeeValid =
    attendee.name.trim() !== "" &&
    attendee.email.trim() !== "" &&
    attendee.country !== "" &&
    attendee.jobTitle.trim() !== "" &&
    attendee.company.trim() !== "" &&
    attendee.industry !== "" &&
    attendee.orgType !== ""

  const handleProceed = useCallback(() => {
    if (currentStep === 0 && hasSelection) {
      setCurrentStep(1)
    } else if (currentStep === 1 && isAttendeeValid) {
      setCurrentStep(2)
    }
  }, [currentStep, hasSelection, isAttendeeValid])

  const proceedLabel =
    currentStep === 0 ? "Proceed" : currentStep === 1 ? "Checkout" : "Pay Now"

  const total = TICKET_TIERS.reduce(
    (sum, tier) => sum + tier.price * (selectedTickets[tier.id] || 0),
    0
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              aria-label="Back to event page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">{"KCD Delhi 2026"}</h1>
              <p className="text-sm text-muted-foreground">
                {"Feb 21st, 2026 at 8:00 AM (GMT+05:30) to Feb 21st, 2026 at 6:00 PM (GMT+05:30)"}
              </p>
            </div>
          </div>

          {/* Session Timer */}
          {timer.started && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                timer.minutes < 2
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>
                {"Time Left: "}
                {timer.minutes}
                {":"}
                {String(timer.seconds).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex gap-6 lg:gap-10">
          {/* Left: Step Indicator */}
          <div className="hidden shrink-0 md:block">
            <StepSidebar currentStep={currentStep} />
          </div>

          {/* Center: Main Content */}
          <div className="min-w-0 flex-1">
            {/* Mobile Step Indicator */}
            <div className="mb-6 flex items-center justify-center gap-4 md:hidden">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep
                const isPast = index < currentStep
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isPast
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isPast ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 w-6 ${isPast ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step: Pick Tickets */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6">
                {TICKET_TIERS.map((tier) => (
                  <TicketCard
                    key={tier.id}
                    tier={tier}
                    isAdded={(selectedTickets[tier.id] || 0) > 0}
                    onAdd={() => toggleTicket(tier.id)}
                  />
                ))}
              </div>
            )}

            {/* Step: Attendee Details */}
            {currentStep === 1 && (
              <AttendeeDetailsStep
                attendee={attendee}
                onChange={setAttendee}
                ticketName={selectedTierName}
              />
            )}

            {/* Step: Payment */}
            {currentStep === 2 && (
              <PaymentStep
                onBack={() => setCurrentStep(1)}
                selectedTickets={selectedTickets}
              />
            )}
          </div>

          {/* Right: Cart Sidebar */}
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-8">
              <CartSidebar
                selectedTickets={selectedTickets}
                discountCode={discountCode}
                onDiscountCodeChange={setDiscountCode}
                onApplyDiscount={() => {}}
                onProceed={
                  currentStep === 2
                    ? () => window.open(PAGUELO_FACIL_URL, "_blank")
                    : handleProceed
                }
                proceedLabel={proceedLabel}
                showSummary={currentStep >= 1}
              />
            </div>
          </div>
        </div>

        {/* Mobile Cart Sticky Footer */}
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              {hasSelection ? (
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {"₹ "}
                    {total.toLocaleString("en-IN")}
                  </p>
                  {currentStep >= 1 && (
                    <p className="text-xs text-muted-foreground">
                      {"+ processing fee"}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{"No tickets selected"}</p>
              )}
            </div>
            {currentStep === 2 ? (
              <Button size="sm" asChild>
                <a href={PAGUELO_FACIL_URL} target="_blank" rel="noopener noreferrer">
                  {"Pay Now"}
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={
                  currentStep === 0 ? !hasSelection : !isAttendeeValid
                }
                onClick={handleProceed}
              >
                {currentStep === 0 ? "Proceed" : "Checkout"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">{"Powered By"}</p>
        <p className="text-sm font-bold text-foreground">{"KONFHUB"}</p>
      </div>
    </div>
  )
}
