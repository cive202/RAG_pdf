"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Flame, Target, LogOut, User, Coins, Plus, ChevronsLeft, ChevronsRight, Brain } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ManualEntryForm } from "@/components/manual-entry-form"

interface UserProfile {
  name: string
  age?: number
  income?: number
  company?: string
  gender?: string
  marital_status?: string
  country?: string
  insurance?: string
}

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  description?: string
}

interface FinancialData {
  id: string
  type: string
  fd_amount?: number
  fd_duration_months?: number
  fd_interest_rate?: number
  insurance_amount?: number
  insurance_type?: string
  investment_needs?: number
  investment_wants?: number
  investment_savings?: number
  created_at: string
}

interface Share {
  id: string
  stock_symbol: string
  company_name?: string
  quantity: number
  purchase_price: number
  current_price?: number
  purchase_date?: string
  created_at: string
}

const projectionData = [
  { month: "Jul", current: 45000, projected: 48000 },
  { month: "Aug", current: 48000, projected: 52000 },
  { month: "Sep", current: 50000, projected: 55000 },
  { month: "Oct", current: 52000, projected: 58000 },
  { month: "Nov", current: 54000, projected: 61000 },
  { month: "Dec", current: 56000, projected: 65000 },
]

const COLORS = ["#FF6D1F", "#FFB84D", "#FFDA8F", "#FFE5CC", "#F5E7C6"]

const getCountryEmoji = (country: string): string => {
  const countryEmojis: Record<string, string> = {
    Nepal: "🇳🇵",
    India: "🇮🇳",
    Bangladesh: "🇧🇩",
    Pakistan: "🇵🇰",
    SriLanka: "🇱🇰",
    USA: "🇺🇸",
    UK: "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Germany: "🇩🇪",
    France: "🇫🇷",
    Japan: "🇯🇵",
    China: "🇨🇳",
    Mexico: "🇲🇽",
    Brazil: "🇧🇷",
  }
  return countryEmojis[country] || "🌍"
}

export default function DashboardPage() {
  const [mode, setMode] = useState<"manual" | "auto">("auto")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [allocationData, setAllocationData] = useState<any[]>([])
  const [totals, setTotals] = useState({ income: 0, expenses: 0, savings: 0 })
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [shares, setShares] = useState<Share[]>([])
  const [manualEntryTab, setManualEntryTab] = useState<string>("expenses")
  const [showManualEntry, setShowManualEntry] = useState<boolean>(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [percentageChanges, setPercentageChanges] = useState({ income: 0, expenses: 0, savings: 0 })

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch("/api/expenses")
      if (response.ok) {
        const data: Expense[] = await response.json()
        setExpenses(data)

        // Calculate totals and allocation
        const totalExpenses = data.reduce((sum, exp) => sum + Number(exp.amount), 0)
        const income = userProfile?.income || 0
        const savings = income - totalExpenses

        // Calculate percentage changes
        const previousExpenses = totals.expenses
        const previousSavings = totals.savings
        const previousIncome = totals.income

        const expenseChange = previousExpenses !== 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0
        const savingsChange = previousSavings !== 0 ? ((savings - previousSavings) / previousSavings) * 100 : 0
        const incomeChange = previousIncome !== 0 ? ((income - previousIncome) / previousIncome) * 100 : 0

        setPercentageChanges({
          income: incomeChange,
          expenses: expenseChange,
          savings: savingsChange,
        })

        setTotals({
          income,
          expenses: totalExpenses,
          savings: Math.max(0, savings),
        })

        // Group expenses by category for allocation
        const categoryMap: Record<string, number> = {}
        data.forEach((exp) => {
          categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount)
        })

        const allocation = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }))
        setAllocationData(allocation)

        // Calculate monthly data (this month vs last month)
        const now = new Date()
        const currentMonth = data.filter((exp) => {
          const expDate = new Date(exp.date)
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
        })

        const currentMonthTotal = currentMonth.reduce((sum, exp) => sum + Number(exp.amount), 0)

        setMonthlyData([{ name: "This Month", income: income, expense: currentMonthTotal }])
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }, [userProfile?.income, totals.expenses, totals.savings, totals.income])

  const fetchFinancialData = useCallback(async () => {
    try {
      const response = await fetch("/api/financial")
      if (response.ok) {
        const data: FinancialData[] = await response.json()
        setFinancialData(data)
      }
    } catch (error) {
      console.error("Error fetching financial data:", error)
    }
  }, [])

  const fetchShares = useCallback(async () => {
    try {
      const response = await fetch("/api/shares")
      if (response.ok) {
        const data: Share[] = await response.json()
        setShares(data)
      }
    } catch (error) {
      console.error("Error fetching shares:", error)
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (userProfile) {
      fetchExpenses()
      fetchFinancialData()
      fetchShares()
    }
  }, [userProfile, fetchExpenses, fetchFinancialData, fetchShares])

  const handleExpenseAdded = useCallback(() => {
    fetchExpenses()
    fetchFinancialData()
    fetchShares()
  }, [fetchExpenses, fetchFinancialData, fetchShares])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/quiz")
        if (response.ok) {
          const data = await response.json()
          setCredits(data.creditsEarned || 0)
        }
      } catch (error) {
        console.error("Error fetching credits:", error)
      }
    }

    fetchCredits()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#222222]">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#222222]">Bachat Saathi</h1>
            <p className="text-sm text-[#222222]/60">Your Personal Finance Companion</p>
          </div>
          <div className="flex items-center gap-4">
           
            <Badge className="flex items-center gap-2 text-[#FF6D1F] font-semibold px-0 py-0 bg-transparent">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF6D1F] ">
                <Flame className="w-5 h-5 text-white" />
              </span>
              <span className="text-sm text-[#222222]">5 day streak</span>
            </Badge>
            <Link href="/profile">
              <Button variant="outline" className="border-[#FFB84D] text-[#222222] hover:bg-orange-600 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/quiz">
              <Button className="bg-gradient-to-r from-[#FF8A3D] to-[#FF6D1F] hover:from-[#FF7A2D] hover:to-[#E85A0A] text-white font-semibold">
                <Brain className="w-4 h-4 mr-2" />
                Quiz
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#FF6D1F] text-[#FF6D1F] hover:bg-[#FF6D1F] hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
       

        <div className="flex-1">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="mb-6 flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#222222] mb-1">Welcome back, {userProfile?.name || "User"}!</h2>
              <p className="text-[#222222]/70">Here's your financial overview</p>
            </div>
             <div className="bg-cream-light border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF6D1F] flex items-center justify-center text-white shadow-md">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#222222]/60 font-semibold">Credits</p>
                  <p className="text-2xl font-bold text-[#222222]">{credits}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {userProfile && (
              <>
            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-2">
                      Monthly Income
                    </p>
                    <div className="flex items-baseline gap-2">

                    <p className="text-2xl font-bold text-[#FF6D1F]">₹{userProfile.income?.toLocaleString() || "—"}</p>
                    <span className="text-sm font-semibold text-green-600">+5.2%</span>
                    </div>
                  </CardContent>
                </Card>

            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-2">Age</p>
                    <p className="text-lg font-bold text-[#222222]">{userProfile.age || "—"}</p>
                  </CardContent>
                </Card>

            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-2">Location</p>
                    <p className="text-lg font-bold text-[#222222]">{userProfile.country || "—"}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-3">Total Expenses</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#DC2626]">₹{totals.expenses.toLocaleString()}</p>
                  <span className={`text-sm font-semibold ${
                    percentageChanges.expenses === 0 
                      ? "text-gray-400" 
                      : percentageChanges.expenses > 0 
                      ? "text-red-600" 
                      : "text-green-600"
                  }`}>
                    {percentageChanges.expenses === 0 ? "" : percentageChanges.expenses > 0 ? "+" : ""}{percentageChanges.expenses.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-3">
                  Available to Save
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#22C55E]">₹{totals.savings.toLocaleString()}</p>
                  <span className={`text-sm font-semibold ${
                    percentageChanges.savings === 0 
                      ? "text-gray-400" 
                      : percentageChanges.savings > 0 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {percentageChanges.savings === 0 ? "" : percentageChanges.savings > 0 ? "+" : ""}{percentageChanges.savings.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-3">Total Savings</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#222222]">₹1,45,000</p>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Income vs Expense Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#222222]">Income vs Expenses</CardTitle>
                <CardDescription className="text-sm text-[#222222]/60">Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData.length > 0 ? monthlyData : [{ name: "No Data", income: 0, expense: 0 }]}
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="0" stroke="#F0F0F0" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={13} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      labelStyle={{ color: "#222222" }}
                    />
                    <Bar dataKey="income" fill="#FF6D1F" name="Income" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expense" fill="#DC2626" name="Expenses" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Breakdown */}
          <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#222222]">Budget Allocation</CardTitle>
              <CardDescription className="text-sm text-[#222222]/60">Spending breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#FF6D1F", "#FFB84D", "#FFDA8F", "#FFE5CC", "#F5E7C6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${value}`}
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-[#222222]/60 text-sm">
                  Add expenses to see breakdown
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview Section */}
        <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold text-[#222222]">Financial Portfolio</CardTitle>
              <CardDescription className="text-sm text-[#222222]/60">Track your investments</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fd" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-[#E5E7EB] gap-2 p-1 mb-6 shadow-sm">
                <TabsTrigger
                  value="fd"
                  className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] text-sm"
                >
                  FD
                </TabsTrigger>
                <TabsTrigger
                  value="insurance"
                  className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] text-sm"
                >
                  Insurance
                </TabsTrigger>
                <TabsTrigger
                  value="shares"
                  className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] text-sm"
                >
                  Shares
                </TabsTrigger>
              </TabsList>

              {/* FD Tab */}
              <TabsContent value="fd" className="mt-0">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      setManualEntryTab("fd")
                      window.scrollTo(0, document.body.scrollHeight)
                    }}
                    className="bg-[#FF6D1F] hover:bg-[#E85A0A] text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add FD
                  </Button>
                </div>
                {financialData.filter((item) => item.type === "fd").length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {financialData.map(
                      (item) =>
                        item.type === "fd" && (
                          <div
                            key={item.id}
                            className="p-5 bg-gradient-to-br from-white to-[#F5F7FB] rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
                          >
                            <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-3">
                              Fixed Deposit
                            </p>
                            <p className="text-3xl font-bold text-[#FF6D1F] mb-4">
                              ₹{item.fd_amount?.toLocaleString()}
                            </p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-[#222222]/70 uppercase tracking-wide">Duration</p>
                                <p className="text-sm font-semibold text-[#222222]">{item.fd_duration_months} months</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#222222]/70 uppercase tracking-wide">Interest Rate</p>
                                <p className="text-sm font-semibold text-[#222222]">{item.fd_interest_rate}%</p>
                              </div>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#222222]/60">
                    <p className="text-sm">No Fixed Deposits added yet</p>
                  </div>
                )}
              </TabsContent>

              {/* Insurance Tab */}
              <TabsContent value="insurance" className="mt-0">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      setManualEntryTab("insurance")
                      window.scrollTo(0, document.body.scrollHeight)
                    }}
                    className="bg-[#FF6D1F] hover:bg-[#E85A0A] text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Insurance
                  </Button>
                </div>
                {financialData.filter((item) => item.type === "insurance").length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {financialData.map(
                      (item) =>
                        item.type === "insurance" && (
                          <div
                            key={item.id}
                            className="p-5 bg-gradient-to-br from-[#FAF3E1] to-[#F5E7C6] rounded-xl border border-[#FFB84D] shadow-sm hover:shadow-md transition-shadow"
                          >
                            <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-3">
                              Insurance Policy
                            </p>
                            <p className="text-3xl font-bold text-[#FF6D1F] mb-4">
                              ₹{item.insurance_amount?.toLocaleString()}
                            </p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-[#222222]/70 uppercase tracking-wide">Type</p>
                                <p className="text-sm font-semibold text-[#222222]">{item.insurance_type}</p>
                              </div>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#222222]/60">
                    <p className="text-sm">No Insurance policies added yet</p>
                  </div>
                )}
              </TabsContent>

              {/* Shares Tab */}
              <TabsContent value="shares" className="mt-0">
                {shares.length > 0 && (
                  <div className="mb-6 p-4 bg-[#F5F7FB] rounded-lg border border-[#E5E7EB]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-1">
                          Portfolio Value
                        </p>
                        <p className="text-2xl font-bold text-[#FF6D1F]">
                          ₹
                          {shares
                            .reduce((sum, s) => sum + (s.current_price || s.purchase_price) * s.quantity, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-1">
                          Companies Invested
                        </p>
                        <p className="text-2xl font-bold text-[#222222]">{shares.length}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#222222]/50 uppercase tracking-wide mb-1">
                          Overall Return
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            shares.reduce(
                              (sum, s) => sum + ((s.current_price || s.purchase_price) - s.purchase_price) * s.quantity,
                              0,
                            ) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {shares.reduce(
                            (sum, s) => sum + ((s.current_price || s.purchase_price) - s.purchase_price) * s.quantity,
                            0,
                          ) >= 0
                            ? "+"
                            : ""}
                          {(
                            (shares.reduce(
                              (sum, s) => sum + ((s.current_price || s.purchase_price) - s.purchase_price) * s.quantity,
                              0,
                            ) /
                              shares.reduce((sum, s) => sum + s.purchase_price * s.quantity, 0)) *
                            100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      setManualEntryTab("shares")
                      window.scrollTo(0, document.body.scrollHeight)
                    }}
                    className="bg-[#FF6D1F] hover:bg-[#E85A0A] text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Share
                  </Button>
                </div>
                {shares.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shares.map((share) => {
                      const currentPrice = share.current_price || share.purchase_price
                      const gain = (currentPrice - share.purchase_price) * share.quantity
                      const gainPercent = ((currentPrice - share.purchase_price) / share.purchase_price) * 100
                      return (
                        <div
                          key={share.id}
                          className="p-5 bg-gradient-to-br from-white to-[#F5F7FB] rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm font-bold text-[#222222]">{share.stock_symbol}</p>
                              <p className="text-xs text-[#222222]/60">{share.company_name}</p>
                            </div>
                            <Badge
                              className={gainPercent >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                            >
                              {gainPercent >= 0 ? "+" : ""}
                              {gainPercent.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#222222]/70">Current Value</span>
                              <span className="font-semibold text-[#222222]">
                                ₹{(currentPrice * share.quantity).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#222222]/70">Quantity</span>
                              <span className="font-semibold text-[#222222]">{share.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#222222]/70">Gain/Loss</span>
                              <span className={`font-semibold ${gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                                ₹{gain >= 0 ? "+" : ""}
                                {gain.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#222222]/60">
                    <p className="text-sm">No Shares added yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "auto")} className="mb-8">
          <TabsList className="bg-white border border-[#E5E7EB] gap-2 p-1 shadow-sm">
            <TabsTrigger
              value="auto"
              className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] rounded-md"
            >
              AI Analysis
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] rounded-md"
            >
              Manual Entry
            </TabsTrigger>
          </TabsList>

          {/* Auto Mode */}
          <TabsContent value="auto" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                    What's Going Well
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Savings rate increased by 15%",
                    "Housing costs below 30% ratio",
                    "Consistent daily engagement",
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-[#F0FDF4] rounded-lg text-sm text-[#222222] border border-[#DCFCE7]">
                      ✓ {item}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-cream-light border border-[#E5E7EB] shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Target className="w-5 h-5 text-[#FF6D1F]" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Entertainment spending up 25%",
                    "Consider more health insurance",
                    "Build 3-month emergency fund",
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-[#FEF3C7] rounded-lg text-sm text-[#222222] border border-[#FDE68A]">
                      → {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manual Mode */}
          <TabsContent value="manual" className="mt-6 space-y-6">
            <ManualEntryForm onExpenseAdded={handleExpenseAdded} initialTab={manualEntryTab} />
          </TabsContent>

        </Tabs>
        </div>
      </div>
    </div>
  )
}
