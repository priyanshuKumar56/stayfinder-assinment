"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users, MessageCircle, Star, CheckCircle, Clock, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"

interface Booking {
  id: string
  property: {
    id: string
    title: string
    city: string
    country: string
    images?: string[]
    property_images?: Array<{ image_url: string; is_primary: boolean }>
    host?: {
      id: string
      first_name: string
      last_name: string
      avatar_url?: string
    }
  }
  check_in_date: string
  check_out_date: string
  guests: number
  adults: number
  children: number
  infants: number
  pets: number
  nights: number
  total_amount: number
  base_amount: number
  cleaning_fee: number
  service_fee: number
  taxes: number
  extra_guest_fee: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress"
  payment_status: "pending" | "paid" | "partially_paid" | "refunded" | "failed"
  special_requests?: string
  created_at: string
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  })
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login")
        return
      }
      fetchBookings()
    }
  }, [user, authLoading, router])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        console.error("Failed to fetch bookings:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    try {
      setCancellingBooking(bookingId)
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelled_by: user?.id,
          cancellation_reason: "Cancelled by guest",
        }),
      })

      if (response.ok) {
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)))
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
    } finally {
      setCancellingBooking(null)
    }
  }

  const submitReview = async () => {
    if (!reviewDialog.booking) return

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: reviewDialog.booking.property.id,
          reviewer_id: user?.id,
          overall_rating: rating,
          comment: reviewText,
        }),
      })

      if (response.ok) {
        setReviewDialog({ open: false, booking: null })
        setReviewText("")
        setRating(5)
        // Refresh bookings to update review status
        fetchBookings()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const getPropertyImage = (booking: Booking) => {
    // Handle both property_images array and images array
    if (booking.property.property_images && booking.property.property_images.length > 0) {
      const primaryImage = booking.property.property_images.find((img) => img.is_primary)
      return primaryImage?.image_url || booking.property.property_images[0]?.image_url
    }

    if (booking.property.images && booking.property.images.length > 0) {
      return booking.property.images[0]
    }

    return "/placeholder.svg?height=200&width=300"
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your reservations and travel plans</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterBookings("pending").length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({filterBookings("confirmed").length})</TabsTrigger>
            <TabsTrigger value="in_progress">Active ({filterBookings("in_progress").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterBookings("completed").length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({filterBookings("cancelled").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {filterBookings(selectedTab).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedTab === "all" ? "You haven't made any bookings yet." : `No ${selectedTab} bookings.`}
                </p>
                <Link href="/listings">
                  <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                    Explore Properties
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {filterBookings(selectedTab).map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <Image
                          src={getPropertyImage(booking) || "/placeholder.svg"}
                          alt={booking.property.title}
                          width={400}
                          height={250}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{booking.property.title}</h3>
                            <p className="text-gray-600 flex items-center mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.property.city}, {booking.property.country}
                            </p>
                            {booking.property.host && (
                              <p className="text-sm text-gray-500">
                                Hosted by {booking.property.host.first_name} {booking.property.host.last_name}
                              </p>
                            )}
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{booking.nights} nights</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-medium flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {booking.guests} ({booking.adults}A, {booking.children}C)
                            </p>
                          </div>
                        </div>

                        {booking.special_requests && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Special Requests</p>
                            <p className="text-sm">{booking.special_requests}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold">${booking.total_amount}</p>
                            <p className="text-sm text-gray-500">
                              Total • {booking.payment_status === "paid" ? "Paid" : "Payment pending"}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            {booking.property.host && (
                              <Link href={`/messages?host=${booking.property.host.id}`}>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Message Host
                                </Button>
                              </Link>
                            )}

                            {booking.status === "pending" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingBooking === booking.id}
                              >
                                {cancellingBooking === booking.id ? "Cancelling..." : "Cancel"}
                              </Button>
                            )}

                            {booking.status === "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReviewDialog({ open: true, booking })}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Write Review
                              </Button>
                            )}

                            <Link href={`/property/${booking.property.id}`}>
                              <Button variant="outline" size="sm">
                                View Property
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open, booking: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            {reviewDialog.booking && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{reviewDialog.booking.property.title}</h4>
                  <p className="text-sm text-gray-600">
                    {reviewDialog.booking.property.city}, {reviewDialog.booking.property.country}
                  </p>
                </div>

                <div>
                  <Label>Overall Rating</Label>
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)}>
                        <Star
                          className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={submitReview} className="w-full" disabled={!reviewText.trim()}>
                  Submit Review
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
