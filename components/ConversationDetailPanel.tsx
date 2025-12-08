import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Phone,
  X,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useConversations } from "@/hooks/use-conversation";

interface ConversationDetailPanelProps {
  isOpen: boolean;
  conversationId: string | null;
  onClose: () => void;
}

export default function ConversationDetailPanel({
  isOpen,
  conversationId,
  onClose,
}: ConversationDetailPanelProps) {
  const {
    selectedConversation,
    messages,
    loading,
    fetchConversationById,
    fetchConversationMessages,
  } = useConversations();

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchConversationById(conversationId);
      fetchConversationMessages(conversationId);
    }
  }, [isOpen, conversationId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <MessageCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "expired":
        return <XCircle className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getMessageBubbleClass = (message: any) => {
    const role = message.role || message.sender || message.sender_type;
    return role === "assistant" || role === "system" || role === "ai"
      ? "bg-blue-50 text-blue-900"
      : "bg-white text-gray-900 border border-gray-200";
  };

  const getSenderLabel = (message: any) => {
    const role = message.role || message.sender || message.sender_type;
    if (role === "customer" || role === "user") return "Customer";
    if (role === "system") return "System";
    return "Assistant";
  };

  const isUserMessage = (message: any) => {
    const role = message.role || message.sender || message.sender_type;
    return role === "customer" || role === "user";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Floating Card Panel */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-[500px] max-w-[calc(100vw-2rem)] z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
        }`}
      >
        <Card className="h-full flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                {selectedConversation && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedConversation.customer_phone}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedConversation.status
                      )}`}
                    >
                      {getStatusIcon(selectedConversation.status)}
                      {selectedConversation.status}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedConversation && (
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>Flow: {selectedConversation.flow_state}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Started{" "}
                  {formatDistanceToNow(
                    new Date(selectedConversation.created_at),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 text-sm">
                  Loading messages...
                </p>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-sm">No messages yet</p>
              </div>
            )}

            {!loading && messages.length > 0 && (
              <div className="space-y-3">
                {messages.map((message: any, index: number) => (
                  <div
                    key={message.id || index}
                    className={`flex ${
                      isUserMessage(message) ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`max-w-[85%]`}>
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-semibold text-gray-700">
                          {getSenderLabel(message)}
                        </span>
                        <span className="text-gray-400">
                          {format(
                            new Date(message.created_at || message.timestamp),
                            "HH:mm"
                          )}
                        </span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${getMessageBubbleClass(
                          message
                        )}`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content || message.text || message.body}
                        </p>

                        {/* Show media if available */}
                        {message.media_urls &&
                          message.media_urls.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.media_urls.map(
                                (url: string, i: number) => (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline block"
                                  >
                                    📎 Media attachment {i + 1}
                                  </a>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                disabled
                className="flex-1"
              />
              <Button disabled size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Viewing conversation history
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
