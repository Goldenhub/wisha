import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Header from '../components/Header';

export default function TermsOfUse() {
  return (
    <>
      <SEO title="Terms of Use - Weesha" />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />

        {/* Page Header */}
        <header className="bg-white border-b border-purple-100 pt-20">
          <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
            {/* Back link */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition mb-4"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <div className="text-sm text-purple-600 font-medium mb-2">Legal</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Use</h1>
            <p className="text-gray-500 mt-2">Last updated: April 12, 2026</p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Weesha! By using our platform, you agree to these terms. 
              They're here to ensure everyone has a great experience celebrating together.
            </p>
          </section>

          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">1</span>
              Our Service
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Weesha is a platform for creating time-bound celebration pages. 
              Friends and family can share wishes and celebrate special moments together 
              in a beautiful, story-like experience.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
              Celebration Duration
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 font-medium mb-1">⏰ 3 Days of Magic</p>
              <p className="text-amber-700 text-sm">
                All celebrations last 3 days after the event date. After that, 
                they become read-only "memory" pages that you and your guests can revisit forever.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">3</span>
              Your Responsibilities
            </h2>
            <p className="text-gray-600 mb-4">When using Weesha, you agree to:</p>
            <ul className="space-y-3">
              {[
                { title: 'Be honest', desc: 'Provide accurate information when creating celebrations' },
                { title: 'Be respectful', desc: 'Keep content appropriate for all audiences' },
                { title: 'Be safe', desc: 'Not attempt unauthorized access or disrupt our service' },
                { title: 'Be legal', desc: 'Use the platform only for lawful purposes' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs mt-0.5">✓</span>
                  <div>
                    <strong className="text-gray-800">{item.title}</strong>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">4</span>
              Content Guidelines
            </h2>
            <p className="text-gray-600 mb-4">All wishes and content must be appropriate. We may remove content that:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Is offensive, abusive, or inappropriate',
                'Violates third-party rights',
                'Contains spam or advertising',
                'Is illegal or harmful'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-red-500">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">5</span>
              Intellectual Property
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold text-gray-800">Weesha's Content</p>
                  <p className="text-gray-600 text-sm">
                    The Weesha platform, design, and features are protected by intellectual property rights.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💝</span>
                <div>
                  <p className="font-semibold text-gray-800">Your Content</p>
                  <p className="text-gray-600 text-sm">
                    You own the wishes and messages you create. By posting, you grant us permission to display 
                    them as part of your celebration.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">6</span>
              Disclaimer
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-600 text-sm">
                Weesha is provided "as is" without warranties. We're not liable for any damages 
                arising from your use of the service. Use it responsibly and have fun celebrating!
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">7</span>
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these terms occasionally. We'll notify you of significant changes. 
              Continued use of Weesha after changes means you accept the new terms.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">8</span>
              Account Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may suspend or terminate accounts that violate these terms or for any reason at our discretion. 
              You can also delete your account at any time from your settings.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-2">Questions?</h2>
            <p className="text-white/90 mb-4">
              For legal inquiries or concerns, contact us at:
            </p>
            <a 
              href="mailto:legal@demo.weesha.com" 
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
            >
              legal@demo.weesha.com
            </a>
          </section>

          {/* Footer Links */}
          <div className="text-center pt-4">
            <Link to="/privacy" className="text-purple-600 hover:underline">
              Read our Privacy Policy →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
