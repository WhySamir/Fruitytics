/**
 * Main App Component
 * Sets up routing with advanced code splitting for better performance
 */

import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute, DefaultLayout } from './shared/components';
import { lazyWithRetry, preloadRoute } from './shared/utils/lazyLoad';

// Lazy load pages with retry logic for better reliability
const LandingPage = lazyWithRetry(() => import('./features/landing'));
const DashboardPage = lazyWithRetry(() => import('./features/dashboard'));
const PageSetupPage = lazyWithRetry(() => import('./features/page-setup'));
const AnalysisPage = lazyWithRetry(() =>
  import('./features/analysis').then((m) => ({ default: m.AnalysisPage }))
);

// Preload routes on hover (UX optimization)
if (typeof window !== 'undefined') {
  const preloadOnHover = (route: () => Promise<unknown>) => {
    const links = document.querySelectorAll(`a[href^="/admin"]`);
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => preloadRoute(route), {
        once: true,
      });
    });
  };

  // Preload admin routes on hover
  preloadOnHover(() => import('./features/dashboard'));
  preloadOnHover(() => import('./features/page-setup'));
}

/**
 * Loading fallback component
 */
function LoadingFallback(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="font-label text-accent text-xl animate-pulse tracking-widest">
          INITIALIZING_LAB_SYSTEM...
        </div>
        <div className="font-label text-zinc-600 text-[10px] uppercase">
          Booting_Optical_Link v1.0.4
        </div>
      </div>
    </div>
  );
}

/**
 * App Component
 * Main application router
 */
const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
              LayoutComponent={DefaultLayout}
            />
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="page-setup" element={<PageSetupPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
