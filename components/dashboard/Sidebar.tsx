"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_ROUTES } from "@/config/routes";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  Settings,
  Building2,
  Code2,
  Store,
  Calendar,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  {
    name: "Overview",
    href: DASHBOARD_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Business Info",
    href: DASHBOARD_ROUTES.BUSINESS_INFO,
    icon: Store,
  },
  {
    name: "Analytics",
    href: DASHBOARD_ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    name: "Conversations",
    href: DASHBOARD_ROUTES.CONVERSATIONS,
    icon: FolderKanban,
  },
  {
    name: "Calendars",
    href: DASHBOARD_ROUTES.CALENDARS,
    icon: Calendar,
  },
  {
    name: "Team",
    href: DASHBOARD_ROUTES.TEAM,
    icon: Users,
  },
  {
    name: "Webhooks",
    href: DASHBOARD_ROUTES.WEBHOOKS,
    icon: Code2,
  },
  {
    name: "Settings",
    href: DASHBOARD_ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VoxioDesk
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Need Help?</h3>
          <p className="mt-1 text-xs text-gray-600">
            Check out our documentation and guides
          </p>
          <button className="mt-3 w-full rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
}
