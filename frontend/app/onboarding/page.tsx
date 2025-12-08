"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseDisabled, mockUser } from "@/lib/supabase/config"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    gender: "",
    marital_status: "",
    country: "",
    insurance: "",
    expected_monthly_expenditure: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const mockMode = isSupabaseDisabled()
      const { data: userData, error: userError } = await supabase?.auth.getUser() || { data: null, error: null }
      
      if (userError) {
        console.error("Error getting user:", userError)
        setError("Please log in first.")
        setTimeout(() => router.push("/login"), 2000)
        return
      }

      const userId = mockMode ? mockUser.id : userData?.user?.id

      if (!userId) {
        setError("Please log in first.")
        setTimeout(() => router.push("/login"), 2000)
        return
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          profile: {
            name: formData.name,
            age: formData.age ? Number.parseInt(formData.age) : null,
            income: formData.income ? Number.parseFloat(formData.income) : null,
            gender: formData.gender || null,
            marital_status: formData.marital_status || null,
            country: formData.country || null,
            insurance: formData.insurance ? Number.parseFloat(formData.insurance) : null,
            expected_monthly_expenditure: formData.expected_monthly_expenditure ? Number.parseFloat(formData.expected_monthly_expenditure) : null,
          },
        }),
      })

      if (!response.ok) {
        let message = "Failed to save profile"
        try {
          const errorJson = await response.json()
          message = errorJson?.error || message
          console.error("API Error:", errorJson)
        } catch {
          // ignore parsing errors
        }
        throw new Error(message)
      }

      const result = await response.json()
      console.log("Profile saved successfully:", result)

      // Redirect to dashboard after successful save
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-cream-light border border-[#E5E7EB] shadow-lg">
          <CardHeader className="border-b border-[#E5E7EB]">
            <CardTitle className="text-3xl text-[#222222]">Welcome to Bachat Saathi</CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your profile to personalize your financial journey
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  className="w-full px-4 py-2 bg-[#F5F7FB] border border-[#E5E7EB] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="John Doe"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="30"
                  />
                </div>

                {/* Income */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Monthly Income</label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="60000"
                  />
                </div>

                {/* Expected Monthly Expenditure */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Expected Monthly Expenditure</label>
                  <input
                    type="number"
                    name="expected_monthly_expenditure"
                    value={formData.expected_monthly_expenditure}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="30000"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer Not to Say</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="Nepal"
                  />
                </div>

                {/* Insurance Amount */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Annual Insurance Amount</label>
                  <input
                    type="number"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    placeholder="100000"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !formData.name}
                className="w-full bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold h-11 text-base"
              >
                {loading ? "Setting up..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
