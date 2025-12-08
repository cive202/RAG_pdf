import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { isSupabaseDisabled, mockUser } from "@/lib/supabase/config"

export async function GET(request: NextRequest) {
  if (isSupabaseDisabled()) {
    return NextResponse.json({ canTakeQuiz: true, mock: true })
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

  // Check if user has already completed today's quiz
  const today = new Date().toISOString().split("T")[0]
  const { data: completedToday } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", user.id)
    .eq("completed", true)
    .gte("created_at", `${today}T00:00:00`)
    .limit(1)

  if (completedToday && completedToday.length > 0) {
    return NextResponse.json({ error: "You have already completed today's quiz", quizCompleted: true }, { status: 400 })
  }

  return NextResponse.json({ canTakeQuiz: true })
}

export async function POST(request: NextRequest) {
  if (isSupabaseDisabled()) {
    const { quizAnswers } = await request.json()
    const correctAnswers = Array.isArray(quizAnswers)
      ? quizAnswers.filter((answer: any) => answer?.isCorrect).length
      : 0
    const creditsEarned = Math.min(correctAnswers * 2 + 5, 15)
    return NextResponse.json({
      score: correctAnswers,
      creditsEarned,
      quizId: "mock-quiz",
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

  const { quizAnswers } = await request.json()

  // Calculate correct answers
  let correctAnswers = 0
  for (const answer of quizAnswers) {
    if (answer.isCorrect) {
      correctAnswers++
    }
  }

  const creditsEarned = Math.min(correctAnswers * 2 + 5, 15)

  // Create or update quiz record with score and credits
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert([
      {
        user_id: user.id,
        title: "Daily Financial Literacy Quiz",
        description: "Test your financial knowledge",
        completed: true,
        score: correctAnswers,
        credits_earned: creditsEarned,
        completed_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (quizError) {
    console.error("[v0] Quiz insert error:", quizError)
    return NextResponse.json({ error: quizError.message }, { status: 500 })
  }

  let { data: userCredits, error: creditsError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  if (creditsError && creditsError.code === "PGRST116") {
    // Create new credits record if it doesn't exist
    const { data: newCredits, error: createError } = await supabase
      .from("user_credits")
      .insert([{ user_id: user.id, credits: 0 }])
      .select()
      .single()

    if (createError) {
      console.error("[v0] Credits create error:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
    userCredits = newCredits
  }

  const currentCredits = userCredits?.credits || 0
  const { error: updateError } = await supabase
    .from("user_credits")
    .update({ credits: currentCredits + creditsEarned })
    .eq("user_id", user.id)

  if (updateError) {
    console.error("[v0] Credits update error:", updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Store individual answers
  for (const answer of quizAnswers) {
    await supabase.from("quiz_answers").insert([
      {
        quiz_id: quiz.id,
        question_id: answer.questionId,
        user_answer: answer.userAnswer,
        is_correct: answer.isCorrect,
      },
    ])
  }

  return NextResponse.json({
    score: correctAnswers,
    creditsEarned,
    quizId: quiz.id,
  })
}
