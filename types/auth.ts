// types/auth.ts

import { User } from "./user";

/**
 * Authentication tokens returned from backend
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string; // Usually "bearer"
}

/**
 * Response from login endpoint
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

/**
 * Response from token refresh endpoint
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * Sign in request payload
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign up request payload
 */
export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
  invite_token?: string;
}

/**
 * Sign up response details
 */
export interface SignUpDetails {
  email: string;
  user_id: string;
  business_id?: string;
  business_name?: string;
  role?: string;
  verification_required: boolean;
  invite_type: string;
  next_step?: string;
  is_new_user?: boolean;
}

/**
 * Sign up response
 */
export interface SignUpResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  message?: string;
  details: SignUpDetails;
}

/**
 * Session data stored in client
 * Contains current user and auth state
 */
export interface Session {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirm
 */
export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

/**
 * Change password request (when user is logged in)
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Email verification request
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Decoded JWT payload structure
 */
export interface JWTPayload {
  sub: string; // user_id
  email: string;
  role: string; // platform role
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}