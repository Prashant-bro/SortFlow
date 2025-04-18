"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signInWithGoogle: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status])

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      // Use a simpler signIn call to avoid potential issues
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      showToast("An error occurred during sign in", "error")
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: "/login" })
    } catch (error) {
      console.error("Logout error:", error)
      showToast("An error occurred during logout", "error")
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        isLoading: status === "loading",
        user: session?.user || null,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
