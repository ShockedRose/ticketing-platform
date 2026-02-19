import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { NextRequest, NextResponse } from "next/server";

/* ENV variables expected:
    CCLW - PagueloFacil Client ID
    CMTN - PagueloFacil Merchant Token
    CDSC - Description
    RETURN_URL - Return URL after payment
    EXPIRES_IN - Payment link expiration
    CTAX - Tax configuration
*/

// PagueloFacil webhook payload structure (adjust based on actual docs)
interface PagueloFacilWebhookPayload {
  orderId?: string;
  transactionId?: string;
  status?: string;
  amount?: number;
  email?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    const body: PagueloFacilWebhookPayload = await req.json();

    // Validate webhook payload
    if (!body.orderId || !body.transactionId) {
      return NextResponse.json(
        { error: "Missing orderId or transactionId" },
        { status: 400 }
      );
    }

    // Check if payment was successful
    if (body.status === "COMPLETED" || body.status === "SUCCESS" || body.status === "APPROVED") {
      // Update order status to PAID
      const result = await updateOrderToPaid({
        orderId: body.orderId,
        paymentId: body.transactionId,
        paymentMethod: "PagueloFacil",
        paymentResult: body as Record<string, unknown>,
      });

      if (!result.success) {
        console.error("Failed to update order:", result.error);
        return NextResponse.json(
          { error: result.error || "Failed to update order" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Order updated to paid successfully",
      });
    }

    // Payment was not successful
    return NextResponse.json({
      success: false,
      message: `Payment status: ${body.status}`,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing/health check)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PagueloFacil webhook endpoint",
  });
}
