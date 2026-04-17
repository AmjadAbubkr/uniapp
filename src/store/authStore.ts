import { create } from 'zustand';
import { User, UserRole } from '@domain/types';
import { authService } from '@data/auth';

interface AuthState {
  user: User | null;
  is_initialized: boolean;
  is_loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (is_loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    facultyId?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  is_initialized: false,
  is_loading: false,
  error: null,

  setUser: user => set({ user }),
  setLoading: is_loading => set({ is_loading }),
  setError: error => set({ error }),

  initialize: async () => {
    set({ is_loading: true, error: null });
    try {
      authService.onAuthChange(user => {
        set({ user, is_initialized: true, is_loading: false });
      });
    } catch (error: any) {
      set({ error: error.message, is_initialized: true, is_loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ is_loading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, is_loading: false });
    } catch (error: any) {
      set({ error: error.message, is_loading: false });
    }
  },

  register: async (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    facultyId?: string,
  ) => {
    set({ is_loading: true, error: null });
    try {
      const user = await authService.register(
        email,
        password,
        role,
        name,
        facultyId,
      );
      set({ user, is_loading: false });
    } catch (error: any) {
      set({ error: error.message, is_loading: false });
    }
  },

  logout: async () => {
    set({ is_loading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, is_loading: false });
    } catch (error: any) {
      set({ error: error.message, is_loading: false });
    }
  },
}));
