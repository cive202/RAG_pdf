"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Provide more helpful error messages
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials.")
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email address before logging in. Check your inbox for the confirmation email.")
        } else {
          throw error
        }
      }

      if (!data.session) {
        throw new Error("Failed to create session. Please try again.")
      }

      // Wait a bit for auth session to be established
      await new Promise((resolve) => setTimeout(resolve, 100))

      const profileResponse = await fetch("/api/profile", {
        cache: "no-store",
      })
      
      if (!profileResponse.ok) {
        // If unauthorized or error, redirect to onboarding
        router.push("/onboarding")
        return
      }

      const profile = await profileResponse.json()

      // Check if profile exists and is completed
      if (!profile || !profile.id || !profile.profile_completed) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[450px] bg-cream-light border border-[#E5E7EB] shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-[32px] font-bold text-[#222222]">Log In</CardTitle>
          <CardDescription className="text-[16px] text-[#222222]">
            Welcome back! Continue your financial journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[16px] font-medium text-[#222222]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 bg-[#F5F7FB] border-[#E5E7EB] text-[#222222] placeholder:text-[#222222]/60 focus:bg-white"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[16px] font-medium text-[#222222]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-[#F5F7FB] border-[#E5E7EB] text-[#222222] placeholder:text-[#222222]/60 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#222222] hover:text-[#FF6D1F]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-[#FF6D1F] hover:bg-[#E85A0A] disabled:bg-[#FF6D1F]/50 text-white font-semibold text-[16px] rounded-lg transition-transform hover:scale-105"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-[16px] text-[#222222]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#FF6D1F] hover:underline">
              Sign up
            </Link>
          </div>

          {/* Legal Text */}
          <p className="text-center text-[12px] text-[#222222]/70">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="text-[#FF6D1F] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#FF6D1F] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
