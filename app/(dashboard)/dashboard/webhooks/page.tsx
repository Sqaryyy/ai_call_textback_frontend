"use client";

import React, { useEffect, useState } from "react";
import { useBusiness } from "@/hooks/use-business";
import { useWebhooks } from "@/hooks/use-webhook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Webhook,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  TestTube,
  Globe,
  Zap,
  Activity,
  X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

export default function WebhooksPage() {
  const { activeBusiness } = useBusiness();
  const {
    webhooks,
    currentWebhook,
    webhookEvents,
    availableEvents,
    isLoading,
    error,
    listWebhooks,
    getWebhook,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    regenerateSecret,
    testWebhook,
    getAvailableEvents,
    listWebhookEvents,
    retryFailedEvents,
    clearError,
  } = useWebhooks();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);
  const [secretToShow, setSecretToShow] = useState<string>("");
  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [formData, setFormData] = useState({
    url: "",
    description: "",
    enabled_events: ["*"] as string[],
  });

  useEffect(() => {
    if (activeBusiness) {
      listWebhooks();
      getAvailableEvents();
    }
  }, [activeBusiness]);

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWebhook = await createWebhook(formData);
      setSecretToShow(newWebhook.secret);
      setShowSecretDialog(true);
      setShowCreateDialog(false);
      setFormData({ url: "", description: "", enabled_events: ["*"] });
      toast.success("Webhook created successfully");
    } catch (err) {
      toast.error("Failed to create webhook");
    }
  };

  const handleDeleteWebhook = async () => {
    if (!webhookToDelete) return;
    try {
      await deleteWebhook(webhookToDelete);
      setShowDeleteDialog(false);
      setWebhookToDelete(null);
      toast.success("Webhook deleted successfully");
    } catch (err) {
      toast.error("Failed to delete webhook");
    }
  };

  const handleToggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      await updateWebhook(webhookId, { is_active: !isActive });
      toast.success(isActive ? "Webhook disabled" : "Webhook enabled");
    } catch (err) {
      toast.error("Failed to update webhook");
    }
  };

  const handleRegenerateSecret = async (webhookId: string) => {
    try {
      const updated = await regenerateSecret(webhookId);
      setSecretToShow(updated.secret);
      setShowSecretDialog(true);
      toast.success("Secret regenerated successfully");
    } catch (err) {
      toast.error("Failed to regenerate secret");
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      const result = await testWebhook(webhookId);
      if (result.success) {
        toast.success(
          `Test successful! Response time: ${result.response_time_ms}ms`
        );
      } else {
        toast.error(`Test failed: ${result.message}`);
      }
    } catch (err) {
      toast.error("Failed to test webhook");
    }
  };

  const handleRetryFailed = async (webhookId: string) => {
    try {
      const result = await retryFailedEvents(webhookId);
      toast.success(result.message);
    } catch (err) {
      toast.error("Failed to retry events");
    }
  };

  const handleViewEvents = async (webhookId: string) => {
    try {
      await getWebhook(webhookId);
      await listWebhookEvents(webhookId);
    } catch (err) {
      toast.error("Failed to load webhook events");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleEventSelection = (event: string) => {
    setFormData((prev) => {
      const events = prev.enabled_events;
      if (event === "*") {
        return { ...prev, enabled_events: ["*"] };
      }

      const filtered = events.filter((e) => e !== "*");
      if (filtered.includes(event)) {
        return { ...prev, enabled_events: filtered.filter((e) => e !== event) };
      } else {
        return { ...prev, enabled_events: [...filtered, event] };
      }
    });
  };

  const getStatusColor = (webhook: any) => {
    if (!webhook.is_active) return "bg-gray-100 text-gray-700";
    if (webhook.consecutive_failures >= webhook.max_consecutive_failures) {
      return "bg-red-100 text-red-700";
    }
    if (webhook.consecutive_failures > 0)
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusIcon = (webhook: any) => {
    if (!webhook.is_active) return <XCircle className="h-4 w-4" />;
    if (webhook.consecutive_failures >= webhook.max_consecutive_failures) {
      return <AlertCircle className="h-4 w-4" />;
    }
    if (webhook.consecutive_failures > 0) return <Clock className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  const getStatusText = (webhook: any) => {
    if (!webhook.is_active) return "Disabled";
    if (webhook.consecutive_failures >= webhook.max_consecutive_failures) {
      return "Auto-disabled";
    }
    if (webhook.consecutive_failures > 0) return "Failing";
    return "Active";
  };

  const getEventStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "retrying":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!activeBusiness) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please select a business to manage webhooks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-600">
            Manage webhook endpoints for {activeBusiness.name}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Webhooks
            </CardTitle>
            <Webhook className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
            <p className="text-xs text-gray-600 mt-1">Configured endpoints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Webhooks
            </CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {webhooks.filter((w) => w.is_active).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Currently enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Healthy
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                webhooks.filter(
                  (w) => w.is_active && w.consecutive_failures === 0
                ).length
              }
            </div>
            <p className="text-xs text-gray-600 mt-1">No recent failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Events
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableEvents.length}</div>
            <p className="text-xs text-gray-600 mt-1">Event types</p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-red-600 text-sm">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && !currentWebhook && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading webhooks...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhooks List */}
      {!isLoading && webhooks.length > 0 && (
        <div
          className={`grid gap-6 ${
            currentWebhook ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      currentWebhook?.id === webhook.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 break-all">
                            {webhook.url}
                          </p>
                          {webhook.description && (
                            <p className="text-xs text-gray-600 mt-1">
                              {webhook.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                          webhook
                        )}`}
                      >
                        {getStatusIcon(webhook)}
                        {getStatusText(webhook)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {webhook.enabled_events.includes("*") ? (
                        <Badge variant="secondary">All Events</Badge>
                      ) : (
                        webhook.enabled_events.map((event) => (
                          <Badge key={event} variant="secondary">
                            {event}
                          </Badge>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                      <span>
                        Created{" "}
                        {formatDistanceToNow(new Date(webhook.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      {webhook.last_success_at && (
                        <span>
                          • Last success{" "}
                          {formatDistanceToNow(
                            new Date(webhook.last_success_at),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                      {webhook.consecutive_failures > 0 && (
                        <span className="text-red-600">
                          • {webhook.consecutive_failures} consecutive failures
                        </span>
                      )}
                    </div>

                    {webhook.last_failure_reason && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                        <strong>Last Error:</strong>{" "}
                        {webhook.last_failure_reason}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-600">Secret:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {showSecret[webhook.id]
                          ? webhook.secret
                          : "•".repeat(32)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowSecret((prev) => ({
                            ...prev,
                            [webhook.id]: !prev[webhook.id],
                          }))
                        }
                      >
                        {showSecret[webhook.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(webhook.secret)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEvents(webhook.id)}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        View Events
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook.id)}
                      >
                        <TestTube className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleWebhook(webhook.id, webhook.is_active)
                        }
                      >
                        {webhook.is_active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateSecret(webhook.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate Secret
                      </Button>
                      {webhook.consecutive_failures > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryFailed(webhook.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry Failed
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWebhookToDelete(webhook.id);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhook Events Detail */}
          {currentWebhook && (
            <Card className="lg:sticky lg:top-6 self-start">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Delivery Events</CardTitle>
                    <p className="text-sm text-gray-600 mt-1 break-all">
                      {currentWebhook.url}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      listWebhooks();
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] overflow-y-auto p-6 space-y-3">
                  {isLoading && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4 text-sm">
                        Loading events...
                      </p>
                    </div>
                  )}

                  {!isLoading && webhookEvents.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">No events yet</p>
                    </div>
                  )}

                  {!isLoading &&
                    webhookEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {event.event_type}
                            </p>
                            <p className="text-xs text-gray-600">
                              {format(
                                new Date(event.created_at),
                                "MMM dd, yyyy HH:mm:ss"
                              )}
                            </p>
                          </div>
                          <Badge className={getEventStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Attempts:</span>
                            <span className="font-medium">
                              {event.attempts} / {event.max_attempts}
                            </span>
                          </div>

                          {event.response_status_code && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Status Code:
                              </span>
                              <span
                                className={`font-medium ${
                                  event.response_status_code >= 200 &&
                                  event.response_status_code < 300
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {event.response_status_code}
                              </span>
                            </div>
                          )}

                          {event.response_time_ms && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Response Time:
                              </span>
                              <span className="font-medium">
                                {event.response_time_ms}ms
                              </span>
                            </div>
                          )}

                          {event.error_message && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                              <p className="text-red-600 text-xs">
                                <strong>Error:</strong> {event.error_message}
                              </p>
                            </div>
                          )}

                          {event.next_retry_at && (
                            <div className="flex justify-between text-yellow-600">
                              <span>Next Retry:</span>
                              <span>
                                {formatDistanceToNow(
                                  new Date(event.next_retry_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && webhooks.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No webhooks configured
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first webhook to receive real-time notifications
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Webhook Endpoint</DialogTitle>
            <DialogDescription>
              Configure a new webhook endpoint to receive event notifications
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateWebhook}>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Endpoint URL *
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Optional description for this webhook"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Events to Subscribe
                </label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <label
                        key={event}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.enabled_events.includes("*") ||
                            formData.enabled_events.includes(event)
                          }
                          onChange={() => toggleEventSelection(event)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {event === "*" ? "All Events" : event}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Create Webhook
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Secret Display Dialog */}
      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Webhook Secret</DialogTitle>
            <DialogDescription>
              Save this secret securely. You'll need it to verify webhook
              signatures.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-sm break-all">{secretToShow}</code>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => copyToClipboard(secretToShow)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSecretDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Webhook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this webhook? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWebhook}
              disabled={isLoading}
            >
              Delete Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
