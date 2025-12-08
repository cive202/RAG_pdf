import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isSupabaseDisabled, mockUser } from "@/lib/supabase/config"

export async function GET(request: NextRequest) {
  if (isSupabaseDisabled()) {
    return NextResponse.json({ user_id: mockUser.id, credits: 100 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookies_to_set) {
          cookies_to_set.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get or create user credits
  const { data: credits, error } = await supabase.from("user_credits").select("*").eq("user_id", user.id).single()

  if (error && error.code === "PGRST116") {
    // No credits found, create one
    const { data: newCredits, error: createError } = await supabase
      .from("user_credits")
      .insert([{ user_id: user.id, credits: 0 }])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json(newCredits)
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(credits)
}

export async function POST(request: NextRequest) {
  if (isSupabaseDisabled()) {
    const { creditsToAdd } = await request.json()
    return NextResponse.json({ user_id: mockUser.id, credits: 100 + Number(creditsToAdd || 0) })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookies_to_set) {
          cookies_to_set.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { creditsToAdd } = await request.json()

  const { data: credits, error } = await supabase
    .from("user_credits")
    .update({ credits: supabase.rpc("increment_credits", { user_id: user.id, amount: creditsToAdd }) })
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(credits)
}
