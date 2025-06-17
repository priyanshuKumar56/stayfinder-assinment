import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { id } = params
    const body = await request.json()
    const { cancelled_by, cancellation_reason } = body

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // Update booking status to cancelled
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_by,
        cancellation_reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error cancelling booking:", error)
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Error in cancel booking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
