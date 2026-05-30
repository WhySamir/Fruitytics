/**
 * Data Redux actions
 * Plain Redux action creators and types
 */

import type { ListState, ObjectState } from '../../../shared/types';

/**
 * Action types
 */
export const DATA_ACTION_TYPES = {
  SET_DATA: 'data/SET_DATA',
  UPDATE_DATA: 'data/UPDATE_DATA',
  APPEND_DATA: 'data/APPEND_DATA',
  PREPEND_DATA: 'data/PREPEND_DATA',
  REMOVE_DATA: 'data/REMOVE_DATA',
  SET_LOADING: 'data/SET_LOADING',
  RESET_DATA: 'data/RESET_DATA',
} as const;

/**
 * Action creators
 */
export interface SetDataAction {
  type: typeof DATA_ACTION_TYPES.SET_DATA;
  payload: {
    key: string;
    data: ListState<unknown> | ObjectState<unknown>;
  };
}

export interface UpdateDataAction {
  type: typeof DATA_ACTION_TYPES.UPDATE_DATA;
  payload: {
    key: string;
    data: Partial<ListState<unknown> | ObjectState<unknown>>;
  };
}

export interface AppendDataAction {
  type: typeof DATA_ACTION_TYPES.APPEND_DATA;
  payload: {
    key: string;
    items: unknown | unknown[];
  };
}

export interface PrependDataAction {
  type: typeof DATA_ACTION_TYPES.PREPEND_DATA;
  payload: {
    key: string;
    items: unknown | unknown[];
  };
}

export interface RemoveDataAction {
  type: typeof DATA_ACTION_TYPES.REMOVE_DATA;
  payload: {
    key: string;
    id: string | number;
  };
}

export interface SetLoadingAction {
  type: typeof DATA_ACTION_TYPES.SET_LOADING;
  payload: {
    key: string;
    loading: boolean;
  };
}

export interface ResetDataAction {
  type: typeof DATA_ACTION_TYPES.RESET_DATA;
  payload: string;
}

/**
 * Union of all data actions
 */
export type DataAction =
  | SetDataAction
  | UpdateDataAction
  | AppendDataAction
  | PrependDataAction
  | RemoveDataAction
  | SetLoadingAction
  | ResetDataAction;

/**
 * Action creator functions
 */
export const setData = (
  key: string,
  data: ListState<unknown> | ObjectState<unknown>
): SetDataAction => ({
  type: DATA_ACTION_TYPES.SET_DATA,
  payload: { key, data },
});

export const updateData = (
  key: string,
  data: Partial<ListState<unknown> | ObjectState<unknown>>
): UpdateDataAction => ({
  type: DATA_ACTION_TYPES.UPDATE_DATA,
  payload: { key, data },
});

export const appendData = (
  key: string,
  items: unknown | unknown[]
): AppendDataAction => ({
  type: DATA_ACTION_TYPES.APPEND_DATA,
  payload: { key, items },
});

export const prependData = (
  key: string,
  items: unknown | unknown[]
): PrependDataAction => ({
  type: DATA_ACTION_TYPES.PREPEND_DATA,
  payload: { key, items },
});

export const removeData = (
  key: string,
  id: string | number
): RemoveDataAction => ({
  type: DATA_ACTION_TYPES.REMOVE_DATA,
  payload: { key, id },
});

export const setLoading = (
  key: string,
  loading: boolean
): SetLoadingAction => ({
  type: DATA_ACTION_TYPES.SET_LOADING,
  payload: { key, loading },
});

export const resetData = (key: string): ResetDataAction => ({
  type: DATA_ACTION_TYPES.RESET_DATA,
  payload: key,
});
