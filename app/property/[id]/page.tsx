"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Star,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Users,
  Bed,
  Bath,
  Home,
  Calendar,
  Clock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useParams } from "next/navigation"

interface Property {
  id: string
  title: string
  description: string
  city: string
  country: string
  address: string
  price_per_night: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  beds: number
  property_type: string
  room_type: string
  host_id: string
  cleaning_fee: number
  extra_guest_fee: number
  service_fee_percentage: number
  minimum_stay: number
  maximum_stay: number
  check_in_time: string
  check_out_time: string
  house_rules: string
  cancellation_policy: string
  instant_book: boolean
  average_rating: number
  review_count: number
  images: string[]
  amenities: string[]
  host?: {
    id: string
    first_name: string
    last_name: string
    full_name: string
    avatar_url?: string
    is_superhost?: boolean
    is_verified?: boolean
    bio?: string
    response_rate?: number
    response_time?: string
    joined_date?: string
  }
  property_images?: Array<{
    image_url: string
    is_primary: boolean
  }>
}

export default function PropertyPage() {
  const params = useParams()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [specialRequests, setSpecialRequests] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [contactMessage, setContactMessage] = useState("")

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchProperty()
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${propertyId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError("Property not found")
        } else {
          setError("Failed to load property")
        }
        return
      }

      const data = await response.json()
      setProperty(data.property)
    } catch (error) {
      console.error("Error fetching property:", error)
      setError("Failed to load property")
    } finally {
      setLoading(false)
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]

  // Set minimum checkout date to day after checkin
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : today

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !property) return null

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    if (nights <= 0) return null

    const baseAmount = nights * property.price_per_night
    const cleaningFee = property.cleaning_fee || 0
    const extraGuestFee = guests > 2 ? (guests - 2) * (property.extra_guest_fee || 0) : 0
    const serviceFee = baseAmount * ((property.service_fee_percentage || 14) / 100)
    const taxes = baseAmount * 0.08

    return {
      nights,
      baseAmount,
      cleaningFee,
      extraGuestFee,
      serviceFee,
      taxes,
      total: baseAmount + cleaningFee + extraGuestFee + serviceFee + taxes,
    }
  }

  const booking = calculateTotal()

  const handleReservation = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates")
      return
    }

    if (!booking) {
      setBookingError("Invalid date selection")
      return
    }

    if (guests > property!.max_guests) {
      setBookingError(`Maximum ${property!.max_guests} guests allowed`)
      return
    }

    setIsBooking(true)
    setBookingError("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: propertyId,
          guest_id: user.id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          guests,
          special_requests: specialRequests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      setBookingSuccess(true)
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (error: any) {
      setBookingError(error.message)
    } finally {
      setIsBooking(false)
    }
  }

  const handleContactHost = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!contactMessage.trim()) {
      return
    }

    try {
      // Here you would send the message to the host
      alert("Message sent to host successfully!")
      setContactMessage("")
      setShowContactDialog(false)
    } catch (error) {
      alert("Failed to send message")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link href="/listings">
                <Button className="w-full">Browse All Properties</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return null
  }

  const images =
    property.property_images ||
    property.images?.map((url, index) => ({ image_url: url, is_primary: index === 0 })) ||
    []
  const primaryImage =
    images.find((img) => img.is_primary)?.image_url || images[0]?.image_url || "/placeholder.svg?height=400&width=600"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{property.average_rating || 4.8}</span>
              <span>({property.review_count || 0} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>
                {property.city}, {property.country}
              </span>
            </div>
            {property.instant_book && (
              <Badge variant="secondary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Instant Book
              </Badge>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-96">
          <div className="col-span-2 row-span-2">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-full cursor-pointer group">
                  <Image
                    src={images[selectedImage]?.image_url || primaryImage}
                    alt="Property main image"
                    fill
                    className="object-cover rounded-l-lg group-hover:brightness-90 transition-all"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative">
                  <Image
                    src={images[selectedImage]?.image_url || primaryImage}
                    alt="Property image"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                        onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative cursor-pointer group">
              <Image
                src={image.image_url || "/placeholder.svg?height=200&width=300"}
                alt={`Property image ${index + 2}`}
                fill
                className="object-cover rounded-r-lg group-hover:brightness-90 transition-all"
                onClick={() => setSelectedImage(index + 1)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {property.room_type.replace("_", " ")} • {property.property_type} hosted by{" "}
                  {property.host?.first_name} {property.host?.last_name}
                </h2>
                <Avatar>
                  <AvatarImage src={property.host?.avatar_url || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>
                    {property.host?.first_name?.[0]}
                    {property.host?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{property.max_guests} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.beds} beds</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                {property.host?.is_superhost && (
                  <Badge className="bg-pink-100 text-pink-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Superhost
                  </Badge>
                )}
                {property.host?.is_verified && (
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Host
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            <Separator />

            {/* Check-in Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Check-in details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{property.check_in_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">{property.check_out_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Minimum stay</p>
                    <p className="text-gray-600">{property.minimum_stay} nights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Maximum stay</p>
                    <p className="text-gray-600">{property.maximum_stay} nights</p>
                  </div>
                </div>
              </div>
            </div>

            {property.house_rules && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-4">House rules</h3>
                  <p className="text-gray-700 whitespace-pre-line">{property.house_rules}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Cancellation Policy */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Cancellation policy</h3>
              <p className="text-gray-700 capitalize">{property.cancellation_policy} cancellation</p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">${property.price_per_night}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.average_rating || 4.8}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{bookingError}</AlertDescription>
                  </Alert>
                )}

                {bookingSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Booking request submitted successfully! Redirecting to your bookings...
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="checkin">Check-in</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={today}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="checkout">Check-out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={minCheckOut}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="guests">Guests</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.min(property.max_guests, guests + 1))}
                      disabled={guests >= property.max_guests}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Maximum {property.max_guests} guests</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="requests">Special requests (optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any special requests or notes for the host..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                  onClick={handleReservation}
                  disabled={isBooking || !checkIn || !checkOut}
                >
                  {isBooking ? "Processing..." : property.instant_book ? "Instant Book" : "Request to Book"}
                </Button>

                <p className="text-center text-sm text-gray-600">You won't be charged yet</p>

                {booking && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>
                        ${property.price_per_night} x {booking.nights} nights
                      </span>
                      <span>${booking.baseAmount.toFixed(2)}</span>
                    </div>
                    {booking.cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>${booking.cleaningFee.toFixed(2)}</span>
                      </div>
                    )}
                    {booking.extraGuestFee > 0 && (
                      <div className="flex justify-between">
                        <span>Extra guest fee</span>
                        <span>${booking.extraGuestFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${booking.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>${booking.taxes.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${booking.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Host
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact {property.host?.first_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar>
                            <AvatarImage src={property.host?.avatar_url || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>
                              {property.host?.first_name?.[0]}
                              {property.host?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {property.host?.first_name} {property.host?.last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {property.host?.response_time || "Usually responds within an hour"}
                            </p>
                            {property.host?.response_rate && (
                              <p className="text-sm text-gray-600">{property.host.response_rate}% response rate</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Host
                          </Button>
                          <Button variant="outline" className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Host
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Hi! I'm interested in your property..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <Button onClick={handleContactHost} className="w-full" disabled={!contactMessage.trim()}>
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
