# Shared Hooks

Reusable React hooks for common patterns.

## useAppDispatch

Typed Redux dispatch hook.

**Usage:**
```typescript
import { useAppDispatch } from '@shared/hooks';

const dispatch = useAppDispatch();
dispatch(someAction());
```

## useAppSelector

Typed Redux selector hook.

**Usage:**
```typescript
import { useAppSelector } from '@shared/hooks';

const user = useAppSelector((state) => state.auth.user);
```

## useMemoizedSelector

Memoized selector hook for performance.

**Usage:**
```typescript
import { useMemoizedSelector } from '@shared/hooks';

const users = useMemoizedSelector((state) => state.data.users);
```

## useFeatureFlag

Feature flag hook.

**Usage:**
```typescript
import { useFeatureFlag } from '@shared/hooks';

const isEnabled = useFeatureFlag('new-feature');
```

