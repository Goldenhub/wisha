import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import SEO from "../components/SEO";

const FEATURES = [
  {
    emoji: "🎁",
    title: "Collect Wishes",
    description: "Guests leave heartfelt messages and photos in a beautiful story format",
  },
  {
    emoji: "🎉",
    title: "Celebrate Together",
    description: "Confetti celebrations bring everyone closer, even from afar",
  },
  {
    emoji: "⏰",
    title: "Time-Bound",
    description: "Set an expiration date for that perfect moment, like a real celebration",
  },
  {
    emoji: "📱",
    title: "Share Anywhere",
    description: "Send via WhatsApp, email, or any app with one click",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <SEO 
        title="Weesha - Create Beautiful Celebration Pages" 
        description="Create time-bound celebration pages and collect heartfelt wishes from friends and family. Perfect for birthdays, weddings, graduations, and more." 
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Weesha
            </h1>
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-5 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition">
                Dashboard
              </Link>
            ) : (
              <Link to="/auth?mode=login" className="px-5 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-full transition">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🎂</div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Celebrate moments that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"> matter</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Create beautiful celebration pages and let friends and family share their wishes in a magical, story-like experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/create" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                    Create Celebration
                  </Link>
                  <Link to="/dashboard" className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-200 rounded-full font-semibold text-lg hover:border-purple-400 transition">
                    View My Celebrations
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                    Start Free — It's Easy
                  </Link>
                  <Link to="/auth?mode=login" className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-200 rounded-full font-semibold text-lg hover:border-purple-400 transition">
                    I Have an Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h3>
            <p className="text-gray-600 text-center mb-16 max-w-xl mx-auto">
              Simple to create, delightful to experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feature, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition">
                  <div className="text-5xl mb-4">{feature.emoji}</div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-4">Perfect for any celebration</h3>
            <p className="text-white/80 text-center mb-16 max-w-xl mx-auto">
              Birthdays, weddings, graduations — capture the magic
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-white">
              {["🎂 Birthday", "💒 Wedding", "👶 Baby Shower", "🎓 Graduation", "💼 Promotion", "🎉 Anniversary"].map((event) => (
                <div key={event} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition cursor-pointer">
                  <span className="text-lg font-medium">{event}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to celebrate?</h3>
            <p className="text-gray-600 mb-10">
              Create your first celebration page in under a minute. Free forever.
            </p>
            {isAuthenticated ? (
              <Link to="/create" className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                Create Your Celebration
              </Link>
            ) : (
              <Link to="/auth?mode=register" className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                Get Started Free
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2026 Weesha. Made with ❤️ for celebrations.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
