// config/routes.ts

/**
 * Application route definitions
 * Centralized route management for consistency and type safety
 */

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
} as const;

/**
 * Protected dashboard routes (authentication required)
 */
export const DASHBOARD_ROUTES = {
  BUSINESS: "/dashboard/business",
  BUSINESS_INFO: "/dashboard/business-info",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  PROJECTS: "/dashboard/projects",
  TEAM: "/dashboard/team",
  SETTINGS: "/dashboard/settings",
  PROFILE: "/dashboard/settings/profile",
  SECURITY: "/dashboard/settings/security",
  NOTIFICATIONS: "/dashboard/settings/notifications",
  BILLING: "/dashboard/settings/billing",
  CONVERSATIONS: "/dashboard/conversations",
  WEBHOOKS: "/dashboard/webhooks",
  CALENDARS: "/dashboard/calendars",
} as const;

/**
 * Business management routes
 */
export const BUSINESS_ROUTES = {
  LIST: "/businesses",
  CREATE: "/businesses/new",
  DETAIL: (id: string) => `/businesses/${id}`,
  EDIT: (id: string) => `/businesses/${id}/edit`,
  SETTINGS: (id: string) => `/businesses/${id}/settings`,
  HOURS: (id: string) => `/businesses/${id}/hours`,
  SERVICES: (id: string) => `/businesses/${id}/services`,
  TEAM: (id: string) => `/businesses/${id}/team`,
} as const;

/**
 * Admin routes (platform admin only)
 */
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin",
  USERS: "/admin/users",
  BUSINESSES: "/admin/businesses",
  INVITES: "/admin/invites",
  ANALYTICS: "/admin/analytics",
} as const;

/**
 * API endpoints (backend)
 * Update BASE_URL based on your environment
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const API_ROUTES = {
  // Auth endpoints
  AUTH: {
    SIGN_IN: `${API_BASE_URL}/auth/login`,
    SIGN_UP: `${API_BASE_URL}/auth/register`,
    SIGN_OUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  
  // User endpoints
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    DETAIL: (id: string) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
    SET_ACTIVE_BUSINESS: (id: string) => `${API_BASE_URL}/users/${id}/active-business`,
  },
  
  // Business endpoints
  BUSINESSES: {
    LIST: `${API_BASE_URL}/businesses`,
    CREATE: `${API_BASE_URL}/businesses`,
    DETAIL: (id: string) => `${API_BASE_URL}/businesses/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/businesses/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/businesses/${id}`,
    HOURS: (id: string) => `${API_BASE_URL}/businesses/${id}/hours`,
    SERVICES: (id: string) => `${API_BASE_URL}/businesses/${id}/services`,
    TEAM: (id: string) => `${API_BASE_URL}/businesses/${id}/team`,
  },

  // Onboarding specific endpoints (used by the initial setup flow)
  ONBOARDING: {
    CREATE_BUSINESS: `${API_BASE_URL}/dashboard/onboarding/business`,
    BUSINESS_HOURS: (businessId: string) => 
      `${API_BASE_URL}/onboarding/${businessId}/business-hours`,
    CALENDAR_STATUS: (businessId: string) => 
      `${API_BASE_URL}/onboarding/${businessId}/calendar-status`,
    SET_PRIMARY_CALENDAR: (businessId: string, integrationId: string) => 
      `${API_BASE_URL}/onboarding/${businessId}/primary-calendar/${integrationId}`,
  },

  // Calendar Integration specific endpoints
  CALENDAR: {
    AUTHORIZE: (provider: string, businessId: string) => 
      `${API_BASE_URL}/calendar/${provider}/authorize/${businessId}`,
    CALLBACK_STATUS: (provider: string, businessId: string) => 
      `${API_BASE_URL}/calendar/${provider}/callback-status/${businessId}`,
    SELECT_CALENDAR: (provider: string, integrationId: string) => 
      `${API_BASE_URL}/calendar/${provider}/${integrationId}/select-calendar`,
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    BUSINESSES: `${API_BASE_URL}/admin/businesses`,
    INVITES: `${API_BASE_URL}/admin/invites`,
    STATS: `${API_BASE_URL}/admin/stats`,
  },
} as const;

/**
 * Helper function to check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return Object.values(PUBLIC_ROUTES).includes(pathname as any);
}

/**
 * Helper function to check if a route requires admin access
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Default redirect after sign in
 */
export const DEFAULT_REDIRECT_AFTER_SIGN_IN = DASHBOARD_ROUTES.DASHBOARD;

/**
 * Default redirect after sign out
 */
export const DEFAULT_REDIRECT_AFTER_SIGN_OUT = PUBLIC_ROUTES.SIGN_IN;