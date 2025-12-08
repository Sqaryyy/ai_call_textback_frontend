import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

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

export function useCalendar(): UseCalendarReturn {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [nextAvailable, setNextAvailable] = useState<NextAvailableResponse | null>(null);
  const [availabilitySummary, setAvailabilitySummary] = useState<AvailabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(message, err);
  }, []);

  // ========== GOOGLE CALENDAR ==========

  const initiateGoogleAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{ authorization_url: string }>(
        '/dashboard/calendar/google/authorize'
      );
      return response.data.authorization_url;
    } catch (err: any) {
      handleError(err, 'Failed to initiate Google Calendar authorization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const checkGoogleCallbackStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<OAuthCallbackStatus>(
        '/dashboard/calendar/google/callback-status'
      );
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to check Google callback status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const selectGoogleCalendar = useCallback(async (integrationId: string, calendarId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch(
        `/dashboard/calendar/google/${integrationId}/select-calendar`,
        {},
        { params: { calendar_id: calendarId } }
      );
    } catch (err: any) {
      handleError(err, 'Failed to select Google calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ========== OUTLOOK CALENDAR ==========

  const initiateOutlookAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{ authorization_url: string }>(
        '/dashboard/calendar/outlook/authorize'
      );
      return response.data.authorization_url;
    } catch (err: any) {
      handleError(err, 'Failed to initiate Outlook Calendar authorization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const checkOutlookCallbackStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<OAuthCallbackStatus>(
        '/dashboard/calendar/outlook/callback-status'
      );
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to check Outlook callback status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const selectOutlookCalendar = useCallback(async (integrationId: string, calendarId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch(
        `/dashboard/calendar/outlook/${integrationId}/select-calendar`,
        {},
        { params: { calendar_id: calendarId } }
      );
    } catch (err: any) {
      handleError(err, 'Failed to select Outlook calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ========== CALENDLY ==========

  const setupCalendly = useCallback(async (personalAccessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<CalendlySetupResponse>(
        '/dashboard/calendar/calendly/setup',
        {},
        { params: { personal_access_token: personalAccessToken } }
      );
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to setup Calendly integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const selectCalendlyEventType = useCallback(async (integrationId: string, eventTypeUri: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.patch(
        `/dashboard/calendar/calendly/${integrationId}/select-event-type`,
        {},
        { params: { event_type_uri: eventTypeUri } }
      );
    } catch (err: any) {
      handleError(err, 'Failed to select Calendly event type');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ========== GENERAL ==========

  const listIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ integrations: CalendarIntegration[] }>(
        '/dashboard/calendar/integrations'
      );
      setIntegrations(response.data.integrations);
      return response.data.integrations;
    } catch (err: any) {
      handleError(err, 'Failed to fetch calendar integrations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const removeIntegration = useCallback(async (integrationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/dashboard/calendar/integrations/${integrationId}`);
      setIntegrations((prev) => prev.filter((int) => int.id !== integrationId));
    } catch (err: any) {
      handleError(err, 'Failed to remove calendar integration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

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
      const response = await api.get<AvailabilityResponse>(
        '/dashboard/calendar/availability',
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            duration_minutes: durationMinutes,
            limit: limit,
          },
        }
      );
      setAvailableSlots(response.data.slots);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch availability');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getNextAvailable = useCallback(async (durationMinutes = 30, daysAhead = 14) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<NextAvailableResponse>(
        '/dashboard/calendar/availability/next-available',
        {
          params: {
            duration_minutes: durationMinutes,
            days_ahead: daysAhead,
          },
        }
      );
      setNextAvailable(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch next available slot');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getAvailabilitySummary = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<AvailabilitySummary>(
        '/dashboard/calendar/availability/summary',
        {
          params: { date },
        }
      );
      setAvailabilitySummary(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch availability summary');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

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