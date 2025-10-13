"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VoxioDeskHero() {
  const router = useRouter();

  return (
    <div>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto"
      >
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src="/VOXIO_DESK.png"
            alt="VoxioDesk Logo"
            width={120}
            height={40}
            priority
          />
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
          {["Features", "Pricing", "Resources"].map((item, i) => (
            <motion.button
              key={item}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.1,
                ease: "easeOut",
              }}
              className="hover:text-gray-900"
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Book Demo
        </motion.button>
      </motion.nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8 md:-mt-24">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight"
            >
              Turn missed calls into appointments
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
            >
              Automatically text back missed callers and book them straight into
              your calendar. No manual follow-up needed.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/demo")}
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="text-sm text-gray-500 pt-2"
            >
              Free 14-day trial • No credit card required
            </motion.p>
          </div>

          {/* Right Column - iPhone Mockup */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-sm">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[3rem] blur-3xl"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative z-10"
              >
                <Image
                  src="/iphone-mockup.png"
                  alt="iPhone mockup placeholder"
                  width={400}
                  height={800}
                  className="w-full drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
