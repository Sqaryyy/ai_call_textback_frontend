// ============================================================================
// FILE: app/dashboard/page.tsx
// Updated to navigate to /onboarding instead of modal
// ============================================================================

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBusiness } from "@/hooks/use-business";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { getDisplayName } = useAuth();
  const { activeBusiness, hasBusinesses } = useBusiness();

  const handleCreateBusiness = () => {
    router.push("/onboarding");
  };

  // Show empty state if user has no businesses
  if (!hasBusinesses()) {
    return <EmptyState onCreateBusiness={handleCreateBusiness} />;
  }

  // Show empty state if no active business is selected
  if (!activeBusiness) {
    return <EmptyState onCreateBusiness={handleCreateBusiness} />;
  }

  // Dashboard with business data
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {getDisplayName()}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with {activeBusiness.name} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Appointments Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-600 mt-1">
              8 completed, 16 remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-blue-600 mt-1">12 unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5m</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              30s faster than avg
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New appointment booked",
                  customer: "John Doe",
                  time: "5 minutes ago",
                },
                {
                  action: "Message received",
                  customer: "Jane Smith",
                  time: "15 minutes ago",
                },
                {
                  action: "Appointment completed",
                  customer: "Mike Johnson",
                  time: "1 hour ago",
                },
                {
                  action: "New customer registered",
                  customer: "Sarah Williams",
                  time: "2 hours ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">{activity.customer}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  customer: "Alice Brown",
                  service: "Hair Cut",
                  time: "10:00 AM",
                },
                {
                  customer: "Bob Wilson",
                  service: "Color Treatment",
                  time: "11:30 AM",
                },
                {
                  customer: "Carol Davis",
                  service: "Styling",
                  time: "2:00 PM",
                },
                {
                  customer: "David Lee",
                  service: "Consultation",
                  time: "3:30 PM",
                },
              ].map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-semibold text-blue-600">
                    {appointment.customer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.customer}
                    </p>
                    <p className="text-xs text-gray-600">
                      {appointment.service}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
