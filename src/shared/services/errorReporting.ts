/**
 * Error reporting service
 * Centralized error logging and monitoring
 *
 * TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
 * For now, logs to console in development
 */

import { AppError } from '../types/errors';

interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  [key: string]: unknown;
}

class ErrorReportingService {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  /**
   * Reports an error to the error monitoring service
   */
  reportError(error: Error | AppError, context?: ErrorContext): void {
    const errorContext: ErrorContext = {
      ...context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // In development, use logger for structured logging
    if (this.isDevelopment) {
      // Import logger dynamically to avoid circular dependencies
      import('./logger').then(({ logger }) => {
        logger.error('Error reported', error, errorContext);
      });
      return;
    }

    // In production, send to error monitoring service
    if (this.isProduction) {
      // TODO: Integrate with Sentry, LogRocket, or similar
      // Example:
      // Sentry.captureException(error, { extra: errorContext });

      // For now, use logger for structured logging
      import('./logger').then(({ logger }) => {
        logger.error(
          'Error reported',
          error,
          this.sanitizeContext(errorContext)
        );
      });
    }
  }

  /**
   * Reports a message (non-error) to monitoring
   */
  reportMessage(message: string, level: 'info' | 'warning' = 'info'): void {
    // Use logger for structured logging
    import('./logger').then(({ logger }) => {
      if (level === 'info') {
        logger.info(message);
      } else {
        logger.warn(message);
      }
    });

    // TODO: Send to monitoring service
    // Example: Sentry.captureMessage(message, level);
  }

  /**
   * Sanitizes context to remove sensitive information
   */
  private sanitizeContext(context: ErrorContext): ErrorContext {
    const sanitized = { ...context };

    // Remove potentially sensitive fields
    if ('token' in sanitized) {
      delete sanitized['token'];
    }
    if ('password' in sanitized) {
      delete sanitized['password'];
    }
    if ('authorization' in sanitized) {
      delete sanitized['authorization'];
    }

    return sanitized;
  }
}

export const errorReporting = new ErrorReportingService();

/**
 * React Error Boundary error handler
 */
export function handleErrorBoundaryError(
  error: Error,
  errorInfo: { componentStack?: string }
): void {
  errorReporting.reportError(error, {
    componentStack: errorInfo.componentStack,
    source: 'ErrorBoundary',
  });
}
