"use client";

// hooks/use-user.ts

import { useState, useEffect, useCallback } from "react";
import { User, PlatformRole } from "@/types/user";
import { Session } from "@/types/auth";

/**
 * Hook to manage current user state and authentication
 * This will be integrated with AuthContext later
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize user from session/token
   * TODO: Implement proper session management with JWT
   */
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // TODO: Check for access token and fetch user data
        // const token = getAccessToken();
        // if (token) {
        //   const response = await fetch(API_ROUTES.AUTH.ME, {
        //     headers: { Authorization: `Bearer ${token}` }
        //   });
        //   const userData = await response.json();
        //   setUser(userData);
        //   setIsAuthenticated(true);
        // }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing user:", error);
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  /**
   * Check if user is a platform admin
   */
  const isPlatformAdmin = useCallback((): boolean => {
    return user?.role === PlatformRole.ADMIN;
  }, [user]);

  /**
   * Check if user is verified
   */
  const isVerified = useCallback((): boolean => {
    return user?.is_verified ?? false;
  }, [user]);

  /**
   * Check if user account is active
   */
  const isActive = useCallback((): boolean => {
    return user?.is_active ?? false;
  }, [user]);

  /**
   * Get user's full name or email as fallback
   */
  const getDisplayName = useCallback((): string => {
    if (!user) return "Guest";
    return user.full_name || user.email;
  }, [user]);

  /**
   * Get user's initials for avatar
   */
  const getInitials = useCallback((): string => {
    if (!user) return "?";
    
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user.email[0].toUpperCase();
  }, [user]);

  /**
   * Update user data locally (optimistic update)
   */
  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  }, [user]);

  /**
   * Refresh user data from backend
   * TODO: Implement API call
   */
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    
    try {
      // TODO: API call to fetch fresh user data
      // const token = getAccessToken();
      // const response = await fetch(API_ROUTES.AUTH.ME, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const userData = await response.json();
      // setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Sign out user
   * TODO: Implement proper sign out with token revocation
   */
  const signOut = useCallback(async () => {
    try {
      // TODO: API call to revoke tokens
      // await fetch(API_ROUTES.AUTH.SIGN_OUT, {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear tokens from storage
      // clearTokens();
      
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    
    // Setters (for auth context to use)
    setUser,
    setIsAuthenticated,
    
    // Helper methods
    isPlatformAdmin,
    isVerified,
    isActive,
    getDisplayName,
    getInitials,
    updateUser,
    refreshUser,
    signOut,
  };
}