"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TrendingUp, PieChart, Lock, Zap } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     cardsRef.current.forEach((card, index) => {
  //       gsap.from(card, {
  //         scrollTrigger: {
  //           trigger: card,
  //           start: "top 80%",
  //           end: "top 20%",
  //           scrub: 1,
  //         },
  //         opacity: 0,
  //         y: 40,
  //         duration: 0.2,
  //       })
  //     })
  //   }, containerRef)

  //   return () => ctx.revert()
  // }, [])

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Insights",
      description:
        "Track your financial health with live updates and comprehensive analytics. Make informed decisions backed by data.",
    },
    {
      icon: PieChart,
      title: "Smart Budget Tracking",
      description:
        "Categorize expenses automatically and stay on top of your spending patterns with intelligent suggestions.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "Your financial data is protected with enterprise-level encryption and privacy controls.",
    },
    {
      icon: Zap,
      title: "AI-Powered Advice",
      description:
        "Get personalized recommendations to optimize your finances and achieve your financial goals faster.",
    },
  ]

  return (
    <section id="features" ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">Features you will love</h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Bachat Saathi combines powerful tools with an intuitive interface to make financial management effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
                className="p-8 bg-cream-light rounded-xl border border-border hover:border-orange-accent transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{feature.title}</h3>
                <p className="text-text-light leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
