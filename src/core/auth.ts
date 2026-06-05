/**
 * AuthModule — authentication + role enforcement + guards.
 *
 * Deep module: one interface handles login, logout, role checks, and guards.
 * All auth and authorization logic concentrates here. Services and navigation
 * depend on its interface.
 */

import { authInstance as auth, db } from '@data/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@data/firebase';
import { doc, getDoc, setDoc } from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { User, UserRole } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';
import { Errors, DomainError } from '@core/errors';
import { AuditModule, AuditLevel } from '@core/audit';

// ─── Role Hierarchy ──────────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.STUDENT]: 0,
  [UserRole.TEACHER]: 1,
  [UserRole.DEAN]: 2,
  [UserRole.ROOT_ADMIN]: 3,
};

// ─── Auth Module ─────────────────────────────────────────────────────────────

export const AuthModule = {
  /**
   * Login with email and password. Returns user profile.
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await AuthModule.getUserProfile(result.user.uid);

      if (!profile) {
        AuditModule.log(result.user.uid, 'LOGIN_FAILED', result.user.uid, {
          reason: 'Profile not found',
        }, AuditLevel.WARNING);
        throw Errors.authUserNotFound({ uid: result.user.uid });
      }

      AuditModule.log(result.user.uid, 'LOGIN_SUCCESS', result.user.uid);
      return profile;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      AuditModule.log('', 'LOGIN_FAILED', '', { email, reason: String(error) }, AuditLevel.WARNING);
      throw Errors.authInvalidCredentials({ email });
    }
  },

  /**
   * Register a new user account.
   */
  register: async (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    facultyId?: string,
  ): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const user: User = {
      id: result.user.uid,
      email,
      name,
      role,
      facultyId: facultyId || '',
      isActive: true,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), user);

    AuditModule.log(result.user.uid, 'USER_CREATED', result.user.uid, { role, name });
    return user;
  },

  /**
   * Logout current user.
   */
  logout: async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      AuditModule.log(currentUser.uid, 'LOGOUT', currentUser.uid);
    }
    await signOut();
  },

  /**
   * Get user profile from Firestore.
   */
  getUserProfile: async (uid: string): Promise<User | null> => {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (docSnap.exists()) {
      return mapDoc<User>(docSnap.id, docSnap.data());
    }
    return null;
  },

  /**
   * Listen for auth state changes.
   */
  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: any) => {
        if (firebaseUser) {
          const user = await AuthModule.getUserProfile(firebaseUser.uid);
          callback(user);
        } else {
          callback(null);
        }
      },
    );
  },

  // ─── Role Enforcement ──────────────────────────────────────────────────

  /**
   * Check if user has the required role or higher.
   */
  hasRole: (user: User | null, requiredRole: UserRole): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  },

  /**
   * Check if user has exactly the required role.
   */
  hasExactRole: (user: User | null, role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  },

  /**
   * Check if user is admin or higher.
   */
  isAdmin: (user: User | null): boolean => {
    return AuthModule.hasRole(user, UserRole.DEAN);
  },

  /**
   * Check if user is a teacher.
   */
  isTeacher: (user: User | null): boolean => {
    return AuthModule.hasExactRole(user, UserRole.TEACHER);
  },

  /**
   * Check if user is a student.
   */
  isStudent: (user: User | null): boolean => {
    return AuthModule.hasExactRole(user, UserRole.STUDENT);
  },

  // ─── Guards ────────────────────────────────────────────────────────────

  /**
   * Guard: throw if user doesn't have required role.
   * Use in services before performing operations.
   */
  guard: (user: User | null, requiredRole: UserRole): void => {
    if (!AuthModule.hasRole(user, requiredRole)) {
      AuditModule.log(
        user?.id ?? '',
        'ROLE_CHECK_FAILED',
        user?.id ?? '',
        { requiredRole, actualRole: user?.role },
        AuditLevel.WARNING,
      );
      throw Errors.authForbidden(requiredRole, { userId: user?.id });
    }
  },

  /**
   * Guard: throw if user is not active.
   */
  guardActive: (user: User | null): void => {
    if (!user) {
      throw Errors.authUnauthorized();
    }
    if (!user.isActive) {
      throw Errors.userInactive({ userId: user.id });
    }
  },

  /**
   * Guard: throw if user is not authenticated.
   */
  guardAuthenticated: (user: User | null): void => {
    if (!user) {
      throw Errors.authUnauthorized();
    }
  },

  /**
   * Get current Firebase user.
   */
  getCurrentUser: () => auth.currentUser,
};

// ─── Backward Compatibility ──────────────────────────────────────────────────

/**
 * authService — backward-compatible wrapper around AuthModule.
 * Existing code can continue using authService while new code uses AuthModule directly.
 */
export const authService = {
  login: AuthModule.login,
  register: AuthModule.register,
  logout: AuthModule.logout,
  getUserProfile: AuthModule.getUserProfile,
  onAuthChange: AuthModule.onAuthChange,
};
