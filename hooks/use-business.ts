// ============================================================================
// FILE: hooks/use-business.ts
// Simplified - no role checking (backend handles authorization)
// ============================================================================

import { useBusinessContext } from "@/contexts/BusinessContext";
import { Business } from "@/types/business";

/**
 * Hook to access business context with helper methods
 * Provides convenient access to active business and related operations
 * 
 * Note: Role-based authorization is handled by the backend.
 * Frontend can optionally check roles for UI purposes if needed.
 */
export function useBusiness() {
  const context = useBusinessContext();

  /**
   * Check if user has any business
   */
  const hasBusinesses = (): boolean => {
    return context.businesses.length > 0;
  };

  /**
   * Get business by ID from the user's businesses list
   */
  const getBusinessById = (businessId: string): Business | undefined => {
    return context.businesses.find(b => b.id === businessId);
  };

  /**
   * Check if a business is the currently active one
   */
  const isActiveBusiness = (businessId: string): boolean => {
    return context.activeBusiness?.id === businessId;
  };

  /**
   * Get the count of businesses user has access to
   */
  const businessCount = (): number => {
    return context.businesses.length;
  };

  return {
    // From context
    activeBusiness: context.activeBusiness,
    businesses: context.businesses,
    isLoading: context.isLoading,
    switchBusiness: context.switchBusiness,
    refreshBusinesses: context.refreshBusinesses,
    updateActiveBusiness: context.updateActiveBusiness,
    setActiveBusiness: context.setActiveBusiness,
    setBusinesses: context.setBusinesses,
    
    // Helper methods
    hasBusinesses,
    getBusinessById,
    isActiveBusiness,
    businessCount,
  };
}