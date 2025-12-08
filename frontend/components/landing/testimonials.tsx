"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const Testimonials = () => {
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
          y: 30,
          duration: 0.6,
          delay: index * 0.1,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const testimonials = [
    {
      name: "Priya KC",
      location: "Dhading",
      image: "/professional-woman-portrait.png",
      content:
        "Bachat Saathi completely transformed how I manage my finances. I save 15 hours every month on financial planning!",
      rating: 4,
    },
    {
      name: "Santosh Rai",
      location: "Parbat",
      image: "/professional-man-portrait.png",
      content: "The AI recommendations helped me reduce unnecessary spending and invest better. Highly recommended!",
      rating: 5,
    },
    {
      name: "Aniket Dahal",
      location: "Gulmi",
      image: "/young-man-professional-portrait.png",
      content:
        "Finally, a financial app that understands my needs. The interface is clean, and the insights are actionable.",
      rating: 4,
    },
  ]

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
         
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">What Our Users Say</h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Join thousands of happy users who've transformed their financial lives with Bachat Saathi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="bg-white rounded-xl p-8 border border-border hover:border-orange-accent transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-600 text-orange-accent" />
                ))}
              </div>

              <p className="text-charcoal mb-6 leading-relaxed italic">"{testimonial.content}"</p>

              <div className="flex items-center gap-3 border-t border-border pt-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-charcoal">{testimonial.name}</p>
                  <p className="text-sm text-text-light">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
