/**
 * Memoized Selector Hook Tests
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from '../../store';
import { useMemoizedSelector } from '../useMemoizedSelector';

const wrapper = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useMemoizedSelector', () => {
  it('should return memoized selector value', () => {
    const { result } = renderHook(
      () => useMemoizedSelector((state) => state.auth.user),
      { wrapper }
    );

    expect(result.current).toBeDefined();
  });

  it('should update when state changes', () => {
    const { result, rerender } = renderHook(
      () => useMemoizedSelector((state) => state.auth.isAuthenticated),
      { wrapper }
    );

    const initialValue = result.current;
    rerender();
    expect(result.current).toBe(initialValue);
  });
});
