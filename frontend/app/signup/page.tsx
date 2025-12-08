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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/onboarding`,
          // Auto-confirm email for development (if email confirmation is disabled in Supabase)
        },
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        router.push("/signup-success")
      } else if (data.session) {
        // User is immediately signed in (email confirmation disabled)
        router.push("/onboarding")
      } else {
      router.push("/signup-success")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account"
      // Provide more helpful error messages
      if (errorMessage.includes("already registered")) {
        setError("This email is already registered. Please log in instead.")
      } else if (errorMessage.includes("invalid")) {
        setError("Invalid email or password format. Please check your input.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[450px] bg-cream-light border border-[#E5E7EB] shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-[32px] font-bold text-[#222222]">Create Account</CardTitle>
          <CardDescription className="text-[16px] text-[#222222]">
            Start your financial journey with Bachat Saathi
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

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[16px] font-medium text-[#222222]">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-[#F5F7FB] border-[#E5E7EB] text-[#222222] placeholder:text-[#222222]/60 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#222222] hover:text-[#FF6D1F]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Sign Up Button */}
          <Button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-12 bg-[#FF6D1F] hover:bg-[#E85A0A] disabled:bg-[#FF6D1F]/50 text-white font-semibold text-[16px] rounded-lg transition-transform hover:scale-105"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center text-[16px] text-[#222222]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#FF6D1F] hover:underline">
              Log in
            </Link>
          </div>

          {/* Legal Text */}
          <p className="text-center text-[12px] text-[#222222]/70">
            By creating an account, you agree to our{" "}
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
