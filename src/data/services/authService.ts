import {
  configureFirebase,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getFirestore,
  collection,
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { User, PendingUser } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';

export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    await configureFirebase();
    const auth = getAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (!userDoc.exists()) throw new Error('User profile not found');
    return mapDoc<User>(uid, userDoc.data());
  },

  register: async (email: string, password: string, pendingUserId: string): Promise<User> => {
    await configureFirebase();
    const db = getFirestore();
    const pendingDoc = await getDoc(doc(db, COLLECTIONS.PENDING_USERS, pendingUserId));
    if (!pendingDoc.exists()) throw new Error('Invitation not found');
    const pendingData = pendingDoc.data() as PendingUser;
    if (pendingData.isRegistered) throw new Error('Invitation already used');

    const auth = getAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    const batch = writeBatch();
    batch.set(doc(db, COLLECTIONS.USERS, uid), {
      id: uid,
      name: pendingData.name,
      role: pendingData.role,
      facultyId: pendingData.facultyId,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, COLLECTIONS.PENDING_USERS, pendingUserId), {
      isRegistered: true,
    });
    await batch.commit();

    return {
      id: uid,
      name: pendingData.name,
      role: pendingData.role,
      facultyId: pendingData.facultyId,
      isActive: true,
      createdAt: Date.now(),
    };
  },

  logout: async () => {
    await configureFirebase();
    const auth = getAuth();
    await signOut();
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    configureFirebase();
    const auth = getAuth();
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
      if (userDoc.exists()) {
        callback(mapDoc<User>(firebaseUser.uid, userDoc.data()));
      } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};
