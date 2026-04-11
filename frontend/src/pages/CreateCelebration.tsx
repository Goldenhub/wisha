import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { EventType } from '../types';
import DatePicker from '../components/DatePicker';

const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'wedding', label: 'Wedding', emoji: '💒' },
  { value: 'babyshower', label: 'Baby Shower', emoji: '👶' },
  { value: 'anniversary', label: 'Anniversary', emoji: '❤️' },
  { value: 'graduation', label: 'Graduation', emoji: '🎓' },
  { value: 'other', label: 'Other', emoji: '🎉' },
];

export default function CreateCelebration() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('birthday');
  const [eventDate, setEventDate] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: api.celebrations.create,
    onSuccess: (data) => {
      setShareUrl(`${window.location.origin}/c/${data.slug}`);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/auth?mode=login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventDateObj = new Date(eventDate);
    const expiresAt = new Date(eventDateObj.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    createMutation.mutate({
      title,
      type,
      eventDate,
      expiresAt: expiresAt.toISOString(),
      coverImage,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { imageUrl } = await api.upload.image(file);
        setCoverImage(imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  if (shareUrl) {
    const handleShare = async () => {
      const shareData = {
        title: title,
        text: `Join me in celebrating ${title}!`,
        url: shareUrl,
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            navigator.clipboard.writeText(shareUrl);
          }
        }
      } else {
        navigator.clipboard.writeText(shareUrl);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Celebration Created!</h2>
          <p className="text-gray-600 mb-6">Share this link with your friends and family</p>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <code className="text-sm text-purple-600 break-all">{shareUrl}</code>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition"
            >
              Share
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Copy
            </button>
          </div>
          
          <button
            onClick={() => navigate(`/c/${shareUrl?.split('/c/')[1]}`)}
            className="mt-4 w-full px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
          >
            View Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-600">Create Celebration</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {createMutation.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {(createMutation.error as Error).message || 'Failed to create celebration'}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-3">Event Type</label>
            <div className="grid grid-cols-3 gap-3">
              {EVENT_TYPES.map((et) => (
                <button
                  key={et.value}
                  type="button"
                  onClick={() => setType(et.value)}
                  className={`p-4 rounded-xl border-2 transition ${
                    type === et.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{et.emoji}</span>
                  <span className="text-sm font-medium">{et.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., John's 30th Birthday"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
            <DatePicker
              value={eventDate}
              onChange={setEventDate}
            />
            <p className="text-sm text-gray-500 mt-2">
              Wishes will be open for 3 days after this date
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover preview"
                className="mt-4 w-full h-48 object-cover rounded-xl"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Celebration'}
          </button>
        </form>
      </main>
    </div>
  );
}
