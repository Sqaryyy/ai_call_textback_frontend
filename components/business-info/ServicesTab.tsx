import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  price_display?: string;
  duration?: number;
}

interface ServicesTabProps {
  services: Service[];
  onCreateService: (service: {
    name: string;
    description: string;
    price: string;
    price_display: string;
    duration: string;
  }) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
}

export default function ServicesTab({
  services,
  onCreateService,
  onDeleteService,
}: ServicesTabProps) {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    price_display: "",
    duration: "",
  });

  const handleCreate = async () => {
    if (!newService.name.trim()) return;
    await onCreateService(newService);
    setNewService({
      name: "",
      description: "",
      price: "",
      price_display: "",
      duration: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Service Form */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Add New Service</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              placeholder="Service Name"
            />
            <Input
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              placeholder="Price (e.g., 99.99)"
              type="number"
              step="0.01"
            />
            <Input
              value={newService.price_display}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  price_display: e.target.value,
                })
              }
              placeholder="Price Display (e.g., Starting at $99)"
            />
            <Input
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
              placeholder="Duration (minutes)"
              type="number"
            />
            <Input
              value={newService.description}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="md:col-span-2"
            />
            <Button
              onClick={handleCreate}
              disabled={!newService.name.trim()}
              className="gap-2 md:col-span-2"
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
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  {service.price && (
                    <span className="flex items-center gap-1">
                      ${service.price}
                    </span>
                  )}
                  {service.duration && (
                    <span className="flex items-center gap-1">
                      {service.duration}m
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteService(service.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {services.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No services added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
