"use server";

import { prisma } from "@/db/prisma";

export type TicketTier = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  discount: string | null;
  couponCode: string | null;
  price: string; // Decimal converted to string by Prisma extension
  currency: string;
  status: "AVAILABLE" | "SOLD_OUT" | "COMING_SOON";
  totalQuantity: number;
  soldQuantity: number;
  sortOrder: number;
  features: string[];
};

function getTicketTypeStatus(input: {
  isActive: boolean;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
  availableCount: number;
}): TicketTier["status"] {
  const now = new Date();

  if (!input.isActive) {
    return "COMING_SOON";
  }

  if (input.saleStartsAt && now < input.saleStartsAt) {
    return "COMING_SOON";
  }

  if (input.saleEndsAt && now > input.saleEndsAt) {
    return "SOLD_OUT";
  }

  if (input.availableCount <= 0) {
    return "SOLD_OUT";
  }

  return "AVAILABLE";
}

/**
 * Fetches all ticket tiers from the database, ordered by sortOrder.
 * Used to display available tickets on the registration page.
 */
export async function getTicketTiers(): Promise<TicketTier[]> {
  const ticketTypes = await prisma.ticketType.findMany({
    orderBy: { id: "asc" },
    include: {
      tickets: {
        select: { status: true },
      },
    },
  });

  return ticketTypes.map((ticketType, index) => {
    const totalQuantity = ticketType.tickets.length;
    const soldQuantity = ticketType.tickets.filter((ticket) => ticket.status === "sold").length;
    const availableCount = ticketType.tickets.filter((ticket) => ticket.status === "available").length;

    return {
      id: ticketType.id.toString(),
      name: ticketType.name,
      slug: ticketType.id.toString(),
      description: ticketType.description ?? "",
      tagline: null,
      discount: null,
      couponCode: null,
      price: ticketType.base_price.toString(),
      currency: ticketType.currency,
      status: getTicketTypeStatus({
        isActive: ticketType.is_active,
        saleStartsAt: ticketType.sale_starts_at,
        saleEndsAt: ticketType.sale_ends_at,
        availableCount,
      }),
      totalQuantity,
      soldQuantity,
      sortOrder: index,
      features: [],
    };
  });
}

/**
 * Fetches a single ticket tier by its slug.
 */
export async function getTicketTierBySlug(
  slug: string
): Promise<TicketTier | null> {
  const tier = (await getTicketTiers()).find((item) => item.slug === slug) ?? null;

  return tier;
}

/**
 * Fetches a single ticket tier by its ID.
 */
export async function getTicketTierById(
  id: string
): Promise<TicketTier | null> {
  const tier = (await getTicketTiers()).find((item) => item.id === id) ?? null;

  return tier;
}

/**
 * Fetches multiple ticket tiers by their slugs.
 * Useful for validating selected tickets before creating an order.
 */
export async function getTicketTiersBySlugs(
  slugs: string[]
): Promise<TicketTier[]> {
  const tiers = await getTicketTiers();
  return tiers.filter((tier) => slugs.includes(tier.slug));
}

/**
 * Checks if a ticket tier is available for purchase.
 */
export async function isTicketTierAvailable(slug: string): Promise<boolean> {
  const ticketTypeId = Number(slug);
  if (!Number.isInteger(ticketTypeId)) {
    return false;
  }

  const ticketType = await prisma.ticketType.findUnique({
    where: { id: BigInt(ticketTypeId) },
    select: {
      is_active: true,
      sale_starts_at: true,
      sale_ends_at: true,
      tickets: {
        where: { status: "available" },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!ticketType) {
    return false;
  }

  return (
    getTicketTypeStatus({
      isActive: ticketType.is_active,
      saleStartsAt: ticketType.sale_starts_at,
      saleEndsAt: ticketType.sale_ends_at,
      availableCount: ticketType.tickets.length,
    }) === "AVAILABLE"
  );
}
