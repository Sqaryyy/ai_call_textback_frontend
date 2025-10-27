"use client";

import React, { useEffect, useState } from "react";
import { useInvites } from "@/hooks/use-invite";
import { useBusiness } from "@/hooks/use-business";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Mail,
  Shield,
  Users,
  Link2,
  Copy,
  Trash2,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function TeamPage() {
  const { activeBusiness } = useBusiness();
  const {
    invites,
    stats,
    businessUsers,
    totalUsers,
    isLoading,
    error,
    createInvite,
    listInvites,
    getStats,
    listUsers,
    revokeInvite,
    extendInvite,
    deleteInvite,
    cleanupExpired,
    copyInviteUrl,
    clearError,
  } = useInvites();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "member" as "owner" | "member",
    max_uses: 1,
    expires_in_days: 7,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (activeBusiness) {
      listInvites(activeBusiness.id);
      getStats(activeBusiness.id);
      listUsers(activeBusiness.id);
    }
  }, [activeBusiness]);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;

    try {
      await createInvite(activeBusiness.id, {
        email: formData.email || undefined,
        role: formData.role,
        max_uses: formData.max_uses,
        expires_in_days: formData.expires_in_days,
      });

      // Reset form
      setFormData({
        email: "",
        role: "member",
        max_uses: 1,
        expires_in_days: 7,
      });
      setShowCreateForm(false);

      // Refresh stats
      await getStats(activeBusiness.id);
    } catch (err) {
      console.error("Failed to create invite:", err);
    }
  };

  const handleCopyInvite = async (inviteUrl: string, inviteId: string) => {
    const success = await copyInviteUrl(inviteUrl);
    if (success) {
      setCopiedId(inviteId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExtendInvite = async (inviteId: string) => {
    if (!activeBusiness) return;
    try {
      await extendInvite(activeBusiness.id, inviteId, 7);
      await getStats(activeBusiness.id);
    } catch (err) {
      console.error("Failed to extend invite:", err);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!activeBusiness) return;
    if (!confirm("Are you sure you want to revoke this invite?")) return;

    try {
      await revokeInvite(activeBusiness.id, inviteId);
      await getStats(activeBusiness.id);
    } catch (err) {
      console.error("Failed to revoke invite:", err);
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    if (!activeBusiness) return;
    if (!confirm("Are you sure you want to delete this invite?")) return;

    try {
      await deleteInvite(activeBusiness.id, inviteId);
      await getStats(activeBusiness.id);
    } catch (err) {
      console.error("Failed to delete invite:", err);
    }
  };

  const handleCleanupExpired = async () => {
    if (!activeBusiness) return;
    try {
      const count = await cleanupExpired(activeBusiness.id);
      alert(`Cleaned up ${count} expired invite(s)`);
    } catch (err) {
      console.error("Failed to cleanup expired invites:", err);
    }
  };

  const getStatusBadge = (invite: any) => {
    if (!invite.is_active) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <XCircle className="h-3 w-3" />
          Revoked
        </span>
      );
    }
    if (!invite.is_valid) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertCircle className="h-3 w-3" />
          Expired
        </span>
      );
    }
    if (invite.used_count >= invite.max_uses) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <CheckCircle2 className="h-3 w-3" />
          Used
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  };

  if (!activeBusiness) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please select a business to manage team invites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">
            Invite team members to join {activeBusiness.name}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Create Invite
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Invites
            </CardTitle>
            <Mail className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_invites || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Invites
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.active_invites || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valid Invites
            </CardTitle>
            <Link2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.valid_invites || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Used Invites
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.used_invites || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Uses
            </CardTitle>
            <UserPlus className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_uses || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalUsers} member{totalUsers !== 1 ? "s" : ""} in this
                business
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => activeBusiness && listUsers(activeBusiness.id)}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && businessUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading team members...</p>
            </div>
          ) : businessUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No team members yet
              </h3>
              <p className="text-gray-600">
                Team members will appear here once they join
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {businessUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.full_name || "No name"}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "owner"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                      {!user.is_active && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-1">{user.email}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined{" "}
                        {formatDistanceToNow(new Date(user.joined_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invite Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invite</CardTitle>
          </CardHeader>
          <CardContent>
            <div onSubmit={handleCreateInvite} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="teammate@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for a generic invite link
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "owner" | "member",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Uses
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.max_uses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_uses: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires In (Days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.expires_in_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expires_in_days: parseInt(e.target.value) || 7,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateInvite} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Invite"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invites List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Invites</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupExpired}
            disabled={isLoading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Cleanup Expired
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && invites.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading invites...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No invites yet
              </h3>
              <p className="text-gray-600">
                Create your first invite to start adding team members
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {invite.email || "Generic Invite"}
                      </p>
                      {getStatusBadge(invite)}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Shield className="h-3 w-3" />
                        {invite.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {invite.used_count} / {invite.max_uses} uses
                      </span>
                      {invite.expires_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires{" "}
                          {formatDistanceToNow(new Date(invite.expires_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created{" "}
                        {formatDistanceToNow(new Date(invite.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 px-3 py-1.5 rounded text-xs font-mono text-gray-700 truncate">
                        {invite.invite_url}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopyInvite(invite.invite_url, invite.id)
                        }
                        className="gap-1"
                      >
                        {copiedId === invite.id ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {invite.is_valid && invite.is_active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExtendInvite(invite.id)}
                        className="gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Extend
                      </Button>
                    )}
                    {invite.is_active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeInvite(invite.id)}
                        className="gap-1 text-orange-600 hover:text-orange-700"
                      >
                        <XCircle className="h-3 w-3" />
                        Revoke
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteInvite(invite.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
