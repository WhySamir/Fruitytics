/**
 * XSS Protection Utilities
 * Sanitizes user input to prevent XSS attacks
 */

import DOMPurify from 'dompurify';
import type { Config } from 'dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Strict settings for maximum security
 */
const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'code',
    'pre',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitizes HTML string to prevent XSS attacks
 *
 * @param dirty - Unsanitized HTML string
 * @param config - Optional custom DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * const safe = sanitizeHtml('<script>alert("xss")</script><p>Safe content</p>');
 * // Returns: '<p>Safe content</p>'
 */
export function sanitizeHtml(dirty: string, config?: Config): string {
  if (typeof window === 'undefined') {
    // Server-side: return empty string or basic text
    return dirty.replace(/<[^>]*>/g, '');
  }

  try {
    const sanitized = DOMPurify.sanitize(dirty, {
      ...SANITIZE_CONFIG,
      ...config,
    });
    // DOMPurify returns TrustedHTML in some contexts, convert to string
    return String(sanitized);
  } catch {
    // Fallback: strip all HTML tags
    // Error is logged by error reporting service if needed
    return dirty.replace(/<[^>]*>/g, '');
  }
}

/**
 * Sanitizes plain text by escaping HTML entities
 * Use this for user input that should be displayed as plain text
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML rendering
 *
 * @example
 * const safe = escapeHtml('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(
    /[&<>"']/g,
    (char) => map[char as keyof typeof map] ?? char
  );
}

/**
 * Sanitizes URL to prevent javascript: and data: protocol attacks
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if unsafe
 *
 * @example
 * const safe = sanitizeUrl('javascript:alert("xss")');
 * // Returns: ''
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return '';
    }
  }

  // Allow http, https, mailto, tel
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return url;
  }

  // Default to empty string for unknown protocols
  return '';
}

/**
 * Validates and sanitizes user input
 *
 * @param input - User input to validate
 * @param options - Validation options
 * @returns Sanitized input or throws error
 */
export function validateInput(
  input: unknown,
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    required?: boolean;
  } = {}
): string {
  const { maxLength = 10000, allowHtml = false, required = false } = options;

  if (
    required &&
    (!input || (typeof input === 'string' && input.trim() === ''))
  ) {
    throw new Error('Input is required');
  }

  if (input === null || input === undefined) {
    return '';
  }

  const str = String(input);

  if (str.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  if (allowHtml) {
    return sanitizeHtml(str);
  }

  return escapeHtml(str);
}

/**
 * Sanitizes object properties recursively
 * Useful for sanitizing API responses or form data
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: {
    allowHtml?: boolean;
    maxDepth?: number;
  } = {}
): T {
  const { allowHtml = false, maxDepth = 10 } = options;

  if (maxDepth <= 0) {
    return obj;
  }

  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = allowHtml
        ? sanitizeHtml(value)
        : escapeHtml(value);
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>,
        { allowHtml, maxDepth: maxDepth - 1 }
      );
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map((item) => {
        if (typeof item === 'string') {
          return allowHtml ? sanitizeHtml(item) : escapeHtml(item);
        }
        if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item as Record<string, unknown>, {
            allowHtml,
            maxDepth: maxDepth - 1,
          });
        }
        return item;
      });
    }
  }

  return sanitized;
}
