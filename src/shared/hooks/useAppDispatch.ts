/**
 * Typed dispatch hook
 * Use instead of useDispatch for type safety
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
