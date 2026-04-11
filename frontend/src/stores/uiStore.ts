import { create } from 'zustand';

interface UIState {
  showConfetti: boolean;
  currentWishIndex: number;
  isPaused: boolean;
  triggerConfetti: () => void;
  setCurrentWishIndex: (index: number) => void;
  setIsPaused: (paused: boolean) => void;
  nextWish: (maxIndex: number) => void;
  prevWish: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  showConfetti: false,
  currentWishIndex: 0,
  isPaused: false,
  
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },
  
  setCurrentWishIndex: (index: number) => set({ currentWishIndex: index }),
  
  setIsPaused: (paused: boolean) => set({ isPaused: paused }),
  
  nextWish: (maxIndex: number) => {
    const { currentWishIndex } = get();
    if (currentWishIndex < maxIndex) {
      set({ currentWishIndex: currentWishIndex + 1 });
    }
  },
  
  prevWish: () => {
    const { currentWishIndex } = get();
    if (currentWishIndex > 0) {
      set({ currentWishIndex: currentWishIndex - 1 });
    }
  },
}));
