/**
 * Security Service
 * Enterprise-level security utilities
 */

/**
 * CSRF Token Management
 */
class CSRFService {
  private tokenKey = 'XSRF-TOKEN';

  /**
   * Gets CSRF token from cookie
   * Token should be set by server via httpOnly cookie
   */
  getToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.tokenKey && value) {
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Validates CSRF token format
   */
  isValidToken(token: string | null): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic validation: token should be alphanumeric and reasonable length
    return /^[a-zA-Z0-9_-]{32,}$/.test(token);
  }
}

export const csrfService = new CSRFService();

/**
 * Rate Limiting Service
 * Client-side rate limiting to prevent abuse
 */
class RateLimitService {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if request is allowed
   * @param key - Unique identifier (e.g., endpoint, user ID)
   * @returns true if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    return true;
  }

  /**
   * Resets rate limit for a key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clears all rate limits
   */
  clear(): void {
    this.requests.clear();
  }
}

export const rateLimitService = new RateLimitService(100, 60000); // 100 requests per minute

/**
 * Security Headers Service
 * Validates and manages security-related headers
 */
class SecurityHeadersService {
  /**
   * Validates that security headers are present
   * Should be called on app initialization
   */
  validateHeaders(): {
    valid: boolean;
    missing: string[];
  } {
    if (typeof document === 'undefined') {
      return { valid: true, missing: [] };
    }

    // Note: In a real app, headers should be checked via meta tags or
    // by making a HEAD request to check response headers
    // This is a placeholder for client-side validation
    const missing: string[] = [];

    // Check for CSP meta tag
    const cspMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    );
    if (!cspMeta) {
      missing.push('Content-Security-Policy');
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

export const securityHeadersService = new SecurityHeadersService();

/**
 * Secure Cookie Service
 * Manages secure cookie operations (client-side helper)
 *
 * NOTE: Actual cookie setting should be done server-side with httpOnly flag
 */
class SecureCookieService {
  /**
   * Sets a secure cookie (client-side)
   * WARNING: For sensitive data, cookies should be set server-side with httpOnly flag
   *
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  setCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    if (typeof document === 'undefined') {
      return;
    }

    const {
      maxAge = 86400, // 1 day
      path = '/',
      domain,
      secure = true, // Always secure in production
      sameSite = 'strict',
    } = options;

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (maxAge) {
      cookie += `; Max-Age=${maxAge}`;
    }

    if (path) {
      cookie += `; Path=${path}`;
    }

    if (domain) {
      cookie += `; Domain=${domain}`;
    }

    if (secure || import.meta.env.PROD) {
      cookie += '; Secure';
    }

    cookie += `; SameSite=${sameSite}`;

    document.cookie = cookie;
  }

  /**
   * Gets a cookie value
   */
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name && cookieValue) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  }

  /**
   * Deletes a cookie
   */
  deleteCookie(name: string, path = '/', domain?: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    let cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}`;

    if (domain) {
      cookie += `; Domain=${domain}`;
    }

    document.cookie = cookie;
  }
}

export const secureCookieService = new SecureCookieService();
