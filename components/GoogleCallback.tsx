"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { TokenManager } from "@/lib/auth/token-manager";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GoogleCallback() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing authentication...");

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

        // Call the backend callback endpoint with credentials
        const response = await fetch(
          `${API_BASE_URL}/dashboard/calendar/google/callback?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...TokenManager.getAuthHeader(),
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        setStatus("success");
        setMessage("Calendar integration connected successfully!");

        // Notify parent window that setup is complete
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "calendar-integration-complete",
              provider: "google",
            },
            window.location.origin
          );
        }

        // Close the window after a short delay
        setTimeout(() => window.close(), 1500);
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
