import { useState, useCallback } from 'react';
import { TokenManager } from '@/lib/auth/token-manager';

export interface BusinessInvite {
  id: string;
  token: string;
  email: string | null;
  role: 'owner' | 'member';
  business_id: string;
  business_name: string | null;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  is_valid: boolean;
  expires_at: string | null;
  created_at: string;
  used_at: string | null;
  invite_url: string;
}

export interface InviteStats {
  total_invites: number;
  active_invites: number;
  valid_invites: number;
  used_invites: number;
  expired_invites: number;
  total_uses: number;
}

export interface CreateInviteRequest {
  email?: string;
  role: 'owner' | 'member';
  max_uses?: number;
  expires_in_days?: number;
}

export interface ExtendInviteRequest {
  additional_days: number;
}

export interface BusinessUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'member';
  joined_at: string;
  is_active: boolean;
}

export interface BusinessUsersList {
  business_id: string;
  business_name: string;
  total_users: number;
  users: BusinessUser[];
}

interface UseInvitesReturn {
  invites: BusinessInvite[];
  stats: InviteStats | null;
  currentInvite: BusinessInvite | null;
  businessUsers: BusinessUser[];
  totalUsers: number;
  isLoading: boolean;
  error: string | null;

  createInvite: (businessId: string, data: CreateInviteRequest) => Promise<BusinessInvite>;
  listInvites: (businessId: string, includeInactive?: boolean) => Promise<BusinessInvite[]>;
  getInvite: (businessId: string, inviteId: string) => Promise<BusinessInvite>;
  getStats: (businessId: string) => Promise<InviteStats>;
  listUsers: (businessId: string) => Promise<BusinessUsersList>;
  revokeInvite: (businessId: string, inviteId: string) => Promise<void>;
  extendInvite: (businessId: string, inviteId: string, days: number) => Promise<BusinessInvite>;
  deleteInvite: (businessId: string, inviteId: string) => Promise<void>;
  cleanupExpired: (businessId: string) => Promise<number>;

  copyInviteUrl: (inviteUrl: string) => Promise<boolean>;
  refreshInvites: () => Promise<void>;
  clearError: () => void;
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

export function useInvites(): UseInvitesReturn {
  const BASE_API_URL = 'http://localhost:8002/api/v1/dashboard/business-invites';

  const [invites, setInvites] = useState<BusinessInvite[]>([]);
  const [stats, setStats] = useState<InviteStats | null>(null);
  const [currentInvite, setCurrentInvite] = useState<BusinessInvite | null>(null);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBusinessId, setLastBusinessId] = useState<string | null>(null);

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
  }, []);

  const createInvite = useCallback(async (businessId: string, data: CreateInviteRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const invite = await callApi<BusinessInvite>(
        `/${businessId}/invites`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: data.email || null,
            role: data.role,
            max_uses: data.max_uses || 1,
            expires_in_days: data.expires_in_days || 7,
          }),
        }
      );

      setInvites((prev) => [invite, ...prev]);
      return invite;
    } catch (err: any) {
      handleError(err, 'Failed to create invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const listInvites = useCallback(async (businessId: string, includeInactive = false) => {
    setIsLoading(true);
    setError(null);
    setLastBusinessId(businessId);

    try {
      const query = includeInactive ? '?include_inactive=true' : '';
      const data = await callApi<BusinessInvite[]>(`/${businessId}/invites${query}`);
      setInvites(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const getInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const invite = await callApi<BusinessInvite>(`/${businessId}/invites/${inviteId}`);
      setCurrentInvite(invite);
      return invite;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invite details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const getStats = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callApi<InviteStats>(`/${businessId}/invites/stats`);
      setStats(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invite statistics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const listUsers = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callApi<BusinessUsersList>(`/${businessId}/users`);
      setBusinessUsers(data.users);
      setTotalUsers(data.total_users);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch business users');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, handleError]);

  const revokeInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await callApi(`/${businessId}/invites/${inviteId}/revoke`, { method: 'PATCH' });

      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, is_active: false, is_valid: false } : inv
        )
      );
      if (currentInvite?.id === inviteId) {
        setCurrentInvite((prev) => (prev ? { ...prev, is_active: false, is_valid: false } : null));
      }
    } catch (err: any) {
      handleError(err, 'Failed to revoke invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, currentInvite, handleError]);

  const extendInvite = useCallback(async (businessId: string, inviteId: string, days: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await callApi<BusinessInvite>(
        `/${businessId}/invites/${inviteId}/extend`,
        { method: 'PATCH', body: JSON.stringify({ additional_days: days }) }
      );

      setInvites((prev) => prev.map((inv) => (inv.id === inviteId ? updated : inv)));
      if (currentInvite?.id === inviteId) setCurrentInvite(updated);
      return updated;
    } catch (err: any) {
      handleError(err, 'Failed to extend invite expiration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, currentInvite, handleError]);

  const deleteInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await callApi(`/${businessId}/invites/${inviteId}`, { method: 'DELETE' });

      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      if (currentInvite?.id === inviteId) setCurrentInvite(null);
    } catch (err: any) {
      handleError(err, 'Failed to delete invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, currentInvite, handleError]);

  const cleanupExpired = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callApi<{ message: string; details: { expired_invites_deleted: number } }>(
        `/${businessId}/invites/cleanup-expired`,
        { method: 'POST' }
      );

      await listInvites(businessId);
      return result.details.expired_invites_deleted;
    } catch (err: any) {
      handleError(err, 'Failed to cleanup expired invites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, listInvites, handleError]);

  const copyInviteUrl = useCallback(async (inviteUrl: string) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      return true;
    } catch (err) {
      console.error('Failed to copy invite URL:', err);
      setError('Failed to copy invite URL to clipboard');
      return false;
    }
  }, []);

  const refreshInvites = useCallback(async () => {
    if (lastBusinessId) await listInvites(lastBusinessId);
  }, [lastBusinessId, listInvites]);

  return {
    invites,
    stats,
    currentInvite,
    businessUsers,
    totalUsers,
    isLoading,
    error,

    createInvite,
    listInvites,
    getInvite,
    getStats,
    listUsers,
    revokeInvite,
    extendInvite,
    deleteInvite,
    cleanupExpired,

    copyInviteUrl,
    refreshInvites,
    clearError,
  };
}