import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import Header from '../components/Header';
import SEO from '../components/SEO';

interface Celebration {
  id: number;
  slug: string;
  title: string;
  type: string;
  eventDate: string;
  expiresAt: string;
  confettiCount: number;
  createdAt: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const { data: celebrations = [] } = useQuery<Celebration[]>({
    queryKey: ['my-celebrations'],
    queryFn: api.celebrations.getMyCelebrations,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/delete-account`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      logout();
      navigate('/');
    },
  });

  const handleExport = async () => {
    setExportStatus('loading');
    
    try {
      const celebrationsWithWishes = await Promise.all(
        celebrations.map(async (c: Celebration) => {
          const wishes = await api.celebrations.getWishes(c.id);
          return {
            title: c.title,
            type: c.type,
            eventDate: c.eventDate,
            expiresAt: c.expiresAt,
            confettiCount: c.confettiCount,
            createdAt: c.createdAt,
            wishes: wishes.map((w: { name: string | null; message: string; createdAt: string }) => ({
              name: w.name || 'Anonymous',
              message: w.message,
              createdAt: w.createdAt,
            })),
          };
        })
      );

      const exportData = {
        user: { email: user?.email },
        celebrations: celebrationsWithWishes,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weesha-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      setExportStatus('idle');
      console.error('Export failed:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <SEO title="Settings - Weesha" />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-8 pt-24 sm:pt-28 space-y-8">
          {/* Back link */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

          {/* Account Info */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.email}</p>
                <p className="text-sm text-gray-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Export Data */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h2>
            <p className="text-gray-600 text-sm mb-4">
              Download all your celebrations and data as a JSON file.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{celebrations.length}</strong> celebration{celebrations.length !== 1 ? 's' : ''} will be exported
              </p>
            </div>

            <button
              onClick={handleExport}
              disabled={exportStatus === 'loading'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                exportStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } disabled:opacity-50`}
            >
              {exportStatus === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : exportStatus === 'success' ? (
                <>
                  ✓ Downloaded!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </>
              )}
            </button>
          </section>

          {/* Delete Account */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your account will be archived for 3 days, then permanently deleted with all celebrations, wishes, and images.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-medium mb-2">⏰ What happens when you delete:</p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Your account will be archived immediately</li>
                    <li>• You can recover your account within 3 days by logging in</li>
                    <li>• After 3 days, everything will be permanently deleted</li>
                    <li>• All {celebrations.length} celebration{celebrations.length !== 1 ? 's' : ''} and images will be removed</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-gray-700">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || deleteMutation.isPending}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete My Account'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>

                {deleteMutation.error && (
                  <p className="text-red-600 text-sm">Failed to delete account. Please try again.</p>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
