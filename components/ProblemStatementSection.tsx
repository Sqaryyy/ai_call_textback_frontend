"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function VoxioDeskProblem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Stop losing customers to voicemail
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            When you miss a call, most customers won't leave a voicemail or call
            back. VoxioDesk texts them instantly so you never lose another lead.
          </motion.p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without VoxioDesk */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-500"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="w-12 h-1 bg-red-500 mb-4 origin-left"
              />
              <h3 className="text-2xl font-bold text-gray-900">
                Without VoxioDesk
              </h3>
            </div>
            <div className="space-y-4">
              {[
                "67% of missed callers never call back",
                "Leads move on to competitors who respond first",
                "Staff wastes hours playing phone tag",
                "No way to book appointments after hours",
                "Lost revenue adds up to thousands per month",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + i * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* With VoxioDesk */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-500"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="w-12 h-1 bg-green-500 mb-4 origin-left"
              />
              <h3 className="text-2xl font-bold text-gray-900">
                With VoxioDesk
              </h3>
            </div>
            <div className="space-y-4">
              {[
                "Texts every missed caller within seconds",
                "Keeps leads engaged before they contact someone else",
                "Books appointments automatically via text",
                "Works 24/7, even when your business is closed",
                "Recovers revenue lost to missed calls",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + i * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Converting Missed Calls Today
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
