import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        *,
        amenities,
        host:user_profiles!properties_host_id_fkey(
          id,
          full_name,
          first_name,
          last_name,
          avatar_url,
          is_superhost,
          is_verified,
          bio,
          response_rate,
          response_time
          
        )
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching property:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Property not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
    }
 
    const transformedProperty = {
      ...property,
      property_images:
        property.images?.map((url: string, index: number) => ({
          id: `${property.id}-${index}`,
          image_url: url,
          alt_text: `${property.title} - Image ${index + 1}`,
          is_primary: index === 0,
          sort_order: index,
        })) || [],
      amenities: property.amenities
          || [], // Will be populated when amenities table is created
    }
    

    return NextResponse.json({ property: transformedProperty })
  } catch (error) {
    console.error("Error in property detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
