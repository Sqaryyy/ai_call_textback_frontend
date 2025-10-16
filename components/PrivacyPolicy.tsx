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
                  collects, uses, discloses, and handles information when you
                  use our automated SMS appointment booking service. VoxioDesk
                  acts as a service provider that sends automated messages to
                  your customers on your behalf.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Information We Collect
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.1 Business Account Information
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    When you sign up for VoxioDesk, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Business name and contact information</li>
                    <li>Account credentials and authentication data</li>
                    <li>Business phone number for SMS routing</li>
                    <li>Service offerings and business hours</li>
                    <li>Payment and billing information</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.2 Calendar Integration Data
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    To enable automated appointment booking, we access your
                    Google Calendar and collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Calendar availability and busy/free status</li>
                    <li>Existing appointment times and durations</li>
                    <li>
                      Calendar event details necessary to prevent double-booking
                    </li>
                  </ul>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    This data is used solely to check availability and create
                    new appointments. We do not share calendar contents with
                    third parties.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    2.3 Customer Data
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    When your customers interact with our automated SMS system,
                    we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>
                      Customer phone numbers (from missed calls to your
                      business)
                    </li>
                    <li>
                      SMS message content exchanged during booking conversations
                    </li>
                    <li>Appointment preferences (date, time, service type)</li>
                    <li>Interaction history and response patterns</li>
                  </ul>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    We process this information on your behalf to provide the
                    automated booking service.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We use collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    <strong>Automated SMS Messaging:</strong> To send
                    appointment booking messages to your customers on your
                    behalf
                  </li>
                  <li>
                    <strong>Calendar Management:</strong> To check availability
                    and automatically create appointments in your calendar
                  </li>
                  <li>
                    <strong>Service Configuration:</strong> To set up and
                    maintain your automated booking workflows
                  </li>
                  <li>
                    <strong>Message Generation:</strong> To create appropriate
                    SMS responses based on customer interactions
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> To analyze system
                    performance and improve automation quality
                  </li>
                  <li>
                    <strong>Billing and Support:</strong> To process payments
                    and provide customer support
                  </li>
                  <li>
                    <strong>Security and Compliance:</strong> To detect fraud,
                    ensure service security, and comply with legal obligations
                  </li>
                </ul>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  <strong>Important:</strong> VoxioDesk controls the content and
                  timing of messages sent to your customers. You do not have
                  direct control over individual message content, though
                  messages are sent on your behalf using your business
                  information.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  4. Data Sharing and Disclosure
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.1 We Do Not Sell Your Data
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    VoxioDesk does not sell, rent, or trade your business
                    information or customer data to third parties for marketing
                    purposes.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.2 Service Providers
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    We share data with trusted service providers who assist in
                    operating VoxioDesk:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>SMS gateway providers for message delivery</li>
                    <li>Cloud hosting and storage providers</li>
                    <li>Payment processors for billing</li>
                    <li>Analytics providers for service improvement</li>
                  </ul>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    All service providers are bound by confidentiality
                    agreements and process data only as instructed by VoxioDesk.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.3 Legal Requirements
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We may disclose information if required by law, court order,
                    government request, or to protect the rights, property, or
                    safety of VoxioDesk, our users, or the public.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    4.4 Business Transfers
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    If VoxioDesk is involved in a merger, acquisition, or sale
                    of assets, your information may be transferred. We will
                    provide notice before your information becomes subject to a
                    different privacy policy.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Your Role and Responsibilities
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  As a VoxioDesk user, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    You authorize VoxioDesk to send automated messages to your
                    customers on your behalf
                  </li>
                  <li>
                    You are responsible for ensuring your customers have
                    consented to receive SMS communications
                  </li>
                  <li>
                    You must comply with applicable telecommunications and
                    privacy laws in your jurisdiction
                  </li>
                  <li>
                    You are the data controller for your customer data, while
                    VoxioDesk acts as a data processor
                  </li>
                  <li>
                    You should inform your customers that automated systems are
                    used for appointment booking
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  6. Data Security
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We implement industry-standard security measures to protect
                  your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Restricted employee access to customer data</li>
                  <li>Secure integration with Google Calendar API</li>
                </ul>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  While we implement robust security measures, no system is
                  completely secure. You are responsible for maintaining the
                  confidentiality of your account credentials.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Data Retention
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We retain your business account data for as long as your
                  account is active. Customer interaction data is retained for
                  the duration necessary to provide the Service and for a
                  reasonable period thereafter for analytics and service
                  improvement. You may request deletion of your data by
                  contacting us at lupiascend@gmail.com.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  8. Your Privacy Rights
                </h3>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    8.1 Business Account Holders
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    As a VoxioDesk customer, you have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Access your account data and settings</li>
                    <li>Correct inaccurate business information</li>
                    <li>
                      Request deletion of your account and associated data
                    </li>
                    <li>Export customer interaction records</li>
                    <li>Revoke Google Calendar access at any time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    8.2 End Customers
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    If you are a customer who received automated messages from a
                    business using VoxioDesk, you should contact that business
                    directly regarding your data. They are the data controller
                    and responsible for managing your information. You can opt
                    out of messages by replying STOP to any SMS.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Google Calendar Integration
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk integrates with Google Calendar through secure OAuth
                  authentication. We only access calendar data necessary for
                  checking availability and creating appointments. You can
                  revoke VoxioDesk's access to your Google Calendar at any time
                  through your Google Account settings. This will disable the
                  automated booking functionality.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  10. International Data Transfers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk operates globally and may process data in various
                  locations. By using the Service, you consent to the transfer
                  and processing of information in countries that may have
                  different data protection laws than your jurisdiction.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Children's Privacy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  VoxioDesk is intended for business use only and is not
                  directed at individuals under 18 years of age. We do not
                  knowingly collect information from children.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Changes to This Privacy Policy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy periodically. Material
                  changes will be communicated via email or through the Service.
                  The "Last Updated" date at the top reflects the most recent
                  revision. Continued use of VoxioDesk after changes constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              {/* Section 13 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  13. Contact Us
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  For questions about this Privacy Policy or to exercise your
                  privacy rights, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Email:</strong> lupiascend@gmail.com
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
