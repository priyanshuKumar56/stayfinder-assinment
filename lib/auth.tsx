"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import type { User } from "./supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isHost: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string, isHost?: boolean) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error)
        return null
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .upsert([
            {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || authUser.email || "User",
              avatar_url: authUser.user_metadata?.avatar_url,
              is_host: authUser.user_metadata?.is_host || false,
            },
          ])
          .select()
          .single()

        if (insertError) {
          console.error("Error creating user profile:", insertError)
          return null
        }

        return newProfile
      }

      return profile
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchUserProfile(session.user)
          setUser(profile)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, isHost = false) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_host: isHost,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isHost: user?.is_host || false,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
