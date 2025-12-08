import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface MetricsSummary {
  business_id: string;
  period: string;
  total_conversations: number;
  customer_responses: number;
  response_rate: number;
  completed_conversations: number;
  completion_rate: number;
  bookings_created: number;
  booking_conversion_rate: number;
  bookings_abandoned: number;
  abandonment_rate: number;
  total_messages: number;
  avg_response_time_minutes: number | null;
  avg_conversation_duration_minutes: number | null;
}

export interface ConversationDetail {
  id: string;
  conversation_id: string;
  customer_responded: boolean;
  conversation_completed: boolean;
  booking_created: boolean;
  booking_abandoned: boolean;
  appointment_id: string | null;
  total_messages: number;
  customer_messages: number;
  bot_messages: number;
  response_time_minutes: number | null;
  conversation_duration_minutes: number | null;
  last_flow_state: string | null;
  dropped_off: boolean;
  outreach_sent_at: string | null;
  first_response_at: string | null;
  conversation_ended_at: string | null;
  created_at: string;
}

export interface ConversationsResponse {
  business_id: string;
  period: string;
  total_conversations: number;
  page: {
    skip: number;
    limit: number;
    total_pages: number;
  };
  conversations: ConversationDetail[];
}

export interface BookingDetail {
  id: string;
  conversation_id: string;
  appointment_id: string | null;
  booking_completed_at: string | null;
  conversation_completed: boolean;
  total_messages: number;
  customer_messages: number;
  response_time_minutes: number | null;
  time_to_booking_minutes: number | null;
  estimated_revenue: number | null;
  created_at: string;
}

export interface BookingsResponse {
  business_id: string;
  period: string;
  total_bookings: number;
  page: {
    skip: number;
    limit: number;
    total_pages: number;
  };
  bookings: BookingDetail[];
}

export interface DailyBreakdownItem {
  date: string;
  conversations: number;
  responses: number;
  bookings: number;
  abandoned: number;
  total_messages: number;
  response_rate: number;
  booking_rate: number;
}

export interface DailyBreakdownResponse {
  business_id: string;
  period: string;
  daily_breakdown: DailyBreakdownItem[];
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoff?: number;
}

export interface FunnelResponse {
  business_id: string;
  period: string;
  funnel: FunnelStage[];
}

export interface DropoffByState {
  state: string;
  count: number;
  avg_duration_minutes: number;
}

export interface DropoffAnalysisResponse {
  business_id: string;
  period: string;
  total_dropped: number;
  dropoff_rate: number;
  dropoff_by_state: DropoffByState[];
}

interface UseMetricsReturn {
  summary: MetricsSummary | null;
  conversations: ConversationsResponse | null;
  bookings: BookingsResponse | null;
  dailyBreakdown: DailyBreakdownResponse | null;
  funnel: FunnelResponse | null;
  dropoffAnalysis: DropoffAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;

  getSummary: (year?: number, month?: number) => Promise<MetricsSummary>;
  getConversations: (year?: number, month?: number, skip?: number, limit?: number) => Promise<ConversationsResponse>;
  getBookings: (year?: number, month?: number, skip?: number, limit?: number) => Promise<BookingsResponse>;
  getDailyBreakdown: (year?: number, month?: number) => Promise<DailyBreakdownResponse>;
  getFunnel: (year?: number, month?: number) => Promise<FunnelResponse>;
  getDropoffAnalysis: (year?: number, month?: number) => Promise<DropoffAnalysisResponse>;

  clearError: () => void;
}

export function useMetrics(): UseMetricsReturn {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [conversations, setConversations] = useState<ConversationsResponse | null>(null);
  const [bookings, setBookings] = useState<BookingsResponse | null>(null);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdownResponse | null>(null);
  const [funnel, setFunnel] = useState<FunnelResponse | null>(null);
  const [dropoffAnalysis, setDropoffAnalysis] = useState<DropoffAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(message, err);
  }, []);

  const getSummary = useCallback(async (year?: number, month?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<MetricsSummary>(
        '/dashboard/metrics/summary',
        { params }
      );
      setSummary(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch metrics summary');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getConversations = useCallback(async (
    year?: number,
    month?: number,
    skip = 0,
    limit = 20
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = { skip, limit };
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<ConversationsResponse>(
        '/dashboard/metrics/conversations',
        { params }
      );
      setConversations(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch conversations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getBookings = useCallback(async (
    year?: number,
    month?: number,
    skip = 0,
    limit = 20
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = { skip, limit };
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<BookingsResponse>(
        '/dashboard/metrics/bookings',
        { params }
      );
      setBookings(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch bookings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getDailyBreakdown = useCallback(async (year?: number, month?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<DailyBreakdownResponse>(
        '/dashboard/metrics/daily-breakdown',
        { params }
      );
      setDailyBreakdown(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch daily breakdown');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getFunnel = useCallback(async (year?: number, month?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<FunnelResponse>(
        '/dashboard/metrics/funnel',
        { params }
      );
      setFunnel(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch conversion funnel');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getDropoffAnalysis = useCallback(async (year?: number, month?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (year !== undefined) params.year = year;
      if (month !== undefined) params.month = month;

      const response = await api.get<DropoffAnalysisResponse>(
        '/dashboard/metrics/dropoff-analysis',
        { params }
      );
      setDropoffAnalysis(response.data);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch dropoff analysis');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    summary,
    conversations,
    bookings,
    dailyBreakdown,
    funnel,
    dropoffAnalysis,
    isLoading,
    error,

    getSummary,
    getConversations,
    getBookings,
    getDailyBreakdown,
    getFunnel,
    getDropoffAnalysis,

    clearError,
  };
}