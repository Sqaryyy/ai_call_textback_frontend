// components/PrivacyPolicy.tsx
"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const PrivacyPolicy = () => {
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
              Privacy Policy
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              How VoxioDesk protects your data and privacy
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
                  1. Introduction
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This Privacy Policy explains how VoxioDesk (the "Service")
                  collects, uses, discloses, and otherwise handles your
                  information when you use our Service through Google
                  integration.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Information We Collect
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.1 Calendar Information
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    To provide our Service, we require access to your business
                    calendar through Google Calendar. Specifically, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>
                      Calendar event details (event names, times, dates, and
                      duration)
                    </li>
                    <li>Calendar availability information</li>
                    <li>Event descriptions and notes</li>
                    <li>Attendee information associated with events</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.2 Client Information
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    When clients book appointments through SMS, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Client phone numbers</li>
                    <li>Appointment details (date, time, service type)</li>
                    <li>
                      Any messages or notes provided by clients during booking
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.3 Device and Usage Information
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    We automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Device type and operating system</li>
                    <li>IP address</li>
                    <li>Service usage patterns and frequency</li>
                    <li>Error logs and technical diagnostics</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    <strong>Service Delivery:</strong> To process and confirm
                    appointments through SMS
                  </li>
                  <li>
                    <strong>Calendar Integration:</strong> To check availability
                    and prevent double-booking
                  </li>
                  <li>
                    <strong>Communication:</strong> To send appointment
                    confirmations and reminders to clients
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> To analyze usage
                    patterns and improve functionality
                  </li>
                  <li>
                    <strong>Security:</strong> To detect and prevent fraud,
                    abuse, or security breaches
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> To comply with applicable
                    laws and regulations
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  4. Sharing of Information
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.1 Third Parties
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    We do not sell, trade, or rent your personal information to
                    third parties. However, we may share information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>
                      <strong>Service Providers:</strong> Trusted vendors who
                      assist in operating our Service under confidentiality
                      agreements
                    </li>
                    <li>
                      <strong>Business Partners:</strong> If you integrate our
                      Service with other business tools
                    </li>
                    <li>
                      <strong>Law Enforcement:</strong> If required by law,
                      court order, or government request
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.2 Business Transfers
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    If the Service is involved in a merger, acquisition,
                    bankruptcy, dissolution, reorganization, or similar
                    transaction, your information may be transferred as part of
                    that transaction. We will provide notice before your
                    information becomes subject to a different privacy policy.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  5. Data Security
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We implement appropriate technical, administrative, and
                  physical security measures designed to protect your
                  information against unauthorized access, disclosure,
                  alteration, and destruction. However, no method of
                  transmission over the internet is 100% secure, and we cannot
                  guarantee absolute security.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  5.1 Google Calendar Data
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Calendar data accessed through Google integration is handled
                  according to Google's security standards and our own security
                  protocols. Data is encrypted in transit and stored securely.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Data Retention
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We retain your information only for as long as necessary to
                  provide the Service and fulfill the purposes outlined in this
                  Privacy Policy. When information is no longer needed, we
                  securely delete or anonymize it. Clients may request deletion
                  of their data by contacting your business directly.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  7. Your Privacy Rights
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    7.1 Access and Control
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Access your personal information we hold</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Withdraw consent for data processing</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    7.2 How to Exercise Your Rights
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    To exercise any of these rights, please contact us at{" "}
                    <span className="font-semibold">lupiascend@gmail.com</span>.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    7.3 Google Data
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Since we access your Google Calendar, you can also manage
                    your privacy settings directly through your Google Account
                    settings and revoke our access to your calendar at any time.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Cookies and Tracking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service may use cookies and similar tracking technologies
                  to enhance functionality. You can control cookie settings
                  through your browser. Note that disabling cookies may limit
                  Service functionality.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Third-Party Links
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service may contain links to third-party websites. We are
                  not responsible for the privacy practices of external
                  websites. We encourage you to review the privacy policies of
                  any third-party services before providing personal
                  information.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Children's Privacy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service is not intended for users under 18 years old. We
                  do not knowingly collect personal information from children.
                  If we become aware that we have collected information from a
                  child, we will delete it promptly.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  11. International Data Transfers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  If you access the Service from outside [Your Jurisdiction],
                  your information may be transferred to, stored in, and
                  processed in [Your Jurisdiction] or other countries. By using
                  the Service, you consent to such transfers.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Changes to This Privacy Policy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify
                  you of any material changes by updating the "Last Updated"
                  date and, where applicable, by providing additional notice.
                  Your continued use of the Service constitutes acceptance of
                  the updated Privacy Policy.
                </p>
              </section>

              {/* Section 13 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  13. Contact Us
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  If you have questions about this Privacy Policy, concerns
                  about our privacy practices, or wish to exercise your privacy
                  rights, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Email:</strong> lupiascend@gmail.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> [Your Business Address]
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> [Your Phone Number]
                  </p>
                </div>
              </section>

              {/* Section 14 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  14. Data Processing Agreement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  For businesses subject to data protection regulations (such as
                  GDPR or CCPA), we are prepared to enter into a Data Processing
                  Agreement that outlines our obligations as a data processor.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
