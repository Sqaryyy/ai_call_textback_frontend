// lib/api.ts
// COOKIE-BASED VERSION - Simplified axios client

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ✅ CRITICAL: This sends httpOnly cookies with every request
    });

    // Request interceptor - no longer needs to add Authorization header
    this.client.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // Cookies are automatically included with withCredentials: true
        // No need to manually add Authorization header
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // If 401 and not a retry, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // If we're already refreshing, wait for it to complete
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                // Retry original request
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            // Call refresh endpoint - it will set new cookies automatically
            await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              {}, // Empty body - refresh token is in cookies
              {
                withCredentials: true, // Include cookies
              }
            );

            // Notify all subscribers that refresh succeeded
            this.refreshSubscribers.forEach((callback) => callback("refreshed"));
            this.refreshSubscribers = [];
            this.isRefreshing = false;

            // Retry original request - new cookies are already set
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - redirect to login
            this.refreshSubscribers = [];
            this.isRefreshing = false;
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // If 403 or other auth error, log out
        if (error.response?.status === 403) {
          this.handleAuthError();
        }

        return Promise.reject(error);
      }
    );
  }

  private handleAuthError() {
    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  }

  // Public methods for API calls
  public get = <T = any>(url: string, config?: any) =>
    this.client.get<T>(url, config);

  public post = <T = any>(url: string, data?: any, config?: any) =>
    this.client.post<T>(url, data, config);

  public put = <T = any>(url: string, data?: any, config?: any) =>
    this.client.put<T>(url, data, config);

  public patch = <T = any>(url: string, data?: any, config?: any) =>
    this.client.patch<T>(url, data, config);

  public delete = <T = any>(url: string, config?: any) =>
    this.client.delete<T>(url, config);

  /**
   * Check if user is authenticated by calling /auth/me
   */
  public async isAuthenticated(): Promise<boolean> {
    try {
      const response = await this.client.get("/auth/me");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user info
   */
  public async getCurrentUser() {
    try {
      const response = await this.client.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const api = new ApiClient();