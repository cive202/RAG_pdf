"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-accent to-orange-600 flex items-center justify-center text-white font-bold">
              BS
            </div>
            <span className="hidden md:inline font-bold text-lg text-charcoal">Bachat Saathi</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-charcoal hover:text-orange-accent transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-charcoal hover:text-orange-accent transition-colors text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-charcoal hover:text-orange-accent transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-800 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-cream-light rounded-lg transition-colors"
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            type="button"
          >
            {!isOpen ? (
              <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div
            className={`md:hidden mt-2 bg-white shadow-md rounded-b-lg py-4 px-4 transition-all duration-200`}
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-3">
              <Link href="#features" onClick={() => setIsOpen(false)} className="text-charcoal text-base font-medium">
                Features
              </Link>
              <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-charcoal text-base font-medium">
                How It Works
              </Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-charcoal text-base font-medium">
                Pricing
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-800 transition-all duration-300 text-sm text-center shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>    
    </nav>    
  )  
}

export default Navigation;
