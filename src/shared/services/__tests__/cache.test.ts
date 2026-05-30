/**
 * Cache Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from '../cache';

describe('Cache Service', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('should cache data', () => {
    cacheService.set('test', { id: 1 }, 1000);
    const cached = cacheService.get('test');
    expect(cached).toEqual({ id: 1 });
  });

  it('should expire cached data', async () => {
    cacheService.set('test', { id: 1 }, 100);
    await new Promise((resolve) => setTimeout(resolve, 150));
    const cached = cacheService.get('test');
    expect(cached).toBeNull();
  });

  it('should deduplicate requests', async () => {
    let callCount = 0;
    const fetcher = async () => {
      callCount++;
      return { id: 1 };
    };

    const [result1, result2] = await Promise.all([
      cacheService.getOrFetch('test', fetcher),
      cacheService.getOrFetch('test', fetcher),
    ]);

    expect(result1).toEqual({ id: 1 });
    expect(result2).toEqual({ id: 1 });
    expect(callCount).toBe(1); // Should only call once
  });

  it('should invalidate cache', () => {
    cacheService.set('test', { id: 1 });
    cacheService.invalidate('test');
    expect(cacheService.get('test')).toBeNull();
  });
});
