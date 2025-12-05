// lib/auth/token-manager.ts
// COOKIE-BASED VERSION - Fully functional with cached user data

import { AuthTokens, JWTPayload } from "@/types/auth";

interface CachedUserData {
  userId: string;
  email: string;
  fullName?: string;
  isVerified: boolean;
  activeBusinessId?: string;
  role?: string;
}

/**
 * Token Manager - Cookie-based authentication with full functionality
 * Caches user data from /auth/me to provide all the same features
 */
export const TokenManager = {
  // Private cache
  _userCache: null as CachedUserData | null,
  _isAuthenticated: false,

  /**
   * Fetch and cache user data from /auth/me
   */
  async _fetchUserData(): Promise<CachedUserData | null> {
    if (typeof window === "undefined") return null;

    try {
      const response = await fetch("/api/v1/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this._userCache = {
          userId: data.user_id,
          email: data.email,
          fullName: data.full_name,
          isVerified: data.is_verified,
          activeBusinessId: data.active_business_id,
          role: data.role || "user",
        };
        this._isAuthenticated = true;
        return this._userCache;
      } else {
        this._userCache = null;
        this._isAuthenticated = false;
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      this._userCache = null;
      this._isAuthenticated = false;
      return null;
    }
  },

  /**
   * Get cached user data (sync)
   */
  _getCachedData(): CachedUserData | null {
    return this._userCache;
  },

  /**
   * Store auth tokens
   * NO-OP for cookies, but clears cache to force refresh
   */
  setTokens(tokens?: AuthTokens): void {
    // Cookies are set automatically by backend
    // Clear cache so next call fetches fresh data
    this._userCache = null;
    this._isAuthenticated = false;
  },

  /**
   * Get access token
   * Cannot access httpOnly cookies, returns a placeholder
   */
  getAccessToken(): string | null {
    // Cannot access httpOnly cookies
    // Return a placeholder if authenticated
    return this._isAuthenticated ? "cookie-based-auth" : null;
  },

  /**
   * Get refresh token
   * Cannot access httpOnly cookies, returns a placeholder
   */
  getRefreshToken(): string | null {
    // Cannot access httpOnly cookies
    return this._isAuthenticated ? "cookie-based-auth" : null;
  },

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    this._userCache = null;
    this._isAuthenticated = false;
  },

  /**
   * Check if access token exists
   * Uses cached authentication status
   */
  hasAccessToken(): boolean {
    return this._isAuthenticated;
  },

  /**
   * Decode JWT token
   * With cookies, we return cached user data in JWT-like format
   */
  decodeToken(token: string): JWTPayload | null {
    const cached = this._getCachedData();
    if (!cached) return null;

    // Return cached data in JWT payload format
    return {
      sub: cached.userId,
      email: cached.email,
      role: cached.role || "user",
      exp: Math.floor(Date.now() / 1000) + 900, // Assume 15 min expiry
      iat: Math.floor(Date.now() / 1000),
    };
  },

  /**
   * Check if token is expired
   * With cookies, backend handles expiry
   */
  isTokenExpired(token: string): boolean {
    // Backend handles expiry with cookies
    // If we have cached data, assume not expired
    return !this._isAuthenticated;
  },

  /**
   * Check if access token is expired
   */
  isAccessTokenExpired(): boolean {
    return !this._isAuthenticated;
  },

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    return !this._isAuthenticated;
  },

  /**
   * Get authorization header for API calls
   * Returns empty object since cookies are sent automatically
   */
  getAuthHeader(): Record<string, string> {
    // Cookies are automatically included with credentials: 'include'
    // No Authorization header needed
    return {};
  },

  /**
   * Get user ID from cached data
   */
  getUserId(): string | null {
    const cached = this._getCachedData();
    return cached?.userId || null;
  },

  /**
   * Get user email from cached data
   */
  getUserEmail(): string | null {
    const cached = this._getCachedData();
    return cached?.email || null;
  },

  /**
   * Get time until token expires
   * With cookies, we don't have direct access to expiry
   */
  getTimeUntilExpiry(token: string): number | null {
    // Assume 15 minutes for access tokens
    return this._isAuthenticated ? 900 : 0;
  },

  /**
   * Check if tokens are valid and not expired
   */
  hasValidTokens(): boolean {
    return this._isAuthenticated;
  },

  /**
   * Check authentication status by calling /auth/me
   * This updates the cache and returns auth status
   */
  async checkAuthStatus(): Promise<boolean> {
    const userData = await this._fetchUserData();
    return userData !== null;
  },

  /**
   * Initialize token manager
   * Call this on app startup to populate cache
   */
  async initialize(): Promise<boolean> {
    return await this.checkAuthStatus();
  },

  /**
   * Get full user data from cache
   */
  getUserData(): CachedUserData | null {
    return this._getCachedData();
  },

  /**
   * Force refresh user data from backend
   */
  async refreshUserData(): Promise<CachedUserData | null> {
    return await this._fetchUserData();
  },

  /**
   * Debug: Log authentication info
   */
  debugTokens(): void {
    if (process.env.NODE_ENV === "production") return;

    console.group("🔐 Cookie-based Auth Debug");
    console.log("Is Authenticated:", this._isAuthenticated);
    console.log("Cached User Data:", this._userCache);
    console.log("User ID:", this.getUserId());
    console.log("User Email:", this.getUserEmail());
    console.log("Has Valid Tokens:", this.hasValidTokens());
    console.groupEnd();
  },
};