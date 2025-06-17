"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Settings,
  Calendar,
  Star,
  DollarSign,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface HostProfile {
  id: string
  full_name: string
  first_name: string | null
  last_name: string | null
  email: string
  avatar_url: string | null
  phone: string | null
  bio: string | null
  is_host: boolean
  is_verified: boolean
  is_superhost: boolean
  host_since: string | null
  response_rate: number
  response_time: string
  acceptance_rate: number
  languages: string[]
  total_earnings: number
  total_bookings: number
}

interface DashboardData {
  hostProfile: HostProfile
  stats: {
    totalEarnings: number
    monthlyEarnings: number
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    cancelledBookings: number
    inProgressBookings: number
    totalReviews: number
    averageRating: number
    totalProperties: number
    activeProperties: number
    featuredProperties: number
    occupancyRate: number
    responseRate: number
    acceptanceRate: number
  }
  properties: Array<{
    id: string
    title: string
    location: string
    property_type: string
    room_type: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    price_per_night: number
    average_rating: number
    review_count: number
    bookings_count: number
    total_earnings: number
    monthly_earnings: number
    occupancy_rate: number
    status: string
    is_featured: boolean
    images: Array<{ image_url: string; is_primary: boolean }>
  }>
  recentBookings: Array<{
    id: string
    guest: {
      id: string
      first_name: string
      last_name: string
      full_name: string
      avatar_url?: string
      email?: string
    }
    property: {
      id: string
      title: string
      address?: string
      city?: string
      country?: string
      images?: Array<{ image_url: string; is_primary: boolean }>
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
    status: string
    payment_status: string
    special_requests?: string
    guest_message?: string
    created_at: string
  }>
  recentReviews: Array<{
    id: string
    reviewer: {
      id: string
      first_name: string
      last_name: string
      full_name: string
      avatar_url?: string
    }
    property: {
      id: string
      title: string
    }
    overall_rating: number
    cleanliness_rating?: number
    accuracy_rating?: number
    communication_rating?: number
    location_rating?: number
    check_in_rating?: number
    value_rating?: number
    comment?: string
    host_reply?: string
    host_reply_date?: string
    is_featured: boolean
    helpful_count: number
    created_at: string
  }>
  messages: Array<{
    id: string
    guest: {
      first_name: string
      last_name: string
      avatar_url?: string
    }
    message: string
    created_at: string
    is_read: boolean
  }>
}

export default function HostDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, isHost, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login")
        return
      }
      if (!isHost) {
        router.push("/")
        return
      }
      fetchDashboardData()
    }
  }, [user, isHost, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`/api/host/dashboard?hostId=${user?.id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="mt-3">
            Try Again
          </Button>
        </Alert>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Zap className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                StayFinder
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="relative">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
                {dashboardData.messages.filter((m) => !m.is_read).length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {dashboardData.messages.filter((m) => !m.is_read).length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-3">
                {dashboardData.hostProfile.is_superhost && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
                    <Award className="h-3 w-3 mr-1" />
                    Superhost
                  </Badge>
                )}
                <Avatar className="h-10 w-10 ring-2 ring-pink-200">
                  <AvatarImage src={dashboardData.hostProfile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                    {dashboardData.hostProfile.first_name?.[0] || dashboardData.hostProfile.full_name?.[0] || "H"}
                    {dashboardData.hostProfile.last_name?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-pink-200">
              <AvatarImage src={dashboardData.hostProfile.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xl">
                {dashboardData.hostProfile.first_name?.[0] || dashboardData.hostProfile.full_name?.[0] || "H"}
                {dashboardData.hostProfile.last_name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {dashboardData.hostProfile.first_name || dashboardData.hostProfile.full_name}!
                </h1>
                {dashboardData.hostProfile.is_verified && <Shield className="h-6 w-6 text-blue-500" />}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  Host since{" "}
                  {dashboardData.hostProfile.host_since
                    ? new Date(dashboardData.hostProfile.host_since).getFullYear()
                    : "Recently"}
                </span>
                <span>•</span>
                <span>{dashboardData.stats.totalProperties} properties</span>
                <span>•</span>
                <span>{dashboardData.stats.totalReviews} reviews</span>
              </div>
            </div>
          </div>
          <Link href="/host/create-property">
            <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </Link>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(dashboardData.stats.totalEarnings)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatCurrency(dashboardData.stats.monthlyEarnings)} this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-900">{dashboardData.stats.totalBookings}</p>
                      <p className="text-xs text-blue-600 mt-1">{dashboardData.stats.pendingBookings} pending</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Average Rating</p>
                      <p className="text-2xl font-bold text-yellow-900">{dashboardData.stats.averageRating}</p>
                      <p className="text-xs text-yellow-600 mt-1">{dashboardData.stats.totalReviews} reviews</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Properties</p>
                      <p className="text-2xl font-bold text-purple-900">{dashboardData.stats.totalProperties}</p>
                      <p className="text-xs text-purple-600 mt-1">{dashboardData.stats.activeProperties} active</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <Home className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{dashboardData.stats.responseRate}%</span>
                      <Badge variant={dashboardData.stats.responseRate >= 90 ? "default" : "secondary"}>
                        {dashboardData.stats.responseRate >= 90 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                    <Progress value={dashboardData.stats.responseRate} className="h-2" />
                    <p className="text-xs text-gray-600">Response time: {dashboardData.hostProfile.response_time}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Acceptance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{dashboardData.stats.acceptanceRate}%</span>
                      <Badge variant={dashboardData.stats.acceptanceRate >= 80 ? "default" : "secondary"}>
                        {dashboardData.stats.acceptanceRate >= 80 ? "Great" : "Average"}
                      </Badge>
                    </div>
                    <Progress value={dashboardData.stats.acceptanceRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{dashboardData.stats.occupancyRate}%</span>
                      <Badge variant={dashboardData.stats.occupancyRate >= 70 ? "default" : "secondary"}>
                        {dashboardData.stats.occupancyRate >= 70 ? "High" : "Moderate"}
                      </Badge>
                    </div>
                    <Progress value={dashboardData.stats.occupancyRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Recent Bookings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={booking.guest.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {booking.guest.first_name?.[0] || "G"}
                              {booking.guest.last_name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.guest.full_name}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{booking.property.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                              {new Date(booking.check_out_date).toLocaleDateString()} • {booking.nights} nights
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(booking.total_amount)}</p>
                          <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {dashboardData.recentBookings.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No bookings yet</p>
                        <p className="text-sm">
                          Your bookings will appear here once guests start booking your properties.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Recent Reviews</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentReviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.reviewer.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {review.reviewer.first_name?.[0] || "G"}
                              {review.reviewer.last_name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{review.reviewer.full_name}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{review.overall_rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{review.property.title}</p>
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-gray-700 line-clamp-2 ml-11">{review.comment}</p>}
                        {review.is_featured && (
                          <Badge variant="secondary" className="ml-11 mt-2 text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    ))}
                    {dashboardData.recentReviews.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No reviews yet</p>
                        <p className="text-sm">Guest reviews will appear here after completed stays.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {dashboardData.properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={
                          property.images.find((img) => img.is_primary)?.image_url ||
                          property.images[0]?.image_url ||
                          "/placeholder.svg?height=200&width=300" ||
                          "/placeholder.svg"
                        }
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        <Badge
                          className={`${
                            property.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"
                          } text-white`}
                        >
                          {property.status}
                        </Badge>
                        {property.is_featured && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm flex items-center mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500">Price/night</p>
                          <p className="font-semibold">{formatCurrency(property.price_per_night)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{property.average_rating}</span>
                            <span className="text-gray-500">({property.review_count})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Bookings</p>
                          <p className="font-semibold">{property.bookings_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Monthly Earnings</p>
                          <p className="font-semibold">{formatCurrency(property.monthly_earnings)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Occupancy Rate</span>
                          <span>{property.occupancy_rate}%</span>
                        </div>
                        <Progress value={property.occupancy_rate} className="h-1" />
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Link href={`/property/${property.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/host/properties/${property.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="text-center py-12">
                  <Home className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-6">Start hosting by adding your first property</p>
                  <Link href="/host/properties/new">
                    <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>All Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.guest.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {booking.guest.first_name?.[0] || "G"}
                              {booking.guest.last_name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{booking.guest.full_name}</p>
                            <p className="text-gray-600">{booking.property.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                              {new Date(booking.check_out_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.adults} adults{booking.children > 0 && `, ${booking.children} children`}
                              {booking.infants > 0 && `, ${booking.infants} infants`}
                              {booking.pets > 0 && `, ${booking.pets} pets`} • {booking.nights} nights
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatCurrency(booking.total_amount)}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Payment: <span className="capitalize">{booking.payment_status}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-gray-600">
                      Your bookings will appear here once guests start booking your properties.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>All Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentReviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.reviewer.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {review.reviewer.first_name?.[0] || "G"}
                              {review.reviewer.last_name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{review.reviewer.full_name}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{review.overall_rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.property.title}</p>
                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Detailed Ratings */}
                        {(review.cleanliness_rating || review.accuracy_rating || review.communication_rating) && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
                            {review.cleanliness_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Cleanliness</span>
                                <span className="font-medium">{review.cleanliness_rating}/5</span>
                              </div>
                            )}
                            {review.accuracy_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Accuracy</span>
                                <span className="font-medium">{review.accuracy_rating}/5</span>
                              </div>
                            )}
                            {review.communication_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Communication</span>
                                <span className="font-medium">{review.communication_rating}/5</span>
                              </div>
                            )}
                            {review.location_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Location</span>
                                <span className="font-medium">{review.location_rating}/5</span>
                              </div>
                            )}
                            {review.check_in_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Check-in</span>
                                <span className="font-medium">{review.check_in_rating}/5</span>
                              </div>
                            )}
                            {review.value_rating && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Value</span>
                                <span className="font-medium">{review.value_rating}/5</span>
                              </div>
                            )}
                          </div>
                        )}

                        {review.comment && (
                          <div className="mb-3">
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        )}

                        {review.host_reply && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">Your reply:</p>
                            <p className="text-sm text-blue-800">{review.host_reply}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {review.is_featured && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {review.helpful_count > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {review.helpful_count} helpful
                              </Badge>
                            )}
                          </div>
                          {!review.host_reply && (
                            <Button variant="outline" size="sm">
                              Reply
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Guest reviews will appear here after completed stays.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Host Profile Card */}
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Host Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 ring-4 ring-pink-200">
                      <AvatarImage src={dashboardData.hostProfile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-2xl">
                        {dashboardData.hostProfile.first_name?.[0] || dashboardData.hostProfile.full_name?.[0] || "H"}
                        {dashboardData.hostProfile.last_name?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{dashboardData.hostProfile.full_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {dashboardData.hostProfile.is_superhost && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                            <Award className="h-3 w-3 mr-1" />
                            Superhost
                          </Badge>
                        )}
                        {dashboardData.hostProfile.is_verified && (
                          <Badge variant="secondary">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Host since{" "}
                        {dashboardData.hostProfile.host_since
                          ? new Date(dashboardData.hostProfile.host_since).getFullYear()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{dashboardData.hostProfile.email}</span>
                      </div>
                      {dashboardData.hostProfile.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{dashboardData.hostProfile.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">{dashboardData.hostProfile.languages?.join(", ") || "English"}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-600">Total Earnings:</span>
                        <span className="font-semibold ml-2">
                          {formatCurrency(dashboardData.hostProfile.total_earnings)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Total Bookings:</span>
                        <span className="font-semibold ml-2">{dashboardData.hostProfile.total_bookings}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-semibold ml-2">{dashboardData.hostProfile.response_time}</span>
                      </div>
                    </div>
                  </div>

                  {dashboardData.hostProfile.bio && (
                    <div>
                      <h4 className="font-semibold mb-2">About</h4>
                      <p className="text-gray-700">{dashboardData.hostProfile.bio}</p>
                    </div>
                  )}

                  <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(dashboardData.stats.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Properties</span>
                      <span className="font-semibold">{dashboardData.stats.totalProperties}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className="font-semibold text-green-600">{dashboardData.stats.activeProperties}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Featured</span>
                      <span className="font-semibold text-yellow-600">{dashboardData.stats.featuredProperties}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-semibold">{formatCurrency(dashboardData.stats.monthlyEarnings)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bookings</span>
                        <span className="font-semibold">{dashboardData.stats.totalBookings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Reviews</span>
                        <span className="font-semibold">{dashboardData.stats.totalReviews}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
