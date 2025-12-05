import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

interface ContactTabProps {
  formData: {
    contact_info: {
      address: string;
      email: string;
      website: string;
      office_phone: string;
      emergency_line: string;
    };
  };
  updateNestedField: (parent: string, field: string, value: any) => void;
}

export default function ContactTab({
  formData,
  updateNestedField,
}: ContactTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
            </label>
            <Input
              type="email"
              value={formData.contact_info.email}
              onChange={(e) =>
                updateNestedField("contact_info", "email", e.target.value)
              }
              placeholder="contact@business.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Office Phone
              </div>
            </label>
            <Input
              type="tel"
              value={formData.contact_info.office_phone}
              onChange={(e) =>
                updateNestedField(
                  "contact_info",
                  "office_phone",
                  e.target.value
                )
              }
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Line
              </div>
            </label>
            <Input
              type="tel"
              value={formData.contact_info.emergency_line}
              onChange={(e) =>
                updateNestedField(
                  "contact_info",
                  "emergency_line",
                  e.target.value
                )
              }
              placeholder="(555) 999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </div>
            </label>
            <Input
              type="url"
              value={formData.contact_info.website}
              onChange={(e) =>
                updateNestedField("contact_info", "website", e.target.value)
              }
              placeholder="https://yourbusiness.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Physical Address
              </div>
            </label>
            <Input
              value={formData.contact_info.address}
              onChange={(e) =>
                updateNestedField("contact_info", "address", e.target.value)
              }
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
