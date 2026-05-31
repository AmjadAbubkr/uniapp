/**
 * authService — backward-compatible wrapper around AuthModule.
 *
 * Existing code can continue using authService while new code uses AuthModule directly.
 * This maintains backward compatibility while the codebase transitions.
 */

import { AuthModule } from '@core/auth';
import { User, UserRole } from '@domain/types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return AuthModule.login(email, password);
  },

  register: async (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    facultyId?: string,
  ): Promise<User> => {
    return AuthModule.register(email, password, role, name, facultyId);
  },

  logout: async (): Promise<void> => {
    return AuthModule.logout();
  },

  getUserProfile: async (uid: string): Promise<User | null> => {
    return AuthModule.getUserProfile(uid);
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    return AuthModule.onAuthChange(callback);
  },

  hasRole: (requiredRole: UserRole): boolean => {
    const user = AuthModule.getCurrentUser();
    return AuthModule.hasRole(user as any, requiredRole);
  },
};
