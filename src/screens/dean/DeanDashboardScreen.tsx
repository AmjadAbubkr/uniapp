import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import {
  facultyService,
  subjectService,
  userManagementService,
} from '@data/dean';
import { Faculty, Subject, User } from '@domain/types';

const DeanDashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.facultyId) return;
    try {
      const [facultiesData, subjectsData, teachersData] = await Promise.all([
        facultyService.getAll(),
        subjectService.getByFaculty(user.facultyId),
        userManagementService.getTeachers(user.facultyId),
      ]);
      setFaculties(facultiesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dean Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user.name}</Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{faculties.length}</Text>
          <Text style={styles.stat_label}>Faculties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{subjects.length}</Text>
          <Text style={styles.stat_label}>Subjects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{teachers.length}</Text>
          <Text style={styles.stat_label}>Teachers</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Button
          title="Subjects"
          onPress={() => navigation.navigate('Subjects')}
          color={colors.primary}
        />
        <Button
          title="Teachers"
          onPress={() => navigation.navigate('Teachers')}
          color={colors.primary}
        />
        <Button
          title="Students"
          onPress={() => navigation.navigate('Students')}
          color={colors.primary}
        />
        <Button
          title="Enrollments"
          onPress={() => navigation.navigate('Enrollments')}
          color={colors.primary}
        />
        <Button
          title="CSV Import"
          onPress={() => navigation.navigate('CSVImport')}
          color={colors.primary}
        />
        <Button title="Logout" onPress={logout} color={colors.error} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 4,
  },
  welcome: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  stat_number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stat_label: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  menu: {
    gap: 12,
  },
});

export default DeanDashboardScreen;
