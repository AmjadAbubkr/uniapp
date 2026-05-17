import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { UserService } from '@data/services';
import { UserRole } from '@core/constants/roles';
import { User } from '@domain/types';

const TeachersScreen = () => {
  const { user } = useAuthStore();
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    UserService.getFacultyUsers(user.facultyId, UserRole.TEACHER)
      .then(data => setTeachers(data))
      .catch(() => Alert.alert('Error', 'Failed to load teachers'));
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teachers</Text>
      <FlatList
        data={teachers}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No teachers found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 },
  card: { backgroundColor: colors.surfaceContainerHigh, padding: 16, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.onSurface },
  email: { fontSize: 14, color: colors.onSurfaceVariant },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default TeachersScreen;
