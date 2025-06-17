import { createClient } from "@supabase/supabase-js"
// import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "stayfinder-app",
    },
  },
})

// Server-side client for API routes - FIXED
export function createServerClient() {
  // const cookieStore = cookies()
  
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey, // Use service role key if available
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          "x-client-info": "stayfinder-server",
        },
      },
      // IMPORTANT: For server-side authentication
    }
  )
}

// Rate limiting helper
const requestCache = new Map()
const CACHE_DURATION = 30000 // 30 seconds
const MAX_REQUESTS_PER_MINUTE = 60

export function withRateLimit<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const cacheKey = `${key}_${Math.floor(now / CACHE_DURATION)}`

  // Check if we have a cached result
  if (requestCache.has(cacheKey)) {
    return Promise.resolve(requestCache.get(cacheKey))
  }

  // Execute the function and cache the result
  return fn().then((result) => {
    requestCache.set(cacheKey, result)

    // Clean up old cache entries
    setTimeout(() => {
      requestCache.delete(cacheKey)
    }, CACHE_DURATION)

    return result
  })
}

// Production-ready types
export interface User {
  id: string
  email: string
  full_name: string
  first_name: string
  last_name: string
  avatar_url?: string
  phone?: string
  is_host: boolean
  is_verified: boolean
  is_superhost?: boolean
  response_rate?: number
  response_time?: string
  acceptance_rate?: number
  bio?: string
  work?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  host_id: string
  title: string
  description: string
  property_type: string
  address: string
  city: string
  state?: string
  country: string
  postal_code?: string
  latitude?: number
  longitude?: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  beds: number
  price_per_night: number
  cleaning_fee: number
  service_fee_percentage: number
  is_active: boolean
  instant_book: boolean
  minimum_stay: number
  maximum_stay: number
  check_in_time: string
  check_out_time: string
  images: string[]
  amenities: string[]
  average_rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  property_id: string
  guest_id: string
  check_in_date: string
  check_out_date: string
  guests: number
  total_amount: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  taxes: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded" | "failed"
  stripe_payment_intent_id?: string
  special_requests?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  property_id: string
  rating: number
  comment?: string
  cleanliness_rating?: number
  accuracy_rating?: number
  communication_rating?: number
  location_rating?: number
  check_in_rating?: number
  value_rating?: number
  created_at: string
}
