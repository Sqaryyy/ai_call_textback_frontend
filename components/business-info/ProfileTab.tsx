import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProfileTabProps {
  formData: {
    name: string;
    business_type: string;
    timezone: string;
    ai_instructions: string;
    business_profile: {
      description: string;
    };
  };
  updateFormField: (field: string, value: any) => void;
  updateNestedField: (parent: string, field: string, value: any) => void;
}

export default function ProfileTab({
  formData,
  updateFormField,
  updateNestedField,
}: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <Input
                value={formData.business_type}
                onChange={(e) =>
                  updateFormField("business_type", e.target.value)
                }
                placeholder="e.g., Plumbing, HVAC, Cleaning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <Input
                value={formData.timezone}
                onChange={(e) => updateFormField("timezone", e.target.value)}
                placeholder="UTC"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              value={formData.business_profile.description}
              onChange={(e) =>
                updateNestedField(
                  "business_profile",
                  "description",
                  e.target.value
                )
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what your business does..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={formData.ai_instructions}
            onChange={(e) => updateFormField("ai_instructions", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Special instructions for how the AI should handle conversations..."
          />
          <p className="text-xs text-gray-500 mt-2">
            These instructions will guide how your AI assistant communicates
            with customers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
