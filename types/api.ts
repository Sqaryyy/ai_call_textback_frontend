// types/api.ts

/**
 * Standard API error response structure
 */
export interface APIError {
  detail: string;
  status_code?: number;
  field?: string; // For field-specific validation errors
}

/**
 * Generic API response wrapper
 */
export interface APIResponse<T = any> {
  data?: T;
  error?: APIError;
  message?: string;
  success: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Validation error for form fields
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Multiple validation errors response
 */
export interface ValidationErrorResponse {
  detail: string;
  errors: ValidationError[];
}

/**
 * API request configuration
 */
export interface APIRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  token?: string; // Access token for authenticated requests
}

/**
 * Query parameters for list endpoints
 */
export interface ListQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters?: Record<string, any>;
}

/**
 * Success response for operations that don't return data
 */
export interface SuccessResponse {
  message: string;
  success: boolean;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  successful: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}