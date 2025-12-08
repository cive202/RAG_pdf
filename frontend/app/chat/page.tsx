"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Loader2, MessageSquare } from "lucide-react"
import { getAdvice, formatAdviceAsText, type AdviceRequest } from "@/lib/api/backend"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  data?: any // Store full API response data
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Paisa Ko Sahayogi, your AI financial advisor. I can help you with:\n\n• Buying decisions (bikes, phones, etc.)\n• Loan and EMI management\n• Tax saving strategies\n• Big life goals planning\n• Festival budgeting\n• Reducing expenses\n• Investment advice\n• Side income ideas\n\nChoose a category and ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<AdviceRequest["category"]>("buy")
  const [monthlyIncome, setMonthlyIncome] = useState("50000")
  const [currentSavings, setCurrentSavings] = useState("0")
  const [location, setLocation] = useState("kathmandu")
  const [mode, setMode] = useState<"simple" | "indepth">("simple")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare expenses (you can make this more dynamic later)
      const monthlyExpenses = {
        food: 10000,
        rent: 15000,
        transport: 5000,
        utilities: 3000,
      }

      // Ensure mode is valid - must be exactly "simple" or "indepth"
      let validMode: "simple" | "indepth" = "simple";
      if (mode === "simple" || mode === "indepth") {
        validMode = mode;
      }
      
      // Debug: Log the request before sending
      console.log("Mode value:", mode, "Valid mode:", validMode);
      
      const adviceRequest: AdviceRequest = {
        category,
        message: input,
        monthly_income_npr: parseFloat(monthlyIncome) || 50000,
        monthly_expenses_npr: monthlyExpenses,
        current_savings_npr: parseFloat(currentSavings) || 0,
        location: location || "kathmandu",
        mode: validMode, // Explicitly set to ensure it's a valid literal
        is_premium: true,
      }
      
      // Debug: Log the full request
      console.log("Sending request:", JSON.stringify(adviceRequest, null, 2));

      // Call backend API
      const adviceData = await getAdvice(adviceRequest)
      
      // Convert to text format
      const textResponse = formatAdviceAsText(adviceData)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: textResponse,
        timestamp: new Date(),
        data: adviceData, // Store full data for potential UI components
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Failed to get response"}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF3E1] to-[#F5E7C6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white border border-[#FFB84D] shadow-lg h-[calc(100vh-4rem)] flex flex-col">
          <CardHeader className="border-b border-[#FFB84D] bg-gradient-to-r from-[#FF6D1F] to-[#E85A0A] text-white">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <CardTitle className="text-2xl font-bold">Paisa Ko Sahayogi Chat</CardTitle>
                <CardDescription className="text-white/90">
                  Nepal's Smartest Financial Advisor
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
            {/* Settings Panel */}
            <div className="p-4 border-b border-[#FFB84D] bg-[#FAF3E1] space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <Label className="text-sm font-medium text-[#222222] mb-2 block">Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AdviceRequest["category"])}
                    className="h-9 w-full bg-white border border-[#FFB84D] rounded-md px-3 text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6D1F] cursor-pointer"
                  >
                    <option value="buy">Buy Something</option>
                    <option value="loan">Loan/EMI</option>
                    <option value="tax">Tax Saving</option>
                    <option value="big-goal">Big Goal</option>
                    <option value="festival">Festival Budget</option>
                    <option value="reduce-expense">Reduce Expense</option>
                    <option value="invest">Invest</option>
                    <option value="side-income">Side Income</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#222222]">Monthly Income (NPR)</Label>
                  <Input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-9 bg-white border-[#FFB84D]"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#222222]">Current Savings (NPR)</Label>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="h-9 bg-white border-[#FFB84D]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#222222]">Location</Label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 bg-white border-[#FFB84D]"
                    placeholder="kathmandu"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#222222] mb-2 block">Mode</Label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "simple" | "indepth")}
                    className="h-9 w-full bg-white border border-[#FFB84D] rounded-md px-3 text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6D1F] cursor-pointer"
                  >
                    <option value="simple">Simple</option>
                    <option value="indepth">In-depth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF3E1]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-[#FF6D1F] text-white"
                        : "bg-white text-[#222222] border-2 border-[#FFB84D]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <span className={`text-xs mt-2 block ${message.role === "user" ? "text-white/70" : "text-[#222222]/60"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#222222] px-4 py-3 rounded-lg border-2 border-[#FFB84D]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#FFB84D] bg-white">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder="Ask about your finances... (e.g., I want to buy a bike)"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[#FAF3E1] border-[#FFB84D] text-[#222222] placeholder:text-[#222222]/50 focus:ring-2 focus:ring-[#FF6D1F]"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#FF6D1F] hover:bg-[#E85A0A] text-white px-6 h-12"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-[#222222]/60 mt-2">
                💡 Tip: Be specific about what you want to buy or your financial goal for better advice
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

