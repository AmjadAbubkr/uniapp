import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

import {
  RootStackParamList,
  AuthStackParamList,
  DeanStackParamList,
  TeacherStackParamList,
  StudentStackParamList,
  AdminStackParamList,
} from './types';

import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';

import DeanDashboardScreen from '@screens/dean/DeanDashboardScreen';
import TeachersScreen from '@screens/dean/TeachersScreen';
import StudentsScreen from '@screens/dean/StudentsScreen';
import SubjectsScreen from '@screens/dean/SubjectsScreen';
import EnrollmentsScreen from '@screens/dean/EnrollmentsScreen';
import CSVImportScreen from '@screens/dean/CSVImportScreen';

import TeacherDashboardScreen from '@screens/teacher/TeacherDashboardScreen';
import GradeEntryScreen from '@screens/teacher/GradeEntryScreen';
import AnnouncementsScreen from '@screens/teacher/AnnouncementsScreen';

import StudentDashboardScreen from '@screens/student/StudentDashboardScreen';
import MyGradesScreen from '@screens/student/MyGradesScreen';
import MyAnnouncementsScreen from '@screens/student/MyAnnouncementsScreen';

import AdminDashboardScreen from '@screens/admin/AdminDashboardScreen';
import AuditLogsScreen from '@screens/admin/AuditLogsScreen';
import BackupsScreen from '@screens/admin/BackupsScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const DeanStack = createStackNavigator<DeanStackParamList>();
const TeacherStack = createStackNavigator<TeacherStackParamList>();
const StudentStack = createStackNavigator<StudentStackParamList>();
const AdminStack = createStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surfaceContainer },
  headerTintColor: colors.onSurface,
  headerTitleStyle: Typography.titleLarge,
};

export const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

export const DeanNavigator = () => (
  <DeanStack.Navigator screenOptions={screenOptions}>
    <DeanStack.Screen
      name="DeanDashboard"
      component={DeanDashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <DeanStack.Screen name="Teachers" component={TeachersScreen} />
    <DeanStack.Screen name="Students" component={StudentsScreen} />
    <DeanStack.Screen name="Subjects" component={SubjectsScreen} />
    <DeanStack.Screen name="Enrollments" component={EnrollmentsScreen} />
    <DeanStack.Screen name="CSVImport" component={CSVImportScreen} />
  </DeanStack.Navigator>
);

export const TeacherNavigator = () => (
  <TeacherStack.Navigator screenOptions={screenOptions}>
    <TeacherStack.Screen
      name="TeacherDashboard"
      component={TeacherDashboardScreen}
    />
    <TeacherStack.Screen name="GradeEntry" component={GradeEntryScreen} />
    <TeacherStack.Screen name="Announcements" component={AnnouncementsScreen} />
  </TeacherStack.Navigator>
);

export const StudentNavigator = () => (
  <StudentStack.Navigator screenOptions={screenOptions}>
    <StudentStack.Screen
      name="StudentDashboard"
      component={StudentDashboardScreen}
    />
    <StudentStack.Screen name="MyGrades" component={MyGradesScreen} />
    <StudentStack.Screen
      name="MyAnnouncements"
      component={MyAnnouncementsScreen}
    />
  </StudentStack.Navigator>
);

export const AdminNavigator = () => (
  <AdminStack.Navigator screenOptions={screenOptions}>
    <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <AdminStack.Screen name="AuditLogs" component={AuditLogsScreen} />
    <AdminStack.Screen name="Backups" component={BackupsScreen} />
  </AdminStack.Navigator>
);
