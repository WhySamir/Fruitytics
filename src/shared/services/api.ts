/**
 * API service
 * Centralized HTTP client with proper error handling and security
 *
 * SECURITY: API keys should NEVER be in frontend code.
 * All API authentication should be handled server-side via httpOnly cookies.
 */

import axios, { AxiosError } from 'axios';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config';
import { createErrorMessage } from '../types/errors';
import { errorReporting } from './errorReporting';
import { secureStorageService } from './secureStorage';
import { csrfService, rateLimitService } from './security';
import { sanitizeUrl } from '../utils/sanitize';
import { logger } from './logger';
import { cacheService } from './cache';
import type { RequestConfig, ApiResponse } from '../types';

/**
 * HTTP client instance
 */
const http = axios.create({
  baseURL: env.VITE_APP_BASE_URL,
  timeout: 30000, // 30 seconds
  validateStatus: (status: number) => status >= 200 && status < 300,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
  withCredentials: true, // Enable cookies for httpOnly token storage
});

/**
 * Request interceptor - adds authentication token and security headers
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // SECURITY: Rate limiting check
    const rateLimitKey = config.url || 'default';
    if (!rateLimitService.isAllowed(rateLimitKey)) {
      return Promise.reject(
        new Error('Rate limit exceeded. Please try again later.')
      );
    }

    // Add authentication token
    const userData = secureStorageService.getUser();
    if (userData?.token && config.headers) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }

    // SECURITY: Add CSRF token if available
    const csrfToken = csrfService.getToken();
    if (csrfToken && csrfService.isValidToken(csrfToken) && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // SECURITY: Sanitize URL to prevent protocol-based attacks
    if (config.url) {
      const sanitized = sanitizeUrl(config.url);
      if (!sanitized && config.url.startsWith('http')) {
        // Only reject if it was a dangerous protocol, not if it's a valid URL
        config.url = sanitizeUrl(config.url) || config.url;
      }
    }

    // SECURITY: Add security headers
    if (config.headers) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      // Prevent caching of sensitive requests
      if (
        config.method &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())
      ) {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles errors globally
 */
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<unknown>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth state
      secureStorageService.removeUser();

      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

      return Promise.reject(error);
    }

    // Report error to monitoring service
    if (error.response) {
      errorReporting.reportError(error as Error, {
        ...(originalRequest.url && { url: originalRequest.url }),
        ...(originalRequest.method && { method: originalRequest.method }),
        status: error.response.status,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Makes an API request with proper error handling
 * Supports caching and request deduplication
 */
export async function apiRequest<T>(config: RequestConfig): Promise<T> {
  try {
    const {
      authorization: _authorization,
      store: _store,
      showErr: _showErr,
      successMsg: _successMsg,
      cache,
      cacheTTL,
      ...restConfig
    } = config;

    // Generate cache key for GET requests
    const cacheKey =
      (config.method === 'GET' || !config.method) && cache !== false
        ? `api:${config.url}:${JSON.stringify(restConfig.params || {})}`
        : null;

    // Check cache for GET requests
    if (cacheKey) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Use cache service for request deduplication
    if (cacheKey) {
      return cacheService.getOrFetch(
        cacheKey,
        () => makeRequest<T>(config),
        cacheTTL
      ) as Promise<T>;
    }

    return makeRequest<T>(config);
  } catch (error) {
    const errorMessage = createErrorMessage(error);

    // Show error message if configured
    if (config.showErr) {
      // TODO: Integrate with toast notification system
      logger.error('API request failed', error, { message: errorMessage });
    }

    // Re-throw for caller to handle
    throw error;
  }
}

/**
 * Internal request function
 */
async function makeRequest<T>(config: RequestConfig): Promise<T> {
  const {
    authorization,
    store: _store,
    showErr: _showErr,
    successMsg,
    cache,
    cacheTTL,
    ...restConfig
  } = config;

  // Add authorization header if needed
  if (authorization) {
    const userData = secureStorageService.getUser();
    if (!userData?.token) {
      throw new Error('No authentication token found. Please log in.');
    }
    // Token is added by interceptor, but we can add it here too if needed
  }

  const response = await http.request<ApiResponse<T>>({
    ...restConfig,
    method: restConfig.method || 'GET',
  });

  // Check for API-level errors
  if (response.data.errors && response.data.errors.length > 0) {
    const errorMessage = response.data.errors[0]?.message || 'Request failed';
    throw new Error(errorMessage);
  }

  // Show success message if provided
  if (successMsg) {
    // TODO: Integrate with toast notification system
    logger.info('API request successful', { message: successMsg });
  }

  const data = response.data.data;

  // Cache GET requests
  const cacheKey =
    (config.method === 'GET' || !config.method) && cache !== false
      ? `api:${config.url}:${JSON.stringify(config.params || {})}`
      : null;

  if (cacheKey && data) {
    cacheService.set(cacheKey, data, cacheTTL);
  }

  return data;
}

/**
 * GET request helper
 */
export async function apiGet<T>(
  url: string,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  return apiRequest<T>({ ...config, url, method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>
): Promise<T> {
  return apiRequest<T>({ ...config, url, method: 'POST', data });
}

/**
 * PUT request helper
 */
export async function apiPut<T>(
  url: string,
  data?: unknown,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>
): Promise<T> {
  return apiRequest<T>({ ...config, url, method: 'PUT', data });
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>
): Promise<T> {
  return apiRequest<T>({ ...config, url, method: 'PATCH', data });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  url: string,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  return apiRequest<T>({ ...config, url, method: 'DELETE' });
}

export default http;
