/**
 * Shared services barrel export
 */

export { errorReporting, handleErrorBoundaryError } from './errorReporting';
export { secureStorageService } from './secureStorage';
export {
  csrfService,
  rateLimitService,
  securityHeadersService,
  secureCookieService,
} from './security';
export { logger } from './logger';
export { cacheService } from './cache';
export { performanceService } from './performance';
export { featureFlags } from './featureFlags';
export {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  default as httpClient,
} from './api';
