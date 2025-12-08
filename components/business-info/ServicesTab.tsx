import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  GripVertical,
} from "lucide-react";
import {
  Service,
  CreateServiceRequest,
  BookingType,
} from "@/hooks/use-buisiness-info/use-services";

interface ServicesTabProps {
  businessId: string;
  services: Service[];
  onCreateService: (service: CreateServiceRequest) => Promise<void>;
  onDeleteService: (serviceId: string, hardDelete?: boolean) => Promise<void>;
  onUpdateService?: (serviceId: string, updates: any) => Promise<void>;
  onReorderService?: (serviceId: string, newOrder: number) => Promise<void>;
}

export default function ServicesTab({
  businessId,
  services,
  onCreateService,
  onDeleteService,
  onUpdateService,
  onReorderService,
}: ServicesTabProps) {
  const [newService, setNewService] = useState<CreateServiceRequest>({
    business_id: businessId,
    name: "",
    description: "",
    price: null,
    price_display: "",
    duration: null,
    booking_type: "direct",
    consultation_duration: null,
    consultation_price: null,
    required_fields: [
      { field: "name", label: "Name", type: "text", required: true },
      { field: "email", label: "Email", type: "text", required: true },
      { field: "phone", label: "Phone", type: "text", required: true },
    ],
    display_order: 0,
  });

  const handleCreate = async () => {
    if (!newService.name.trim()) return;

    await onCreateService({
      ...newService,
      business_id: businessId,
    });

    // Reset form
    setNewService({
      business_id: businessId,
      name: "",
      description: "",
      price: null,
      price_display: "",
      duration: null,
      booking_type: "direct",
      consultation_duration: null,
      consultation_price: null,
      required_fields: [
        { field: "name", label: "Name", type: "text", required: true },
        { field: "email", label: "Email", type: "text", required: true },
        { field: "phone", label: "Phone", type: "text", required: true },
      ],
      display_order: 0,
    });
  };

  const getBookingTypeLabel = (type: BookingType) => {
    switch (type) {
      case "direct":
        return "Direct Booking";
      case "consultation_required":
        return "Consultation Required";
      case "lead_only":
        return "Lead Only";
      default:
        return type;
    }
  };

  const getBookingTypeBadgeColor = (type: BookingType) => {
    switch (type) {
      case "direct":
        return "bg-green-100 text-green-700";
      case "consultation_required":
        return "bg-blue-100 text-blue-700";
      case "lead_only":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Service Form */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-4">Add New Service</h3>
          <div className="grid gap-4">
            {/* Basic Info */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name *</Label>
                <Input
                  id="service-name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  placeholder="e.g., Kitchen Remodel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-type">Booking Type</Label>
                <Select
                  value={newService.booking_type}
                  onValueChange={(value: BookingType) =>
                    setNewService({ ...newService, booking_type: value })
                  }
                >
                  <SelectTrigger id="booking-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Booking</SelectItem>
                    <SelectItem value="consultation_required">
                      Consultation Required
                    </SelectItem>
                    <SelectItem value="lead_only">Lead Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={newService.description || ""}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                placeholder="Describe your service..."
                rows={3}
              />
            </div>

            {/* Pricing */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-price">Price ($)</Label>
                <Input
                  id="service-price"
                  value={newService.price || ""}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="99.99"
                  type="number"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-display">Price Display</Label>
                <Input
                  id="price-display"
                  value={newService.price_display || ""}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      price_display: e.target.value,
                    })
                  }
                  placeholder="e.g., Starting at $5,000"
                />
              </div>
            </div>

            {/* Duration */}
            {newService.booking_type === "direct" && (
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duration (minutes)</Label>
                <Input
                  id="service-duration"
                  value={newService.duration || ""}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      duration: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="60"
                  type="number"
                />
              </div>
            )}

            {/* Consultation Fields */}
            {newService.booking_type === "consultation_required" && (
              <div className="grid gap-3 md:grid-cols-2 p-3 bg-blue-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="consultation-duration">
                    Consultation Duration (minutes) *
                  </Label>
                  <Input
                    id="consultation-duration"
                    value={newService.consultation_duration || ""}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        consultation_duration: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="30"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation-price">
                    Consultation Price ($)
                  </Label>
                  <Input
                    id="consultation-price"
                    value={newService.consultation_price || ""}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        consultation_price: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="0 (usually free)"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {/* Required Fields */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold">
                    Required Fields for Booking
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Information to collect from customers via SMS
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNewService({
                      ...newService,
                      required_fields: [
                        ...(newService.required_fields || []),
                        { field: "", label: "", type: "text", required: true },
                      ],
                    });
                  }}
                  className="gap-1.5 h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-2">
                {(newService.required_fields || []).map((field, index) => (
                  <div
                    key={index}
                    className="group flex gap-3 items-center px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex-1">
                      <Input
                        value={field.label || ""}
                        onChange={(e) => {
                          const label = e.target.value;
                          // Auto-generate field name from label
                          const fieldName = label
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "_")
                            .replace(/^_+|_+$/g, "");

                          const updated = [
                            ...(newService.required_fields || []),
                          ];
                          updated[index] = {
                            ...updated[index],
                            label: label,
                            field: fieldName,
                          };
                          setNewService({
                            ...newService,
                            required_fields: updated,
                          });
                        }}
                        placeholder="e.g., Budget Range, Project Timeline"
                        className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto text-sm font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const updated = [
                              ...(newService.required_fields || []),
                            ];
                            updated[index] = {
                              ...updated[index],
                              required: e.target.checked,
                            };
                            setNewService({
                              ...newService,
                              required_fields: updated,
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 font-medium">
                          Required
                        </span>
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const updated = (
                            newService.required_fields || []
                          ).filter((_, i) => i !== index);
                          setNewService({
                            ...newService,
                            required_fields: updated,
                          });
                        }}
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {(newService.required_fields || []).length === 0 && (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">
                      No custom fields added yet
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Default fields (Name, Email, Phone) will be collected
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={!newService.name.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Drag Handle (if reorder is supported) */}
              {onReorderService && (
                <div className="flex items-center pt-2">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                </div>
              )}

              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                <Briefcase className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getBookingTypeBadgeColor(
                      service.booking_type
                    )}`}
                  >
                    {getBookingTypeLabel(service.booking_type)}
                  </span>
                </div>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {service.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {service.formatted_price && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {service.formatted_price}
                    </span>
                  )}
                  {service.formatted_duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.formatted_duration}
                    </span>
                  )}
                  {service.booking_type === "consultation_required" &&
                    service.formatted_consultation_duration && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock className="h-3 w-3" />
                        Consultation: {service.formatted_consultation_duration}
                      </span>
                    )}
                  {service.required_fields.length > 0 && (
                    <span className="text-indigo-600">
                      {service.required_fields.length} required field
                      {service.required_fields.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {service.linked_documents_count > 0 && (
                    <span className="text-purple-600">
                      {service.linked_documents_count} document
                      {service.linked_documents_count !== 1 ? "s" : ""}
                    </span>
                  )}
                  {!service.is_active && (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteService(service.id, false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {services.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No services added yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Add your first service to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
