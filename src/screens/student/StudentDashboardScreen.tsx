import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';

const StudentDashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user.name}</Text>

      <View style={styles.menu}>
        <Button
          title="My Grades"
          onPress={() => navigation.navigate('MyGrades')}
          color={colors.primary}
        />
        <Button
          title="Announcements"
          onPress={() => navigation.navigate('MyAnnouncements')}
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
  menu: { gap: 12 },
});

export default StudentDashboardScreen;
