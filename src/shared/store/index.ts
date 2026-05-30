/**
 * Redux store configuration
 * Plain Redux with combineReducers
 *
 * Note: Type assertions are required due to a known TypeScript limitation with
 * combineReducers. The types are correct at runtime, but TypeScript's inference
 * for combineReducers doesn't match createStore's expected types exactly.
 */

import { createStore, combineReducers } from 'redux';
import type { Store, Reducer } from 'redux';
import { authReducer } from '../../features/auth/store';
import type { AuthAction } from '../../features/auth/store/actions';
import { dataReducer } from '../../features/data/store';
import type { DataAction } from '../../features/data/store/actions';

/**
 * Union of all actions
 */
export type AppAction = AuthAction | DataAction;

/**
 * Root state type
 */
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  data: ReturnType<typeof dataReducer>;
}

/**
 * Root reducer combining all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  // Add other feature reducers here
});

/**
 * Redux DevTools extension
 */
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => unknown;
  }
}

/**
 * Create Redux store
 *
 * Note: Type assertion needed due to TypeScript limitation with combineReducers
 * The reducer types are correct at runtime
 */
export const store: Store<RootState, AppAction> = (() => {
  if (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__
  ) {
    // Type assertion needed due to TypeScript limitation with combineReducers
    return createStore(
      rootReducer as unknown as Reducer<RootState, AppAction>,
      window.__REDUX_DEVTOOLS_EXTENSION__() as never
    ) as Store<RootState, AppAction>;
  }
  // Type assertion needed due to TypeScript limitation with combineReducers
  return createStore(
    rootReducer as unknown as Reducer<RootState, AppAction>
  ) as Store<RootState, AppAction>;
})();

// Enable HMR for Redux store in development
if (import.meta.hot) {
  import.meta.hot.accept(
    ['../../features/auth/store/reducer', '../../features/data/store/reducer'],
    () => {
      // Replace reducers on HMR
      store.replaceReducer(
        combineReducers({
          auth: authReducer,
          data: dataReducer,
        }) as unknown as Reducer<RootState, AppAction>
      );
    }
  );
}

export type AppDispatch = typeof store.dispatch;
