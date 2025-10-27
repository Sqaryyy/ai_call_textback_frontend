import { useState, useCallback } from 'react';
import { TokenManager } from '@/lib/auth/token-manager';

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'calendly';
  is_primary: boolean;
  sync_direction: string;
  last_sync_at: string | null;
  last_sync_status: string | null;
}

export interface CalendarOption {
  id: string;
  name: string;
  description?: string;
}

export interface EventType {
  uri: string;
  name: string;
  duration: number;
}

export interface OAuthCallbackStatus {
  success: boolean;
  integration_id?: string;
  calendars?: CalendarOption[];
  provider?: 'google' | 'outlook';
  message?: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  duration_minutes: number;
}

export interface AvailabilityResponse {
  business_id: string;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  total_slots: number;
  slots: AvailabilitySlot[];
}

export interface NextAvailableResponse {
  available: boolean;
  slot?: AvailabilitySlot;
  message?: string;
}

export interface AvailabilitySummary {
  date: string;
  total_slots: number;
  hourly_breakdown: Record<number, number>;
  has_availability: boolean;
}

export interface CalendlySetupRequest {
  personal_access_token: string;
}

export interface CalendlySetupResponse {
  success: boolean;
  integration_id: string;
  event_types: EventType[];
}

interface UseCalendarReturn {
  integrations: CalendarIntegration[];
  availableSlots: AvailabilitySlot[];
  nextAvailable: NextAvailableResponse | null;
  availabilitySummary: AvailabilitySummary | null;
  isLoading: boolean;
  error: string | null;

  // Google Calendar
  initiateGoogleAuth: () => Promise<string>;
  checkGoogleCallbackStatus: () => Promise<OAuthCallbackStatus>;
  selectGoogleCalendar: (integrationId: string, calendarId: string) => Promise<void>;

  // Outlook Calendar
  initiateOutlookAuth: () => Promise<string>;
  checkOutlookCallbackStatus: () => Promise<OAuthCallbackStatus>;
  selectOutlookCalendar: (integrationId: string, calendarId: string) => Promise<void>;

  // Calendly
  setupCalendly: (personalAccessToken: string) => Promise<CalendlySetupResponse>;
  selectCalendlyEventType: (integrationId: string, eventTypeUri: string) => Promise<void>;

  // General
  listIntegrations: () => Promise<CalendarIntegration[]>;
  removeIntegration: (integrationId: string) => Promise<void>;

  // Availability
  getAvailability: (startDate: string, endDate: string, durationMinutes?: number, limit?: number) => Promise<AvailabilityResponse>;
  getNextAvailable: (durationMinutes?: number, daysAhead?: number) => Promise<NextAvailableResponse>;
  getAvailabilitySummary: (date: string) => Promise<AvailabilitySummary>;

  clearError: () => void;
  refreshIntegrations: () => Promise<void>;
}

async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...TokenManager.getAuthHeader(),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      msg = data.detail || data.message || msg;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(msg);
  }

  return res.json();
}

export function useCalendar(): UseCalendarReturn {
  const BASE_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/calendar`;

  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [nextAvailable, setNextAvailable] = useState<NextAvailableResponse | null>(null);
  const [availabilitySummary, setAvailabilitySummary] = useState<AvailabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.message || defaultMessage;
    setError(message);
    throw new Error(message);
  }, []);

  const callApi = useCallback(async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const fullUrl = `${BASE_API_URL}${path}`;
    return await fetchJSON<T>(fullUrl, options);
  }, [BASE_API_URL]);

  // ========== GOOGLE CALENDAR ==========

  const initiateGoogleAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<{ authorization_url: string }>('/google/authorize', {
        method: 'POST',
      });
      return response.authorization_url;
    } catch (err: any) {
      handleError(err, 'Failed to initiate Google Calendar authorization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const checkGoogleCallbackStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await callApi<OAuthCallbackStatus>('/google/callback-status');
      return status;
    } catch (err: any) {
      handleError(err, 'Failed to check Google callback status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const selectGoogleCalendar = useCallback(async (integrationId: string, calendarId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi(`/google/${integrationId}/select-calendar?calendar_id=${encodeURIComponent(calendarId)}`, {
        method: 'PATCH',
      });
    } catch (err: any) {
      handleError(err, 'Failed to select Google calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ========== OUTLOOK CALENDAR ==========

  const initiateOutlookAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<{ authorization_url: string }>('/outlook/authorize', {
        method: 'POST',
      });
      return response.authorization_url;
    } catch (err: any) {
      handleError(err, 'Failed to initiate Outlook Calendar authorization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const checkOutlookCallbackStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await callApi<OAuthCallbackStatus>('/outlook/callback-status');
      return status;
    } catch (err: any) {
      handleError(err, 'Failed to check Outlook callback status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const selectOutlookCalendar = useCallback(async (integrationId: string, calendarId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi(`/outlook/${integrationId}/select-calendar?calendar_id=${encodeURIComponent(calendarId)}`, {
        method: 'PATCH',
      });
    } catch (err: any) {
      handleError(err, 'Failed to select Outlook calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ========== CALENDLY ==========

  const setupCalendly = useCallback(async (personalAccessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<CalendlySetupResponse>(
        `/calendly/setup?personal_access_token=${encodeURIComponent(personalAccessToken)}`,
        { method: 'POST' }
      );
      return response;
    } catch (err: any) {
      handleError(err, 'Failed to setup Calendly integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const selectCalendlyEventType = useCallback(async (integrationId: string, eventTypeUri: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi(
        `/calendly/${integrationId}/select-event-type?event_type_uri=${encodeURIComponent(eventTypeUri)}`,
        { method: 'PATCH' }
      );
    } catch (err: any) {
      handleError(err, 'Failed to select Calendly event type');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ========== GENERAL ==========

  const listIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<{ integrations: CalendarIntegration[] }>('/integrations');
      setIntegrations(response.integrations);
      return response.integrations;
    } catch (err: any) {
      handleError(err, 'Failed to fetch calendar integrations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const removeIntegration = useCallback(async (integrationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi(`/integrations/${integrationId}`, { method: 'DELETE' });
      setIntegrations((prev) => prev.filter((int) => int.id !== integrationId));
    } catch (err: any) {
      handleError(err, 'Failed to remove calendar integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ========== AVAILABILITY ==========

  const getAvailability = useCallback(async (
    startDate: string,
    endDate: string,
    durationMinutes = 30,
    limit = 20
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        duration_minutes: durationMinutes.toString(),
        limit: limit.toString(),
      });

      const response = await callApi<AvailabilityResponse>(`/availability?${params.toString()}`);
      setAvailableSlots(response.slots);
      return response;
    } catch (err: any) {
      handleError(err, 'Failed to fetch availability');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const getNextAvailable = useCallback(async (durationMinutes = 30, daysAhead = 14) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        duration_minutes: durationMinutes.toString(),
        days_ahead: daysAhead.toString(),
      });

      const response = await callApi<NextAvailableResponse>(
        `/availability/next-available?${params.toString()}`
      );
      setNextAvailable(response);
      return response;
    } catch (err: any) {
      handleError(err, 'Failed to fetch next available slot');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const getAvailabilitySummary = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ date });
      const response = await callApi<AvailabilitySummary>(
        `/availability/summary?${params.toString()}`
      );
      setAvailabilitySummary(response);
      return response;
    } catch (err: any) {
      handleError(err, 'Failed to fetch availability summary');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const refreshIntegrations = useCallback(async () => {
    await listIntegrations();
  }, [listIntegrations]);

  return {
    integrations,
    availableSlots,
    nextAvailable,
    availabilitySummary,
    isLoading,
    error,

    // Google Calendar
    initiateGoogleAuth,
    checkGoogleCallbackStatus,
    selectGoogleCalendar,

    // Outlook Calendar
    initiateOutlookAuth,
    checkOutlookCallbackStatus,
    selectOutlookCalendar,

    // Calendly
    setupCalendly,
    selectCalendlyEventType,

    // General
    listIntegrations,
    removeIntegration,

    // Availability
    getAvailability,
    getNextAvailable,
    getAvailabilitySummary,

    clearError,
    refreshIntegrations,
  };
}