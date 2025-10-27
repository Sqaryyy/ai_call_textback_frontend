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
  Filter,
  TrendingUp,
  Users,
  MessageCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ConversationsPage() {
  const { activeBusiness } = useBusiness();
  const {
    conversations,
    stats,
    loading,
    error,
    fetchConversations,
    fetchStats,
    searchByPhone,
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
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || searchQuery.length < 10}
              >
                Search
              </Button>
            </form>

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
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading conversations...</p>
            </div>
          </CardContent>
        </Card>
      )}

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
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    // Navigate to conversation detail page
                    window.location.href = `/conversations/${conversation.id}`;
                  }}
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
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && conversations.length === 0 && !error && (
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
    </div>
  );
}
