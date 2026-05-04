import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Announcement } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

export const AnnouncementService = {
  getByFaculty: async (facultyId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.ANNOUNCEMENTS),
      where('facultyId', '==', facultyId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Announcement>(d.id, d.data()));
  },

  getBySubject: async (subjectId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.ANNOUNCEMENTS),
      where('subjectId', '==', subjectId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Announcement>(d.id, d.data()));
  },

  getForStudent: async (facultyId: string) => {
    const db = getFirestore();
    const [faculty, university] = await Promise.all([
      getDocs(query(
        collection(db, COLLECTIONS.ANNOUNCEMENTS),
        where('facultyId', '==', facultyId),
        orderBy('createdAt', 'desc'),
      )),
      getDocs(query(
        collection(db, COLLECTIONS.ANNOUNCEMENTS),
        where('type', '==', 'university'),
        orderBy('createdAt', 'desc'),
      )),
    ]);
    const all = [...faculty.docs, ...university.docs];
    const unique = new Map<string, Announcement>();
    all.forEach(d => unique.set(d.id, mapDoc<Announcement>(d.id, d.data())));
    return Array.from(unique.values()).sort((a, b) => b.createdAt - a.createdAt);
  },

  create: async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const db = getFirestore();
    const ref = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
      ...data,
      createdAt: serverTimestamp(),
    });
    LogService.logAction(data.teacherId, 'ANNOUNCEMENT_CREATED', ref.id, { type: data.type });
    return ref.id;
  },

  delete: async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
    LogService.logAction('', 'ANNOUNCEMENT_DELETED', id);
  },
};
