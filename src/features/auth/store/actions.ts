/**
 * Authentication Redux actions
 * Plain Redux action creators and types
 */

import type { User } from '../types';

/**
 * Action types
 */
export const AUTH_ACTION_TYPES = {
  SET_USER: 'auth/SET_USER',
  UPDATE_USER: 'auth/UPDATE_USER',
  SET_LOADING: 'auth/SET_LOADING',
  SET_ERROR: 'auth/SET_ERROR',
  CLEAR_AUTH: 'auth/CLEAR_AUTH',
} as const;

/**
 * Action type union
 */
export type AuthActionType =
  | typeof AUTH_ACTION_TYPES.SET_USER
  | typeof AUTH_ACTION_TYPES.UPDATE_USER
  | typeof AUTH_ACTION_TYPES.SET_LOADING
  | typeof AUTH_ACTION_TYPES.SET_ERROR
  | typeof AUTH_ACTION_TYPES.CLEAR_AUTH;

/**
 * Action creators
 */
export interface SetUserAction {
  type: typeof AUTH_ACTION_TYPES.SET_USER;
  payload: { user: User; token: string };
}

export interface UpdateUserAction {
  type: typeof AUTH_ACTION_TYPES.UPDATE_USER;
  payload: Partial<User>;
}

export interface SetLoadingAction {
  type: typeof AUTH_ACTION_TYPES.SET_LOADING;
  payload: boolean;
}

export interface SetErrorAction {
  type: typeof AUTH_ACTION_TYPES.SET_ERROR;
  payload: string | null;
}

export interface ClearAuthAction {
  type: typeof AUTH_ACTION_TYPES.CLEAR_AUTH;
}

/**
 * Union of all auth actions
 */
export type AuthAction =
  | SetUserAction
  | UpdateUserAction
  | SetLoadingAction
  | SetErrorAction
  | ClearAuthAction;

/**
 * Action creator functions
 */
export const setUser = (user: User, token: string): SetUserAction => ({
  type: AUTH_ACTION_TYPES.SET_USER,
  payload: { user, token },
});

export const updateUser = (userData: Partial<User>): UpdateUserAction => ({
  type: AUTH_ACTION_TYPES.UPDATE_USER,
  payload: userData,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: AUTH_ACTION_TYPES.SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null): SetErrorAction => ({
  type: AUTH_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const clearAuth = (): ClearAuthAction => ({
  type: AUTH_ACTION_TYPES.CLEAR_AUTH,
});
