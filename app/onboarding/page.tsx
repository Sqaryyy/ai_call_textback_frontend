"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Building,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { TokenManager } from "@/lib/auth/token-manager";
// NEW: Import the routes configuration
import { API_ROUTES, DASHBOARD_ROUTES } from "@/config/routes";

// ============= TYPES (Unchanged) =============
interface BusinessFormData {
  name: string;
  phone_number: string;
  business_type: string;
  timezone: string;
  services: string[];
  contact_info: {
    email?: string;
    address?: string;
  };
}

interface BusinessHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface CalendarOption {
  id: string;
  name: string;
}

interface CalendarIntegration {
  id: string;
  provider: string;
  is_primary: boolean;
  created_at: string;
}

interface OnboardingStatus {
  business_created: boolean;
  business_hours_configured: boolean;
  calendar_connected: boolean;
  primary_calendar_set: boolean;
  onboarding_complete: boolean;
  next_step: string;
}

// ============= API BASE URL (REMOVED) =============
// const API_BASE = "http://localhost:8000/api/v1/dashboard"; // Removed!

// ============= HELPER: Get Auth Headers (Unchanged) =============
const getAuthHeaders = () => ({
  ...TokenManager.getAuthHeader(),
  "Content-Type": "application/json",
});

// ============= STEP 1: BUSINESS INFO =============
const BusinessInfoStep: React.FC<{
  onNext: (businessId: string) => void;
  businessId?: string;
}> = ({ onNext, businessId }) => {
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    phone_number: "",
    business_type: "",
    timezone: "America/New_York",
    services: [],
    contact_info: {},
  });
  const [serviceInput, setServiceInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // REFACTOR: Use API_ROUTES.ONBOARDING.CREATE_BUSINESS
      const response = await fetch(API_ROUTES.ONBOARDING.CREATE_BUSINESS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create business");
      }

      const data = await response.json();
      onNext(data.business_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (addService and removeService logic remains unchanged) ...
  const addService = () => {
    if (
      serviceInput.trim() &&
      !formData.services.includes(serviceInput.trim())
    ) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* ... JSX remains largely unchanged ... */}
      <div className="flex items-center mb-6">
        <Building className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">
          Business Information
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jane's Hair Salon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+15551234567"
          />
          <p className="text-xs text-gray-500 mt-1">Format: +1XXXXXXXXXX</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            required
            value={formData.business_type}
            onChange={(e) =>
              setFormData({ ...formData, business_type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a type</option>
            <option value="salon">Hair Salon</option>
            <option value="barbershop">Barbershop</option>
            <option value="spa">Spa</option>
            <option value="clinic">Medical Clinic</option>
            <option value="dental">Dental Office</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone *
          </label>
          <select
            required
            value={formData.timezone}
            onChange={(e) =>
              setFormData({ ...formData, timezone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services Offered
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addService())
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Haircut, Coloring"
            />
            <button
              type="button"
              onClick={addService}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.services.map((service) => (
              <span
                key={service}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? "Creating..." : "Continue to Business Hours"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

// ============= STEP 2: BUSINESS HOURS =============
const BusinessHoursStep: React.FC<{
  businessId: string;
  onNext: () => void;
  onBack: () => void;
}> = ({ businessId, onNext, onBack }) => {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [hours, setHours] = useState<BusinessHour[]>(
    dayNames.map((_, index) => ({
      day_of_week: index,
      open_time: "09:00",
      close_time: "17:00",
      is_closed: index >= 5, // Weekend closed by default
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateHour = (index: number, field: keyof BusinessHour, value: any) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // REFACTOR: Use API_ROUTES.BUSINESSES.HOURS(businessId)
      const response = await fetch(API_ROUTES.BUSINESSES.HOURS(businessId), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(hours),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to save business hours");
      }

      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* ... JSX remains largely unchanged ... */}
      <div className="flex items-center mb-6">
        <Clock className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Business Hours</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {hours.map((hour, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-800">
                {dayNames[index]}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hour.is_closed}
                  onChange={(e) =>
                    updateHour(index, "is_closed", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Closed</span>
              </label>
            </div>
            {!hour.is_closed && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    Open Time
                  </label>
                  <input
                    type="time"
                    value={hour.open_time}
                    onChange={(e) =>
                      updateHour(index, "open_time", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    Close Time
                  </label>
                  <input
                    type="time"
                    value={hour.close_time}
                    onChange={(e) =>
                      updateHour(index, "close_time", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : "Continue to Calendar"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// ============= STEP 3: CALENDAR CONNECTION & SELECTION =============
const CalendarConnectionStep: React.FC<{
  businessId: string;
  onNext: () => void;
  onBack: () => void;
}> = ({ businessId, onNext, onBack }) => {
  const [integrationId, setIntegrationId] = useState<string>("");
  const [availableCalendars, setAvailableCalendars] = useState<
    CalendarOption[]
  >([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"connect" | "select">("connect");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkExistingIntegration();
  }, [businessId]);

  useEffect(() => {
    if (step === "connect" && !integrationId && provider) {
      pollingIntervalRef.current = setInterval(checkForNewIntegration, 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [step, integrationId, provider]);

  const checkExistingIntegration = async () => {
    try {
      // REFACTOR: Use API_ROUTES.ONBOARDING.CALENDAR_STATUS(businessId)
      const response = await fetch(
        API_ROUTES.ONBOARDING.CALENDAR_STATUS(businessId),
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();

      if (data.integrations && data.integrations.length > 0) {
        const integration = data.integrations[0];
        if (integration.provider_config?.calendar_list) {
          setIntegrationId(integration.id);
          setProvider(integration.provider);
          setAvailableCalendars(integration.provider_config.calendar_list);
          setStep("select");
        }
      }
    } catch (err) {
      console.error("Failed to check existing integration:", err);
    }
  };

  const checkForNewIntegration = async () => {
    if (!provider) return;

    try {
      // REFACTOR: Use API_ROUTES.CALENDAR.CALLBACK_STATUS(provider, businessId)
      const response = await fetch(
        API_ROUTES.CALENDAR.CALLBACK_STATUS(provider, businessId),
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.integration_id) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setIntegrationId(data.integration_id);
          setAvailableCalendars(data.calendars || []);
          setStep("select");
        }
      }
    } catch (err) {
      // Silently fail - this is just polling
    }
  };

  const connectCalendar = async (calendarProvider: string) => {
    setLoading(true);
    setError("");
    setProvider(calendarProvider);

    try {
      // REFACTOR: Use API_ROUTES.CALENDAR.AUTHORIZE(calendarProvider, businessId)
      const response = await fetch(
        API_ROUTES.CALENDAR.AUTHORIZE(calendarProvider, businessId),
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate calendar connection");
      }

      const data = await response.json();

      // Open OAuth window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        data.authorization_url,
        "oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (err: any) {
      setError(err.message);
      setProvider("");
    } finally {
      setLoading(false);
    }
  };

  const selectCalendar = async () => {
    if (!selectedCalendarId) {
      setError("Please select a calendar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // REFACTOR: Use API_ROUTES.CALENDAR.SELECT_CALENDAR
      const selectEndpoint = API_ROUTES.CALENDAR.SELECT_CALENDAR(
        provider,
        integrationId
      );

      const selectResponse = await fetch(
        `${selectEndpoint}?calendar_id=${encodeURIComponent(
          selectedCalendarId
        )}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!selectResponse.ok) {
        throw new Error("Failed to select calendar");
      }

      // REFACTOR: Use API_ROUTES.ONBOARDING.SET_PRIMARY_CALENDAR
      const primaryResponse = await fetch(
        API_ROUTES.ONBOARDING.SET_PRIMARY_CALENDAR(businessId, integrationId),
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!primaryResponse.ok) {
        throw new Error("Failed to set primary calendar");
      }

      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (JSX for CalendarConnectionStep remains unchanged) ...

  if (step === "select") {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            Select Your Calendar
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">
            Successfully connected to {provider} Calendar!
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          Choose which calendar you want to use for managing appointments:
        </p>

        <div className="space-y-3 mb-8">
          {availableCalendars.map((calendar) => (
            <label
              key={calendar.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCalendarId === calendar.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="calendar"
                value={calendar.id}
                checked={selectedCalendarId === calendar.id}
                onChange={(e) => setSelectedCalendarId(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center text-xl">
                  📅
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {calendar.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {calendar.id}
                  </div>
                </div>
                {selectedCalendarId === calendar.id && (
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={selectCalendar}
            disabled={!selectedCalendarId || loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : "Complete Setup"}
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Calendar className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">
          Connect Your Calendar
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <p className="text-gray-600 mb-6">
        Connect your calendar to sync appointments and check availability
        automatically.
      </p>

      {provider && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            ⏳ Waiting for authorization... Please complete the OAuth flow in
            the popup window.
          </p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <button
          onClick={() => connectCalendar("google")}
          disabled={loading || !!provider}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center text-2xl">
            📅
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Google Calendar</div>
            <div className="text-sm text-gray-500">
              Connect your Google Calendar
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button
          onClick={() => connectCalendar("outlook")}
          disabled={loading || !!provider}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center text-2xl">
            📧
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Outlook Calendar</div>
            <div className="text-sm text-gray-500">
              Connect your Microsoft Calendar
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );
};

// ============= MAIN ONBOARDING PAGE =============
const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessId, setBusinessId] = useState<string>("");
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { number: 1, title: "Business Info", icon: Building },
    { number: 2, title: "Business Hours", icon: Clock },
    { number: 3, title: "Connect Calendar", icon: Calendar },
  ];

  const handleStep1Complete = (id: string) => {
    setBusinessId(id);
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Onboarding Complete!
          </h1>
          <p className="text-gray-600 mb-8">
            Your business is all set up and ready to start taking appointments.
          </p>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">
                Business information configured
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Business hours set</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">
                Calendar connected and selected
              </span>
            </div>
          </div>
          <button
            // REFACTOR: Use DASHBOARD_ROUTES.DASHBOARD
            onClick={() => (window.location.href = DASHBOARD_ROUTES.DASHBOARD)}
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* ... (Main JSX structure remains unchanged) ... */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome to Your Business Setup
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Let's get your business configured in just a few steps
        </p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Step Content */}
        {currentStep === 1 && (
          <BusinessInfoStep
            onNext={handleStep1Complete}
            businessId={businessId}
          />
        )}
        {currentStep === 2 && (
          <BusinessHoursStep
            businessId={businessId}
            onNext={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <CalendarConnectionStep
            businessId={businessId}
            onNext={handleComplete}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
