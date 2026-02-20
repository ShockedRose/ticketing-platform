import { Ticket, Users, CreditCard } from "lucide-react";

export const STEPS = [
  { id: "tickets", label: "Pick Tickets", icon: Ticket },
  { id: "attendee", label: "Attendee\nDetails", icon: Users },
  { id: "payment", label: "Payment", icon: CreditCard },
];

export const COUNTRIES = [
  "Panama",
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
];

export const INDUSTRIES = [
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
];

export const ORG_TYPES = [
  "Uses open source software",
  "Contributes to open source projects",
  "Sponsors open source projects",
  "Is an open source project",
  "Does not use open source",
  "Other",
];

export const MAX_TICKETS_PER_BUYER = 5;
