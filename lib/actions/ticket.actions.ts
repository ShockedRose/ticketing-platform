"use server";

import { prisma } from "@/db/prisma";
import type { TicketTierStatus } from "@prisma/client";

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
  status: TicketTierStatus;
  totalQuantity: number;
  soldQuantity: number;
  sortOrder: number;
  features: string[];
};

/**
 * Fetches all ticket tiers from the database, ordered by sortOrder.
 * Used to display available tickets on the registration page.
 */
export async function getTicketTiers(): Promise<TicketTier[]> {
  const tiers = await prisma.ticketTier.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return tiers;
}

/**
 * Fetches a single ticket tier by its slug.
 */
export async function getTicketTierBySlug(
  slug: string
): Promise<TicketTier | null> {
  const tier = await prisma.ticketTier.findUnique({
    where: { slug },
  });

  return tier;
}

/**
 * Fetches a single ticket tier by its ID.
 */
export async function getTicketTierById(
  id: string
): Promise<TicketTier | null> {
  const tier = await prisma.ticketTier.findUnique({
    where: { id },
  });

  return tier;
}

/**
 * Fetches multiple ticket tiers by their slugs.
 * Useful for validating selected tickets before creating an order.
 */
export async function getTicketTiersBySlugs(
  slugs: string[]
): Promise<TicketTier[]> {
  const tiers = await prisma.ticketTier.findMany({
    where: {
      slug: { in: slugs },
    },
    orderBy: { sortOrder: "asc" },
  });

  return tiers;
}

/**
 * Checks if a ticket tier is available for purchase.
 */
export async function isTicketTierAvailable(slug: string): Promise<boolean> {
  const tier = await prisma.ticketTier.findUnique({
    where: { slug },
    select: { status: true, totalQuantity: true, soldQuantity: true },
  });

  if (!tier) return false;

  return (
    tier.status === "AVAILABLE" && tier.soldQuantity < tier.totalQuantity
  );
}
