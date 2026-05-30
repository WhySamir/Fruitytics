/**
 * Auth Feature API Layer
 * Feature-specific API calls for authentication
 *
 * This pattern allows each feature to have its own API layer,
 * preventing the shared API service from becoming a bottleneck.
 */

import { apiGet, apiPost } from '../../../shared/services/api';
import type { User } from '../../../shared/types';
import { cacheService } from '../../../shared/services/cache';

/**
 * Login request
 */
export async function login(credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  return apiPost<{ user: User; token: string }>('/auth/login', credentials, {
    showErr: true,
  });
}

/**
 * Register request
 */
export async function register(
  userData: Omit<User, 'id' | 'role'> & { password: string }
): Promise<{ user: User; token: string }> {
  return apiPost<{ user: User; token: string }>('/auth/register', userData, {
    showErr: true,
  });
}

/**
 * Verify session (with caching)
 */
export async function verifySession(): Promise<User> {
  const cacheKey = 'auth:verify-session';

  return cacheService.getOrFetch(
    cacheKey,
    () => apiGet<User>('/auth/verify-session', { authorization: true }),
    5 * 60 * 1000 // Cache for 5 minutes
  );
}

/**
 * Logout request
 */
export async function logout(): Promise<void> {
  // Invalidate auth cache
  cacheService.invalidatePattern(/^auth:/);

  // Call logout endpoint
  await apiPost<void>('/auth/logout', {}, { authorization: true });
}

/**
 * Refresh token
 */
export async function refreshToken(): Promise<{ token: string }> {
  return apiPost<{ token: string }>(
    '/auth/refresh',
    {},
    {
      authorization: true,
    }
  );
}
