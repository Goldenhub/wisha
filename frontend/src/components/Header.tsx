import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" className="inline-block mr-2">
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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
        >
          <LogoIcon />
          <span className="hidden xs:inline">Weesha</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition text-sm"
              >
                Dashboard
              </Link>
              <Link 
                to="/settings" 
                className="px-4 py-2 text-gray-600 hover:text-purple-600 transition text-sm"
              >
                Settings
              </Link>
            </>
          ) : (
            <Link 
              to="/auth?mode=login" 
              className="px-5 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition text-sm"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-purple-600 relative z-[60]"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu Dropdown */}
      <div 
        ref={menuRef}
        className={`absolute top-full left-0 right-0 bg-white shadow-xl z-50 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-3 border-t">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition text-base"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition text-base"
              >
                Settings
              </Link>
            </>
          ) : (
            <Link
              to="/auth?mode=login"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition text-base"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
