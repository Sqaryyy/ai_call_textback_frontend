"use client";

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { API_ROUTES } from "@/config/routes";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface InviteStatus {
  valid: boolean | null;
  message: string;
  inviteType: string | null;
  businessName: string | null;
  role: string | null;
}

interface InviteValidationResponse {
  valid: boolean;
  message: string;
  invite_type?: string;
  business_name?: string;
  role?: string;
}

interface SuccessDetails {
  email: string;
  user_id: string;
  business_id?: string;
  business_name?: string;
  role?: string;
  verification_required: boolean;
  invite_type: string;
  next_step?: string;
  is_new_user?: boolean;
}

const SignupPage: React.FC = () => {
  const { signUp, isLoading: authLoading } = useAuth();
  const [inviteToken, setInviteToken] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isValidatingInvite, setIsValidatingInvite] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [inviteStatus, setInviteStatus] = useState<InviteStatus>({
    valid: null,
    message: "",
    inviteType: null,
    businessName: null,
    role: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [successDetails, setSuccessDetails] = useState<SuccessDetails | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("invite");
    if (token) {
      setInviteToken(token);
      validateInvite(token);
    } else {
      setInviteStatus({
        valid: false,
        message: "No invite token found. Please use a valid invitation link.",
        inviteType: null,
        businessName: null,
        role: null,
      });
    }
  }, []);

  const validateInvite = async (token: string): Promise<void> => {
    setIsValidatingInvite(true);
    try {
      const response = await fetch(
        `${API_ROUTES.AUTH.VERIFY_EMAIL.replace(
          "/verify-email",
          "/validate-invite"
        )}?token=${token}`
      );
      const data: InviteValidationResponse = await response.json();

      setInviteStatus({
        valid: data.valid,
        message: data.message,
        inviteType: data.invite_type || null,
        businessName: data.business_name || null,
        role: data.role || null,
      });
    } catch (error) {
      setInviteStatus({
        valid: false,
        message: "Failed to validate invite. Please try again.",
        inviteType: null,
        businessName: null,
        role: null,
      });
    } finally {
      setIsValidatingInvite(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        inviteToken
      );

      setRegistrationSuccess(true);
      setSuccessDetails(response.details);
    } catch (error: any) {
      setErrors({
        submit: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && inviteStatus.valid && !isSubmitting) {
      handleSubmit();
    }
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (registrationSuccess && successDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to VoxioDesk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                We've sent a verification email to{" "}
                <strong>{successDetails.email}</strong>. Please check your inbox
                and verify your email address.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">
                Next Steps:
              </h4>
              {successDetails.invite_type === "platform" ? (
                <>
                  <p className="text-sm text-gray-600">
                    ✓ Check your email for verification link
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Verify your email address
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Log in to create your first business
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    ✓ Check your email for verification link
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Verify your email address
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Log in to access {successDetails.business_name}
                  </p>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => (window.location.href = "/sign-in")}
            >
              Continue to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isValidatingInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-700">
              Validating your invitation...
            </p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            {inviteStatus.inviteType === "platform"
              ? "Start your journey as a business owner"
              : inviteStatus.businessName
              ? `Join ${inviteStatus.businessName} as ${inviteStatus.role}`
              : "Join the VoxioDesk platform"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {inviteStatus.valid === false && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                {inviteStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {inviteStatus.valid === true && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                {inviteStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                  disabled={!inviteStatus.valid || isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  disabled={!inviteStatus.valid || isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={!inviteStatus.valid || isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={!inviteStatus.valid || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={!inviteStatus.valid || isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={!inviteStatus.valid || isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.submit && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 ml-2">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-5"
              disabled={!inviteStatus.valid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </a>
          </div>
          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
