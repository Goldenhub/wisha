import type { Wish } from '../types';

interface WishCardProps {
  wish: Wish;
}

export default function WishCard({ wish }: WishCardProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 max-w-md w-full text-center">
        {wish.imageUrl && (
          <img
            src={wish.imageUrl}
            alt="Wish"
            className="w-full h-48 object-cover rounded-2xl mb-6"
          />
        )}
        <p className="text-white text-xl mb-4 font-medium leading-relaxed">
          "{wish.message}"
        </p>
        <div className="flex items-center justify-between text-white/80 text-sm">
          <span className="font-semibold">
            {wish.name || 'Anonymous'}
          </span>
          <span>
            {new Date(wish.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
