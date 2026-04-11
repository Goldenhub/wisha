import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 animate-bounce">
          Wisha
        </h1>
        <p className="text-2xl mb-8 opacity-90">
          Create time-bound celebration pages and share the joy
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                My Celebrations
              </Link>
              <Link
                to="/create"
                className="px-8 py-4 bg-purple-700 text-white rounded-full font-semibold text-lg hover:bg-purple-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Create New
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="px-8 py-4 bg-purple-700 text-white rounded-full font-semibold text-lg hover:bg-purple-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">🎂</div>
            <h3 className="font-semibold text-lg">Birthdays</h3>
            <p className="text-sm opacity-80 mt-2">Celebrate special days with loved ones</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">💒</div>
            <h3 className="font-semibold text-lg">Weddings</h3>
            <p className="text-sm opacity-80 mt-2">Share your special moment</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="font-semibold text-lg">Baby Showers</h3>
            <p className="text-sm opacity-80 mt-2">Welcome the newest arrival</p>
          </div>
        </div>
      </div>
    </div>
  );
}
