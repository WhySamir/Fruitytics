/**
 * Shared TypeScript types and interfaces
 * Used across multiple features and components
 */

/**
 * Generic list state for paginated data
 */
export interface ListState<T> {
  loading: boolean;
  loadingState: boolean;
  data?: T[];
  items?: T[];
  page?: number;
  totalPages?: number;
  totalItems?: number;
}

/**
 * Generic object state
 */
export interface ObjectState<T> {
  loading: boolean;
  loadingState: boolean;
  data: T;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  token?: string;
  permissions?: string[];
  [key: string]: unknown;
}

/**
 * API Error response structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  errors?: ApiError[];
  message?: string;
}

/**
 * Request configuration for API calls
 */
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  authorization?: boolean;
  store?: StoreConfig;
  showErr?: boolean;
  successMsg?: string;
  /**
   * Enable request caching (default: true for GET requests)
   */
  cache?: boolean;
  /**
   * Cache TTL in milliseconds
   */
  cacheTTL?: number;
}

/**
 * Store configuration for automatic state management
 */
export interface StoreConfig {
  key: string;
  action: 'set' | 'append' | 'update' | 'remove' | 'reset';
}

/**
 * Loading state configuration
 */
export interface LoadingState {
  loading: boolean;
  loadingState: boolean;
}
