import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Administrator' | 'Executive Director' | 'Operations Manager';
  lastLogin: string;
}

interface AdminStore {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Pre-authorized Executive Credentials
const VALID_ADMINS = [
  {
    email: 'admin@sensein.com',
    pass: 'sensein2026',
    name: 'Executive Concierge & Director',
    role: 'Super Administrator' as const,
  },
  {
    email: 'admin@sensein.com',
    pass: 'admin123',
    name: 'Executive Concierge & Director',
    role: 'Super Administrator' as const,
  },
  {
    email: 'director@sensein.com',
    pass: 'sensein2026',
    name: 'Alexander Sterling',
    role: 'Executive Director' as const,
  },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,

      login: async (email: string, pass: string) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = pass.trim();

        const match = VALID_ADMINS.find(
          (a) => a.email.toLowerCase() === cleanEmail && a.pass === cleanPass
        );

        if (match) {
          const user: AdminUser = {
            id: 'adm_' + Math.random().toString(36).substring(2, 9),
            name: match.name,
            email: match.email,
            role: match.role,
            lastLogin: new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            }),
          };

          set({
            isAdminAuthenticated: true,
            adminUser: user,
          });

          return { success: true };
        }

        return {
          success: false,
          error: 'Access Denied: Invalid executive email or cryptographic passkey.',
        };
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sensein_admin_session');
        }
        set({
          isAdminAuthenticated: false,
          adminUser: null,
        });
      },
    }),
    {
      name: 'sensein_admin_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
      }),
    }
  )
);
