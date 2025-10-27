"use client";

import React, { useState } from "react";
import { useBusiness } from "@/hooks/use-business";
import { Button } from "@/components/ui/button";
import { Building2, Check, ChevronDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessSwitcherProps {
  onCreateNew?: () => void;
}

export function BusinessSwitcher({ onCreateNew }: BusinessSwitcherProps) {
  const { activeBusiness, businesses, switchBusiness, isLoading } =
    useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (businessId: string) => {
    if (businessId === activeBusiness?.id) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await switchBusiness(businessId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch business:", error);
      // TODO: Show error toast
      alert("Failed to switch business. Please try again.");
    } finally {
      setIsSwitching(false);
    }
  };

  // Show loading state while fetching businesses
  if (isLoading && businesses.length === 0) {
    return (
      <Button
        variant="outline"
        disabled
        className="flex items-center gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="text-sm">Loading...</span>
        </div>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[200px] justify-between"
        disabled={isLoading || isSwitching}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">
            {activeBusiness?.name || "Select Business"}
          </span>
        </div>
        {isSwitching ? (
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
        ) : (
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 right-0 z-40 mt-2 origin-top-left rounded-lg border bg-white shadow-lg">
            {/* Header */}
            <div className="border-b px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Businesses ({businesses.length})
              </p>
            </div>

            {/* Business List */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {businesses.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No businesses yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Create your first business to get started
                  </p>
                </div>
              ) : (
                businesses.map((business) => {
                  const isActive = business.id === activeBusiness?.id;

                  return (
                    <button
                      key={business.id}
                      onClick={() => handleSwitch(business.id)}
                      disabled={isSwitching}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100",
                        isSwitching && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs font-semibold flex-shrink-0">
                        {business.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {business.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {business.business_type}
                        </p>
                        {business.role && (
                          <p className="text-xs text-gray-400 capitalize">
                            {business.role}
                          </p>
                        )}
                      </div>

                      {isActive && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Create New Button */}
            <div className="border-t p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateNew?.();
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                  <Plus className="h-4 w-4 text-gray-400" />
                </div>
                <span>Create New Business</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
