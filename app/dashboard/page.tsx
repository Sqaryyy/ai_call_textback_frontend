"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export default function MetricsDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [businessId, setBusinessId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  type Metrics = {
    total_conversations: number;
    response_rate: number;
    bookings_created: number;
    booking_conversion_rate: number;
    avg_response_time_minutes?: number;
    avg_conversation_duration_minutes?: number;
    total_messages: number;
    completed_conversations: number;
    completion_rate: number;
    bookings_abandoned: number;
    abandonment_rate: number;
  };

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchMetrics = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/metrics/${businessId}/summary?year=${year}&month=${month}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching metrics");
      }
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessIdSubmit = async () => {
    if (!businessId.trim()) {
      setError("Please enter a business ID");
      return;
    }
    setIsAuthenticated(true);
    await fetchMetrics();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setBusinessId("");
    setMetrics(null);
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
  };

  return (
    <div
      ref={ref}
      className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {!isAuthenticated ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-12 border border-gray-200 shadow-2xl max-w-md w-full"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Enter your business ID to access your dashboard
                </p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Business ID"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleBusinessIdSubmit()
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-center text-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBusinessIdSubmit}
                  disabled={loading}
                  className="w-full px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Access Dashboard"}
                </motion.button>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={
                      isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight"
                  >
                    Performance Metrics
                  </motion.h1>
                  <p className="text-gray-600">Business ID: {businessId}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Change Business
                </motion.button>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-700 font-medium whitespace-nowrap">
                      Filter by:
                    </span>
                    <select
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    >
                      {[...Array(3)].map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchMetrics}
                    disabled={loading}
                    className="px-8 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading ? "Updating..." : "Update"}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {metrics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Total Conversations",
                      value: metrics.total_conversations,
                      icon: "💬",
                      color: "blue",
                    },
                    {
                      label: "Response Rate",
                      value: `${metrics.response_rate}%`,
                      icon: "📞",
                      color: "green",
                    },
                    {
                      label: "Bookings Created",
                      value: metrics.bookings_created,
                      icon: "📅",
                      color: "purple",
                    },
                    {
                      label: "Conversion Rate",
                      value: `${metrics.booking_conversion_rate}%`,
                      icon: "🎯",
                      color: "orange",
                    },
                  ].map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium mb-2">
                            {metric.label}
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {metric.value}
                          </p>
                        </div>
                        <span className="text-3xl">{metric.icon}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Avg Response Time",
                      value: metrics.avg_response_time_minutes
                        ? `${metrics.avg_response_time_minutes}m`
                        : "N/A",
                      icon: "⏱️",
                    },
                    {
                      label: "Avg Conversation Duration",
                      value: metrics.avg_conversation_duration_minutes
                        ? `${metrics.avg_conversation_duration_minutes}m`
                        : "N/A",
                      icon: "🕐",
                    },
                    {
                      label: "Total Messages",
                      value: metrics.total_messages,
                      icon: "💬",
                    },
                  ].map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium mb-2">
                            {metric.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {metric.value}
                          </p>
                        </div>
                        <span className="text-3xl">{metric.icon}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Conversation Outcomes
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Completed",
                          value: metrics.completed_conversations,
                          rate: metrics.completion_rate,
                          color: "bg-green-500",
                        },
                        {
                          label: "Abandoned",
                          value: metrics.bookings_abandoned,
                          rate: metrics.abandonment_rate,
                          color: "bg-red-500",
                        },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <p className="font-medium text-gray-700">
                              {item.label}
                            </p>
                            <p className="text-gray-600">
                              {item.value} ({item.rate}%)
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.rate}%` }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className={`${item.color} h-3 rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Performance Summary
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Customer Response Rate",
                          value: metrics.response_rate,
                          target: 75,
                        },
                        {
                          label: "Booking Conversion Rate",
                          value: metrics.booking_conversion_rate,
                          target: 40,
                        },
                        {
                          label: "Completion Rate",
                          value: metrics.completion_rate,
                          target: 85,
                        },
                      ].map((stat, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-medium text-gray-700">
                              {stat.label}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {stat.value}%
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.value}%` }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className="bg-blue-500 h-2 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Target: {stat.target}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-center text-gray-600 text-sm"
                >
                  <p>
                    Data for{" "}
                    <span className="font-semibold">
                      {new Date(year, month - 1).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            )}

            {!metrics && !loading && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center text-gray-500 py-12"
              >
                <p className="text-lg">
                  No data available for the selected period
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
