import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isSupabaseDisabled, mockUser } from "@/lib/supabase/config"
import { getAdvice, formatAdviceAsText, type AdviceRequest } from "@/lib/api/backend"

export async function POST(request: NextRequest) {
  if (isSupabaseDisabled()) {
    const body = await request.json()
    const prompt = body?.prompt || ""
    return NextResponse.json({
      response: `Mock response (Supabase disabled). Prompt received: ${prompt}`,
      user: mockUser,
    })
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
  const { prompt, category, monthly_income_npr, monthly_expenses_npr, current_savings_npr, location, mode } = body

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  try {
    // If full advice request data is provided, use the backend API
    if (category && monthly_income_npr && monthly_expenses_npr) {
      const adviceRequest: AdviceRequest = {
        category: category || "buy",
        message: prompt,
        monthly_income_npr: monthly_income_npr || 50000,
        monthly_expenses_npr: monthly_expenses_npr || {},
        current_savings_npr: current_savings_npr || 0,
        location: location || "kathmandu",
        mode: mode || "simple",
        is_premium: true, // Set based on user's premium status
        user_id: user.id,
      }

      const adviceData = await getAdvice(adviceRequest)
      const textResponse = formatAdviceAsText(adviceData)

      return NextResponse.json({ 
        response: textResponse,
        data: adviceData // Include full data for UI components
      })
    }

    // Fallback: Simple chat response using backend's advice endpoint with defaults
    const adviceRequest: AdviceRequest = {
      category: "buy", // Default category
      message: prompt,
      monthly_income_npr: 50000, // Default values
      monthly_expenses_npr: {
        food: 10000,
        rent: 15000,
        transport: 5000,
      },
      current_savings_npr: 0,
      location: "kathmandu",
      mode: "simple",
      is_premium: true,
      user_id: user.id,
    }

    const adviceData = await getAdvice(adviceRequest)
    const textResponse = formatAdviceAsText(adviceData)

    return NextResponse.json({ 
      response: textResponse,
      data: adviceData
    })
  } catch (error) {
    console.error("Backend API error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate response" 
    }, { status: 500 })
  }
}
