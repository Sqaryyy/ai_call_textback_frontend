"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function FinalCTAAndFooter() {
  const router = useRouter();

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            {/* Brand Column */}
            <div>
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
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 Lupi LTD. All rights reserved.
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
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
