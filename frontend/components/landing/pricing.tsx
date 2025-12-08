"use client"

import Link from "next/link"
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Check, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: index * 0.15,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      period: "Forever",
      description: "Perfect for getting started with basic financial tracking",
      features: [
        "Basic expense tracking",
        "Monthly budget creation",
        "Basic reports",
        "Email support",
        "Up to 2 connected accounts",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      description: "For serious money managers and growing businesses",
      features: [
        "Advanced analytics & insights",
        "AI-powered recommendations",
        "Unlimited connected accounts",
        "Priority support",
        "Custom budgets & goals",
        "Investment tracking",
        "Tax optimization tools",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
         
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">Choose the plan that fits your financial journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-orange-600 text-white shadow-2xl ring-2 ring-orange-accent/50 scale-105"
                  : "bg-cream-light border-2 border-border hover:border-orange-accent"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? "text-orange-100" : "text-text-light"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-charcoal"}`}>
                  {plan.price}
                </span>
                {plan.price !== "₹0" && (
                  <span className={`ml-2 ${plan.highlighted ? "text-orange-100" : "text-text-light"}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href="/signup"
                className={`w-full py-3 rounded-full font-semibold mb-8 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  plan.highlighted
                    ? "bg-orange-200 text-black hover:bg-orange-50"
                    : "bg-orange-600 text-white hover:bg-orange-800"
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-white" : "text-orange-accent"}`}
                    />
                    <span className={`text-sm ${plan.highlighted ? "text-white" : "text-charcoal"}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
