"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface Conversation {
  id: string;
  customer_phone: string;
  status: string;
  flow_state: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  metadata?: Record<string, any>;
}

interface ConversationStats {
  total_conversations: number;
  active_conversations: number;
  completed_conversations: number;
  expired_conversations: number;
  average_duration?: number;
  total_messages?: number;
}

interface ConversationContextType {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  stats: ConversationStats | null;
  loading: boolean;
  error: string | null;

  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  setStats: (stats: ConversationStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessage: (message: Message) => void;
  clearError: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv))
      );

      if (selectedConversation?.id === id) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, ...updates } : null
        );
      }
    },
    [selectedConversation]
  );

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Update last_message_at for the conversation
      updateConversation(message.conversation_id, {
        last_message_at: message.timestamp,
      });
    },
    [updateConversation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ConversationContextType = {
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
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};
