/**
 * AuthModal – Login / Signup modal for Fruitytics
 * Dark terminal aesthetic, JWT wiring to FastAPI /auth/login & /auth/register
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../shared/components/ui';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface AuthModalProps {
  isOpen: boolean;
  defaultTab?: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (token: string, user: { username: string; email: string }) => void;
}

type Tab = 'login' | 'signup';

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/** Decode JWT payload without verification (display only) */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Derive a display-safe user from a JWT token */
export function getUserFromToken(token: string): { username: string; email: string } | null {
  const payload = decodeJWT(token);
  if (!payload) return null;
  const email = (payload['sub'] ?? payload['email'] ?? '') as string;
  const username = (payload['username'] ?? email.split('@')[0] ?? 'USER') as string;
  return { email, username };
}

/* ─── Inline styles (no Tailwind classes, pure inline for the modal overlay) */

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
};

const card: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #222',
  width: '100%',
  maxWidth: '480px',
  margin: '0 1rem',
  fontFamily: '"Geist Mono", monospace',
  position: 'relative',
};

const headerBar: React.CSSProperties = {
  background: '#0a0a0a',
  borderBottom: '1px solid #222',
  padding: '1rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};



const tabRow: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid #222',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#fff',
  fontFamily: '"Geist Mono", monospace',
  fontSize: '0.75rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  letterSpacing: '0.05em',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Geist Mono", monospace',
  fontSize: '0.6rem',
  color: '#888',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};



const errorStyle: React.CSSProperties = {
  color: '#FF6B00',
  fontFamily: '"Geist Mono", monospace',
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  marginTop: '0.25rem',
};

/* ─── Component ──────────────────────────────────────────────────────────── */

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, defaultTab = 'login', onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup fields
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // Sync tab when parent changes defaultTab
  useEffect(() => {
    setTab(defaultTab);
    setApiError('');
  }, [defaultTab, isOpen]);

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  /* ── Validation ── */
  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) errs['email'] = 'EMAIL_REQUIRED';
    if (!loginPassword) errs['password'] = 'PASSWORD_REQUIRED';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignup = () => {
    const errs: Record<string, string> = {};
    if (!signupUsername.trim()) errs['username'] = 'USERNAME_REQUIRED';
    if (!signupEmail.trim()) errs['email'] = 'EMAIL_REQUIRED';
    if (!signupPassword) errs['password'] = 'PASSWORD_REQUIRED';
    if (!signupConfirm) errs['confirm'] = 'CONFIRM_PASSWORD_REQUIRED';
    if (signupPassword && signupConfirm && signupPassword !== signupConfirm)
      errs['confirm'] = 'PASSWORDS_DO_NOT_MATCH';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── API calls ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json() as { access_token?: string; token?: string; detail?: string; message?: string };

      if (!res.ok) {
        setApiError(String(data.detail ?? data.message ?? 'AUTHENTICATION_FAILED'));
        return;
      }

      const token = data.access_token ?? data.token ?? '';
      localStorage.setItem('fruitytics_token', token);
      const user = getUserFromToken(token) ?? { username: loginEmail.split('@')[0] ?? 'USER', email: loginEmail };
      onAuthSuccess(token, user);
      onClose();
    } catch {
      setApiError('NETWORK_ERROR // BACKEND_UNREACHABLE');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateSignup()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json() as { access_token?: string; token?: string; detail?: string; message?: string };

      if (!res.ok) {
        setApiError(String(data.detail ?? data.message ?? 'REGISTRATION_FAILED'));
        return;
      }

      const token = data.access_token ?? data.token ?? '';
      localStorage.setItem('fruitytics_token', token);
      const user = getUserFromToken(token) ?? { username: signupUsername, email: signupEmail };
      onAuthSuccess(token, user);
      onClose();
    } catch {
      setApiError('NETWORK_ERROR // BACKEND_UNREACHABLE');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setApiError('');
    setLoginErrors({});
    setSignupErrors({});
  };



  const fieldWrapper: React.CSSProperties = { marginBottom: '1rem' };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={card}>
        {/* ── Header ── */}
        <div style={headerBar}>
          <span style={{ color: '#FF6B00', fontSize: '0.65rem', letterSpacing: '0.2em' }}>
             FRUITYTICS LOGIN / SIGN UP
          </span>
          <Button
            onClick={onClose}
            variant="ghost"
            size="xs"
            className="text-accent tracking-wider p-1"
            aria-label="Close modal"
          >
            [ X ]
          </Button>
        </div>

        {/* ── Tabs ── */}
        <div style={tabRow}>
          <Button
            onClick={() => switchTab('login')}
            variant="ghost"
            className="flex-1 rounded-none border-b-2 py-3.5 text-[10px] tracking-widest transition-all duration-150"
            style={{
              borderColor: tab === 'login' ? '#FF6B00' : 'transparent',
              color: tab === 'login' ? '#FF6B00' : '#888',
            }}
          >
            [ LOGIN ]
          </Button>
          <Button
            onClick={() => switchTab('signup')}
            variant="ghost"
            className="flex-1 rounded-none border-b-2 py-3.5 text-[10px] tracking-widest transition-all duration-150"
            style={{
              borderColor: tab === 'signup' ? '#FF6B00' : 'transparent',
              color: tab === 'signup' ? '#FF6B00' : '#888',
            }}
          >
            [ SIGNUP ]
          </Button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '1.5rem' }}>
          {/* Global API error */}
          {apiError && (
            <div style={{
              ...errorStyle,
              background: '#1a0900',
              border: '1px solid #FF6B0033',
              padding: '0.6rem 0.8rem',
              marginBottom: '1rem',
              fontSize: '0.65rem',
            }}>
              ⚠ {apiError}
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {tab === 'login' && (
            <form onSubmit={(e) => { void handleLogin(e); }} noValidate>
              <div style={fieldWrapper}>
                <label style={labelStyle}>Email</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: loginErrors['email'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = loginErrors['email'] ? '#FF6B00' : '#333')}
                  autoComplete="email"
                />
                {loginErrors['email'] && <p style={errorStyle}>▸ {loginErrors['email']}</p>}
              </div>

              <div style={fieldWrapper}>
                <label style={labelStyle}>Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: loginErrors['password'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = loginErrors['password'] ? '#FF6B00' : '#333')}
                  autoComplete="current-password"
                />
                {loginErrors['password'] && <p style={errorStyle}>▸ {loginErrors['password']}</p>}
              </div>

              <Button
                id="login-submit"
                type="submit"
                loading={loading}
                variant="primary"
                fullWidth
                size="md"
                className="mt-2"
              >
                AUTHENTICATE
              </Button>

              <p style={{ ...labelStyle, marginTop: '1rem', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => switchTab('signup')}>
                NO_ACCOUNT_YET?{' '}
                <span style={{ color: '#FF6B00' }}>CREATE_ONE</span>
              </p>
            </form>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {tab === 'signup' && (
            <form onSubmit={(e) => { void handleSignup(e); }} noValidate>
              <div style={fieldWrapper}>
                <label style={labelStyle}>Username</label>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="USERNAME"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: signupErrors['username'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = signupErrors['username'] ? '#FF6B00' : '#333')}
                  autoComplete="username"
                />
                {signupErrors['username'] && <p style={errorStyle}>▸ {signupErrors['username']}</p>}
              </div>

              <div style={fieldWrapper}>
                <label style={labelStyle}>Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: signupErrors['email'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = signupErrors['email'] ? '#FF6B00' : '#333')}
                  autoComplete="email"
                />
                {signupErrors['email'] && <p style={errorStyle}>▸ {signupErrors['email']}</p>}
              </div>

              <div style={fieldWrapper}>
                <label style={labelStyle}>Password</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: signupErrors['password'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = signupErrors['password'] ? '#FF6B00' : '#333')}
                  autoComplete="new-password"
                />
                {signupErrors['password'] && <p style={errorStyle}>▸ {signupErrors['password']}</p>}
              </div>

              <div style={fieldWrapper}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••••••"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: signupErrors['confirm'] ? '#FF6B00' : '#333',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = signupErrors['confirm'] ? '#FF6B00' : '#333')}
                  autoComplete="new-password"
                />
                {signupErrors['confirm'] && <p style={errorStyle}>▸ {signupErrors['confirm']}</p>}
              </div>

              <Button
                id="signup-submit"
                type="submit"
                loading={loading}
                variant="primary"
                fullWidth
                size="md"
                className="mt-2"
              >
                CREATE ACCOUNT
              </Button>

              <p style={{ ...labelStyle, marginTop: '1rem', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => switchTab('login')}>
                ALREADY_REGISTERED?{' '}
                <span style={{ color: '#FF6B00' }}>SIGN_IN</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
