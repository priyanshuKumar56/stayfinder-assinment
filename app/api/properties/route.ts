import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const city = searchParams.get("city")
    const country = searchParams.get("country")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const propertyType = searchParams.get("propertyType")
    const guests = searchParams.get("guests")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const search = searchParams.get("search")

    let query = supabase
      .from("properties")
      .select(`
        *,
        host:user_profiles!properties_host_id_fkey(
          id,
          full_name,
          first_name,
          last_name,
          avatar_url,
          is_superhost,
          is_verified
        )
      `)
      .eq("is_active", true)

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,country.ilike.%${search}%`)
    }

    // Apply filters
    if (city) {
      query = query.ilike("city", `%${city}%`)
    }

    if (country) {
      query = query.ilike("country", `%${country}%`)
    }

    if (minPrice) {
      query = query.gte("price_per_night", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price_per_night", Number.parseFloat(maxPrice))
    }

    if (propertyType && propertyType !== "any") {
      query = query.eq("property_type", propertyType)
    }

    if (guests) {
      query = query.gte("max_guests", Number.parseInt(guests))
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        query = query.order("price_per_night", { ascending: true })
        break
      case "price-high":
        query = query.order("price_per_night", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "rating":
        query = query.order("average_rating", { ascending: false })
        break
      case "recommended":
        // Sort by a combination of rating and review count
        query = query.order("average_rating", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: properties, error, count } = await query.range(from, to)

    if (error) {
      console.error("Error fetching properties:", error)
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedProperties = properties?.map((property) => ({
      ...property,
      // Use the existing average_rating and review_count from the database
      average_rating: property.average_rating || 0,
      review_count: property.review_count || 0,
      // Ensure images is always an array
      images: Array.isArray(property.images) ? property.images : [],
      // Parse amenities if it's a string
      amenities: Array.isArray(property.amenities)
        ? property.amenities
        : typeof property.amenities === "string"
          ? property.amenities.split(",").map((a: string) => a.trim())
          : [],
    }))

    return NextResponse.json({
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in properties API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
 
 
    

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting property creation ===")
    
    // Get request body first
    const body = await request.json()
  

    // Create server client
    const supabase = createServerClient()
    
    // CRITICAL FIX: Get session from Authorization header
    const authHeader = request.headers.get('Authorization')
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Missing or invalid Authorization header")
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    // Extract token and set session
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
   
    
    if (userError || !user) {
      
      return NextResponse.json({ 
        error: "Authentication failed", 
        details: userError?.message 
      }, { status: 401 })
    }

    // Validate required fields
    const requiredFields = ['property_type', 'address', 'city', 'country', 'title', 'description']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      
      return NextResponse.json({ 
        error: "Missing required fields", 
        fields: missingFields 
      }, { status: 400 })
    }

    // Prepare property data with proper defaults
    const propertyData = {
      // Required fields
      property_type: body.property_type,
      address: body.address,
      city: body.city,
      state: body.state || '',
      country: body.country,
      postal_code: body.postal_code || '',
      
      // Numeric fields with defaults
      bedrooms: Number(body.bedrooms) || 1,
      bathrooms: Number(body.bathrooms) || 1,
      max_guests: Number(body.max_guests) || 2,
      beds: Number(body.beds) || 1,
      price_per_night: Number(body.price_per_night) || 100,
      cleaning_fee: Number(body.cleaning_fee) || 0,
      service_fee_percentage: Number(body.service_fee_percentage) || 3,
      minimum_stay: Number(body.minimum_stay) || 1,
      maximum_stay: Number(body.maximum_stay) || 30,
      
      // Text fields
      title: body.title,
      description: body.description,
      
      // Array fields - ensure they're arrays
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      images: Array.isArray(body.images) ? body.images : [],
      
      // Time fields
      check_in_time: body.check_in_time || '15:00',
      check_out_time: body.check_out_time || '11:00',
      
      // Boolean fields
      instant_book: Boolean(body.instant_book),
      
      // System fields
      host_id: user.id,
      is_active: true,
      average_rating: 0,
      review_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Prepared property data:", {
      ...propertyData,
      images: propertyData.images.length,
      amenities: propertyData.amenities.length
    })

    // Insert into database
    const { data: property, error: insertError } = await supabase
      .from("properties")
      .insert([propertyData])
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ 
        error: "Failed to create property", 
        details: insertError.message,
        hint: insertError.hint,
        code: insertError.code
      }, { status: 500 })
    }

    console.log("Property created successfully:", property.id)
    return NextResponse.json({ property }, { status: 201 })
    
  } catch (error) {
    console.error("Unexpected error in create property API:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
