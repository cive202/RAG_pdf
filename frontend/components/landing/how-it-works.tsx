"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
          },
          opacity: 0,
          x: index % 2 === 0 ? -30 : 30,
          duration: 0.6,
          delay: index * 0.1,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const steps = [
    {
      number: "01",
      title: "Sign Up & Connect",
      description:
        "Create your Bachat Saathi account securely. Connect your banks, cards, and investment platforms safely.",
    },
    {
      number: "02",
      title: "Analyze & Understand",
      description: "Let our AI analyze your financial patterns and provide personalized insights about your habits.",
    },
    {
      number: "03",
      title: "Get Strategic Insights",
      description: "Receive clear, actionable recommendations tailored to your financial goals and circumstances.",
    },
    {
      number: "04",
      title: "Take Action Confidently",
      description: "Execute your financial plans with step-by-step guidance and ongoing support from our platform.",
    },
  ]

  return (
    <section id="how-it-works" ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">How It Works</h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Simple steps to transform your financial journey with Bachat Saathi.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Center Timeline Line - on mobile shift to left, on md center */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-px h-full bg-orange-600"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) stepsRef.current[index] = el
                }}
                className={`relative flex gap-6 flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline Dot - positioned left on mobile, centered on md */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-8 z-10">
                  <div className="h-6 w-6 rounded-full bg-white border-4 border-orange-600 shadow-lg"></div>
                </div>

                {/* Card Container - full width on mobile, half on md with alternating alignment */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"} text-left`}>
                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 items-start">
                      <div className={`${index % 2 === 1 ? "md:order-last" : ""} flex-shrink-0`}>
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-600 text-white font-bold text-lg flex-shrink-0">
                          {step.number}
                        </div>
                      </div>
                      <div className={`${index % 2 === 1 ? "md:order-first" : ""} flex-grow`}>
                        <h3 className="text-lg font-bold text-charcoal mb-2">{step.title}</h3>
                        <p className="text-sm text-text-light leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
