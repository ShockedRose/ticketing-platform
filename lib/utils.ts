import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapStatusToUI(
  status: "AVAILABLE" | "SOLD_OUT" | "COMING_SOON"
): "available" | "sold-out" | "coming-soon" | "reserved" {
  switch (status) {
    case "AVAILABLE":
      return "available";
    case "SOLD_OUT":
      return "sold-out";
    case "COMING_SOON":
      return "coming-soon";
    default:
      return "available";
  }
}
