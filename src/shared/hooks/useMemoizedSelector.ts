/**
 * Memoized Selector Hook
 * Optimizes Redux selector performance with memoization
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { createSelector } from 'reselect';
import type { RootState } from '../store';

/**
 * Typed useSelector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Create a memoized selector
 */
export function createMemoizedSelector<TResult>(
  selector: (state: RootState) => TResult
) {
  return createSelector([selector], (result) => result);
}

/**
 * Use memoized selector
 */
export function useMemoizedSelector<TResult>(
  selector: (state: RootState) => TResult
): TResult {
  const memoizedSelector = useMemo(
    () => createMemoizedSelector(selector),
    [selector]
  );

  return useAppSelector(memoizedSelector);
}
