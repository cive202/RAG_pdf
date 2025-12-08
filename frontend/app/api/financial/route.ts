import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isSupabaseDisabled, mockUser } from "@/lib/supabase/config"

export async function GET() {
  if (isSupabaseDisabled()) {
    return NextResponse.json([])
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
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

  const { data: financialData, error } = await supabase
    .from("financial_data")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(financialData)
}

export async function POST(request: NextRequest) {
  if (isSupabaseDisabled()) {
    const body = await request.json()
    return NextResponse.json([
      {
        id: crypto.randomUUID(),
        user_id: mockUser.id,
        type: body.type,
        fd_amount: body.fdAmount || null,
        fd_duration_months: body.fdDuration || null,
        fd_interest_rate: body.fdInterestRate || null,
        insurance_amount: body.insuranceAmount || null,
        insurance_type: body.insuranceType || null,
        investment_needs: body.investmentNeeds || null,
        investment_wants: body.investmentWants || null,
        investment_savings: body.investmentSavings || null,
        description: body.description || null,
        created_at: new Date().toISOString(),
      },
    ])
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
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

  const body = await request.json()

  const { data, error } = await supabase.from("financial_data").insert({
    user_id: user.id,
    type: body.type,
    fd_amount: body.fdAmount || null,
    fd_duration_months: body.fdDuration || null,
    fd_interest_rate: body.fdInterestRate || null,
    insurance_amount: body.insuranceAmount || null,
    insurance_type: body.insuranceType || null,
    investment_needs: body.investmentNeeds || null,
    investment_wants: body.investmentWants || null,
    investment_savings: body.investmentSavings || null,
    description: body.description || null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
