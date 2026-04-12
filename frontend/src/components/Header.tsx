import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Weesha
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition">
                Dashboard
              </Link>
              <Link to="/settings" className="px-4 py-2 text-gray-600 hover:text-purple-600 transition">
                Settings
              </Link>
            </>
          ) : (
            <Link to="/auth?mode=login" className="px-5 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-purple-600"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t mt-2 rounded-2xl overflow-hidden">
          <nav className="flex flex-col p-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                >
                  Settings
                </Link>
              </>
            ) : (
              <Link
                to="/auth?mode=login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
