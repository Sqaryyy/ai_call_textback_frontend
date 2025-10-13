// components/TermsOfService.tsx
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
                  2. Use License
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Permission is granted to temporarily access the materials
                  (information and content) on the Service for personal,
                  non-commercial transitory viewing only. This is the grant of a
                  license, not a transfer of title, and under this license you
                  may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>
                    Use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    Attempt to decompile or reverse engineer any software
                    contained on the Service
                  </li>
                  <li>
                    Remove any copyright or other proprietary notations from the
                    materials
                  </li>
                  <li>
                    Transfer the materials to another person or "mirror" the
                    materials on any other server
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion or
                    feature of the Service
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Disclaimer
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The materials on the Service are provided on an 'as is' basis.
                  The Service makes no warranties, expressed or implied, and
                  hereby disclaims and negates all other warranties including,
                  without limitation, implied warranties or conditions of
                  merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation
                  of rights.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Limitations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  In no event shall the Service or its suppliers be liable for
                  any damages (including, without limitation, damages for loss
                  of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on the
                  Service, even if the Service or an authorized representative
                  has been notified orally or in writing of the possibility of
                  such damage.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Accuracy of Materials
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The materials appearing on the Service could include
                  technical, typographical, or photographic errors. The Service
                  does not warrant that any of the materials on the Service are
                  accurate, complete, or current. The Service may make changes
                  to the materials contained on the Service at any time without
                  notice.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Links
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service has not reviewed all of the sites linked to its
                  website and is not responsible for the contents of any such
                  linked site. The inclusion of any link does not imply
                  endorsement by the Service of the site. Use of any such linked
                  website is at the user's own risk.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Modifications
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The Service may revise these terms of service for its website
                  at any time without notice. By using this website, you are
                  agreeing to be bound by the then current version of these
                  terms of service.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Governing Law
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of [Your Jurisdiction], and you
                  irrevocably submit to the exclusive jurisdiction of the courts
                  located in that location.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Account Responsibilities
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  You are responsible for maintaining the confidentiality of
                  your account information and password. You agree to accept
                  responsibility for all activities that occur under your
                  account. You must notify the Service immediately of any
                  unauthorized use of your account.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Prohibited Uses
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  You agree not to use the Service for any unlawful purposes or
                  in violation of any applicable laws or regulations.
                  Specifically, you agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Send unsolicited or fraudulent messages</li>
                  <li>Violate any applicable laws regarding communications</li>
                  <li>Attempt to breach security measures</li>
                  <li>Interfere with the normal operation of the Service</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
