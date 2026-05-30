/**
 * Validation Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateUrl,
  validatePassword,
  validatePhone,
  validateFormInput,
} from '../validation';

describe('validateEmail', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@example.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
  });
});

describe('validateUrl', () => {
  it('should validate correct URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('javascript:alert(1)')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should validate strong passwords', () => {
    const result = validatePassword('StrongPass123!');
    expect(result.valid).toBe(true);
  });

  it('should reject weak passwords', () => {
    const result = validatePassword('weak');
    expect(result.valid).toBe(false);
  });
});

describe('validatePhone', () => {
  it('should validate phone numbers', () => {
    expect(validatePhone('+1234567890')).toBe(true);
    expect(validatePhone('1234567890')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
  });
});

describe('validateFormInput', () => {
  it('should validate required fields', () => {
    const result = validateFormInput('', { required: true });
    expect(result.valid).toBe(false);
  });

  it('should validate email type', () => {
    const result = validateFormInput('test@example.com', { type: 'email' });
    expect(result.valid).toBe(true);
  });

  it('should validate length constraints', () => {
    const result = validateFormInput('abc', { minLength: 5 });
    expect(result.valid).toBe(false);
  });
});
