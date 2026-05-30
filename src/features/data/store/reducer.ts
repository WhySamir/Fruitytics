/**
 * Data Redux reducer
 * Manages generic list and object state
 * Plain Redux reducer with immutable updates using immer
 */

import { produce } from 'immer';
import type { ListState, ObjectState } from '../../../shared/types';
import { DATA_ACTION_TYPES } from './actions';
import type { DataAction } from './actions';

interface DataState {
  [key: string]: ListState<unknown> | ObjectState<unknown>;
}

const initialState: DataState = {};

/**
 * Data reducer
 */
export default function dataReducer(
  state: DataState = initialState,
  action: DataAction
): DataState {
  return produce(state, (draft) => {
    switch (action.type) {
      case DATA_ACTION_TYPES.SET_DATA: {
        const { key, data } = action.payload;
        draft[key] = {
          ...data,
          loading: false,
        } as ListState<unknown> | ObjectState<unknown>;
        break;
      }

      case DATA_ACTION_TYPES.UPDATE_DATA: {
        const { key, data } = action.payload;
        const existing = draft[key];
        if (existing) {
          draft[key] = {
            ...existing,
            ...data,
            loading: false,
          } as ListState<unknown> | ObjectState<unknown>;
        }
        break;
      }

      case DATA_ACTION_TYPES.APPEND_DATA: {
        const { key, items } = action.payload;
        const existing = draft[key] as ListState<unknown> | undefined;

        if (existing) {
          const itemsToAdd = Array.isArray(items) ? items : [items];

          if ('items' in existing && Array.isArray(existing.items)) {
            existing.items = [...existing.items, ...itemsToAdd];
            existing.totalItems =
              (existing.totalItems || 0) + itemsToAdd.length;
          } else if ('data' in existing && Array.isArray(existing.data)) {
            existing.data = [...existing.data, ...itemsToAdd];
          }
          existing.loading = false;
        }
        break;
      }

      case DATA_ACTION_TYPES.PREPEND_DATA: {
        const { key, items } = action.payload;
        const existing = draft[key] as ListState<unknown> | undefined;

        if (existing) {
          const itemsToAdd = Array.isArray(items) ? items : [items];

          if ('items' in existing && Array.isArray(existing.items)) {
            existing.items = [...itemsToAdd, ...existing.items];
            existing.totalItems =
              (existing.totalItems || 0) + itemsToAdd.length;
          } else if ('data' in existing && Array.isArray(existing.data)) {
            existing.data = [...itemsToAdd, ...existing.data];
          }
          existing.loading = false;
        }
        break;
      }

      case DATA_ACTION_TYPES.REMOVE_DATA: {
        const { key, id } = action.payload;
        const existing = draft[key] as ListState<unknown> | undefined;

        if (existing) {
          if ('items' in existing && Array.isArray(existing.items)) {
            existing.items = existing.items.filter(
              (item: unknown) =>
                typeof item === 'object' &&
                item !== null &&
                'id' in item &&
                item.id !== id
            );
            existing.totalItems = Math.max((existing.totalItems || 0) - 1, 0);
          } else if ('data' in existing && Array.isArray(existing.data)) {
            existing.data = existing.data.filter(
              (item: unknown) =>
                typeof item === 'object' &&
                item !== null &&
                'id' in item &&
                item.id !== id
            );
          }
        }
        break;
      }

      case DATA_ACTION_TYPES.SET_LOADING: {
        const { key, loading } = action.payload;
        const existing = draft[key];
        if (existing) {
          existing.loading = loading;
        }
        break;
      }

      case DATA_ACTION_TYPES.RESET_DATA: {
        delete draft[action.payload];
        break;
      }

      default:
        // Return state unchanged for unknown actions
        break;
    }
  });
}
