"use client";

import { Check } from "lucide-react";
import { STEPS } from "./constants";

export function StepSidebar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center gap-0">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        const Icon = step.icon;

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
              {isPast ? (
                <Check className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
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
        );
      })}
    </div>
  );
}
