"use client";

import { useState, useEffect } from "react";

export function useSessionTimer(startOnStep: number, currentStep: number) {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (currentStep >= startOnStep && !started) {
      setStarted(true);
    }
  }, [currentStep, startOnStep, started]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return { minutes, seconds, expired: secondsLeft <= 0, started };
}
