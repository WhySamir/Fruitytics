/**
 * Environment variable validation and configuration
 * Validates all required environment variables on app startup
 */

interface EnvConfig {
  VITE_APP_BASE_URL: string;
  // API_KEY should NOT be in frontend - this is a security issue
}

/**
 * Validates and returns environment variables
 * Throws error if required variables are missing
 */
function validateEnv(): EnvConfig {
  const requiredEnvVars = ['VITE_APP_BASE_URL'] as const;
  const missing: string[] = [];

  requiredEnvVars.forEach((key) => {
    const value = import.meta.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate URL format
  const baseUrl = import.meta.env['VITE_APP_BASE_URL'];
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(
      `Invalid VITE_APP_BASE_URL format: ${baseUrl}. Must be a valid URL.`
    );
  }

  return {
    VITE_APP_BASE_URL: baseUrl,
  };
}

// Validate on module load
export const env = validateEnv();

/**
 * Type-safe environment variable access
 * Use this instead of direct import.meta.env access
 */
export default env;
