import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getUserProfile(userId: string) {
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

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) return null
  return data
}

export async function updateUserProfile(userId: string, profile: any) {
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

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: userId,
        ...profile,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
