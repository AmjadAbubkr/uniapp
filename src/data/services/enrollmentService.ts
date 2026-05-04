import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from '@data/firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Enrollment, Subject } from '@domain/types';
import { SubjectService } from './subjectService';
import { mapDoc } from '@core/utils/firestore';
import { LogService } from './logService';

export const EnrollmentService = {
  getBySubject: async (subjectId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.ENROLLMENTS),
      where('subjectId', '==', subjectId),
      where('isActive', '==', true),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Enrollment>(d.id, d.data()));
  },

  getByStudent: async (studentId: string) => {
    const db = getFirestore();
    const q = query(
      collection(db, COLLECTIONS.ENROLLMENTS),
      where('studentId', '==', studentId),
      where('isActive', '==', true),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapDoc<Enrollment>(d.id, d.data()));
  },

  getByFaculty: async (facultyId: string) => {
    const subjects = await SubjectService.getByFaculty(facultyId);
    const subjectIds = subjects.map((s: Subject) => s.id);
    if (subjectIds.length === 0) return [];
    const db = getFirestore();
    const results: Enrollment[] = [];
    const chunkSize = 30;
    for (let i = 0; i < subjectIds.length; i += chunkSize) {
      const chunk = subjectIds.slice(i, i + chunkSize);
      const q = query(
        collection(db, COLLECTIONS.ENROLLMENTS),
        where('subjectId', 'in', chunk),
        where('isActive', '==', true),
      );
      const snap = await getDocs(q);
      snap.docs.forEach(d => results.push(mapDoc<Enrollment>(d.id, d.data())));
    }
    return results;
  },

  create: async (data: Omit<Enrollment, 'id' | 'createdAt'>) => {
    const db = getFirestore();
    const existing = await getDocs(query(
      collection(db, COLLECTIONS.ENROLLMENTS),
      where('studentId', '==', data.studentId),
      where('subjectId', '==', data.subjectId),
      where('isActive', '==', true),
    ));
    if (!existing.empty) throw new Error('Student is already enrolled in this subject');
    const ref = await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), {
      ...data,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    LogService.logAction('', 'ENROLLMENT_CREATED', ref.id, { studentId: data.studentId, subjectId: data.subjectId });
    return ref.id;
  },

  createBatch: async (enrollments: Omit<Enrollment, 'id' | 'createdAt' | 'isActive'>[]) => {
    const db = getFirestore();
    const batch = writeBatch();
    const colRef = collection(db, COLLECTIONS.ENROLLMENTS);
    enrollments.forEach(e => {
      const ref = doc(colRef);
      batch.set(ref, {
        ...e,
        isActive: true,
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
    LogService.logAction('', 'ENROLLMENT_BATCH_CREATED', '', { count: enrollments.length });
  },

  remove: async (id: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, COLLECTIONS.ENROLLMENTS, id), { isActive: false });
    LogService.logAction('', 'ENROLLMENT_REMOVED', id);
  },
};
