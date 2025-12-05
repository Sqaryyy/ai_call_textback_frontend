"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface Session {
  session_id: string;
}

interface DemoChatPanelProps {
  sessions: Session[];
  activeSessionId: string | null;
  messages: Message[];
  isStarting: boolean;
  isSending: boolean;
  loadingConversation: boolean;
  onStartDemo: () => Promise<void>;
  onSendMessage: (message: string) => Promise<any>;
  onDeleteSession: (sessionId: string) => Promise<void>;
  onSwitchSession: (sessionId: string) => void;
}

export function DemoChatPanel({
  sessions,
  activeSessionId,
  messages,
  isStarting,
  isSending,
  loadingConversation,
  onStartDemo,
  onSendMessage,
  onDeleteSession,
  onSwitchSession,
}: DemoChatPanelProps) {
  const [messageInput, setMessageInput] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combine real messages with optimistic messages
  const displayMessages = [...messages, ...optimisticMessages];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  // Clear optimistic messages when real messages update
  useEffect(() => {
    setOptimisticMessages([]);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isSending) return;

    const message = messageInput.trim();
    setMessageInput("");

    // Add optimistic message immediately
    const optimisticMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setOptimisticMessages([optimisticMessage]);

    // Send the actual message
    await onSendMessage(message);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("Are you sure you want to delete this demo conversation?")) {
      await onDeleteSession(sessionId);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant Demo</CardTitle>
              <p className="text-xs text-gray-600 mt-0.5">
                Test your chatbot responses
              </p>
            </div>
          </div>
          <Button
            onClick={onStartDemo}
            disabled={isStarting}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm"
          >
            {isStarting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            New Chat
          </Button>
        </div>

        {/* Session Tabs */}
        {sessions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all border cursor-pointer group ${
                  activeSessionId === session.session_id
                    ? "bg-white border-blue-200 text-blue-700 shadow-sm font-medium"
                    : "bg-white/50 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300"
                }`}
                onClick={() => onSwitchSession(session.session_id)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat {session.session_id.slice(0, 4)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.session_id);
                  }}
                  className="ml-1 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {!activeSessionId ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Test Your AI Assistant
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start a demo conversation to see how your chatbot responds to
                customer inquiries and booking requests
              </p>
              <Button
                onClick={onStartDemo}
                disabled={isStarting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isStarting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Start Demo
              </Button>
            </div>
          </div>
        ) : loadingConversation ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading conversation...</p>
            </div>
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-sm">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {displayMessages.map((message, index) => {
              const isUser =
                message.role === "customer" || message.role === "user";
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isUser && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 shadow-sm">
                      <User className="h-4 w-4 text-gray-700" />
                    </div>
                  )}
                </div>
              );
            })}
            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      {/* Input Area */}
      {activeSessionId && (
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isSending || !messageInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Bot className="h-3 w-3" />
              Demo mode - No actual appointments will be booked
            </p>
          </form>
        </div>
      )}
    </Card>
  );
}
