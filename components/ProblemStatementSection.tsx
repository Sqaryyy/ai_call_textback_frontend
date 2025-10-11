import React from "react";

export default function VoxioDeskProblem() {
  return (
    <div className="bg-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop losing customers to voicemail
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            When you miss a call, most customers won't leave a voicemail or call
            back. VoxioDesk texts them instantly so you never lose another lead.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without VoxioDesk */}
          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-500">
            <div className="mb-6">
              <div className="w-12 h-1 bg-red-500 mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                Without VoxioDesk
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  67% of missed callers never call back
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Leads move on to competitors who respond first
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Staff wastes hours playing phone tag
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  No way to book appointments after hours
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Lost revenue adds up to thousands per month
                </p>
              </div>
            </div>
          </div>

          {/* With VoxioDesk */}
          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-500">
            <div className="mb-6">
              <div className="w-12 h-1 bg-green-500 mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                With VoxioDesk
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Texts every missed caller within seconds
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Keeps leads engaged before they contact someone else
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Books appointments automatically via text
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Works 24/7, even when your business is closed
                </p>
              </div>
              <div className="flex gap-3">
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
                <p className="text-gray-700">
                  Recovers revenue lost to missed calls
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:scale-[1.02]">
            Start Converting Missed Calls Today
          </button>
        </div>
      </div>
    </div>
  );
}
