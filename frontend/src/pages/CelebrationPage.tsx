import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { api, getVisitorId } from '../api/client';
import WishForm from '../components/WishForm';

const WISH_DURATION = 5000;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Wish {
  id: number;
  celebrationId: number;
  name: string | null;
  message: string;
  imageUrl: string | null;
  visitorId: string | null;
  createdAt: string;
}

type ViewMode = 'details' | 'wishes';

const EVENT_EMOJIS: Record<string, string> = {
  birthday: '🎂',
  wedding: '💒',
  babyshower: '👶',
  anniversary: '❤️',
  graduation: '🎓',
  other: '🎉',
};

export default function CelebrationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [hasActivatedConfetti, setHasActivatedConfetti] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const wishesRef = useRef<Wish[]>([]);
  const currentIndexRef = useRef(0);

  const { data: celebration, isLoading: loadingCelebration, refetch: refetchCelebration } = useQuery({
    queryKey: ['celebration', slug],
    queryFn: () => api.celebrations.getBySlug(slug!),
  });

  const isOwner = celebration?.isOwner ?? false;
  const visitorId = getVisitorId();
  const isExpired = celebration && new Date(celebration.expiresAt) < new Date();

  useEffect(() => {
    wishesRef.current = wishes;
  }, [wishes]);

  useEffect(() => {
    if (celebration?.userId) {
      const activated = localStorage.getItem(`confetti_activated_user_${celebration.userId}`);
      if (activated) {
        setHasActivatedConfetti(true);
      }
    }
  }, [celebration?.userId]);

  useEffect(() => {
    if (!celebration?.id) return;

    const loadInitialData = async () => {
      setIsLoadingWishes(true);
      try {
        const [wishesData, activationsData] = await Promise.all([
          api.celebrations.getWishes(celebration.id),
          api.celebrations.getConfettiActivations(celebration.id),
        ]);
        
        setWishes(wishesData);
        setHasInitiallyLoaded(true);

        if (isOwner && activationsData.activations.length > 0) {
          activationsData.activations.forEach((visitorId: string) => {
            const wishIndex = wishesData.findIndex((w: Wish) => w.visitorId === visitorId);
            if (wishIndex !== -1) {
              setTimeout(() => triggerConfettiAtWish(wishIndex), Math.random() * 1000);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setHasInitiallyLoaded(true);
      } finally {
        setIsLoadingWishes(false);
      }
    };

    loadInitialData();

    const eventSource = new EventSource(
      `${API_BASE}/api/celebrations/${celebration.id}/wishes/stream?visitorId=${encodeURIComponent(visitorId)}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'confetti') {
          if (isOwner) {
            const wishIndex = wishesRef.current.findIndex((w) => w.visitorId === data.visitorId);
            if (wishIndex !== -1) {
              triggerConfettiAtWish(wishIndex);
            }
          }
          refetchCelebration();
        } else {
          const newWish: Wish = data;
          setWishes((prev) => {
            if (prev.some((w) => w.id === newWish.id)) {
              return prev;
            }
            setAutoAdvance(false);
            setTimeout(() => setAutoAdvance(true), WISH_DURATION);
            return [...prev, newWish];
          });
        }
      } catch (error) {
        console.error('Failed to parse event:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [celebration?.id, isOwner]);

  const confettiMutation = useMutation({
    mutationFn: () => api.celebrations.addConfetti(celebration!.id),
    onSuccess: () => {
      localStorage.setItem(`confetti_activated_user_${celebration?.userId}`, 'true');
      setHasActivatedConfetti(true);
      refetchCelebration();
      triggerConfetti();
    },
    onError: (error: { error?: string }) => {
      if (error?.error === 'You have already celebrated this creator!') {
        localStorage.setItem(`confetti_activated_user_${celebration?.userId}`, 'true');
        setHasActivatedConfetti(true);
      }
    },
  });

  const triggerConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const triggerConfettiAtWish = useCallback((wishIndex: number) => {
    triggerConfetti();
    setTimeout(() => {
      currentIndexRef.current = wishIndex;
      setCurrentIndex(wishIndex);
      setProgress(0);
    }, 100);
  }, [triggerConfetti]);

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
    }
    
    if (isPaused || !autoAdvance || viewMode !== 'wishes') {
      progressRef.current = null;
      return;
    }

    const intervalId = setInterval(() => {
      const len = wishesRef.current.length;
      if (len === 0) return;
      
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (currentIndexRef.current + 1) % len;
          currentIndexRef.current = nextIndex;
          setCurrentIndex(nextIndex);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    progressRef.current = intervalId;

    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused, autoAdvance, viewMode]);

  const handleTap = (e: React.MouseEvent) => {
    if (viewMode !== 'wishes') return;
    const screenWidth = window.innerWidth;
    const tapX = e.clientX;
    
    if (tapX < screenWidth * 0.3) {
      goToPrev();
    } else if (tapX > screenWidth * 0.7) {
      goToNext();
    }
  };

  if (loadingCelebration) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!celebration) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold">Not Found</h2>
          <p className="text-gray-400 mt-2">Celebration not found or expired</p>
        </div>
      </div>
    );
  }

  const currentWish = wishes[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
      onClick={handleTap}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Tab toggle */}
      <div className="absolute top-4 right-4 z-50 flex bg-white/20 backdrop-blur-sm rounded-full p-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode('details');
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            viewMode === 'details' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
          }`}
        >
          Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode('wishes');
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            viewMode === 'wishes' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
          }`}
        >
          Wishes {wishes.length > 0 && `(${wishes.length})`}
        </button>
      </div>

      {/* Details View */}
      {viewMode === 'details' && (
        <div className="h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="text-8xl mb-6">{EVENT_EMOJIS[celebration.type] || '🎉'}</div>
          <h1 className="text-4xl font-bold text-center mb-2">{celebration.title}</h1>
          <p className="text-xl opacity-90 capitalize mb-8">{celebration.type}</p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center mb-8">
            <p className="text-sm opacity-70 mb-1">Event Date</p>
            <p className="text-lg font-semibold">
              {new Date(celebration.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xl mb-4">
            <span className="text-3xl">🎉</span>
            <span>{celebration.confettiCount} celebrations</span>
          </div>

          {isExpired && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
              <p className="text-sm opacity-80">This celebration has ended</p>
            </div>
          )}

          {!isExpired && !isOwner && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confettiMutation.mutate();
                }}
                disabled={confettiMutation.isPending || hasActivatedConfetti}
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:scale-105 transition shadow-lg disabled:opacity-50"
              >
                {hasActivatedConfetti ? '✨ Celebrated!' : '🎉 Celebrate!'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowForm(true);
                }}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/30 transition"
              >
                ✍️ Leave a Wish
              </button>
            </div>
          )}

          {isOwner && !isExpired && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const shareUrl = window.location.href;
                
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: celebration.title,
                      text: `Join me in celebrating ${celebration.title}!`,
                      url: shareUrl,
                    });
                    return;
                  } catch (err) {
                    if ((err as Error).name === 'AbortError') return;
                  }
                }
                navigator.clipboard.writeText(shareUrl);
              }}
              className="mt-4 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:scale-105 transition shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          )}
        </div>
      )}

      {/* Wishes View */}
      {viewMode === 'wishes' && (
        <>
          {/* Progress bars */}
          <div className="absolute top-16 left-4 right-4 z-40 flex gap-1">
            {wishes.map((_: unknown, i: number) => (
              <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-50"
                  style={{
                    width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Wish content */}
          {isLoadingWishes ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          ) : currentWish ? (
            <div className="h-full flex flex-col items-center justify-center p-8 pt-16 pb-24 text-white">
              {currentWish.imageUrl && (
                <img
                  src={currentWish.imageUrl}
                  alt="Wish"
                  className="w-full max-w-md h-64 object-cover rounded-2xl mb-8 shadow-2xl"
                />
              )}
              <p className="text-2xl font-medium text-center leading-relaxed mb-6 max-w-lg">
                "{currentWish.message}"
              </p>
              <div className="flex items-center gap-3 text-white/80">
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
          ) : hasInitiallyLoaded && wishes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-white">
              <div className="text-8xl mb-6">📝</div>
              <h2 className="text-2xl font-bold mb-2">No wishes yet</h2>
              <p className="text-white/70 mb-6">Be the first to leave a wish!</p>
              {!isExpired && !isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowForm(true);
                  }}
                  className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:scale-105 transition shadow-lg"
                >
                  ✍️ Leave a Wish
                </button>
              )}
            </div>
          ) : null}

          {/* Navigation hints */}
          {wishes.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <div className="w-12 h-12 flex items-center justify-start">
                <div className="text-white/50 text-sm">←</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-end">
                <div className="text-white/50 text-sm">→</div>
              </div>
            </div>
          )}

          {/* Wish counter */}
          {wishes.length > 0 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-white/80 text-sm">
              {currentIndex + 1} / {wishes.length}
            </div>
          )}

          {/* Bottom action */}
          {!isExpired && !isOwner && (
            <div className="absolute bottom-0 left-0 right-0 z-40 p-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowForm(true);
                }}
                className="w-full py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:scale-105 transition shadow-lg"
              >
                ✍️ Leave a Wish
              </button>
            </div>
          )}
        </>
      )}

      {/* Wish form modal */}
      {showForm && (
        <WishForm
          celebrationId={celebration.id}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
