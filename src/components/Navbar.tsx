import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal, { getUserFromToken } from './AuthModal';
import { Button } from '../shared/components/ui';


interface NavbarProps {
  /** If true, automatically open the login modal (used by redirected pages) */
  openLoginModal?: boolean;
}

interface AuthUser {
  username: string;
  email: string;
}


const Navbar: React.FC<NavbarProps> = ({ openLoginModal = false }) => {
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'signup'>('login');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  /* ── Restore auth from localStorage on mount ── */
  useEffect(() => {
    const token = localStorage.getItem('fruitytics_token');
    if (token) {
      const user = getUserFromToken(token);
      if (user) setAuthUser(user);
    }
  }, []);

  /* ── Open login modal when parent requests it (e.g. redirected page) ── */
  useEffect(() => {
    if (openLoginModal) {
      setModalTab('login');
      setModalOpen(true);
    }
  }, [openLoginModal]);

  /* ── Auth success callback (called by AuthModal) ── */
  const handleAuthSuccess = (token: string, user: AuthUser) => {
    localStorage.setItem('fruitytics_token', token);
    setAuthUser(user);
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem('fruitytics_token');
    setAuthUser(null);
  };

  const openLogin = () => { setModalTab('login'); setModalOpen(true); };
  const openSignup = () => { setModalTab('signup'); setModalOpen(true); };

  /* ── Active link helper ── */
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
     <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-zinc-900 py-4">
     <div className="max-w-7xl mx-auto w-full px-3  flex justify-between items-center">
        {/* ── Left: Logo + Brand ── */}
        <Link to="/" className="flex items-center gap-2 lg:gap-3 no-underline">
          <div className="w-6 h-6  lg:w-8 lg:h-8 bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-zinc-950 font-black text-sm  lg:text-xl leading-none">F</span>
          </div>
          <span
            className="font-label font-bold tracking-[0.2em] lg:tracking-[0.25em] text-xs sm:text-[1.1rem]  uppercase"
            style={{ color: '#FF6B00' }}
          >
            FRUITYTICS
          </span>
        </Link>

        {/* ── Center: Nav links ── */}
        <nav className="hidden md:flex gap-8 font-label text-[14px]  tracking-widest uppercase items-center">
          <Link
            to="/"
            className="transition-colors"
            style={{ color: isActive('/') ? '#FF6B00' : '#666' }}
          >
            Home
          </Link>
          <Link
            to="/analysis"
            className="transition-colors"
            style={{ color: isActive('/analysis') ? '#FF6B00' : '#666' }}
          >
            Analysis
          </Link>
          {/* <Link
            to="/admin/dashboard"
            className="transition-colors"
            style={{ color: isActive('/admin/dashboard') ? '#FF6B00' : '#666' }}
          >
            Archives
          </Link> */}
        </nav>

        {/* ── Right: Auth buttons or user info ── */}
        <div className="flex items-center gap-3 font-label text-[10px]">
          {authUser ? (
            /* ── Logged-in state ── */
            <div className="flex items-center gap-4">
  {/* Wrap avatar and dropdown in a relative group container */}
  <div className="relative group pb-2"> 
    
    {/* Avatar */}
    <span
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FF6B00]/15 font-mono text-lg font-bold text-[#FF6B00] select-none transition-transform active:scale-95"
      title={authUser.username}
    >
      {authUser.username.charAt(0).toUpperCase()}
    </span>

    {/* Dropdown Menu (Hidden by default, flex on group-hover) */}
    <div className="w-fit absolute right-0 top-full z-50 hidden rounded border border-gray-200  p-1 shadow-lg group-hover:flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
      <Button
        onClick={handleLogout}
        variant="text"
        className=" !justify-center  hover:bg-[#FF6B00]/15  text-red-600 font-mono"
      >
        LOGOUT
      </Button>
    </div>

  </div>
</div>
          ) : (
            /* ── Guest state ── */
            <div className="flex items-center gap-2">
              <Button
                id="nav-login-btn"
                onClick={openLogin}
                variant="outline"
                className=' text-[10px] lg:text-sm tracking-widest px-1.5 py-1 lg:px-4 lg:py-2.5'             
              >
                LOGIN
              </Button>
              <Button
                id="nav-signup-btn"
                onClick={openSignup}
                variant="primary"
                className='text-[10px] lg:text-sm tracking-widest px-1.5 py-1 lg:px-4  lg:py-2.5'
              >
                SIGNUP
              </Button>
            </div>
          )}
        </div></div>
      </header>

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={modalOpen}
        defaultTab={modalTab}
        onClose={() => setModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Navbar;
