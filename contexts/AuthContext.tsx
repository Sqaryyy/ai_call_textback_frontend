"use client";

// contexts/AuthContext.tsx
// COOKIE-BASED VERSION

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { SignUpResponse } from "@/types/auth";
import { API_ROUTES, DASHBOARD_ROUTES, PUBLIC_ROUTES } from "@/config/routes";

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    inviteToken: string
  ) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on mount
   * With httpOnly cookies, we just check /auth/me endpoint
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check authentication by calling /me endpoint
        // Cookies are automatically included with credentials: 'include'
        const response = await fetch(API_ROUTES.AUTH.ME, {
          credentials: "include", // Important: include cookies
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Not authenticated or token expired
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sign in user
   * Backend sets httpOnly cookies automatically
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await fetch(API_ROUTES.AUTH.SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      // Response no longer contains tokens - they're in httpOnly cookies
      const userData = await response.json();

      // Set user state
      setUser(userData);
      setIsAuthenticated(true);

      // Navigate to dashboard
      router.push(DASHBOARD_ROUTES.DASHBOARD);
    },
    [router]
  );

  /**
   * Sign up user
   * Backend sets httpOnly cookies automatically
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      inviteToken: string
    ): Promise<SignUpResponse> => {
      const response = await fetch(API_ROUTES.AUTH.SIGN_UP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          invite_token: inviteToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const data: SignUpResponse = await response.json();

      // Fetch user data (cookies are already set by backend)
      try {
        const userResponse = await fetch(API_ROUTES.AUTH.ME, {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user after signup:", error);
      }

      return data;
    },
    []
  );

  /**
   * Sign out user
   * Backend clears httpOnly cookies
   */
  const signOut = useCallback(async () => {
    try {
      // Call logout endpoint to clear cookies
      await fetch(API_ROUTES.AUTH.SIGN_OUT, {
        method: "POST",
        credentials: "include", // Important: include cookies
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      router.push(PUBLIC_ROUTES.SIGN_IN);
    }
  }, [router]);

  /**
   * Refresh user data from backend
   */
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(API_ROUTES.AUTH.ME, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token might be invalid, sign out
        await signOut();
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, [isAuthenticated, signOut]);

  /**
   * Update user data locally (optimistic update)
   */
  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) return;
      setUser({ ...user, ...updates });
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
