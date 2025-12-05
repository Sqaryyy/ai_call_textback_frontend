import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

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
// Hook Implementation
// ============================================================================

export function useBusinessInfo(): UseBusinessReturn {
  const [business, setBusiness] = useState<Business | null>(null);
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(null);
  const [lastUpdateResponse, setLastUpdateResponse] = useState<BusinessUpdateResponse | null>(null);
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
  // GET Business
  // ============================================================================

  const getBusiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/business');
      const data = response.data;
      setBusiness(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch business information');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // UPDATE Business
  // ============================================================================

  const updateBusiness = useCallback(async (updates: BusinessUpdateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put('/dashboard/business', updates);
      const data = response.data;

      setBusiness(data.business);
      setLastUpdateResponse(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to update business');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // REINDEX Knowledge
  // ============================================================================

  const reindexKnowledge = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(
        '/dashboard/business/knowledge/reindex',
        {},
        { params: { force } }
      );
      const data = response.data;

      return data;
    } catch (err: any) {
      handleError(err, 'Failed to reindex knowledge');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // GET Knowledge Stats
  // ============================================================================

  const getKnowledgeStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/business/knowledge/stats');
      const stats = response.data;
      setKnowledgeStats(stats);
      return stats;
    } catch (err: any) {
      handleError(err, 'Failed to fetch knowledge statistics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

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