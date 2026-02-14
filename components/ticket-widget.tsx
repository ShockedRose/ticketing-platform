"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Check, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCountdown } from "@/hooks/use-countdown"



const EVENT_DATE_MS = new Date("2026-04-21").getTime()
const FEATURES = ["Features", "To be", "Decided"]


export function TicketWidget() {
  const { days, hours, minutes } = useCountdown(EVENT_DATE_MS)
  const [quantities, setQuantities] = useState<Record<string, number>>({ early: 0, regular: 0 })

  function updateQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] || 0) + delta)),
    }))
  }

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

        <Button size="lg" className="w-full text-base font-semibold" asChild>
          <Link href="/register">Register Now</Link>
        </Button>

      </CardContent>
    </Card>
  )
}
