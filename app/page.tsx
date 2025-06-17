"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Coffee,
  Waves,
  Shield,
  TrendingUp,
  Globe,
  Award,
  ChevronRight,
  Play,
  ChevronDown,
  User,
  Settings,
  Mail,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {useAuth} from "@/lib/auth"
import { useRouter } from "next/navigation"

const featuredProperties = [
  {
    id: 1,
    title: "Modern Beachfront Villa",
    location: "Malibu, California",
    price: 450,
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    amenities: ["Wifi", "Pool", "Beach Access", "Parking"],
    host: "Sarah Chen",
    isWishlisted: false,
    instantBook: true,
  },
  {
    id: 2,
    title: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    price: 280,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    amenities: ["Wifi", "Fireplace", "Hot Tub", "Ski Access"],
    host: "Mike Johnson",
    isWishlisted: true,
    instantBook: false,
  },
  {
    id: 3,
    title: "Downtown Luxury Loft",
    location: "New York, NY",
    price: 320,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    amenities: ["Wifi", "Gym", "Rooftop", "Concierge"],
    host: "Emma Davis",
    isWishlisted: false,
    instantBook: true,
  },
  {
    id: 4,
    title: "Tropical Paradise Bungalow",
    location: "Tulum, Mexico",
    price: 180,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    amenities: ["Wifi", "Beach", "Yoga Deck", "Cenote"],
    host: "Carlos Rodriguez",
    isWishlisted: false,
    instantBook: true,
  },
]

const categories = [
  {
    name: "Beachfront",
    icon: Waves,
    count: 1247,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
  },
  {
    name: "Mountain",
    icon: MapPin,
    count: 892,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  },
  {
    name: "City",
    icon: Coffee,
    count: 2156,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
  },
  {
    name: "Unique",
    icon: Star,
    count: 634,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    comment:
      "StayFinder made our family vacation unforgettable. The villa was exactly as described and the host was incredibly responsive.",
    propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=80&h=60&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    comment:
      "As a frequent business traveler, I appreciate the quality and consistency of StayFinder properties. Always a great experience.",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&h=60&fit=crop",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    comment:
      "The booking process was seamless and the property exceeded our expectations. We'll definitely be using StayFinder again!",
    propertyImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=80&h=60&fit=crop",
  },
]

const hostBenefits = [
  {
    icon: TrendingUp,
    title: "Earn Extra Income",
    description: "Make money from your unused space with competitive pricing tools and market insights.",
    stat: "Average $924/month",
  },
  {
    icon: Shield,
    title: "Host Protection",
    description: "Comprehensive insurance coverage and 24/7 support to protect you and your property.",
    stat: "$1M coverage",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with travelers from around the world and share your local culture.",
    stat: "190+ countries",
  },
  {
    icon: Award,
    title: "Recognition Program",
    description: "Earn Superhost status and exclusive benefits for providing exceptional experiences.",
    stat: "Top 10% hosts",
  },
]

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  })
  const handleMenuClick = (action: string) => {
    router.push(`/${action}`);
  };
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchData.location) params.set("location", searchData.location)
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn)
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut)
    if (searchData.guests) params.set("guests", searchData.guests)

    window.location.href = `/listings?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">SF</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                StayFinder
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/listings" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Explore
              </Link>
              <Link href="/become-host" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Become a Host
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Help
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/host/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 transition-colors">
                  Host Dashboard
                </Button>
              </Link>
             
               <DropdownMenu>
              {user ? (
              
<>
 <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 px-3 py-2">
                  <div className="flex items-center space-x-2">
                     <Button variant="ghost" size="sm" className="hover:bg-gray-100 transition-colors">
                    <Image
                      src={user.avatar_url || "./placeholder-user.jpg"}
                      alt={user.full_name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    </Button>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuClick('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleMenuClick('setting')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleMenuClick('support')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleMenuClick('logout')}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
              
</>
              ) : (
              <>
               <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                  >
                    Sign up
                  </Button>
                </motion.div>
              </Link>
              </>
              )}
             
            </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop"
            alt="Beautiful vacation rental"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-10">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Find your perfect
              <motion.span
                className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {" "}
                stay
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Discover unique places to stay around the world. From cozy apartments to luxury villas, find
              accommodations that feel like home.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              // Removed invalid 'shadow' property from whileHover
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Where</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search destinations"
                      className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
                      value={searchData.location}
                      onChange={(e) => setSearchData((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Check out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Add guests"
                      className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
                      value={searchData.guests}
                      onChange={(e) => setSearchData((prev) => ({ ...prev, guests: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Categories */}
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/listings?category=${category.name.toLowerCase()}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardContent className="p-4 text-center">
                      <category.icon className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-gray-500">{category.count} properties</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Properties */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured stays</h2>
            <Link href="/listings">
              <Button variant="outline" className="group">
                View all
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${property.isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </motion.button>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <Badge className="bg-white text-gray-900">Superhost</Badge>
                      {property.instantBook && <Badge className="bg-pink-500 text-white">Instant Book</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">Hosted by {property.host}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold">${property.price}</span>
                        <span className="text-gray-500"> / night</span>
                      </div>
                      <Link href={`/property/${property.id}`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Become a Host Section */}
      <AnimatedSection className="py-20 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Earn money as a StayFinder Host</h2>
              <p className="text-xl mb-8 text-pink-100">
                Share your space and create unforgettable experiences for travelers from around the world.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {hostBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <benefit.icon className="h-8 w-8 mx-auto mb-2 text-pink-200" />
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-pink-100 mb-2">{benefit.description}</p>
                    <p className="font-bold text-lg">{benefit.stat}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/become-host">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 w-full sm:w-auto">
                      Start Hosting
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                  alt="Happy host"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">$2,340</p>
                      <p className="text-sm text-gray-600">earned this month</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What our guests say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                    <div className="ml-auto">
                      <Image
                        src={testimonial.propertyImage || "/placeholder.svg"}
                        alt="Property"
                        width={60}
                        height={40}
                        className="rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10M+", label: "Happy Guests", icon: Users },
              { number: "500K+", label: "Properties", icon: MapPin },
              { number: "190+", label: "Countries", icon: Globe },
              { number: "4.8", label: "Average Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <span className="text-xl font-bold">StayFinder</span>
              </div>
              <p className="text-gray-400 mb-4">
                Find your perfect stay anywhere in the world with our curated collection of unique properties.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-full" />
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                {["Help Center", "Safety Information", "Cancellation Options", "Contact Us"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                {["Become a Host", "Referrals", "Community Forum", "Events"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                {["About", "Careers", "Press", "Investors"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StayFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
