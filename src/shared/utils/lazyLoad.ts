/**
 * Lazy Loading Utilities
 * Advanced lazy loading patterns for components and libraries
 */

import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * Lazy load a component with retry logic
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (attempt: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (attempt < retries) {
              setTimeout(() => attemptImport(attempt + 1), delay);
            } else {
              reject(error);
            }
          });
      };
      attemptImport(1);
    });
  });
}

/**
 * Lazy load with preload hint
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { preload: () => Promise<void> } {
  const LazyComponent = lazy(importFn) as LazyExoticComponent<T> & {
    preload: () => Promise<void>;
  };

  LazyComponent.preload = async () => {
    await importFn();
  };

  return LazyComponent;
}

/**
 * Preload a route
 */
export function preloadRoute(importFn: () => Promise<unknown>): void {
  // Use link prefetching
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    // Note: This is a simplified version
    // In production, you'd want to use proper resource hints
  }

  // Preload in background
  importFn().catch(() => {
    // Silently fail - preload is best effort
  });
}

/**
 * Lazy load a library
 */
export function lazyLoadLibrary<T>(
  importFn: () => Promise<T>
): () => Promise<T> {
  let library: T | null = null;
  let loading: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (library) {
      return library;
    }

    if (loading) {
      return loading;
    }

    loading = importFn().then((lib) => {
      library = lib;
      loading = null;
      return lib;
    });

    return loading;
  };
}
