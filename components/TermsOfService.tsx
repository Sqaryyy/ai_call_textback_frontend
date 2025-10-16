"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const TermsOfService = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              Terms of Service
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Please read our terms carefully before using VoxioDesk
            </motion.p>
          </div>

          {/* Main Content Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 md:p-12 border border-black"
          >
            <div className="prose prose-lg max-w-none">
              <div className="text-sm text-gray-500 mb-8">
                Last Updated: October 2025
              </div>

              {/* Section 1 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Agreement to Terms
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using VoxioDesk (the "Service"), you agree to
                  be bound by these Terms of Service. If you do not agree to
                  abide by the above, please do not use this service.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Service Description
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  VoxioDesk is an automated SMS appointment booking service. The
                  Service operates as follows:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    VoxioDesk automatically responds to missed calls by sending
                    SMS messages to your customers on your behalf
                  </li>
                  <li>
                    All SMS content, messaging templates, and automation
                    workflows are configured and controlled by VoxioDesk
                  </li>
                  <li>
                    You grant VoxioDesk permission to send automated messages to
                    your customers using your business information
                  </li>
                  <li>
                    The Service integrates with your Google Calendar to check
                    availability and book appointments automatically
                  </li>
                  <li>
                    You do not have direct control over the specific content of
                    individual messages sent to customers
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Your Responsibilities
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  By using the Service, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    You authorize VoxioDesk to send SMS messages to your
                    customers on your behalf
                  </li>
                  <li>
                    You are responsible for ensuring your customers have
                    consented to receive SMS communications from your business
                  </li>
                  <li>
                    You will comply with all applicable SMS marketing and
                    communication laws (including TCPA, CAN-SPAM, and similar
                    regulations)
                  </li>
                  <li>
                    You provide accurate business information for use in
                    automated messages
                  </li>
                  <li>
                    You maintain an accurate and up-to-date calendar to prevent
                    scheduling conflicts
                  </li>
                  <li>
                    You are responsible for honoring all appointments booked
                    through the Service
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Use License
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Permission is granted to use the Service for your business
                  appointment booking needs. Under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    Modify or attempt to modify the Service's messaging system
                  </li>
                  <li>
                    Use the Service for any unlawful or fraudulent purpose
                  </li>
                  <li>
                    Attempt to decompile or reverse engineer any software
                    contained in the Service
                  </li>
                  <li>
                    Remove any copyright or proprietary notations from the
                    Service
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion or
                    feature of the Service
                  </li>
                  <li>Use the Service to send spam or unsolicited messages</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Message Content and Control
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  You understand and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    VoxioDesk controls all message content, templates, and
                    automation logic
                  </li>
                  <li>
                    Messages are sent automatically based on predefined
                    workflows designed by VoxioDesk
                  </li>
                  <li>
                    You provide business information (name, services, etc.) that
                    may be included in messages
                  </li>
                  <li>
                    VoxioDesk may update message templates and workflows at any
                    time to improve service quality
                  </li>
                  <li>
                    You do not have the ability to customize individual message
                    content sent to customers
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Disclaimer
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service is provided on an 'as is' basis. VoxioDesk makes
                  no warranties, expressed or implied, regarding the Service
                  including, without limitation, implied warranties of
                  merchantability, fitness for a particular purpose, or
                  non-infringement. VoxioDesk does not guarantee that automated
                  messages will result in booked appointments or customer
                  satisfaction.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Limitations of Liability
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk shall not be liable for any damages (including,
                  without limitation, damages for loss of business, customer
                  complaints, regulatory fines, or missed appointments) arising
                  out of the use or inability to use the Service, even if
                  VoxioDesk has been notified of the possibility of such damage.
                  You agree to indemnify and hold VoxioDesk harmless from any
                  claims arising from messages sent on your behalf through the
                  Service.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Compliance with Laws
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  You are responsible for ensuring your use of the Service
                  complies with all applicable laws and regulations, including
                  but not limited to telecommunications laws, privacy laws, and
                  consumer protection laws in your jurisdiction. VoxioDesk
                  provides the technology platform, but you are responsible for
                  lawful use in your business context.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Account Termination
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk reserves the right to suspend or terminate your
                  account at any time if we determine you are using the Service
                  in violation of these Terms, applicable laws, or in a manner
                  that could harm VoxioDesk or other users. You may cancel your
                  account at any time by contacting us.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Modifications to Terms
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk may revise these Terms of Service at any time.
                  Material changes will be communicated to you via email or
                  through the Service. Your continued use of the Service after
                  changes are posted constitutes acceptance of the modified
                  terms.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Governing Law
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with applicable laws, and you irrevocably submit to
                  the exclusive jurisdiction of the courts in the applicable
                  location.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Contact Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  For questions about these Terms of Service, please contact us
                  at lupiascend@gmail.com.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
