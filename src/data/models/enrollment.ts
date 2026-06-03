import type { Timestamp } from '@react-native-firebase/firestore';

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  semester: string;
  academicYear: string;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  grade?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  isActive: boolean;
}
