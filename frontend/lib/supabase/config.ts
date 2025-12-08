export const isSupabaseDisabled = () =>
  process.env.DISABLE_SUPABASE_AUTH === "true" ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseServiceDisabled = () => isSupabaseDisabled() || !process.env.SUPABASE_SERVICE_ROLE_KEY

export const mockUser = {
  id: "mock-user-id",
  email: "demo@mock.dev",
}
