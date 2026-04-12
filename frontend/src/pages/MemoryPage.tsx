import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { api } from '../api/client';

interface Wish {
  id: number;
  celebrationId: number;
  name: string | null;
  message: string;
  imageUrl: string | null;
  visitorId: string | null;
  createdAt: string;
}

export default function MemoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wishesRef = useRef<Wish[]>([]);
  const currentIndexRef = useRef(0);

  const { data: celebration, isLoading: loadingCelebration } = useQuery({
    queryKey: ['celebration', slug],
    queryFn: () => api.celebrations.getBySlug(slug!),
  });

  const { data: wishes = [], isLoading: loadingWishes } = useQuery({
    queryKey: ['wishes', celebration?.id],
    queryFn: () => api.celebrations.getWishes(celebration!.id),
    enabled: !!celebration?.id,
  });

  useEffect(() => {
    wishesRef.current = wishes;
  }, [wishes]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const isExpired = celebration && new Date(celebration.expiresAt) < new Date();
  
  if (!isExpired && celebration) {
    navigate(`/c/${slug}`);
    return null;
  }

  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    if (wishes.length > 0) {
      triggerCelebration();
    }
  }, [wishes.length, triggerCelebration]);

  const goToNext = useCallback(() => {
    const len = wishesRef.current.length;
    if (len === 0) return;
    const nextIndex = (currentIndexRef.current + 1) % len;
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    const len = wishesRef.current.length;
    if (len === 0) return;
    const prevIndex = (currentIndexRef.current - 1 + len) % len;
    currentIndexRef.current = prevIndex;
    setCurrentIndex(prevIndex);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }

    if (isPaused || wishesRef.current.length === 0) {
      return;
    }

    let progress = 0;

    progressRef.current = setInterval(() => {
      progress += 2;

      if (progress >= 100) {
        progress = 0;
        const len = wishesRef.current.length;
        if (len > 0) {
          const nextIndex = (currentIndexRef.current + 1) % len;
          currentIndexRef.current = nextIndex;
          setCurrentIndex(nextIndex);
        }
      }

      setProgress(progress);
    }, 50);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [isPaused]);

  const handleTap = (e: React.MouseEvent) => {
    const screenWidth = window.innerWidth;
    const tapX = e.clientX;
    
    if (tapX < screenWidth * 0.3) {
      goToPrev();
    } else if (tapX > screenWidth * 0.7) {
      goToNext();
    }
  };

  if (loadingCelebration || loadingWishes) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading memories...</div>
      </div>
    );
  }

  if (!celebration) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold">Memory Not Found</h2>
        </div>
      </div>
    );
  }

  const currentWish = wishes[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black cursor-pointer select-none"
      onClick={handleTap}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
        {wishes.map((_: unknown, i: number) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-50"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 right-0 z-40 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">{celebration.title}</h1>
            <p className="text-white/70 text-sm">
              Memory Replay • {wishes.length} wishes • 🎊 {celebration.confettiCount}
            </p>
          </div>
          <button
            onClick={() => navigate(`/c/${slug}`)}
            className="px-3 py-1 text-sm bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition"
          >
            Live →
          </button>
        </div>
      </div>

      {/* Wish content */}
      {currentWish ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-24">
          <div className="max-w-lg w-full text-center">
            {currentWish.imageUrl && (
              <img
                src={currentWish.imageUrl}
                alt="Wish"
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-2xl"
              />
            )}
            <p className="text-white text-2xl font-medium leading-relaxed mb-6">
              "{currentWish.message}"
            </p>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <span className="font-semibold text-lg">
                {currentWish.name || 'Anonymous'}
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm">
                {new Date(currentWish.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-8xl mb-6">🎊</div>
          <h2 className="text-white text-2xl font-bold mb-2">Memory Replay</h2>
          <p className="text-white/70">No wishes were left for this celebration</p>
        </div>
      )}

      {/* Navigation hints */}
      {wishes.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
          <div className="w-16 h-16 flex items-center justify-start pl-2">
            {currentIndex > 0 && (
              <div className="text-white/30 text-sm">←</div>
            )}
          </div>
          <div className="w-16 h-16 flex items-center justify-end pr-2">
            {currentIndex < wishes.length - 1 && (
              <div className="text-white/30 text-sm">→</div>
            )}
          </div>
        </div>
      )}

      {/* Wish counter */}
      {wishes.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 text-white/60 text-sm">
          {currentIndex + 1} / {wishes.length}
        </div>
      )}

      {/* Bottom footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-400 text-sm">
            This celebration ended on {new Date(celebration.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
