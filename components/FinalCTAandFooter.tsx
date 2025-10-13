"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function FinalCTAAndFooter() {
  const router = useRouter();

  return (
    <>
      {/* Final CTA Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop losing revenue to missed calls
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            See exactly how VoxioDesk can transform your business. Book a
            personalized demo and we'll discuss custom pricing for your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-[1.02]">
              Book a Demo
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg">
              Start Free Trial
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            14-day free trial • Custom pricing available • No credit card
            required
          </p>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  10k+
                </div>
                <div className="text-sm text-gray-600">Businesses served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-sm text-gray-600">
                  Customer satisfaction
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">2M+</div>
                <div className="text-sm text-gray-600">Calls recovered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Support available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">
                VoxioDesk
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                Never miss another customer. Automatically text back missed
                callers and book appointments 24/7.
              </p>
              <div className="flex gap-4">
                {/* Social icons here (unchanged) */}
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Customers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 VoxioDesk. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <button
                  onClick={() => router.push("/privacy-policy")}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => router.push("/terms-of-service")}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => router.push("/cookies")}
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
