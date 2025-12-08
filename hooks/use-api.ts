import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface APIKey {
  id: string;
  business_id: string;
  key_prefix: string;
  name: string;
  description: string | null;
  scopes: string[];
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  usage_count: number;
  rate_limit: number;
  allowed_ips: string[];
  created_at: string;
  updated_at: string;
  revoked_at: string | null;
  revoked_reason: string | null;
}

export interface APIKeyWithSecret extends APIKey {
  secret: string;
}

export interface CreateAPIKeyRequest {
  name: string;
  description?: string;
  scopes: string[];
  expires_in_days?: number;
  rate_limit?: number;
  allowed_ips?: string[];
}

export interface UpdateAPIKeyRequest {
  name?: string;
  description?: string;
  scopes?: string[];
  is_active?: boolean;
  rate_limit?: number;
  allowed_ips?: string[];
}

export interface UsageStats {
  total_keys: number;
  active_keys: number;
  inactive_keys: number;
  total_requests: number;
}

// ============================================================================
// Hook Interface
// ============================================================================

interface UseApiKeysReturn {
  apiKeys: APIKey[];
  currentApiKey: APIKey | null;
  availableScopes: string[];
  usageStats: UsageStats | null;
  isLoading: boolean;
  error: string | null;

  // API key methods
  listApiKeys: (includeRevoked?: boolean) => Promise<APIKey[]>;
  getApiKey: (apiKeyId: string) => Promise<APIKey>;
  createApiKey: (apiKey: CreateAPIKeyRequest) => Promise<APIKeyWithSecret>;
  updateApiKey: (apiKeyId: string, updates: UpdateAPIKeyRequest) => Promise<APIKey>;
  deleteApiKey: (apiKeyId: string) => Promise<void>;
  revokeApiKey: (apiKeyId: string, reason?: string) => Promise<APIKey>;
  activateApiKey: (apiKeyId: string) => Promise<APIKey>;
  rotateApiKey: (apiKeyId: string) => Promise<APIKeyWithSecret>;

  // Scope and stats methods
  getAvailableScopes: () => Promise<string[]>;
  getUsageStats: () => Promise<UsageStats>;

  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useApiKeys(): UseApiKeysReturn {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [currentApiKey, setCurrentApiKey] = useState<APIKey | null>(null);
  const [availableScopes, setAvailableScopes] = useState<string[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
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
  // API Key Methods
  // ============================================================================

  const listApiKeys = useCallback(async (includeRevoked: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/api-keys/', {
        params: { include_revoked: includeRevoked }
      });
      const data = response.data;
      setApiKeys(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch API keys');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getApiKey = useCallback(async (apiKeyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/dashboard/api-keys/${apiKeyId}`);
      const data = response.data;
      setCurrentApiKey(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createApiKey = useCallback(async (apiKey: CreateAPIKeyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/dashboard/api-keys/', apiKey);
      const data = response.data;
      
      // Refresh API keys list
      await listApiKeys();
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to create API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, listApiKeys]);

  const updateApiKey = useCallback(async (apiKeyId: string, updates: UpdateAPIKeyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/dashboard/api-keys/${apiKeyId}`, updates);
      const data = response.data;
      
      // Update local state
      setApiKeys(prev => prev.map(k => k.id === apiKeyId ? data : k));
      if (currentApiKey?.id === apiKeyId) {
        setCurrentApiKey(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to update API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentApiKey]);

  const deleteApiKey = useCallback(async (apiKeyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/dashboard/api-keys/${apiKeyId}`);
      
      // Update local state
      setApiKeys(prev => prev.filter(k => k.id !== apiKeyId));
      if (currentApiKey?.id === apiKeyId) {
        setCurrentApiKey(null);
      }
    } catch (err: any) {
      handleError(err, 'Failed to delete API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentApiKey]);

  const revokeApiKey = useCallback(async (apiKeyId: string, reason?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/api-keys/${apiKeyId}/revoke`, { reason });
      const data = response.data;
      
      // Update local state
      setApiKeys(prev => prev.map(k => k.id === apiKeyId ? data : k));
      if (currentApiKey?.id === apiKeyId) {
        setCurrentApiKey(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to revoke API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentApiKey]);

  const activateApiKey = useCallback(async (apiKeyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/api-keys/${apiKeyId}/activate`);
      const data = response.data;
      
      // Update local state
      setApiKeys(prev => prev.map(k => k.id === apiKeyId ? data : k));
      if (currentApiKey?.id === apiKeyId) {
        setCurrentApiKey(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to activate API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentApiKey]);

  const rotateApiKey = useCallback(async (apiKeyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/dashboard/api-keys/${apiKeyId}/rotate`);
      const data = response.data;
      
      // Update local state
      setApiKeys(prev => prev.map(k => k.id === apiKeyId ? data : k));
      if (currentApiKey?.id === apiKeyId) {
        setCurrentApiKey(data);
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to rotate API key');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, currentApiKey]);

  // ============================================================================
  // Scope and Stats Methods
  // ============================================================================

  const getAvailableScopes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/api-keys/scopes');
      const data = response.data;
      setAvailableScopes(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch available scopes');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getUsageStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard/api-keys/usage/stats');
      const data = response.data;
      setUsageStats(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch usage stats');
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
      listApiKeys(),
      getAvailableScopes(),
      getUsageStats(),
    ]);
  }, [listApiKeys, getAvailableScopes, getUsageStats]);

  return {
    apiKeys,
    currentApiKey,
    availableScopes,
    usageStats,
    isLoading,
    error,

    listApiKeys,
    getApiKey,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    revokeApiKey,
    activateApiKey,
    rotateApiKey,

    getAvailableScopes,
    getUsageStats,

    clearError,
    refresh,
  };
}