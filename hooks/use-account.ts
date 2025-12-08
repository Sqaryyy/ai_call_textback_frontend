import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/user';

// ============================================================================
// Types
// ============================================================================

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user?: User;
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseAccountSettingsReturn {
  isLoading: boolean;
  error: string | null;

  // Password management
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResponse>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<ResetPasswordResponse>;

  // Email verification
  resendVerification: (email: string) => Promise<ResendVerificationResponse>;
  verifyEmail: (token: string) => Promise<VerifyEmailResponse>;

  // Session management
  logoutAllDevices: () => Promise<void>;

  // Utility methods
  clearError: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useAccountSettings(): UseAccountSettingsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, err);
    throw new Error(message);
  }, []);

  // ============================================================================
  // Password Management
  // ============================================================================

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to change password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const forgotPassword = useCallback(async (
    email: string
  ): Promise<ForgotPasswordResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to send password reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const resetPassword = useCallback(async (
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Email Verification
  // ============================================================================

  const resendVerification = useCallback(async (
    email: string
  ): Promise<ResendVerificationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to resend verification email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const verifyEmail = useCallback(async (
    token: string
  ): Promise<VerifyEmailResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to verify email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Session Management
  // ============================================================================

  const logoutAllDevices = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/logout-all');
    } catch (err: any) {
      handleError(err, 'Failed to logout all devices');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    isLoading,
    error,

    // Password management
    changePassword,
    forgotPassword,
    resetPassword,

    // Email verification
    resendVerification,
    verifyEmail,

    // Session management
    logoutAllDevices,

    // Utility
    clearError,
  };
}