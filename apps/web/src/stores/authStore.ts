import { create } from 'zustand';
import { UserProfile } from '../types/index';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null, token?: string | null) => void;
  logout: () => void;
  loadStoredAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => {
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        if (token) localStorage.setItem('token', token);
      }
      set({ user, token: token || null, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadStoredAuth: () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser) {
        try {
          set({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
          });
        } catch {
          // Invalid JSON
        }
      }
    }
  },
}));
