"use client"

import Link from "next/link"
import { Mail, Phone, Linkedin, Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-accent to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                BS
              </div>
              <span className="font-bold text-lg">Bachat Saathi</span>
            </div>
            <p className="text-gray-400 text-sm">Your intelligent financial companion for smarter money management.</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="#features" className="hover:text-gray-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-gray-500 transition-colors">
                  Pricing
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              
              <li>
                <Link href="#testimonial" className="hover:text-gray-500 transition-colors">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-gray-500 transition-colors">
                  How We Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:hello@bachtasaathi.com"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@bachtasaathi.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +977 9876 543 210
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-400 text-sm">© 2025 Bachat Saathi. All rights reserved.</p>

           

            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-gray-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
