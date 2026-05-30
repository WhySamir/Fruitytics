/**
 * Input Validation Utilities
 * Enterprise-level input validation and sanitization
 */

import { escapeHtml, sanitizeUrl } from './sanitize';

/**
 * Email validation regex
 * RFC 5322 compliant (simplified)
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validates email address
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic length check
  if (email.length > 254) {
    return false;
  }

  // RFC 5322 validation
  return EMAIL_REGEX.test(email);
}

/**
 * Validates URL
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates password strength
 * Returns object with validation results
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'], strength: 'weak' };
  }

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 1;
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common password check (simplified)
  const commonPasswords = [
    'password',
    '12345678',
    'qwerty',
    'abc123',
    'password123',
  ];
  if (
    commonPasswords.some((common) => password.toLowerCase().includes(common))
  ) {
    errors.push('Password is too common');
  }

  // Determine strength
  if (score >= 4 && password.length >= 12) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Validates phone number (international format)
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-()+]/g, '');

  // Check if it's all digits and reasonable length
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // International phone numbers are typically 7-15 digits
  return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Validates and sanitizes form input
 */
export function validateFormInput(
  value: unknown,
  rules: {
    type?: 'text' | 'email' | 'url' | 'password' | 'phone';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean | string;
  }
): {
  valid: boolean;
  value: string;
  error?: string;
} {
  // Convert to string
  const str = typeof value === 'string' ? value : String(value || '');

  // Required check
  if (rules.required && str.trim() === '') {
    return {
      valid: false,
      value: '',
      error: 'This field is required',
    };
  }

  // Skip further validation if empty and not required
  if (str.trim() === '') {
    return { valid: true, value: '' };
  }

  // Length checks
  if (rules.minLength && str.length < rules.minLength) {
    return {
      valid: false,
      value: str,
      error: `Must be at least ${rules.minLength} characters`,
    };
  }

  if (rules.maxLength && str.length > rules.maxLength) {
    return {
      valid: false,
      value: str,
      error: `Must be no more than ${rules.maxLength} characters`,
    };
  }

  // Type-specific validation
  if (rules.type === 'email' && !validateEmail(str)) {
    return {
      valid: false,
      value: str,
      error: 'Invalid email address',
    };
  }

  if (rules.type === 'url' && !validateUrl(str)) {
    return {
      valid: false,
      value: str,
      error: 'Invalid URL',
    };
  }

  if (rules.type === 'password') {
    const passwordValidation = validatePassword(str);
    if (!passwordValidation.valid) {
      return {
        valid: false,
        value: str,
        ...(passwordValidation.errors[0] && {
          error: passwordValidation.errors[0],
        }),
      };
    }
  }

  if (rules.type === 'phone' && !validatePhone(str)) {
    return {
      valid: false,
      value: str,
      error: 'Invalid phone number',
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(str)) {
    return {
      valid: false,
      value: str,
      error: 'Invalid format',
    };
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(str);
    if (customResult !== true) {
      return {
        valid: false,
        value: str,
        error:
          typeof customResult === 'string' ? customResult : 'Validation failed',
      };
    }
  }

  // Sanitize and return
  const sanitized = rules.type === 'url' ? sanitizeUrl(str) : escapeHtml(str);

  return {
    valid: true,
    value: sanitized,
  };
}
