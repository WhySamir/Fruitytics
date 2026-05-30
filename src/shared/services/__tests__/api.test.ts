/**
 * API Service Tests
 * Critical tests for the API service used throughout the app
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiGet, apiPost } from '../api';
import { cacheService } from '../cache';
import axios from 'axios';

// Mock axios
vi.mock('axios');
vi.mock('../cache');
vi.mock('../secureStorage');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('apiGet', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (axios.create as any).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          data: { data: mockData },
        }),
      });

      const result = await apiGet('/test');
      expect(result).toEqual(mockData);
    });

    it('should use cache for GET requests', async () => {
      const cachedData = { id: 1, name: 'Cached' };
      (cacheService.get as any).mockReturnValue(cachedData);

      const result = await apiGet('/test');
      expect(result).toEqual(cachedData);
      expect(cacheService.get).toHaveBeenCalled();
    });
  });

  describe('apiPost', () => {
    it('should make POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      (axios.create as any).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          data: { data: mockData },
        }),
      });

      const result = await apiPost('/test', { name: 'Test' });
      expect(result).toEqual(mockData);
    });
  });

  describe('caching', () => {
    it('should cache GET requests', async () => {
      const mockData = { id: 1 };
      (axios.create as any).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          data: { data: mockData },
        }),
      });

      await apiGet('/test', { cache: true });
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should not cache POST requests', async () => {
      const mockData = { id: 1 };
      (axios.create as any).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          data: { data: mockData },
        }),
      });

      await apiPost('/test', { name: 'Test' });
      expect(cacheService.set).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      (axios.create as any).mockReturnValue({
        request: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      await expect(apiGet('/test')).rejects.toThrow();
    });
  });
});
