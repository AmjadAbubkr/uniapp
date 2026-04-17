import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { gradeService, announcementService } from '@data/teacher';

const TeacherDashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const [gradesCount, setGradesCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get teacher's subjects and their grades/announcements
      setGradesCount(0);
      setAnnouncementsCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user.name}</Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{gradesCount}</Text>
          <Text style={styles.stat_label}>Grades</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{announcementsCount}</Text>
          <Text style={styles.stat_label}>Announcements</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Button
          title="Grades"
          onPress={() => navigation.navigate('GradeEntry')}
          color={colors.primary}
        />
        <Button
          title="Announcements"
          onPress={() => navigation.navigate('Announcements')}
          color={colors.primary}
        />
        <Button title="Logout" onPress={logout} color={colors.error} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 4,
  },
  welcome: { fontSize: 16, color: colors.onSurfaceVariant, marginBottom: 24 },
  stats: { flexDirection: 'row', marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  stat_number: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  stat_label: { fontSize: 12, color: colors.onSurfaceVariant },
  menu: { gap: 12 },
});

export default TeacherDashboardScreen;
