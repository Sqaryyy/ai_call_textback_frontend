// hooks/use-auth.ts

import { useAuthContext } from "@/contexts/AuthContext";
import { PlatformRole } from "@/types/user";
import { useCallback } from "react";

/**
 * Hook to access authentication state and methods
 * Provides convenient helpers for auth-related operations
 */
export function useAuth() {
  const context = useAuthContext();

  /**
   * Check if user is a platform admin
   */
  const isPlatformAdmin = useCallback((): boolean => {
    return context.user?.role === PlatformRole.ADMIN;
  }, [context.user]);

  /**
   * Check if user is verified
   */
  const isVerified = useCallback((): boolean => {
    return context.user?.is_verified ?? false;
  }, [context.user]);

  /**
   * Check if user account is active
   */
  const isActive = useCallback((): boolean => {
    return context.user?.is_active ?? false;
  }, [context.user]);

  /**
   * Get user's display name (full name or email fallback)
   */
  const getDisplayName = useCallback((): string => {
    if (!context.user) return "Guest";
    return context.user.full_name || context.user.email;
  }, [context.user]);

  /**
   * Get user's initials for avatar
   */
  const getInitials = useCallback((): string => {
    if (!context.user) return "?";
    
    if (context.user.full_name) {
      return context.user.full_name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return context.user.email[0].toUpperCase();
  }, [context.user]);

  /**
   * Check if user needs to verify email
   */
  const needsEmailVerification = useCallback((): boolean => {
    return context.user !== null && !context.user.is_verified;
  }, [context.user]);

  /**
   * Check if user has an active business
   */
  const hasActiveBusiness = useCallback((): boolean => {
    return !!context.user?.active_business_id;
  }, [context.user]);

  return {
    // From context
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
    refreshUser: context.refreshUser,
    updateUser: context.updateUser,
    
    // Helper methods
    isPlatformAdmin,
    isVerified,
    isActive,
    getDisplayName,
    getInitials,
    needsEmailVerification,
    hasActiveBusiness,
  };
}