import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isSupabaseDisabled, isSupabaseServiceDisabled, mockUser } from "@/lib/supabase/config"

// In-memory profile store for mock mode
let mockProfile = {
  id: mockUser.id,
  name: "Demo User",
  income: 50000,
  profile_completed: true,
}

function readMockProfileFromCookies(cookieStore: ReturnType<typeof cookies>) {
  const stored = cookieStore.get("mock_profile")?.value
  if (!stored) return mockProfile
  try {
    return JSON.parse(stored)
  } catch {
    return mockProfile
  }
}

function writeMockProfileToCookies(profile: any) {
  const response = NextResponse.json(profile)
  response.cookies.set("mock_profile", JSON.stringify(profile), { path: "/", httpOnly: false })
  return response
}

export async function GET() {
  try {
    if (isSupabaseServiceDisabled()) {
      const cookieStore = await cookies()
      const storedProfile = readMockProfileFromCookies(cookieStore)
      mockProfile = storedProfile
      return NextResponse.json(storedProfile)
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json(data || {})
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profile } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!profile || !profile.name) {
      return NextResponse.json({ error: "Profile name is required" }, { status: 400 })
    }

    console.log("Saving profile for user:", userId, "Profile data:", profile)

    if (isSupabaseServiceDisabled()) {
      const cookieStore = await cookies()
      const existing = readMockProfileFromCookies(cookieStore)
      mockProfile = { ...existing, id: userId || mockUser.id, ...profile, profile_completed: true }
      return writeMockProfileToCookies(mockProfile)
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("user_profiles")
      .select("id, created_at")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing profile:", checkError)
    }

    const profileData: any = {
      id: userId,
      ...profile,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    }

    // If profile doesn't exist, add created_at
    if (!existingProfile) {
      profileData.created_at = new Date().toISOString()
      console.log("Creating new profile with created_at")
    } else {
      console.log("Updating existing profile")
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single()

    if (error) {
      console.error("Supabase error saving profile:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return NextResponse.json(
        { error: error.message || "Failed to save profile", details: error.details },
        { status: 500 }
      )
    }

    if (!data) {
      console.error("No data returned from upsert")
      return NextResponse.json({ error: "Profile saved but no data returned" }, { status: 500 })
    }

    console.log("Profile saved successfully:", data.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error saving profile:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to save profile"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile } = body

    if (isSupabaseServiceDisabled()) {
      const cookieStore = await cookies()
      const existing = readMockProfileFromCookies(cookieStore)
      mockProfile = { ...existing, ...profile, updated_at: new Date().toISOString() }
      return writeMockProfileToCookies(mockProfile)
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
