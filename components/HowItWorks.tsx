"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Customer calls but you're busy",
      description:
        "When a call goes to voicemail, VoxioDesk detects it instantly",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Automatic text sent immediately",
      description:
        "A personalized SMS is sent within seconds, keeping the lead warm",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "AI handles the conversation",
      description:
        "Our AI assistant answers questions and guides them to book an appointment",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Appointment booked in your calendar",
      description:
        "Customer confirms a time and it syncs directly to your scheduling system",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="py-20 md:py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            VoxioDesk runs on autopilot. From missed call to booked appointment
            in minutes.
          </motion.p>
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-black"
        >
          {/* Steps - Single Column */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex gap-6">
                  {/* Icon Circle */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + index * 0.15,
                      ease: "easeOut",
                    }}
                    className="flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      {step.icon}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={
                      isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.15,
                      ease: "easeOut",
                    }}
                    className="pt-1 flex-1"
                  >
                    <div className="text-sm font-bold text-gray-400 mb-2">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8 + index * 0.15,
                      ease: "easeOut",
                    }}
                    className="absolute top-20 left-8 w-0.5 h-12 bg-gradient-to-b from-indigo-200 to-transparent origin-top"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="mt-20 text-center pt-8 border-t border-gray-200"
          >
            <p className="text-gray-600 mb-6 text-lg">
              Ready to stop losing customers?
            </p>
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                window.open(
                  "https://calendly.com/lukapilip/discovery-call",
                  "_blank"
                )
              }
              className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
