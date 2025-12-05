// hooks/use-demo.ts
import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DemoSession {
  session_id: string;
  business_id: string;
  customer_phone: string;
  demo_conversation_id: string;
}

interface DemoMessage {
  role: string;
  content: string;
  timestamp: string;
}

interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}

interface StartDemoResponse {
  session_id: string;
  customer_phone: string;
  greeting: string;
  business_name: string;
}

interface SendMessageResponse {
  ai_response: string;
  function_calls: FunctionCall[];
  conversation_state: string;
}

interface ConversationResponse {
  messages: DemoMessage[];
  state: {
    flow_state: string;
    customer_info: Record<string, any>;
  };
}

export function useDemo() {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Fetch all demo sessions
  const {
    data: sessionsData,
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["demo-sessions"],
    queryFn: async () => {
      const response = await api.get("/v1/dashboard/demo/sessions");
      return response.data;
    },
  });

  // Fetch conversation for active session
  const {
    data: conversationData,
    isLoading: loadingConversation,
    refetch: refetchConversation,
  } = useQuery({
    queryKey: ["demo-conversation", activeSessionId],
    queryFn: async () => {
      if (!activeSessionId) return null;
      const response = await api.get(
        `/v1/dashboard/demo/conversation/${activeSessionId}`
      );
      return response.data as ConversationResponse;
    },
    enabled: !!activeSessionId,
  });

  // Start new demo
  const startDemoMutation = useMutation({
    mutationFn: async (businessId?: string) => {
      const response = await api.post<StartDemoResponse>(
        "/v1/dashboard/demo/start",
        { business_id: businessId }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setActiveSessionId(data.session_id);
      queryClient.invalidateQueries({ queryKey: ["demo-sessions"] });
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) => {
      const response = await api.post<SendMessageResponse>(
        "/v1/dashboard/demo/message",
        {
          session_id: sessionId,
          message,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["demo-conversation", activeSessionId],
      });
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await api.delete(`/v1/dashboard/demo/sessions/${sessionId}`);
    },
    onSuccess: (_, deletedSessionId) => {
      if (activeSessionId === deletedSessionId) {
        setActiveSessionId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["demo-sessions"] });
    },
  });

  // Get analytics for a session
  const getAnalytics = useCallback(
    async (sessionId: string) => {
      const response = await api.get(
        `/v1/dashboard/demo/analytics/${sessionId}`
      );
      return response.data;
    },
    []
  );

  const startDemo = useCallback(
    async (businessId?: string) => {
      return startDemoMutation.mutateAsync(businessId);
    },
    [startDemoMutation]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!activeSessionId) {
        throw new Error("No active demo session");
      }
      return sendMessageMutation.mutateAsync({
        sessionId: activeSessionId,
        message,
      });
    },
    [activeSessionId, sendMessageMutation]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      return deleteSessionMutation.mutateAsync(sessionId);
    },
    [deleteSessionMutation]
  );

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  return {
    // Sessions
    sessions: sessionsData?.sessions || [],
    totalSessions: sessionsData?.total || 0,
    loadingSessions,
    refetchSessions,

    // Active conversation
    activeSessionId,
    messages: conversationData?.messages || [],
    conversationState: conversationData?.state,
    loadingConversation,
    refetchConversation,

    // Actions
    startDemo,
    sendMessage,
    deleteSession,
    switchSession,
    getAnalytics,

    // Loading states
    isStarting: startDemoMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  };
}