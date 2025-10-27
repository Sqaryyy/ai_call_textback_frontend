import { useCallback } from 'react';
import { useConversationContext } from '@/contexts/ConversationContext';
import { TokenManager } from '@/lib/auth/token-manager';

// Adjust this base URL to match your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api/v1';

interface ListConversationsParams {
  start_date?: string;
  end_date?: string;
  status?: string;
  customer_phone?: string;
  flow_state?: string;
  skip?: number;
  limit?: number;
}

interface GetMessagesParams {
  skip?: number;
  limit?: number;
}

interface SearchByPhoneParams {
  phone: string;
  skip?: number;
  limit?: number;
}

interface GetStatsParams {
  start_date?: string;
  end_date?: string;
}

// Helper to build query string
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return filtered ? `?${filtered}` : '';
};

export const useConversations = () => {
  const {
    conversations,
    selectedConversation,
    messages,
    stats,
    loading,
    error,
    setConversations,
    setSelectedConversation,
    setMessages,
    setStats,
    setLoading,
    setError,
    updateConversation,
    addMessage,
    clearError,
  } = useConversationContext();

  /**
   * Fetch list of conversations with optional filters
   */
  const fetchConversations = useCallback(async (params?: ListConversationsParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations${queryString}`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch conversations');
      }

      const data = await response.json();
      
      // ✅ FIX: Handle both array and object responses
      // If API returns {conversations: [...], total: N}, extract the array
      const conversationsArray = Array.isArray(data) ? data : data.conversations || [];
      
      setConversations(conversationsArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch conversations';
      setError(errorMsg);
      console.error('Fetch conversations error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setConversations, setLoading, setError]);

  /**
   * Fetch a specific conversation by ID
   */
  const fetchConversationById = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations/${conversationId}`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch conversation');
      }

      const data = await response.json();
      setSelectedConversation(data);
      
      // Also update in conversations list if it exists
      updateConversation(conversationId, data);
      
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch conversation';
      setError(errorMsg);
      console.error('Fetch conversation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setSelectedConversation, setLoading, setError, updateConversation]);

  /**
   * Fetch messages for a specific conversation
   */
  const fetchConversationMessages = useCallback(async (
    conversationId: string,
    params?: GetMessagesParams
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations/${conversationId}/messages${queryString}`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch messages');
      }

      const data = await response.json();
      
      // ✅ FIX: Handle both array and object responses
      const messagesArray = Array.isArray(data) ? data : data.messages || [];
      
      setMessages(messagesArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch messages';
      setError(errorMsg);
      console.error('Fetch messages error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setMessages, setLoading, setError]);

  /**
   * Search conversations by phone number
   */
  const searchByPhone = useCallback(async (params: SearchByPhoneParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations/search/by-phone${queryString}`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to search conversations');
      }

      const data = await response.json();
      
      // ✅ FIX: Handle both array and object responses
      const conversationsArray = Array.isArray(data) ? data : data.conversations || [];
      
      setConversations(conversationsArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to search conversations';
      setError(errorMsg);
      console.error('Search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setConversations, setLoading, setError]);

  /**
   * Fetch conversation statistics
   */
  const fetchStats = useCallback(async (params?: GetStatsParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations/stats/summary${queryString}`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch stats';
      setError(errorMsg);
      console.error('Fetch stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setStats, setLoading, setError]);

  /**
   * Fetch conversation context (customer info)
   */
  const fetchConversationContext = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversations/${conversationId}/context`,
        {
          headers: TokenManager.getAuthHeader(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch conversation context');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch conversation context';
      setError(errorMsg);
      console.error('Fetch context error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  /**
   * Refresh current conversation data
   */
  const refreshConversation = useCallback(async () => {
    if (!selectedConversation) {
      throw new Error('No conversation selected');
    }
    return fetchConversationById(selectedConversation.id);
  }, [selectedConversation, fetchConversationById]);

  /**
   * Refresh messages for current conversation
   */
  const refreshMessages = useCallback(async () => {
    if (!selectedConversation) {
      throw new Error('No conversation selected');
    }
    return fetchConversationMessages(selectedConversation.id);
  }, [selectedConversation, fetchConversationMessages]);

  /**
   * Clear selected conversation
   */
  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
  }, [setSelectedConversation, setMessages]);

  return {
    // State
    conversations,
    selectedConversation,
    messages,
    stats,
    loading,
    error,

    // Actions
    fetchConversations,
    fetchConversationById,
    fetchConversationMessages,
    searchByPhone,
    fetchStats,
    fetchConversationContext,
    refreshConversation,
    refreshMessages,
    clearSelectedConversation,
    updateConversation,
    addMessage,
    clearError,
  };
};