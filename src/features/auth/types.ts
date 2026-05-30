/**
 * Authentication feature types
 */

import type { User } from '../../shared/types';

/**
 * Re-export User type for convenience
 */
export type { User };

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * User permissions
 */
export type Permission = string;

/**
 * User roles
 */
export type Role = 'admin' | 'user' | 'guest';
