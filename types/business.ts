// types/business.ts

/**
 * Business hours for a specific day
 * Matches backend BusinessHours model
 */
export interface BusinessHours {
  id: number;
  business_id: string;
  day_of_week: number; // 0=Monday, 6=Sunday
  open_time: string;   // HH:MM format
  close_time: string;  // HH:MM format
  is_closed: boolean;
}

/**
 * Business personality and tone configuration
 * Stored in business_profile JSON field
 */
export interface BusinessProfile {
  personality?: string;
  tone?: string;
  booking_flow_type?: string;
  brand_voice?: string;
  greeting_style?: string;
}

/**
 * Service definition in the catalog
 * Stored in service_catalog JSON field
 */
export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  duration_minutes?: number;
  price?: number;
  currency?: string;
  is_active: boolean;
  category?: string;
}

/**
 * Service catalog structure
 */
export interface ServiceCatalog {
  services: ServiceDefinition[];
  categories?: string[];
}

/**
 * Conversation policies and business rules
 * Stored in conversation_policies JSON field
 */
export interface ConversationPolicies {
  cancellation_policy?: string;
  reschedule_policy?: string;
  deposit_required?: boolean;
  deposit_amount?: number;
  max_booking_advance_days?: number;
  min_booking_notice_hours?: number;
  auto_confirm?: boolean;
}

/**
 * Quick responses for FAQ
 * Stored in quick_responses JSON field
 */
export interface QuickResponses {
  [key: string]: string; // question -> answer mapping
}

/**
 * Contact information structure
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

/**
 * Webhook configuration
 */
export interface WebhookUrls {
  booking_created?: string;
  booking_cancelled?: string;
  booking_completed?: string;
}

/**
 * Booking settings
 */
export interface BookingSettings {
  require_deposit?: boolean;
  allow_online_payment?: boolean;
  payment_methods?: string[];
  buffer_time_minutes?: number;
  max_bookings_per_day?: number;
}

/**
 * Onboarding status tracking
 */
export interface OnboardingStatus {
  completed: boolean;
  steps_completed: string[];
  current_step?: string;
  completed_at?: string;
}

/**
 * Main Business type
 * Matches backend Business model
 */
export interface Business {
  role: any;
  id: string;
  name: string;
  phone_number: string;
  business_type: string;
  
  // Structured JSON fields
  business_profile: BusinessProfile;
  service_catalog: ServiceCatalog;
  conversation_policies: ConversationPolicies;
  quick_responses: QuickResponses;
  
  // Legacy/simple fields
  services: string[]; // Simple list for backward compatibility
  timezone: string;
  contact_info: ContactInfo;
  ai_instructions: string;
  
  // Technical fields
  webhook_urls: WebhookUrls;
  booking_settings: BookingSettings;
  onboarding_status: OnboardingStatus;
  
  // Metadata
  created_at: string;
  updated_at: string;
  is_active: boolean;
  
  // Populated relationships (when included)
  business_hours?: BusinessHours[];
}

/**
 * Request type for creating a new business
 */
export interface CreateBusinessRequest {
  name: string;
  phone_number: string;
  business_type: string;
  timezone?: string;
  contact_info?: ContactInfo;
}

/**
 * Request type for updating a business
 */
export interface UpdateBusinessRequest {
  name?: string;
  phone_number?: string;
  business_type?: string;
  business_profile?: Partial<BusinessProfile>;
  service_catalog?: Partial<ServiceCatalog>;
  conversation_policies?: Partial<ConversationPolicies>;
  quick_responses?: QuickResponses;
  timezone?: string;
  contact_info?: Partial<ContactInfo>;
  ai_instructions?: string;
  webhook_urls?: Partial<WebhookUrls>;
  booking_settings?: Partial<BookingSettings>;
  is_active?: boolean;
  role?: string;
}