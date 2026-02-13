import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert Decimal fields to strings for JSON serialization.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    ticketTier: {
      price: {
        compute(ticketTier) {
          return ticketTier.price.toString();
        },
      },
    },
    order: {
      totalAmount: {
        needs: { totalAmount: true },
        compute(order) {
          return order.totalAmount.toString();
        },
      },
      discountAmount: {
        needs: { discountAmount: true },
        compute(order) {
          return order.discountAmount.toString();
        },
      },
    },
    orderItem: {
      unitPrice: {
        compute(orderItem) {
          return orderItem.unitPrice.toString();
        },
      },
      totalPrice: {
        compute(orderItem) {
          return orderItem.totalPrice.toString();
        },
      },
    },
    discountCode: {
      discountValue: {
        compute(discountCode) {
          return discountCode.discountValue.toString();
        },
      },
    },
  },
});
