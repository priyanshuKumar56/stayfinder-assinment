import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const hostId = searchParams.get("hostId")

    if (!userId && !hostId) {
      return NextResponse.json({ error: "User ID or Host ID is required" }, { status: 400 })
    }

    let query = supabase.from("bookings").select(`
      *,
      property:properties(
        id,
        title,
        city,
        country,
        images,
        price_per_night,
        host_id,
        host:user_profiles!properties_host_id_fkey(
          id,
          full_name,
          first_name,
          last_name,
          avatar_url
        )
      ),
      guest:user_profiles!bookings_guest_id_fkey(
        id,
        full_name,
        first_name,
        last_name,
        avatar_url
      )
    `)

    if (userId) {
      query = query.eq("guest_id", userId)
    } else if (hostId) {
      // For host bookings, we need to join through properties
      query = query.eq("property.host_id", hostId)
    }

    const { data: bookings, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    // Transform property images for frontend compatibility
    const transformedBookings = bookings?.map((booking) => ({
      ...booking,
      property: {
        ...booking.property,
        property_images:
          booking.property?.images?.map((url: string, index: number) => ({
            image_url: url,
            is_primary: index === 0,
          })) || [],
      },
    }))

    return NextResponse.json({ bookings: transformedBookings })
  } catch (error) {
    console.error("Error in bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const {
      property_id,
      guest_id,
      check_in_date,
      check_out_date,
      guests,
      adults = guests,
      children = 0,
      infants = 0,
      pets = 0,
      special_requests,
    } = body

    // Validate required fields
    if (!property_id || !guest_id || !check_in_date || !check_out_date || !guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate guest counts
    if (adults + children > guests) {
      return NextResponse.json({ error: "Adults and children cannot exceed total guests" }, { status: 400 })
    }

    // Get property details for pricing
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("price_per_night, host_id, cleaning_fee, service_fee_percentage, extra_guest_fee, max_guests")
      .eq("id", property_id)
      .single()

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Validate guest count against property limits
    if (guests > property.max_guests) {
      return NextResponse.json({ error: `Maximum ${property.max_guests} guests allowed` }, { status: 400 })
    }

    // Calculate dates and pricing
    const checkInDate = new Date(check_in_date)
    const checkOutDate = new Date(check_out_date)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }

    const baseAmount = nights * property.price_per_night
    const cleaningFee = property.cleaning_fee || 0
    const extraGuestFee = guests > 2 ? (guests - 2) * (property.extra_guest_fee || 0) : 0
    const serviceFee = baseAmount * ((property.service_fee_percentage || 14) / 100)
    const taxes = baseAmount * 0.08 // 8% tax rate
    const totalAmount = baseAmount + cleaningFee + extraGuestFee + serviceFee + taxes

    // Check for existing bookings (prevent double booking)
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("id")
      .eq("property_id", property_id)
      .in("status", ["confirmed", "pending"])
      .or(`check_in_date.lte.${check_out_date},check_out_date.gte.${check_in_date}`)

    if (checkError) {
      console.error("Error checking existing bookings:", checkError)
      return NextResponse.json({ error: "Failed to validate booking dates" }, { status: 500 })
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: "Property is not available for selected dates" }, { status: 409 })
    }

    // Create booking - nights will be auto-calculated by the database
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          property_id,
          guest_id,
          check_in_date,
          check_out_date,
          guests,
          adults,
          children,
          infants,
          pets,
          base_amount: baseAmount,
          cleaning_fee: cleaningFee,
          extra_guest_fee: extraGuestFee,
          service_fee: serviceFee,
          taxes,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "pending",
          special_requests,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Error in create booking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
