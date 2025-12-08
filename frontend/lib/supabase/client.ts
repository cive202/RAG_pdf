import { createBrowserClient } from "@supabase/ssr"
import { isSupabaseDisabled, mockUser } from "./config"

const mockAuth = {
  async signUp() {
    return { data: { user: mockUser }, error: null }
  },
  async signInWithPassword() {
    return { data: { user: mockUser }, error: null }
  },
  async signOut() {
    return { error: null }
  },
  async getUser() {
    return { data: { user: mockUser }, error: null }
  },
}

export function createClient() {
  if (isSupabaseDisabled()) {
    return { auth: mockAuth } as any
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
