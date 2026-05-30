/**
 * Data management hook
 * Provides typed access to generic data state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import {
  setData,
  updateData,
  appendData,
  prependData,
  removeData,
  setLoading,
  resetData,
} from '../store/actions';
import type { ListState, ObjectState } from '../../../shared/types';

/**
 * Custom hook for managing generic data state
 */
export function useData<T = unknown>(key: string) {
  const dispatch = useAppDispatch();
  const data = useAppSelector(
    (state) => state.data[key] as ListState<T> | ObjectState<T> | undefined
  );

  const set = useCallback(
    (newData: ListState<T> | ObjectState<T>) => {
      dispatch(
        setData(key, newData as ListState<unknown> | ObjectState<unknown>)
      );
    },
    [dispatch, key]
  );

  const update = useCallback(
    (updates: Partial<ListState<T> | ObjectState<T>>) => {
      dispatch(updateData(key, updates));
    },
    [dispatch, key]
  );

  const append = useCallback(
    (items: T | T[]) => {
      dispatch(appendData(key, items as unknown));
    },
    [dispatch, key]
  );

  const prepend = useCallback(
    (items: T | T[]) => {
      dispatch(prependData(key, items as unknown));
    },
    [dispatch, key]
  );

  const remove = useCallback(
    (id: string | number) => {
      dispatch(removeData(key, id));
    },
    [dispatch, key]
  );

  const loading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(key, loading));
    },
    [dispatch, key]
  );

  const reset = useCallback(() => {
    dispatch(resetData(key));
  }, [dispatch, key]);

  return {
    // State
    data,
    isLoading: data?.loading || false,
    // Actions
    set,
    update,
    append,
    prepend,
    remove,
    loading,
    reset,
  };
}
