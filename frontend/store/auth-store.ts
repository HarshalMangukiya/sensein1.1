import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthModalOpen: false,

      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensein_token', token);
          localStorage.setItem('sensein_user', JSON.stringify(user));
        }
        set({ user, token, isAuthModalOpen: false });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sensein_token');
          localStorage.removeItem('sensein_user');
          localStorage.removeItem('sensein_auth_storage');
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: 'sensein_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined' && !state?.user) {
          try {
            const legacyUser = localStorage.getItem('sensein_user');
            const legacyToken = localStorage.getItem('sensein_token');
            if (legacyUser && legacyToken) {
              state?.setAuth(JSON.parse(legacyUser), legacyToken);
            }
          } catch (e) {}
        }
      },
    }
  )
);
