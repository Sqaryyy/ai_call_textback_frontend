"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly does VoxioDesk respond to missed calls?",
      answer:
        "VoxioDesk sends a text within seconds of detecting a missed call. Most customers receive their first message before they even put their phone down.",
    },
    {
      question: "Does it work with my existing phone system?",
      answer:
        "Yes! VoxioDesk integrates with virtually any phone system. We support landlines, VoIP systems, and mobile numbers. Setup takes less than 5 minutes with no technical expertise required.",
    },
    {
      question: "Will the texts sound robotic or impersonal?",
      answer:
        "Not at all. Our AI is trained to sound natural and conversational. You can customize the tone, branding, and messaging to match your business voice perfectly. Most customers can't tell they're talking to AI.",
    },
    {
      question: "What if someone asks a question the AI can't answer?",
      answer:
        "VoxioDesk handles 90%+ of common questions automatically. For complex inquiries, it seamlessly escalates to your team with full conversation context. You can also set custom responses for industry-specific questions.",
    },
    {
      question: "How does it integrate with my calendar?",
      answer:
        "VoxioDesk connects directly to Google Calendar, Outlook, Calendly, Acuity, and most major scheduling platforms. Appointments sync in real-time, and you can set your availability rules, buffer times, and booking limits.",
    },
    {
      question: "Can I customize what VoxioDesk says?",
      answer:
        "Absolutely. You have full control over greetings, responses, qualifying questions, and booking flows. Create different conversation templates for different types of inquiries or services.",
    },
    {
      question:
        "What happens if I'm already on a call when someone texts back?",
      answer:
        "VoxioDesk handles the entire conversation automatically. It will answer questions, qualify the lead, and book the appointment without any action needed from you. You'll just see a new appointment appear in your calendar.",
    },
    {
      question: "Is there a contract or can I cancel anytime?",
      answer:
        "No contracts required. You can cancel anytime with no penalties or fees. We offer a 14-day free trial so you can test everything risk-free before committing.",
    },
    {
      question: "How much does it cost compared to a receptionist?",
      answer:
        "VoxioDesk costs a fraction of hiring staff—typically under $200/month versus $3,000+ for a full-time receptionist. Plus, it works 24/7, never takes breaks, and scales instantly during busy periods.",
    },
    {
      question: "What if I get a spam or unwanted call?",
      answer:
        "VoxioDesk can filter spam calls and you can set up blocklists. You also have full control to review conversations and mark numbers that shouldn't receive automated responses.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div ref={ref} className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Everything you need to know about VoxioDesk
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.05,
                ease: "easeOut",
              }}
              className="border-2 border-black rounded-xl overflow-hidden transition-colors hover:border-gray-400"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                className="w-full flex items-center justify-between p-6 text-left bg-white transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 text-center bg-gray-50 rounded-2xl p-8 border-2 border-black"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you get started
          </p>
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() =>
              window.open(
                "https://calendly.com/lukapilip/discovery-call",
                "_blank"
              )
            }
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Talk to Sales
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
