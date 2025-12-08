"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ArrowRight, ChevronDown } from "lucide-react"

const Hero = () => {
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline()

      timeline
        .from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          descRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          buttonRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          imageContainerRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-light via-cream-dark to-cream-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div ref={titleRef}>
              <p className="inline-block px-4 py-2 bg-orange-accent/10 rounded-full text-sm font-medium text-orange-accent border border-orange-accent/20 mb-6">
                ✨ Introducing Bachat Saathi
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
                Your Path to <span className="text-orange-accent">Financial</span>{" "}
                <span className="text-orange-accent">Excellence</span>
              </h1>
            </div>

            <div ref={descRef}>
              <p className="text-lg text-text-light leading-relaxed max-w-md">
                Bachat Saathi is your intelligent financial companion that simplifies money management - from daily
                expenses to long-term wealth building. Start your journey to financial freedom today.
              </p>
            </div>

            <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-orange-600 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-orange-800 transition-all duration-300 hover:shadow-lg shadow-md"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 bg-cream-dark text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-charcoal">50K+</p>
                <p className="text-sm text-text-light">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">₹2B+</p>
                <p className="text-sm text-text-light">Money Managed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">4.8★</p>
                <p className="text-sm text-text-light">User Rating</p>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div
            ref={imageContainerRef}
            className="relative h-96 md:h-full min-h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-accent/10 to-cream-dark/10 rounded-2xl" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16">
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-orange-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
