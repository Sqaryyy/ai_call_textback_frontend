import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface Document {
  id: string;
  business_id: string;
  title: string;
  type: string;
  content: string;
  related_service_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentRequest {
  business_id: string;
  title: string;
  type: string;
  content: string;
  related_service_id: string | null;
}

export interface DocumentsResponse {
  documents: Document[];
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: string | null;

  getDocuments: (businessId: string) => Promise<Document[]>;
  createDocument: (document: CreateDocumentRequest) => Promise<Document>;
  deleteDocument: (documentId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: any, defaultMessage: string) => {
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, err);
    throw new Error(message);
  }, []);

  const getDocuments = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/documents/business/${businessId}`);
      const data = response.data.documents || response.data || [];
      setDocuments(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to load documents');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createDocument = useCallback(async (document: CreateDocumentRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/dashboard/documents/', document);
      const data = response.data;
      
      // Refresh documents list
      await getDocuments(document.business_id);
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to create document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, getDocuments]);

  const deleteDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/dashboard/documents/${documentId}`);
      
      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== documentId));
    } catch (err: any) {
      handleError(err, 'Failed to delete document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    documents,
    isLoading,
    error,
    getDocuments,
    createDocument,
    deleteDocument,
    clearError,
  };
}