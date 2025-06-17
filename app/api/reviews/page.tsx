import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        reviewer:user_profiles!reviews_reviewer_id_fkey(
          id,
          full_name,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { property_id, reviewer_id, overall_rating, comment } = body

    // Validate required fields
    if (!property_id || !reviewer_id || !overall_rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating range
    if (overall_rating < 1 || overall_rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Create review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert([
        {
          property_id,
          reviewer_id,
          overall_rating,
          comment,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    // Update property average rating and review count
    const { data: allReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("overall_rating")
      .eq("property_id", property_id)

    if (!reviewsError && allReviews) {
      const averageRating = allReviews.reduce((sum, r) => sum + r.overall_rating, 0) / allReviews.length
      const reviewCount = allReviews.length

      await supabase
        .from("properties")
        .update({
          average_rating: Math.round(averageRating * 100) / 100,
          review_count: reviewCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", property_id)
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Error in create review API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
