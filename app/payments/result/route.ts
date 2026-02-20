import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const totalPagado = searchParams.get("TotalPagado");
  const estado = searchParams.get("Estado");
  const oper = searchParams.get("Oper");
  const orderId = searchParams.get("orderId");

  let success = false;
  let message = "We could not verify your payment.";

  if (estado === "Aprobada" && oper && orderId) {
    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
    });

    if (order) {
      if (Number(order.total_amount) === Number(totalPagado)) {
        if (order.order_status !== "paid") {
          await prisma.order.update({
            where: { id: order.id },
            data: { payment_oper: oper },
          });

          const result = await updateOrderToPaid({
            orderId: order.id.toString(),
            paymentId: oper,
            paymentMethod: "PagueloFacil",
          });

          if (result.success) {
            success = true;
            message = "Your order has been completed successfully.";
          } else {
            success = false;
            message = result.error || "Failed to update order status.";
          }
        } else {
          success = true;
          message = "Your order has been completed successfully.";
        }
      } else {
         message = "Payment amount does not match the order total.";
      }
    } else {
       message = "Order not found.";
    }
  } else if (estado) {
     message = `Payment status: ${estado}`;
  }

  const statusUrl = new URL("/payments/status", request.url);
  statusUrl.searchParams.set("success", success ? "true" : "false");
  statusUrl.searchParams.set("message", message);
  
  return NextResponse.redirect(statusUrl);
}