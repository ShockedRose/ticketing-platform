// import { updateOrderToPaid } from "@/lib/actions/order.action";
import { NextRequest, NextResponse } from "next/server";



// TODO: IMPLEMENT PAGUELOFACIL WEBHOOK TO UPDATE ORDER STATUS

/* ENV: 

    CCLW
    CMTN
    CDSC
    RETURN_URL
    EXPIRES_IN
    CTAX

*/

export async function POST(req: NextRequest) {
    //   // Build the webhook event

    //   if (event.type === "charge.succeeded") {
    //     const { object } = event.data;

    //     //Update order status
    //     await updateOrderToPaid({
    //       orderId: object.metadata.orderId,
    //       paymentResult: {
    //         id: object.id,
    //         status: "COMPLETED",
    //         email_address: object.billing_details.email!,
    //         pricePaid: (object.amount / 100).toFixed(),
    //       },
    //     });

    return NextResponse.json({ message: "updateOrderToPaid was successful" });
    //   }
    //   return NextResponse.json({ message: "event is not charge.succeeded" });
}
