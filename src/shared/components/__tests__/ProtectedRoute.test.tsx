/**
 * Protected Route Tests
 * Critical security component tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '../../../features/auth/hooks/useAuth';

// Mock useAuth
vi.mock('../../../features/auth/hooks/useAuth');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated users', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route path="/test" element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Should redirect, so protected content not visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow authenticated users', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', role: 'admin' },
      isAuthenticated: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route path="/test" element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should check role authorization', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', role: 'user' },
      isAuthenticated: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route
              path="/test"
              element={<ProtectedRoute allowedRoles={['admin']} />}
            >
              <Route index element={<div>Admin Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Should redirect due to role mismatch
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
