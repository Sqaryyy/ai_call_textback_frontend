import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useServices } from './use-services';
import { useDocuments } from './use-documents';
import type { Service, CreateServiceRequest } from './use-services';
import type { Document, CreateDocumentRequest } from './use-documents';

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

export interface OnboardingCompleteRequest {
  step_id: string;
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
}

// Re-export types from sub-hooks
export type { Service, CreateServiceRequest, Document, CreateDocumentRequest };

// ============================================================================
// Hook Interface
// ============================================================================

interface UseBusinessReturn {
  // Business state
  business: Business | null;
  knowledgeStats: KnowledgeStats | null;
  lastUpdateResponse: BusinessUpdateResponse | null;
  isLoading: boolean;
  error: string | null;

  // Services (from useServices)
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;

  // Documents (from useDocuments)
  documents: Document[];
  documentsLoading: boolean;
  documentsError: string | null;

  // Business methods
  getBusiness: () => Promise<Business>;
  updateBusiness: (updates: BusinessUpdateRequest) => Promise<BusinessUpdateResponse>;
  reindexKnowledge: (force?: boolean) => Promise<ManualReindexResponse>;
  getKnowledgeStats: () => Promise<KnowledgeStats>;

  // Service methods (delegated)
  getServices: (businessId: string, activeOnly?: boolean, includeInactive?: boolean) => Promise<Service[]>;
  getService: (serviceId: string) => Promise<Service>;
  createService: (service: CreateServiceRequest) => Promise<Service>;
  updateService: (serviceId: string, updates: any) => Promise<Service>;
  deleteService: (serviceId: string, hardDelete?: boolean) => Promise<any>;
  bulkCreateServices: (data: any) => Promise<any>;
  reorderService: (serviceId: string, newOrder: number) => Promise<any>;
  getServiceDocuments: (serviceId: string, activeOnly?: boolean) => Promise<any>;
  migrateFromCatalog: (businessId: string) => Promise<any>;

  // Document methods (delegated)
  getDocuments: (businessId: string) => Promise<Document[]>;
  createDocument: (document: CreateDocumentRequest) => Promise<Document>;
  deleteDocument: (documentId: string) => Promise<void>;

  // Onboarding methods
  completeOnboardingStep: (businessId: string, stepId: string) => Promise<OnboardingCompleteResponse>;

  // Utility methods
  clearError: () => void;
  refresh: (businessId?: string) => Promise<void>;
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

  // Use the separated hooks
  const servicesHook = useServices();
  const documentsHook = useDocuments();

  const clearError = useCallback(() => {
    setError(null);
    servicesHook.clearError();
    documentsHook.clearError();
  }, [servicesHook, documentsHook]);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, err);
    throw new Error(message);
  }, []);

  // ============================================================================
  // Business Methods
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
  // Onboarding Methods
  // ============================================================================

  const completeOnboardingStep = useCallback(async (businessId: string, stepId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(
        `/dashboard/businesses/${businessId}/onboarding/complete`,
        { step_id: stepId }
      );
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to complete onboarding step');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const refresh = useCallback(async (businessId?: string) => {
    const promises: Promise<any>[] = [
      getBusiness(),
      getKnowledgeStats(),
    ];

    if (businessId) {
      promises.push(servicesHook.getServices(businessId));
      promises.push(documentsHook.getDocuments(businessId));
    }

    await Promise.all(promises);
  }, [getBusiness, getKnowledgeStats, servicesHook, documentsHook]);

  return {
    // Business state
    business,
    knowledgeStats,
    lastUpdateResponse,
    isLoading,
    error,

    // Services state (from useServices)
    services: servicesHook.services,
    servicesLoading: servicesHook.isLoading,
    servicesError: servicesHook.error,

    // Documents state (from useDocuments)
    documents: documentsHook.documents,
    documentsLoading: documentsHook.isLoading,
    documentsError: documentsHook.error,

    // Business methods
    getBusiness,
    updateBusiness,
    reindexKnowledge,
    getKnowledgeStats,

    // Service methods (delegated)
    getServices: servicesHook.getServices,
    getService: servicesHook.getService,
    createService: servicesHook.createService,
    updateService: servicesHook.updateService,
    deleteService: servicesHook.deleteService,
    bulkCreateServices: servicesHook.bulkCreateServices,
    reorderService: servicesHook.reorderService,
    getServiceDocuments: servicesHook.getServiceDocuments,
    migrateFromCatalog: servicesHook.migrateFromCatalog,

    // Document methods (delegated)
    getDocuments: documentsHook.getDocuments,
    createDocument: documentsHook.createDocument,
    deleteDocument: documentsHook.deleteDocument,

    // Onboarding methods
    completeOnboardingStep,

    // Utility methods
    clearError,
    refresh,
  };
}