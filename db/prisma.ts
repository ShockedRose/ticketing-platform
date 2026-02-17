import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

// Extends the PrismaClient with custom result transformers for Decimal fields in the new schema.
export const prisma = prismaClient.$extends({
  result: {
    ticketType: {
      base_price: {
        compute(ticketType) {
          return ticketType.base_price.toString();
        },
      },
    },
    ticket: {
      base_price: {
        compute(ticket) {
          return ticket.base_price.toString();
        },
      },
    },
    order: {
      subtotal_amount: {
        needs: { subtotal_amount: true },
        compute(order) {
          return order.subtotal_amount.toString();
        },
      },
      total_amount: {
        needs: { total_amount: true },
        compute(order) {
          return order.total_amount.toString();
        },
      },
      discount_amount: {
        needs: { discount_amount: true },
        compute(order) {
          return order.discount_amount.toString();
        },
      },
    },
    orderItem: {
      unit_price: {
        compute(orderItem) {
          return orderItem.unit_price.toString();
        },
      },
      discount_amount: {
        compute(orderItem) {
          return orderItem.discount_amount.toString();
        },
      },
      final_price: {
        compute(orderItem) {
          return orderItem.final_price.toString();
        },
      },
    },
    promoCode: {
      discount_value: {
        compute(promoCode) {
          return promoCode.discount_value.toString();
        },
      },
    },
    payment: {
      amount: {
        compute(payment) {
          return payment.amount.toString();
        },
      },
    },
  },
});
