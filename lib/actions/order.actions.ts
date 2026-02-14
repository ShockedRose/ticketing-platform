"use server";

import { prisma } from "@/db/prisma";
import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Types for action inputs/outputs
export type AttendeeInput = {
  name: string;
  email: string;
  country: string;
  jobTitle: string;
  company: string;
  industry: string;
  orgType: string;
  cncfConsent: boolean;
  whatsappUpdates: boolean;
};

export type SelectedTickets = Record<string, number>; // slug -> quantity

export type CreateOrderInput = {
  selectedTickets: SelectedTickets;
  attendee: AttendeeInput;
  discountCode?: string;
};

export type CreateOrderResult = {
  success: boolean;
  orderId?: string;
  error?: string;
};

type PagueloFacilLinkResponse = {
  headerStatus?: {
    code?: number;
    description?: string;
  };
  serverTime?: string;
  message?: string;
  requestId?: string | null;
  data?: {
    url?: string;
    code?: string;
  };
  success?: boolean;
};

export type OrderWithDetails = {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  currency: string;
  discountAmount: string;
  paymentMethod: string | null;
  paymentId: string | null;
  paidAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  attendee: {
    name: string;
    email: string;
    country: string;
    jobTitle: string;
    company: string;
    industry: string;
    orgType: string;
  } | null;
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    ticketTier: {
      name: string;
      slug: string;
    };
  }[];
  discountCode: {
    code: string;
    discountType: string;
    discountValue: string;
  } | null;
};

/**
 * Creates a new order with order items and attendee information.
 * This should be called when the user proceeds from Step 2 to Step 3 (payment).
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    const { selectedTickets, attendee, discountCode } = input;

    // Get selected ticket slugs with quantity > 0
    const selectedSlugs = Object.entries(selectedTickets)
      .filter(([, qty]) => qty > 0)
      .map(([slug]) => slug);

    if (selectedSlugs.length === 0) {
      return { success: false, error: "No tickets selected" };
    }

    // Fetch ticket tiers from DB
    const ticketTiers = await prisma.ticketTier.findMany({
      where: { slug: { in: selectedSlugs } },
    });

    if (ticketTiers.length !== selectedSlugs.length) {
      return { success: false, error: "Some selected tickets are invalid" };
    }

    // Validate all selected tiers are available
    for (const tier of ticketTiers) {
      if (tier.status !== "AVAILABLE") {
        return {
          success: false,
          error: `Ticket "${tier.name}" is not available for purchase`,
        };
      }
      const requestedQty = selectedTickets[tier.slug] ?? 0;
      const availableQty = tier.totalQuantity - tier.soldQuantity;
      if (requestedQty > availableQty) {
        return {
          success: false,
          error: `Not enough "${tier.name}" tickets available`,
        };
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItemsData: {
      ticketTierId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    for (const tier of ticketTiers) {
      const qty = selectedTickets[tier.slug] ?? 0;
      const unitPrice = Number(tier.price);
      const totalPrice = unitPrice * qty;
      subtotal += totalPrice;
      orderItemsData.push({
        ticketTierId: tier.id,
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    // Handle discount code if provided
    let discountAmount = 0;
    let discountCodeRecord = null;

    if (discountCode) {
      discountCodeRecord = await prisma.discountCode.findUnique({
        where: { code: discountCode.toUpperCase() },
      });

      if (discountCodeRecord && discountCodeRecord.isActive) {
        // Validate max uses
        if (
          discountCodeRecord.maxUses !== null &&
          discountCodeRecord.currentUses >= discountCodeRecord.maxUses
        ) {
          return {
            success: false,
            error: "Discount code has reached maximum uses",
          };
        }

        // Validate date range
        const now = new Date();
        if (
          discountCodeRecord.validFrom &&
          now < discountCodeRecord.validFrom
        ) {
          return { success: false, error: "Discount code is not yet valid" };
        }
        if (
          discountCodeRecord.validUntil &&
          now > discountCodeRecord.validUntil
        ) {
          return { success: false, error: "Discount code has expired" };
        }

        // Check tier restriction
        if (discountCodeRecord.ticketTierId) {
          const tierValid = ticketTiers.some(
            (t) => t.id === discountCodeRecord!.ticketTierId
          );
          if (!tierValid) {
            return {
              success: false,
              error: "Discount code is not valid for selected tickets",
            };
          }
        }

        // Calculate discount
        const discountValue = Number(discountCodeRecord.discountValue);
        if (discountCodeRecord.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * discountValue) / 100;
        } else {
          discountAmount = Math.min(discountValue, subtotal);
        }
      }
    }

    const totalAmount = subtotal - discountAmount;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create order with items and attendee in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          status: "PENDING",
          totalAmount,
          currency: "INR",
          discountAmount,
          discountCodeId: discountCodeRecord?.id ?? null,
          expiresAt,
          orderItems: {
            create: orderItemsData,
          },
          attendee: {
            create: {
              name: attendee.name,
              email: attendee.email,
              country: attendee.country,
              jobTitle: attendee.jobTitle,
              company: attendee.company,
              industry: attendee.industry,
              orgType: attendee.orgType,
              cncfConsent: attendee.cncfConsent,
              whatsappUpdates: attendee.whatsappUpdates,
            },
          },
        },
      });

      // Update sold quantities for each tier
      for (const tier of ticketTiers) {
        const qty = selectedTickets[tier.slug] ?? 0;
        await tx.ticketTier.update({
          where: { id: tier.id },
          data: { soldQuantity: { increment: qty } },
        });
      }

      // Increment discount code usage if used
      if (discountCodeRecord) {
        await tx.discountCode.update({
          where: { id: discountCodeRecord.id },
          data: { currentUses: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

/**
 * Updates an order's status and payment information.
 * Used by the payment webhook to mark orders as paid.
 */
export async function updateOrderToPaid(input: {
  orderId: string;
  paymentId: string;
  paymentMethod?: string;
  paymentResult?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { orderId, paymentId, paymentMethod, paymentResult } = input;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "PAID") {
      return { success: true }; // Already paid, idempotent
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      return { success: false, error: "Order is no longer valid" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentId,
        paymentMethod: paymentMethod ?? "PagueloFacil",
        paymentResult: paymentResult ?? undefined,
        paidAt: new Date(),
      },
    });

    revalidatePath("/register");

    return { success: true };
  } catch (error) {
    console.error("Error updating order to paid:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order",
    };
  }
}

/**
 * Updates an order's status to AWAITING_PAYMENT.
 * Called when redirecting to the payment provider.
 */
export async function updateOrderToAwaitingPayment(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status !== "PENDING") {
      return { success: false, error: "Order is not in pending state" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "AWAITING_PAYMENT" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order",
    };
  }
}

/**
 * Creates a payment URL in PagueloFacil for an order.
 * Uses order details to build the request payload and returns
 * the payment URL when provider responds with headerStatus.code = 200.
 */
export async function createPaymentUrl(
  orderId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const cclw = process.env.PAGUELOFACIL_CCLW;
    const returnUrl = process.env.PAGUELOFACIL_RETURN_URL;
    const baseUrl =
      process.env.PAGUELOFACIL_BASE_URL ?? "https://sandbox.paguelofacil.com";

    if (!cclw || !returnUrl) {
      return {
        success: false,
        error:
          "Payment provider is not configured correctly. Please contact support.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            ticketTier: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "PAID") {
      return { success: false, error: "Order is already paid" };
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      return { success: false, error: "Order is no longer valid" };
    }

    const amount = Number(order.totalAmount);
    const taxAmount = amount * 0.07;
    const description = `Purchase of the tickets: ${order.orderItems
      .map(
        (item) =>
          `${item.ticketTier.name} x${item.quantity} @ ${Number(item.unitPrice).toFixed(2)}`
      )
      .join(", ")}`.slice(0, 255);

    const form = new URLSearchParams({
      CCLW: cclw,
      CMTN: amount.toFixed(2),
      CDSC: description,
      RETURN_URL: returnUrl,
      EXPIRES_IN: "3600",
      CTAX: taxAmount.toFixed(2),
    });

    const response = await fetch(`${baseUrl}/LinkDeamon.cfm`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
    });

    const payload = (await response.json()) as PagueloFacilLinkResponse;
    const providerCode = payload?.headerStatus?.code;
    const paymentUrl = payload?.data?.url;

    if (providerCode !== 200 || !paymentUrl) {
      return {
        success: false,
        error:
          payload?.headerStatus?.description ||
          payload?.message ||
          "Payment provider rejected the request",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: payload.data?.code ?? null,
        paymentMethod: "PagueloFacil",
        paymentResult: payload,
      },
    });

    return { success: true, url: paymentUrl };
  } catch (error) {
    console.error("Error creating payment url:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create payment URL",
    };
  }
}

/**
 * Cancels an order and restores ticket quantities.
 */
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "PAID") {
      return { success: false, error: "Cannot cancel a paid order" };
    }

    if (order.status === "CANCELLED") {
      return { success: true }; // Already cancelled
    }

    await prisma.$transaction(async (tx) => {
      // Restore ticket quantities
      for (const item of order.orderItems) {
        await tx.ticketTier.update({
          where: { id: item.ticketTierId },
          data: { soldQuantity: { decrement: item.quantity } },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel order",
    };
  }
}

/**
 * Marks expired orders as EXPIRED.
 * Can be called periodically or before showing order status.
 */
export async function expireOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Only expire pending or awaiting payment orders
    if (order.status !== "PENDING" && order.status !== "AWAITING_PAYMENT") {
      return { success: true };
    }

    // Check if actually expired
    if (order.expiresAt && order.expiresAt > new Date()) {
      return { success: false, error: "Order has not expired yet" };
    }

    await prisma.$transaction(async (tx) => {
      // Restore ticket quantities
      for (const item of order.orderItems) {
        await tx.ticketTier.update({
          where: { id: item.ticketTierId },
          data: { soldQuantity: { decrement: item.quantity } },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "EXPIRED" },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error expiring order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to expire order",
    };
  }
}

/**
 * Fetches an order with all related details.
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithDetails | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      attendee: {
        select: {
          name: true,
          email: true,
          country: true,
          jobTitle: true,
          company: true,
          industry: true,
          orgType: true,
        },
      },
      orderItems: {
        include: {
          ticketTier: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      discountCode: {
        select: {
          code: true,
          discountType: true,
          discountValue: true,
        },
      },
    },
  });

  if (!order) return null;

  return {
    ...order,
    discountCode: order.discountCode
      ? {
          ...order.discountCode,
          discountValue: order.discountCode.discountValue.toString(),
        }
      : null,
  };
}
