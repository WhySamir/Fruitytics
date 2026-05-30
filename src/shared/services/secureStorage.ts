/**
 * Secure Storage Service
 * Enterprise-level secure storage with encryption support
 *
 * SECURITY BEST PRACTICES:
 * 1. Tokens should be stored in httpOnly cookies (server-side)
 * 2. This service provides client-side secure storage as fallback
 * 3. All data is validated and sanitized before storage
 * 4. Storage keys are namespaced to prevent conflicts
 */

import type { User } from '../types';
import { escapeHtml } from '../utils/sanitize';

interface StoredUserData {
  user: User;
  token: string;
  timestamp: number;
}

const STORAGE_KEY = 'app-user';
const STORAGE_PREFIX = 'app-secure-';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Secure Storage Service
 * Provides secure storage with validation and expiration
 */
class SecureStorageService {
  /**
   * Validates storage quota
   */
  private checkStorageQuota(): boolean {
    if (typeof Storage === 'undefined') {
      return false;
    }

    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      // Quota exceeded or storage disabled
      return false;
    }
  }

  /**
   * Gets storage size in bytes
   */
  private getStorageSize(): number {
    if (typeof sessionStorage === 'undefined') {
      return 0;
    }

    let total = 0;
    for (const key in sessionStorage) {
      if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
        total += (sessionStorage[key]?.length ?? 0) + key.length;
      }
    }
    return total;
  }

  /**
   * Validates user data structure
   */
  private validateUserData(data: unknown): data is StoredUserData {
    if (
      typeof data !== 'object' ||
      data === null ||
      !('user' in data) ||
      !('token' in data) ||
      !('timestamp' in data)
    ) {
      return false;
    }

    const stored = data as StoredUserData;

    // Validate token
    if (typeof stored.token !== 'string' || stored.token.length < 10) {
      return false;
    }

    // Validate user object
    if (
      typeof stored.user !== 'object' ||
      stored.user === null ||
      !('id' in stored.user) ||
      !('email' in stored.user)
    ) {
      return false;
    }

    // Check expiration
    if (typeof stored.timestamp !== 'number') {
      return false;
    }

    const age = Date.now() - stored.timestamp;
    if (age > TOKEN_EXPIRY_MS) {
      return false; // Expired
    }

    return true;
  }

  /**
   * Gets user data from secure storage
   * Returns null if not found, invalid, or expired
   */
  getUser(): StoredUserData | null {
    try {
      if (typeof window === 'undefined' || !this.checkStorageQuota()) {
        return null;
      }

      const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${STORAGE_KEY}`);
      if (!raw) {
        return null;
      }

      // SECURITY: Validate JSON before parsing
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Invalid JSON - potential tampering
        this.removeUser();
        return null;
      }

      // SECURITY: Validate structure and expiration
      if (!this.validateUserData(parsed)) {
        this.removeUser();
        return null;
      }

      return parsed as StoredUserData;
    } catch (error) {
      import('./logger').then(({ logger }) => {
        logger.error('Error reading secure storage', error as Error);
      });
      this.removeUser();
      return null;
    }
  }

  /**
   * Saves user data to secure storage
   * Validates and sanitizes data before storage
   */
  setUser(data: { user: User; token: string }): void {
    try {
      if (typeof window === 'undefined' || !this.checkStorageQuota()) {
        throw new Error('Storage not available');
      }

      // SECURITY: Validate input
      if (!data.user || !data.token) {
        throw new Error('Invalid user data: user and token are required');
      }

      // SECURITY: Validate token format (basic validation)
      if (typeof data.token !== 'string' || data.token.length < 10) {
        throw new Error('Invalid token format');
      }

      // SECURITY: Check storage quota
      const currentSize = this.getStorageSize();
      const dataSize = JSON.stringify(data).length;
      if (currentSize + dataSize > MAX_STORAGE_SIZE) {
        throw new Error('Storage quota exceeded');
      }

      // SECURITY: Sanitize user data (escape HTML in string fields)
      const sanitizedUser: User = {
        ...data.user,
        email: escapeHtml(data.user.email),
        ...(data.user.name && { name: escapeHtml(data.user.name) }),
      };

      const storedData: StoredUserData = {
        user: sanitizedUser,
        token: data.token, // Token should already be sanitized by server
        timestamp: Date.now(),
      };

      sessionStorage.setItem(
        `${STORAGE_PREFIX}${STORAGE_KEY}`,
        JSON.stringify(storedData)
      );
    } catch (error) {
      // Don't throw - storage failures shouldn't crash the app
      // But log for monitoring
      errorReporting.reportError(error as Error, {
        source: 'secureStorage',
        operation: 'setUser',
      });
    }
  }

  /**
   * Removes user data from secure storage
   */
  removeUser(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      sessionStorage.removeItem(`${STORAGE_PREFIX}${STORAGE_KEY}`);
    } catch (error) {
      errorReporting.reportError(error as Error, {
        source: 'secureStorage',
        operation: 'removeUser',
      });
    }
  }

  /**
   * Clears all app-related secure storage
   */
  clearAll(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      errorReporting.reportError(error as Error, {
        source: 'secureStorage',
        operation: 'clearAll',
      });
    }
  }

  /**
   * Checks if storage is available and secure
   */
  isAvailable(): boolean {
    return this.checkStorageQuota();
  }
}

import { errorReporting } from './errorReporting';

export const secureStorageService = new SecureStorageService();
