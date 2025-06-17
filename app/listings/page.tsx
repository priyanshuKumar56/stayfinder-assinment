"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star, Users, Bed, Bath, Wifi, Car, Coffee, Heart, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { motion } from "framer-motion"

interface Property {
  id: string
  title: string
  description: string
  property_type: string
  address: string
  city: string
  state?: string
  country: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  price_per_night: number
  cleaning_fee: number
  images: string[]
  amenities: string[]
  average_rating: number
  review_count: number
  host: {
    id: string
    full_name: string
    first_name: string
    last_name: string
    avatar_url?: string
    is_superhost?: boolean
    is_verified: boolean
  }
  instant_book: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const propertyTypes = [
  { value: "any", label: "Any type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabin" },
  { value: "loft", label: "Loft" },
  { value: "studio", label: "Studio" },
]

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
]

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [country, setCountry] = useState(searchParams.get("country") || "")
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "any")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [guests, setGuests] = useState(searchParams.get("guests") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recommended")
  const [showFilters, setShowFilters] = useState(false)

  const fetchProperties = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(city && { city }),
        ...(country && { country }),
        ...(propertyType !== "any" && { propertyType }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(guests && { guests }),
        sortBy,
      })

      const response = await fetch(`/api/properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
        setPagination(data.pagination)
      } else {
        console.error("Failed to fetch properties")
        setProperties([])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(1)
  }, [searchQuery, city, country, propertyType, minPrice, maxPrice, guests, sortBy])

  const handleSearch = () => {
    fetchProperties(1)
  }

  const handlePageChange = (newPage: number) => {
    fetchProperties(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

    const getPropertyImage = (property: Property) => {
    // Handle both database format (images array) and mock format
    if (property.images && property.images.length > 0) {
      // Return the first image from the array
      return property.images[0]
    }
    // Fallback to placeholder
    return "/placeholder.svg?height=300&width=400"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <div className="relative">
          <Link href={`/property/${property.id}`}>
            <div className="relative h-64 overflow-hidden">
              <Image
                src={getPropertyImage(property) || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(property.title)}`
                }}
              />
              <div className="absolute top-3 right-3">
                <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white p-2 rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              {property.instant_book && (
                <Badge className="absolute top-3 left-3 bg-pink-500 hover:bg-pink-600">Instant Book</Badge>
              )}
            </div>
          </Link>
        </div>

        <CardContent className="p-4">
          <Link href={`/property/${property.id}`} className="block">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.city}, {property.country}
                  </span>
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {property.title}
                </h3>
              </div>
              {property.average_rating > 0 && (
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{property.average_rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({property.review_count})</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{property.max_guests} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span>
                  {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4" />
                <span>
                  {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                {property.amenities.slice(0, 3).map((amenity) => {
                  const getAmenityIcon = (amenity: string) => {
                    switch (amenity.toLowerCase()) {
                      case "wifi":
                        return <Wifi className="h-3 w-3" />
                      case "parking":
                      case "free parking":
                        return <Car className="h-3 w-3" />
                      case "kitchen":
                        return <Coffee className="h-3 w-3" />
                      default:
                        return null
                    }
                  }

                  return (
                    <div key={amenity} className="flex items-center space-x-1 text-xs text-gray-500">
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  )
                })}
                {property.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">+{property.amenities.length - 3} more</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {property.host.avatar_url ? (
                  <Image
                    src={property.host.avatar_url || "/placeholder.svg"}
                    alt={property.host.full_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {property.host.first_name?.[0] || property.host.full_name?.[0] || "H"}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600">{property.host.first_name || property.host.full_name}</span>
                {property.host.is_superhost && (
                  <Badge variant="secondary" className="text-xs">
                    Superhost
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">{formatPrice(property.price_per_night)}</div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )

  const PropertySkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search and Filters */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="bg-pink-500 hover:bg-pink-600">
                Search
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Filters */}
          <div
            className={`mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${showFilters ? "block" : "hidden lg:grid"}`}
          >
            <div>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />

            <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

            <Input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{searchQuery || city ? `Search results` : "All properties"}</h1>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {pagination.total} propert{pagination.total !== 1 ? "ies" : "y"} found
              </p>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i
                  if (pageNum > pagination.totalPages) return null

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className={pageNum === pagination.page ? "bg-pink-500 hover:bg-pink-600" : ""}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available properties.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setCity("")
                  setCountry("")
                  setPropertyType("any")
                  setMinPrice("")
                  setMaxPrice("")
                  setGuests("")
                  setSortBy("recommended")
                }}
                className="bg-pink-500 hover:bg-pink-600"
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
