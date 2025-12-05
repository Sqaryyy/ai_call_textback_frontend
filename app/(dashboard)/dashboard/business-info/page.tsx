"use client";
import React, { useEffect, useState } from "react";
import { useBusiness } from "@/hooks/use-business";
import { useBusinessInfo } from "@/hooks/use-business-info";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Phone,
  Briefcase,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import ProfileTab from "@/components/business-info/ProfileTab";
import ServicesTab from "@/components/business-info/ServicesTab";
import DocumentsTab from "@/components/business-info/DocumentsTab";
import ContactTab from "@/components/business-info/ContactTab";

export default function BusinessSettingsPage() {
  const { activeBusiness } = useBusiness();
  const queryClient = useQueryClient();
  const {
    business,
    lastUpdateResponse,
    isLoading,
    error,
    getBusiness,
    updateBusiness,
    clearError,
  } = useBusinessInfo();

  const [activeTab, setActiveTab] = useState<
    "profile" | "services" | "documents" | "contact"
  >("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    business_type: "",
    phone_number: "",
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

  // Mutation to mark business_info step complete
  const markBusinessInfoCompleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/v1/dashboard/businesses/${activeBusiness?.id}/onboarding/complete`,
        {
          step_id: "business_info",
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness?.id],
      });
    },
  });

  // Check if business_info step is complete
  const isBusinessInfoComplete = () => {
    return (
      formData.name.trim() !== "" &&
      formData.business_type.trim() !== "" &&
      formData.contact_info.office_phone.trim() !== ""
    );
  };

  // Check if business_knowledge step is complete
  const isBusinessKnowledgeComplete = () => {
    return (
      services.length > 0 &&
      documents.length > 0 &&
      formData.business_profile.description.trim() !== "" &&
      (formData.contact_info.email.trim() !== "" ||
        formData.contact_info.office_phone.trim() !== "" ||
        formData.contact_info.address.trim() !== "")
    );
  };

  // Check if all requirements are met
  const isFullyComplete = () => {
    return isBusinessInfoComplete() && isBusinessKnowledgeComplete();
  };

  useEffect(() => {
    if (activeBusiness) {
      getBusiness();
      loadServices();
      loadDocuments();
    }
  }, [activeBusiness]);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        business_type: business.business_type || "",
        phone_number: business.phone_number || "",
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

      // Mark steps as complete based on what's filled out
      if (isBusinessInfoComplete()) {
        await markBusinessInfoCompleteMutation.mutateAsync();
      }

      if (isBusinessKnowledgeComplete()) {
        // Refetch onboarding status to update checklist
        await queryClient.invalidateQueries({
          queryKey: ["onboarding", activeBusiness?.id],
        });
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

  const loadServices = async () => {
    try {
      const response = await api.get(
        `/v1/dashboard/services/business/${activeBusiness?.id}`
      );
      setServices(response.data.services || response.data || []);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  const handleCreateService = async (newService: {
    name: string;
    description: string;
    price: string;
    price_display: string;
    duration: string;
  }) => {
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
      await loadServices();

      // Refetch onboarding status
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness?.id],
      });
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/v1/dashboard/services/${serviceId}`);
      await loadServices();
      // Refetch onboarding status
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness?.id],
      });
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await api.get(
        `/v1/dashboard/documents/business/${activeBusiness?.id}`
      );
      setDocuments(response.data.documents || response.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  };

  const handleCreateDocument = async (newDocument: {
    title: string;
    doc_type: string;
    content: string;
  }) => {
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
      await loadDocuments();

      // Refetch onboarding status
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness?.id],
      });
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/v1/dashboard/documents/${docId}`);
      await loadDocuments();
      // Refetch onboarding status
      queryClient.invalidateQueries({
        queryKey: ["onboarding", activeBusiness?.id],
      });
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
          disabled={!hasChanges || isSaving || !isFullyComplete()}
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
                {isFullyComplete() && (
                  <p className="text-green-700 text-sm mt-1">
                    ✨ Your business setup is complete!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Requirements Info - Only hide after successful save */}
      {!isFullyComplete() || hasChanges ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-900 font-medium mb-2">
                  Complete your business setup
                </p>
                <div className="space-y-3">
                  {/* Basic Info Requirements */}
                  {!isBusinessInfoComplete() && (
                    <div>
                      <p className="text-blue-800 text-sm font-medium mb-1">
                        Basic Information:
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1 ml-4">
                        {!formData.name.trim() && (
                          <li className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            Add business name
                          </li>
                        )}
                        {!formData.business_type.trim() && (
                          <li className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            Add business type
                          </li>
                        )}
                        {!formData.contact_info.office_phone.trim() && (
                          <li className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            Add phone number
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Business Knowledge Requirements */}
                  {!isBusinessKnowledgeComplete() && (
                    <div>
                      <p className="text-blue-800 text-sm font-medium mb-1">
                        Business Details:
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1 ml-4">
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
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

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

      {/* Tab Content */}
      {activeTab === "profile" && (
        <ProfileTab
          formData={formData}
          updateFormField={updateFormField}
          updateNestedField={updateNestedField}
        />
      )}

      {activeTab === "services" && (
        <ServicesTab
          services={services}
          onCreateService={handleCreateService}
          onDeleteService={handleDeleteService}
        />
      )}

      {activeTab === "documents" && (
        <DocumentsTab
          documents={documents}
          onCreateDocument={handleCreateDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

      {activeTab === "contact" && (
        <ContactTab formData={formData} updateNestedField={updateNestedField} />
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
