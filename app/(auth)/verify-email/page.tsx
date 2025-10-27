"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  XCircle,
} from "lucide-react";

interface VerificationResponse {
  message: string;
  details: {
    email: string;
    verified_at: string;
  };
}

interface ErrorResponse {
  detail: string;
}

type VerificationState = "verifying" | "success" | "error" | "invalid";

const VerifyEmailPage: React.FC = () => {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("verifying");
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setVerificationState("invalid");
      setErrorMessage("No verification token found in the URL.");
      return;
    }

    verifyEmail(token);
  }, []);

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (response.ok) {
        const data: VerificationResponse = await response.json();
        setEmail(data.details.email);
        setVerificationState("success");
      } else {
        const errorData: ErrorResponse = await response.json();
        setErrorMessage(
          errorData.detail || "Failed to verify email. Please try again."
        );
        setVerificationState("error");
      }
    } catch (error) {
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      setVerificationState("error");
    }
  };

  const handleContinueToLogin = (): void => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = "/signin";
    }, 500);
  };

  const handleResendVerification = async (): Promise<void> => {
    // This would require the user to be logged in
    // You might want to redirect to login or show a message
    window.location.href = "/signin";
  };

  // Verifying state
  if (verificationState === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (verificationState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600">
              Your email has been successfully verified
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                <strong>{email}</strong> has been verified and is now active.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">
                You can now:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Access all features of VoxioDesk
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Manage your business and appointments
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Receive important notifications
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleContinueToLogin}
              disabled={isRedirecting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 text-base"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (verificationState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600">
              We couldn't verify your email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                {errorMessage}
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">
                Common reasons for this error:
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• The verification link has expired</p>
                <p>• The link has already been used</p>
                <p>• The verification token is invalid</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleResendVerification}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              Request New Verification Link
            </Button>
            <Button
              onClick={() => (window.location.href = "/signin")}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Invalid token state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Invalid Link
          </CardTitle>
          <CardDescription className="text-base mt-2 text-gray-600">
            This verification link appears to be invalid
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600">
              Please make sure you're using the complete verification link from
              your email. If you continue to have issues, please contact
              support.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={() => (window.location.href = "/signin")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
