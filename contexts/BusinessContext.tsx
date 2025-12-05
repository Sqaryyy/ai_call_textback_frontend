"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Business } from "@/types/business";
import { User } from "@/types/user";
import { api } from "@/lib/api";

interface BusinessContextType {
  // Current active business
  activeBusiness: Business | null;
  setActiveBusiness: (business: Business | null) => void;

  // All businesses the user has access to
  businesses: Business[];
  setBusinesses: (businesses: Business[]) => void;

  // Loading states
  isLoading: boolean;

  // Actions
  switchBusiness: (businessId: string) => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  updateActiveBusiness: (updates: Partial<Business>) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

interface BusinessProviderProps {
  children: React.ReactNode;
  user: User | null;
}

export function BusinessProvider({ children, user }: BusinessProviderProps) {
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch all businesses from the backend using axios client
   */
  const fetchBusinesses = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const response = await api.get<{ businesses: Business[] }>(
        "/v1/dashboard/onboarding/my-businesses"
      );

      const fetchedBusinesses = response.data.businesses || [];
      setBusinesses(fetchedBusinesses);

      // Set active business from localStorage or default to first business
      const storedActiveId =
        typeof window !== "undefined"
          ? localStorage.getItem("active_business_id")
          : null;

      if (storedActiveId) {
        const storedBusiness = fetchedBusinesses.find(
          (b: Business) => b.id === storedActiveId
        );
        if (storedBusiness) {
          setActiveBusiness(storedBusiness);
        } else if (fetchedBusinesses.length > 0) {
          setActiveBusiness(fetchedBusinesses[0]);
        }
      } else if (fetchedBusinesses.length > 0) {
        setActiveBusiness(fetchedBusinesses[0]);
        if (typeof window !== "undefined") {
          localStorage.setItem("active_business_id", fetchedBusinesses[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      // Don't throw - just log the error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch businesses when user is available
  useEffect(() => {
    if (user) {
      fetchBusinesses();
    } else {
      // Clear businesses when user logs out
      setBusinesses([]);
      setActiveBusiness(null);
    }
  }, [user, fetchBusinesses]);

  /**
   * Switch to a different business
   */
  const switchBusiness = useCallback(
    async (businessId: string) => {
      // Find the business in the list
      const business = businesses.find((b) => b.id === businessId);

      if (!business) {
        throw new Error("Business not found");
      }

      // Update local state
      setActiveBusiness(business);

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("active_business_id", businessId);
      }
    },
    [businesses]
  );

  /**
   * Refresh the list of businesses from the backend
   */
  const refreshBusinesses = useCallback(async () => {
    await fetchBusinesses();
  }, [fetchBusinesses]);

  /**
   * Update the active business locally (optimistic update)
   * Use this before making API calls to update business settings
   */
  const updateActiveBusiness = useCallback(
    (updates: Partial<Business>) => {
      if (!activeBusiness) return;

      const updated = { ...activeBusiness, ...updates };
      setActiveBusiness(updated);

      // Also update in the businesses list
      setBusinesses((prev) =>
        prev.map((b) => (b.id === activeBusiness.id ? updated : b))
      );
    },
    [activeBusiness]
  );

  const value: BusinessContextType = {
    activeBusiness,
    setActiveBusiness,
    businesses,
    setBusinesses,
    isLoading,
    switchBusiness,
    refreshBusinesses,
    updateActiveBusiness,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

/**
 * Hook to access business context
 * Must be used within BusinessProvider
 */
export function useBusinessContext() {
  const context = useContext(BusinessContext);

  if (context === undefined) {
    throw new Error("useBusinessContext must be used within BusinessProvider");
  }

  return context;
}
