/**
 * Message type definitions based on backend model
 */

export type MessageRole = "customer" | "assistant" | "system";

export type MessageStatus = 
  | "received" 
  | "sending" 
  | "sent" 
  | "failed" 
  | "delivered";

export interface Message {
  id: string;
  conversation_id: string;
  sender_phone: string;
  recipient_phone: string;
  role: MessageRole;
  content: string;
  message_status?: MessageStatus;
  media_urls?: string[];
  message_metadata?: Record<string, any>;
  error_code?: string;
  error_message?: string;
  is_inbound: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageListResponse {
  messages: Message[];
  total?: number;
  skip?: number;
  limit?: number;
}

export interface CreateMessageRequest {
  conversation_id: string;
  sender_phone: string;
  recipient_phone: string;
  role: MessageRole;
  content: string;
  message_status?: MessageStatus;
  media_urls?: string[];
  message_metadata?: Record<string, any>;
  is_inbound: boolean;
}

export interface UpdateMessageRequest {
  message_status?: MessageStatus;
  error_code?: string;
  error_message?: string;
  message_metadata?: Record<string, any>;
}