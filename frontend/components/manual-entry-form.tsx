"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ManualEntryFormProps {
  onExpenseAdded: () => void
  initialTab?: string
}

export function ManualEntryForm({ onExpenseAdded, initialTab = "expenses" }: ManualEntryFormProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Expenses state
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  // FD state
  const [fdAmount, setFdAmount] = useState("")
  const [fdDuration, setFdDuration] = useState("")
  const [fdInterestRate, setFdInterestRate] = useState("")

  // Insurance state
  const [insuranceAmount, setInsuranceAmount] = useState("")
  const [insuranceType, setInsuranceType] = useState("")

  // Shares state
  const [stockSymbol, setStockSymbol] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")

  const handleExpenseSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!category || !amount) {
        setMessage("Please fill in all required fields")
        return
      }

      setIsLoading(true)
      setMessage("")

      try {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            amount: Number.parseFloat(amount),
            description,
          }),
        })

        if (!response.ok) throw new Error("Failed to add expense")

        setCategory("")
        setAmount("")
        setDescription("")
        setMessage("Expense added successfully!")
        onExpenseAdded()
        setTimeout(() => setMessage(""), 2000)
      } catch (error) {
        setMessage("Error adding expense. Please try again.")
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [category, amount, description, onExpenseAdded],
  )

  const handleFinancialSubmit = useCallback(
    async (e: React.FormEvent, type: "fd" | "insurance") => {
      e.preventDefault()
      setIsLoading(true)
      setMessage("")

      try {
        const payload =
          type === "fd"
            ? {
                type,
                fdAmount: Number(fdAmount),
                fdDuration: Number(fdDuration),
                fdInterestRate: Number(fdInterestRate),
              }
            : { type, insuranceAmount: Number(insuranceAmount), insuranceType }

        const response = await fetch("/api/financial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error("Failed to add financial data")

        if (type === "fd") {
          setFdAmount("")
          setFdDuration("")
          setFdInterestRate("")
        } else if (type === "insurance") {
          setInsuranceAmount("")
          setInsuranceType("")
        }

        setMessage("Added successfully!")
        onExpenseAdded()
        setTimeout(() => setMessage(""), 2000)
      } catch (error) {
        setMessage("Error adding data. Please try again.")
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [fdAmount, fdDuration, fdInterestRate, insuranceAmount, insuranceType, onExpenseAdded],
  )

  const handleSharesSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!stockSymbol || !quantity || !purchasePrice) {
        setMessage("Please fill in all required fields")
        return
      }

      setIsLoading(true)
      setMessage("")

      try {
        const response = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock_symbol: stockSymbol,
            company_name: companyName,
            quantity: Number(quantity),
            purchase_price: Number(purchasePrice),
            current_price: currentPrice ? Number(currentPrice) : Number(purchasePrice),
            purchase_date: purchaseDate,
          }),
        })

        if (!response.ok) throw new Error("Failed to add share")

        setStockSymbol("")
        setCompanyName("")
        setQuantity("")
        setPurchasePrice("")
        setCurrentPrice("")
        setPurchaseDate("")
        setMessage("Share added successfully!")
        onExpenseAdded()
        setTimeout(() => setMessage(""), 2000)
      } catch (error) {
        setMessage("Error adding share. Please try again.")
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [stockSymbol, companyName, quantity, purchasePrice, currentPrice, purchaseDate, onExpenseAdded],
  )

  const categories = ["Food", "Transport", "Entertainment", "Housing", "Utilities", "Healthcare", "Education", "Other"]
  const insuranceTypes = ["Life Insurance", "Health Insurance", "Auto Insurance", "Home Insurance", "Travel Insurance"]

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Financial Entry</CardTitle>
        <CardDescription>Track your expenses and investments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#F5E7C6] border-none gap-2 p-1">
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-[#FF6D1F] data-[state=active]:text-white text-[#222222] text-sm"
            >
              My Expenses
            </TabsTrigger>
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

          {/* My Expenses Tab */}
          <TabsContent value="expenses" className="mt-6">
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222222]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Amount *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#222222]">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes"
                  className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold h-10"
              >
                {isLoading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </TabsContent>

          {/* FD Tab */}
          <TabsContent value="fd" className="mt-6">
            <form onSubmit={(e) => handleFinancialSubmit(e, "fd")} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#222222]">FD Amount *</label>
                <input
                  type="number"
                  value={fdAmount}
                  onChange={(e) => setFdAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222222]">Duration (months)</label>
                  <input
                    type="number"
                    value={fdDuration}
                    onChange={(e) => setFdDuration(e.target.value)}
                    placeholder="12"
                    min="0"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={fdInterestRate}
                    onChange={(e) => setFdInterestRate(e.target.value)}
                    placeholder="5.5"
                    step="0.01"
                    min="0"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold h-10"
              >
                {isLoading ? "Adding..." : "Add FD"}
              </Button>
            </form>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="mt-6">
            <form onSubmit={(e) => handleFinancialSubmit(e, "insurance")} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222222]">Insurance Amount *</label>
                  <input
                    type="number"
                    value={insuranceAmount}
                    onChange={(e) => setInsuranceAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Insurance Type *</label>
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  >
                    <option value="">Select type</option>
                    {insuranceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold h-10"
              >
                {isLoading ? "Adding..." : "Add Insurance"}
              </Button>
            </form>
          </TabsContent>

          {/* Shares Tab */}
          <TabsContent value="shares" className="mt-6">
            <form onSubmit={handleSharesSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222222]">Stock Symbol *</label>
                  <input
                    type="text"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                    placeholder="e.g., TCS"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Tata Consultancy Services"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222222]">Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Purchase Price *</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222222]">Current Price</label>
                  <input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#222222]">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full h-10 bg-[#FAF3E1] border border-[#FFB84D] rounded-lg px-3 text-[#222222] mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold h-10"
              >
                {isLoading ? "Adding..." : "Add Share"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <p className={`text-sm mt-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
