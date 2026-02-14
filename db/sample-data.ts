import { hashSync } from "bcrypt-ts-edge";
import type { TicketTierStatus } from "@prisma/client";

const TICKET_FEATURES = [
  "Access to all talks and tracks (context switching encouraged)",
  "Sponsor booths (demos, swag, and jobs)",
  "Event goodies you'll benchmark against previous conferences",
  "Meals and cafe access so your brain doesn't hit OOM",
  "Networking with speakers and attendees (real-time, low-latency conversations)",
  "Access to job openings, in case your current role is due for a rolling update",
];

export const sampleTicketTiers = [
  {
    name: "Alpha",
    slug: "alpha",
    description:
      'This is the <strong>alpha release</strong> of KCD Panama tickets, limited, cheapest, and first to land. You get full access to the event, just at the lowest price, because you showed up early.',
    tagline: "Republic Day Special",
    discount: null,
    couponCode: null,
    price: 2000,
    status: "SOLD_OUT" as TicketTierStatus,
    totalQuantity: 100,
    soldQuantity: 100,
    sortOrder: 0,
    features: TICKET_FEATURES,
  },
  {
    name: "Beta",
    slug: "beta",
    description:
      'This is the <strong>beta release</strong>, the "I waited just enough" tier. The smart money tier: not first, not last, no regrets.',
    tagline: null,
    discount: null,
    couponCode: null,
    price: 2500,
    status: "AVAILABLE" as TicketTierStatus,
    totalQuantity: 200,
    soldQuantity: 0,
    sortOrder: 1,
    features: TICKET_FEATURES,
  },
  {
    name: "GA",
    slug: "ga",
    description:
      'This is the <strong>GA release</strong> of the ticket - The price and time reach maturity. Grab it or lose it!',
    tagline: null,
    discount: null,
    couponCode: null,
    price: 3000,
    status: "COMING_SOON" as TicketTierStatus,
    totalQuantity: 300,
    soldQuantity: 0,
    sortOrder: 2,
    features: TICKET_FEATURES,
  },
];

export const sampleDiscountCodes = [
  {
    code: "REPUBLIC26",
    description: "Republic Day Special - 26% off Alpha tier",
    discountType: "PERCENTAGE" as const,
    discountValue: 26,
    maxUses: 100,
    isActive: true,
  },
];

export const sampleUsers = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: hashSync("123456", 10),
    role: "ADMIN" as const,
  },
  {
    name: "Staff",
    email: "user@example.com",
    password: hashSync("123456", 10),
    role: "USER" as const,
  },
];
