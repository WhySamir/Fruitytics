/**
 * Environment Configuration
 * Multi-environment support for enterprise deployments
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

interface EnvironmentConfig {
  name: Environment;
  apiUrl: string;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  featureFlagsUrl?: string;
}

const environments: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiUrl: import.meta.env['VITE_APP_BASE_URL'] || 'http://localhost:3000/api',
    enableAnalytics: false,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    logLevel: 'debug',
  },
  staging: {
    name: 'staging',
    apiUrl:
      import.meta.env['VITE_APP_BASE_URL'] || 'https://api-staging.example.com',
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    logLevel: 'info',
    featureFlagsUrl: 'https://flags-staging.example.com',
  },
  production: {
    name: 'production',
    apiUrl: import.meta.env['VITE_APP_BASE_URL'] || 'https://api.example.com',
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    logLevel: 'warn',
    featureFlagsUrl: 'https://flags.example.com',
  },
  test: {
    name: 'test',
    apiUrl: 'http://localhost:3000/api',
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
    logLevel: 'error',
  },
};

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  const env = import.meta.env.MODE as Environment;
  return env in environments ? env : 'development';
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return environments[getEnvironment()];
}

/**
 * Check if in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Check if in development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if in staging
 */
export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}
