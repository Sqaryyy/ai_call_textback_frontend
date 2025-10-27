"use client";

import React, { useEffect, useState } from "react";
import { useBusiness } from "@/hooks/use-business";
import { useBusinessInfo } from "@/hooks/use-business-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  MessageSquare,
  Briefcase,
  Settings,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  FileText,
  Users,
  Tag,
  Plus,
  X,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BusinessSettingsPage() {
  const { activeBusiness } = useBusiness();
  const {
    business,
    knowledgeStats,
    lastUpdateResponse,
    isLoading,
    error,
    getBusiness,
    updateBusiness,
    reindexKnowledge,
    getKnowledgeStats,
    clearError,
    refresh,
  } = useBusinessInfo();

  const [activeTab, setActiveTab] = useState<
    "profile" | "services" | "faqs" | "contact" | "policies"
  >("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    business_type: "",
    timezone: "",
    ai_instructions: "",
    business_profile: {
      description: "",
      areas_served: [] as string[],
      specialties: [] as string[],
    },
    contact_info: {
      address: "",
      email: "",
      website: "",
      office_phone: "",
      emergency_line: "",
    },
    service_catalog: {} as Record<string, any>,
    quick_responses: {} as Record<string, string>,
    conversation_policies: {} as Record<string, string>,
  });

  // Temp inputs for adding items
  const [newArea, setNewArea] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newPolicy, setNewPolicy] = useState({ key: "", value: "" });

  // Load business data only when activeBusiness is available
  useEffect(() => {
    if (activeBusiness) {
      refresh();
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
          areas_served: business.business_profile?.areas_served || [],
          specialties: business.business_profile?.specialties || [],
        },
        contact_info: {
          address: business.contact_info?.address || "",
          email: business.contact_info?.email || "",
          website: business.contact_info?.website || "",
          office_phone: business.contact_info?.office_phone || "",
          emergency_line: business.contact_info?.emergency_line || "",
        },
        service_catalog: business.service_catalog || {},
        quick_responses: business.quick_responses || {},
        conversation_policies: business.conversation_policies || {},
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
      const response = await updateBusiness(formData);
      setHasChanges(false);
      setShowSuccessMessage(true);

      // Refresh stats if reindex was triggered
      if (response.reindex_result.triggered) {
        await getKnowledgeStats();
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualReindex = async () => {
    setIsReindexing(true);
    try {
      await reindexKnowledge(true);
      await getKnowledgeStats();
    } catch (err) {
      console.error("Failed to reindex:", err);
    } finally {
      setIsReindexing(false);
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

  // Handlers for arrays
  const addArea = () => {
    if (newArea.trim()) {
      setFormData((prev) => ({
        ...prev,
        business_profile: {
          ...prev.business_profile,
          areas_served: [...prev.business_profile.areas_served, newArea.trim()],
        },
      }));
      setNewArea("");
      setHasChanges(true);
    }
  };

  const removeArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      business_profile: {
        ...prev.business_profile,
        areas_served: prev.business_profile.areas_served.filter(
          (_, i) => i !== index
        ),
      },
    }));
    setHasChanges(true);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        business_profile: {
          ...prev.business_profile,
          specialties: [
            ...prev.business_profile.specialties,
            newSpecialty.trim(),
          ],
        },
      }));
      setNewSpecialty("");
      setHasChanges(true);
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      business_profile: {
        ...prev.business_profile,
        specialties: prev.business_profile.specialties.filter(
          (_, i) => i !== index
        ),
      },
    }));
    setHasChanges(true);
  };

  const addService = () => {
    if (newService.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        service_catalog: {
          ...prev.service_catalog,
          [newService.name]: {
            description: newService.description,
            price: newService.price,
            duration: newService.duration
              ? parseInt(newService.duration)
              : undefined,
          },
        },
      }));
      setNewService({ name: "", description: "", price: "", duration: "" });
      setHasChanges(true);
    }
  };

  const removeService = (serviceName: string) => {
    setFormData((prev) => {
      const updated = { ...prev.service_catalog };
      delete updated[serviceName];
      return { ...prev, service_catalog: updated };
    });
    setHasChanges(true);
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFormData((prev) => ({
        ...prev,
        quick_responses: {
          ...prev.quick_responses,
          [newFaq.question]: newFaq.answer,
        },
      }));
      setNewFaq({ question: "", answer: "" });
      setHasChanges(true);
    }
  };

  const removeFaq = (question: string) => {
    setFormData((prev) => {
      const updated = { ...prev.quick_responses };
      delete updated[question];
      return { ...prev, quick_responses: updated };
    });
    setHasChanges(true);
  };

  const addPolicy = () => {
    if (newPolicy.key.trim() && newPolicy.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        conversation_policies: {
          ...prev.conversation_policies,
          [newPolicy.key]: newPolicy.value,
        },
      }));
      setNewPolicy({ key: "", value: "" });
      setHasChanges(true);
    }
  };

  const removePolicy = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.conversation_policies };
      delete updated[key];
      return { ...prev, conversation_policies: updated };
    });
    setHasChanges(true);
  };

  const tabs = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "faqs", label: "FAQs", icon: MessageSquare },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "policies", label: "Policies", icon: FileText },
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
          <Button onClick={() => refresh()} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
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
            Manage your business information and AI knowledge for{" "}
            {activeBusiness.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refresh()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
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
                <p className="text-green-700 text-sm mt-1">
                  Updated fields:{" "}
                  {lastUpdateResponse.changes_detected.join(", ")}
                </p>
                {lastUpdateResponse.reindex_result.triggered && (
                  <p className="text-green-700 text-sm mt-1">
                    {lastUpdateResponse.reindex_result.success ? (
                      <>
                        ✓ AI knowledge updated (
                        {lastUpdateResponse.reindex_result.indexed_count} items
                        indexed in{" "}
                        {lastUpdateResponse.reindex_result.duration_ms}ms)
                      </>
                    ) : (
                      <>✗ AI knowledge update failed</>
                    )}
                  </p>
                )}
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

      {/* Knowledge Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Knowledge
            </CardTitle>
            <Sparkles className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {knowledgeStats?.total_chunks || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Indexed items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Services
            </CardTitle>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {knowledgeStats?.category_breakdown?.service_info || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Service items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              FAQs
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {knowledgeStats?.category_breakdown?.faq || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">FAQ items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last Indexed
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {knowledgeStats?.last_indexed
                ? formatDistanceToNow(new Date(knowledgeStats.last_indexed), {
                    addSuffix: true,
                  })
                : "Never"}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full text-xs"
              onClick={handleManualReindex}
              disabled={isReindexing}
            >
              {isReindexing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Reindexing...
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  Reindex Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

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
              <CardTitle>Service Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addArea()}
                  placeholder="Add a service area (e.g., Brooklyn)"
                />
                <Button onClick={addArea} disabled={!newArea.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.business_profile.areas_served.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                  >
                    <MapPin className="h-3 w-3" />
                    {area}
                    <button
                      onClick={() => removeArea(index)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                  placeholder="Add a specialty (e.g., Emergency Repairs)"
                />
                <Button onClick={addSpecialty} disabled={!newSpecialty.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.business_profile.specialties.map(
                  (specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                    >
                      <Tag className="h-3 w-3" />
                      {specialty}
                      <button
                        onClick={() => removeSpecialty(index)}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                )}
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
            <CardTitle>Service Catalog</CardTitle>
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
                  placeholder="Price (e.g., $150 or Free)"
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
                <Input
                  type="number"
                  value={newService.duration}
                  onChange={(e) =>
                    setNewService({ ...newService, duration: e.target.value })
                  }
                  placeholder="Duration (minutes)"
                />
                <Button
                  onClick={addService}
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
              {Object.entries(formData.service_catalog).map(
                ([serviceName, serviceData]) => (
                  <div
                    key={serviceName}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">
                        {serviceName}
                      </h4>
                      {serviceData.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {serviceData.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {serviceData.price && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {serviceData.price}
                          </span>
                        )}
                        {serviceData.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {serviceData.duration} min
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeService(serviceName)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}

              {Object.keys(formData.service_catalog).length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No services added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "faqs" && (
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add FAQ Form */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Add New FAQ</h3>
              <div className="space-y-3">
                <Input
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                  placeholder="Customer Question"
                />
                <textarea
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Answer"
                />
                <Button
                  onClick={addFaq}
                  disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                  className="gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>
            </div>

            {/* FAQs List */}
            <div className="space-y-3">
              {Object.entries(formData.quick_responses).map(
                ([question, answer]) => (
                  <div
                    key={question}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <h4 className="font-medium text-gray-900">
                            {question}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">{answer}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFaq(question)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}

              {Object.keys(formData.quick_responses).length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No FAQs added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

      {activeTab === "policies" && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Policy Form */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Add New Policy</h3>
              <div className="space-y-3">
                <Input
                  value={newPolicy.key}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, key: e.target.value })
                  }
                  placeholder="Policy Name (e.g., cancellation_policy)"
                />
                <textarea
                  value={newPolicy.value}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, value: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Policy Details"
                />
                <Button
                  onClick={addPolicy}
                  disabled={!newPolicy.key.trim() || !newPolicy.value.trim()}
                  className="gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Policy
                </Button>
              </div>
            </div>

            {/* Policies List */}
            <div className="space-y-3">
              {Object.entries(formData.conversation_policies).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <FileText className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h4>
                            <p className="text-xs text-gray-500 font-mono">
                              {key}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">{value}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removePolicy(key)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}

              {Object.keys(formData.conversation_policies).length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No policies added yet</p>
                </div>
              )}
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
