import { useEffect, useState } from "react"


export function useCountdown(targetMs: number) {
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