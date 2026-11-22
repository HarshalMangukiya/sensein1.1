import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Administrator' | 'Executive Director' | 'Operations Manager' | string;
  lastLogin: string;
}

interface AdminStore {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,
      adminToken: null,

      login: async (email: string, pass: string) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = pass.trim();

        try {
          const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, pass: cleanPass }),
          });

          const data = await res.json();

          if (res.ok && data.success && data.token) {
            set({
              isAdminAuthenticated: true,
              adminUser: data.user,
              adminToken: data.token,
            });

            if (typeof window !== 'undefined') {
              localStorage.setItem('sensein_admin_jwt', data.token);
            }

            return { success: true };
          }

          return {
            success: false,
            error: data.message || 'Access Denied: Invalid executive email or cryptographic passkey.',
          };
        } catch (err: any) {
          return {
            success: false,
            error: 'Unable to connect to SENSEIN Authentication Gateway. Ensure backend is running.',
          };
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sensein_admin_session');
          localStorage.removeItem('sensein_admin_jwt');
        }
        set({
          isAdminAuthenticated: false,
          adminUser: null,
          adminToken: null,
        });
      },
    }),
    {
      name: 'sensein_admin_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
        adminToken: state.adminToken,
      }),
    }
  )
);

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const directToken = localStorage.getItem('sensein_admin_jwt');
    if (directToken) return directToken;
    const sessionStr = localStorage.getItem('sensein_admin_session');
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      return parsed.state?.adminToken || null;
    }
  } catch (e) {}
  return null;
}
