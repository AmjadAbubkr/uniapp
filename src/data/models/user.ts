import type { Timestamp } from '@react-native-firebase/firestore';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  DEAN = 'dean',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facultyId?: string;
  departmentId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive: boolean;
}

export interface PendingUser {
  name: string;
  email: string;
  role: UserRole;
  facultyId?: string;
  departmentId?: string;
}

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'facultyId' | 'departmentId'>;
