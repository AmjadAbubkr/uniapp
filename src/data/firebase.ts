import firebase from '@react-native-firebase/app';
import authModule from '@react-native-firebase/auth';
import firestoreModule, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import functionsModule from '@react-native-firebase/functions';
import messagingModule from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBxRYz2ZjJJfr_Elvp2Dj_fJUeQ7_X2V7E',
  authDomain: 'uni-app-f2795.firebaseapp.com',
  projectId: 'uni-app-f2795',
  storageBucket: 'uni-app-f2795.firebasestorage.app',
  messagingSenderId: '518230288187',
  appId: '1:518230288187:web:4e24cb041e2ecb1c9a791e',
};

const authInstance = authModule();
const db = firestoreModule();
const functionsInstance = functionsModule();
const messagingInstance = messagingModule();

export default firebase;
export { authInstance, db, functionsInstance, messagingInstance };

export const configureFirebase = async (): Promise<void> => {
  await db.settings({ cacheSizeBytes: 1048576 });
};

export const getFirestore = () => db;
export const getAuth = () => authInstance;

export interface QueryDocSnap {
  id: string;
  data: () => Record<string, any> | undefined;
  ref: any;
  exists: () => boolean;
}

export interface QuerySnap {
  docs: QueryDocSnap[];
  empty: boolean;
  size: number;
}

type CollectionRef = FirebaseFirestoreTypes.CollectionReference;
type DocRef = FirebaseFirestoreTypes.DocumentReference;

export function collection(path: string, ...pathSegments: string[]): CollectionRef;
export function collection(_firestore: any, path: string, ...pathSegments: string[]): CollectionRef;
export function collection(first: any, ...rest: string[]): CollectionRef {
  if (typeof first === 'string') {
    const fullpath = rest.length > 0 ? [first, ...rest].join('/') : first;
    return db.collection(fullpath);
  }
  const fullpath = rest.length > 0 ? [rest[0], ...rest.slice(1)].join('/') : rest[0] || '';
  return db.collection(fullpath);
}

export function doc(path: string, ...pathSegments: string[]): DocRef;
export function doc(collectionRef: CollectionRef): DocRef;
export function doc(_firestore: any, path: string, ...pathSegments: string[]): DocRef;
export function doc(first: any, ...rest: string[]): DocRef {
  if (typeof first === 'string') {
    const fullpath = rest.length > 0 ? [first, ...rest].join('/') : first;
    return db.doc(fullpath);
  }
  return first.doc();
}

export const addDoc = async (collectionRef: CollectionRef, data: Record<string, any>) => {
  const ref = collectionRef.doc();
  await ref.set(data);
  return { id: ref.id };
};

export const setDoc = async (docRef: DocRef, data: Record<string, any>, options?: { merge?: boolean }) => {
  if (options?.merge) {
    await docRef.set(data, { merge: true });
  } else {
    await docRef.set(data);
  }
};

export const updateDoc = async (docRef: DocRef, data: Record<string, any>) => {
  await docRef.update(data);
};

export const deleteDoc = async (docRef: DocRef) => {
  await docRef.delete();
};

export const getDoc = async (docRef: DocRef) => {
  const snap = await docRef.get();
  return {
    exists: () => snap.exists,
    id: snap.id,
    data: () => snap.data(),
    ref: snap.ref,
  };
};

export const getDocs = async (queryOrCollection: any): Promise<QuerySnap> => {
  const snap = await queryOrCollection.get();
  const docs = snap.docs.map((d: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: d.id as string,
    data: () => d.data() as Record<string, any>,
    ref: d.ref,
    exists: () => d.exists,
  }));
  return { docs, empty: snap.empty as boolean, size: snap.size as number };
};

type QueryConstraint = { type: string; field?: string; op?: string; value?: any; direction?: 'asc' | 'desc' };

export const query = (collectionRef: any, ...constraints: QueryConstraint[]) => {
  let q = collectionRef;
  for (const constraint of constraints) {
    if (!constraint || typeof constraint !== 'object') continue;
    switch (constraint.type) {
      case 'where':
        q = q.where(constraint.field, constraint.op, constraint.value);
        break;
      case 'orderBy':
        q = q.orderBy(constraint.field, constraint.direction);
        break;
      case 'limit':
        q = q.limit(constraint.value);
        break;
    }
  }
  return q;
};

export const where = (field: string, op: string, value: any): QueryConstraint => ({
  type: 'where',
  field,
  op,
  value,
});

export const orderBy = (field: string, direction: 'asc' | 'desc' = 'asc'): QueryConstraint => ({
  type: 'orderBy',
  field,
  direction,
});

export const limit = (value: number): QueryConstraint => ({
  type: 'limit',
  value,
});

export const writeBatch = () => db.batch();

export const serverTimestamp = () => firestoreModule.FieldValue.serverTimestamp();

export const signInWithEmailAndPassword = async (_auth: any, email: string, password: string) => {
  const cred = await authInstance.signInWithEmailAndPassword(email, password);
  return { user: cred.user };
};

export const createUserWithEmailAndPassword = async (_auth: any, email: string, password: string) => {
  const cred = await authInstance.createUserWithEmailAndPassword(email, password);
  return { user: cred.user };
};

export const signOut = async () => {
  await authInstance.signOut();
};

export const onAuthStateChanged = (_auth: any, callback: (user: any | null) => void) => {
  return authInstance.onAuthStateChanged(callback);
};
