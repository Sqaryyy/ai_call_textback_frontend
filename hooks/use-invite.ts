import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

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

export function useInvites(): UseInvitesReturn {
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
    const message = err.response?.data?.detail || err.message || defaultMessage;
    setError(message);
    throw new Error(message);
  }, []);

  const createInvite = useCallback(async (businessId: string, data: CreateInviteRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(
        `/dashboard/business-invites/${businessId}/invites`,
        {
          email: data.email || null,
          role: data.role,
          max_uses: data.max_uses || 1,
          expires_in_days: data.expires_in_days || 7,
        }
      );

      const invite = response.data;
      setInvites((prev) => [invite, ...prev]);
      return invite;
    } catch (err: any) {
      handleError(err, 'Failed to create invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const listInvites = useCallback(async (businessId: string, includeInactive = false) => {
    setIsLoading(true);
    setError(null);
    setLastBusinessId(businessId);

    try {
      const response = await api.get(
        `/dashboard/business-invites/${businessId}/invites`,
        { params: { include_inactive: includeInactive } }
      );

      const data = response.data;
      setInvites(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/dashboard/business-invites/${businessId}/invites/${inviteId}`
      );

      const invite = response.data;
      setCurrentInvite(invite);
      return invite;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invite details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getStats = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/dashboard/business-invites/${businessId}/invites/stats`
      );

      const data = response.data;
      setStats(data);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch invite statistics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const listUsers = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/dashboard/business-invites/${businessId}/users`
      );

      const data = response.data;
      setBusinessUsers(data.users);
      setTotalUsers(data.total_users);
      return data;
    } catch (err: any) {
      handleError(err, 'Failed to fetch business users');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const revokeInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.patch(
        `/dashboard/business-invites/${businessId}/invites/${inviteId}/revoke`
      );

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
  }, [currentInvite, handleError]);

  const extendInvite = useCallback(async (businessId: string, inviteId: string, days: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(
        `/dashboard/business-invites/${businessId}/invites/${inviteId}/extend`,
        { additional_days: days }
      );

      const updated = response.data;
      setInvites((prev) => prev.map((inv) => (inv.id === inviteId ? updated : inv)));
      if (currentInvite?.id === inviteId) setCurrentInvite(updated);
      return updated;
    } catch (err: any) {
      handleError(err, 'Failed to extend invite expiration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentInvite, handleError]);

  const deleteInvite = useCallback(async (businessId: string, inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(
        `/dashboard/business-invites/${businessId}/invites/${inviteId}`
      );

      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      if (currentInvite?.id === inviteId) setCurrentInvite(null);
    } catch (err: any) {
      handleError(err, 'Failed to delete invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentInvite, handleError]);

  const cleanupExpired = useCallback(async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `/dashboard/business-invites/${businessId}/invites/cleanup-expired`
      );

      const result = response.data;
      await listInvites(businessId);
      return result.details.expired_invites_deleted;
    } catch (err: any) {
      handleError(err, 'Failed to cleanup expired invites');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [listInvites, handleError]);

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