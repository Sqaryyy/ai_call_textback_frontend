import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface WebhookEndpoint {
  id: string;
  business_id: string;
  url: string;
  description: string | null;
  enabled_events: string[];
  secret: string;
  is_active: boolean;
  consecutive_failures: number;
  last_success_at: string | null;
  last_failure_at: string | null;
  last_failure_reason: string | null;
  auto_disabled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  webhook_endpoint_id: string;
  business_id: string;
  event_type: string;
  event_data: { [key: string]: any };
  status: string;
  attempts: number;
  max_attempts: number;
  response_status_code: number | null;
  response_body: string | null;
  response_time_ms: number | null;
  error_message: string | null;
  last_attempt_at: string | null;
  next_retry_at: string | null;
  created_at: string;
  delivered_at: string | null;
  failed_at: string | null;
}

export interface CreateWebhookRequest {
  url: string;
  description?: string;
  enabled_events: string[];
}

export interface UpdateWebhookRequest {
  url?: string;
  description?: string;
  enabled_events?: string[];
  is_active?: boolean;
}

export interface WebhookTestResponse {
  success: boolean;
  status_code?: number;
  response_time_ms?: number;
  message: string;
}

export interface RetryFailedResponse {
  message: string;
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseWebhooksReturn {
  webhooks: WebhookEndpoint[];
  currentWebhook: WebhookEndpoint | null;
  webhookEvents: WebhookEvent[];
  availableEvents: string[];
  isLoading: boolean;
  error: string | null;

  // Webhook endpoint methods
  listWebhooks: () => Promise<WebhookEndpoint[]>;
  getWebhook: (webhookId: string) => Promise<WebhookEndpoint>;
  createWebhook: (webhook: CreateWebhookRequest) => Promise<WebhookEndpoint>;
  updateWebhook: (webhookId: string, updates: UpdateWebhookRequest) => Promise<WebhookEndpoint>;
  deleteWebhook: (webhookId: string) => Promise<void>;
  regenerateSecret: (webhookId: string) => Promise<WebhookEndpoint>;
  testWebhook: (webhookId: string) => Promise<WebhookTestResponse>;

  // Event methods
  getAvailableEvents: () => Promise<string[]>;
  listWebhookEvents: (webhookId: string, limit?: number, offset?: number) => Promise<WebhookEvent[]>;
  retryFailedEvents: (webhookId: string) => Promise<RetryFailedResponse>;

  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useWebhooks(): UseWebhooksReturn {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [currentWebhook, setCurrentWebhook] = useState<WebhookEndpoint | null>(null);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, err);
    throw new Error(message);
  }, []);

  // ============================================================================
  // Webhook Endpoint Methods
  // ============================================================================

  const listWebhooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/webhooks/');
      const data = response.data;
      setWebhooks(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch webhooks');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getWebhook = useCallback(async (webhookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/webhooks/${webhookId}`);
      const data = response.data;
      setCurrentWebhook(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch webhook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createWebhook = useCallback(async (webhook: CreateWebhookRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/dashboard/webhooks/', webhook);
      const data = response.data;
      
      // Refresh webhooks list
      await listWebhooks();
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to create webhook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, listWebhooks]);

  const updateWebhook = useCallback(async (webhookId: string, updates: UpdateWebhookRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/dashboard/webhooks/${webhookId}`, updates);
      const data = response.data;
      
      // Update local state
      setWebhooks(prev => prev.map(w => w.id === webhookId ? data : w));
      if (currentWebhook?.id === webhookId) {
        setCurrentWebhook(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to update webhook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentWebhook]);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/dashboard/webhooks/${webhookId}`);
      
      // Update local state
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
      if (currentWebhook?.id === webhookId) {
        setCurrentWebhook(null);
      }
    } catch (err: any) {
      handleError(err, 'Failed to delete webhook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentWebhook]);

  const regenerateSecret = useCallback(async (webhookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/webhooks/${webhookId}/regenerate-secret`);
      const data = response.data;
      
      // Update local state
      setWebhooks(prev => prev.map(w => w.id === webhookId ? data : w));
      if (currentWebhook?.id === webhookId) {
        setCurrentWebhook(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to regenerate webhook secret');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentWebhook]);

  const testWebhook = useCallback(async (webhookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/webhooks/${webhookId}/test`);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to test webhook');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Event Methods
  // ============================================================================

  const getAvailableEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/webhooks/events');
      const data = response.data;
      setAvailableEvents(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch available events');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const listWebhookEvents = useCallback(async (
    webhookId: string,
    limit: number = 50,
    offset: number = 0
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/webhooks/${webhookId}/events`, {
        params: { limit, offset }
      });
      const data = response.data;
      setWebhookEvents(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch webhook events');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const retryFailedEvents = useCallback(async (webhookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/webhooks/${webhookId}/retry-failed`);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to retry failed events');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const refresh = useCallback(async () => {
    await Promise.all([
      listWebhooks(),
      getAvailableEvents(),
    ]);
  }, [listWebhooks, getAvailableEvents]);

  return {
    webhooks,
    currentWebhook,
    webhookEvents,
    availableEvents,
    isLoading,
    error,

    listWebhooks,
    getWebhook,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    regenerateSecret,
    testWebhook,

    getAvailableEvents,
    listWebhookEvents,
    retryFailedEvents,

    clearError,
    refresh,
  };
}