/**
 * Authentication hook
 * Provides typed access to auth state and actions
 */

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../shared/store';
import {
  setUser as setUserAction,
  updateUser as updateUserAction,
  setLoading as setLoadingAction,
  setError as setErrorAction,
  clearAuth as clearAuthAction,
} from '../store/actions';
import type { User } from '../types';
import { secureStorageService } from '../../../shared/services/secureStorage';

/**
 * Custom hook for authentication
 * Provides typed access to auth state and actions
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const setUser = useCallback(
    (user: User, token: string) => {
      dispatch(setUserAction(user, token));
      // Store token securely (httpOnly cookies should be used in production)
      secureStorageService.setUser({ user, token });
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUserAction(userData));
      // Update stored user data
      if (auth.user) {
        secureStorageService.setUser({
          user: { ...auth.user, ...userData },
          token: auth.token || '',
        });
      }
    },
    [dispatch, auth.user, auth.token]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingAction(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(setErrorAction(error));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearAuthAction());
    secureStorageService.removeUser();
    // Redirect handled by ProtectedRoute component
  }, [dispatch]);

  const hasRole = useCallback(
    (role: string): boolean => {
      return auth.user?.role?.toLowerCase() === role.toLowerCase();
    },
    [auth.user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!auth.user?.permissions) return false;
      return auth.user.permissions.some(
        (p: string) => p.toLowerCase() === permission.toLowerCase()
      );
    },
    [auth.user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!auth.user?.permissions) return false;
      return permissions.some((permission) =>
        auth.user?.permissions?.some(
          (p: string) => p.toLowerCase() === permission.toLowerCase()
        )
      );
    },
    [auth.user]
  );

  return {
    // State
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    // Actions
    setUser,
    updateUser,
    setLoading,
    setError,
    logout,
    // Helpers
    hasRole,
    hasPermission,
    hasAnyPermission,
  };
}
