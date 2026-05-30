/**
 * Auth Hook Tests
 * Tests for useAuth hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../shared/store';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../../../shared/types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe('useAuth', () => {
  beforeEach(() => {
    // Clear store before each test
    store.dispatch({ type: 'auth/CLEAR_AUTH' });
  });

  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set user and token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
    };
    const token = 'test-token';

    result.current.setUser(user, token);

    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should check user role', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
    };

    result.current.setUser(user, 'token');

    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('user')).toBe(false);
  });

  it('should check user permissions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
      permissions: ['read:users', 'write:users'],
    };

    result.current.setUser(user, 'token');

    expect(result.current.hasPermission('read:users')).toBe(true);
    expect(result.current.hasPermission('delete:users')).toBe(false);
  });

  it('should logout and clear auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
    };

    result.current.setUser(user, 'token');
    expect(result.current.isAuthenticated).toBe(true);

    result.current.logout();

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
