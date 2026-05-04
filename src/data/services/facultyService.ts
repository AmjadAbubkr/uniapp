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
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Faculty } from '@domain/types';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

export const FacultyService = {
  getAll: async () => {
    const db = getFirestore();
    const snap = await getDocs(collection(db, COLLECTIONS.FACULTIES));
    return snap.docs.map(d => mapDoc<Faculty>(d.id, d.data()));
  },

  create: async (data: Omit<Faculty, 'id' | 'createdAt'>) => {
    const db = getFirestore();
    const ref = await addDoc(collection(db, COLLECTIONS.FACULTIES), {
      ...data,
      createdAt: serverTimestamp(),
    });
    LogService.logAction('', 'FACULTY_CREATED', ref.id, { name: data.name });
    return ref.id;
  },

  delete: async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, COLLECTIONS.FACULTIES, id));
    LogService.logAction('', 'FACULTY_DELETED', id);
  },

  update: async (id: string, data: Partial<Faculty>) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.FACULTIES, id), data);
    LogService.logAction('', 'FACULTY_UPDATED', id);
  },

  assignDean: async (facultyId: string, deanId: string | null) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.FACULTIES, facultyId), { deanId });
    LogService.logAction('', 'FACULTY_DEAN_ASSIGNED', facultyId, { deanId });
  },
};
