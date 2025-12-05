import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Circle, ChevronRight, Zap } from "lucide-react";
import { api } from "@/lib/api";

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  order: number;
  completed: boolean;
}

interface OnboardingStatus {
  completed_steps: string[];
  current_step: string;
  progress_percentage: number;
  is_completed: boolean;
  started_at: string | null;
  completed_at: string | null;
  steps: OnboardingStep[];
}

interface OnboardingChecklistProps {
  businessId: string;
  onStepClick?: (stepId: string) => void;
  compact?: boolean;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  businessId,
  onStepClick,
  compact = false,
}) => {
  const {
    data: onboarding,
    isLoading,
    refetch,
  } = useQuery<OnboardingStatus>({
    queryKey: ["onboarding", businessId],
    queryFn: async () => {
      const response = await api.get(
        `/v1/dashboard/businesses/${businessId}/onboarding`
      );
      return response.data;
    },
    enabled: !!businessId,
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      const response = await api.post(
        `/businesses/${businessId}/onboarding/complete`,
        { step_id: stepId }
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Clean up old step IDs and normalize completed steps
  const normalizeCompletedSteps = (steps: string[]): string[] => {
    return steps.filter(
      (step) => step === "business_info" || step === "calendar_connection"
    );
  };

  // Display steps - no filtering needed since backend already returns 2 steps
  const getDisplaySteps = (
    steps: OnboardingStep[],
    completedSteps: string[]
  ) => {
    const normalized = normalizeCompletedSteps(completedSteps);
    return steps.map((step, index) => ({
      ...step,
      order: index + 1,
      completed: normalized.includes(step.id),
    }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-xs text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!onboarding) {
    return null;
  }

  console.log("Onboarding data:", onboarding);
  console.log("Progress percentage:", onboarding.progress_percentage);

  const displaySteps = getDisplaySteps(
    onboarding.steps,
    onboarding.completed_steps
  );
  // Normalize old step IDs to new ones
  const currentStepId =
    onboarding.current_step === "business_knowledge"
      ? "calendar_connection"
      : onboarding.current_step;

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  // Compact sidebar version
  if (compact) {
    return (
      <div className="space-y-4">
        {/* Completion Message */}
        {onboarding.is_completed && (
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-gray-900 font-medium text-sm">🎉 All set!</p>
            </div>
          </div>
        )}

        {/* Steps List - Compact */}
        <div className="space-y-2">
          {displaySteps.map((step) => {
            const isCompleted = step.completed;
            const isCurrent = step.id === currentStepId;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isCompleted
                    ? "bg-white border-gray-200 hover:bg-gray-50"
                    : isCurrent
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                    : "bg-white border-gray-200 hover:bg-gray-50 opacity-60 cursor-not-allowed"
                }`}
                disabled={!isCompleted && !isCurrent}
              >
                <div className="flex items-start gap-3">
                  {/* Step Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    ) : isCurrent ? (
                      <div className="relative h-5 w-5">
                        <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse"></div>
                        <Circle className="h-5 w-5 text-blue-600" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {step.label}
                      </h4>
                      {isCompleted && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded flex-shrink-0">
                          Done
                        </span>
                      )}
                      {isCurrent && !isCompleted && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 flex-shrink-0">
                          <Zap className="h-2.5 w-2.5" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full version (original)
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Get Started with Your Business
        </h2>
        <p className="text-gray-600">
          Complete these steps to set up your business and start managing
          appointments.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {onboarding.progress_percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${onboarding.progress_percentage}%` }}
          ></div>
        </div>
      </div>

      {onboarding.is_completed && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">
              🎉 All set! Your business is fully configured.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displaySteps.map((step) => {
          const isCompleted = step.completed;
          const isCurrent = step.id === currentStepId;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isCompleted
                  ? "bg-gray-50 border-green-200 hover:bg-gray-100"
                  : isCurrent
                  ? "bg-blue-50 border-blue-400 hover:bg-blue-100"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-60"
              }`}
              disabled={!isCompleted && !isCurrent}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : isCurrent ? (
                      <div className="relative h-6 w-6">
                        <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse"></div>
                        <Circle className="h-6 w-6 text-blue-600" />
                      </div>
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        Step {step.order}: {step.label}
                      </h3>
                      {isCompleted && (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                          Done
                        </span>
                      )}
                      {isCurrent && !isCompleted && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Complete each step in order. You can always
          come back to update your information later.
        </p>
      </div>
    </div>
  );
};
