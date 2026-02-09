"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Check, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const distance = targetMs - Date.now()
    if (distance < 0) return { days: 0, hours: 0, minutes: 0 }
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    }
  })

  useEffect(() => {
    function calculate() {
      const distance = targetMs - Date.now()
      if (distance < 0) return { days: 0, hours: 0, minutes: 0 }
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      }
    }
    const interval = setInterval(() => setTimeLeft(calculate()), 60000)
    return () => clearInterval(interval)
  }, [targetMs])

  return timeLeft
}

const EVENT_DATE_MS = new Date("2026-02-21").getTime()

const TICKETS = [
  { id: "early", name: "Early Bird Pass", price: 500, originalPrice: 1000 },
  { id: "regular", name: "Regular Pass", price: 1000, originalPrice: null },
]

const FEATURES = ["Access to all talks", "Lunch included", "Swag Kit"]

export function TicketWidget() {
  const { days, hours, minutes } = useCountdown(EVENT_DATE_MS)
  const [quantities, setQuantities] = useState<Record<string, number>>({ early: 0, regular: 0 })

  function updateQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] || 0) + delta)),
    }))
  }

  const total = TICKETS.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0)

  return (
    <Card className="shadow-lg border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-card-foreground">Buy Tickets</CardTitle>
        {/* Countdown */}
        <div className="mt-3 flex items-center gap-3">
          {[
            { label: "Days", value: days },
            { label: "Hrs", value: hours },
            { label: "Mins", value: minutes },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center rounded-lg bg-secondary px-3 py-2">
              <span className="text-xl font-bold tabular-nums text-foreground">{String(item.value).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {TICKETS.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-lg border border-border bg-secondary/50 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{ticket.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {"₹"}{ticket.price.toLocaleString("en-IN")}
                  </span>
                  {ticket.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {"₹"}{ticket.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
                <button
                  type="button"
                  onClick={() => updateQty(ticket.id, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`Decrease ${ticket.name} quantity`}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold tabular-nums text-foreground">
                  {quantities[ticket.id]}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(ticket.id, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`Increase ${ticket.name} quantity`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Features */}
        <ul className="flex flex-col gap-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Total & CTA */}
        {total > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-secondary/80 px-4 py-2">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">{"₹"}{total.toLocaleString("en-IN")}</span>
          </div>
        )}

        <Button size="lg" className="w-full text-base font-semibold" asChild>
          <Link href="/register">Register Now</Link>
        </Button>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{"350+ Attendees expected"}</span>
        </div>
      </CardContent>
    </Card>
  )
}
