"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Bed,
  Bath,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Wifi,
  Car,
  Coffee,
  Waves,
  Home,
  MapPin,
  Camera,
  FileText,
  Settings,
  Check,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/header"

const propertyTypes = [
  { id: "apartment", name: "Apartment", description: "A place within a building", icon: "🏠" },
  { id: "house", name: "House", description: "A standalone home", icon: "🏡" },
  { id: "villa", name: "Villa", description: "A luxury residence", icon: "🏖️" },
  { id: "cabin", name: "Cabin", description: "A rustic retreat", icon: "🏕️" },
  { id: "loft", name: "Loft", description: "An open-plan space", icon: "🏢" },
  { id: "studio", name: "Studio", description: "A compact living space", icon: "🏠" },
]

const amenities = [
  { id: "wifi", name: "WiFi", icon: Wifi, category: "basic" },
  { id: "kitchen", name: "Kitchen", icon: Coffee, category: "basic" },
  { id: "parking", name: "Free parking", icon: Car, category: "basic" },
  { id: "pool", name: "Pool", icon: Waves, category: "features" },
  { id: "hot_tub", name: "Hot tub", icon: Waves, category: "features" },
  { id: "gym", name: "Gym", icon: Users, category: "features" },
  { id: "air_conditioning", name: "Air conditioning", icon: Settings, category: "basic" },
  { id: "heating", name: "Heating", icon: Settings, category: "basic" },
  { id: "washer", name: "Washer", icon: Settings, category: "basic" },
  { id: "dryer", name: "Dryer", icon: Settings, category: "basic" },
  { id: "tv", name: "TV", icon: Settings, category: "basic" },
  { id: "workspace", name: "Dedicated workspace", icon: Settings, category: "features" },
]

interface PropertyData {
  property_type: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  beds: number
  title: string
  description: string
  amenities: string[]
  images: string[]
  price_per_night: number
  cleaning_fee: number
  service_fee_percentage: number
  minimum_stay: number
  maximum_stay: number
  check_in_time: string
  check_out_time: string
  instant_book: boolean
}

const steps = [
  { id: 1, title: "Property Type", icon: Home },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Basics", icon: Users },
  { id: 4, title: "Amenities", icon: Settings },
  { id: 5, title: "Photos", icon: Camera },
  { id: 6, title: "Details", icon: FileText },
  { id: 7, title: "Pricing", icon: DollarSign },
]

export default function CreatePropertyPage() {
  const { user, isHost } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [data, setData] = useState<PropertyData>({
    property_type: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    beds: 1,
    title: "",
    description: "",
    amenities: [],
    images: [],
    price_per_night: 100,
    cleaning_fee: 25,
    service_fee_percentage: 3,
    minimum_stay: 1,
    maximum_stay: 30,
    check_in_time: "15:00",
    check_out_time: "11:00",
    instant_book: false,
  })

  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100

  // Redirect if not a host
  if (user && !isHost) {
    router.push("/become-host")
    return null
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAmenityToggle = (amenityId: string) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setImageUploading(true)
    try {
      // In a real app, you would upload to a service like Supabase Storage, AWS S3, etc.
      // For now, we'll create object URLs (this is just for demo purposes)
      const imageUrls = files.map((file) => URL.createObjectURL(file))

      setData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls].slice(0, 10), // Max 10 images
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

 const handleSubmit = async () => {
  console.log("=== Starting submission ===")
  console.log("Current data:", {
    ...data,
    images: data.images.length,
    amenities: data.amenities.length
  })
  
  setLoading(true)
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log("Session check:", {
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      userId: session?.user?.id,
      error: sessionError?.message
    })

    if (sessionError || !session?.access_token) {
      console.log("No valid session, redirecting to login")
      alert("Please log in to create a property")
      router.push("/auth/login")
      return
    }

    // Validate required fields on frontend too
    const requiredFields = [
      { field: 'property_type', value: data.property_type, name: 'Property Type' },
      { field: 'address', value: data.address, name: 'Address' },
      { field: 'city', value: data.city, name: 'City' },
      { field: 'country', value: data.country, name: 'Country' },
      { field: 'title', value: data.title, name: 'Title' },
      { field: 'description', value: data.description, name: 'Description' },
    ]

    const missingFields = requiredFields.filter(field => !field.value?.trim())
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.map(f => f.name).join(', ')}`)
      return
    }

    if (data.images.length < 3) {
      alert("Please upload at least 3 images")
      return
    }

    console.log("Making API request...")
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })

    console.log("Response status:", response.status)
    const result = await response.json()
    console.log("Response data:", result)

    if (response.ok) {
      console.log("Property created successfully!")
      router.push(`/host/dashboard?success=property-created&id=${result.property.id}`)
    } else {
      console.error("API error:", result)
      alert(`Failed to create property: ${result.details || result.error || "Please try again."}`)
    }
  } catch (error) {
    console.error("Submission error:", error)
    alert(`Failed to create property: ${error instanceof Error ? error.message : "Please try again."}`)
  } finally {
    setLoading(false)
  }
}

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.property_type !== ""
      case 2:
        return data.address && data.city && data.country
      case 3:
        return data.bedrooms > 0 && data.bathrooms > 0 && data.max_guests > 0
      case 4:
        return true // Amenities are optional
      case 5:
        return data.images.length >= 3 // Minimum 3 images
      case 6:
        return data.title && data.description
      case 7:
        return data.price_per_night > 0
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">What type of place will you host?</h2>
              <p className="text-gray-600">Choose the option that best describes your property.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {propertyTypes.map((type) => (
                <motion.div key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      data.property_type === type.id ? "ring-2 ring-pink-500 bg-pink-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setData((prev) => ({ ...prev, property_type: type.id }))}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Where's your place located?</h2>
              <p className="text-gray-600">Your address is only shared with guests after they book.</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={data.state}
                    onChange={(e) => setData((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="California"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={data.country}
                    onValueChange={(value) => setData((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="MX">Mexico</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={data.postal_code}
                    onChange={(e) => setData((prev) => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="94102"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Share some basics about your place</h2>
              <p className="text-gray-600">You'll add more details later, like bed types.</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
              {[
                { label: "Bedrooms", value: data.bedrooms, key: "bedrooms", icon: Bed },
                { label: "Bathrooms", value: data.bathrooms, key: "bathrooms", icon: Bath },
                { label: "Maximum guests", value: data.max_guests, key: "max_guests", icon: Users },
                { label: "Beds", value: data.beds, key: "beds", icon: Bed },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-6 w-6 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setData((prev) => ({ ...prev, [item.key]: Math.max(1, item.value - 1) }))}
                      disabled={item.value <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{item.value}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setData((prev) => ({ ...prev, [item.key]: item.value + 1 }))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Tell guests what your place has to offer</h2>
              <p className="text-gray-600">You can add more amenities after you publish your listing.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <motion.div key={amenity.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all ${
                        data.amenities.includes(amenity.id) ? "ring-2 ring-pink-500 bg-pink-50" : "hover:shadow-md"
                      }`}
                      onClick={() => handleAmenityToggle(amenity.id)}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        <amenity.icon className="h-6 w-6 text-gray-600" />
                        <span className="font-medium">{amenity.name}</span>
                        {data.amenities.includes(amenity.id) && (
                          <div className="ml-auto w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                            <Check className="text-white w-3 h-3" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Add some photos of your place</h2>
              <p className="text-gray-600">
                You'll need at least 3 photos to get started. You can add more or make changes later.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={imageUploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    {imageUploading ? "Uploading..." : "Drag your photos here"}
                  </p>
                  <p className="text-gray-600 mb-4">Choose at least 3 photos</p>
                  <Button variant="outline" disabled={imageUploading}>
                    {imageUploading ? "Uploading..." : "Upload from your device"}
                  </Button>
                </label>
              </div>

              {data.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && <Badge className="absolute bottom-2 left-2 bg-pink-500">Cover photo</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Now, let's give your place a title</h2>
              <p className="text-gray-600">Short titles work best. Have fun with it—you can always change it later.</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Cozy apartment in the heart of the city"
                  maxLength={50}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{data.title.length}/50</p>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your place to guests. What makes it special?"
                  rows={6}
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{data.description.length}/500</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check_in_time">Check-in time</Label>
                  <Input
                    id="check_in_time"
                    type="time"
                    value={data.check_in_time}
                    onChange={(e) => setData((prev) => ({ ...prev, check_in_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="check_out_time">Check-out time</Label>
                  <Input
                    id="check_out_time"
                    type="time"
                    value={data.check_out_time}
                    onChange={(e) => setData((prev) => ({ ...prev, check_out_time: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Now for the fun part—set your price</h2>
              <p className="text-gray-600">You can change it anytime.</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <Label htmlFor="price">Price per night (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    value={data.price_per_night}
                    onChange={(e) => setData((prev) => ({ ...prev, price_per_night: Number(e.target.value) }))}
                    className="pl-10"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cleaning-fee">Cleaning fee (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cleaning-fee"
                    type="number"
                    value={data.cleaning_fee}
                    onChange={(e) => setData((prev) => ({ ...prev, cleaning_fee: Number(e.target.value) }))}
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimum-stay">Minimum stay (nights)</Label>
                  <Input
                    id="minimum-stay"
                    type="number"
                    value={data.minimum_stay}
                    onChange={(e) => setData((prev) => ({ ...prev, minimum_stay: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="maximum-stay">Maximum stay (nights)</Label>
                  <Input
                    id="maximum-stay"
                    type="number"
                    value={data.maximum_stay}
                    onChange={(e) => setData((prev) => ({ ...prev, maximum_stay: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instant-book"
                  checked={data.instant_book}
                  onCheckedChange={(checked) => setData((prev) => ({ ...prev, instant_book: checked as boolean }))}
                />
                <Label htmlFor="instant-book">Allow instant booking</Label>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Progress Steps */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Create New Property</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-1 ${
                  step.id <= currentStep ? "text-pink-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id <= currentStep ? "bg-pink-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep === totalSteps ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Listing</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
