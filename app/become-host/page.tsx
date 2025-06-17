"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Home,
  DollarSign,
  Shield,
  Users,
  Star,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const hostingSteps = [
  {
    step: 1,
    title: "Tell us about your place",
    description: "Share some basic info, like where it is and how many guests can stay.",
    icon: Home,
    time: "10 minutes",
  },
  {
    step: 2,
    title: "Make it stand out",
    description: "Add 5 or more photos plus a title and description—we'll help you out.",
    icon: Star,
    time: "15 minutes",
  },
  {
    step: 3,
    title: "Finish and publish",
    description:
      "Choose if you'd like to start with an experienced guest, set a starting price, and publish your listing.",
    icon: CheckCircle,
    time: "5 minutes",
  },
]

const hostBenefits = [
  {
    icon: DollarSign,
    title: "Earn extra income",
    description: "Make money from your unused space",
    stat: "Average $924/month",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Host protection",
    description: "Comprehensive coverage for peace of mind",
    stat: "$1M coverage",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Meet new people",
    description: "Connect with travelers from around the world",
    stat: "190+ countries",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Earn Superhost status and exclusive benefits",
    stat: "Top 10% hosts",
    color: "from-orange-500 to-red-500",
  },
]

const faqs = [
  {
    question: "Is my place right for StayFinder?",
    answer:
      "StayFinder guests are interested in all kinds of places. We have listings for tiny homes, cabins, treehouses, and more. Even a spare room can be a great place to stay.",
  },
  {
    question: "Do I have to host all the time?",
    answer: "Not at all—you control your calendar. You can host once a year, a few nights a month, or more often.",
  },
  {
    question: "How much should I interact with guests?",
    answer:
      "It's up to you. Some Hosts prefer to message guests only at key moments—like sending a short note when they check in—while others also enjoy meeting their guests in person.",
  },
  {
    question: "Any tips on being a great StayFinder Host?",
    answer:
      "Getting started is easy. Be responsive, keep your calendar up-to-date, and provide necessary amenities, like fresh towels. Some Hosts like adding a personal touch, such as putting out fresh flowers or sharing a list of local places to explore.",
  },
]

export default function BecomeHostPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="min-h-screen bg-background">
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
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-violet-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Earn money as a
                <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  {" "}
                  StayFinder Host
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Share your space and create unforgettable experiences for travelers from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/host/onboarding">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 w-full sm:w-auto"
                    >
                      Start Hosting
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free to list</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Host protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=500&fit=crop"
                alt="Happy host"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">$2,340</p>
                    <p className="text-sm text-gray-600">earned this month</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">It's easy to get started on StayFinder</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to become a host and start earning money from your space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostingSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-pink-500">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-3">{step.description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/host/onboarding">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                >
                  Get Started Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why host on StayFinder?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join millions of hosts who have earned money and created memorable experiences for guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center`}
                    >
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <Badge variant="secondary" className="text-sm font-semibold">
                      {benefit.stat}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Host success stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how hosting has transformed the lives of our community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                location: "Malibu, CA",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
                earnings: "$3,200",
                period: "per month",
                story: "Hosting helped me pay off my student loans and save for my dream vacation to Europe.",
                propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop",
              },
              {
                name: "Mike Johnson",
                location: "Aspen, CO",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                earnings: "$2,800",
                period: "per month",
                story: "I've met amazing people from around the world and made lifelong friendships through hosting.",
                propertyImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
              },
              {
                name: "Emma Davis",
                location: "New York, NY",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                earnings: "$4,100",
                period: "per month",
                story: "Hosting my spare room helped me afford living in Manhattan and pursue my art career.",
                propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
              },
            ].map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={story.propertyImage || "/placeholder.svg"}
                      alt={`${story.name}'s property`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Image
                        src={story.avatar || "/placeholder.svg"}
                        alt={story.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{story.name}</h4>
                        <p className="text-sm text-gray-600">{story.location}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600">{story.earnings}</div>
                      <div className="text-sm text-gray-600">{story.period}</div>
                    </div>
                    <p className="text-gray-700 italic">"{story.story}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about hosting on StayFinder.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold mb-6">Ready to start hosting?</h2>
            <p className="text-xl mb-8 text-pink-100 max-w-2xl mx-auto">
              Join millions of hosts around the world and start earning money from your space today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/host/onboarding">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 w-full sm:w-auto">
                    Start Hosting Today
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
