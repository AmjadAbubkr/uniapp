import { UserRole } from '@core/constants/roles';
export { UserRole };

export interface User {
  id: string; // Firebase Auth UID
  email?: string;
  name: string;
  role: UserRole;
  facultyId: string;
  isActive: boolean;
  createdAt: number; // Storing as number timestamp for simplicity
}

export interface PendingUser {
  id: string; // custom generated unique ID
  name: string;
  role: UserRole;
  facultyId: string;
  createdBy: string; // uid of dean
  isRegistered: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  deanId: string;
  createdAt: number;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
}

export interface Semester {
  id: string;
  name: string;
  academicYearId: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  facultyId: string;
  teacherId: string | null;
  academicYearId: string;
  semesterId: string;
  scheduleText: string;
  isActive: boolean;
  createdAt: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  academicYearId: string;
  semesterId: string;
  isActive: boolean;
  createdAt: number;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  academicYearId: string;
  semesterId: string;

  testScore: number; // out of 20
  examScore: number; // out of 20

  isPublished: boolean;
  conflictFlag: boolean;
  updatedAt: number;
  updatedBy: string; // uid
  createdAt: number;
}

export interface Announcement {
  id: string;
  type: 'subject' | 'faculty' | 'university';
  subjectId: string | null;
  facultyId: string | null;
  teacherId: string;
  message: string;
  expiresAt: number;
  createdAt: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  targetId: string;
  metadata: Record<string, any>;
  createdAt: number;
}
