"use client"

import Link from "next/link"
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"

const CTA = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div
          ref={contentRef}
          className="relative rounded-3xl overflow-hidden bg-orange-600 p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Start Your Financial Journey Today
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Join 50,000+ users who are taking control of their finances with Bachat Saathi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-orange-200 text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 hover:shadow-lg shadow-md"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#pricing"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
              >
                View Pricing
              </Link>
            </div>

            <p className="text-sm text-white mt-8">No credit card required. Start free today.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
