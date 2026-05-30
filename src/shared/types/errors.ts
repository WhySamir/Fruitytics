/**
 * Error types and error handling utilities
 */

/**
 * Application error types
 */
export const ErrorType = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

/**
 * Structured application error
 */
export class AppError extends Error {
  type: ErrorType;
  statusCode?: number | undefined;
  originalError?: Error | undefined;

  constructor(
    type: ErrorType,
    message: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Sanitizes error messages to prevent information leakage
 * Removes internal details and stack traces
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Don't expose internal error details
    const message = error.message.toLowerCase();

    // Map common internal errors to user-friendly messages
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (message.includes('server') || message.includes('500')) {
      return 'A server error occurred. Please try again later.';
    }

    // Generic fallback - never expose original error message
    return 'An unexpected error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Creates a user-friendly error message from an API error response
 */
export function createErrorMessage(
  error: unknown,
  defaultMessage = 'Something went wrong. Please try again.'
): string {
  if (error instanceof AppError) {
    return error.message;
  }

  // Handle axios errors
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
          errors?: Array<{ message?: string }>;
        };
        status?: number;
      };
      message?: string;
    };

    const status = axiosError.response?.status;
    const apiMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors?.[0]?.message;

    if (apiMessage) {
      return sanitizeErrorMessage(new Error(apiMessage));
    }

    if (status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    if (status && status >= 500) {
      return 'A server error occurred. Please try again later.';
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return sanitizeErrorMessage(error);
  }

  return defaultMessage;
}
