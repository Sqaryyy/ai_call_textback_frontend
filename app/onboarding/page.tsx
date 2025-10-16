"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export default function OnboardingDashboard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [businessInfo, setBusinessInfo] = useState<{
    name: string;
    phone_number: string;
    business_type: string;
    timezone: string;
    services: string[];
  }>({
    name: "",
    phone_number: "",
    business_type: "",
    timezone: "America/New_York",
    services: [],
  });

  const [serviceInput, setServiceInput] = useState("");

  const [businessHours, setBusinessHours] = useState([
    {
      day_of_week: 0,
      day_name: "Monday",
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    },
    {
      day_of_week: 1,
      day_name: "Tuesday",
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    },
    {
      day_of_week: 2,
      day_name: "Wednesday",
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    },
    {
      day_of_week: 3,
      day_name: "Thursday",
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    },
    {
      day_of_week: 4,
      day_name: "Friday",
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    },
    {
      day_of_week: 5,
      day_name: "Saturday",
      open_time: "10:00",
      close_time: "16:00",
      is_closed: false,
    },
    {
      day_of_week: 6,
      day_name: "Sunday",
      open_time: "10:00",
      close_time: "16:00",
      is_closed: true,
    },
  ]);

  const [calendarProvider, setCalendarProvider] = useState("google");
  const [authUrl, setAuthUrl] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [businessId, setBusinessId] = useState("");

  // Calendar selection state
  type Calendar = {
    id: string;
    summary?: string;
    name?: string;
    description?: string;
  };
  const [availableCalendars, setAvailableCalendars] = useState<Calendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [integrationId, setIntegrationId] = useState("");

  interface OnboardingResponse {
    business_id?: string;
    business_name?: string;
    calendar_provider?: string;
    next_steps?: string[];
  }

  const [response, setResponse] = useState<OnboardingResponse | null>(null);

  const addService = () => {
    if (
      serviceInput.trim() &&
      !businessInfo.services.includes(serviceInput.trim())
    ) {
      setBusinessInfo({
        ...businessInfo,
        services: [...businessInfo.services, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  interface BusinessInfo {
    name: string;
    phone_number: string;
    business_type: string;
    timezone: string;
    services: string[];
  }

  const removeService = (service: string) => {
    setBusinessInfo((prev: BusinessInfo) => ({
      ...prev,
      services: prev.services.filter((s: string) => s !== service),
    }));
  };

  const updateHours = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  // Step 1: Create business and get authorization URL
  const getAuthorizationUrl = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Create business with hours
      const createPayload = {
        name: businessInfo.name,
        phone_number: businessInfo.phone_number,
        business_type: businessInfo.business_type,
        timezone: businessInfo.timezone,
        services: businessInfo.services,
        business_hours: businessHours.map((h) => ({
          day_of_week: h.day_of_week,
          open_time: h.open_time,
          close_time: h.close_time,
          is_closed: h.is_closed,
        })),
      };

      const createRes = await fetch(
        `${API_BASE_URL}/onboarding/business/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        }
      );

      if (!createRes.ok) {
        const errorData = await createRes.json();
        throw new Error(errorData.detail || "Failed to create business");
      }

      const createData = await createRes.json();
      const newBusinessId = createData.business_id;
      setBusinessId(newBusinessId);

      // Step 2: Get authorization URL
      const authRes = await fetch(
        `${API_BASE_URL}/onboarding/business/${newBusinessId}/calendar/authorize?provider=${calendarProvider}`,
        { method: "POST" }
      );

      if (!authRes.ok) {
        const errorData = await authRes.json();
        throw new Error(errorData.detail || "Failed to get authorization URL");
      }

      const authData = await authRes.json();
      setAuthUrl(authData.authorization_url);
      setStep(4); // Move to authorization step
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback with authorization code
  const handleOAuthCallback = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/onboarding/business/${businessId}/calendar/callback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: authCode,
            provider: calendarProvider,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to complete OAuth");
      }

      // OAuth completed, get available calendars
      setIntegrationId(data.integration_id);
      setAvailableCalendars(data.available_calendars || []);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Check for completed OAuth integration (alternative flow)
  const checkOAuthStatus = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/onboarding/business/${businessId}/calendar/check-status`,
        { method: "GET" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to check OAuth status");
      }

      if (data.integration_found) {
        // OAuth completed, move to calendar selection
        setIntegrationId(data.integration_id);
        setAvailableCalendars(data.available_calendars || []);
        setStep(5);
      } else {
        // Still waiting for OAuth
        setError(
          "Authorization not yet completed. Please complete the OAuth flow and try again."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Select primary calendar
  const selectPrimaryCalendar = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/onboarding/business/${businessId}/calendar/${integrationId}/select-primary?calendar_id=${encodeURIComponent(
          selectedCalendarId
        )}`,
        { method: "PATCH" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to select calendar");
      }

      setResponse(data);
      setSuccess(true);
      setStep(6); // Move to success step
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(false);
    setBusinessId("");
    setAuthUrl("");
    setAuthCode("");
    setAvailableCalendars([]);
    setSelectedCalendarId("");
    setIntegrationId("");
    setBusinessInfo({
      name: "",
      phone_number: "",
      business_type: "",
      timezone: "America/New_York",
      services: [],
    });
    setBusinessHours([
      {
        day_of_week: 0,
        day_name: "Monday",
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      },
      {
        day_of_week: 1,
        day_name: "Tuesday",
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      },
      {
        day_of_week: 2,
        day_name: "Wednesday",
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      },
      {
        day_of_week: 3,
        day_name: "Thursday",
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      },
      {
        day_of_week: 4,
        day_name: "Friday",
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      },
      {
        day_of_week: 5,
        day_name: "Saturday",
        open_time: "10:00",
        close_time: "16:00",
        is_closed: false,
      },
      {
        day_of_week: 6,
        day_name: "Sunday",
        open_time: "10:00",
        close_time: "16:00",
        is_closed: true,
      },
    ]);
  };

  const progressPercentage = (step / 6) * 100;

  return (
    <div className="min-h-screen py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Business Onboarding
          </h1>
          <p className="text-gray-600 text-lg">
            Let's get your business set up in just a few steps
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between mb-4">
            {[
              "Business Info",
              "Hours",
              "Calendar",
              "Authorize",
              "Select Calendar",
              "Complete",
            ].map((label, i) => (
              <div
                key={i}
                className={`flex flex-col items-center ${
                  step > i + 1
                    ? "text-green-600"
                    : step === i + 1
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 border-2 text-xs ${
                    step > i + 1
                      ? "bg-green-500 text-white border-green-500"
                      : step === i + 1
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden lg:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700"
            >
              <p className="font-medium">⚠️ {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-2xl"
        >
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Business Information
              </h2>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g., Acme Salon"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone_number}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d+]/g, "");
                    setBusinessInfo({
                      ...businessInfo,
                      phone_number: cleaned,
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="+1234567890"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format: +[country code][number] (e.g., +12025551234). Only
                  digits, no spaces or dashes.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Business Type *
                </label>
                <select
                  value={businessInfo.business_type}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      business_type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select a type...</option>
                  <option value="salon">Salon</option>
                  <option value="spa">Spa</option>
                  <option value="clinic">Clinic</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Timezone
                </label>
                <select
                  value={businessInfo.timezone}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      timezone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="America/New_York">Eastern (New York)</option>
                  <option value="America/Chicago">Central (Chicago)</option>
                  <option value="America/Denver">Mountain (Denver)</option>
                  <option value="America/Los_Angeles">
                    Pacific (Los Angeles)
                  </option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Services Offered
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addService()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g., Haircut"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addService}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                  >
                    Add
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessInfo.services.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {service}
                      <button
                        onClick={() => removeService(service)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (
                    !businessInfo.name ||
                    !businessInfo.phone_number ||
                    !businessInfo.business_type
                  ) {
                    setError("Please fill in all required fields");
                    return;
                  }
                  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                  if (!phoneRegex.test(businessInfo.phone_number)) {
                    setError(
                      "Invalid phone number format. Use +[country code][number] with only digits (e.g., +12025551234)"
                    );
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors mt-6"
              >
                Continue to Business Hours →
              </motion.button>
            </div>
          )}

          {/* Additional steps would continue here - truncated for brevity */}
          {/* The rest of the steps (2-6) remain the same as in your original code */}
        </motion.div>
      </div>
    </div>
  );
}
