"use client";

import React, { useEffect, useState, useRef } from "react";
import { useBusiness } from "@/hooks/use-business";
import { useBusinessInfo } from "@/hooks/use-buisiness-info/use-business-info";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Settings,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Plus,
  X,
  Trash2,
  Upload,
  File,
} from "lucide-react";
import { api } from "@/lib/api";

export default function BusinessSettingsPage() {
  const { activeBusiness } = useBusiness();
  const {
    business,
    lastUpdateResponse,
    isLoading,
    error,
    getBusiness,
    updateBusiness,
    clearError,
    refresh,
  } = useBusinessInfo();

  const [activeTab, setActiveTab] = useState<
    "profile" | "services" | "documents" | "contact"
  >("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state - only for Business model fields
  const [formData, setFormData] = useState({
    name: "",
    business_type: "",
    timezone: "",
    ai_instructions: "",
    business_profile: {
      description: "",
    },
    contact_info: {
      address: "",
      email: "",
      website: "",
      office_phone: "",
      emergency_line: "",
    },
  });

  // Service form
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    price_display: "",
    duration: "",
  });

  // Document form
  const [newDocument, setNewDocument] = useState({
    title: "",
    doc_type: "note",
    content: "",
  });

  // Onboarding step completion mutation
  const markStepCompleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/v1/dashboard/businesses/${activeBusiness?.id}/onboarding/complete`,
        {
          step_id: "business_knowledge",
        }
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Business knowledge step marked as complete");
    },
    onError: (error: any) => {
      console.error("Failed to mark step complete:", error);
    },
  });

  // Check if all required fields are completed
  const isBusinessComplete = () => {
    return (
      services.length > 0 && // At least 1 service
      documents.length > 0 && // At least 1 document
      formData.business_profile.description.trim() !== "" && // Business description
      (formData.contact_info.email.trim() !== "" ||
        formData.contact_info.office_phone.trim() !== "" ||
        formData.contact_info.address.trim() !== "") // At least one contact field
    );
  };

  // Load business data
  useEffect(() => {
    if (activeBusiness) {
      getBusiness();
      loadServices();
      loadDocuments();
    }
  }, [activeBusiness]);

  // Update form when business data loads
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        business_type: business.business_type || "",
        timezone: business.timezone || "",
        ai_instructions: business.ai_instructions || "",
        business_profile: {
          description: business.business_profile?.description || "",
        },
        contact_info: {
          address: business.contact_info?.address || "",
          email: business.contact_info?.email || "",
          website: business.contact_info?.website || "",
          office_phone: business.contact_info?.office_phone || "",
          emergency_line: business.contact_info?.emergency_line || "",
        },
      });
    }
  }, [business]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccessMessage(false);

    try {
      await updateBusiness(formData);
      setHasChanges(false);
      setShowSuccessMessage(true);

      // Check if all requirements are met and mark step as complete
      if (isBusinessComplete()) {
        markStepCompleteMutation.mutate();
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as typeof prev));
    setHasChanges(true);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [field]: value,
          },
        } as typeof prev)
    );
    setHasChanges(true);
  };

  // Service handlers
  const handleCreateService = async () => {
    if (!newService.name.trim() || !activeBusiness?.id) return;

    try {
      await api.post("/v1/dashboard/services/", {
        business_id: activeBusiness.id,
        name: newService.name,
        description: newService.description,
        price: newService.price ? parseFloat(newService.price) : null,
        price_display: newService.price_display,
        duration: newService.duration ? parseInt(newService.duration) : null,
        display_order: services.length,
      });

      setNewService({
        name: "",
        description: "",
        price: "",
        price_display: "",
        duration: "",
      });
      await loadServices();
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const response = await api.get(
        `/v1/dashboard/services/business/${activeBusiness?.id}`
      );
      setServices(response.data.services || response.data || []);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/v1/dashboard/services/${serviceId}`);
      await loadServices();
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  // File handling functions
  const handleFileUpload = async (file: File) => {
    if (!activeBusiness?.id) return;

    setUploadingFile(true);
    try {
      // Read file content
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target?.result as string;

        // Determine document type based on file extension
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        let docType = "general";
        if (fileExt === "pdf") docType = "pdf";
        else if (["txt", "md"].includes(fileExt || "")) docType = "note";

        // Create document with file content
        await api.post("/v1/dashboard/documents/", {
          business_id: activeBusiness.id,
          title: file.name,
          type: docType,
          content: content,
          related_service_id: null,
        });

        await loadDocuments();
      };

      // Read as text for text files, as base64 for others
      if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md")
      ) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Failed to upload file:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await handleFileUpload(file);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateDocument = async () => {
    if (
      !newDocument.title.trim() ||
      !newDocument.content.trim() ||
      !activeBusiness?.id
    )
      return;

    try {
      await api.post("/v1/dashboard/documents/", {
        business_id: activeBusiness.id,
        title: newDocument.title,
        type: newDocument.doc_type,
        content: newDocument.content,
        related_service_id: null,
      });

      setNewDocument({ title: "", doc_type: "note", content: "" });
      await loadDocuments();
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  };

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await api.get(
        `/v1/dashboard/documents/business/${activeBusiness?.id}`
      );
      setDocuments(response.data.documents || response.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/v1/dashboard/documents/${docId}`);
      await loadDocuments();
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const tabs = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "contact", label: "Contact Info", icon: Phone },
  ];

  // Check if business is selected first
  if (!activeBusiness) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Business Selected
          </h3>
          <p className="text-gray-600">
            Please select a business to manage settings.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!business && isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading business settings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!business) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Business not found
          </h3>
          <p className="text-gray-600">Unable to load business information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Business Settings
          </h1>
          <p className="text-gray-600">
            Manage your business information for {activeBusiness.name}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || !isBusinessComplete()}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && lastUpdateResponse && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-900 font-medium">
                  Changes saved successfully!
                </p>
                {isBusinessComplete() && (
                  <p className="text-green-700 text-sm mt-1">
                    ✨ Your business setup is complete!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Requirements Info */}
      {!isBusinessComplete() && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-900 font-medium mb-2">
                  Complete your business setup
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  {services.length === 0 && (
                    <li className="flex items-center gap-2">
                      <XCircle className="h-3 w-3" />
                      Add at least one service
                    </li>
                  )}
                  {documents.length === 0 && (
                    <li className="flex items-center gap-2">
                      <XCircle className="h-3 w-3" />
                      Add at least one document
                    </li>
                  )}
                  {!formData.business_profile.description.trim() && (
                    <li className="flex items-center gap-2">
                      <XCircle className="h-3 w-3" />
                      Add a business description
                    </li>
                  )}
                  {!formData.contact_info.email.trim() &&
                    !formData.contact_info.office_phone.trim() &&
                    !formData.contact_info.address.trim() && (
                      <li className="flex items-center gap-2">
                        <XCircle className="h-3 w-3" />
                        Add at least one contact method
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content - Profile */}
      {activeTab === "profile" && (
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
                    onChange={(e) =>
                      updateFormField("timezone", e.target.value)
                    }
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
                onChange={(e) =>
                  updateFormField("ai_instructions", e.target.value)
                }
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
      )}

      {/* Tab Content - Services */}
      {activeTab === "services" && (
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Service Form */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">
                Add New Service
              </h3>
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
                  onClick={handleCreateService}
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
                    <h4 className="font-medium text-gray-900">
                      {service.name}
                    </h4>
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
                    onClick={() => handleDeleteService(service.id)}
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
      )}

      {/* Tab Content - Documents */}
      {activeTab === "documents" && (
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }
                ${uploadingFile ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.txt,.md,.doc,.docx"
              />

              {uploadingFile ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
                  <p className="text-gray-700 font-medium">Uploading file...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-gray-700 font-medium">
                      Drop files here or{" "}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports PDF, TXT, MD, DOC, DOCX files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Document Entry */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">
                Or Add Document Manually
              </h3>
              <div className="space-y-3">
                <Input
                  value={newDocument.title}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, title: e.target.value })
                  }
                  placeholder="Document Title"
                />
                <select
                  value={newDocument.doc_type}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, doc_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="note">Note</option>
                  <option value="policy">Policy</option>
                  <option value="faq">FAQ</option>
                  <option value="guide">Guide</option>
                  <option value="pdf">PDF</option>
                  <option value="general">General</option>
                </select>
                <textarea
                  value={newDocument.content}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Document Content"
                />
                <Button
                  onClick={handleCreateDocument}
                  disabled={
                    !newDocument.title.trim() || !newDocument.content.trim()
                  }
                  className="gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Document
                </Button>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              {loadingDocuments && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
                  <p className="text-gray-600 mt-2">Loading documents...</p>
                </div>
              )}

              {!loadingDocuments &&
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <File className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {doc.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Type: {doc.type}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {!loadingDocuments && documents.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents added yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload files or create documents manually above
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content - Contact */}
      {activeTab === "contact" && (
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
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="border-orange-200 bg-orange-50 shadow-lg">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-orange-900 font-medium">Unsaved Changes</p>
                  <p className="text-orange-700 text-sm">
                    Don't forget to save your changes
                  </p>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className="ml-4"
                >
                  {isSaving ? "Saving..." : "Save Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
