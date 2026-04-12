import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getVisitorId } from '../api/client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EMOJIS = ['❤️', '🎉', '🥳', '🎂', '🎁', '✨', '🌟', '💖', '🎊', '👏', '🤗', '💕'];

interface WishFormProps {
  celebrationId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WishForm({ celebrationId, onClose, onSuccess }: WishFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, []);

  const wishMutation = useMutation({
    mutationFn: async (data: { name?: string; message: string }) => {
      const formData = new FormData();
      formData.append('celebrationId', String(celebrationId));
      formData.append('name', data.name || '');
      formData.append('message', data.message);
      formData.append('visitorId', getVisitorId());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`${API_BASE}/api/wishes`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const fullMessage = selectedEmojis.length > 0
      ? `${selectedEmojis.join('')} ${message}`
      : message;

    if (!fullMessage.trim()) return;

    wishMutation.mutate({
      name: name || undefined,
      message: fullMessage.trim(),
    });
  };

  const fullMessage = selectedEmojis.length > 0
    ? `${selectedEmojis.join('')} ${message}`
    : message;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col safe-area-bottom"
      style={{ height: '100dvh' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl font-light bg-black/30 rounded-full"
      >
        ←
      </button>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl font-light bg-black/30 rounded-full"
      >
        ✕
      </button>

      {/* Preview area - scrollable */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-4 pt-16">
        <div className="max-w-md w-full">
          {/* Image preview */}
          {imagePreview ? (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="Wish"
                className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition"
            >
              <div className="text-5xl mb-2">📷</div>
              <p className="text-white/80 text-sm">Tap to add photo</p>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Message preview */}
          {fullMessage && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
              <p className="text-white text-lg sm:text-xl text-center leading-relaxed">
                "{fullMessage}"
              </p>
              {name && (
                <p className="text-white/60 text-sm text-center mt-2">
                  — {name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom with padding for keyboard */}
      <div className="bg-black/90 backdrop-blur-lg p-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Name input */}
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-full px-4 py-3 text-center text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Message input */}
          <div className="mb-3">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your wish..."
              rows={2}
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            />
          </div>

          {/* Emoji picker - scrollable on mobile */}
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-2 justify-start pb-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => toggleEmoji(emoji)}
                  className={`w-11 h-11 text-xl rounded-full transition-all flex-shrink-0 ${
                    selectedEmojis.includes(emoji)
                      ? 'bg-purple-500 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={wishMutation.isPending || !fullMessage.trim()}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
              fullMessage.trim()
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg'
                : 'bg-white/10 text-white/40'
            } disabled:cursor-not-allowed`}
          >
            {wishMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🎉 Send Wish
              </span>
            )}
          </button>

          {/* Error message */}
          {wishMutation.error && (
            <p className="text-red-400 text-sm text-center mt-3">
              {(wishMutation.error as Error).message || 'Failed to send wish'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
