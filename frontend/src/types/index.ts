export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface Celebration {
  id: number;
  slug: string;
  title: string;
  type: string;
  eventDate: string;
  expiresAt: string;
  coverImage: string | null;
  confettiCount: number;
  createdAt: string;
  userId?: number;
}

export interface Wish {
  id: number;
  celebrationId: number;
  name: string | null;
  message: string;
  imageUrl: string | null;
  visitorId: string | null;
  createdAt: string;
}

export type EventType = 'birthday' | 'wedding' | 'babyshower' | 'anniversary' | 'graduation' | 'other';
