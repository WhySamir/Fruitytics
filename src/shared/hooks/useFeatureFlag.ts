/**
 * Feature Flag Hook
 * React hook for feature flags
 */

import { useMemo } from 'react';
import { featureFlags } from '../services/featureFlags';
import { useAuth } from '../../features/auth/hooks/useAuth';

/**
 * Check if a feature flag is enabled
 */
export function useFeatureFlag(key: string): boolean {
  const { user } = useAuth();

  // Update user context when user changes
  useMemo(() => {
    featureFlags.setUserContext(user?.id || null, user?.role || null);
  }, [user?.id, user?.role]);

  return featureFlags.isEnabled(key);
}
