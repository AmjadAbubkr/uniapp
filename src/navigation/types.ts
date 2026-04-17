export type RootStackParamList = {
  Auth: undefined;
  DeanTabs: undefined;
  TeacherTabs: undefined;
  StudentTabs: undefined;
  AdminTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: { initialRole?: string; facultyId?: string };
};

export type DeanStackParamList = {
  DeanDashboard: undefined;
  Teachers: undefined;
  TeacherDetail: { teacherId: string };
  Students: undefined;
  StudentDetail: { studentId: string };
  Subjects: undefined;
  SubjectDetail: { subjectId: string };
  Enrollments: undefined;
  CSVImport: undefined;
};

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  MySubjects: undefined;
  GradeEntry: { subjectId: string };
  Announcements: undefined;
  CreateAnnouncement: { subjectId?: string };
};

export type StudentStackParamList = {
  StudentDashboard: undefined;
  MyGrades: undefined;
  MyAnnouncements: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageFaculties: undefined;
  ManageDeans: undefined;
  AuditLogs: undefined;
  Backups: undefined;
};
