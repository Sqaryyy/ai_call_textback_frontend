import { useCallback } from 'react';
import { useConversationContext } from '@/contexts/ConversationContext';
import { api } from '@/lib/api';

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
      const response = await api.get('/dashboard/conversations', { params });
      const data = response.data;
      
      // ✅ Handle both array and object responses
      const conversationsArray = Array.isArray(data) ? data : data.conversations || [];
      
      setConversations(conversationsArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch conversations';
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
      const response = await api.get(`/dashboard/conversations/${conversationId}`);
      const data = response.data;
      
      setSelectedConversation(data);
      
      // Also update in conversations list if it exists
      updateConversation(conversationId, data);
      
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch conversation';
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
      const response = await api.get(
        `/dashboard/conversations/${conversationId}/messages`,
        { params }
      );
      const data = response.data;
      
      // ✅ Handle both array and object responses
      const messagesArray = Array.isArray(data) ? data : data.messages || [];
      
      setMessages(messagesArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch messages';
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
      const response = await api.get('/dashboard/conversations/search/by-phone', { params });
      const data = response.data;
      
      // ✅ Handle both array and object responses
      const conversationsArray = Array.isArray(data) ? data : data.conversations || [];
      
      setConversations(conversationsArray);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to search conversations';
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
      const response = await api.get('/dashboard/conversations/stats/summary', { params });
      const data = response.data;
      
      setStats(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch stats';
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
      const response = await api.get(`/dashboard/conversations/${conversationId}/context`);
      const data = response.data;
      
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch conversation context';
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