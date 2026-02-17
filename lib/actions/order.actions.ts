"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

const ORDER_EXPIRATION_MINUTES = 10;
const MAX_TICKETS_PER_ORDER = 5;

type OrderStatus = "pending" | "awaiting_payment" | "paid" | "cancelled" | "expired";

export type AttendeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  jobTitle: string;
  companyName: string;
  companyUrl?: string;
  workAddress?: string;
  workPhone?: string;
  emergencyContact?: string;
  githubHandle?: string;
  industry: string;
  organizationType?: string;
  primaryRole?: string;
  organizationRepresents: string;
  firstTimeKcd?: boolean;
  shirtSize?: string;
  dietaryNeeds?: string;
  disabilityAccommodation?: boolean;
  personOfColor?: string;
  genderIdentity?: string;
  ageRange?: string;
  cncfConsent: boolean;
  sponsorCommunicationsOptIn?: boolean;
};

export type BuyerInput = {
  fullName: string;
  email: string;
  phone?: string;
};

export type SelectedTickets = Record<string, number>; // ticketTypeId -> quantity

export type CreateOrderInput = {
  selectedTickets: SelectedTickets;
  buyer: BuyerInput;
  attendees: AttendeeInput[];
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
  subtotalAmount: string;
  totalAmount: string;
  currency: string;
  discountAmount: string;
  createdAt: Date;
  buyer: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  attendees: {
    id: string;
    ticketId: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    companyName: string;
    country: string;
    industry: string;
    organizationRepresents: string;
  }[];
  orderItems: {
    id: string;
    ticketId: string;
    unitPrice: string;
    discountAmount: string;
    finalPrice: string;
    ticketType: {
      name: string;
    };
  }[];
  discountCode: {
    code: string;
    discountType: string;
    discountValue: string;
  } | null;
};

class CreateOrderValidationError extends Error {}

function normalizeStatus(status: string): OrderStatus {
  const normalized = status.toLowerCase();
  if (
    normalized === "pending" ||
    normalized === "awaiting_payment" ||
    normalized === "paid" ||
    normalized === "cancelled" ||
    normalized === "expired"
  ) {
    return normalized;
  }
  return "pending";
}

function safeTrim(value?: string | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Creates a new order, reserves tickets, and creates attendees.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    const { selectedTickets, buyer, attendees, discountCode } = input;

    const selectedEntries = Object.entries(selectedTickets)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

    if (selectedEntries.length === 0) {
      return { success: false, error: "No tickets selected" };
    }

    const totalRequestedTickets = selectedEntries.reduce(
      (sum, entry) => sum + entry.quantity,
      0
    );
    if (totalRequestedTickets > MAX_TICKETS_PER_ORDER) {
      return {
        success: false,
        error: `A buyer can only purchase up to ${MAX_TICKETS_PER_ORDER} tickets per order`,
      };
    }

    if (attendees.length !== totalRequestedTickets) {
      return {
        success: false,
        error: "Please provide attendee information for every selected ticket",
      };
    }

    if (!buyer.fullName?.trim() || !buyer.email?.trim()) {
      return { success: false, error: "Buyer full name and email are required" };
    }

    const ticketTypeIds = selectedEntries.map((entry) => Number(entry.ticketTypeId));
    if (ticketTypeIds.some((id) => !Number.isInteger(id) || id <= 0)) {
      return { success: false, error: "Some selected tickets are invalid" };
    }

    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        id: { in: ticketTypeIds.map((id) => BigInt(id)) },
      },
    });

    if (ticketTypes.length !== selectedEntries.length) {
      return { success: false, error: "Some selected ticket types are invalid" };
    }

    const ticketTypeById = new Map(ticketTypes.map((ticketType) => [ticketType.id.toString(), ticketType]));
    const now = new Date();

    const currencies = new Set(ticketTypes.map((ticketType) => ticketType.currency));
    if (currencies.size > 1) {
      return { success: false, error: "All selected tickets must have the same currency" };
    }
    const currency = ticketTypes[0]?.currency ?? "USD";

    for (const entry of selectedEntries) {
      const ticketType = ticketTypeById.get(entry.ticketTypeId);
      if (!ticketType) {
        return { success: false, error: "Some selected ticket types are invalid" };
      }

      if (!ticketType.is_active) {
        return {
          success: false,
          error: `Ticket "${ticketType.name}" is not active`,
        };
      }

      if (ticketType.sale_starts_at && now < ticketType.sale_starts_at) {
        return {
          success: false,
          error: `Ticket "${ticketType.name}" sale has not started yet`,
        };
      }

      if (ticketType.sale_ends_at && now > ticketType.sale_ends_at) {
        return {
          success: false,
          error: `Ticket "${ticketType.name}" sale has ended`,
        };
      }

      const availableCount = await prisma.ticket.count({
        where: {
          ticket_type_id: ticketType.id,
          status: "available",
        },
      });

      if (availableCount < entry.quantity) {
        return {
          success: false,
          error: `Not enough "${ticketType.name}" tickets available`,
        };
      }
    }

    attendees.forEach((attendee, index) => {
      const requiredValid =
        attendee.firstName.trim() !== "" &&
        attendee.lastName.trim() !== "" &&
        attendee.email.trim() !== "" &&
        attendee.jobTitle.trim() !== "" &&
        attendee.companyName.trim() !== "" &&
        attendee.country.trim() !== "" &&
        attendee.industry.trim() !== "" &&
        attendee.organizationRepresents.trim() !== "";

      if (!requiredValid) {
        throw new CreateOrderValidationError(
          `Attendee #${index + 1} is missing required fields`
        );
      }
    });

    let subtotal = 0;
    for (const entry of selectedEntries) {
      const ticketType = ticketTypeById.get(entry.ticketTypeId);
      if (!ticketType) continue;
      subtotal += Number(ticketType.base_price) * entry.quantity;
    }

    let discountAmount = 0;
    let promoCodeRecord: {
      id: bigint;
      discount_type: string;
      discount_value: unknown;
      max_redemptions: number | null;
      redemptions_count: number;
      starts_at: Date | null;
      ends_at: Date | null;
      is_active: boolean;
    } | null = null;

    if (discountCode?.trim()) {
      const code = discountCode.toUpperCase().trim();
      const promo = await prisma.promoCode.findUnique({ where: { code } });
      if (!promo) {
        return { success: false, error: "Invalid discount code" };
      }
      if (!promo.is_active) {
        return { success: false, error: "This discount code is no longer active" };
      }
      if (promo.max_redemptions !== null && promo.redemptions_count >= promo.max_redemptions) {
        return { success: false, error: "Discount code has reached maximum redemptions" };
      }
      if (promo.starts_at && now < promo.starts_at) {
        return { success: false, error: "Discount code is not yet valid" };
      }
      if (promo.ends_at && now > promo.ends_at) {
        return { success: false, error: "Discount code has expired" };
      }

      const discountValue = Number(promo.discount_value);
      const discountType = promo.discount_type.toUpperCase();
      if (discountType === "PERCENTAGE") {
        discountAmount = (subtotal * discountValue) / 100;
      } else {
        discountAmount = Math.min(discountValue, subtotal);
      }
      promoCodeRecord = promo;
    }

    const totalAmount = subtotal - discountAmount;
    const reservationExpiresAt = new Date(
      Date.now() + ORDER_EXPIRATION_MINUTES * 60 * 1000
    );

    const order = await prisma.$transaction(async (tx) => {
      const buyerRecord = await tx.buyer.upsert({
        where: { email: buyer.email.trim().toLowerCase() },
        update: {
          full_name: buyer.fullName.trim(),
          phone: safeTrim(buyer.phone),
          updated_at: new Date(),
        },
        create: {
          full_name: buyer.fullName.trim(),
          email: buyer.email.trim().toLowerCase(),
          phone: safeTrim(buyer.phone),
        },
      });

      const newOrder = await tx.order.create({
        data: {
          buyer_id: buyerRecord.id,
          promo_code_id: promoCodeRecord?.id ?? null,
          order_status: "pending",
          subtotal_amount: subtotal,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          currency,
        },
      });

      let attendeeCursor = 0;

      for (const entry of selectedEntries) {
        const ticketType = ticketTypeById.get(entry.ticketTypeId);
        if (!ticketType) {
          throw new CreateOrderValidationError("Invalid ticket type while creating order");
        }

        const availableTickets = await tx.ticket.findMany({
          where: {
            ticket_type_id: ticketType.id,
            status: "available",
          },
          orderBy: { id: "asc" },
          take: entry.quantity,
        });

        if (availableTickets.length < entry.quantity) {
          throw new CreateOrderValidationError(
            `Not enough "${ticketType.name}" tickets available`
          );
        }

        for (const ticket of availableTickets) {
          const attendee = attendees[attendeeCursor];
          if (!attendee) {
            throw new CreateOrderValidationError(
              "Attendee information is missing for selected tickets"
            );
          }
          attendeeCursor += 1;

          await tx.ticket.update({
            where: { id: ticket.id },
            data: {
              status: "reserved",
              reserved_until: reservationExpiresAt,
            },
          });

          await tx.orderItem.create({
            data: {
              order_id: newOrder.id,
              ticket_id: ticket.id,
              unit_price: ticket.base_price,
              discount_amount: 0,
              final_price: ticket.base_price,
            },
          });

          await tx.attendee.create({
            data: {
              ticket_id: ticket.id,
              first_name: attendee.firstName.trim(),
              last_name: attendee.lastName.trim(),
              email: attendee.email.trim(),
              job_title: attendee.jobTitle.trim(),
              company_name: attendee.companyName.trim(),
              company_url: safeTrim(attendee.companyUrl),
              work_address: safeTrim(attendee.workAddress),
              country: attendee.country.trim(),
              work_phone: safeTrim(attendee.workPhone),
              emergency_contact: safeTrim(attendee.emergencyContact),
              github_handle: safeTrim(attendee.githubHandle),
              industry: attendee.industry.trim(),
              organization_type: safeTrim(attendee.organizationType),
              primary_role: safeTrim(attendee.primaryRole),
              organization_represents: attendee.organizationRepresents.trim(),
              first_time_kcd:
                typeof attendee.firstTimeKcd === "boolean"
                  ? attendee.firstTimeKcd
                  : null,
              shirt_size: safeTrim(attendee.shirtSize),
              dietary_needs: safeTrim(attendee.dietaryNeeds),
              disability_accommodation:
                typeof attendee.disabilityAccommodation === "boolean"
                  ? attendee.disabilityAccommodation
                  : null,
              person_of_color: safeTrim(attendee.personOfColor),
              gender_identity: safeTrim(attendee.genderIdentity),
              age_range: safeTrim(attendee.ageRange),
              cncf_communications_consent: attendee.cncfConsent,
              sponsor_communications_opt_in:
                typeof attendee.sponsorCommunicationsOptIn === "boolean"
                  ? attendee.sponsorCommunicationsOptIn
                  : null,
            },
          });
        }
      }

      if (promoCodeRecord) {
        await tx.promoCode.update({
          where: { id: promoCodeRecord.id },
          data: {
            redemptions_count: { increment: 1 },
          },
        });

        await tx.promoRedemption.create({
          data: {
            promo_code_id: promoCodeRecord.id,
            order_id: newOrder.id,
            buyer_id: buyerRecord.id,
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id.toString() };
  } catch (error) {
    if (error instanceof CreateOrderValidationError) {
      return { success: false, error: error.message };
    }

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
    const { orderId, paymentId, paymentMethod } = input;

    const orderIdAsBigInt = BigInt(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderIdAsBigInt },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const orderStatus = normalizeStatus(order.order_status);

    if (orderStatus === "paid") {
      return { success: true };
    }

    if (orderStatus === "cancelled" || orderStatus === "expired") {
      return { success: false, error: "Order is no longer valid" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderIdAsBigInt },
        data: {
          order_status: "paid",
          updated_at: new Date(),
        },
      });

      const existingPayment = await tx.payment.findFirst({
        where: { order_id: orderIdAsBigInt },
        orderBy: { id: "desc" },
      });

      if (existingPayment) {
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            provider_reference: paymentId,
            status: "paid",
            updated_at: new Date(),
          },
        });
      } else {
        await tx.payment.create({
          data: {
            order_id: orderIdAsBigInt,
            provider: paymentMethod ?? "PagueloFacil",
            provider_reference: paymentId,
            status: "paid",
            amount: order.total_amount,
            currency: order.currency,
          },
        });
      }

      await tx.ticket.updateMany({
        where: {
          order_items: {
            some: {
              order_id: orderIdAsBigInt,
            },
          },
        },
        data: {
          status: "sold",
          reserved_until: null,
          updated_at: new Date(),
        },
      });
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
 * Updates an order's status to awaiting_payment.
 */
export async function updateOrderToAwaitingPayment(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderIdAsBigInt = BigInt(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderIdAsBigInt },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (normalizeStatus(order.order_status) !== "pending") {
      return { success: false, error: "Order is not in pending state" };
    }

    await prisma.order.update({
      where: { id: orderIdAsBigInt },
      data: { order_status: "awaiting_payment", updated_at: new Date() },
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

    const orderIdAsBigInt = BigInt(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderIdAsBigInt },
      include: {
        order_items: {
          include: {
            ticket: {
              include: {
                ticket_type: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const orderStatus = normalizeStatus(order.order_status);
    if (orderStatus === "paid") {
      return { success: false, error: "Order is already paid" };
    }

    if (orderStatus === "cancelled" || orderStatus === "expired") {
      return { success: false, error: "Order is no longer valid" };
    }

    const amount = Number(order.total_amount);
    const taxAmount = amount * 0.07;
    const description = `Purchase of tickets: ${order.order_items
      .map(
        (item) =>
          `${item.ticket.ticket_type.name} @ ${Number(item.unit_price).toFixed(2)}`
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

    await prisma.payment.create({
      data: {
        order_id: orderIdAsBigInt,
        provider: "PagueloFacil",
        provider_reference: payload.data?.code ?? null,
        status: "initiated",
        amount: order.total_amount,
        currency: order.currency,
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
 * Cancels an order and releases reserved tickets.
 */
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderIdAsBigInt = BigInt(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderIdAsBigInt },
      include: { order_items: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const orderStatus = normalizeStatus(order.order_status);
    if (orderStatus === "paid") {
      return { success: false, error: "Cannot cancel a paid order" };
    }

    if (orderStatus === "cancelled") {
      return { success: true };
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.order_items) {
        await tx.ticket.update({
          where: { id: item.ticket_id },
          data: {
            status: "available",
            reserved_until: null,
            updated_at: new Date(),
          },
        });
      }

      await tx.order.update({
        where: { id: orderIdAsBigInt },
        data: { order_status: "cancelled", updated_at: new Date() },
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
 * Marks expired orders as expired and releases tickets.
 */
export async function expireOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderIdAsBigInt = BigInt(orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderIdAsBigInt },
      include: { order_items: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const orderStatus = normalizeStatus(order.order_status);
    if (orderStatus !== "pending" && orderStatus !== "awaiting_payment") {
      return { success: true };
    }

    const expiresAt = new Date(
      order.created_at.getTime() + ORDER_EXPIRATION_MINUTES * 60 * 1000
    );
    if (expiresAt > new Date()) {
      return { success: false, error: "Order has not expired yet" };
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.order_items) {
        await tx.ticket.update({
          where: { id: item.ticket_id },
          data: {
            status: "available",
            reserved_until: null,
            updated_at: new Date(),
          },
        });
      }

      await tx.order.update({
        where: { id: orderIdAsBigInt },
        data: { order_status: "expired", updated_at: new Date() },
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
  const orderIdAsBigInt = BigInt(orderId);
  const order = await prisma.order.findUnique({
    where: { id: orderIdAsBigInt },
    include: {
      buyer: true,
      promo_code: {
        select: {
          code: true,
          discount_type: true,
          discount_value: true,
        },
      },
      order_items: {
        include: {
          ticket: {
            include: {
              attendee: true,
              ticket_type: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  return {
    id: order.id.toString(),
    status: normalizeStatus(order.order_status),
    subtotalAmount: order.subtotal_amount.toString(),
    totalAmount: order.total_amount.toString(),
    currency: order.currency,
    discountAmount: order.discount_amount.toString(),
    createdAt: order.created_at,
    buyer: {
      id: order.buyer.id.toString(),
      fullName: order.buyer.full_name,
      email: order.buyer.email,
      phone: order.buyer.phone,
    },
    attendees: order.order_items
      .map((item) => item.ticket.attendee)
      .filter((attendee): attendee is NonNullable<typeof attendee> => attendee !== null)
      .map((attendee) => ({
        id: attendee.id.toString(),
        ticketId: attendee.ticket_id.toString(),
        firstName: attendee.first_name,
        lastName: attendee.last_name,
        email: attendee.email,
        jobTitle: attendee.job_title,
        companyName: attendee.company_name,
        country: attendee.country,
        industry: attendee.industry,
        organizationRepresents: attendee.organization_represents,
      })),
    orderItems: order.order_items.map((item) => ({
      id: item.id.toString(),
      ticketId: item.ticket_id.toString(),
      unitPrice: item.unit_price.toString(),
      discountAmount: item.discount_amount.toString(),
      finalPrice: item.final_price.toString(),
      ticketType: {
        name: item.ticket.ticket_type.name,
      },
    })),
    discountCode: order.promo_code
      ? {
          code: order.promo_code.code,
          discountType: order.promo_code.discount_type,
          discountValue: order.promo_code.discount_value.toString(),
        }
      : null,
  };
}
