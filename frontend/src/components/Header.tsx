import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" className="flex-shrink-0">
    <defs>
      <linearGradient id="cone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#a855f7'}}/>
        <stop offset="100%" style={{stopColor:'#ec4899'}}/>
      </linearGradient>
    </defs>
    <polygon points="16,2 28,28 4,28" fill="url(#cone)"/>
    <line x1="10" y1="14" x2="16" y2="4" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="22" y1="14" x2="16" y2="4" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="6" y1="26" x2="26" y2="26" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="8" y1="20" x2="24" y2="20" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.3"/>
    <circle cx="6" cy="6" r="2" fill="#fbbf24"/>
    <circle cx="26" cy="8" r="1.5" fill="#34d399"/>
    <circle cx="4" cy="12" r="1" fill="#f472b6"/>
    <circle cx="28" cy="4" r="1.5" fill="#60a5fa"/>
    <circle cx="10" cy="2" r="1" fill="#fbbf24"/>
  </svg>
);

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
        >
          <LogoIcon />
          <span>Weesha</span>
        </Link>
        
        {/* Desktop Navigation - Always visible on desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition text-sm"
              >
                Dashboard
              </Link>
              <Link 
                to="/settings" 
                className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition text-sm"
              >
                Settings
              </Link>
            </>
          ) : (
            <Link 
              to="/auth?mode=login" 
              className="px-5 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition text-sm"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button - Always visible on mobile */}
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-purple-600"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={closeMenu}
          />
          
          {/* Dropdown */}
          <div 
            ref={menuRef}
            className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 md:hidden"
          >
            <nav className="flex flex-col p-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="px-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className="px-4 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    Settings
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth?mode=login"
                  onClick={closeMenu}
                  className="px-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
