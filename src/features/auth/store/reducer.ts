/**
 * Authentication Redux reducer
 * Plain Redux reducer with immutable updates using immer
 */

import { produce } from 'immer';
import type { AuthState } from '../types';
import { AUTH_ACTION_TYPES } from './actions';
import type { AuthAction } from './actions';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

/**
 * Authentication reducer
 */
export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  return produce(state, (draft) => {
    switch (action.type) {
      case AUTH_ACTION_TYPES.SET_USER:
        draft.user = action.payload.user;
        draft.token = action.payload.token;
        draft.isAuthenticated = true;
        draft.error = null;
        break;

      case AUTH_ACTION_TYPES.UPDATE_USER:
        if (draft.user) {
          draft.user = { ...draft.user, ...action.payload };
        }
        break;

      case AUTH_ACTION_TYPES.SET_LOADING:
        draft.isLoading = action.payload;
        break;

      case AUTH_ACTION_TYPES.SET_ERROR:
        draft.error = action.payload;
        break;

      case AUTH_ACTION_TYPES.CLEAR_AUTH:
        draft.user = null;
        draft.token = null;
        draft.isAuthenticated = false;
        draft.error = null;
        draft.isLoading = false;
        break;

      default:
        // Return state unchanged for unknown actions
        break;
    }
  });
}
