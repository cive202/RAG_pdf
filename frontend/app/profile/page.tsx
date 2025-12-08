"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, LogOut } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  age: number | null
  income: number | null
  company: string
  gender: string
  marital_status: string
  country: string
  insurance: string
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    company: "",
    gender: "",
    marital_status: "",
    country: "",
    insurance: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()

        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData({
            name: data.name || "",
            age: data.age ? String(data.age) : "",
            income: data.income ? String(data.income) : "",
            company: data.company || "",
            gender: data.gender || "",
            marital_status: data.marital_status || "",
            country: data.country || "",
            insurance: data.insurance || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            age: formData.age ? Number.parseInt(formData.age) : null,
            income: formData.income ? Number.parseFloat(formData.income) : null,
            company: formData.company,
            gender: formData.gender,
            marital_status: formData.marital_status,
            country: formData.country,
            insurance: formData.insurance,
          },
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setProfile(updated)
        setEditing(false)
        alert("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3E1] flex items-center justify-center">
        <p className="text-[#222222]">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF3E1]">
      {/* Header */}
      <div className="bg-white border-b border-[#F5E7C6] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-[#F5E7C6] rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-[#222222]" />
            </button>
            <h1 className="text-2xl font-bold text-[#222222]">My Profile</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#FF6D1F] text-[#FF6D1F] hover:bg-[#FF6D1F] hover:text-white bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {profile ? (
          <Card className="bg-white border-none shadow-lg">
            <CardHeader className="border-b border-[#F5E7C6] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-[#222222]">{profile.name}</CardTitle>
                <CardDescription>Personal Information</CardDescription>
              </div>
              <Button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                disabled={saving}
                className="bg-[#FF6D1F] hover:bg-[#E85A0A] text-white"
              >
                {editing ? (saving ? "Saving..." : "Save Changes") : "Edit Profile"}
              </Button>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">{profile.name}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Age</label>
                  {editing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">{profile.age || "Not specified"}</p>
                  )}
                </div>

                {/* Income */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Monthly Income</label>
                  {editing ? (
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">
                      {profile.income ? `₹${profile.income.toLocaleString()}` : "Not specified"}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Company</label>
                  {editing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">{profile.company || "Not specified"}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Gender</label>
                  {editing ? (
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
                  ) : (
                    <p className="text-[#222222] capitalize">{profile.gender || "Not specified"}</p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Marital Status</label>
                  {editing ? (
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
                  ) : (
                    <p className="text-[#222222] capitalize">{profile.marital_status || "Not specified"}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Country</label>
                  {editing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">{profile.country || "Not specified"}</p>
                  )}
                </div>

                {/* Insurance */}
                <div>
                  <label className="block text-sm font-semibold text-[#222222] mb-2">Insurance</label>
                  {editing ? (
                    <input
                      type="text"
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                    />
                  ) : (
                    <p className="text-[#222222]">{profile.insurance || "Not specified"}</p>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="flex-1 border-[#FFB84D] text-[#222222]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-[#FF6D1F] hover:bg-[#E85A0A] text-white"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-none shadow-lg">
            <CardContent className="pt-8">
              <p className="text-[#222222]">No profile found. Please complete your profile setup.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
