"use server";

import { prisma } from "@/db/prisma";
import type { DiscountType } from "@prisma/client";

export type DiscountValidationResult = {
  valid: boolean;
  error?: string;
  discount?: {
    code: string;
    discountType: DiscountType;
    discountValue: string;
    description: string | null;
    ticketTierRestriction?: string; // tier slug if restricted
  };
};

export type DiscountCalculationResult = {
  subtotal: number;
  discountAmount: number;
  total: number;
  discountApplied: boolean;
  discountCode?: string;
};

/**
 * Validates a discount code without applying it.
 * Checks if the code exists, is active, within date range, and not exhausted.
 * Optionally validates against specific ticket tier slugs.
 */
export async function validateDiscountCode(
  code: string,
  ticketSlugs?: string[]
): Promise<DiscountValidationResult> {
  if (!code || code.trim() === "") {
    return { valid: false, error: "Please enter a discount code" };
  }

  const discountCode = await prisma.discountCode.findUnique({
    where: { code: code.toUpperCase().trim() },
    include: {
      ticketTier: {
        select: { slug: true, name: true },
      },
    },
  });

  if (!discountCode) {
    return { valid: false, error: "Invalid discount code" };
  }

  if (!discountCode.isActive) {
    return { valid: false, error: "This discount code is no longer active" };
  }

  // Check max uses
  if (
    discountCode.maxUses !== null &&
    discountCode.currentUses >= discountCode.maxUses
  ) {
    return {
      valid: false,
      error: "This discount code has reached its maximum uses",
    };
  }

  // Check date validity
  const now = new Date();
  if (discountCode.validFrom && now < discountCode.validFrom) {
    return { valid: false, error: "This discount code is not yet valid" };
  }
  if (discountCode.validUntil && now > discountCode.validUntil) {
    return { valid: false, error: "This discount code has expired" };
  }

  // Check tier restriction
  if (discountCode.ticketTierId && ticketSlugs && ticketSlugs.length > 0) {
    const tierSlug = discountCode.ticketTier?.slug;
    if (tierSlug && !ticketSlugs.includes(tierSlug)) {
      return {
        valid: false,
        error: `This discount code is only valid for ${discountCode.ticketTier?.name} tickets`,
      };
    }
  }

  return {
    valid: true,
    discount: {
      code: discountCode.code,
      discountType: discountCode.discountType,
      discountValue: discountCode.discountValue.toString(),
      description: discountCode.description,
      ticketTierRestriction: discountCode.ticketTier?.slug,
    },
  };
}

/**
 * Calculates the discount amount for a given subtotal and discount code.
 */
export async function calculateDiscount(
  subtotal: number,
  discountCode?: string
): Promise<DiscountCalculationResult> {
  if (!discountCode) {
    return {
      subtotal,
      discountAmount: 0,
      total: subtotal,
      discountApplied: false,
    };
  }

  const discount = await prisma.discountCode.findUnique({
    where: { code: discountCode.toUpperCase().trim() },
  });

  if (!discount || !discount.isActive) {
    return {
      subtotal,
      discountAmount: 0,
      total: subtotal,
      discountApplied: false,
    };
  }

  let discountAmount = 0;
  const discountValue = Number(discount.discountValue);

  if (discount.discountType === "PERCENTAGE") {
    discountAmount = (subtotal * discountValue) / 100;
  } else {
    // FIXED
    discountAmount = Math.min(discountValue, subtotal);
  }

  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    discountApplied: true,
    discountCode: discount.code,
  };
}

/**
 * Fetches a discount code by its code string.
 */
export async function getDiscountCodeByCode(code: string) {
  return prisma.discountCode.findUnique({
    where: { code: code.toUpperCase().trim() },
    include: {
      ticketTier: {
        select: { slug: true, name: true },
      },
    },
  });
}
