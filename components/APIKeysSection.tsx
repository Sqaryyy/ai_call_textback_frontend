"use client";

import React, { useEffect, useState } from "react";
import { useApiKeys } from "@/hooks/use-api";
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
  Key,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Shield,
  Activity,
  X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

export default function APIKeysSection() {
  const {
    apiKeys,
    availableScopes,
    usageStats,
    isLoading,
    error,
    listApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    revokeApiKey,
    activateApiKey,
    rotateApiKey,
    getAvailableScopes,
    getUsageStats,
    clearError,
  } = useApiKeys();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<string | null>(null);
  const [apiKeyToRevoke, setApiKeyToRevoke] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [secretToShow, setSecretToShow] = useState<string>("");
  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scopes: ["*"] as string[],
    expires_in_days: undefined as number | undefined,
    rate_limit: 1000,
    allowed_ips: [] as string[],
  });

  useEffect(() => {
    listApiKeys();
    getAvailableScopes();
    getUsageStats();
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newKey = await createApiKey(formData);
      setSecretToShow(newKey.secret);
      setShowSecretDialog(true);
      setShowCreateDialog(false);
      setFormData({
        name: "",
        description: "",
        scopes: ["*"],
        expires_in_days: undefined,
        rate_limit: 1000,
        allowed_ips: [],
      });
      toast.success("API key created successfully");
    } catch (err) {
      toast.error("Failed to create API key");
    }
  };

  const handleDeleteApiKey = async () => {
    if (!apiKeyToDelete) return;
    try {
      await deleteApiKey(apiKeyToDelete);
      setShowDeleteDialog(false);
      setApiKeyToDelete(null);
      toast.success("API key deleted successfully");
    } catch (err) {
      toast.error("Failed to delete API key");
    }
  };

  const handleRevokeApiKey = async () => {
    if (!apiKeyToRevoke) return;
    try {
      await revokeApiKey(apiKeyToRevoke, revokeReason || undefined);
      setShowRevokeDialog(false);
      setApiKeyToRevoke(null);
      setRevokeReason("");
      toast.success("API key revoked successfully");
    } catch (err) {
      toast.error("Failed to revoke API key");
    }
  };

  const handleToggleApiKey = async (apiKeyId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await updateApiKey(apiKeyId, { is_active: false });
        toast.success("API key disabled");
      } else {
        await activateApiKey(apiKeyId);
        toast.success("API key enabled");
      }
    } catch (err) {
      toast.error("Failed to update API key");
    }
  };

  const handleRotateApiKey = async (apiKeyId: string) => {
    try {
      const updated = await rotateApiKey(apiKeyId);
      setSecretToShow(updated.secret);
      setShowSecretDialog(true);
      toast.success("API key rotated successfully");
    } catch (err) {
      toast.error("Failed to rotate API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleScopeSelection = (scope: string) => {
    setFormData((prev) => {
      const scopes = prev.scopes;
      if (scope === "*") {
        return { ...prev, scopes: ["*"] };
      }

      const filtered = scopes.filter((s) => s !== "*");
      if (filtered.includes(scope)) {
        return { ...prev, scopes: filtered.filter((s) => s !== scope) };
      } else {
        return { ...prev, scopes: [...filtered, scope] };
      }
    });
  };

  const getStatusColor = (apiKey: any) => {
    if (apiKey.revoked_at) return "bg-gray-100 text-gray-700";
    if (!apiKey.is_active) return "bg-gray-100 text-gray-700";
    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return "bg-red-100 text-red-700";
    }
    return "bg-green-100 text-green-700";
  };

  const getStatusIcon = (apiKey: any) => {
    if (apiKey.revoked_at) return <XCircle className="h-4 w-4" />;
    if (!apiKey.is_active) return <XCircle className="h-4 w-4" />;
    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <CheckCircle2 className="h-4 w-4" />;
  };

  const getStatusText = (apiKey: any) => {
    if (apiKey.revoked_at) return "Revoked";
    if (!apiKey.is_active) return "Disabled";
    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return "Expired";
    }
    return "Active";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
          <p className="text-gray-600">
            Manage API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Stats Grid */}
      {usageStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Keys
              </CardTitle>
              <Key className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.total_keys}</div>
              <p className="text-xs text-gray-600 mt-1">API keys created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Keys
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {usageStats.active_keys}
              </div>
              <p className="text-xs text-gray-600 mt-1">Currently enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inactive Keys
              </CardTitle>
              <XCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats.inactive_keys}
              </div>
              <p className="text-xs text-gray-600 mt-1">Disabled or revoked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Requests
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats.total_requests.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">API calls made</p>
            </CardContent>
          </Card>
        </div>
      )}

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
      {isLoading && apiKeys.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading API keys...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      {!isLoading && apiKeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {apiKey.name}
                        </p>
                        {apiKey.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {apiKey.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                        apiKey
                      )}`}
                    >
                      {getStatusIcon(apiKey)}
                      {getStatusText(apiKey)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {apiKey.scopes.includes("*") ? (
                      <Badge variant="secondary">Full Access</Badge>
                    ) : (
                      apiKey.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary">
                          {scope}
                        </Badge>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(apiKey.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {apiKey.last_used_at && (
                      <span>
                        • Last used{" "}
                        {formatDistanceToNow(new Date(apiKey.last_used_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                    <span>• {apiKey.usage_count} requests</span>
                    {apiKey.expires_at && (
                      <span>
                        • Expires{" "}
                        {format(new Date(apiKey.expires_at), "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>

                  {apiKey.revoked_at && apiKey.revoked_reason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                      <strong>Revoked:</strong> {apiKey.revoked_reason}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-600">Key:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                      {showSecret[apiKey.id]
                        ? `${apiKey.key_prefix}${"•".repeat(32)}`
                        : `${apiKey.key_prefix}${"•".repeat(32)}`}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key_prefix)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!apiKey.revoked_at && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleApiKey(apiKey.id, apiKey.is_active)
                          }
                        >
                          {apiKey.is_active ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRotateApiKey(apiKey.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Rotate Key
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setApiKeyToRevoke(apiKey.id);
                            setShowRevokeDialog(true);
                          }}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Revoke
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setApiKeyToDelete(apiKey.id);
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
      )}

      {/* Empty State */}
      {!isLoading && apiKeys.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No API keys yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first API key to access our API programmatically
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create API Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateApiKey}>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <Input
                  placeholder="Production API Key"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Permissions
                </label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {availableScopes.map((scope) => (
                      <label
                        key={scope}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData.scopes.includes("*") ||
                            formData.scopes.includes(scope)
                          }
                          onChange={() => toggleScopeSelection(scope)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {scope === "*" ? "Full Access" : scope}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rate Limit (per hour)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.rate_limit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate_limit: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Expires In (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Never"
                    value={formData.expires_in_days || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expires_in_days: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
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
                Create API Key
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Secret Display Dialog */}
      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Save this API key securely. You won't be able to see it again!
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
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Store this key securely. Once you
                  close this dialog, you won't be able to see the full key
                  again.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSecretDialog(false)}>
              I've Saved It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              This will permanently revoke the API key. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Reason (optional)
            </label>
            <Input
              placeholder="Why are you revoking this key?"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevokeDialog(false);
                setRevokeReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevokeApiKey}
              disabled={isLoading}
            >
              Revoke API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot
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
              onClick={handleDeleteApiKey}
              disabled={isLoading}
            >
              Delete API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
