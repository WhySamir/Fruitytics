/**
 * Performance Monitoring Service
 * Tracks Web Vitals and performance metrics
 *
 * Integrates with analytics services (Google Analytics, etc.)
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';

interface PerformanceConfig {
  /**
   * Enable performance monitoring
   */
  enabled: boolean;
  /**
   * Sample rate (0-1) for performance tracking
   */
  sampleRate: number;
  /**
   * Custom analytics handler
   */
  onMetric?: (metric: Metric) => void;
}

class PerformanceService {
  private config: PerformanceConfig = {
    enabled: true,
    sampleRate: 1.0, // Track 100% in development, adjust for production
  };

  /**
   * Initialize performance monitoring
   */
  init(config?: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };

    if (!this.config.enabled) {
      return;
    }

    // Only track if sample rate allows
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    // Track Core Web Vitals
    onCLS(this.handleMetric);
    onFCP(this.handleMetric);
    onLCP(this.handleMetric);
    onTTFB(this.handleMetric);
    onINP(this.handleMetric); // Replaces onFID in web-vitals v3
  }

  /**
   * Handle performance metric
   */
  private handleMetric = (metric: Metric): void => {
    // Log to logger in development
    if (import.meta.env.DEV) {
      import('./logger').then(({ logger }) => {
        logger.debug('Performance metric', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        });
      });
    }

    // Send to custom handler if provided
    if (this.config.onMetric) {
      this.config.onMetric(metric);
    }

    // Send to analytics (Google Analytics example)
    if (
      typeof window !== 'undefined' &&
      'gtag' in window &&
      typeof (window as { gtag?: unknown }).gtag === 'function'
    ) {
      (
        window as {
          gtag: (
            command: string,
            eventName: string,
            params: Record<string, unknown>
          ) => void;
        }
      ).gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      });
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics(metric);
  };

  /**
   * Send metric to analytics endpoint
   */
  private sendToAnalytics(_metric: Metric): void {
    // In production, send to your analytics service
    if (import.meta.env.PROD) {
      // Example: Send to your backend
      // fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: metric.name,
      //     value: metric.value,
      //     rating: metric.rating,
      //     id: metric.id,
      //     delta: metric.delta,
      //     entries: metric.entries,
      //   }),
      // }).catch(() => {
      //   // Silently fail - don't block app
      // });
    }
  }

  /**
   * Measure custom performance metric
   */
  measure(name: string, fn: () => void | Promise<void>): void {
    const start = performance.now();

    const result = fn();

    if (result instanceof Promise) {
      result.then(() => {
        const duration = performance.now() - start;
        this.logCustomMetric(name, duration);
      });
    } else {
      const duration = performance.now() - start;
      this.logCustomMetric(name, duration);
    }
  }

  /**
   * Log custom metric
   */
  private logCustomMetric(name: string, duration: number): void {
    if (import.meta.env.DEV) {
      import('./logger').then(({ logger }) => {
        logger.debug(`Performance: ${name}`, {
          duration: `${duration.toFixed(2)}ms`,
        });
      });
    }

    // Send to analytics
    if (
      typeof window !== 'undefined' &&
      'gtag' in window &&
      typeof (window as { gtag?: unknown }).gtag === 'function'
    ) {
      (
        window as {
          gtag: (
            command: string,
            eventName: string,
            params: Record<string, unknown>
          ) => void;
        }
      ).gtag('event', 'custom_performance', {
        metric_name: name,
        metric_value: duration,
      });
    }
  }

  /**
   * Get performance timing
   */
  getTiming(): PerformanceTiming | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    return window.performance.timing;
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming(): PerformanceNavigationTiming | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    const entries = window.performance.getEntriesByType('navigation');
    return entries[0] as PerformanceNavigationTiming | null;
  }
}

export const performanceService = new PerformanceService();
