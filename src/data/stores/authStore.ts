import { create } from 'zustand';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseAuth, db } from '../firebase';
import { COLLECTIONS } from '../collections';
import { UserRole, AuthUser } from '../models/user';
import { getErrorMessage } from '../utils/error';

function toAuthUser(
  firebaseUser: FirebaseAuthTypes.User,
  profile: Record<string, unknown>,
): AuthUser {
  const roleValue = profile.role;
  if (
    typeof roleValue !== 'string' ||
    !Object.values(UserRole).includes(roleValue as UserRole)
  ) {
    throw new Error(`Invalid role in user profile: ${String(roleValue)}`);
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: (profile.name as string) || '',
    role: roleValue as UserRole,
    facultyId: profile.facultyId as string | undefined,
    departmentId: profile.departmentId as string | undefined,
  };
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await firebaseAuth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await db().collection(COLLECTIONS.USERS).doc(firebaseUser.uid).get();

      if (!userDoc.exists) {
        throw new Error('User profile not found');
      }

      const profile = userDoc.data() as Record<string, unknown>;
      set({ user: toAuthUser(firebaseUser, profile), loading: false });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error), loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await firebaseAuth().signOut();
      set({ user: null, error: null });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
    }
  },

  initialize: () => {
    firebaseAuth().onAuthStateChanged(async (firebaseUser: FirebaseAuthTypes.User | null) => {
      if (!firebaseUser) {
        set({ user: null, loading: false });
        return;
      }

      try {
        const userDoc = await db().collection(COLLECTIONS.USERS).doc(firebaseUser.uid).get();
        if (userDoc.exists) {
          const profile = userDoc.data() as Record<string, unknown>;
          set({ user: toAuthUser(firebaseUser, profile), loading: false });
        } else {
          set({ user: null, loading: false });
        }
      } catch {
        set({ user: null, loading: false });
      }
    });
  },
}));
