# Shared Services

Enterprise-level services for API, caching, logging, and more.

## API Service

**File:** `api.ts`

Centralized HTTP client with:
- Request caching
- Request deduplication
- Error handling
- Security headers
- CSRF protection
- Rate limiting

**Usage:**
```typescript
import { apiGet, apiPost } from '@shared/services';

const users = await apiGet<User[]>('/users');
const newUser = await apiPost<User>('/users', userData);
```

## Cache Service

**File:** `cache.ts`

Request caching with:
- TTL-based expiration
- Request deduplication
- Pattern-based invalidation
- Memory-efficient storage

**Usage:**
```typescript
import { cacheService } from '@shared/services';

const data = await cacheService.getOrFetch(
  'key',
  () => fetchData(),
  5 * 60 * 1000 // 5 minutes
);
```

## Logger Service

**File:** `logger.ts`

Structured logging with:
- Log levels (debug, info, warn, error)
- Sensitive data sanitization
- Environment-aware logging

**Usage:**
```typescript
import { logger } from '@shared/services';

logger.info('User logged in', { userId: user.id });
logger.error('API error', error, { context });
```

## Performance Service

**File:** `performance.ts`

Web Vitals tracking:
- CLS, FCP, LCP, TTFB, INP
- Custom metrics
- Analytics integration

**Usage:**
```typescript
import { performanceService } from '@shared/services';

performanceService.measure('api-call', async () => {
  await apiCall();
});
```

## Error Reporting

**File:** `errorReporting.ts`

Centralized error reporting:
- Error sanitization
- Context capture
- Monitoring integration ready

**Usage:**
```typescript
import { errorReporting } from '@shared/services';

errorReporting.reportError(error, { context });
```

## Feature Flags

**File:** `featureFlags.ts`

Runtime feature toggling:
- User-based targeting
- Percentage rollouts
- A/B testing support

**Usage:**
```typescript
import { featureFlags } from '@shared/services';

if (featureFlags.isEnabled('new-feature')) {
  // Show new feature
}
```

