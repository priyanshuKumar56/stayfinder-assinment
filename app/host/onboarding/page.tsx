"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
]

interface OnboardingData {
  propertyType: string
  address: string
  city: string
  state: string
  country: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  beds: number
  title: string
  description: string
  amenities: string[]
  images: File[]
  pricePerNight: number
  cleaningFee: number
  minimumStay: number
  instantBook: boolean
}

export default function HostOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    propertyType: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    beds: 1,
    title: "",
    description: "",
    amenities: [],
    images: [],
    pricePerNight: 100,
    cleaningFee: 25,
    minimumStay: 1,
    instantBook: false,
  })

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10), // Max 10 images
    }))
  }

  const removeImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    // Here you would submit the data to your API
    console.log("Submitting onboarding data:", data)
    // Redirect to host dashboard or success page
    window.location.href = "/host/dashboard"
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
                      data.propertyType === type.id ? "ring-2 ring-pink-500 bg-pink-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setData((prev) => ({ ...prev, propertyType: type.id }))}
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
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="San Francisco"
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
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={data.country}
                  onValueChange={(value) => setData((prev) => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="it">Italy</SelectItem>
                    <SelectItem value="es">Spain</SelectItem>
                  </SelectContent>
                </Select>
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
                { label: "Maximum guests", value: data.maxGuests, key: "maxGuests", icon: Users },
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
                            <span className="text-white text-xs">✓</span>
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
                You'll need at least 5 photos to get started. You can add more or make changes later.
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
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Drag your photos here</p>
                  <p className="text-gray-600 mb-4">Choose at least 5 photos</p>
                  <Button variant="outline">Upload from your device</Button>
                </label>
              </div>

              {data.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Cozy apartment in the heart of the city"
                  maxLength={50}
                />
                <p className="text-sm text-gray-500 mt-1">{data.title.length}/50</p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your place to guests. What makes it special?"
                  rows={6}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{data.description.length}/500</p>
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
                <Label htmlFor="price">Price per night (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    value={data.pricePerNight}
                    onChange={(e) => setData((prev) => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                    className="pl-10"
                    min="1"
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
                    value={data.cleaningFee}
                    onChange={(e) => setData((prev) => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="minimum-stay">Minimum stay (nights)</Label>
                <Input
                  id="minimum-stay"
                  type="number"
                  value={data.minimumStay}
                  onChange={(e) => setData((prev) => ({ ...prev, minimumStay: Number(e.target.value) }))}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instant-book"
                  checked={data.instantBook}
                  onCheckedChange={(checked) => setData((prev) => ({ ...prev, instantBook: checked as boolean }))}
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
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
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
              <div className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 flex items-center space-x-2"
                >
                  <span>Publish Listing</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleNext}
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
