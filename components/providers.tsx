"use client";

// components/providers.tsx

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { useAuth } from "@/hooks/use-auth";

/**
 * BusinessProviderWrapper - Wraps BusinessProvider with user from AuthContext
 * This ensures BusinessProvider has access to the authenticated user
 */
function BusinessProviderWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return <BusinessProvider user={user}>{children}</BusinessProvider>;
}

/**
 * Providers - Root providers component
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BusinessProviderWrapper>
        <ConversationProvider>{children}</ConversationProvider>
      </BusinessProviderWrapper>
    </AuthProvider>
  );
}
