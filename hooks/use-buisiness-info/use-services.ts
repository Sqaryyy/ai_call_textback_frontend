import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export type BookingType = 'direct' | 'consultation_required' | 'lead_only';

export interface RequiredField {
  field: string;
  label?: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'date';
  required: boolean;
  options?: string[];
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_display: string | null;
  formatted_price: string;
  duration: number | null;
  formatted_duration: string;
  booking_type: BookingType;
  consultation_duration: number | null;
  consultation_price: number | null;
  formatted_consultation_duration: string | null;
  required_fields: RequiredField[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  linked_documents_count: number;
}

export interface CreateServiceRequest {
  business_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  price_display?: string | null;
  duration?: number | null;
  booking_type?: BookingType;
  consultation_duration?: number | null;
  consultation_price?: number | null;
  required_fields?: RequiredField[];
  display_order?: number;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string | null;
  price?: number | null;
  price_display?: string | null;
  duration?: number | null;
  booking_type?: BookingType;
  consultation_duration?: number | null;
  consultation_price?: number | null;
  required_fields?: RequiredField[];
  display_order?: number;
  is_active?: boolean;
}

export interface BulkCreateServicesRequest {
  business_id: string;
  services: CreateServiceRequest[];
}

export interface ServiceListResponse {
  total: number;
  services: Service[];
}

export interface ServiceDocumentsResponse {
  service_id: string;
  service_name: string;
  total_documents: number;
  documents: any[];
}

export interface ReorderResponse {
  success: boolean;
  service_id: string;
  old_order: number;
  new_order: number;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  linked_documents?: number;
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  // Basic CRUD
  getServices: (businessId: string, activeOnly?: boolean, includeInactive?: boolean) => Promise<Service[]>;
  getService: (serviceId: string) => Promise<Service>;
  createService: (service: CreateServiceRequest) => Promise<Service>;
  updateService: (serviceId: string, updates: UpdateServiceRequest) => Promise<Service>;
  deleteService: (serviceId: string, hardDelete?: boolean) => Promise<DeleteResponse>;

  // Bulk operations
  bulkCreateServices: (data: BulkCreateServicesRequest) => Promise<ServiceListResponse>;

  // Service management
  reorderService: (serviceId: string, newOrder: number) => Promise<ReorderResponse>;
  getServiceDocuments: (serviceId: string, activeOnly?: boolean) => Promise<ServiceDocumentsResponse>;
  
  // Migration (if needed)
  migrateFromCatalog: (businessId: string) => Promise<any>;

  clearError: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
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
  // Basic CRUD Operations
  // ============================================================================

  const getServices = useCallback(async (
    businessId: string, 
    activeOnly: boolean = true,
    includeInactive: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/services/business/${businessId}`, {
        params: { active_only: activeOnly, include_inactive: includeInactive }
      });
      const data = response.data.services || response.data || [];
      setServices(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to load services');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getService = useCallback(async (serviceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/services/${serviceId}`);
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to load service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createService = useCallback(async (service: CreateServiceRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/dashboard/services/', service);
      const data = response.data;
      
      // Refresh services list
      await getServices(service.business_id);
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to create service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, getServices]);

  const updateService = useCallback(async (
    serviceId: string, 
    updates: UpdateServiceRequest
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/dashboard/services/${serviceId}`, updates);
      const data = response.data;
      
      // Update local state
      setServices(prev => prev.map(s => s.id === serviceId ? data : s));
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to update service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const deleteService = useCallback(async (
    serviceId: string, 
    hardDelete: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/dashboard/services/${serviceId}`, {
        params: { hard_delete: hardDelete }
      });
      
      // Update local state
      if (hardDelete) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
      } else {
        setServices(prev => prev.map(s => 
          s.id === serviceId ? { ...s, is_active: false } : s
        ));
      }
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to delete service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Bulk Operations
  // ============================================================================

  const bulkCreateServices = useCallback(async (data: BulkCreateServicesRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/dashboard/services/bulk', data);
      const result = response.data;
      
      // Refresh services list
      await getServices(data.business_id);
      
      return result;
    } catch (err: any) {
      handleError(err, 'Failed to bulk create services');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, getServices]);

  // ============================================================================
  // Service Management
  // ============================================================================

  const reorderService = useCallback(async (
    serviceId: string, 
    newOrder: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/services/${serviceId}/reorder`, {
        new_order: newOrder
      });
      
      // Update local state
      setServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, display_order: newOrder } : s
      ));
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to reorder service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getServiceDocuments = useCallback(async (
    serviceId: string, 
    activeOnly: boolean = true
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/services/${serviceId}/documents`, {
        params: { active_only: activeOnly }
      });
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to load service documents');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ============================================================================
  // Migration
  // ============================================================================

  const migrateFromCatalog = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/services/migrate-from-catalog/${businessId}`);
      
      // Refresh services list after migration
      await getServices(businessId);
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'Failed to migrate services from catalog');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, getServices]);

  return {
    services,
    isLoading,
    error,
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    bulkCreateServices,
    reorderService,
    getServiceDocuments,
    migrateFromCatalog,
    clearError,
  };
}