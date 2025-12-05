"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBusiness } from "@/hooks/use-business";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { PUBLIC_ROUTES } from "@/config/routes";
import { Loader2, X } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { api } from "@/lib/api";

const queryClient = new QueryClient();

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeBusiness } = useBusiness();
  const [isChecklistDismissed, setIsChecklistDismissed] = React.useState(false);

  const { data: onboarding } = useQuery({
    queryKey: ["onboarding", activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return null;
      const response = await api.get(
        `/v1/dashboard/businesses/${activeBusiness.id}/onboarding`
      );
      return response.data;
    },
    enabled: !!activeBusiness?.id,
  });

  const handleOnboardingStepClick = (stepId: string) => {
    switch (stepId) {
      case "business_info":
        router.push(`/dashboard/business-info`);
        break;
      case "calendar_connection":
        router.push(`/dashboard/calendars`);
        break;
      default:
        break;
    }
  };

  const showOnboarding =
    activeBusiness &&
    onboarding &&
    !onboarding.is_completed &&
    !isChecklistDismissed;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Onboarding Checklist Sidebar - Right Side */}
      {showOnboarding && (
        <div className="w-72 bg-gradient-to-b from-blue-50 to-white border-l border-gray-200 overflow-y-auto flex flex-col sticky top-0">
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Setup Progress
                </h2>
                <p className="text-xs text-gray-600 mt-2">
                  {onboarding?.completed_steps?.length || 0} of 2 complete
                </p>
              </div>
              <button
                onClick={() => setIsChecklistDismissed(true)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                aria-label="Dismiss onboarding checklist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${onboarding?.progress_percentage || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {onboarding?.progress_percentage || 0}%
              </p>
            </div>

            <OnboardingChecklist
              businessId={activeBusiness.id}
              onStepClick={handleOnboardingStepClick}
              compact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(PUBLIC_ROUTES.SIGN_IN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BusinessProvider user={user}>
        <ConversationProvider>
          <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar - Navigation */}
            <div className="border-r border-gray-200 h-screen sticky top-0">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <Header />
              </div>

              {/* Content with optional Onboarding Sidebar */}
              <DashboardContent>{children}</DashboardContent>
            </div>
          </div>
        </ConversationProvider>
      </BusinessProvider>
    </QueryClientProvider>
  );
}
