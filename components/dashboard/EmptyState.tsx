"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Plus, Sparkles, Users, BarChart3 } from "lucide-react";

interface EmptyStateProps {
  onCreateBusiness?: () => void;
}

export function EmptyState({ onCreateBusiness }: EmptyStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to VoxioDesk!</CardTitle>
            <CardDescription className="text-base">
              Let's get started by creating your first business
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Automate customer communication with intelligent responses
                </p>
              </div>

              <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Team Management</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Invite team members and manage roles effortlessly
                </p>
              </div>

              <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Track performance with detailed insights and reports
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                onClick={onCreateBusiness}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Business
              </Button>

              <p className="text-xs text-gray-500">
                You can add more businesses later from the settings
              </p>
            </div>

            {/* Help Section */}
            <div className="rounded-lg border bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
                What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    1
                  </span>
                  <span>
                    Enter your business details and contact information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    2
                  </span>
                  <span>Configure your services and AI assistant settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                    3
                  </span>
                  <span>
                    Start managing appointments and customer interactions
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
