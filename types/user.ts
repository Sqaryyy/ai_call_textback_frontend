// types/user.ts

import { Business } from "./business";

/**
 * Platform-level user roles
 * Matches backend PlatformRole enum
 */
export enum PlatformRole {
  ADMIN = "admin", // Platform admin - can create platform invites
  USER = "user",   // Regular user - can own/join businesses
}

/**
 * User roles within a specific business
 * Matches backend BusinessRole enum
 */
export enum BusinessRole {
  OWNER = "owner",
  MEMBER = "member",
}

/**
 * Association between user and business with role
 * Matches backend user_businesses table
 */
export interface UserBusinessAssociation {
  id: string;
  user_id: string;
  business_id: string;
  role: BusinessRole;
  created_at: string;
}

/**
 * Main User type
 * Matches backend User model
 */
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: PlatformRole;
  active_business_id: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  
  // Populated relationships (when included by backend)
  businesses?: Business[];
  active_business?: Business | null;
}

/**
 * Helper type for user with business role context
 * Used when we need to know the user's role in a specific business
 */
export interface UserWithBusinessRole extends User {
  business_role: BusinessRole;
}