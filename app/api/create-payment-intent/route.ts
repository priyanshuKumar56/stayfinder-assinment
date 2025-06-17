import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { createPaymentIntent } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { property_id, guest_id, check_in_date, check_out_date, guests, special_requests } = body

    // Fetch property details
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", property_id)
      .single()

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Calculate booking costs
    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    const subtotal = nights * property.price_per_night
    const cleaningFee = property.cleaning_fee || 0
    const serviceFee = subtotal * (property.service_fee_percentage / 100)
    const taxes = subtotal * 0.08 // 8% tax rate
    const totalAmount = subtotal + cleaningFee + serviceFee + taxes

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(totalAmount, {
      property_id,
      guest_id,
      check_in_date,
      check_out_date,
      guests: guests.toString(),
    })

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          property_id,
          guest_id,
          check_in_date,
          check_out_date,
          guests,
          total_amount: totalAmount,
          subtotal,
          cleaning_fee: cleaningFee,
          service_fee: serviceFee,
          taxes,
          stripe_payment_intent_id: paymentIntent.id,
          special_requests,
          status: "pending",
          payment_status: "pending",
        },
      ])
      .select()
      .single()

    if (bookingError) {
      console.error("Error creating booking:", bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({
      booking,
      client_secret: paymentIntent.client_secret,
      publishable_key:
        "pk_test_51RaAwoQrDn58L7mxJufincEdQPoAV0nqwW1fSJ16GVM8vLMfS2368NiVsXO7osNv4GJcQKM7Yw9krRQMeuLmByqJ00l8Yyocpg",
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
