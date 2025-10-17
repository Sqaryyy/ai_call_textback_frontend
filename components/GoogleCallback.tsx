"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, Calendar } from "lucide-react";

interface CalendarItem {
  id: string;
  name: string;
}

export default function GoogleCallback() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing authentication...");
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [integrationId, setIntegrationId] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [settingCalendar, setSettingCalendar] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus("error");
          setMessage("Missing authorization parameters");
          return;
        }

        // Call the backend callback endpoint
        const response = await fetch(
          `https://voxiodesk.com/api/v1/calendar/google/callback?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state)}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.calendars && data.calendars.length > 0) {
          setStatus("select-calendar");
          setCalendars(data.calendars);
          setIntegrationId(data.integration_id);
          setMessage("Select the calendar you want to use for appointments");
          setSelectedCalendar(data.calendars[0].id);
        } else {
          setStatus("success");
          setMessage("Successfully connected to Google Calendar!");
          setTimeout(() => window.close(), 2000);
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          `Error: ${
            err instanceof Error ? err.message : "An unknown error occurred"
          }`
        );
      }
    };

    handleCallback();
  }, []);

  const handleSelectCalendar = async () => {
    if (!selectedCalendar || !integrationId) return;

    setSettingCalendar(true);
    try {
      // Step 1: Select the calendar
      const selectResponse = await fetch(
        `https://voxiodesk.com/api/v1/calendar/google/${integrationId}/select-calendar?calendar_id=${encodeURIComponent(
          selectedCalendar
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!selectResponse.ok) {
        throw new Error(`Failed to select calendar: ${selectResponse.status}`);
      }

      // Step 2: Set as primary
      const primaryResponse = await fetch(
        `https://voxiodesk.com/api/v1/calendar/${integrationId}/set-primary`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!primaryResponse.ok) {
        throw new Error(
          `Failed to set primary calendar: ${primaryResponse.status}`
        );
      }

      const data = await primaryResponse.json();

      if (data.success) {
        setStatus("success");
        setMessage("Calendar successfully configured!");
        setTimeout(() => window.close(), 2000);
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        `Error: ${
          err instanceof Error ? err.message : "Failed to configure calendar"
        }`
      );
    } finally {
      setSettingCalendar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {status === "processing" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Connecting...
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "select-calendar" && (
            <>
              <Calendar className="w-16 h-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Select Your Calendar
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="w-full mb-6">
                <label
                  htmlFor="calendar-select"
                  className="block text-left text-sm font-medium text-gray-700 mb-2"
                >
                  Choose a calendar:
                </label>
                <select
                  id="calendar-select"
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-left text-gray-800 bg-white"
                  disabled={settingCalendar}
                >
                  {calendars.map((cal) => (
                    <option
                      key={cal.id}
                      value={cal.id}
                      className="text-gray-800"
                    >
                      {cal.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSelectCalendar}
                disabled={settingCalendar}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {settingCalendar ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Configuring...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                This window will close automatically...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => window.close()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
