// lib/auth/token-manager.ts

import { AuthTokens, JWTPayload } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Token Manager - Centralized token storage and management
 * Uses localStorage for now, but can be easily switched to cookies
 */
export const TokenManager = {
  /**
   * Store auth tokens
   */
  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if access token exists
   */
  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Decode JWT token (without verification - for client-side use only)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  },

  /**
   * Check if access token is expired
   */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return this.isTokenExpired(token);
  },

  /**
   * Get authorization header for API calls
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },
};