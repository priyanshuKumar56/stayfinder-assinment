import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import stripe from "@/lib/stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerClient()

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Update booking status
        const { error } = await supabase
          .from("bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        if (error) {
          console.error("Error updating booking:", error)
        }
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        // Update booking status
        await supabase
          .from("bookings")
          .update({
            payment_status: "failed",
            status: "cancelled",
          })
          .eq("stripe_payment_intent_id", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error in webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
