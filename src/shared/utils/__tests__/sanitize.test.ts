/**
 * Sanitize Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHtml, escapeHtml, sanitizeUrl } from '../sanitize';

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const input = '<p>Safe</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>Safe</p>');
  });

  it('should remove event handlers', () => {
    const input = '<div onclick="alert(1)">Click</div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onclick');
  });

  it('should preserve safe HTML', () => {
    const input = '<p>Safe <strong>content</strong></p>';
    const result = sanitizeHtml(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
  });
});

describe('escapeHtml', () => {
  it('should escape HTML entities', () => {
    const input = '<script>alert("xss")</script>';
    const result = escapeHtml(input);
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should escape special characters', () => {
    const input = 'Hello & <world>';
    const result = escapeHtml(input);
    expect(result).toBe('Hello &amp; &lt;world&gt;');
  });
});

describe('sanitizeUrl', () => {
  it('should block javascript: protocol', () => {
    const input = 'javascript:alert("xss")';
    const result = sanitizeUrl(input);
    expect(result).toBe('');
  });

  it('should block data: protocol', () => {
    const input = 'data:text/html,<script>alert(1)</script>';
    const result = sanitizeUrl(input);
    expect(result).toBe('');
  });

  it('should allow http URLs', () => {
    const input = 'http://example.com';
    const result = sanitizeUrl(input);
    expect(result).toBe(input);
  });

  it('should allow https URLs', () => {
    const input = 'https://example.com';
    const result = sanitizeUrl(input);
    expect(result).toBe(input);
  });
});
