import { useState, useCallback } from 'react';
import { TokenManager } from '@/lib/auth/token-manager';

// ============================================================================
// Types
// ============================================================================

export interface BusinessProfile {
  description?: string;
  areas_served?: string[];
  specialties?: string[];
  [key: string]: any;
}

export interface ServiceCatalogItem {
  description?: string;
  price?: string;
  duration?: number;
}

export interface ContactInfo {
  address?: string;
  email?: string;
  website?: string;
  office_phone?: string;
  emergency_line?: string;
  [key: string]: any;
}

export interface BookingSettings {
  enabled?: boolean;
  require_deposit?: boolean;
  deposit_amount?: number;
  cancellation_hours?: number;
  [key: string]: any;
}

export interface Business {
  id: string;
  name: string;
  phone_number: string;
  business_type: string;
  business_profile: BusinessProfile;
  service_catalog: { [key: string]: ServiceCatalogItem };
  conversation_policies: { [key: string]: string };
  quick_responses: { [key: string]: string };
  services: string[];
  timezone: string;
  contact_info: ContactInfo;
  ai_instructions: string | null;
  webhook_urls: { [key: string]: string };
  booking_settings: BookingSettings;
  onboarding_status: { [key: string]: any };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface BusinessUpdateRequest {
  name?: string;
  business_type?: string;
  business_profile?: BusinessProfile;
  service_catalog?: { [key: string]: ServiceCatalogItem };
  conversation_policies?: { [key: string]: string };
  quick_responses?: { [key: string]: string };
  services?: string[];
  timezone?: string;
  contact_info?: ContactInfo;
  ai_instructions?: string;
  webhook_urls?: { [key: string]: string };
  booking_settings?: BookingSettings;
}

export interface ReindexResult {
  triggered: boolean;
  success?: boolean;
  indexed_count?: number;
  duration_ms?: number;
  reason?: string;
  message?: string;
}

export interface BusinessUpdateResponse {
  success: boolean;
  business: Business;
  changes_detected: string[];
  reindex_result: ReindexResult;
}

export interface KnowledgeStats {
  success: boolean;
  total_chunks: number;
  category_breakdown: { [key: string]: number };
  business_id: string;
  last_indexed: string | null;
}

export interface ManualReindexResponse {
  success: boolean;
  message: string;
  indexed_count: number;
  business_id: string;
  duration_ms?: number;
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseBusinessReturn {
  business: Business | null;
  knowledgeStats: KnowledgeStats | null;
  lastUpdateResponse: BusinessUpdateResponse | null;
  isLoading: boolean;
  error: string | null;

  getBusiness: () => Promise<Business>;
  updateBusiness: (updates: BusinessUpdateRequest) => Promise<BusinessUpdateResponse>;
  reindexKnowledge: (force?: boolean) => Promise<ManualReindexResponse>;
  getKnowledgeStats: () => Promise<KnowledgeStats>;

  clearError: () => void;
  refresh: () => Promise<void>;
}

// ============================================================================
// Utility Function
// ============================================================================

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

// ============================================================================
// Hook Implementation
// ============================================================================

export function useBusinessInfo(): UseBusinessReturn {
  const BASE_API_URL = 'http://localhost:8000/api/v1/dashboard/business';

  const [business, setBusiness] = useState<Business | null>(null);
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(null);
  const [lastUpdateResponse, setLastUpdateResponse] = useState<BusinessUpdateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, err);
    throw new Error(message);
  }, []);

  const callApi = useCallback(async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const fullUrl = `${BASE_API_URL}${path}`;
    return await fetchJSON<T>(fullUrl, options);
  }, []);

  // ============================================================================
  // GET Business
  // ============================================================================

  const getBusiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await callApi<Business>('');
      setBusiness(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch business information');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ============================================================================
  // UPDATE Business
  // ============================================================================

  const updateBusiness = useCallback(async (updates: BusinessUpdateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<BusinessUpdateResponse>('', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      setBusiness(response.business);
      setLastUpdateResponse(response);
      return response;
    } catch (err: any) {
      handleError(err, 'Failed to update business');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ============================================================================
  // REINDEX Knowledge
  // ============================================================================

  const reindexKnowledge = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const query = force ? '?force=true' : '';
      const response = await callApi<ManualReindexResponse>(`/knowledge/reindex${query}`, {
        method: 'POST',
      });

      return response;
    } catch (err: any) {
      handleError(err, 'Failed to reindex knowledge');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ============================================================================
  // GET Knowledge Stats
  // ============================================================================

  const getKnowledgeStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await callApi<KnowledgeStats>('/knowledge/stats');
      setKnowledgeStats(stats);
      return stats;
    } catch (err: any) {
      handleError(err, 'Failed to fetch knowledge statistics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  // ============================================================================
  // Refresh (reload all data)
  // ============================================================================

  const refresh = useCallback(async () => {
    await Promise.all([
      getBusiness(),
      getKnowledgeStats(),
    ]);
  }, [getBusiness, getKnowledgeStats]);

  return {
    business,
    knowledgeStats,
    lastUpdateResponse,
    isLoading,
    error,

    getBusiness,
    updateBusiness,
    reindexKnowledge,
    getKnowledgeStats,

    clearError,
    refresh,
  };
}