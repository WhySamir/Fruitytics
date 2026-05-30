/**
 * Feature Flags Service
 * Enables gradual rollouts and A/B testing
 *
 * Features:
 * - Runtime feature flags
 * - User-based targeting
 * - Percentage rollouts
 * - A/B testing support
 */

interface FeatureFlag {
  key: string;
  enabled: boolean;
  percentage?: number; // 0-100
  users?: string[]; // Specific user IDs
  roles?: string[]; // Specific roles
}

class FeatureFlagsService {
  private flags: Map<string, FeatureFlag> = new Map();
  private userId: string | null = null;
  private userRole: string | null = null;

  /**
   * Initialize feature flags
   */
  async init(flags?: FeatureFlag[]): Promise<void> {
    if (flags) {
      flags.forEach((flag) => this.flags.set(flag.key, flag));
      return;
    }

    // Load from API or environment
    try {
      // In production, load from your feature flag service
      // const response = await fetch('/api/feature-flags');
      // const flags = await response.json();
      // flags.forEach((flag: FeatureFlag) => this.flags.set(flag.key, flag));
    } catch (error) {
      import('./logger').then(({ logger }) => {
        logger.error('Failed to load feature flags', error as Error);
      });
    }
  }

  /**
   * Set current user context
   */
  setUserContext(userId: string | null, userRole: string | null): void {
    this.userId = userId;
    this.userRole = userRole;
  }

  /**
   * Check if feature is enabled
   */
  isEnabled(key: string): boolean {
    const flag = this.flags.get(key);

    if (!flag) {
      return false; // Default to disabled if not found
    }

    if (!flag.enabled) {
      return false;
    }

    // Check user-based targeting
    if (flag.users && this.userId) {
      return flag.users.includes(this.userId);
    }

    // Check role-based targeting
    if (flag.roles && this.userRole) {
      return flag.roles.includes(this.userRole);
    }

    // Check percentage rollout
    if (flag.percentage !== undefined) {
      if (this.userId) {
        // Deterministic based on user ID
        const hash = this.hashString(this.userId);
        return hash % 100 < flag.percentage;
      } else {
        // Random for anonymous users
        return Math.random() * 100 < flag.percentage;
      }
    }

    return flag.enabled;
  }

  /**
   * Get feature flag value
   */
  getFlag(key: string): FeatureFlag | null {
    return this.flags.get(key) || null;
  }

  /**
   * Set feature flag (for testing)
   */
  setFlag(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
  }

  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const featureFlags = new FeatureFlagsService();
