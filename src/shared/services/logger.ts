/**
 * Logging Service
 * Enterprise-level logging with structured logging and log levels
 *
 * SECURITY: Never logs sensitive information (tokens, passwords, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;
  private minLevel: LogLevel = this.isDevelopment ? 'debug' : 'info';

  /**
   * Sanitizes log data to remove sensitive information
   */
  private sanitize(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...(data as Record<string, unknown>) };
    const sensitiveKeys = [
      'token',
      'password',
      'authorization',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
      'cvv',
    ];

    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Formats log message with context
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context
      ? ` ${JSON.stringify(this.sanitize(context))}`
      : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Debug log (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.minLevel === 'debug') {
      console.warn(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info log
   */
  info(message: string, context?: LogContext): void {
    if (['debug', 'info'].includes(this.minLevel)) {
      console.warn(this.formatMessage('info', message, context));
    }
  }

  /**
   * Warning log
   */
  warn(message: string, context?: LogContext): void {
    if (['debug', 'info', 'warn'].includes(this.minLevel)) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Error log
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              message: error.message,
              name: error.name,
              stack: this.isDevelopment ? error.stack : undefined,
            }
          : error,
    };

    console.error(this.formatMessage('error', message, errorContext));

    // In production, also send to error reporting service
    if (this.isProduction && error instanceof Error) {
      // Error reporting is handled by errorReporting service
      // This is just for logging
    }
  }

  /**
   * Sets minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

export const logger = new Logger();
