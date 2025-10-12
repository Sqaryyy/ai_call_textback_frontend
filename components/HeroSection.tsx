"use client";
import React from "react";
import { useRouter } from "next/navigation"; // use "next/router" if using pages router

export default function VoxioDeskHero() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-gray-900">VoxioDesk</div>

        <div className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
          <button className="hover:text-gray-900">Features</button>
          <button className="hover:text-gray-900">Pricing</button>
          <button className="hover:text-gray-900">Resources</button>
        </div>

        <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Book Demo
        </button>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Turn missed calls into appointments
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Automatically text back missed callers and book them straight into
              your calendar. No manual follow-up needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-[1.02]">
                Start Free Trial
              </button>
              <button
                onClick={() => router.push("/demo")}
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
              >
                Watch Demo
              </button>
            </div>

            <p className="text-sm text-gray-500 pt-2">
              Free 14-day trial • No credit card required
            </p>
          </div>

          {/* Right Column - iPhone Mockup */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[3rem] blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <img
                  src="/iphone-mockup.png"
                  alt="iPhone mockup placeholder"
                  className="w-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
