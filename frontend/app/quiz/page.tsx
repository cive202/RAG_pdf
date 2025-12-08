"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctOption: number
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "1",
    question: "What is the 50/30/20 budgeting rule?",
    options: [
      "50% needs, 30% wants, 20% savings",
      "50% savings, 30% needs, 20% wants",
      "50% income, 30% expenses, 20% taxes",
      "50% investments, 30% housing, 20% food",
    ],
    correctOption: 0,
  },
  {
    id: "2",
    question: "What should be your emergency fund size?",
    options: ["1 month of expenses", "3-6 months of expenses", "1 year of expenses", "No emergency fund needed"],
    correctOption: 1,
  },
  {
    id: "3",
    question: "Which is the best way to pay off debt?",
    options: [
      "Minimum payments only",
      "Debt snowball or avalanche method",
      "Ignore it and save",
      "Take more loans to pay off",
    ],
    correctOption: 1,
  },
  {
    id: "4",
    question: "What is compound interest?",
    options: [
      "Interest on interest",
      "Simple interest doubled",
      "Interest paid once a year",
      "Interest that never compounds",
    ],
    correctOption: 0,
  },
  {
    id: "5",
    question: "What percentage of income should go to housing?",
    options: ["10%", "20%", "30%", "50%"],
    correctOption: 2,
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [creditsEarned, setCreditsEarned] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setLoading(true)
    try {
      // Calculate score
      let correctCount = 0
      const answers = QUIZ_QUESTIONS.map((q, idx) => {
        const isCorrect = selectedAnswers[idx] === q.correctOption
        if (isCorrect) correctCount++
        return {
          questionId: q.id,
          userAnswer: selectedAnswers[idx],
          isCorrect,
        }
      })

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers: answers }),
      })

      const data = await response.json()
      setScore(data.score)
      setCreditsEarned(data.creditsEarned)
      setQuizCompleted(true)
      
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-[#FAF3E1] flex items-center justify-center p-4">
        <Card className="bg-white border-none shadow-lg max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24 bg-[#FF6D1F]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-[#FF6D1F]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#222222] mb-2">Quiz Completed!</h2>
            <p className="text-[#222222]/60 mb-6">Great job testing your financial knowledge</p>

            <div className="space-y-4 mb-8">
              <div className="bg-[#F5E7C6] rounded-lg p-4">
                <p className="text-sm text-[#222222]/60 mb-1">Your Score</p>
                <p className="text-3xl font-bold text-[#FF6D1F]">
                  {score}/{QUIZ_QUESTIONS.length}
                </p>
              </div>

              <div className="bg-[#22C55E]/10 rounded-lg p-4">
                <p className="text-sm text-[#222222]/60 mb-1">Credits Earned</p>
                <p className="text-3xl font-bold text-[#22C55E]">+{creditsEarned}</p>
              </div>
            </div>

            <p className="text-sm text-[#222222]/70 mb-6">
              {score === QUIZ_QUESTIONS.length
                ? "Perfect score! You're a financial wizard!"
                : score >= 3
                  ? "Great effort! Keep learning to improve."
                  : "Keep practicing! You'll get better."}
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-[#FF6D1F] text-white hover:bg-[#FF6D1F]/90">Back to Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Take Quiz Again Tomorrow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = QUIZ_QUESTIONS[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined

  return (
    <div className="min-h-screen bg-[#FAF3E1] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-[#222222] hover:bg-transparent hover:text-[#FF6D1F]">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </Link>
          <Badge className="bg-[#FF6D1F] text-white">
            Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-2 bg-[#F5E7C6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF6D1F] transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card className="bg-white border-none shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#222222]">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === idx
                    ? "border-[#FF6D1F] bg-[#FF6D1F]/10"
                    : "border-[#F5E7C6] bg-[#F5E7C6]/30 hover:border-[#FFB84D]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === idx ? "border-[#FF6D1F] bg-[#FF6D1F]" : "border-[#222222]/20"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-[#222222] font-medium">{option}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 border-[#FFB84D] text-[#222222] hover:bg-[#F5E7C6] bg-transparent"
          >
            Previous
          </Button>

          {currentQuestion === QUIZ_QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!isAnswered || loading}
              className="flex-1 bg-[#FF6D1F] text-white hover:bg-[#FF6D1F]/90"
            >
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 bg-[#FF6D1F] text-white hover:bg-[#FF6D1F]/90"
            >
              Next
            </Button>
          )}
        </div>

        {/* Answered Questions Indicator */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-[#F5E7C6]">
          <p className="text-sm text-[#222222]/60 mb-3">Question Progress</p>
          <div className="flex flex-wrap gap-2">
            {QUIZ_QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold transition-all ${
                  selectedAnswers[idx] !== undefined
                    ? "bg-[#FF6D1F] text-white"
                    : currentQuestion === idx
                      ? "bg-[#FFB84D] text-white"
                      : "bg-[#F5E7C6] text-[#222222]"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
