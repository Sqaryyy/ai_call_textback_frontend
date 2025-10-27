"use client";

// contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { LoginResponse, SignUpResponse } from "@/types/auth";
import { TokenManager } from "@/lib/auth/token-manager";
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
   * Check for existing tokens and fetch user data
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = TokenManager.getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (TokenManager.isAccessTokenExpired()) {
        // TODO: Try to refresh token
        TokenManager.clearTokens();
        setIsLoading(false);
        return;
      }

      // Fetch user data
      try {
        const response = await fetch(API_ROUTES.AUTH.ME, {
          headers: TokenManager.getAuthHeader(),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          TokenManager.clearTokens();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        TokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sign in user
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      // Step 1: Call sign-in endpoint to get tokens
      const response = await fetch(API_ROUTES.AUTH.SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();

      // Step 2: Store tokens
      TokenManager.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
      });

      // Step 3: Fetch complete user data from /me endpoint
      try {
        const userResponse = await fetch(API_ROUTES.AUTH.ME, {
          headers: TokenManager.getAuthHeader(),
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();

        // Step 4: Set user state with complete data
        setUser(userData);
        setIsAuthenticated(true);

        // Step 5: Navigate to dashboard (user data is now loaded)
        router.push(DASHBOARD_ROUTES.DASHBOARD);
      } catch (error) {
        // If fetching user data fails, clean up tokens
        TokenManager.clearTokens();
        throw error;
      }
    },
    [router]
  );

  /**
   * Sign up user
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

      // Store tokens
      TokenManager.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
      });

      // Fetch complete user data from /me endpoint
      try {
        const userResponse = await fetch(API_ROUTES.AUTH.ME, {
          headers: TokenManager.getAuthHeader(),
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Fallback: use data from signup response if /me fails
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Fallback: use data from signup response
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return data;
    },
    []
  );

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    try {
      // Call logout endpoint to revoke tokens
      await fetch(API_ROUTES.AUTH.SIGN_OUT, {
        method: "POST",
        headers: TokenManager.getAuthHeader(),
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local state regardless of API call result
      TokenManager.clearTokens();
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
        headers: TokenManager.getAuthHeader(),
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
