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
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("shares")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (isSupabaseDisabled()) {
    const body = await request.json()
    return NextResponse.json(
      [
        {
          id: crypto.randomUUID(),
          user_id: mockUser.id,
          stock_symbol: body.stock_symbol,
          company_name: body.company_name,
          quantity: body.quantity,
          purchase_price: body.purchase_price,
          current_price: body.current_price,
          purchase_date: body.purchase_date,
          description: body.description,
          created_at: new Date().toISOString(),
        },
      ],
      { status: 201 },
    )
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

  const { data, error } = await supabase.from("shares").insert([
    {
      user_id: user.id,
      stock_symbol: body.stock_symbol,
      company_name: body.company_name,
      quantity: body.quantity,
      purchase_price: body.purchase_price,
      current_price: body.current_price,
      purchase_date: body.purchase_date,
      description: body.description,
    },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
