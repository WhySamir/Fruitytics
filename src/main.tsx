
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './shared/store/index.ts';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './app/providers';
import { ErrorBoundaryWrapper } from './shared/components';
import { errorReporting } from './shared/services/errorReporting.ts';
import { performanceService } from './shared/services/performance';

// Validate environment variables on startup
try {
  // This will throw if required env vars are missing
  import('./shared/config/env');
} catch (error) {
  errorReporting.reportError(error as Error, { source: 'startup' });
}

// Initialize performance monitoring
performanceService.init({
  enabled: true,
  sampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in dev
});

// Get root element with proper error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html has a #root element.'
  );
}

createRoot(rootElement).render(
  <ErrorBoundaryWrapper>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </ErrorBoundaryWrapper>
);
