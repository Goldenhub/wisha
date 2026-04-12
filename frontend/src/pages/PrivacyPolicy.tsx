import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Header from '../components/Header';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy - Weesha" />
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500 mt-2">Last updated: April 12, 2026</p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Weesha, we believe your celebrations should be as private as they are memorable. 
              This policy explains how we collect, use, and protect your information.
            </p>
          </section>

          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">1</span>
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">We collect only what you share with us:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <strong className="text-gray-800">Account Information</strong>
                  <p className="text-gray-600 text-sm">Email address and password when you register for an account</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <strong className="text-gray-800">Celebration Content</strong>
                  <p className="text-gray-600 text-sm">Event titles, dates, and wishes shared by you and your guests</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <strong className="text-gray-800">Uploaded Images</strong>
                  <p className="text-gray-600 text-sm">Photos you choose to upload for your celebrations</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <div className="grid gap-3">
              {[
                'Provide and maintain our celebration services',
                'Process your celebrations and manage your account',
                'Send you important updates and support messages',
                'Improve our platform for everyone'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">3</span>
              Information Sharing
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium mb-1">We never sell your data</p>
              <p className="text-green-700 text-sm">
                Your personal information is never sold, traded, or transferred to third parties. 
                Celebration pages are shared only at your discretion.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">4</span>
              Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your celebrations expire after 3 days and become read-only memories. 
              We retain celebration data in this memory format so you and your guests 
              can revisit those special moments forever.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">5</span>
              Cookies & Security
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Cookies</h3>
                <p className="text-gray-600 text-sm">
                  We use essential session cookies to keep you logged in. No tracking or advertising cookies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Security</h3>
                <p className="text-gray-600 text-sm">
                  Your data is protected with industry-standard security measures. While no system is 100% secure, 
                  we continuously work to keep your information safe.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">6</span>
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4">You have complete control over your data:</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Access', desc: 'View all your data anytime' },
                { title: 'Delete', desc: 'Remove your account and data' },
                { title: 'Export', desc: 'Download your celebrations' }
              ].map((right, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="font-semibold text-purple-700">{right.title}</div>
                  <div className="text-sm text-purple-600">{right.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-2">Questions?</h2>
            <p className="text-white/90 mb-4">
              We're here to help. Reach out to our privacy team:
            </p>
            <a 
              href="mailto:privacy@demo.weesha.com" 
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
            >
              privacy@demo.weesha.com
            </a>
          </section>

          {/* Footer Links */}
          <div className="text-center pt-4">
            <Link to="/terms" className="text-purple-600 hover:underline">
              Read our Terms of Use →
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
