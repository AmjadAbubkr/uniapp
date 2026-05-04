import { authInstance as auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from './firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { User, UserRole } from '@domain/types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await authService.getUserProfile(result.user.uid);
    if (!profile) throw new Error('User profile not found');
    return profile;
  },

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
    return user;
  },

  logout: async (): Promise<void> => {
    await signOut();
  },

  getUserProfile: async (uid: string): Promise<User | null> => {
    const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { id: uid, ...data } as User;
    }
    return null;
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: any) => {
        if (firebaseUser) {
          const user = await authService.getUserProfile(firebaseUser.uid);
          callback(user);
        } else {
          callback(null);
        }
      },
    );
  },
};
