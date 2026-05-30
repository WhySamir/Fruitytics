/**
 * Error Boundary Component
 * Catches React errors and reports them to monitoring service
 */

import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode, ErrorInfo } from 'react';
import { handleErrorBoundaryError } from '../../services/errorReporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Default fallback UI for errors
 */
function DefaultFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

/**
 * Error Boundary Wrapper
 * Wraps the app to catch and handle React errors
 */
export default function ErrorBoundaryWrapper({ children, fallback }: Props) {
  return (
    <ErrorBoundary
      FallbackComponent={() => fallback ?? <DefaultFallback />}
      onError={(error: unknown, info: ErrorInfo) => {
        const errorObject =
          error instanceof Error ? error : new Error(String(error));
        handleErrorBoundaryError(errorObject, {
          ...(info.componentStack && { componentStack: info.componentStack }),
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
