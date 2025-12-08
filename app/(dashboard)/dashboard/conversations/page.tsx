"use client";

import React, { useEffect, useState } from "react";
import { useConversations } from "@/hooks/use-conversation";
import { useBusiness } from "@/hooks/use-business";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  TrendingUp,
  Users,
  MessageCircle,
  X,
  Send,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function ConversationsPage() {
  const { activeBusiness } = useBusiness();
  const {
    conversations,
    messages,
    selectedConversation,
    stats,
    loading,
    error,
    fetchConversations,
    fetchStats,
    searchByPhone,
    fetchConversationById,
    fetchConversationMessages,
    clearSelectedConversation,
  } = useConversations();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (activeBusiness) {
      fetchConversations({ limit: 50 });
      fetchStats();
    }
  }, [activeBusiness]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 10) {
      try {
        await searchByPhone({ phone: searchQuery, limit: 50 });
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  };

  const handleFilterChange = async (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      fetchConversations({ limit: 50 });
    } else {
      fetchConversations({ status, limit: 50 });
    }
  };

  const handleConversationClick = async (conversationId: string) => {
    try {
      await fetchConversationById(conversationId);
      await fetchConversationMessages(conversationId);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

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
        return <MessageCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
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

  if (!activeBusiness) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please select a business to view conversations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600">
          Manage and view all customer conversations for {activeBusiness.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_conversations || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Conversations
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.active_conversations || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.completed_conversations || 0}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Messages
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_messages || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Messages exchanged</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e as any);
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch as any}
                disabled={loading || searchQuery.length < 10}
              >
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("completed")}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("expired")}
              >
                Expired
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !selectedConversation && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading conversations...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout: Conversations List + Chat Window */}
      <div
        className={`grid gap-6 ${
          selectedConversation ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Conversations List */}
        {!loading && conversations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {conversation.customer_phone}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            conversation.status
                          )}`}
                        >
                          {getStatusIcon(conversation.status)}
                          {conversation.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-1">
                        Flow State:{" "}
                        <span className="font-medium">
                          {conversation.flow_state}
                        </span>
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Started{" "}
                          {formatDistanceToNow(
                            new Date(conversation.created_at),
                            { addSuffix: true }
                          )}
                        </span>
                        {conversation.last_message_at && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Last message{" "}
                            {formatDistanceToNow(
                              new Date(conversation.last_message_at),
                              { addSuffix: true }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading &&
          conversations.length === 0 &&
          !error &&
          !selectedConversation && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No conversations found
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery
                      ? "Try searching with a different phone number"
                      : "Conversations will appear here once customers start messaging"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Conversation Detail Card */}
        {selectedConversation && (
          <Card className="lg:sticky lg:top-6 self-start">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedConversation.customer_phone}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          selectedConversation.status
                        )}`}
                      >
                        {getStatusIcon(selectedConversation.status)}
                        {selectedConversation.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        Flow: {selectedConversation.flow_state}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(
                          new Date(selectedConversation.created_at),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearSelectedConversation()}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Container with Fixed Height */}
              <div className="h-[600px] overflow-y-auto p-6 bg-gray-50 space-y-4">
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
                    <p className="text-gray-600 text-sm">
                      No messages in this conversation yet
                    </p>
                  </div>
                )}

                {!loading && messages.length > 0 && (
                  <div className="space-y-4">
                    {messages.map((message: any, index: number) => (
                      <div
                        key={message.id || index}
                        className={`flex ${
                          isUserMessage(message)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[75%]">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-semibold text-gray-700">
                              {getSenderLabel(message)}
                            </span>
                            <span className="text-gray-400">
                              {format(
                                new Date(
                                  message.created_at || message.timestamp
                                ),
                                "HH:mm"
                              )}
                            </span>
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isUserMessage(message)
                                ? "bg-white border border-gray-200"
                                : "bg-blue-50 text-blue-900"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content || message.text || message.body}
                            </p>
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

              {/* Message Input Footer */}
              <div className="border-t bg-white p-4">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
