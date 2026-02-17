"use server";

import { prisma } from "@/db/prisma";

type DiscountType = "PERCENTAGE" | "FIXED";

export type DiscountValidationResult = {
  valid: boolean;
  error?: string;
  discount?: {
    code: string;
    discountType: DiscountType;
    discountValue: string;
    description: string | null;
  };
};

export type DiscountCalculationResult = {
  subtotal: number;
  discountAmount: number;
  total: number;
  discountApplied: boolean;
  discountCode?: string;
};

function normalizeDiscountType(rawType: string): DiscountType {
  return rawType.toUpperCase() === "PERCENTAGE" ? "PERCENTAGE" : "FIXED";
}

/**
 * Validates a promo code without applying it.
 */
export async function validateDiscountCode(
  code: string,
  _ticketTypeIds?: string[]
): Promise<DiscountValidationResult> {
  if (!code || code.trim() === "") {
    return { valid: false, error: "Please enter a discount code" };
  }

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!promoCode) {
    return { valid: false, error: "Invalid discount code" };
  }

  if (!promoCode.is_active) {
    return { valid: false, error: "This discount code is no longer active" };
  }

  if (
    promoCode.max_redemptions !== null &&
    promoCode.redemptions_count >= promoCode.max_redemptions
  ) {
    return {
      valid: false,
      error: "This discount code has reached its maximum redemptions",
    };
  }

  const now = new Date();
  if (promoCode.starts_at && now < promoCode.starts_at) {
    return { valid: false, error: "This discount code is not yet valid" };
  }
  if (promoCode.ends_at && now > promoCode.ends_at) {
    return { valid: false, error: "This discount code has expired" };
  }

  return {
    valid: true,
    discount: {
      code: promoCode.code,
      discountType: normalizeDiscountType(promoCode.discount_type),
      discountValue: promoCode.discount_value.toString(),
      description: null,
    },
  };
}

/**
 * Calculates the discount amount for a given subtotal and promo code.
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

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: discountCode.toUpperCase().trim() },
  });

  if (!promoCode || !promoCode.is_active) {
    return {
      subtotal,
      discountAmount: 0,
      total: subtotal,
      discountApplied: false,
    };
  }

  const discountValue = Number(promoCode.discount_value);
  const discountType = normalizeDiscountType(promoCode.discount_type);
  const discountAmount =
    discountType === "PERCENTAGE"
      ? (subtotal * discountValue) / 100
      : Math.min(discountValue, subtotal);

  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    discountApplied: true,
    discountCode: promoCode.code,
  };
}

export async function getDiscountCodeByCode(code: string) {
  return prisma.promoCode.findUnique({
    where: { code: code.toUpperCase().trim() },
  });
}
