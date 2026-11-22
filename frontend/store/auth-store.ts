import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCartStore } from './cart-store';

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

        // Switch active cart to this specific authenticated user
        try {
          useCartStore.getState().switchUserCart(user.email);
        } catch (e) {}
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sensein_token');
          localStorage.removeItem('sensein_user');
          localStorage.removeItem('sensein_auth_storage');
        }
        set({ user: null, token: null });

        // Save previous user cart and switch to clean guest/empty state
        try {
          useCartStore.getState().switchUserCart(null);
        } catch (e) {}
      },
    }),
    {
      name: 'sensein_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          try {
            const legacyUser = localStorage.getItem('sensein_user');
            const legacyToken = localStorage.getItem('sensein_token');
            if (!state?.user && legacyUser && legacyToken) {
              const parsedUser = JSON.parse(legacyUser);
              state?.setAuth(parsedUser, legacyToken);
            } else if (state?.user) {
              useCartStore.getState().switchUserCart(state.user.email);
            } else {
              useCartStore.getState().switchUserCart(null);
            }
          } catch (e) {}
        }
      },
    }
  )
);
