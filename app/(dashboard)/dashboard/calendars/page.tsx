"use client";

import React, { useEffect, useState } from "react";
import { useCalendar } from "@/hooks/use-calendar";
import { useBusiness } from "@/hooks/use-business";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type IntegrationSetupDialog = {
  open: boolean;
  provider: "google" | "outlook" | "calendly" | null;
  step: "initial" | "polling" | "select-calendar";
  calendars?: Array<{ id: string; name: string }>;
  integrationId?: string;
};

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const { activeBusiness } = useBusiness();
  const {
    integrations,
    isLoading,
    error,
    initiateGoogleAuth,
    checkGoogleCallbackStatus,
    selectGoogleCalendar,
    initiateOutlookAuth,
    checkOutlookCallbackStatus,
    selectOutlookCalendar,
    setupCalendly,
    selectCalendlyEventType,
    listIntegrations,
    removeIntegration,
    clearError,
  } = useCalendar();

  const [setupDialog, setSetupDialog] = useState<IntegrationSetupDialog>({
    open: false,
    provider: null,
    step: "initial",
  });
  const [calendlyToken, setCalendlyToken] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeBusiness) {
      listIntegrations();
    }
  }, [activeBusiness]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const handleConnectProvider = async (
    provider: "google" | "outlook" | "calendly"
  ) => {
    try {
      clearError();

      if (provider === "calendly") {
        setSetupDialog({
          open: true,
          provider: "calendly",
          step: "initial",
        });
        return;
      }

      // For Google and Outlook, open OAuth popup
      const authUrl =
        provider === "google"
          ? await initiateGoogleAuth()
          : await initiateOutlookAuth();

      // Open popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        authUrl,
        "oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Start polling
      setSetupDialog({
        open: true,
        provider,
        step: "polling",
      });

      startPolling(provider);
    } catch (err) {
      console.error("Failed to initiate auth:", err);
    }
  };

  const startPolling = (provider: "google" | "outlook") => {
    const interval = setInterval(async () => {
      try {
        const status =
          provider === "google"
            ? await checkGoogleCallbackStatus()
            : await checkOutlookCallbackStatus();

        if (status.success && status.calendars) {
          // Stop polling
          if (pollInterval) clearInterval(pollInterval);
          setPollInterval(null);

          // Move to calendar selection
          setSetupDialog({
            open: true,
            provider,
            step: "select-calendar",
            calendars: status.calendars,
            integrationId: status.integration_id,
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Poll every 2 seconds

    setPollInterval(interval);
  };

  const markOnboardingStepComplete = async (
    stepId: string = "calendar_connection"
  ) => {
    if (!activeBusiness) return;

    try {
      console.log(
        `📋 [CALENDAR PAGE] Marking onboarding step complete: ${stepId}`
      );
      await api.post(
        `/v1/dashboard/businesses/${activeBusiness.id}/onboarding/complete`,
        {
          step_id: stepId,
        }
      );
      console.log(
        `✅ [CALENDAR PAGE] Onboarding step marked complete: ${stepId}`
      );

      // Add this: Invalidate the onboarding query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness.id],
      });
    } catch (err: any) {
      console.error(
        `❌ [CALENDAR PAGE] Failed to mark onboarding step complete:`,
        err
      );
    }
  };

  // Update the handleSelectCalendar function to include the onboarding step:
  const handleSelectCalendar = async () => {
    if (!setupDialog.integrationId || !selectedCalendar) return;

    try {
      clearError();

      if (setupDialog.provider === "google") {
        await selectGoogleCalendar(setupDialog.integrationId, selectedCalendar);
      } else if (setupDialog.provider === "outlook") {
        await selectOutlookCalendar(
          setupDialog.integrationId,
          selectedCalendar
        );
      }

      // Mark onboarding step as complete
      await markOnboardingStepComplete("calendar_connection");

      // Close dialog and refresh
      setSetupDialog({ open: false, provider: null, step: "initial" });
      setSelectedCalendar("");
      await listIntegrations();
    } catch (err) {
      console.error("Failed to select calendar:", err);
    }
  };

  const handleCalendlySetup = async () => {
    if (!calendlyToken.trim()) return;

    try {
      clearError();
      const response = await setupCalendly(calendlyToken);

      if (response.event_types.length > 0) {
        setSetupDialog({
          open: true,
          provider: "calendly",
          step: "select-calendar",
          calendars: response.event_types.map((et) => ({
            id: et.uri,
            name: et.name,
          })),
          integrationId: response.integration_id,
        });
      } else {
        setSetupDialog({ open: false, provider: null, step: "initial" });
        await listIntegrations();
      }

      setCalendlyToken("");
    } catch (err) {
      console.error("Failed to setup Calendly:", err);
    }
  };

  const handleSelectCalendlyEventType = async () => {
    if (!setupDialog.integrationId || !selectedCalendar) return;

    try {
      clearError();
      await selectCalendlyEventType(
        setupDialog.integrationId,
        selectedCalendar
      );

      // Mark onboarding step as complete
      await markOnboardingStepComplete("calendar_connection");

      setSetupDialog({ open: false, provider: null, step: "initial" });
      setSelectedCalendar("");
      await listIntegrations();
    } catch (err) {
      console.error("Failed to select event type:", err);
    }
  };

  const handleRemoveIntegration = async (integrationId: string) => {
    if (!confirm("Are you sure you want to disconnect this calendar?")) return;

    try {
      clearError();
      await removeIntegration(integrationId);
    } catch (err) {
      console.error("Failed to remove integration:", err);
    }
  };

  const closeDialog = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setSetupDialog({ open: false, provider: null, step: "initial" });
    setSelectedCalendar("");
    setCalendlyToken("");
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🗓️";
      case "outlook":
        return "📅";
      case "calendly":
        return "📆";
      default:
        return "📅";
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google Calendar";
      case "outlook":
        return "Outlook Calendar";
      case "calendly":
        return "Calendly";
      default:
        return provider;
    }
  };

  const getSyncStatusColor = (status: string | null) => {
    if (!status) return "text-gray-400";
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  if (!activeBusiness) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please select a business to manage calendar integrations.
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
          <h1 className="text-2xl font-bold text-gray-900">
            Calendar Integrations
          </h1>
          <p className="text-gray-600">
            Connect your calendars to manage availability for{" "}
            {activeBusiness.name}
          </p>
        </div>
        <Button onClick={() => listIntegrations()} disabled={isLoading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Connected Calendars
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Primary Calendar
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter((i) => i.is_primary).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrations.find((i) => i.is_primary)
                ? getProviderName(
                    integrations.find((i) => i.is_primary)!.provider
                  )
                : "None set"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last Sync
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {integrations.length > 0 && integrations[0].last_sync_at
                ? formatDistanceToNow(new Date(integrations[0].last_sync_at), {
                    addSuffix: true,
                  })
                : "Never"}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrations.length > 0 && integrations[0].last_sync_status
                ? integrations[0].last_sync_status
                : "No sync yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-600 text-sm font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Connect a Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handleConnectProvider("google")}
              disabled={isLoading}
            >
              <span className="text-3xl">🗓️</span>
              <span className="font-medium">Google Calendar</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handleConnectProvider("outlook")}
              disabled={isLoading}
            >
              <span className="text-3xl">📅</span>
              <span className="font-medium">Outlook Calendar</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => handleConnectProvider("calendly")}
              disabled={isLoading}
            >
              <span className="text-3xl">📆</span>
              <span className="font-medium">Calendly</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Calendars */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Calendars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                    {getProviderIcon(integration.provider)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {getProviderName(integration.provider)}
                      </p>
                      {integration.is_primary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Sync:{" "}
                        <span className="font-medium">
                          {integration.sync_direction}
                        </span>
                      </span>
                      {integration.last_sync_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last synced{" "}
                          {formatDistanceToNow(
                            new Date(integration.last_sync_at),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                      {integration.last_sync_status && (
                        <span
                          className={`flex items-center gap-1 ${getSyncStatusColor(
                            integration.last_sync_status
                          )}`}
                        >
                          {integration.last_sync_status === "success" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {integration.last_sync_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIntegration(integration.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && integrations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No calendars connected
              </h3>
              <p className="text-gray-600 mb-4">
                Connect your calendar to start managing availability
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Dialog */}
      <Dialog
        open={setupDialog.open}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {setupDialog.step === "polling"
                ? "Waiting for authorization..."
                : setupDialog.step === "select-calendar"
                ? "Select Calendar"
                : setupDialog.provider === "calendly"
                ? "Connect Calendly"
                : "Setup Calendar"}
            </DialogTitle>
            <DialogDescription>
              {setupDialog.step === "polling"
                ? "Please complete the authorization in the popup window."
                : setupDialog.step === "select-calendar"
                ? "Choose which calendar to sync with your business."
                : "Enter your Calendly Personal Access Token to connect."}
            </DialogDescription>
          </DialogHeader>

          {/* Polling State */}
          {setupDialog.step === "polling" && (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-sm text-gray-600 text-center">
                Waiting for you to complete authorization in the popup window...
              </p>
            </div>
          )}

          {/* Calendar Selection */}
          {setupDialog.step === "select-calendar" &&
            setupDialog.provider !== "calendly" && (
              <div className="space-y-4">
                <div>
                  <Label>Select Calendar</Label>
                  <Select
                    value={selectedCalendar}
                    onValueChange={setSelectedCalendar}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {setupDialog.calendars?.map((cal) => (
                        <SelectItem key={cal.id} value={cal.id}>
                          {cal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSelectCalendar}
                    disabled={!selectedCalendar || isLoading}
                  >
                    Connect Calendar
                  </Button>
                </DialogFooter>
              </div>
            )}

          {/* Calendly Event Type Selection */}
          {setupDialog.step === "select-calendar" &&
            setupDialog.provider === "calendly" && (
              <div className="space-y-4">
                <div>
                  <Label>Select Event Type</Label>
                  <Select
                    value={selectedCalendar}
                    onValueChange={setSelectedCalendar}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {setupDialog.calendars?.map((evt) => (
                        <SelectItem key={evt.id} value={evt.id}>
                          {evt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSelectCalendlyEventType}
                    disabled={!selectedCalendar || isLoading}
                  >
                    Connect Calendly
                  </Button>
                </DialogFooter>
              </div>
            )}

          {/* Calendly Token Input */}
          {setupDialog.step === "initial" &&
            setupDialog.provider === "calendly" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="calendly-token">Personal Access Token</Label>
                  <Input
                    id="calendly-token"
                    type="password"
                    placeholder="Enter your Calendly token"
                    value={calendlyToken}
                    onChange={(e) => setCalendlyToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    You can find this in your Calendly account settings under
                    Integrations → API & Webhooks
                  </p>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCalendlySetup}
                    disabled={!calendlyToken.trim() || isLoading}
                  >
                    Connect
                  </Button>
                </DialogFooter>
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
