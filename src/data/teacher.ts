import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from './firebase';
import { COLLECTIONS } from '@core/constants/collections';
import { Grade, Announcement } from '@domain/types';

// ============ Grade Service ============
export const gradeService = {
  setGrade: async (data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Grade> => {
    const ref = doc(collection(db, COLLECTIONS.GRADES));
    const grade: Grade = {
      id: ref.id,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(ref, grade);
    return grade;
  },

  updateGrade: async (id: string, testScore: number, examScore: number, updatedBy: string): Promise<void> => {
    const grade = await gradeService.getById(id);
    if (grade) {
      const hasConflict = testScore !== grade.testScore || examScore !== grade.examScore;
      await updateDoc(doc(db, COLLECTIONS.GRADES, id), {
        testScore,
        examScore,
        updatedBy,
        updatedAt: Date.now(),
        conflictFlag: hasConflict,
      });
    }
  },

  getBySubject: async (subjectId: string): Promise<Grade[]> => {
    const q = query(collection(db, COLLECTIONS.GRADES), where('subjectId', '==', subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Grade));
  },

  getByStudent: async (studentId: string): Promise<Grade[]> => {
    const q = query(collection(db, COLLECTIONS.GRADES), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Grade));
  },

  getById: async (id: string): Promise<Grade | null> => {
    const docSnap = await getDoc(doc(db, COLLECTIONS.GRADES, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Grade : null;
  },

  publishGrades: async (subjectId: string): Promise<void> => {
    const grades = await gradeService.getBySubject(subjectId);
    for (const grade of grades) {
      await updateDoc(doc(db, COLLECTIONS.GRADES, grade.id), { isPublished: true });
    }
  },
};

// ============ Announcement Service ============
export const announcementService = {
  create: async (data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    const ref = doc(collection(db, COLLECTIONS.ANNOUNCEMENTS));
    const announcement: Announcement = {
      id: ref.id,
      ...data,
      createdAt: Date.now(),
    };
    await setDoc(ref, announcement);
    return announcement;
  },

  getBySubject: async (subjectId: string): Promise<Announcement[]> => {
    const q = query(collection(db, COLLECTIONS.ANNOUNCEMENTS), where('subjectId', '==', subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Announcement));
  },

  getByFaculty: async (facultyId: string): Promise<Announcement[]> => {
    const q = query(collection(db, COLLECTIONS.ANNOUNCEMENTS), where('facultyId', '==', facultyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Announcement));
  },

  getAll: async (): Promise<Announcement[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as Announcement));
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
  },
};