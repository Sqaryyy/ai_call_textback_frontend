"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBusiness } from "@/hooks/use-business";
import { BusinessSwitcher } from "@/components/business/BusinessSwitcher";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { user, signOut, getDisplayName, getInitials } = useAuth();
  const { activeBusiness } = useBusiness();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleCreateBusiness = () => {
    router.push("/onboarding");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left side - Business name or welcome */}
      <div>
        {activeBusiness ? (
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {activeBusiness.name}
            </h1>
            <p className="text-xs text-gray-500">
              {activeBusiness.business_type}
            </p>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-gray-900">
            Welcome back, {getDisplayName()}
          </h1>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Business Switcher */}
        <BusinessSwitcher onCreateNew={handleCreateBusiness} />

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-semibold text-white">
              {getInitials()}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg border bg-white shadow-lg">
                <div className="border-b p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <div className="p-1">
                  <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t p-1">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
