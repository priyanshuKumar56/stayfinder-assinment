"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Menu, User, Settings, LogOut, Home, Calendar, MessageCircle, Shield, Sparkles, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, loading, isHost, signOut } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getDisplayName = () => {
    if(user?.full_name) {
      return user.full_name
    }
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user?.first_name) {
      return user.first_name
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
  }

  return (
    <header className="border-b border-gray-100/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">SF</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-2 h-2 text-white m-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                StayFinder
              </span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">Find your perfect stay</span>
            </div>
          </Link>

          {/* Enhanced Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/listings" 
              className="relative text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium group"
            >
              <span className="relative z-10">Explore</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            {!isHost && (
              <Link 
                href="/become-host" 
                className="relative text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium group"
              >
                <span className="relative z-10">Become a Host</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            )}
          </nav>

          {/* Enhanced User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                <div className="hidden sm:block">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </Button>

                {/* Enhanced User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 h-auto p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
                      <Menu className="h-4 w-4 text-gray-600" />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} />
                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-pink-500 to-violet-500 text-white">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          {user.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {isHost && (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 border-0">
                                <Shield className="h-3 w-3 mr-1" />
                                Host
                              </Badge>
                            )}
                            {user.is_verified && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-200 text-green-700 bg-green-50">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-xl">
                    <div className="px-3 py-3 bg-gradient-to-r from-pink-50 to-violet-50 rounded-xl mb-2">
                      <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {isHost && (
                          <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/50">
                            <Shield className="h-3 w-3 mr-1" />
                            Host
                          </Badge>
                        )}
                        {user.is_verified && (
                          <Badge variant="outline" className="text-xs px-2 py-1 border-green-200 text-green-700 bg-white/50">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenuItem asChild className="rounded-lg py-3 cursor-pointer hover:bg-gray-50">
                      <Link href="/profile" className="flex items-center px-2">
                        <User className="h-4 w-4 mr-3 text-gray-600" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-lg py-3 cursor-pointer hover:bg-gray-50">
                      <Link href="/bookings" className="flex items-center px-2">
                        <Calendar className="h-4 w-4 mr-3 text-gray-600" />
                        <span className="font-medium">My Bookings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-lg py-3 cursor-pointer hover:bg-gray-50">
                      <Link href="/messages" className="flex items-center px-2">
                        <MessageCircle className="h-4 w-4 mr-3 text-gray-600" />
                        <span className="font-medium">Messages</span>
                      </Link>
                    </DropdownMenuItem>

                    {isHost && (
                      <>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem asChild className="rounded-lg py-3 cursor-pointer hover:bg-pink-50">
                          <Link href="/host/dashboard" className="flex items-center px-2">
                            <Home className="h-4 w-4 mr-3 text-pink-600" />
                            <span className="font-medium text-pink-700">Host Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="rounded-lg py-3 cursor-pointer hover:bg-gray-50">
                      <Link href="/settings" className="flex items-center px-2">
                        <Settings className="h-4 w-4 mr-3 text-gray-600" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleSignOut} className="rounded-lg py-3 cursor-pointer hover:bg-red-50 flex items-center px-2 text-red-600">
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    className="font-semibold hover:bg-gray-100 px-6 py-2 rounded-xl transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}