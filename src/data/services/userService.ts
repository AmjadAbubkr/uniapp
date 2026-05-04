import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { User, PendingUser } from '@domain/types';
import { UserRole } from '@core/constants/roles';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

function generateInvitationCode(role: UserRole): string {
  const prefix = role === UserRole.STUDENT ? 'STU' : role === UserRole.TEACHER ? 'TCH' : role === UserRole.DEAN ? 'DEA' : 'ADM';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${prefix}-${code}`;
}

export const UserService = {
  getFacultyUsers: async (facultyId: string, role?: UserRole, activeOnly: boolean = true) => {
    const db = getFirestore();
    const constraints: any[] = [
      where('facultyId', '==', facultyId),
    ];
    if (activeOnly) {
      constraints.push(where('isActive', '==', true));
    }
    if (role) {
      constraints.push(where('role', '==', role));
    }
    const q = query(collection(db, COLLECTIONS.USERS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<User>(d.id, d.data()));
  },

  searchUsers: async (namePrefix: string, facultyId?: string) => {
    const db = getFirestore();
    const nameLower = namePrefix.toLowerCase();
    const nameEnd = nameLower.slice(0, -1) + String.fromCharCode(nameLower.charCodeAt(nameLower.length - 1) + 1);
    const constraints: any[] = [
      where('nameLower', '>=', nameLower),
      where('nameLower', '<', nameEnd),
    ];
    if (facultyId) {
      constraints.push(where('facultyId', '==', facultyId));
    }
    const q = query(collection(db, COLLECTIONS.USERS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<User>(d.id, d.data()));
  },

  getUser: async (uid: string) => {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (!userDoc.exists()) return null;
    return mapDoc<User>(userDoc.id, userDoc.data());
  },

  toggleActive: async (uid: string, isActive: boolean) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), { isActive });
    LogService.logAction(uid, isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', uid);
  },

  createPendingUser: async (data: Omit<PendingUser, 'id' | 'isRegistered' | 'invitationCode'>, createdByUid: string) => {
    const invitationCode = generateInvitationCode(data.role);
    const db = getFirestore();
    const ref = await addDoc(collection(db, COLLECTIONS.PENDING_USERS), {
      ...data,
      invitationCode,
      isRegistered: false,
      createdBy: createdByUid,
    });
    LogService.logAction(createdByUid, 'PENDING_USER_CREATED', ref.id, { role: data.role, name: data.name });
    return { id: ref.id, invitationCode };
  },

  getPendingUserByCode: async (code: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.PENDING_USERS),
      where('invitationCode', '==', code.toUpperCase()),
      where('isRegistered', '==', false),
      limit(1),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return mapDoc<PendingUser>(snap.docs[0].id, snap.docs[0].data());
  },

  getPendingUsers: async (facultyId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.PENDING_USERS),
      where('facultyId', '==', facultyId),
      where('isRegistered', '==', false),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<PendingUser>(d.id, d.data()));
  },

  getAllPendingUsers: async () => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.PENDING_USERS),
      where('isRegistered', '==', false),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<PendingUser>(d.id, d.data()));
  },

  deletePendingUser: async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, COLLECTIONS.PENDING_USERS, id));
    LogService.logAction('', 'PENDING_USER_DELETED', id);
  },

  getAllUsers: async () => {
    const db = getFirestore();
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    return snap.docs.map(d => mapDoc<User>(d.id, d.data()));
  },

  getAllDeans: async () => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('role', '==', UserRole.DEAN),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<User>(d.id, d.data()));
  },

  getUsersByIds: async (ids: string[]): Promise<Record<string, User>> => {
    if (ids.length === 0) return {};
    const db = getFirestore();
    const uniqueIds = [...new Set(ids)];
    const result: Record<string, User> = {};
    const chunkSize = 30;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      const chunk = uniqueIds.slice(i, i + chunkSize);
      const q = query(collection(db, COLLECTIONS.USERS), where('__name__', 'in', chunk));
      const snap = await getDocs(q);
      snap.docs.forEach(d => { result[d.id] = mapDoc<User>(d.id, d.data()); });
    }
    return result;
  },
};
