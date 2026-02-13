import { TicketTierStatus } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapStatusToUI(
  status: TicketTierStatus
): "available" | "sold-out" | "coming-soon" {
  switch (status) {
    case "AVAILABLE":
      return "available";
    case "SOLD_OUT":
      return "sold-out";
    case "COMING_SOON":
      return "coming-soon";
    default:
      return "coming-soon";
  }
}
