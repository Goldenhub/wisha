import { useState, useRef } from 'react';
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl font-light"
      >
        ✕
      </button>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Image preview */}
          {imagePreview ? (
            <div className="relative mb-6">
              <img
                src={imagePreview}
                alt="Wish"
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
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
              className="w-full h-64 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition"
            >
              <div className="text-6xl mb-2">📷</div>
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
              <p className="text-white text-xl text-center leading-relaxed">
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

      {/* Input area */}
      <div className="bg-black/80 backdrop-blur-lg p-4">
        {/* Name input */}
        <div className="max-w-md mx-auto mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-full px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Message input */}
        <div className="max-w-md mx-auto mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your wish..."
            rows={2}
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Emoji picker */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => toggleEmoji(emoji)}
                className={`w-12 h-12 text-2xl rounded-full transition-all ${
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
        <div className="max-w-md mx-auto">
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
        </div>

        {/* Error message */}
        {wishMutation.error && (
          <p className="text-red-400 text-sm text-center mt-3">
            {(wishMutation.error as Error).message || 'Failed to send wish'}
          </p>
        )}
      </div>
    </div>
  );
}
