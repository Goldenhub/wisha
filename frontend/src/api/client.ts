const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
};

const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};

export { getVisitorId };

export const api = {
  auth: {
    register: async (email: string, password: string) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    login: async (email: string, password: string) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    logout: async () => {
      const res = await fetchWithCredentials(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    me: async () => {
      const res = await fetchWithCredentials(`${API_BASE}/api/auth/me`);
      if (!res.ok) throw await res.json();
      return res.json();
    },
  },

  celebrations: {
    create: async (data: { title: string; type: string; eventDate: string; expiresAt: string; coverImage?: string }) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    getBySlug: async (slug: string) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations/${slug}`);
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    getWishes: async (id: number) => {
      const visitorId = getVisitorId();
      const url = `${API_BASE}/api/celebrations/${id}/wishes?visitorId=${encodeURIComponent(visitorId)}`;
      const res = await fetchWithCredentials(url);
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    getConfetti: async (id: number) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations/${id}/confetti`);
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    getConfettiActivations: async (id: number) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations/${id}/confetti/activations`);
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    addConfetti: async (id: number) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations/${id}/confetti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
    
    getMyCelebrations: async () => {
      const res = await fetchWithCredentials(`${API_BASE}/api/celebrations/user/my-celebrations`);
      if (!res.ok) throw await res.json();
      return res.json();
    },
  },

  wishes: {
    create: async (data: { celebrationId: number; name?: string; message: string; imageUrl?: string }) => {
      const res = await fetchWithCredentials(`${API_BASE}/api/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          visitorId: getVisitorId(),
        }),
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
  },

  upload: {
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetchWithCredentials(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw await res.json();
      return res.json();
    },
  },
};
