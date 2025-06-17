import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
export const dynamic = 'force-dynamic'
// Simple in-memory cache for dashboard data
const dashboardCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute cache

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60000 // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const clientData = requestCounts.get(clientId)

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (clientData.count >= RATE_LIMIT) {
    return false
  }

  clientData.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const hostId = searchParams.get("hostId")

    if (!hostId) {
      return NextResponse.json({ error: "Host ID is required" }, { status: 400 })
    }

    // Rate limiting check
    const clientId = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || hostId
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment before refreshing." }, { status: 429 })
    }

    // Check cache first
    const cacheKey = `dashboard_${hostId}`
    const cached = dashboardCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data)
    }

    const supabase = createServerClient()

    // Get host profile with timeout
    const hostProfilePromise = Promise.race([
      supabase.from("user_profiles").select("*").eq("id", hostId).single(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000)),
    ])

    const { data: hostProfile, error: hostError } = (await hostProfilePromise) as any

    if (hostError) {
      console.error("Error fetching host profile:", hostError)
      return NextResponse.json({ error: "Host not found" }, { status: 404 })
    }

    // Get properties with simpler query and timeout
    const propertiesPromise = Promise.race([
      supabase
        .from("properties")
        .select(
          "id, title, city, country, price_per_night, is_active, is_featured, images, average_rating, bedrooms, bathrooms, max_guests, property_type, room_type",
        )
        .eq("host_id", hostId)
        .limit(20),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000)),
    ])

    const { data: properties, error: propertiesError } = (await propertiesPromise) as any

    const safeProperties = properties || []
    const propertyIds = safeProperties.map((p: any) => p.id)

    // Get basic booking stats only
    let bookingStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
    }

    let recentBookings: any[] = []

    if (propertyIds.length > 0) {
      try {
        const bookingsPromise = Promise.race([
          supabase
            .from("bookings")
            .select(`
              id,
              property_id,
              guest_id,
              check_in_date,
              check_out_date,
              guests,
              adults,
              children,
              nights,
              total_amount,
              status,
              payment_status,
              created_at,
              properties!inner(id, title, city, country),
              user_profiles!bookings_guest_id_fkey(id, full_name, first_name, last_name, avatar_url)
            `)
            .in("property_id", propertyIds)
            .order("created_at", { ascending: false })
            .limit(20),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000)),
        ])

        const { data: bookingsData } = (await bookingsPromise) as any

        if (bookingsData) {
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()

          bookingStats = {
            total: bookingsData.length,
            pending: bookingsData.filter((b: any) => b.status === "pending").length,
            confirmed: bookingsData.filter((b: any) => b.status === "confirmed").length,
            cancelled: bookingsData.filter((b: any) => b.status === "cancelled").length,
            completed: bookingsData.filter((b: any) => b.status === "completed").length,
            totalEarnings: bookingsData
              .filter((b: any) => b.status === "completed")
              .reduce((sum: number, b: any) => sum + (Number.parseFloat(b.total_amount) || 0), 0),
            monthlyEarnings: bookingsData
              .filter((b: any) => {
                const bookingDate = new Date(b.created_at)
                return (
                  bookingDate.getMonth() === currentMonth &&
                  bookingDate.getFullYear() === currentYear &&
                  b.status === "completed"
                )
              })
              .reduce((sum: number, b: any) => sum + (Number.parseFloat(b.total_amount) || 0), 0),
          }

          recentBookings = bookingsData.slice(0, 10).map((booking: any) => ({
            id: booking.id,
            guest: {
              id: booking.user_profiles?.id || booking.guest_id,
              first_name: booking.user_profiles?.first_name || "Guest",
              last_name: booking.user_profiles?.last_name || "",
              full_name: booking.user_profiles?.full_name || "Guest User",
              avatar_url: booking.user_profiles?.avatar_url,
            },
            property: {
              id: booking.properties?.id || booking.property_id,
              title: booking.properties?.title || "Property",
              city: booking.properties?.city || "",
              country: booking.properties?.country || "",
            },
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
            guests: booking.guests || 1,
            adults: booking.adults || 1,
            children: booking.children || 0,
            nights: booking.nights || 1,
            total_amount: Number.parseFloat(booking.total_amount) || 0,
            status: booking.status,
            payment_status: booking.payment_status,
            created_at: booking.created_at,
          }))
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
        // Continue with empty booking data
      }
    }

    // Get basic review stats
    let reviewStats = { total: 0, averageRating: 0 }
    let recentReviews: any[] = []

    if (propertyIds.length > 0) {
      try {
        const reviewsPromise = Promise.race([
          supabase
            .from("reviews")
            .select(`
              id,
              property_id,
              reviewer_id,
              overall_rating,
              comment,
              created_at,
              properties!inner(id, title),
              user_profiles!reviews_reviewer_id_fkey(id, full_name, first_name, last_name, avatar_url)
            `)
            .in("property_id", propertyIds)
            .order("created_at", { ascending: false })
            .limit(15),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000)),
        ])

        const { data: reviewsData } = (await reviewsPromise) as any

        if (reviewsData) {
          reviewStats = {
            total: reviewsData.length,
            averageRating:
              reviewsData.length > 0
                ? reviewsData.reduce((sum: number, r: any) => sum + r.overall_rating, 0) / reviewsData.length
                : 0,
          }

          recentReviews = reviewsData.slice(0, 8).map((review: any) => ({
            id: review.id,
            reviewer: {
              id: review.user_profiles?.id || review.reviewer_id,
              first_name: review.user_profiles?.first_name || "Guest",
              last_name: review.user_profiles?.last_name || "",
              full_name: review.user_profiles?.full_name || "Guest User",
              avatar_url: review.user_profiles?.avatar_url,
            },
            property: {
              id: review.properties?.id || review.property_id,
              title: review.properties?.title || "Property",
            },
            overall_rating: review.overall_rating,
            comment: review.comment,
            created_at: review.created_at,
          }))
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
        // Continue with empty review data
      }
    }

    // Format properties with basic stats
    const propertiesWithStats = safeProperties.map((property: any) => ({
      id: property.id,
      title: property.title || "Untitled Property",
      property_type: property.property_type || "apartment",
      room_type: property.room_type || "entire_place",
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      max_guests: property.max_guests || 2,
      price_per_night: Number.parseFloat(property.price_per_night) || 0,
      location: `${property.city || "Unknown"}, ${property.country || "Unknown"}`,
      average_rating: property.average_rating || 0,
      review_count: 0, // Will be calculated separately if needed
      bookings_count: 0, // Will be calculated separately if needed
      total_earnings: 0, // Will be calculated separately if needed
      monthly_earnings: 0, // Will be calculated separately if needed
      occupancy_rate: 0, // Will be calculated separately if needed
      status: property.is_active ? "active" : "inactive",
      is_featured: property.is_featured || false,
      images: Array.isArray(property.images)
        ? property.images.map((url: string, index: number) => ({
            image_url: url,
            is_primary: index === 0,
          }))
        : [],
    }))

    const dashboardData = {
      hostProfile: {
        id: hostProfile.id,
        full_name: hostProfile.full_name || "Host User",
        first_name: hostProfile.first_name,
        last_name: hostProfile.last_name,
        email: hostProfile.email,
        avatar_url: hostProfile.avatar_url,
        phone: hostProfile.phone,
        bio: hostProfile.bio,
        is_host: hostProfile.is_host || false,
        is_verified: hostProfile.is_verified || false,
        is_superhost: hostProfile.is_superhost || false,
        host_since: hostProfile.host_since,
        response_rate: hostProfile.response_rate || 95,
        response_time: hostProfile.response_time || "within an hour",
        acceptance_rate: hostProfile.acceptance_rate || 85,
        languages: hostProfile.languages || ["English"],
        total_earnings: Number.parseFloat(hostProfile.total_earnings) || bookingStats.totalEarnings,
        total_bookings: hostProfile.total_bookings || bookingStats.total,
      },
      stats: {
        totalEarnings: Math.round(bookingStats.totalEarnings * 100) / 100,
        monthlyEarnings: Math.round(bookingStats.monthlyEarnings * 100) / 100,
        totalBookings: bookingStats.total,
        pendingBookings: bookingStats.pending,
        confirmedBookings: bookingStats.confirmed,
        cancelledBookings: bookingStats.cancelled,
        inProgressBookings: 0,
        totalReviews: reviewStats.total,
        averageRating: Math.round(reviewStats.averageRating * 10) / 10,
        totalProperties: safeProperties.length,
        activeProperties: safeProperties.filter((p: any) => p.is_active).length,
        featuredProperties: safeProperties.filter((p: any) => p.is_featured).length,
        occupancyRate: 75, // Placeholder
        responseRate: hostProfile.response_rate || 95,
        acceptanceRate: hostProfile.acceptance_rate || 85,
      },
      properties: propertiesWithStats,
      recentBookings,
      recentReviews,
      messages: [], // Empty for now
    }

    // Cache the result
    dashboardCache.set(cacheKey, { data: dashboardData, timestamp: Date.now() })

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error in dashboard API:", error)
    return NextResponse.json(
      {
        error: "Unable to load dashboard data. Please try again in a moment.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
