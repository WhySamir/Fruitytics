/**
 * Redux Store Tests
 * Critical tests for state management
 */

import { describe, it, expect } from 'vitest';
import { store } from '../index';
import { setUser, clearAuth } from '../../../features/auth/store/actions';
import type { User } from '../../types';

describe('Redux Store', () => {
  it('should have initial state', () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
    expect(state.data).toBeDefined();
  });

  it('should dispatch auth actions', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
    };

    store.dispatch(setUser(user, 'token'));

    const state = store.getState();
    expect(state.auth.user).toEqual(user);
    expect(state.auth.token).toBe('token');
    expect(state.auth.isAuthenticated).toBe(true);
  });

  it('should clear auth state', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
    };

    store.dispatch(setUser(user, 'token'));
    store.dispatch(clearAuth());

    const state = store.getState();
    expect(state.auth.user).toBeNull();
    expect(state.auth.token).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);
  });
});
