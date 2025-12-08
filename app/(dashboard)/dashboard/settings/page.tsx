"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAccountSettings } from "@/hooks/use-account";
import APIKeysSection from "@/components/APIKeysSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, signOut } = useAuthContext();
  const {
    changePassword,
    logoutAllDevices,
    resendVerification,
    isLoading,
    error,
    clearError,
  } = useAccountSettings();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success("Password changed successfully");
      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      toast.success("Logged out from all devices");
      setShowLogoutAllDialog(false);
      // Sign out will redirect to login
      await signOut();
    } catch (err) {
      toast.error("Failed to logout all devices");
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    try {
      await resendVerification(user.email);
      toast.success("Verification email sent successfully");
    } catch (err) {
      toast.error("Failed to send verification email");
    }
  };

  const getPasswordStrength = (
    password: string
  ): {
    strength: string;
    color: string;
  } => {
    if (password.length === 0)
      return { strength: "None", color: "text-gray-400" };
    if (password.length < 8) return { strength: "Weak", color: "text-red-600" };
    if (password.length < 12)
      return { strength: "Medium", color: "text-yellow-600" };
    return { strength: "Strong", color: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">
            Manage your account information and security
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-red-600 text-sm">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user.full_name}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <p className="text-gray-900">{user.email}</p>
                {user.is_verified ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>

            {!user.is_verified && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 font-medium">
                      Email Not Verified
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please verify your email address to access all features.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">
                Account Created
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">
                      Change your password
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPasswordDialog(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <LogOut className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Active Sessions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign out from all devices
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowLogoutAllDialog(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout All Devices
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">
                    Security Tips
                  </p>
                  <ul className="text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
                    <li>Use a strong, unique password</li>
                    <li>Never share your password with anyone</li>
                    <li>Log out from shared devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Section */}
      <APIKeysSection />

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Sign Out</p>
                <p className="text-xs text-gray-600">
                  Sign out from this device
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.newPassword && (
                  <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                    Password strength: {passwordStrength.strength}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Password requirements:</strong>
                </p>
                <ul className="text-xs text-gray-600 mt-1 space-y-0.5 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters recommended</li>
                  <li>Include numbers and special characters for security</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Logout All Devices Confirmation Dialog */}
      <Dialog open={showLogoutAllDialog} onOpenChange={setShowLogoutAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout All Devices</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out from all devices? You will need
              to log in again on each device.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    This will sign you out everywhere
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Including this device. You'll be redirected to the login
                    page.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutAllDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutAll}
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout All Devices"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
